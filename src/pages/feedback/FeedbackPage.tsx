import { useState } from "react";
import { CompletionStep } from "./steps/CompletionStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { KeywordStep } from "./steps/KeywordStep";
import { LandingStep } from "./steps/LandingStep";
import { NicknameStep } from "./steps/NicknameStep";
import { ThoughtsStep } from "./steps/ThoughtsStep";

type Step = "landing" | "nickname" | "keywords" | "experience" | "thoughts" | "completion";

const RECIPIENT_NAME = "김민경";
const GROUP_NAME = "2026 캡스톤 디자인";

export function FeedbackPage() {
	const [step, setStep] = useState<Step>("landing");
	const [nickname, setNickname] = useState("");
	const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
	const [experiences, setExperiences] = useState<string[]>(["", ""]);
	const [thoughts, setThoughts] = useState<string[]>([]);

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

	if (step === "landing") {
		return (
			<LandingStep
				recipientName={RECIPIENT_NAME}
				groupName={GROUP_NAME}
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
				recipientName={RECIPIENT_NAME}
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
				recipientName={RECIPIENT_NAME}
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
				recipientName={RECIPIENT_NAME}
				experiences={experiences}
				thoughts={thoughts}
				onChange={updateThought}
				onBack={() => setStep("experience")}
				onSubmit={() => setStep("completion")}
			/>
		);
	}

	return (
		<CompletionStep
			recipientName={RECIPIENT_NAME}
			groupName={GROUP_NAME}
			onDone={() => setStep("landing")}
		/>
	);
}
