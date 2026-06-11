import { ApiError, apiClient } from "@/shared/api";

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

type ApiResponse<TData> = {
	statuscode?: string;
	statusCode?: string;
	message?: string;
	data?: TData | null;
};

function unwrapApiData<TData>(response: ApiResponse<TData> | TData) {
	if (!isApiResponse(response)) {
		return response;
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

	return "data" in response || "statusCode" in response || "statuscode" in response;
}

export async function getFeedbackGroups() {
	const response =
		await apiClient.get<ApiResponse<FeedbackGroupsResponse> | FeedbackGroupsResponse>(
			"/feedback-groups",
		);

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
	const response = await apiClient.post<ApiResponse<FeedbackGroup> | FeedbackGroup>(
		"/feedback-groups",
		{ body },
	);

	return unwrapApiData(response);
}

export async function updateFeedbackGroupLinkActive(
	groupId: number,
	linkActive: boolean,
) {
	const response = await apiClient.patch<ApiResponse<FeedbackGroup> | FeedbackGroup>(
		`/feedback-groups/${groupId}/link-active`,
		{ body: { linkActive } },
	);

	return unwrapApiData(response);
}
