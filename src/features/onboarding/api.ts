import { ApiError, apiClient } from "@/shared/api";

type ApiResponse<TData> = {
	statuscode?: string;
	statusCode?: string;
	message?: string;
	data?: TData | null;
};

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

function unwrapApiData<TData>(response: ApiResponse<TData> | TData) {
	if (!isApiResponse(response)) {
		return response;
	}

	const statusCode = response.statusCode ?? response.statuscode;

	if (statusCode && statusCode !== "200") {
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
