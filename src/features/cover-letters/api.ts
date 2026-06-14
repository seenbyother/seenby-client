import { type ApiResponse, apiClient, unwrapApiData } from "@/shared/api";

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
	status: "PROCESSING" | "COMPLETED" | "FAILED";
	createdAt: string;
	completedAt: string | null;
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
