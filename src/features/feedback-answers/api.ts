import {
	type ApiResponse,
	apiClient,
	ensureApiSuccess,
	unwrapApiData,
} from "@/shared/api";

export type ExperienceFeedback = {
	id: number;
	experience: string;
	feedback: string;
	displayOrder: number;
	retrospect?: string | null;
};

export type FeedbackAnswerDetail = {
	id: number;
	feedbackGroupId: number;
	reviewerName: string;
	experienceCount: number;
	experienceFeedbacks: ExperienceFeedback[];
	keywords: string[];
	submittedAt: string;
	createdAt: string;
};

export async function getFeedbackAnswerDetail(answerId: number) {
	const response = await apiClient.get<
		ApiResponse<FeedbackAnswerDetail> | FeedbackAnswerDetail
	>(`/feedback-answers/${answerId}`);

	return unwrapApiData(response);
}

export async function saveFeedbackRetrospect(
	experienceFeedbackId: number,
	retrospect: string | null,
) {
	const response = await apiClient.put<ApiResponse<null>>(
		`/feedback-retrospects/${experienceFeedbackId}`,
		{
			body: { retrospect },
		},
	);

	ensureApiSuccess(response);
}
