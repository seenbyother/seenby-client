import { API_BASE_URL, ApiError, apiClient } from "@/shared/api";

type ApiResponse<TData> = {
	statuscode: string;
	message: string;
	data: TData | null;
};

export type AuthTokens = {
	accessToken: string;
	expiresIn: number;
};

const AUTH_CALLBACK_PATH = "/auth/callback";
const tokenExchangeRequests = new Map<string, Promise<AuthTokens>>();

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
	const response = await apiClient.post<ApiResponse<AuthTokens>>(
		"/auth/token",
		{
			body: { code },
			skipAuth: true,
			skipAuthRefresh: true,
		},
	);

	if (!response.data) {
		throw new ApiError(400, response, response.message);
	}

	return response.data;
}

export async function refreshAccessToken() {
	const response = await apiClient.post<ApiResponse<AuthTokens>>(
		"/auth/token/refresh",
		{
			skipAuth: true,
			skipAuthRefresh: true,
		},
	);

	if (!response.data) {
		throw new ApiError(401, response, response.message);
	}

	return response.data;
}
