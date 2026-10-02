import { useState } from "react";
import IcExperienceAdd from "@/assets/feedback/ic_experience_add.svg?react";
import IcExperienceDelete from "@/assets/feedback/ic_experience_delete.svg?react";
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

export function ExperienceStep({
	recipientName,
	experiences,
	onChange,
	onAdd,
	onDelete,
	onBack,
	onNext,
}: ExperienceStepProps) {
	const hasContent = experiences.some((e) => e.trim().length > 0);
	const [isGuideOpen, setIsGuideOpen] = useState(false);

	return (
		<div className="h-dvh flex flex-col bg-white text-left overflow-hidden">
			<Header onBack={onBack} />
			<div className="px-5">
				<ProgressBar step={5} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1 min-h-0 overflow-y-auto">
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

				<div className="mt-6 rounded-2xl border border-[#E5E5EA] bg-white overflow-hidden">
					{experiences.map((exp, index) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: ordered list items
							key={index}
							className="flex items-start gap-[10px] px-4 py-[14px] border-b border-[#EFEFF4]"
						>
							<span className="text-[14px] font-bold leading-[150%] text-[#1C1C1E] w-4 shrink-0">
								{index + 1}
							</span>
							<div className="flex flex-col flex-1 gap-1">
								<textarea
									ref={(el) => {
										if (el) autoResize(el);
									}}
									value={exp}
									onChange={(e) => {
										onChange(index, e.target.value);
										autoResize(e.target);
									}}
									placeholder="경험을 입력해주세요"
									rows={1}
									maxLength={200}
									className="w-full resize-none overflow-hidden text-[14px] font-normal leading-[150%] text-[#1C1C1E] placeholder:text-[#D9D9D9] bg-transparent outline-none border-none"
									style={{ height: "auto" }}
								/>
								<div className="flex justify-end">
									<span className="text-[11px] text-[#A1A9B2]">
										{exp.length}/200
									</span>
								</div>
							</div>
							{experiences.length > 1 && (
								<button
									type="button"
									onClick={() => onDelete(index)}
									className="shrink-0 mt-0.5 -m-1 p-1 bg-transparent border-none cursor-pointer outline-none"
									aria-label="이 경험 삭제"
								>
									<IcExperienceDelete width={16} height={16} />
								</button>
							)}
						</div>
					))}
					<button
						type="button"
						onClick={onAdd}
						className="flex w-full items-center justify-center gap-2 px-4 py-[14px] bg-transparent border-none cursor-pointer outline-none"
					>
						<IcExperienceAdd width={14} height={14} />
						<span className="text-[14px] font-bold text-[#007AFF]">
							경험 추가하기
						</span>
					</button>
				</div>
			</div>

			<div className="px-5 pb-8 flex flex-col gap-2 shrink-0">
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
			<WritingGuideModal
				isOpen={isGuideOpen}
				onClose={() => setIsGuideOpen(false)}
			/>
		</div>
	);
}
