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
