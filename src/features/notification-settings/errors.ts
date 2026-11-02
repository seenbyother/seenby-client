import { ApiError } from "@/shared/api";

export function getNotificationSettingsErrorCode(
	error: unknown,
): string | undefined {
	if (!(error instanceof ApiError)) {
		return undefined;
	}

	const body = error.body as { statuscode?: unknown } | null;

	return typeof body?.statuscode === "string" ? body.statuscode : undefined;
}

export function getNotificationSettingsErrorMessage(
	error: unknown,
	fallback: string,
) {
	switch (getNotificationSettingsErrorCode(error)) {
		case "860-1":
			return "이메일 인증을 먼저 완료해주세요.";
		case "860-2":
			return "인증번호가 올바르지 않아요. 다시 확인하거나 새 번호를 요청해주세요.";
		case "860-3":
			return "요청이 너무 많아요. 잠시 후 다시 시도해주세요.";
		case "860-4":
			return "메일 발송에 실패했어요. 잠시 후 다시 요청해주세요.";
		case "409-1":
			return "잠시 후 다시 요청해주세요.";
		case "400-1":
		case "400-2":
			return "입력값을 다시 확인해주세요.";
		default:
			return getFallbackErrorMessage(error, fallback);
	}
}

function getFallbackErrorMessage(error: unknown, fallback: string) {
	if (error instanceof ApiError) {
		const body = error.body as { error?: unknown; message?: unknown } | null;

		if (typeof body?.message === "string" && body.message.trim()) {
			return body.message;
		}

		if (typeof body?.error === "string" && body.error.trim()) {
			return body.error;
		}
	}

	if (error instanceof Error && error.message.trim()) {
		return error.message;
	}

	return fallback;
}
