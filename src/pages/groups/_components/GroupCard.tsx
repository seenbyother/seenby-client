import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";
import type { FeedbackGroup } from "@/features/feedback-groups/api";
import { formatYearMonth, formatYearMonthDay } from "@/shared/utils/date";

export type { FeedbackGroup };

interface GroupCardProps {
	group: FeedbackGroup;
	onClick?: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
	const isActive = group.linkActive;
	const startDate = formatYearMonth(group.createdAt);
	const dateLabel = isActive
		? `${startDate} ~`
		: `${startDate} ~ ${group.endDate ? formatYearMonthDay(group.endDate) : ""}`;

	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full text-left bg-white rounded-[20px] p-4 flex items-center justify-between gap-2 border-none cursor-pointer"
		>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-3">
					<span className="text-[20px] font-bold leading-tight text-black">{group.name}</span>
					{isActive && (
						<span className="w-2.5 h-2.5 rounded-full bg-[#0073FF] flex-shrink-0" />
					)}
				</div>
				<div className="flex items-center gap-2.5">
					<span className="text-[16px] text-black">{group.answerCount}명</span>
					<span className="text-[16px] text-black">{dateLabel}</span>
				</div>
			</div>
			<IcChevronRight />
		</button>
	);
}
