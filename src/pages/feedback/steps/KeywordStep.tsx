import { useState } from "react";
import { Button, KeywordChip, ProgressBar } from "@/shared/components";
import { KEYWORD_ROUNDS } from "../constants";

interface KeywordStepProps {
	recipientName: string;
	selectedKeywords: string[];
	onToggle: (keyword: string) => void;
	onNext: () => void;
}

export function KeywordStep({ recipientName, selectedKeywords, onToggle, onNext }: KeywordStepProps) {
	const [roundIndex, setRoundIndex] = useState(0);
	const round = KEYWORD_ROUNDS[roundIndex];

	const currentRoundSelected = round.keywords.filter((k) => selectedKeywords.includes(k));
	const hasSelection = currentRoundSelected.length >= 1;

	const handleNext = () => {
		if (roundIndex < KEYWORD_ROUNDS.length - 1) {
			setRoundIndex((i) => i + 1);
		} else {
			onNext();
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<div className="px-5 pt-8">
				<ProgressBar step={roundIndex + 2} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1 overflow-y-auto">
				<div className="flex flex-col gap-2">
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black m-0 whitespace-pre-line">
						{round.title(recipientName)}
					</p>
					<p className="text-[16px] font-medium leading-[150%] text-[#71717A] m-0">{round.subtitle}</p>
				</div>

				<div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 pb-4">
					{round.keywords.map((keyword) => (
						<KeywordChip
							key={keyword}
							label={keyword}
							selected={selectedKeywords.includes(keyword)}
							onClick={() => onToggle(keyword)}
						/>
					))}
				</div>
			</div>

			<div className="px-5 pb-8">
				<Button onClick={handleNext} disabled={!hasSelection}>다음</Button>
			</div>
		</div>
	);
}
