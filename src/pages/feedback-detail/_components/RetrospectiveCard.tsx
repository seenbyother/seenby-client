import type { ExperienceFeedback } from "@/pages/feedback-detail/types";

interface RetrospectiveCardProps {
	experienceFeedback: ExperienceFeedback;
	retrospective: string;
	isEditing: boolean;
	onOpen: () => void;
	onToggleEdit: () => void;
}

export function RetrospectiveCard({
	experienceFeedback,
	retrospective,
	isEditing,
	onOpen,
	onToggleEdit,
}: RetrospectiveCardProps) {
	const hasRetrospective = retrospective.trim().length > 0;
	const experienceNumber = experienceFeedback.displayOrder + 1;
	const characterCount = retrospective.length;

	return (
		<article className="rounded-[20px] bg-white p-4">
			<h2 className="m-0 text-center text-[16px] font-bold leading-normal">
				나의 회고 {experienceNumber}
			</h2>
			<div className="mt-5">
				<div className="flex items-start justify-between">
					<p className="m-0 text-[16px] font-semibold leading-[1.252] text-[#656565]">
						경험 {experienceNumber}
					</p>
					<button
						type="button"
						onClick={onToggleEdit}
						className="cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[1.252] text-[#696969] underline underline-offset-2"
					>
						{isEditing ? "저장하기" : "수정하기"}
					</button>
				</div>
				<button
					type="button"
					onClick={onOpen}
					className={[
						"mt-5 flex w-full min-h-[96px] cursor-pointer appearance-none items-start justify-start rounded-xl border-0 p-4 text-left text-[16px] leading-[1.55] text-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#0073FF]/30",
						isEditing ? "min-h-[228px] bg-[#F3F4F6]" : "bg-transparent px-0",
					].join(" ")}
				>
					{hasRetrospective ? (
						<span className="block whitespace-pre-wrap break-keep">
							{retrospective}
						</span>
					) : (
						<span className="block text-[#696969]">-</span>
					)}
				</button>
				<p className="mt-2 mb-0 text-right text-[13px] font-medium leading-none text-[#9CA3AF]">
					{characterCount}자
				</p>
			</div>
		</article>
	);
}
