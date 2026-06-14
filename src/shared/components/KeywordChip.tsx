interface KeywordChipProps {
	label: string;
	selected: boolean;
	disabled?: boolean;
	onClick: () => void;
}

export function KeywordChip({
	label,
	selected,
	disabled = false,
	onClick,
}: KeywordChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={[
				"w-fit max-w-full cursor-pointer break-keep rounded-full border px-[14px] py-2 text-[20px] font-medium leading-[150%] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-35",
				selected
					? "bg-[#0073FF] text-white border-transparent"
					: "bg-white text-black border-[#EDF0FF]",
			].join(" ")}
		>
			{label}
		</button>
	);
}
