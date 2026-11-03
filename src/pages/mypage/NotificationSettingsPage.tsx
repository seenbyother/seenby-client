import { useNavigate } from "react-router";
import { useNotificationSettings } from "@/features/notification-settings/hooks";
import { Header } from "@/shared/components";
import { EmailVerificationSection } from "./_components/EmailVerificationSection";
import { NotificationToggleSection } from "./_components/NotificationToggleSection";

export function NotificationSettingsPage() {
	const navigate = useNavigate();
	const {
		data: settings,
		isLoading,
		isError,
		refetch,
	} = useNotificationSettings();

	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="mx-auto min-h-screen w-full max-w-[402px] pb-10">
				<Header title="알림 설정" onBack={() => navigate("/mypage")} />

				<div className="flex flex-col gap-5 px-5">
					<section>
						<SectionTitle>알림 이메일</SectionTitle>
						<div className="mt-3 rounded-3xl bg-white p-5">
							{isLoading ? (
								<p className="m-0 text-[14px] text-[#A1A9B2]">불러오는 중...</p>
							) : isError || !settings ? (
								<div className="flex items-center justify-between gap-3">
									<p className="m-0 text-[13px] font-medium text-[#D83A40]">
										설정을 불러오지 못했어요.
									</p>
									<button
										type="button"
										onClick={() => refetch()}
										className="shrink-0 rounded-full border-0 bg-white px-3 py-1.5 text-[12px] font-bold text-[#0073FF]"
									>
										다시 시도
									</button>
								</div>
							) : (
								<EmailVerificationSection settings={settings} />
							)}
						</div>
					</section>

					{settings ? (
						<section>
							<SectionTitle>수신 설정</SectionTitle>
							<NotificationToggleSection settings={settings} />
						</section>
					) : null}
				</div>
			</div>
		</main>
	);
}

function SectionTitle({ children }: { children: string }) {
	return (
		<h2 className="m-0 text-[16px] font-bold text-[#222222]">{children}</h2>
	);
}
