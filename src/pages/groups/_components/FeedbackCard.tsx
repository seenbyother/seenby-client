import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";

export interface FeedbackItem {
	id: number;
	name: string;
	isReviewed: boolean;
	hasReflection: boolean;
}

interface FeedbackCardProps {
	feedback: FeedbackItem;
	onClick?: () => void;
}

export function FeedbackCard({ feedback, onClick }: FeedbackCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full text-left bg-white rounded-[20px] p-4 border-none cursor-pointer"
		>
			<div className="flex items-center justify-between p-[10px]">
				<div className="flex items-center gap-[10px]">
					<div className="flex items-center gap-[13px]">
						<span className="text-[16px] font-bold text-black leading-tight">
							{feedback.name}님의 피드백
						</span>
						{!feedback.isReviewed && (
							<span className="w-[10px] h-[10px] rounded-full bg-[#0073FF] flex-shrink-0" />
						)}
					</div>
					{feedback.hasReflection && (
						<span
							className="px-2 py-1 rounded-[13px] text-[12px] font-medium flex-shrink-0"
							style={{ background: "rgba(187,187,187,0.25)", color: "rgba(0,0,0,0.5)" }}
						>
							회고 완료
						</span>
					)}
				</div>
				<IcChevronRight className="flex-shrink-0" />
			</div>
		</button>
	);
}
