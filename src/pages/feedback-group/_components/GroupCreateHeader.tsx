import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";

interface GroupCreateHeaderProps {
	onBack: () => void;
}

export function GroupCreateHeader({ onBack }: GroupCreateHeaderProps) {
	return (
		<header className="h-[68px] pt-6 flex items-center justify-center px-5 relative shrink-0">
			<button
				type="button"
				onClick={onBack}
				aria-label="뒤로 가기"
				className="absolute left-5 top-[46px] -translate-y-1/2 w-6 h-6 p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center"
			>
				<IcArrowLeft width={24} height={24} />
			</button>
			<h2 className="m-0 text-[20px] font-normal leading-none text-black">
				피드백 그룹 만들기
			</h2>
		</header>
	);
}
