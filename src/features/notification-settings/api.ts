import {
	type ApiResponse,
	apiClient,
	ensureApiSuccess,
	unwrapApiData,
} from "@/shared/api";

export type NotificationEmailVerificationRequest = {
	requestId: string;
	expiresAt: string;
	resendAfterSeconds: number;
};

export type NotificationSettings = {
	notificationEmail: string | null;
	emailVerified: boolean;
	feedbackEmailEnabled: boolean;
	nightEmailEnabled: boolean;
	timezone: string;
	nightStart: string;
	nightEnd: string;
};

export type UpdateNotificationSettingsInput = Partial<{
	feedbackEmailEnabled: boolean;
	nightEmailEnabled: boolean;
}>;

export async function requestNotificationEmailVerification(email: string) {
	const response = await apiClient.post<
		ApiResponse<NotificationEmailVerificationRequest>
	>("/me/notification-email/verification-requests", {
		body: { email },
	});

	return unwrapApiData(response);
}

export async function verifyNotificationEmail(
	requestId: string,
	code: string,
): Promise<void> {
	const response = await apiClient.post<ApiResponse<null>>(
		"/me/notification-email/verify",
		{
			body: { requestId, code },
		},
	);

	ensureApiSuccess(response);
}

export async function getNotificationSettings() {
	const response = await apiClient.get<
		ApiResponse<NotificationSettings> | NotificationSettings
	>("/me/notification-settings");

	return unwrapApiData(response);
}

export async function updateNotificationSettings(
	settings: UpdateNotificationSettingsInput,
) {
	const response = await apiClient.patch<ApiResponse<NotificationSettings>>(
		"/me/notification-settings",
		{
			body: settings,
		},
	);

	return unwrapApiData(response);
}
