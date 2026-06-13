import { useState } from "react";
import { useNavigate } from "react-router";
import { markOnboardingCompleted } from "@/features/onboarding/storage";
import { getOnboardingUserName } from "@/features/onboarding/user";
import { OnboardingCompleteStep } from "./_components/OnboardingCompleteStep";
import { OnboardingIntroStep } from "./_components/OnboardingIntroStep";
import { OnboardingKeywordStep } from "./_components/OnboardingKeywordStep";
import { ONBOARDING_KEYWORD_STEPS } from "./constants";

type OnboardingStep = "intro" | "keywords" | "complete";

export function OnboardingPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState<OnboardingStep>("intro");
	const [keywordStepIndex, setKeywordStepIndex] = useState(0);
	const [selectedKeywordsByStep, setSelectedKeywordsByStep] = useState<
		Record<string, string[]>
	>({});

	const userName = getOnboardingUserName();
	const keywordStep = ONBOARDING_KEYWORD_STEPS[keywordStepIndex];
	const selectedKeywords = selectedKeywordsByStep[keywordStep.id] ?? [];

	const toggleKeyword = (keyword: string) => {
		setSelectedKeywordsByStep((prev) => {
			const current = prev[keywordStep.id] ?? [];
			const next = current.includes(keyword)
				? current.filter((item) => item !== keyword)
				: [...current, keyword];

			return {
				...prev,
				[keywordStep.id]: next,
			};
		});
	};

	const goNextKeywordStep = () => {
		if (keywordStepIndex < ONBOARDING_KEYWORD_STEPS.length - 1) {
			setKeywordStepIndex((current) => current + 1);
			return;
		}

		setStep("complete");
	};

	const completeOnboarding = () => {
		markOnboardingCompleted();
		navigate("/home", { replace: true });
	};

	if (step === "intro") {
		return (
			<OnboardingIntroStep
				userName={userName}
				onStart={() => setStep("keywords")}
			/>
		);
	}

	if (step === "complete") {
		return (
			<OnboardingCompleteStep
				userName={userName}
				onStart={completeOnboarding}
			/>
		);
	}

	return (
		<OnboardingKeywordStep
			step={keywordStepIndex + 1}
			totalSteps={ONBOARDING_KEYWORD_STEPS.length}
			title={keywordStep.title(userName)}
			subtitle={keywordStep.subtitle}
			keywords={keywordStep.keywords}
			selectedKeywords={selectedKeywords}
			onToggle={toggleKeyword}
			onNext={goNextKeywordStep}
		/>
	);
}
