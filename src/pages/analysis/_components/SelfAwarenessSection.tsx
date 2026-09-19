import { useEffect, useState } from "react";

interface SelfAwarenessSectionProps {
	percentage: number;
	animated?: boolean;
	expanded?: boolean;
}

export function SelfAwarenessSection({
	percentage,
	animated = false,
	expanded = false,
}: SelfAwarenessSectionProps) {
	const size = expanded ? 160 : 93;
	const cx = size / 2;
	const cy = size / 2;
	const r = expanded ? 58 : 32;
	const strokeWidth = expanded ? 16 : 13;
	const fontSize = expanded ? 30 : 16;
	const circumference = 2 * Math.PI * r;
	const dash = circumference * (percentage / 100);
	const dashOffset = circumference - dash;

	const [filled, setFilled] = useState(!animated);

	useEffect(() => {
		if (!animated) {
			return;
		}

		setFilled(false);
		const raf = requestAnimationFrame(() => {
			requestAnimationFrame(() => setFilled(true));
		});

		return () => cancelAnimationFrame(raf);
	}, [animated]);

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
		<div
			className={
				expanded
					? "flex flex-col items-center gap-4 py-2"
					: "flex items-center gap-5"
			}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
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
					{percentage}%
				</text>
			</svg>
			<div
				className={
					expanded
						? "flex flex-col items-center gap-2 text-center"
						: "flex flex-col gap-1"
				}
			>
				<span
					className={
						expanded
							? "text-[18px] font-bold text-black leading-tight"
							: "text-[14px] font-semibold text-black leading-tight"
					}
				>
					{level}
				</span>
				<span
					className={
						expanded
							? "max-w-[260px] text-[14px] text-black/50 leading-relaxed"
							: "text-[14px] text-black/50 leading-relaxed"
					}
				>
					{description}
				</span>
			</div>
		</div>
	);
}
