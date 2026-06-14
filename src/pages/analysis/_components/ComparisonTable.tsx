import type { AnalysisSelfOtherRow } from "@/features/feedback-groups/api";

const LABEL_KO: Record<string, string> = {
	Strengths: "주요 강점",
	"Growth Areas": "보완 필요",
	Tendencies: "성향",
};

interface ComparisonTableProps {
	rows: AnalysisSelfOtherRow[];
}

export function ComparisonTable({ rows }: ComparisonTableProps) {
	return (
		<div className="rounded-[12px] overflow-hidden">
			<div className="flex items-center bg-[#ECECEC] px-5 h-[42px]">
				<span className="flex-1 text-[16px] text-black">항목</span>
				<span className="flex-1 text-center text-[16px] text-black">
					내가 본 나
				</span>
				<span className="flex-1 text-center text-[16px] text-black">
					타인이 본 나
				</span>
			</div>
			{rows.map((row) => (
				<div
					key={row.label}
					className="flex items-start px-[10px] py-3 border-b border-gray-100 last:border-0 gap-2"
				>
					<span className="flex-1 text-[14px] font-semibold text-[#656565] pt-0.5">
						{LABEL_KO[row.label] ?? row.label}
					</span>
					<span className="flex-1 text-left text-[14px] text-black leading-relaxed">
						{row.selfView.join(", ")}
					</span>
					<span className="flex-1 text-left text-[14px] text-black leading-relaxed">
						{row.otherView.join(", ")}
					</span>
				</div>
			))}
		</div>
	);
}
