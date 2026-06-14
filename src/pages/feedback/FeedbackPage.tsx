import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { getPublicFeedbackGroup, submitPublicFeedbackAnswer } from "@/features/feedback-groups/api";
import { CompletionStep } from "./steps/CompletionStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { KeywordStep } from "./steps/KeywordStep";
import { LandingStep } from "./steps/LandingStep";
import { NicknameStep } from "./steps/NicknameStep";
import { ThoughtsStep } from "./steps/ThoughtsStep";

type Step = "landing" | "nickname" | "keywords" | "experience" | "thoughts" | "completion";

export function FeedbackPage() {
	const [searchParams] = useSearchParams();
	const linkToken = searchParams.get("token") ?? "";

	const { data: groupInfo, isLoading, isError } = useQuery({
		queryKey: ["public-feedback-group", linkToken],
		queryFn: () => getPublicFeedbackGroup(linkToken),
		enabled: !!linkToken,
		retry: false,
	});

	const [step, setStep] = useState<Step>("landing");
	const [nickname, setNickname] = useState("");
	const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
	const [experiences, setExperiences] = useState<string[]>(["", ""]);
	const [thoughts, setThoughts] = useState<string[]>([]);

	const submitMutation = useMutation({
		mutationFn: () => {
			const filledExperiences = experiences.filter((e) => e.trim());
			return submitPublicFeedbackAnswer(linkToken, {
				reviewerName: nickname,
				experienceFeedbacks: filledExperiences.map((exp, i) => ({
					experience: exp,
					feedback: thoughts[i] ?? "",
				})),
				keywords: selectedKeywords,
			});
		},
		onSuccess: () => setStep("completion"),
	});

	const toggleKeyword = (keyword: string) => {
		setSelectedKeywords((prev) =>
			prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword],
		);
	};

	const updateExperience = (index: number, value: string) => {
		setExperiences((prev) => {
			const next = [...prev];
			next[index] = value;
			return next;
		});
	};

	const addExperience = () => setExperiences((prev) => [...prev, ""]);

	const deleteExperience = (index: number) => {
		setExperiences((prev) => prev.filter((_, i) => i !== index));
		setThoughts((prev) => prev.filter((_, i) => i !== index));
	};

	const updateThought = (index: number, value: string) => {
		setThoughts((prev) => {
			const next = [...prev];
			next[index] = value;
			return next;
		});
	};

	if (!linkToken || isError) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-white px-5">
				<p className="text-[20px] font-semibold text-[#374151] text-center">
					유효하지 않은 링크입니다.
				</p>
				<p className="text-[16px] text-[#71717A] text-center mt-2">
					링크를 다시 확인해주세요.
				</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<p className="text-[16px] text-[#71717A]">로딩 중...</p>
			</div>
		);
	}

	const recipientName = groupInfo?.ownerName ?? "";
	const groupName = groupInfo?.name ?? "";

	if (step === "landing") {
		return (
			<LandingStep
				recipientName={recipientName}
				groupName={groupName}
				onAnonymous={() => setStep("nickname")}
				onLogin={() => setStep("nickname")}
			/>
		);
	}

	if (step === "nickname") {
		return (
			<NicknameStep
				nickname={nickname}
				onChange={setNickname}
				onBack={() => setStep("landing")}
				onNext={() => setStep("keywords")}
			/>
		);
	}

	if (step === "keywords") {
		return (
			<KeywordStep
				recipientName={recipientName}
				selectedKeywords={selectedKeywords}
				onToggle={toggleKeyword}
				onBack={() => setStep("nickname")}
				onNext={() => setStep("experience")}
			/>
		);
	}

	if (step === "experience") {
		return (
			<ExperienceStep
				recipientName={recipientName}
				experiences={experiences}
				onChange={updateExperience}
				onAdd={addExperience}
				onDelete={deleteExperience}
				onBack={() => setStep("keywords")}
				onNext={() => setStep("thoughts")}
			/>
		);
	}

	if (step === "thoughts") {
		return (
			<ThoughtsStep
				recipientName={recipientName}
				experiences={experiences}
				thoughts={thoughts}
				onChange={updateThought}
				onBack={() => setStep("experience")}
				onSubmit={() => submitMutation.mutate()}
				isSubmitting={submitMutation.isPending}
			/>
		);
	}

	return (
		<CompletionStep
			recipientName={recipientName}
			groupName={groupName}
			onDone={() => setStep("landing")}
		/>
	);
}
