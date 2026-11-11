import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/shared/analytics";
import {
	ApiError,
	createGenerationRecoveryController,
	type GenerationRecoveryPhase,
} from "@/shared/api";
import type {
	CoverLetterGenerationStatusEvent,
	CoverLetterGenerationStatusResponse,
	CoverLettersResponse,
} from "./api";
import { getCoverLetterGenerationStatus } from "./api";
import { subscribeToCoverLetterGenerationEvents } from "./coverLetterEvents";

const COVER_LETTERS_QUERY_KEY = ["cover-letters"] as const;
type CoverLetterGenerationUpdate = Pick<
	CoverLetterGenerationStatusResponse,
	"status" | "failureReason"
> &
	Partial<Pick<CoverLetterGenerationStatusEvent, "generationVersion">>;

export function useCoverLetterGenerationEvents(
	data: CoverLettersResponse | undefined,
	enabled: boolean,
) {
	const queryClient = useQueryClient();
	const [recoveryById, setRecoveryById] = useState<
		Partial<Record<number, GenerationRecoveryPhase>>
	>({});
	const processingCoverLetterIdsKey = useMemo(
		() =>
			(data?.coverLetters ?? [])
				.filter((coverLetter) => coverLetter.status === "PROCESSING")
				.map((coverLetter) => coverLetter.id)
				.join(","),
		[data],
	);
	const setRecoveryPhase = useCallback(
		(coverLetterId: number, phase: GenerationRecoveryPhase | undefined) => {
			setRecoveryById((current) => {
				if (current[coverLetterId] === phase) return current;

				const next = { ...current };
				if (phase) next[coverLetterId] = phase;
				else delete next[coverLetterId];
				return next;
			});
		},
		[],
	);
	useEffect(() => {
		if (!enabled || !processingCoverLetterIdsKey) {
			setRecoveryById((current) =>
				Object.keys(current).length > 0 ? {} : current,
			);
			return;
		}

		const processingCoverLetterIds = processingCoverLetterIdsKey
			.split(",")
			.map(Number);

		const controllers: Array<
			ReturnType<typeof createGenerationRecoveryController>
		> = [];
		for (const coverLetterId of processingCoverLetterIds) {
			const controller =
				createGenerationRecoveryController<CoverLetterGenerationUpdate>({
					subscribe: (handlers) =>
						subscribeToCoverLetterGenerationEvents(coverLetterId, {
							onOpen: handlers.onOpen,
							onStatus: handlers.onStatus,
							onDeleted: handlers.onDeleted,
							onError: handlers.onError,
						}),
					getStatus: () => getCoverLetterGenerationStatus(coverLetterId),
					onStatus: (update) => {
						const didApply = updateCoverLetterStatus(
							queryClient,
							coverLetterId,
							update,
						);

						if (didApply && update.status === "COMPLETED") {
							trackEvent("cover_letter_generation_completed");
							void Promise.all([
								queryClient.invalidateQueries({
									queryKey: COVER_LETTERS_QUERY_KEY,
								}),
								queryClient.invalidateQueries({
									queryKey: ["cover-letter", coverLetterId],
								}),
							]);
						}

						return didApply;
					},
					onUnavailable: () => undefined,
					onPhaseChange: (phase) => setRecoveryPhase(coverLetterId, phase),
					isNotFoundError: (error) =>
						error instanceof ApiError && error.status === 404,
				});
			controllers.push(controller);
		}

		return () => {
			for (const controller of controllers) controller.dispose();
		};
	}, [enabled, processingCoverLetterIdsKey, queryClient, setRecoveryPhase]);

	return { recoveryById };
}

function updateCoverLetterStatus(
	queryClient: QueryClient,
	coverLetterId: number,
	update: CoverLetterGenerationUpdate,
) {
	const current = queryClient.getQueryData<CoverLettersResponse>(
		COVER_LETTERS_QUERY_KEY,
	);
	if (!current) return false;

	const itemIndex = current.coverLetters.findIndex(
		(coverLetter) => coverLetter.id === coverLetterId,
	);
	if (itemIndex < 0) return false;

	const item = current.coverLetters[itemIndex];
	if (
		update.generationVersion !== undefined &&
		item.generationVersion !== undefined &&
		update.generationVersion < item.generationVersion
	) {
		return false;
	}

	const coverLetters = [...current.coverLetters];
	coverLetters[itemIndex] = {
		...item,
		generationVersion: update.generationVersion ?? item.generationVersion,
		status: update.status,
		failureReason: update.failureReason,
	};
	queryClient.setQueryData<CoverLettersResponse>(COVER_LETTERS_QUERY_KEY, {
		...current,
		coverLetters,
	});

	return true;
}
