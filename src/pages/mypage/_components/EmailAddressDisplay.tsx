interface EmailAddressDisplayProps {
	email: string | null;
	emailVerified: boolean;
	requestDisabled: boolean;
	onRequestCode: () => void;
	onStartEditing: () => void;
}

export function EmailAddressDisplay({
	email,
	emailVerified,
	requestDisabled,
	onRequestCode,
	onStartEditing,
}: EmailAddressDisplayProps) {
	return (
		<div className="flex items-center justify-between gap-3">
			<p className="m-0 truncate text-[14px] font-semibold text-[#222222]">
				{email}
			</p>
			<div className="flex shrink-0 gap-2">
				{!emailVerified ? (
					<button
						type="button"
						onClick={onRequestCode}
						disabled={requestDisabled}
						className="h-9 shrink-0 rounded-full border-0 bg-[#0073FF] px-3 text-[12px] font-bold text-white disabled:opacity-40"
					>
						인증번호 발송
					</button>
				) : null}
				<button
					type="button"
					onClick={onStartEditing}
					className="h-9 shrink-0 rounded-full border-0 bg-white px-3 text-[12px] font-bold text-[#0073FF]"
				>
					변경
				</button>
			</div>
		</div>
	);
}
