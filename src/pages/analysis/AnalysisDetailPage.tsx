import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { type AnalysisDetail, getAnalysisDetail } from "@/features/feedback-groups/api";
import { Header } from "@/shared/components";
import { formatYearMonthDay } from "@/shared/utils/date";
import { AnalysisCard } from "./_components/AnalysisCard";
import { ComparisonTable } from "./_components/ComparisonTable";
import { KeywordChart } from "./_components/KeywordChart";
import { SelfAwarenessSection } from "./_components/SelfAwarenessSection";

export function AnalysisDetailPage() {
	const navigate = useNavigate();
	const { analysisId } = useParams<{ analysisId: string }>();
	const id = Number(analysisId);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["analysis-detail", id],
		queryFn: () => getAnalysisDetail(id),
		enabled: !Number.isNaN(id),
	});

	return (
		<div className="bg-[#F8F8F8] min-h-screen">
			<Header
				title="피드백 분석 내역"
				onBack={() => navigate(-1)}
				withBottomSpacing={false}
			/>

			{isLoading ? (
				<div className="flex items-center justify-center h-[calc(100svh-64px)]">
					<div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E8EBF0] border-t-[#0073FF]" />
				</div>
			) : isError ? (
				<div className="flex flex-col items-center justify-center h-[calc(100svh-64px)] gap-3 px-5 text-center">
					<span className="text-[16px] font-medium text-red-500">
						{error instanceof Error
							? error.message
							: "분석 결과를 불러오지 못했어요."}
					</span>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
					>
						돌아가기
					</button>
				</div>
			) : data ? (
				<AnalysisContent data={data} />
			) : null}
		</div>
	);
}

function AnalysisContent({ data }: { data: AnalysisDetail }) {
	const navigate = useNavigate();
	const comparisonRows = data.selfOtherComparison?.rows ?? [];
	const keywords = data.topKeywords ?? [];

	return (
		<>
			<div className="flex flex-col items-center gap-2 pt-8 pb-4 px-5">
				<h1 className="m-0 text-[30px] font-bold text-black text-center">
					{data.group.name}
				</h1>
				<p className="m-0 text-[14px] text-black/70 text-center">
					{formatYearMonthDay(data.analyzedAt)}
				</p>
			</div>

			<div className="flex flex-col gap-5 px-[18px] pb-8">
				<AnalysisCard title="전체 피드백 요약">
					<p className="m-0 text-[14px] text-black leading-relaxed">
						{data.feedbackSummary}
					</p>
				</AnalysisCard>

				{keywords.length > 0 && (
					<AnalysisCard title="가장 많이 받은 키워드 Top 10">
						<KeywordChart keywords={keywords} />
					</AnalysisCard>
				)}

				<AnalysisCard title="분석 인사이트">
					<p className="m-0 text-[14px] text-black leading-relaxed whitespace-pre-line">
						{data.insight}
					</p>
				</AnalysisCard>

				<AnalysisCard title="자기 인식 일치도">
					<SelfAwarenessSection percentage={data.selfAwareness} />
				</AnalysisCard>

				{comparisonRows.length > 0 && (
					<AnalysisCard title="나 vs 타인이 보는 나">
						<ComparisonTable rows={comparisonRows} />
					</AnalysisCard>
				)}

				{data.actionPlan && (
					<AnalysisCard title="액션플랜">
						<p className="m-0 text-[14px] text-black leading-relaxed whitespace-pre-line">
							{data.actionPlan}
						</p>
					</AnalysisCard>
				)}

				<AnalysisCard title="전체 결과 분석">
					<p className="m-0 text-[14px] text-black leading-relaxed">
						{data.totalSummary}
					</p>
				</AnalysisCard>
			</div>

			<div className="px-5 pb-10">
				<button
					type="button"
					onClick={() => navigate(`/groups/${data.group.id}`)}
					className="w-full py-[14px] rounded-[16px] bg-[#E5E7EB] text-[17px] font-medium text-[#111827] border-none cursor-pointer"
				>
					피드백 보러 가기
				</button>
			</div>
		</>
	);
}
