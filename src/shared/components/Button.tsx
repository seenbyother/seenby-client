interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary";
	onClick?: () => void;
	disabled?: boolean;
	type?: "button" | "submit";
}

export function Button({ children, variant = "primary", onClick, disabled = false, type = "button" }: ButtonProps) {
	const base =
		"w-full h-14 rounded-2xl text-[17px] leading-[125.2%] flex items-center justify-center transition border-none outline-none disabled:opacity-40 disabled:cursor-not-allowed active:brightness-90";

	const styles =
		variant === "primary"
			? "bg-[#0073FF] text-white font-semibold cursor-pointer"
			: "bg-[#E5E7EB] text-[#111827] font-medium cursor-pointer";

	return (
		<button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
			{children}
		</button>
	);
}
