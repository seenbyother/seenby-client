import type { AuthTokens } from "@/features/auth/api";

const ACCESS_TOKEN_KEY = "seenby.accessToken";
const TOKEN_TYPE_KEY = "seenby.tokenType";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "seenby.accessTokenExpiresAt";

export function saveAuthTokens(tokens: AuthTokens) {
	const expiresAt = Date.now() + tokens.expiresIn * 1000;

	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	localStorage.setItem(TOKEN_TYPE_KEY, tokens.tokenType);
	localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
}

export function clearAuthTokens() {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(TOKEN_TYPE_KEY);
	localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
}

export function getAuthorizationHeader() {
	const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
	const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) ?? "Bearer";

	return accessToken ? `${tokenType} ${accessToken}` : undefined;
}
