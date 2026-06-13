import { KeywordChip } from "@/shared/components";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingProgress } from "./OnboardingProgress";

interface OnboardingKeywordStepProps {
	step: number;
	totalSteps: number;
	title: string;
	subtitle: string;
	keywords: readonly string[];
	selectedKeywords: string[];
	onToggle: (keyword: string) => void;
	onNext: () => void;
}

export function OnboardingKeywordStep({
	step,
	totalSteps,
	title,
	subtitle,
	keywords,
	selectedKeywords,
	onToggle,
	onNext,
}: OnboardingKeywordStepProps) {
	const hasSelection = selectedKeywords.length > 0;

	return (
		<OnboardingLayout
			actionLabel="다음"
			onAction={onNext}
			actionDisabled={!hasSelection}
			contentClassName="pt-[60px]"
		>
			<OnboardingProgress step={step} total={totalSteps} />

			<section
				className="pt-[24px]"
				aria-labelledby={`onboarding-step-${step}`}
			>
				<h1
					id={`onboarding-step-${step}`}
					className="m-0 whitespace-pre-line break-keep text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black"
				>
					{title}
				</h1>
				<p className="mt-2 mb-0 text-[16px] font-medium leading-[150%] text-[#71717A]">
					{subtitle}
				</p>
			</section>

			<div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 pb-4">
				{keywords.map((keyword) => (
					<KeywordChip
						key={keyword}
						label={keyword}
						selected={selectedKeywords.includes(keyword)}
						onClick={() => onToggle(keyword)}
					/>
				))}
			</div>
		</OnboardingLayout>
	);
}
