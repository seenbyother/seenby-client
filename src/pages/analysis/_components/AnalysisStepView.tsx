import { Button } from "@/shared/components";
import type { AnalysisViewModel } from "../model";
import {
	ActionPlanSection,
	ComparisonSection,
	FinalTypeSection,
	InsightSection,
	KeywordsSection,
	SelfAwarenessCard,
	SummarySection,
	UsedFeedbackSection,
} from "./AnalysisSections";

interface AnalysisStepViewProps {
	data: AnalysisViewModel;
	stepIndex: number;
	onStepIndexChange: (index: number) => void;
	onSelectFeedback: (id: number) => void;
}

function scrollToPageTop() {
	window.scrollTo({ top: 0, behavior: "instant" });
}

export function AnalysisStepView({
	data,
	stepIndex,
	onStepIndexChange,
	onSelectFeedback,
}: AnalysisStepViewProps) {
	const analysisPages = [
		{ key: "summary", content: <SummarySection data={data} /> },
		{
			key: "keywords",
			content: <KeywordsSection data={data} animated />,
		},
		{ key: "insight", content: <InsightSection data={data} /> },
		{
			key: "self-awareness",
			content: (
				<div className="flex flex-col gap-5">
					<SelfAwarenessCard data={data} animated />
					<ComparisonSection data={data} />
				</div>
			),
		},
		{
			key: "action-plan",
			content: <ActionPlanSection data={data} variant="step" />,
		},
		{
			key: "final-type",
			content: <FinalTypeSection data={data} variant="reveal" />,
		},
	] as const;
	const usedFeedbackPageIndex = analysisPages.length;
	const safeStep = Math.min(Math.max(stepIndex, 0), usedFeedbackPageIndex);
	const isRevealStep = safeStep === analysisPages.length - 1;
	const isUsedFeedbackPage = safeStep === usedFeedbackPageIndex;
	const stepMeta = data.steps[safeStep];
	const pageContent = isUsedFeedbackPage ? (
		<UsedFeedbackSection data={data} onSelect={onSelectFeedback} />
	) : (
		analysisPages[safeStep].content
	);
	const handleNext = () => {
		scrollToPageTop();
		onStepIndexChange(Math.min(safeStep + 1, usedFeedbackPageIndex));
	};

	return (
		<main
			className={`flex min-h-[calc(100svh-64px)] flex-col [overflow-wrap:anywhere] ${isUsedFeedbackPage ? "pb-5" : "pb-28"}`}
		>
			{isUsedFeedbackPage ? (
				<div className="px-5 pt-5">
					<h1 className="m-0 whitespace-pre-line text-[27px] font-bold leading-[35px] text-[#17171A]">
						{"이 분석에 반영된\n피드백이에요"}
					</h1>
					<p className="mb-0 mt-3 text-[15px] leading-[22px] text-[#737885]">
						피드백을 누르면 상세 내용을 확인할 수 있어요.
					</p>
				</div>
			) : !isRevealStep ? (
				<>
					<div className="px-5 pb-5 pt-4">
						<p className="mb-3 mt-0 text-[13px] font-bold text-[#0073FF]">
							{safeStep + 1} / {analysisPages.length}
						</p>
						<div
							className="grid gap-[9px]"
							style={{
								gridTemplateColumns: `repeat(${analysisPages.length}, minmax(0, 1fr))`,
							}}
							role="progressbar"
							aria-label="AI 분석 진행률"
							aria-valuemin={1}
							aria-valuemax={analysisPages.length}
							aria-valuenow={safeStep + 1}
						>
							{analysisPages.map((page, index) => (
								<span
									key={page.key}
									className={`h-1 rounded-full ${index <= safeStep ? "bg-[#0073FF]" : "bg-[#E3E8F0]"}`}
								/>
							))}
						</div>
					</div>
					<div className="px-5">
						<h1 className="m-0 whitespace-pre-line text-[27px] font-bold leading-[1.4] text-[#14171C]">
							{stepMeta.title}
						</h1>
						<p className="mb-0 mt-2 text-[15px] leading-[1.4] text-[#6E737D]">
							{stepMeta.description}
						</p>
					</div>
				</>
			) : null}
			<div className={`flex-1 px-5 pb-6 ${isRevealStep ? "pt-3" : "pt-6"}`}>
				{pageContent}
			</div>
			{!isUsedFeedbackPage ? (
				<div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[402px] -translate-x-1/2 bg-[#F8F8F8]/95 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
					<Button onClick={handleNext}>
						{isRevealStep ? "분석에 사용한 피드백 보기" : "다음 분석 보기"}
					</Button>
				</div>
			) : null}
		</main>
	);
}
