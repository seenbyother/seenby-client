import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";
import type { AnalysisHistoryItem } from "@/features/feedback-groups/api";
import { formatYearMonthDay } from "@/shared/utils/date";

interface AnalysisHistoryCardProps {
	item: AnalysisHistoryItem;
	onClick: () => void;
}

export function AnalysisHistoryCard({ item, onClick }: AnalysisHistoryCardProps) {
	const isProcessing = item.status === "PROCESSING";
	const dateLabel = item.analyzedAt
		? formatYearMonthDay(item.analyzedAt)
		: formatYearMonthDay(item.createdAt);

	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full text-left bg-white rounded-[20px] p-4 flex items-center justify-between gap-2 border-none cursor-pointer"
		>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-3">
					<span className="text-[20px] font-bold leading-tight text-black">
						{item.group.title}
					</span>
					{isProcessing && (
						<span className="w-2.5 h-2.5 rounded-full bg-[#0073FF] flex-shrink-0" />
					)}
				</div>
				<span className="text-[16px] text-black">{dateLabel}</span>
			</div>
			<IcChevronRight />
		</button>
	);
}
