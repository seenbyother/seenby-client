import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { subscribeToAnalysisGenerationEvents } from "./analysisEvents";
import type {
	AnalysisGenerationStatusEvent,
	AnalysisHistoryResponse,
} from "./api";

const ANALYSIS_HISTORY_QUERY_KEY = ["analysis-history"] as const;

export function useAnalysisGenerationEvents(
	data: AnalysisHistoryResponse | undefined,
	enabled: boolean,
) {
	const queryClient = useQueryClient();
	const processingAnalysisIdsKey = useMemo(
		() =>
			(data?.analyses ?? [])
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
						void queryClient.invalidateQueries({
							queryKey: ANALYSIS_HISTORY_QUERY_KEY,
						});
					}
				},
				onDeleted: ({ id }) => {
					queryClient.setQueryData<AnalysisHistoryResponse>(
						ANALYSIS_HISTORY_QUERY_KEY,
						(current) => {
							if (!current) return current;

							const analyses = current.analyses.filter(
								(analysis) => analysis.analysisId !== id,
							);
							return analyses.length === current.analyses.length
								? current
								: { ...current, analyses };
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
	const current = queryClient.getQueryData<AnalysisHistoryResponse>(
		ANALYSIS_HISTORY_QUERY_KEY,
	);
	if (!current) return false;

	const itemIndex = current.analyses.findIndex(
		(analysis) => analysis.analysisId === event.id,
	);
	if (itemIndex < 0) return false;

	const analyses = [...current.analyses];
	analyses[itemIndex] = {
		...analyses[itemIndex],
		status: event.status,
		failureReason: event.failureReason,
	};
	queryClient.setQueryData<AnalysisHistoryResponse>(
		ANALYSIS_HISTORY_QUERY_KEY,
		{
			...current,
			analyses,
		},
	);

	return true;
}
