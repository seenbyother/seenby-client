import { ApiError } from "@/shared/api/errors";

export type ApiResponse<TData> = {
	statuscode?: number | string;
	statusCode?: number | string;
	message?: string;
	data?: TData | null;
};

export function unwrapApiData<TData>(
	response: ApiResponse<TData> | TData,
	acceptedStatusCodes: string[] = ["200"],
) {
	if (!isApiResponse(response)) {
		return response;
	}

	ensureApiSuccess(response, acceptedStatusCodes);

	if (response.data === null || response.data === undefined) {
		throw new ApiError(400, response, response.message);
	}

	return response.data;
}

export function ensureApiSuccess<TData>(
	response: ApiResponse<TData>,
	acceptedStatusCodes: string[] = ["200"],
) {
	const statusCode = response.statusCode ?? response.statuscode;

	if (statusCode && !acceptedStatusCodes.includes(String(statusCode))) {
		throw new ApiError(Number(statusCode) || 400, response, response.message);
	}
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
