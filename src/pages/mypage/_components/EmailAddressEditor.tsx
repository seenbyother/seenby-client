import { EMAIL_MAX_LENGTH } from "@/features/notification-settings/validation";

interface EmailAddressEditorProps {
	email: string;
	onEmailChange: (value: string) => void;
	showFormatError: boolean;
	requestLabel: string;
	requestDisabled: boolean;
	onRequestCode: () => void;
	canCancel: boolean;
	onCancel: () => void;
}

export function EmailAddressEditor({
	email,
	onEmailChange,
	showFormatError,
	requestLabel,
	requestDisabled,
	onRequestCode,
	canCancel,
	onCancel,
}: EmailAddressEditorProps) {
	return (
		<div className="flex flex-col gap-2">
			<input
				type="email"
				value={email}
				onChange={(event) => onEmailChange(event.target.value)}
				placeholder="알림 받을 이메일을 입력하세요"
				maxLength={EMAIL_MAX_LENGTH}
				className={`h-12 w-full rounded-xl border-2 bg-[#F3F4F6] px-4 text-[14px] font-medium text-black outline-none placeholder:text-[#9CA3AF] ${
					showFormatError
						? "border-[#D83A40]"
						: "border-transparent focus:border-[rgba(0,115,255,0.62)]"
				}`}
			/>
			{showFormatError ? (
				<p className="m-0 text-[12px] font-semibold text-[#D83A40]">
					올바른 이메일 형식으로 입력해주세요.
				</p>
			) : null}
			<div className="flex gap-2">
				<button
					type="button"
					onClick={onRequestCode}
					disabled={requestDisabled}
					className="h-12 flex-1 rounded-xl border-0 bg-[#0073FF] px-3 text-[13px] font-bold text-white disabled:opacity-40"
				>
					{requestLabel}
				</button>
				{canCancel ? (
					<button
						type="button"
						onClick={onCancel}
						className="h-12 flex-1 rounded-xl border-0 bg-[#F0F2F4] px-3 text-[13px] font-bold text-[#555D67]"
					>
						취소
					</button>
				) : null}
			</div>
		</div>
	);
}
