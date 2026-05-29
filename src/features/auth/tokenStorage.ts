import type { AuthTokens } from "@/features/auth/api";

const ACCESS_TOKEN_KEY = "seenby.accessToken";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "seenby.accessTokenExpiresAt";

export function saveAuthTokens(tokens: AuthTokens) {
	const expiresAt = Date.now() + tokens.expiresIn * 1000;

	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
}

export function clearAuthTokens() {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
}

export function getAuthorizationHeader() {
	const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

	return accessToken ? `Bearer ${accessToken}` : undefined;
}
