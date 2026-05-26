import { API_BASE_URL } from "@/shared/api/config";
import { ApiError } from "@/shared/api/errors";

type ApiQueryValue = boolean | number | string | null | undefined;
type ApiQuery = Record<string, ApiQueryValue | ApiQueryValue[]>;

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
	body?: unknown;
	query?: ApiQuery;
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
	{ body, headers, query, ...init }: RequestOptions = {},
): Promise<TResponse> {
	const response = await fetch(buildUrl(path, query), {
		...init,
		method,
		headers: {
			Accept: "application/json",
			...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
	const responseBody = await parseResponse(response);

	if (!response.ok) {
		throw new ApiError(response.status, responseBody);
	}

	return responseBody as TResponse;
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
