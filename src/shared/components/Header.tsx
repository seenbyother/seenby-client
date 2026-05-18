import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";

interface HeaderProps {
	onBack: () => void;
}

export function Header({ onBack }: HeaderProps) {
	return (
		<div className="flex items-center px-5 py-[10px] mb-5">
			<button
				type="button"
				onClick={onBack}
				className="bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
				aria-label="뒤로 가기"
			>
				<IcArrowLeft width={32} height={32} />
			</button>
		</div>
	);
}
