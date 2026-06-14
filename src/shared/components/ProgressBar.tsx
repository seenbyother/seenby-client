interface ProgressBarProps {
	step: number;
	totalSteps?: number;
}

export function ProgressBar({ step, totalSteps = 4 }: ProgressBarProps) {
	const percentage = Math.round((step / totalSteps) * 100);

	return (
		<div className="relative w-full h-[14px] rounded-full bg-[#E5E7EB] overflow-hidden">
			<div
				className="absolute left-0 top-0 h-full bg-[#0073FF] rounded-full transition-all duration-300"
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}
