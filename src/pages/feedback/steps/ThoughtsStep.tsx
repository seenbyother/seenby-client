import { useEffect, useRef, useState } from "react";
import IcCheck from "@/assets/feedback/check.svg?react";
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

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${el.scrollHeight}px`;
}

const VALIDATION_TOAST_DURATION_MS = 2_400;

export function ThoughtsStep({
	recipientName,
	experiences,
	thoughts,
	onChange,
	onBack,
	onSubmit,
	isSubmitting = false,
}: ThoughtsStepProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isGuideOpen, setIsGuideOpen] = useState(false);
	const [validationToast, setValidationToast] = useState<{
		key: number;
		message: string;
	} | null>(null);
	const validationToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	const filledExperiences = experiences.filter((e) => e.trim());
	const currentExperience = filledExperiences[currentIndex] ?? "";

	useEffect(
		() => () => {
			if (validationToastTimerRef.current !== null) {
				clearTimeout(validationToastTimerRef.current);
			}
		},
		[],
	);

	const showValidationToast = (message: string) => {
		if (validationToastTimerRef.current !== null) {
			clearTimeout(validationToastTimerRef.current);
		}

		setValidationToast((current) => ({
			key: (current?.key ?? 0) + 1,
			message,
		}));
		validationToastTimerRef.current = setTimeout(() => {
			setValidationToast(null);
			validationToastTimerRef.current = null;
		}, VALIDATION_TOAST_DURATION_MS);
	};

	const submitThoughts = () => {
		const firstMissingIndex = filledExperiences.findIndex(
			(_, index) => !thoughts[index]?.trim(),
		);
		if (firstMissingIndex >= 0) {
			setCurrentIndex(firstMissingIndex);
			showValidationToast(
				`${firstMissingIndex + 1}번째 경험에 대한 생각을 작성해주세요.`,
			);
			return;
		}

		onSubmit();
	};

	return (
		<div className="h-dvh flex flex-col bg-white text-left overflow-hidden">
			{validationToast ? (
				<div
					key={validationToast.key}
					role="alert"
					className="feedback-validation-toast fixed left-1/2 top-[calc(env(safe-area-inset-top)+12px)] z-[100] flex w-[calc(100%-32px)] max-w-[370px] items-center gap-3 rounded-2xl border border-[#FFE1E4] bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-md"
				>
					<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0F1] text-[#E5484D]">
						<svg
							aria-hidden="true"
							className="h-3.5 w-3.5"
							viewBox="0 0 16 16"
							fill="none"
						>
							<path
								d="M4.25 4.25l7.5 7.5m0-7.5-7.5 7.5"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
							/>
						</svg>
					</span>
					<p className="m-0 min-w-0 text-[14px] font-semibold leading-[1.45] text-[#262B33]">
						{validationToast.message}
					</p>
				</div>
			) : null}
			<Header onBack={onBack} />
			<div className="px-5">
				<ProgressBar step={6} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1 min-h-0 overflow-y-auto">
				<div className="flex flex-col gap-2">
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black m-0">
						{recipientName} 님과 함께한
						<br />
						경험에 대한 생각 나눠주세요.
					</p>
					<p className="text-[16px] font-medium leading-[150%] text-[#71717A] m-0">
						함께 했던 경험에 대한 생각을 작성해주세요.
						<br />
						개선할 점, 좋았던 점 모두 작성해주세요.
					</p>
				</div>

				<div className="mt-6 flex items-center gap-2 overflow-x-auto">
					{filledExperiences.map((_, index) => {
						const isSelected = index === currentIndex;
						const isAnswered = (thoughts[index] ?? "").trim().length > 0;
						return (
							<button
								// biome-ignore lint/suspicious/noArrayIndexKey: ordered pagination items
								key={index}
								type="button"
								onClick={() => setCurrentIndex(index)}
								className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border cursor-pointer outline-none ${
									isSelected
										? "bg-[#F2F8FF] border-[#F2F8FF] text-[#007AFF]"
										: isAnswered
											? "bg-white border-[#007AFF] text-[#007AFF]"
											: "bg-white border-[#D8D8D8] text-[#B0B0B0]"
								}`}
							>
								{isAnswered ? <IcCheck width={14} height={14} /> : index + 1}
							</button>
						);
					})}
				</div>

				<p className="mt-4 text-[13px] text-[#ABABAB] m-0">
					<span className="font-bold">{currentIndex + 1}</span>
					<span className="font-semibold">번째 경험</span>
				</p>
				<p className="mt-2 text-[14px] leading-[21px] text-[#1C1C1E] m-0">
					{currentExperience}
				</p>

				<div className="mt-4 h-px bg-[#EFEFEF]" />

				<p className="mt-4 text-[12px] font-semibold text-[#ABABAB] m-0">
					그때 든 생각
				</p>
				<textarea
					key={currentIndex}
					ref={(el) => {
						if (el) autoResize(el);
					}}
					value={thoughts[currentIndex] ?? ""}
					onChange={(e) => {
						onChange(currentIndex, e.target.value);
						autoResize(e.target);
					}}
					placeholder="그때 어떤 생각이나 느낌이 들었나요?"
					rows={1}
					className="mt-2 w-full resize-none overflow-hidden text-[16px] font-medium leading-[150%] text-black placeholder:text-[#71717A] bg-transparent outline-none border-none"
					style={{ height: "auto" }}
				/>
			</div>

			<div className="px-5 pb-8 flex flex-col gap-2 shrink-0">
				<button
					type="button"
					onClick={() => setIsGuideOpen(true)}
					className="text-[14px] font-medium leading-[150%] text-[#475569] underline self-center bg-transparent border-none cursor-pointer outline-none"
				>
					어떻게 작성하는지 모르겠어요
				</button>
				<Button onClick={submitThoughts} disabled={isSubmitting}>
					전송
				</Button>
			</div>
			<WritingGuideModal
				isOpen={isGuideOpen}
				onClose={() => setIsGuideOpen(false)}
			/>
		</div>
	);
}
