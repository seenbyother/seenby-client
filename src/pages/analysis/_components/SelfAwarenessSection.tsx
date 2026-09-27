import { useStagedReveal } from "./useStagedReveal";

interface SelfAwarenessSectionProps {
	percentage: number;
	animated?: boolean;
}

export function SelfAwarenessSection({
	percentage,
	animated = false,
}: SelfAwarenessSectionProps) {
	const safePercentage = Math.min(100, Math.max(0, percentage));
	const size = 93;
	const cx = size / 2;
	const cy = size / 2;
	const r = 32;
	const strokeWidth = 13;
	const fontSize = 16;
	const circumference = 2 * Math.PI * r;
	const dash = circumference * (safePercentage / 100);
	const dashOffset = circumference - dash;
	const filled = useStagedReveal(animated);

	const level =
		safePercentage >= 70
			? "높은 편이에요"
			: safePercentage >= 40
				? "보통이에요"
				: "낮은 편이에요";
	const description =
		safePercentage >= 70
			? "내가 보는 나와 타인이 보는 내가 꽤 비슷하게 나타났어요"
			: safePercentage >= 40
				? "내가 보는 나와 타인이 보는 내가 어느 정도 비슷해요"
				: "내가 보는 나와 타인이 보는 내가 다소 다르게 나타났어요";

	return (
		<div className="flex items-center gap-5">
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="flex-shrink-0"
				aria-label={`자기 인식 일치도 ${safePercentage}%`}
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
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={filled ? dashOffset : circumference}
					strokeLinecap="round"
					transform={`rotate(-90 ${cx} ${cy})`}
					style={
						animated
							? { transition: "stroke-dashoffset 900ms ease-out" }
							: undefined
					}
				/>
				<text
					x={cx}
					y={cy + fontSize * 0.35}
					textAnchor="middle"
					fontSize={fontSize}
					fontWeight="600"
					fill="#000"
				>
					{safePercentage}%
				</text>
			</svg>
			<div className="flex flex-col gap-1">
				<span className="text-[14px] font-semibold leading-tight text-black">
					{level}
				</span>
				<span className="text-[14px] leading-relaxed text-black/50">
					{description}
				</span>
			</div>
		</div>
	);
}
