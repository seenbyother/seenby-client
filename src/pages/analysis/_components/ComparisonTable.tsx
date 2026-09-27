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
	if (rows.length === 0) {
		return (
			<p className="m-0 py-4 text-center text-[14px] text-[#6E737D]">
				표시할 비교 결과가 없어요.
			</p>
		);
	}

	return (
		<div className="overflow-hidden rounded-[12px]">
			<div className="flex h-[42px] items-center bg-[#ECECEC] px-5">
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
					className="flex items-start gap-2 border-b border-gray-100 px-[10px] py-3 last:border-0"
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
