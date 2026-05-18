interface KeywordChipProps {
	label: string;
	selected: boolean;
	onClick: () => void;
}

export function KeywordChip({ label, selected, onClick }: KeywordChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				"rounded-full px-[14px] py-2 text-[20px] font-medium leading-[150%] cursor-pointer border outline-none transition-colors",
				selected ? "bg-[#0073FF] text-white border-transparent" : "bg-white text-black border-[#EDF0FF]",
			].join(" ")}
		>
			{label}
		</button>
	);
}
