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
	selectedKeywordCount: number;
	maxKeywordCount: number;
	selectionLimitReached: boolean;
	isSubmitting: boolean;
	errorMessage: string | null;
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
	selectedKeywordCount,
	maxKeywordCount,
	selectionLimitReached,
	isSubmitting,
	errorMessage,
	onToggle,
	onNext,
}: OnboardingKeywordStepProps) {
	const hasSelection = selectedKeywords.length > 0;

	return (
		<OnboardingLayout
			actionLabel={isSubmitting ? "저장 중" : "다음"}
			onAction={onNext}
			actionDisabled={!hasSelection || isSubmitting}
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
				<div className="mt-3 flex items-center justify-between gap-3">
					<p className="m-0 text-[13px] font-medium leading-[150%] text-[#71717A]">
						각 단계에서 1개 이상 선택해주세요
					</p>
					<p
						className={[
							"m-0 shrink-0 text-[13px] font-semibold leading-[150%]",
							selectionLimitReached ? "text-[#0073FF]" : "text-[#71717A]",
						].join(" ")}
					>
						{selectedKeywordCount}/{maxKeywordCount}
					</p>
				</div>
			</section>

			<div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 pb-4">
				{keywords.map((keyword) => {
					const selected = selectedKeywords.includes(keyword);

					return (
						<KeywordChip
							key={keyword}
							label={keyword}
							selected={selected}
							disabled={!selected && selectionLimitReached}
							onClick={() => onToggle(keyword)}
						/>
					);
				})}
			</div>

			<div className="min-h-[44px] pb-4">
				{selectionLimitReached ? (
					<p className="m-0 text-[14px] font-medium leading-[150%] text-[#0073FF]">
						각 단계에서 최대 {maxKeywordCount}개까지 선택할 수 있어요
					</p>
				) : null}
				{errorMessage ? (
					<p className="mt-2 mb-0 text-[14px] font-medium leading-[150%] text-red-500">
						{errorMessage}
					</p>
				) : null}
			</div>
		</OnboardingLayout>
	);
}
