const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

if (!apiBaseUrl) {
	throw new Error("VITE_API_BASE_URL is not configured.");
}

export const API_BASE_URL = apiBaseUrl;
