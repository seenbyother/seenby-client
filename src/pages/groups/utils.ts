import { ApiError } from "@/shared/api";

export function getErrorMessage(error: unknown, fallback: string) {
	if (error instanceof ApiError) {
		const body = error.body as { error?: unknown; message?: unknown };

		if (typeof body?.message === "string" && body.message.trim()) {
			return body.message;
		}

		if (typeof body?.error === "string" && body.error.trim()) {
			return body.error;
		}
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallback;
}
