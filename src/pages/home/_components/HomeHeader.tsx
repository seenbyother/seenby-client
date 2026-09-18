import MyIcon from "@/assets/icons/my.svg?react";

interface HomeHeaderProps {
	onAccountClick: () => void;
}

export function HomeHeader({ onAccountClick }: HomeHeaderProps) {
	return (
		<header className="flex items-center justify-between">
			<h1 className="m-0 text-[24px] font-bold leading-none">SeenBy</h1>
			<button
				type="button"
				aria-label="마이페이지 열기"
				onClick={onAccountClick}
				className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#222222] transition-colors active:bg-black/5"
			>
				<MyIcon width={24} height={24} aria-hidden="true" />
			</button>
		</header>
	);
}
