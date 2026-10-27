import { API_BASE_URL } from "@/shared/api/config";
import { parseJsonServerSentEvent } from "@/shared/api/serverSentEvents";
import type {
	CoverLetterDeletedEvent,
	CoverLetterGenerationStatus,
	CoverLetterGenerationStatusEvent,
} from "./api";

type CoverLetterEventHandlers = {
	onStatus: (event: CoverLetterGenerationStatusEvent) => boolean;
	onDeleted: (event: CoverLetterDeletedEvent) => void;
};

const COVER_LETTER_GENERATION_STATUSES = new Set<CoverLetterGenerationStatus>([
	"PROCESSING",
	"COMPLETED",
	"FAILED",
]);

export function subscribeToCoverLetterGenerationEvents(
	coverLetterId: number,
	{ onStatus, onDeleted }: CoverLetterEventHandlers,
) {
	const eventSource = new EventSource(
		`${API_BASE_URL}/cover-letters/${coverLetterId}/events`,
		{ withCredentials: true },
	);

	const handleStatus = (event: Event) => {
		const payload = parseStatusEvent(event, coverLetterId);
		if (!payload) return;

		const isCurrentGeneration = onStatus(payload) !== false;
		if (isCurrentGeneration && payload.status !== "PROCESSING") {
			eventSource.close();
		}
	};

	const handleDeleted = (event: Event) => {
		const payload = parseDeletedEvent(event, coverLetterId);
		if (!payload) return;

		onDeleted(payload);
		eventSource.close();
	};

	eventSource.addEventListener("generation-status", handleStatus);
	eventSource.addEventListener("deleted", handleDeleted);

	return () => {
		eventSource.removeEventListener("generation-status", handleStatus);
		eventSource.removeEventListener("deleted", handleDeleted);
		eventSource.close();
	};
}

function parseStatusEvent(
	event: Event,
	expectedCoverLetterId: number,
): CoverLetterGenerationStatusEvent | null {
	const value = parseJsonServerSentEvent(event);
	if (!value) return null;

	const { resourceType, id, generationVersion, status, failureReason } = value;
	if (
		resourceType !== "COVER_LETTER" ||
		id !== expectedCoverLetterId ||
		typeof generationVersion !== "number" ||
		!Number.isSafeInteger(generationVersion) ||
		generationVersion < 0 ||
		typeof status !== "string" ||
		!COVER_LETTER_GENERATION_STATUSES.has(
			status as CoverLetterGenerationStatus,
		) ||
		!(failureReason === null || typeof failureReason === "string")
	) {
		return null;
	}

	return {
		resourceType,
		id,
		generationVersion,
		status: status as CoverLetterGenerationStatus,
		failureReason,
	};
}

function parseDeletedEvent(
	event: Event,
	expectedCoverLetterId: number,
): CoverLetterDeletedEvent | null {
	const value = parseJsonServerSentEvent(event);
	if (!value) return null;

	const { resourceType, id } = value;
	if (resourceType !== "COVER_LETTER" || id !== expectedCoverLetterId) {
		return null;
	}

	return { resourceType, id };
}
