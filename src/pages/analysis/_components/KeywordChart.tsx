import type { AnalysisKeyword } from "@/features/feedback-groups/api";
import { useStagedReveal } from "./useStagedReveal";

interface KeywordChartProps {
	keywords: AnalysisKeyword[];
	animated?: boolean;
}

export function KeywordChart({
	keywords,
	animated = false,
}: KeywordChartProps) {
	const maxCount = Math.max(...keywords.map((keyword) => keyword.count), 1);
	const filled = useStagedReveal(animated);

	if (keywords.length === 0) {
		return (
			<p className="m-0 py-4 text-center text-[14px] text-[#6E737D]">
				표시할 키워드가 없어요.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-[10px]">
			{keywords.map((item, index) => (
				<div
					key={`${item.rank}-${item.keyword}`}
					className="flex items-center gap-2"
				>
					<span className="w-20 flex-shrink-0 text-right text-[14px] text-black/70">
						{item.keyword}
					</span>
					<div className="h-[21px] flex-1 overflow-hidden rounded-[4px] bg-gray-100">
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
					<span className="w-5 flex-shrink-0 text-right text-[14px] text-black/40">
						{item.count}
					</span>
				</div>
			))}
		</div>
	);
}
