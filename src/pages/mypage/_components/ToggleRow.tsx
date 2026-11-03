import { Switch } from "@/shared/components";

interface ToggleRowProps {
	label: string;
	description: string;
	checked: boolean;
	disabled?: boolean;
	onToggle: (next: boolean) => void;
	errorMessage?: string;
}

export function ToggleRow({
	label,
	description,
	checked,
	disabled = false,
	onToggle,
	errorMessage,
}: ToggleRowProps) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="m-0 text-[15px] font-semibold text-[#222222]">
						{label}
					</p>
					<p className="m-0 mt-0.5 text-[12px] font-medium text-[#71717A]">
						{description}
					</p>
				</div>
				<Switch
					checked={checked}
					disabled={disabled}
					ariaLabel={label}
					onChange={onToggle}
				/>
			</div>
			{errorMessage ? (
				<p className="m-0 text-[12px] font-semibold text-[#D83A40]">
					{errorMessage}
				</p>
			) : null}
		</div>
	);
}
