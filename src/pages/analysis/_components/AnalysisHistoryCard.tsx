import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";

interface AnalysisHistoryCardProps {
	title: string;
	dateLabel: string;
	isProcessing?: boolean;
	onClick: () => void;
}

export function AnalysisHistoryCard({
	title,
	dateLabel,
	isProcessing = false,
	onClick,
}: AnalysisHistoryCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full text-left bg-white rounded-[20px] p-4 flex items-center justify-between gap-2 border-none cursor-pointer"
		>
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 items-start gap-3">
					<span className="line-clamp-2 min-w-0 text-[20px] font-bold leading-tight text-black">
						{title}
					</span>
					{isProcessing && (
						<span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#0073FF]" />
					)}
				</div>
				<span className="text-[16px] text-black">{dateLabel}</span>
			</div>
			<IcChevronRight className="shrink-0" />
		</button>
	);
}
