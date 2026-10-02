import { API_BASE_URL } from "@/shared/api/config";
import { parseJsonServerSentEvent } from "@/shared/api/serverSentEvents";
import type {
	AnalysisDeletedEvent,
	AnalysisGenerationStatus,
	AnalysisGenerationStatusEvent,
} from "./api";

type AnalysisEventHandlers = {
	onStatus: (event: AnalysisGenerationStatusEvent) => void;
	onDeleted: (event: AnalysisDeletedEvent) => void;
};

const ANALYSIS_GENERATION_STATUSES = new Set<AnalysisGenerationStatus>([
	"PROCESSING",
	"COMPLETED",
	"FAILED",
]);

export function subscribeToAnalysisGenerationEvents(
	analysisId: number,
	{ onStatus, onDeleted }: AnalysisEventHandlers,
) {
	const eventSource = new EventSource(
		`${API_BASE_URL}/feedback-groups/analysis/${analysisId}/events`,
		{ withCredentials: true },
	);

	const handleStatus = (event: Event) => {
		const payload = parseStatusEvent(event, analysisId);
		if (!payload) return;

		onStatus(payload);
		if (payload.status !== "PROCESSING") eventSource.close();
	};

	const handleDeleted = (event: Event) => {
		const payload = parseDeletedEvent(event, analysisId);
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
	expectedAnalysisId: number,
): AnalysisGenerationStatusEvent | null {
	const value = parseJsonServerSentEvent(event);
	if (!value) return null;

	const { resourceType, id, status, failureReason } = value;
	if (
		resourceType !== "AI_ANALYSIS" ||
		id !== expectedAnalysisId ||
		typeof status !== "string" ||
		!ANALYSIS_GENERATION_STATUSES.has(status as AnalysisGenerationStatus) ||
		!(failureReason === null || typeof failureReason === "string")
	) {
		return null;
	}

	return {
		resourceType,
		id,
		status: status as AnalysisGenerationStatus,
		failureReason,
	};
}

function parseDeletedEvent(
	event: Event,
	expectedAnalysisId: number,
): AnalysisDeletedEvent | null {
	const value = parseJsonServerSentEvent(event);
	if (!value) return null;

	const { resourceType, id } = value;
	if (resourceType !== "AI_ANALYSIS" || id !== expectedAnalysisId) return null;

	return { resourceType, id };
}
