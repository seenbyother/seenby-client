import { apiClient } from "@/shared/api";

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

type FeedbackGroupsResponse = {
	groupCount: number;
	groups: FeedbackGroup[];
};

export async function getFeedbackGroups() {
	return apiClient.get<FeedbackGroupsResponse>("/feedback-groups");
}

type CreateFeedbackGroupRequest = {
	name: string;
	relationshipType: string;
	contextType: string;
};

export async function createFeedbackGroup(body: CreateFeedbackGroupRequest) {
	return apiClient.post<FeedbackGroup>("/feedback-groups", { body });
}
