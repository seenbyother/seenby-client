import { ApiError, apiClient } from "@/shared/api";

type ApiResponse<TData> = {
	statuscode?: string;
	statusCode?: string;
	message?: string;
	data?: TData | null;
};

export type FeedbackGroup = {
	id: number;
	name: string;
	relationshipType: string;
	contextType: string;
	linkToken: string;
	linkActive: boolean;
	answerCount: number;
	endDate: string | null;
	createdAt: string;
	updatedAt: string;
};

export type FeedbackGroupsResponse = {
	groupCount: number;
	groups: FeedbackGroup[];
};

export type FeedbackAnswerSummary = {
	id: number;
	feedbackGroupId: number;
	reviewerName: string;
	selected: boolean;
	retrospectiveCompleted: boolean;
	submittedAt: string;
	createdAt: string;
};

export type FeedbackGroupDetail = {
	id: number;
	name: string;
	linkToken: string;
	linkActive: boolean;
	endDate: string | null;
	answers: FeedbackAnswerSummary[];
	createdAt: string;
	updatedAt: string;
};

function unwrapApiData<TData>(response: ApiResponse<TData> | TData) {
	if (!isApiResponse(response)) {
		return response;
	}

	const statusCode = response.statusCode ?? response.statuscode;

	if (statusCode && statusCode !== "200" && statusCode !== "201") {
		throw new ApiError(Number(statusCode) || 400, response, response.message);
	}

	if (response.data === null || response.data === undefined) {
		throw new ApiError(400, response, response.message);
	}

	return response.data;
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

export async function getFeedbackGroups() {
	const response = await apiClient.get<
		ApiResponse<FeedbackGroupsResponse> | FeedbackGroupsResponse
	>("/feedback-groups");

	return unwrapApiData(response);
}

export async function getFeedbackGroupDetail(groupId: number) {
	const response = await apiClient.get<
		ApiResponse<FeedbackGroupDetail> | FeedbackGroupDetail
	>(`/feedback-groups/${groupId}`);

	return unwrapApiData(response);
}

type CreateFeedbackGroupRequest = {
	name: string;
	relationshipType: string;
	contextType: string;
};

export async function createFeedbackGroup(body: CreateFeedbackGroupRequest) {
	const response = await apiClient.post<
		ApiResponse<FeedbackGroup> | FeedbackGroup
	>("/feedback-groups", { body });

	return unwrapApiData(response);
}

export async function updateFeedbackGroupLinkActive(
	groupId: number,
	linkActive: boolean,
) {
	const response = await apiClient.patch<
		ApiResponse<FeedbackGroup> | FeedbackGroup
	>(`/feedback-groups/${groupId}/link-active`, { body: { linkActive } });

	return unwrapApiData(response);
}

export type CreateFeedbackAnalysisRequest = {
	answerIds: number[];
	selfKeywords?: string[];
};

export type FeedbackAnalysisCreateResult = {
	analysisId: number;
};

export type FeedbackCoverLetterCreateResult = {
	id: number;
	status: string;
};

export async function createFeedbackAnalysis(
	groupId: number,
	body: CreateFeedbackAnalysisRequest,
) {
	validateFeedbackAnalysisRequest(groupId, body);

	const response = await apiClient.post<
		ApiResponse<FeedbackAnalysisCreateResult>
	>(`/feedback-groups/${groupId}/analysis`, { body });

	return unwrapApiData(response);
}

export async function createFeedbackCoverLetter(
	groupId: number,
	selfKeywords: string[],
) {
	validateFeedbackCoverLetterRequest(groupId, selfKeywords);

	const response = await apiClient.post<
		ApiResponse<FeedbackCoverLetterCreateResult>
	>(`/feedback-groups/${groupId}/cover-letters`, {
		body: { selfKeywords },
	});

	return unwrapApiData(response);
}

function validateFeedbackAnalysisRequest(
	groupId: number,
	{ answerIds }: CreateFeedbackAnalysisRequest,
) {
	if (!Number.isInteger(groupId) || groupId <= 0) {
		throw new ApiError(400, null, "유효한 피드백 그룹 ID가 필요합니다.");
	}

	if (answerIds.length === 0) {
		throw new ApiError(400, null, "AI 분석할 피드백 응답을 선택해주세요.");
	}

	if (new Set(answerIds).size !== answerIds.length) {
		throw new ApiError(400, null, "중복된 피드백 응답이 포함되어 있습니다.");
	}
}

function validateFeedbackCoverLetterRequest(
	groupId: number,
	selfKeywords: string[],
) {
	if (!Number.isInteger(groupId) || groupId <= 0) {
		throw new ApiError(400, null, "유효한 피드백 그룹 ID가 필요합니다.");
	}

	if (selfKeywords.length === 0) {
		throw new ApiError(400, null, "자기 인식 키워드를 선택해주세요.");
	}
}

export type PublicFeedbackGroup = {
	name: string;
	ownerName: string;
};

export async function getPublicFeedbackGroup(linkToken: string) {
	return apiClient.get<PublicFeedbackGroup>(`/feedback-groups/link/${linkToken}`, {
		skipAuthRefresh: true,
		credentials: "omit",
	});
}

type ExperienceFeedback = {
	experience: string;
	feedback: string;
};

type SubmitFeedbackAnswerRequest = {
	reviewerName: string;
	experienceFeedbacks: ExperienceFeedback[];
	keywords: string[];
};

type SubmitFeedbackAnswerResponse = {
	id: number;
	feedbackGroupId: number;
	reviewerName: string;
	experienceCount: number;
	keywords: string[];
	submittedAt: string;
	createdAt: string;
};

export async function submitPublicFeedbackAnswer(linkToken: string, body: SubmitFeedbackAnswerRequest) {
	return apiClient.post<SubmitFeedbackAnswerResponse>(`/feedback-groups/link/${linkToken}/answers`, {
		body,
		skipAuthRefresh: true,
		credentials: "omit",
	});
}
