import {
	type InfiniteData,
	type QueryClient,
	useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/shared/analytics";
import {
	ApiError,
	createGenerationRecoveryController,
	type GenerationRecoveryPhase,
} from "@/shared/api";
import { subscribeToAnalysisGenerationEvents } from "./analysisEvents";
import type {
	AnalysisGenerationStatusResponse,
	AnalysisHistoryResponse,
} from "./api";
import { getAnalysisGenerationStatus } from "./api";

const ANALYSIS_HISTORY_QUERY_KEY = ["analysis-history"] as const;

type AnalysisHistoryData = InfiniteData<AnalysisHistoryResponse>;
type AnalysisGenerationUpdate = Pick<
	AnalysisGenerationStatusResponse,
	"status" | "failureReason"
>;

export function useAnalysisGenerationEvents(
	data: AnalysisHistoryData | undefined,
	enabled: boolean,
) {
	const queryClient = useQueryClient();
	const [recoveryById, setRecoveryById] = useState<
		Partial<Record<number, GenerationRecoveryPhase>>
	>({});
	const processingAnalysisIdsKey = useMemo(
		() =>
			(data?.pages ?? [])
				.flatMap((page) => page.analyses)
				.filter((analysis) => analysis.status === "PROCESSING")
				.map((analysis) => analysis.analysisId)
				.join(","),
		[data],
	);
	const setRecoveryPhase = useCallback(
		(analysisId: number, phase: GenerationRecoveryPhase | undefined) => {
			setRecoveryById((current) => {
				if (current[analysisId] === phase) return current;

				const next = { ...current };
				if (phase) next[analysisId] = phase;
				else delete next[analysisId];
				return next;
			});
		},
		[],
	);
	useEffect(() => {
		if (!enabled || !processingAnalysisIdsKey) {
			setRecoveryById((current) =>
				Object.keys(current).length > 0 ? {} : current,
			);
			return;
		}

		const processingAnalysisIds = processingAnalysisIdsKey
			.split(",")
			.map(Number);

		const controllers: Array<
			ReturnType<typeof createGenerationRecoveryController>
		> = [];
		for (const analysisId of processingAnalysisIds) {
			const controller =
				createGenerationRecoveryController<AnalysisGenerationUpdate>({
					subscribe: (handlers) =>
						subscribeToAnalysisGenerationEvents(analysisId, {
							onOpen: handlers.onOpen,
							onStatus: handlers.onStatus,
							onDeleted: handlers.onDeleted,
							onError: handlers.onError,
						}),
					getStatus: () => getAnalysisGenerationStatus(analysisId),
					onStatus: (update) => {
						const didApply = updateAnalysisStatus(
							queryClient,
							analysisId,
							update,
						);

						if (didApply && update.status === "COMPLETED") {
							trackEvent("ai_generation_completed");
							void Promise.all([
								queryClient.invalidateQueries({
									queryKey: ANALYSIS_HISTORY_QUERY_KEY,
								}),
								queryClient.invalidateQueries({
									queryKey: ["analysis-detail", analysisId],
								}),
							]);
						}

						return didApply;
					},
					onUnavailable: () => undefined,
					onPhaseChange: (phase) => setRecoveryPhase(analysisId, phase),
					isNotFoundError: (error) =>
						error instanceof ApiError && error.status === 404,
				});
			controllers.push(controller);
		}

		return () => {
			for (const controller of controllers) controller.dispose();
		};
	}, [enabled, processingAnalysisIdsKey, queryClient, setRecoveryPhase]);

	return { recoveryById };
}

function updateAnalysisStatus(
	queryClient: QueryClient,
	analysisId: number,
	update: AnalysisGenerationUpdate,
) {
	const current = queryClient.getQueryData<AnalysisHistoryData>(
		ANALYSIS_HISTORY_QUERY_KEY,
	);
	if (!current) return false;

	let didApply = false;
	const pages = current.pages.map((page) => {
		const itemIndex = page.analyses.findIndex(
			(analysis) => analysis.analysisId === analysisId,
		);
		if (itemIndex < 0) return page;

		didApply = true;
		const analyses = [...page.analyses];
		analyses[itemIndex] = {
			...analyses[itemIndex],
			status: update.status,
			failureReason: update.failureReason,
		};
		return { ...page, analyses };
	});

	if (!didApply) return false;

	queryClient.setQueryData<AnalysisHistoryData>(ANALYSIS_HISTORY_QUERY_KEY, {
		...current,
		pages,
	});

	return true;
}
