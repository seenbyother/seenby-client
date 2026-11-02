import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getNotificationSettings,
	type NotificationSettings,
	requestNotificationEmailVerification,
	type UpdateNotificationSettingsInput,
	updateNotificationSettings,
	verifyNotificationEmail,
} from "@/features/notification-settings/api";

export const notificationSettingsQueryKey = [
	"me",
	"notification-settings",
] as const;

export function useNotificationSettings() {
	return useQuery({
		queryKey: notificationSettingsQueryKey,
		queryFn: getNotificationSettings,
		retry: false,
	});
}

export function useRequestNotificationEmailVerification() {
	return useMutation({
		mutationFn: requestNotificationEmailVerification,
	});
}

export function useVerifyNotificationEmail() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ requestId, code }: { requestId: string; code: string }) =>
			verifyNotificationEmail(requestId, code),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: notificationSettingsQueryKey,
			});
		},
	});
}

export function useUpdateNotificationSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateNotificationSettings,
		onMutate: async (patch: UpdateNotificationSettingsInput) => {
			await queryClient.cancelQueries({
				queryKey: notificationSettingsQueryKey,
			});

			const previous = queryClient.getQueryData<NotificationSettings>(
				notificationSettingsQueryKey,
			);

			if (previous) {
				queryClient.setQueryData(notificationSettingsQueryKey, {
					...previous,
					...patch,
				});
			}

			return { previous };
		},
		onError: (_error, _patch, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					notificationSettingsQueryKey,
					context.previous,
				);
			}
		},
		onSuccess: (data) => {
			queryClient.setQueryData(notificationSettingsQueryKey, data);
		},
	});
}
