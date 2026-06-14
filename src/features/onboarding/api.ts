import {
	ApiError,
	type ApiResponse,
	apiClient,
	unwrapApiData,
} from "@/shared/api";

export const MIN_SELF_KEYWORD_COUNT = 1;

export async function getSelfKeywords() {
	const response = await apiClient.get<ApiResponse<string[]> | string[]>(
		"/me/self-keywords",
	);

	return unwrapApiData(response);
}

export async function saveSelfKeywords(keywords: string[]) {
	validateSelfKeywords(keywords);

	const response = await apiClient.put<ApiResponse<string[]> | string[]>(
		"/me/self-keywords",
		{
			body: keywords,
		},
	);

	return unwrapApiData(response);
}

function validateSelfKeywords(keywords: string[]) {
	if (keywords.length < MIN_SELF_KEYWORD_COUNT) {
		throw new ApiError(400, null, "자기 인식 키워드를 선택해주세요.");
	}

	if (new Set(keywords).size !== keywords.length) {
		throw new ApiError(400, null, "중복된 자기 인식 키워드가 포함되어 있어요.");
	}
}
