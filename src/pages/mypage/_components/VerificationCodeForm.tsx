interface VerificationCodeFormProps {
	code: string;
	onCodeChange: (value: string) => void;
	onVerify: () => void;
	verifyDisabled: boolean;
	remainingSeconds: number;
	isExpired: boolean;
	errorMessage?: string;
}

export function VerificationCodeForm({
	code,
	onCodeChange,
	onVerify,
	verifyDisabled,
	remainingSeconds,
	isExpired,
	errorMessage,
}: VerificationCodeFormProps) {
	return (
		<div className="flex flex-col gap-2 rounded-2xl bg-[#F8F8F8] p-3">
			<div className="flex gap-2">
				<input
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					maxLength={6}
					value={code}
					onChange={(event) => onCodeChange(event.target.value)}
					placeholder="인증번호 6자리"
					className="h-12 w-full rounded-xl border-2 border-transparent bg-white px-4 text-[14px] font-medium text-black outline-none placeholder:text-[#9CA3AF] focus:border-[rgba(0,115,255,0.62)]"
				/>
				<button
					type="button"
					onClick={onVerify}
					disabled={verifyDisabled}
					className="h-12 shrink-0 rounded-xl border-0 bg-[#222222] px-4 text-[13px] font-bold text-white disabled:opacity-40"
				>
					확인
				</button>
			</div>
			<p className="m-0 text-[12px] font-medium text-[#71717A]">
				{isExpired
					? "인증번호가 만료됐어요. 재발송해주세요."
					: `남은 시간 ${formatSeconds(remainingSeconds)}`}
			</p>
			{errorMessage ? (
				<p className="m-0 text-[12px] font-semibold text-[#D83A40]">
					{errorMessage}
				</p>
			) : null}
		</div>
	);
}

function formatSeconds(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
