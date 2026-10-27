import {
	type InfiniteData,
	type QueryClient,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { trackEvent } from "@/shared/analytics";
import { subscribeToAnalysisGenerationEvents } from "./analysisEvents";
import type {
	AnalysisGenerationStatusEvent,
	AnalysisHistoryResponse,
} from "./api";

const ANALYSIS_HISTORY_QUERY_KEY = ["analysis-history"] as const;

type AnalysisHistoryData = InfiniteData<AnalysisHistoryResponse>;

export function useAnalysisGenerationEvents(
	data: AnalysisHistoryData | undefined,
	enabled: boolean,
) {
	const queryClient = useQueryClient();
	const processingAnalysisIdsKey = useMemo(
		() =>
			(data?.pages ?? [])
				.flatMap((page) => page.analyses)
				.filter((analysis) => analysis.status === "PROCESSING")
				.map((analysis) => analysis.analysisId)
				.join(","),
		[data],
	);

	useEffect(() => {
		if (!enabled || !processingAnalysisIdsKey) return;

		const processingAnalysisIds = processingAnalysisIdsKey
			.split(",")
			.map(Number);

		const closeSubscriptions = processingAnalysisIds.map((analysisId) =>
			subscribeToAnalysisGenerationEvents(analysisId, {
				onStatus: (event) => {
					const didApply = updateAnalysisStatus(queryClient, event);

					if (didApply && event.status === "COMPLETED") {
						trackEvent("ai_generation_completed");
						void queryClient.invalidateQueries({
							queryKey: ANALYSIS_HISTORY_QUERY_KEY,
						});
					}
				},
				onDeleted: ({ id }) => {
					queryClient.setQueryData<AnalysisHistoryData>(
						ANALYSIS_HISTORY_QUERY_KEY,
						(current) => {
							if (!current) return current;

							return {
								...current,
								pages: current.pages.map((page) => ({
									...page,
									analyses: page.analyses.filter(
										(analysis) => analysis.analysisId !== id,
									),
								})),
							};
						},
					);
				},
			}),
		);

		return () => {
			for (const close of closeSubscriptions) close();
		};
	}, [enabled, processingAnalysisIdsKey, queryClient]);
}

function updateAnalysisStatus(
	queryClient: QueryClient,
	event: AnalysisGenerationStatusEvent,
) {
	const current = queryClient.getQueryData<AnalysisHistoryData>(
		ANALYSIS_HISTORY_QUERY_KEY,
	);
	if (!current) return false;

	let didApply = false;
	const pages = current.pages.map((page) => {
		const itemIndex = page.analyses.findIndex(
			(analysis) => analysis.analysisId === event.id,
		);
		if (itemIndex < 0) return page;

		didApply = true;
		const analyses = [...page.analyses];
		analyses[itemIndex] = {
			...analyses[itemIndex],
			status: event.status,
			failureReason: event.failureReason,
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
