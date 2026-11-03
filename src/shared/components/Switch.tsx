interface SwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	ariaLabel?: string;
}

export function Switch({
	checked,
	onChange,
	disabled = false,
	ariaLabel,
}: SwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={ariaLabel}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={`relative h-6 w-11 shrink-0 rounded-full border-none p-0 outline-none transition-colors disabled:opacity-40 ${
				checked ? "bg-[#0073FF]" : "bg-[#DDE1E6]"
			}`}
		>
			<span
				aria-hidden="true"
				className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
					checked ? "translate-x-5" : "translate-x-0"
				}`}
			/>
		</button>
	);
}
