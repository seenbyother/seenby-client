import { useState } from "react";
import { Button, Header, ProgressBar } from "@/shared/components";
import { WritingGuideModal } from "../WritingGuideModal";

interface ExperienceStepProps {
	recipientName: string;
	experiences: string[];
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
	onDelete: (index: number) => void;
	onBack: () => void;
	onNext: () => void;
}

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${el.scrollHeight}px`;
}

export function ExperienceStep({ recipientName, experiences, onChange, onAdd, onDelete, onBack, onNext }: ExperienceStepProps) {
	const hasContent = experiences.some((e) => e.trim().length > 0);
	const [isGuideOpen, setIsGuideOpen] = useState(false);

	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<Header onBack={onBack} />
			<div className="px-5">
				<ProgressBar step={5} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1">
				<div className="flex flex-col gap-2">
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black m-0">
						{recipientName} 님과 함께한
						<br />
						경험을 나눠주세요.
					</p>
					<p className="text-[16px] font-medium leading-[150%] text-[#71717A] m-0">
						감정이나 생각은 제외하고 객관적인 사실만 작성해주세요.
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-3">
					{experiences.map((exp, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: ordered list items
						<div key={index} className="flex items-start gap-[13px] px-1">
							<span className="text-[20px] font-medium leading-[150%] text-black w-[18px] shrink-0 mt-0.5">
								{index + 1}.
							</span>
							<div className="flex flex-col flex-1">
								<textarea
									value={exp}
									onChange={(e) => {
										onChange(index, e.target.value);
										autoResize(e.target);
									}}
									placeholder="-"
									rows={1}
									maxLength={200}
									className="w-full resize-none overflow-hidden text-[20px] font-medium leading-[150%] text-black placeholder:text-[#D9D9D9] bg-transparent outline-none border-none"
									style={{ height: "auto" }}
								/>
								<div className="h-[2px] bg-[#D9D9D9]" />
								<div className="flex justify-end mt-1">
									<span className="text-[12px] text-[#A1A9B2]">{exp.length}/200</span>
								</div>
							</div>
							{experiences.length > 1 && (
								<button
									type="button"
									onClick={() => onDelete(index)}
									className="shrink-0 mt-1 bg-transparent border-none cursor-pointer outline-none p-0 text-[#D9D9D9] hover:text-[#71717A] text-[18px] leading-none"
									aria-label="삭제"
								>
									✕
								</button>
							)}
						</div>
					))}
				</div>

				<div className="mt-4 flex justify-center">
					<button
						type="button"
						onClick={onAdd}
						className="w-[30px] h-[30px] rounded-full bg-[rgba(0,115,255,0.05)] flex items-center justify-center text-[#0073FF] text-xl leading-none cursor-pointer border-none outline-none"
					>
						+
					</button>
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
				<Button onClick={onNext} disabled={!hasContent}>
					다음
				</Button>
			</div>
			<WritingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
		</div>
	);
}
