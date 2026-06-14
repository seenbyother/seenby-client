import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";

interface HeaderProps {
	onBack: () => void;
	title?: string;
	withBottomSpacing?: boolean;
}

export function Header({
	onBack,
	title,
	withBottomSpacing = true,
}: HeaderProps) {
	return (
		<header
			className={`relative flex h-16 items-center justify-center px-5${withBottomSpacing ? " mb-5" : ""}`}
		>
			<button
				type="button"
				onClick={onBack}
				className="absolute left-5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
				aria-label="뒤로 가기"
			>
				<IcArrowLeft width={32} height={32} />
			</button>
			{title ? (
				<h1 className="m-0 text-[20px] font-normal leading-normal text-black">
					{title}
				</h1>
			) : null}
		</header>
	);
}
