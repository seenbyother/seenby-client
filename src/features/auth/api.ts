import { API_BASE_URL, ApiError, apiClient } from "@/shared/api";

type ApiResponse<TData> = {
	statuscode?: string;
	statusCode?: string;
	message?: string;
	data: TData | null;
};

export type AuthTokenMetadata = {
	tokenType: string;
	expiresIn: number;
};

export type CurrentUser = {
	id?: number;
	nickname?: string;
};

const AUTH_CALLBACK_PATH = "/auth/callback";
// TEMP_LOGIN_CODE는 1회용이므로 콜백이 중복 렌더링돼도 같은 코드를 재시도하지 않는다.
const tokenExchangeRequests = new Map<string, Promise<AuthTokenMetadata>>();

export function getAuthCallbackUrl() {
	return `${window.location.origin}${AUTH_CALLBACK_PATH}`;
}

export function getKakaoLoginUrl(redirectUri = getAuthCallbackUrl()) {
	const url = new URL(`${API_BASE_URL}/auth/kakao/login`);
	url.searchParams.set("redirect_uri", redirectUri);

	return url.toString();
}

export function startKakaoLogin() {
	window.location.assign(getKakaoLoginUrl());
}

export async function exchangeKakaoLoginCode(code: string) {
	const pendingRequest = tokenExchangeRequests.get(code);

	if (pendingRequest) {
		return pendingRequest;
	}

	const request = requestKakaoLoginCodeExchange(code);
	tokenExchangeRequests.set(code, request);

	return request;
}

async function requestKakaoLoginCodeExchange(code: string) {
	const response = await apiClient.post<ApiResponse<AuthTokenMetadata>>(
		"/auth/token",
		{
			body: { code },
			skipAuthRefresh: true,
		},
	);

	if (!response.data) {
		throw new ApiError(400, response, response.message);
	}

	return response.data;
}

export async function refreshAccessToken() {
	const response = await apiClient.post<ApiResponse<AuthTokenMetadata>>(
		"/auth/token/refresh",
		{
			skipAuthRefresh: true,
		},
	);

	if (!response.data) {
		throw new ApiError(401, response, response.message);
	}

	return response.data;
}

export async function getCurrentUser() {
	const response = await apiClient.get<ApiResponse<CurrentUser> | CurrentUser>(
		"/me",
	);

	return unwrapApiData(response);
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
