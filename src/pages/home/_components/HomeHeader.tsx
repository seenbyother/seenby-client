import type { ReactNode } from "react";
import AlarmIcon from "@/assets/home/alarm.svg?react";
import MyPageIcon from "@/assets/home/mypage.svg?react";

interface HomeHeaderProps {
	onMyPageClick?: () => void;
	showActions?: boolean;
}

export function HomeHeader({
	onMyPageClick,
	showActions = false,
}: HomeHeaderProps) {
	return (
		<header className="flex items-center justify-between">
			<h1 className="m-0 text-[24px] font-bold leading-none">SeenBy</h1>
			{showActions && (
				<div className="flex items-center gap-2">
					<IconButton ariaLabel="알림">
						<AlarmIcon aria-hidden="true" />
					</IconButton>
					<IconButton ariaLabel="마이페이지" onClick={onMyPageClick}>
						<MyPageIcon aria-hidden="true" />
					</IconButton>
				</div>
			)}
		</header>
	);
}

interface IconButtonProps {
	ariaLabel: string;
	children: ReactNode;
	onClick?: () => void;
}

function IconButton({ ariaLabel, children, onClick }: IconButtonProps) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
			className="flex h-6 w-6 items-center justify-center border-0 bg-transparent p-0 text-[#222222]"
		>
			{children}
		</button>
	);
}
