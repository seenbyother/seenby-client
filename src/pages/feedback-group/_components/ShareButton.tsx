import type { ReactNode } from "react";

interface ShareButtonProps {
	children: ReactNode;
	onClick: () => void;
	variant?: "default" | "kakao";
}

export function ShareButton({
	children,
	onClick,
	variant = "default",
}: ShareButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				"h-14 w-full rounded-lg border-0 px-4 py-[10px] flex items-center justify-center gap-2 cursor-pointer text-[#17181A] text-[15px] font-black leading-[160%] tracking-[-0.02em] transition active:brightness-90",
				variant === "kakao" ? "bg-[#FEE500]" : "bg-white",
			].join(" ")}
		>
			{children}
		</button>
	);
}
