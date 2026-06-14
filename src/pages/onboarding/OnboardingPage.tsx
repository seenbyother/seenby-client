import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import { saveSelfKeywords } from "@/features/onboarding/api";
import { MAX_SELF_KEYWORD_COUNT_BY_CATEGORY } from "@/features/onboarding/selfKeywords";
import { markOnboardingCompleted } from "@/features/onboarding/storage";
import { ApiError } from "@/shared/api";
import { OnboardingCompleteStep } from "./_components/OnboardingCompleteStep";
import { OnboardingIntroStep } from "./_components/OnboardingIntroStep";
import { OnboardingKeywordStep } from "./_components/OnboardingKeywordStep";
import { ONBOARDING_KEYWORD_STEPS } from "./constants";

type OnboardingStep = "intro" | "keywords" | "complete";

export function OnboardingPage() {
	const navigate = useNavigate();
	const { data: currentUser } = useCurrentUser();
	const [step, setStep] = useState<OnboardingStep>("intro");
	const [keywordStepIndex, setKeywordStepIndex] = useState(0);
	const [selectedKeywordsByStep, setSelectedKeywordsByStep] = useState<
		Record<string, string[]>
	>({});
	const saveSelfKeywordsMutation = useMutation({
		mutationFn: saveSelfKeywords,
		onSuccess: () => {
			setStep("complete");
		},
	});

	if (!currentUser) {
		return null;
	}

	const userName = getCurrentUserName(currentUser);
	const keywordStep = ONBOARDING_KEYWORD_STEPS[keywordStepIndex];
	const selectedKeywords = selectedKeywordsByStep[keywordStep.id] ?? [];
	const orderedSelectedKeywords = ONBOARDING_KEYWORD_STEPS.flatMap(
		(step) => selectedKeywordsByStep[step.id] ?? [],
	);
	const cannotSelectMoreKeywords =
		selectedKeywords.length >= MAX_SELF_KEYWORD_COUNT_BY_CATEGORY;

	const toggleKeyword = (keyword: string) => {
		setSelectedKeywordsByStep((prev) => {
			const current = prev[keywordStep.id] ?? [];
			const isSelected = current.includes(keyword);

			if (!isSelected && current.length >= MAX_SELF_KEYWORD_COUNT_BY_CATEGORY) {
				return prev;
			}

			const next = isSelected
				? current.filter((item) => item !== keyword)
				: [...current, keyword];

			return {
				...prev,
				[keywordStep.id]: next,
			};
		});
	};

	const goNextKeywordStep = () => {
		if (selectedKeywords.length === 0 || saveSelfKeywordsMutation.isPending) {
			return;
		}

		if (keywordStepIndex < ONBOARDING_KEYWORD_STEPS.length - 1) {
			setKeywordStepIndex((current) => current + 1);
			return;
		}

		saveSelfKeywordsMutation.mutate(orderedSelectedKeywords);
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
			selectedKeywordCount={selectedKeywords.length}
			maxKeywordCount={MAX_SELF_KEYWORD_COUNT_BY_CATEGORY}
			selectionLimitReached={cannotSelectMoreKeywords}
			isSubmitting={saveSelfKeywordsMutation.isPending}
			errorMessage={getSaveSelfKeywordsErrorMessage(
				saveSelfKeywordsMutation.error,
			)}
			onToggle={toggleKeyword}
			onNext={goNextKeywordStep}
		/>
	);
}

function getSaveSelfKeywordsErrorMessage(error: unknown) {
	if (!error) {
		return null;
	}

	if (error instanceof ApiError && error.message) {
		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "자기 인식 키워드를 저장하지 못했어요. 잠시 후 다시 시도해주세요.";
}
