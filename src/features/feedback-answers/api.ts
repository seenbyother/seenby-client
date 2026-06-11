import { ApiError, apiClient } from "@/shared/api";

type ApiResponse<TData> = {
	statuscode?: string;
	statusCode?: string;
	message?: string;
	data?: TData | null;
};

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

function unwrapApiData<TData>(response: ApiResponse<TData> | TData) {
	if (!isApiResponse(response)) {
		return response;
	}

	if (response.data === null || response.data === undefined) {
		throw new ApiError(400, response, response.message);
	}

	return response.data;
}

function ensureApiSuccess<TData>(response: ApiResponse<TData>) {
	const statusCode = response.statusCode ?? response.statuscode;

	if (statusCode && statusCode !== "200") {
		throw new ApiError(Number(statusCode) || 400, response, response.message);
	}
}

function isApiResponse<TData>(
	response: ApiResponse<TData> | TData,
): response is ApiResponse<TData> {
	if (!response || typeof response !== "object") {
		return false;
	}

	return (
		"data" in response || "statusCode" in response || "statuscode" in response
	);
}
