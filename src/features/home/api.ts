import { type ApiResponse, apiClient, unwrapApiData } from "@/shared/api";

export type RankedHomeKeyword = {
	rank: number;
	keyword: string;
};

export type HomeSelfKeyword = {
	keyword: string;
};

export type HomeKeywordSummary = {
	otherKeywords: {
		keywords: RankedHomeKeyword[];
	};
	selfKeywords: {
		keywords: HomeSelfKeyword[];
	};
};

export async function getHomeKeywordSummary() {
	const response = await apiClient.get<
		ApiResponse<HomeKeywordSummary> | HomeKeywordSummary
	>("/home");

	return unwrapApiData(response);
}
