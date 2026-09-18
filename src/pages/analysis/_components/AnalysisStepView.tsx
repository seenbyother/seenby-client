import type { AnalysisDetail } from "@/features/feedback-groups/api";
import { Button, ProgressBar } from "@/shared/components";
import { ComparisonTable } from "./ComparisonTable";
import { KeywordChart } from "./KeywordChart";
import { SelfAwarenessSection } from "./SelfAwarenessSection";
import { TypewriterText } from "./TypewriterText";

interface AnalysisStepViewProps {
	data: AnalysisDetail;
	stepIndex: number;
	onStepIndexChange: (index: number) => void;
	onFinish: () => void;
}

type Step = {
	title: string;
	content: React.ReactNode;
};

export function AnalysisStepView({
	data,
	stepIndex,
	onStepIndexChange,
	onFinish,
}: AnalysisStepViewProps) {
	const keywords = data.topKeywords ?? [];
	const comparisonRows = data.selfOtherComparison?.rows ?? [];

	const steps: Step[] = [
		{
			title: "전체 피드백 요약",
			content: (
				<TypewriterText
					text={data.feedbackSummary}
					className="m-0 text-[14px] text-black leading-relaxed"
				/>
			),
		},
		...(keywords.length > 0
			? [
					{
						title: "가장 많이 받은 키워드 Top 10",
						content: <KeywordChart keywords={keywords} animated />,
					},
				]
			: []),
		{
			title: "분석 인사이트",
			content: (
				<TypewriterText
					text={data.insight}
					className="m-0 text-[14px] text-black leading-relaxed whitespace-pre-line"
				/>
			),
		},
		{
			title: "자기 인식 일치도",
			content: (
				<SelfAwarenessSection
					percentage={data.selfAwareness}
					animated
					expanded
				/>
			),
		},
		...(comparisonRows.length > 0
			? [
					{
						title: "나 vs 타인이 보는 나",
						content: <ComparisonTable rows={comparisonRows} />,
					},
				]
			: []),
		...(data.actionPlan
			? [
					{
						title: "액션플랜",
						content: (
							<TypewriterText
								text={data.actionPlan}
								className="m-0 text-[14px] text-black leading-relaxed whitespace-pre-line"
							/>
						),
					},
				]
			: []),
		{
			title: "전체 결과 분석",
			content: (
				<TypewriterText
					text={data.totalSummary}
					className="m-0 text-[14px] text-black leading-relaxed"
				/>
			),
		},
	];

	const isLastStep = stepIndex === steps.length - 1;
	const step = steps[stepIndex];

	return (
		<div className="flex flex-col min-h-[calc(100svh-64px)]">
			<div className="px-5 pt-2 pb-6">
				<ProgressBar step={stepIndex + 1} totalSteps={steps.length} />
			</div>

			<div className="flex-1 flex flex-col gap-3 px-[18px]">
				<h2 className="m-0 text-[16px] font-bold text-black text-left">
					{step.title}
				</h2>
				<div className="bg-white rounded-[20px] p-4">{step.content}</div>
			</div>

			<div className="px-5 pt-6 pb-10">
				<Button
					onClick={() =>
						isLastStep ? onFinish() : onStepIndexChange(stepIndex + 1)
					}
				>
					{isLastStep ? "분석 전체 다시보기" : "다음"}
				</Button>
			</div>
		</div>
	);
}
