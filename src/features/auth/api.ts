import { API_BASE_URL, ApiError, apiClient } from "@/shared/api";

type ApiResponse<TData> = {
	statuscode: string;
	message: string;
	data: TData | null;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
	tokenType: "Bearer" | string;
	expiresIn: number;
};

const AUTH_CALLBACK_PATH = "/auth/callback";

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
	const response = await apiClient.post<ApiResponse<AuthTokens>>(
		"/auth/token",
		{
			body: { code },
		},
	);

	if (!response.data) {
		throw new ApiError(400, response, response.message);
	}

	return response.data;
}
