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
} from "./AnalysisSections";

interface AnalysisStepViewProps {
	data: AnalysisViewModel;
	stepIndex: number;
	onStepIndexChange: (index: number) => void;
	onFinish: () => void;
}

function scrollToPageTop() {
	window.scrollTo({ top: 0, behavior: "instant" });
}

export function AnalysisStepView({
	data,
	stepIndex,
	onStepIndexChange,
	onFinish,
}: AnalysisStepViewProps) {
	const stepContents = [
		<SummarySection key="summary" data={data} />,
		<KeywordsSection key="keywords" data={data} animated />,
		<InsightSection key="insight" data={data} />,
		<div key="self" className="flex flex-col gap-5">
			<SelfAwarenessCard data={data} animated />
			<ComparisonSection data={data} />
		</div>,
		<ActionPlanSection key="plan" data={data} variant="step" />,
		<FinalTypeSection key="type" data={data} variant="reveal" />,
	];
	const lastStepIndex = stepContents.length - 1;
	const safeStep = Math.min(Math.max(stepIndex, 0), lastStepIndex);
	const isRevealStep = safeStep === lastStepIndex;
	const stepMeta = data.steps[safeStep];
	const handleNext = () => {
		scrollToPageTop();
		if (isRevealStep) onFinish();
		else onStepIndexChange(safeStep + 1);
	};

	return (
		<main className="flex min-h-[calc(100svh-64px)] flex-col pb-5">
			{!isRevealStep ? (
				<>
					<div className="px-5 pb-5 pt-4">
						<p className="mb-3 mt-0 text-[13px] font-bold text-[#0073FF]">
							{safeStep + 1} / {stepContents.length}
						</p>
						<div
							className="grid grid-cols-6 gap-[9px]"
							role="progressbar"
							aria-label="AI 분석 진행률"
							aria-valuemin={1}
							aria-valuemax={stepContents.length}
							aria-valuenow={safeStep + 1}
						>
							{data.steps.map((step, index) => (
								<span
									key={step.title}
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
				{stepContents[safeStep]}
			</div>
			<div className="sticky bottom-0 bg-[#F8F8F8]/95 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
				<Button onClick={handleNext}>
					{isRevealStep ? "분석에 사용한 피드백 보기" : "다음 분석 보기"}
				</Button>
			</div>
		</main>
	);
}
