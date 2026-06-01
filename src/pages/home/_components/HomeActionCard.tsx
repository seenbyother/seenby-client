import type { ReactNode } from "react";

interface HomeActionCardProps {
	onCreateFeedbackGroup: () => void;
	onCheckIntro: () => void;
}

export function HomeActionCard({
	onCreateFeedbackGroup,
	onCheckIntro,
}: HomeActionCardProps) {
	return (
		<div className="flex flex-col gap-3 rounded-[20px] bg-white p-4">
			<ActionRow
				icon={<LinkIcon />}
				title="피드백 링크 생성하기"
				description="공유하고 나에 대해서 알아보기"
				onClick={onCreateFeedbackGroup}
			/>
			<ActionRow
				icon={<QuoteIcon />}
				title="나의 한줄 소개 확인하기"
				description="이력서/자소서 한줄 소개가 고민이라면"
				onClick={onCheckIntro}
			/>
		</div>
	);
}

interface ActionRowProps {
	icon: ReactNode;
	title: string;
	description: string;
	onClick: () => void;
}

function ActionRow({ icon, title, description, onClick }: ActionRowProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex w-full items-center justify-between rounded-2xl border-0 bg-transparent px-[10px] py-4 text-left transition-colors active:bg-[#F4F4F4]"
		>
			<span className="flex min-w-0 items-center gap-[10px]">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#0073FF]">
					{icon}
				</span>
				<span className="min-w-0">
					<span className="block truncate text-[16px] font-bold leading-normal text-black">
						{title}
					</span>
					<span className="block truncate text-[12px] font-normal leading-normal text-black">
						{description}
					</span>
				</span>
			</span>
			<ChevronRightIcon />
		</button>
	);
}

function LinkIcon() {
	return (
		<svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
			<path
				d="M13.4 10.7h-2.7a5.3 5.3 0 0 0 0 10.6h4"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<path
				d="M18.6 21.3h2.7a5.3 5.3 0 1 0 0-10.6h-4"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<path
				d="M12.8 16h6.4"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function QuoteIcon() {
	return (
		<svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
			<path
				d="M9 12h6v5.1c0 4.1-2 6.5-6 7.3v-3.1c1.7-.5 2.6-1.5 2.7-3.1H9V12Zm11 0h6v5.1c0 4.1-2 6.5-6 7.3v-3.1c1.7-.5 2.6-1.5 2.7-3.1H20V12Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function ChevronRightIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			className="h-6 w-6 shrink-0 text-black/50"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="m9 5 7 7-7 7"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
