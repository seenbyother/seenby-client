import type { ReactNode } from "react";

type FloatingActionButtonProps = {
	children: ReactNode;
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	className?: string;
	topContent?: ReactNode;
};

const WEBVIEW_MAX_WIDTH = 402;
const SIDE_OFFSET = 20;
const floatingButtonPosition = {
	right: `max(${SIDE_OFFSET}px, calc((100vw - ${WEBVIEW_MAX_WIDTH}px) / 2 + ${SIDE_OFFSET}px))`,
};

export function FloatingActionButton({
	children,
	onClick,
	active = true,
	disabled = false,
	className,
	topContent,
}: FloatingActionButtonProps) {
	const isActive = active && !disabled;

	return (
		<div
			className="fixed bottom-10 z-20 flex flex-col items-end gap-2"
			style={floatingButtonPosition}
		>
			{topContent}
			<button
				type="button"
				onClick={onClick}
				disabled={disabled}
				className={[
					"flex h-[52px] items-center justify-center gap-[10px] rounded-[60px] border-none px-5 text-[16px] font-medium text-[#EDF0FF] cursor-pointer disabled:cursor-not-allowed",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				style={{
					background: isActive ? "#0073FF" : "#A9A9A9",
					boxShadow: "0px 0px 3.1px 1px rgba(0,0,0,0.25)",
				}}
			>
				{children}
			</button>
		</div>
	);
}
