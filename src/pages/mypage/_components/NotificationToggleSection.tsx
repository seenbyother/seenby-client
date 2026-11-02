import { getNotificationSettingsErrorMessage } from "@/features/notification-settings/errors";
import { useUpdateNotificationSettings } from "@/features/notification-settings/hooks";
import { ToggleRow } from "./ToggleRow";

interface NotificationToggleSectionProps {
	settings: {
		emailVerified: boolean;
		feedbackEmailEnabled: boolean;
		nightEmailEnabled: boolean;
		nightStart: string;
		nightEnd: string;
	};
}

export function NotificationToggleSection({
	settings,
}: NotificationToggleSectionProps) {
	const feedbackToggleMutation = useUpdateNotificationSettings();
	const nightToggleMutation = useUpdateNotificationSettings();

	return (
		<div className="mt-3 flex flex-col gap-4 rounded-3xl bg-white p-5">
			<ToggleRow
				label="답변 알림"
				description="새 피드백 답변이 오면 이메일로 알려드려요"
				checked={settings.feedbackEmailEnabled}
				disabled={!settings.emailVerified || feedbackToggleMutation.isPending}
				onToggle={(next) =>
					feedbackToggleMutation.mutate({ feedbackEmailEnabled: next })
				}
				errorMessage={
					feedbackToggleMutation.isError
						? getNotificationSettingsErrorMessage(
								feedbackToggleMutation.error,
								"설정 변경에 실패했어요.",
							)
						: undefined
				}
			/>
			<div className="h-px bg-[#ECEEF1]" />
			<ToggleRow
				label="야간 수신"
				description={`${settings.nightStart}~${settings.nightEnd}에도 바로 받아요`}
				checked={settings.nightEmailEnabled}
				disabled={nightToggleMutation.isPending}
				onToggle={(next) =>
					nightToggleMutation.mutate({ nightEmailEnabled: next })
				}
				errorMessage={
					nightToggleMutation.isError
						? getNotificationSettingsErrorMessage(
								nightToggleMutation.error,
								"설정 변경에 실패했어요.",
							)
						: undefined
				}
			/>
		</div>
	);
}
