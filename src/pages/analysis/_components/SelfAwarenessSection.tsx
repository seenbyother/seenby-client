interface SelfAwarenessSectionProps {
	percentage: number;
}

export function SelfAwarenessSection({ percentage }: SelfAwarenessSectionProps) {
	const cx = 46.5;
	const cy = 46.5;
	const r = 32;
	const strokeWidth = 13;
	const circumference = 2 * Math.PI * r;
	const dash = circumference * (percentage / 100);

	const level =
		percentage >= 70
			? "높은 편이에요"
			: percentage >= 40
				? "보통이에요"
				: "낮은 편이에요";
	const description =
		percentage >= 70
			? "내가 보는 나와 타인이 보는 내가 꽤 비슷하게 나타났어요"
			: percentage >= 40
				? "내가 보는 나와 타인이 보는 내가 어느 정도 비슷해요"
				: "내가 보는 나와 타인이 보는 내가 다소 다르게 나타났어요";

	return (
		<div className="flex items-center gap-5">
			<svg
				width="93"
				height="93"
				viewBox="0 0 93 93"
				className="flex-shrink-0"
				aria-label={`자기 인식 일치도 ${percentage}%`}
			>
				<circle
					cx={cx}
					cy={cy}
					r={r}
					fill="none"
					stroke="rgba(0,115,255,0.1)"
					strokeWidth={strokeWidth}
				/>
				<circle
					cx={cx}
					cy={cy}
					r={r}
					fill="none"
					stroke="#0073FF"
					strokeWidth={strokeWidth}
					strokeDasharray={`${dash} ${circumference}`}
					strokeLinecap="round"
					transform={`rotate(-90 ${cx} ${cy})`}
				/>
				<text
					x={cx}
					y={cy + 7}
					textAnchor="middle"
					fontSize="16"
					fontWeight="600"
					fill="#000"
				>
					{percentage}%
				</text>
			</svg>
			<div className="flex flex-col gap-1">
				<span className="text-[14px] font-semibold text-black leading-tight">
					{level}
				</span>
				<span className="text-[14px] text-black/50 leading-relaxed">
					{description}
				</span>
			</div>
		</div>
	);
}
