import { useState } from "react";
import { Button, Header, ProgressBar } from "@/shared/components";
import { WritingGuideModal } from "../WritingGuideModal";

interface ThoughtsStepProps {
	recipientName: string;
	experiences: string[];
	thoughts: string[];
	onChange: (index: number, value: string) => void;
	onBack: () => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
}

function ChevronUp() {
	return (
		<svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
			<path d="M8 19L15 12L22 19" stroke="#0073FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function ChevronDown() {
	return (
		<svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
			<path d="M8 12L15 19L22 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${el.scrollHeight}px`;
}

export function ThoughtsStep({ recipientName, experiences, thoughts, onChange, onBack, onSubmit, isSubmitting = false }: ThoughtsStepProps) {
	const [expandedIndex, setExpandedIndex] = useState(0);
	const [isGuideOpen, setIsGuideOpen] = useState(false);

	const filledExperiences = experiences.filter((e) => e.trim());

	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<Header onBack={onBack} />
			<div className="px-5">
				<ProgressBar step={6} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1">
				<div className="flex flex-col gap-2">
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black m-0">
						{recipientName} 님과 함께한
						<br />
						경험에 대한 생각 나눠주세요.
					</p>
					<p className="text-[16px] font-medium leading-[150%] text-[#71717A] m-0">
						함께 했던 경험에 대한 생각을 작성해주세요.
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-3">
					{filledExperiences.map((exp, index) => {
						const isExpanded = expandedIndex === index;
						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: ordered list items
							<div key={index} className="flex gap-[13px] px-1">
								<button
									type="button"
									className="shrink-0 mt-0.5 bg-transparent border-none cursor-pointer outline-none p-0"
									onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
								>
									{isExpanded ? <ChevronUp /> : <ChevronDown />}
								</button>
								<div className="flex-1">
									<p
										className={`text-[20px] font-medium leading-[150%] m-0 ${isExpanded ? "text-[#0073FF]" : "text-black"}`}
									>
										{exp}
									</p>
									{isExpanded && (
										<div className="flex flex-col mt-2">
											<textarea
												value={thoughts[index] ?? ""}
												onChange={(e) => {
													onChange(index, e.target.value);
													autoResize(e.target);
												}}
												placeholder="나의 생각 작성하기"
												rows={1}
												className="w-full resize-none overflow-hidden text-[20px] font-medium leading-[150%] text-black placeholder:text-[#D9D9D9] bg-transparent outline-none border-none"
												style={{ height: "auto" }}
											/>
											<div className="h-[2px] bg-[#D9D9D9]" />
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="px-5 pb-8 flex flex-col gap-2">
				<button
					type="button"
					onClick={() => setIsGuideOpen(true)}
					className="text-[14px] font-medium leading-[150%] text-[#475569] underline self-center bg-transparent border-none cursor-pointer outline-none"
				>
					어떻게 작성하는지 모르겠어요
				</button>
				<Button
					onClick={onSubmit}
					disabled={isSubmitting || !filledExperiences.every((_, index) => thoughts[index]?.trim().length > 0)}
				>
					전송
				</Button>
			</div>
			<WritingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
		</div>
	);
}
