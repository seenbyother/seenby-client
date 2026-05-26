import type { AuthTokens } from "@/features/auth/api";

const ACCESS_TOKEN_KEY = "seenby.accessToken";
const REFRESH_TOKEN_KEY = "seenby.refreshToken";
const TOKEN_TYPE_KEY = "seenby.tokenType";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "seenby.accessTokenExpiresAt";

export function saveAuthTokens(tokens: AuthTokens) {
	const expiresAt = Date.now() + tokens.expiresIn * 1000;

	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
	localStorage.setItem(TOKEN_TYPE_KEY, tokens.tokenType);
	localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
}
