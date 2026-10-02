import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type {
	CoverLetterGenerationStatusEvent,
	CoverLettersResponse,
} from "./api";
import { subscribeToCoverLetterGenerationEvents } from "./coverLetterEvents";

const COVER_LETTERS_QUERY_KEY = ["cover-letters"] as const;

export function useCoverLetterGenerationEvents(
	data: CoverLettersResponse | undefined,
	enabled: boolean,
) {
	const queryClient = useQueryClient();
	const processingCoverLetterIdsKey = useMemo(
		() =>
			(data?.coverLetters ?? [])
				.filter((coverLetter) => coverLetter.status === "PROCESSING")
				.map((coverLetter) => coverLetter.id)
				.join(","),
		[data],
	);

	useEffect(() => {
		if (!enabled || !processingCoverLetterIdsKey) return;

		const processingCoverLetterIds = processingCoverLetterIdsKey
			.split(",")
			.map(Number);

		const closeSubscriptions = processingCoverLetterIds.map((coverLetterId) =>
			subscribeToCoverLetterGenerationEvents(coverLetterId, {
				onStatus: (event) => {
					const didApply = updateCoverLetterStatus(queryClient, event);

					if (didApply && event.status === "COMPLETED") {
						void queryClient.invalidateQueries({
							queryKey: COVER_LETTERS_QUERY_KEY,
						});
					}

					return didApply;
				},
				onDeleted: ({ id }) => {
					queryClient.setQueryData<CoverLettersResponse>(
						COVER_LETTERS_QUERY_KEY,
						(current) => {
							if (!current) return current;

							const coverLetters = current.coverLetters.filter(
								(coverLetter) => coverLetter.id !== id,
							);
							if (coverLetters.length === current.coverLetters.length) {
								return current;
							}

							return {
								...current,
								coverLetterCount: Math.max(0, current.coverLetterCount - 1),
								coverLetters,
							};
						},
					);
				},
			}),
		);

		return () => {
			for (const close of closeSubscriptions) close();
		};
	}, [enabled, processingCoverLetterIdsKey, queryClient]);
}

function updateCoverLetterStatus(
	queryClient: QueryClient,
	event: CoverLetterGenerationStatusEvent,
) {
	const current = queryClient.getQueryData<CoverLettersResponse>(
		COVER_LETTERS_QUERY_KEY,
	);
	if (!current) return false;

	const itemIndex = current.coverLetters.findIndex(
		(coverLetter) => coverLetter.id === event.id,
	);
	if (itemIndex < 0) return false;

	const item = current.coverLetters[itemIndex];
	if (
		item.generationVersion !== undefined &&
		event.generationVersion < item.generationVersion
	) {
		return false;
	}

	const coverLetters = [...current.coverLetters];
	coverLetters[itemIndex] = {
		...item,
		generationVersion: event.generationVersion,
		status: event.status,
		failureReason: event.failureReason,
	};
	queryClient.setQueryData<CoverLettersResponse>(COVER_LETTERS_QUERY_KEY, {
		...current,
		coverLetters,
	});

	return true;
}
