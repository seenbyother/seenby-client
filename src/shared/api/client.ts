import {
	clearAuthTokens,
	getAuthorizationHeader,
	saveAuthTokens,
} from "@/features/auth/tokenStorage";
import { API_BASE_URL } from "@/shared/api/config";
import { ApiError } from "@/shared/api/errors";

type ApiQueryValue = boolean | number | string | null | undefined;
type ApiQuery = Record<string, ApiQueryValue | ApiQueryValue[]>;
type ApiResponse<TData> = {
	statuscode: string;
	message: string;
	data: TData | null;
};
type AuthTokens = {
	accessToken: string;
	expiresIn: number;
};

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
	body?: unknown;
	query?: ApiQuery;
	skipAuth?: boolean;
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
	{
		body,
		headers,
		query,
		skipAuth,
		skipAuthRefresh,
		...init
	}: RequestOptions = {},
): Promise<TResponse> {
	const response = await sendRequest(method, path, {
		body,
		headers,
		query,
		skipAuth,
		...init,
	});
	const shouldRefresh =
		response.status === 401 && !skipAuthRefresh && !isAuthTokenPath(path);

	if (shouldRefresh && (await refreshStoredAccessToken())) {
		const retryResponse = await sendRequest(method, path, {
			body,
			headers,
			query,
			skipAuth,
			...init,
		});

		return handleResponse<TResponse>(retryResponse);
	}

	return handleResponse<TResponse>(response);
}

async function sendRequest(
	method: string,
	path: string,
	{ body, headers, query, skipAuth, ...init }: RequestOptions,
) {
	const authorization = skipAuth ? undefined : getAuthorizationHeader();

	return fetch(buildUrl(path, query), {
		...init,
		credentials: init.credentials ?? "include",
		method,
		headers: {
			Accept: "application/json",
			...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			...(authorization ? { Authorization: authorization } : {}),
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

async function handleResponse<TResponse>(response: Response) {
	const responseBody = await parseResponse(response);

	if (!response.ok) {
		throw new ApiError(response.status, responseBody);
	}

	return responseBody as TResponse;
}

function isAuthTokenPath(path: string) {
	return path === "/auth/token" || path === "/auth/token/refresh";
}

async function refreshStoredAccessToken() {
	try {
		const response = await sendRequest("POST", "/auth/token/refresh", {
			skipAuth: true,
			skipAuthRefresh: true,
		});
		const responseBody = await parseResponse(response);

		if (!response.ok) {
			clearAuthTokens();
			return false;
		}

		const body = responseBody as ApiResponse<AuthTokens>;

		if (!body.data) {
			clearAuthTokens();
			return false;
		}

		saveAuthTokens(body.data);
		return true;
	} catch {
		clearAuthTokens();
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
