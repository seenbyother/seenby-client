import { EmailAddressDisplay } from "./EmailAddressDisplay";
import { EmailAddressEditor } from "./EmailAddressEditor";
import { useEmailVerificationFlow } from "./useEmailVerificationFlow";
import { VerificationCodeForm } from "./VerificationCodeForm";

interface EmailVerificationSectionProps {
	settings: {
		notificationEmail: string | null;
		emailVerified: boolean;
	};
}

export function EmailVerificationSection({
	settings,
}: EmailVerificationSectionProps) {
	const flow = useEmailVerificationFlow({
		notificationEmail: settings.notificationEmail,
	});

	return (
		<div className="flex flex-col gap-3">
			{settings.emailVerified ? (
				<span className="inline-flex w-fit items-center rounded-full bg-[#EEF5FF] px-3 py-1 text-[12px] font-semibold text-[#0073FF]">
					인증 완료
				</span>
			) : (
				<p className="m-0 text-[13px] font-medium text-[#71717A]">
					{settings.notificationEmail
						? "이메일 인증이 필요해요."
						: "알림을 받으려면 이메일을 입력하고 인증해주세요."}
				</p>
			)}

			{flow.showEmailInput ? (
				<EmailAddressEditor
					email={flow.emailInput}
					onEmailChange={flow.onEmailInputChange}
					showFormatError={flow.showEmailFormatError}
					requestLabel={flow.requestLabel}
					requestDisabled={flow.requestDisabled}
					onRequestCode={flow.onRequestCode}
					canCancel={flow.canCancelEditing}
					onCancel={flow.onCancelEditing}
				/>
			) : (
				<EmailAddressDisplay
					email={settings.notificationEmail}
					emailVerified={settings.emailVerified}
					requestDisabled={flow.requestDisabled}
					onRequestCode={flow.onRequestCode}
					onStartEditing={flow.onStartEditing}
				/>
			)}

			{flow.requestErrorMessage ? (
				<p className="m-0 text-[12px] font-semibold text-[#D83A40]">
					{flow.requestErrorMessage}
				</p>
			) : null}

			{flow.verificationStatus === "pending" ? (
				<VerificationCodeForm
					code={flow.code}
					onCodeChange={flow.onCodeChange}
					onVerify={flow.onVerifyCode}
					verifyDisabled={flow.verifyDisabled}
					remainingSeconds={flow.remainingSeconds}
					isExpired={flow.isExpired}
					errorMessage={flow.verifyErrorMessage}
				/>
			) : null}
		</div>
	);
}
