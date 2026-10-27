import {
	type ApiResponse,
	apiClient,
	ensureApiSuccess,
	unwrapApiData,
} from "@/shared/api";

export type CoverLetterDetail = {
	id: number;
	categoryTitle: string;
	coverLetterTitle: string;
	content: string;
	selectedCategory: string;
	feedbackGroupId: number;
	sourceFeedbackCount: number;
	sourceRetrospectCount: number;
	createdAt: string;
	completedAt: string;
};

export type CoverLetterSummary = {
	id: number;
	selectedCategory: string;
	feedbackGroupId: number;
	feedbackGroupName: string;
	status: CoverLetterGenerationStatus;
	generationVersion?: number;
	failureReason?: string | null;
	createdAt: string;
	completedAt: string | null;
};

export type CoverLetterGenerationStatus = "PROCESSING" | "COMPLETED" | "FAILED";

export type CoverLetterGenerationStatusEvent = {
	resourceType: "COVER_LETTER";
	id: number;
	generationVersion: number;
	status: CoverLetterGenerationStatus;
	failureReason: string | null;
};

export type CoverLetterDeletedEvent = {
	resourceType: "COVER_LETTER";
	id: number;
};

export type CoverLettersResponse = {
	coverLetterCount: number;
	coverLetters: CoverLetterSummary[];
};

export async function getCoverLetters() {
	const response = await apiClient.get<
		ApiResponse<CoverLettersResponse> | CoverLettersResponse
	>("/cover-letters");

	return unwrapApiData(response);
}

export async function getCoverLetterDetail(coverLetterId: number) {
	const response = await apiClient.get<
		ApiResponse<CoverLetterDetail> | CoverLetterDetail
	>(`/cover-letters/${coverLetterId}`);

	return unwrapApiData(response);
}

export async function deleteCoverLetter(coverLetterId: number) {
	const response = await apiClient.delete<ApiResponse<null> | undefined>(
		`/cover-letters/${coverLetterId}`,
	);

	if (response) ensureApiSuccess(response, ["200", "204"]);
}
