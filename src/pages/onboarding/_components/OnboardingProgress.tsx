interface OnboardingProgressProps {
	step: number;
	total: number;
}

export function OnboardingProgress({ step, total }: OnboardingProgressProps) {
	const progress = Math.min(100, Math.max(0, (step / total) * 100));

	return (
		<div className="h-[10px] w-full overflow-hidden rounded-full bg-[#E5E7EB]">
			<div
				className="h-full rounded-full bg-[#0073FF] transition-[width] duration-300"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
