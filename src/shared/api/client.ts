import { API_BASE_URL } from "@/shared/api/config";
import { ApiError } from "@/shared/api/errors";

type ApiQueryValue = boolean | number | string | null | undefined;
type ApiQuery = Record<string, ApiQueryValue | ApiQueryValue[]>;
let refreshAccessTokenRequest: Promise<boolean> | null = null;

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
	body?: unknown;
	query?: ApiQuery;
	skipAuthRefresh?: boolean;
};

function buildUrl(path: string, query?: ApiQuery) {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = new URL(`${API_BASE_URL}${normalizedPath}`);

	if (!query) {
		return url;
	}

	for (const [key, value] of Object.entries(query)) {
		const values = Array.isArray(value) ? value : [value];

		for (const item of values) {
			if (item !== null && item !== undefined) {
				url.searchParams.append(key, String(item));
			}
		}
	}

	return url;
}

async function parseResponse(response: Response) {
	if (response.status === 204) {
		return undefined;
	}

	const contentType = response.headers.get("content-type");

	if (contentType?.includes("application/json")) {
		return response.json();
	}

	const text = await response.text();
	return text.length > 0 ? text : undefined;
}

async function request<TResponse>(
	method: string,
	path: string,
	{ body, headers, query, skipAuthRefresh, ...init }: RequestOptions = {},
): Promise<TResponse> {
	const response = await sendRequest(method, path, {
		body,
		headers,
		query,
		...init,
	});
	const responseBody = await parseResponse(response);
	const shouldRefresh =
		isAuthFailureResponse(response, responseBody) &&
		!skipAuthRefresh &&
		!isAuthTokenPath(path);

	if (shouldRefresh && (await refreshStoredAccessToken())) {
		const retryResponse = await sendRequest(method, path, {
			body,
			headers,
			query,
			...init,
		});
		const retryResponseBody = await parseResponse(retryResponse);

		return handleParsedResponse<TResponse>(retryResponse, retryResponseBody);
	}

	return handleParsedResponse<TResponse>(response, responseBody);
}

async function sendRequest(
	method: string,
	path: string,
	{ body, headers, query, ...init }: RequestOptions,
) {
	return fetch(buildUrl(path, query), {
		...init,
		credentials: init.credentials ?? "include",
		method,
		headers: {
			Accept: "application/json",
			...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

function handleParsedResponse<TResponse>(
	response: Response,
	responseBody: unknown,
) {
	if (!response.ok) {
		throw new ApiError(
			response.status,
			responseBody,
			getApiErrorMessage(responseBody),
		);
	}

	return responseBody as TResponse;
}

function getApiErrorMessage(responseBody: unknown) {
	if (typeof responseBody === "string") {
		return responseBody;
	}

	if (!responseBody || typeof responseBody !== "object") {
		return undefined;
	}

	const body = responseBody as {
		error?: unknown;
		message?: unknown;
		statusCode?: unknown;
		statuscode?: unknown;
	};

	if (typeof body.message === "string" && body.message.trim()) {
		return body.message;
	}

	if (typeof body.error === "string" && body.error.trim()) {
		return body.error;
	}

	const statusCode = body.statusCode ?? body.statuscode;
	if (typeof statusCode === "string" && statusCode.trim()) {
		return `API request failed with statusCode ${statusCode}`;
	}

	return undefined;
}

function isAuthTokenPath(path: string) {
	return path === "/auth/token" || path === "/auth/token/refresh";
}

function isAuthFailureResponse(response: Response, responseBody: unknown) {
	return (
		isAuthFailureHttpStatus(response.status) ||
		isAuthFailureBody(responseBody) ||
		isAuthFailureBadRequest(response.status, responseBody)
	);
}

function isAuthFailureBody(responseBody: unknown) {
	const statusCode = getApiStatusCode(responseBody);

	return statusCode !== undefined && isAuthFailureHttpStatus(statusCode);
}

function isFailureBody(responseBody: unknown) {
	const statusCode = getApiStatusCode(responseBody);

	return statusCode !== undefined && statusCode >= 400;
}

function isAuthFailureHttpStatus(status: number) {
	return status === 401 || status === 403;
}

function isAuthFailureBadRequest(status: number, responseBody: unknown) {
	if (status !== 400 && getApiStatusCode(responseBody) !== 400) {
		return false;
	}

	const message = getApiErrorMessage(responseBody);

	if (!message) {
		return false;
	}

	const normalizedMessage = message.toLowerCase();

	return [
		"token",
		"auth",
		"unauthor",
		"forbidden",
		"credential",
		"인증",
		"인가",
		"권한",
		"토큰",
		"승인",
		"로그인",
	].some((keyword) => normalizedMessage.includes(keyword));
}

function getApiStatusCode(responseBody: unknown) {
	if (!responseBody || typeof responseBody !== "object") {
		return undefined;
	}

	const body = responseBody as {
		statusCode?: unknown;
		statuscode?: unknown;
	};
	const statusCode = body.statusCode ?? body.statuscode;

	if (typeof statusCode === "number") {
		return statusCode;
	}

	if (typeof statusCode === "string") {
		const parsedStatusCode = Number(statusCode);

		return Number.isNaN(parsedStatusCode) ? undefined : parsedStatusCode;
	}

	return undefined;
}

async function refreshStoredAccessToken() {
	if (!refreshAccessTokenRequest) {
		refreshAccessTokenRequest = requestAccessTokenRefresh().finally(() => {
			refreshAccessTokenRequest = null;
		});
	}

	return refreshAccessTokenRequest;
}

async function requestAccessTokenRefresh() {
	try {
		const response = await sendRequest("POST", "/auth/token/refresh", {});
		const responseBody = await parseResponse(response);

		if (!response.ok) {
			return false;
		}

		if (isFailureBody(responseBody)) {
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

export const apiClient = {
	get: <TResponse>(path: string, options?: RequestOptions) =>
		request<TResponse>("GET", path, options),
	post: <TResponse>(path: string, options?: RequestOptions) =>
		request<TResponse>("POST", path, options),
	put: <TResponse>(path: string, options?: RequestOptions) =>
		request<TResponse>("PUT", path, options),
	patch: <TResponse>(path: string, options?: RequestOptions) =>
		request<TResponse>("PATCH", path, options),
	delete: <TResponse = void>(path: string, options?: RequestOptions) =>
		request<TResponse>("DELETE", path, options),
};

export type { ApiQuery, RequestOptions };
