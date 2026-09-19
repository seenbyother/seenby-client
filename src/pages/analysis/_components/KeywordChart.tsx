import { useEffect, useState } from "react";
import type { AnalysisKeyword } from "@/features/feedback-groups/api";

interface KeywordChartProps {
	keywords: AnalysisKeyword[];
	animated?: boolean;
}

export function KeywordChart({
	keywords,
	animated = false,
}: KeywordChartProps) {
	const maxCount = Math.max(...keywords.map((k) => k.count), 1);
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

	return (
		<div className="flex flex-col gap-[10px]">
			{keywords.map((item, index) => (
				<div key={item.rank} className="flex items-center gap-2">
					<span className="text-[14px] text-black/70 w-20 text-right flex-shrink-0">
						{item.keyword}
					</span>
					<div className="flex-1 h-[21px] rounded-[4px] overflow-hidden bg-gray-100">
						<div
							className="h-full rounded-[4px] transition-[width] duration-700 ease-out"
							style={{
								width: filled ? `${(item.count / maxCount) * 100}%` : "0%",
								transitionDelay: `${index * 80}ms`,
								background:
									item.count / maxCount >= 0.5
										? "rgba(0,115,255,0.8)"
										: "rgba(0,115,255,0.2)",
							}}
						/>
					</div>
					<span className="text-[14px] text-black/40 w-5 text-right flex-shrink-0">
						{item.count}
					</span>
				</div>
			))}
		</div>
	);
}
