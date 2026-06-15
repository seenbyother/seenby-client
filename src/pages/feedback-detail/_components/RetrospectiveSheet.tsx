import type { PointerEvent } from "react";
import { useRef, useState } from "react";
import CheckIcon from "@/assets/feedback/check.svg?react";
import CloseIcon from "@/assets/feedback/close.svg?react";
import InfoIcon from "@/assets/feedback/info.svg?react";
import type { ExperienceFeedback } from "@/pages/feedback-detail/types";

interface RetrospectiveSheetProps {
	isOpen: boolean;
	experienceFeedback: ExperienceFeedback | null;
	value: string;
	onChange: (value: string) => void;
	onClose: () => void;
	onSave: () => void;
	isSaving?: boolean;
	errorMessage?: string | null;
}

export function RetrospectiveSheet({
	isOpen,
	experienceFeedback,
	value,
	onChange,
	onClose,
	onSave,
	isSaving = false,
	errorMessage,
}: RetrospectiveSheetProps) {
	const [dragOffset, setDragOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [isGuideOpen, setIsGuideOpen] = useState(false);
	const dragStartYRef = useRef<number | null>(null);
	const dragOffsetRef = useRef(0);
	const hasRetrospectiveContent = value.trim().length > 0;
	const characterCount = value.length;

	const closeGuide = () => {
		setIsGuideOpen(false);
	};

	const closeSheet = () => {
		if (isSaving) return;

		closeGuide();
		onClose();
	};

	const saveSheet = () => {
		if (isSaving) return;

		closeGuide();
		onSave();
	};

	const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
		if (!isOpen || isSaving) return;

		dragStartYRef.current = event.clientY;
		dragOffsetRef.current = dragOffset;
		setIsDragging(true);
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const moveSheet = (event: PointerEvent<HTMLDivElement>) => {
		if (dragStartYRef.current === null) return;

		const nextOffset = Math.max(0, event.clientY - dragStartYRef.current);
		dragOffsetRef.current = nextOffset;
		setDragOffset(nextOffset);
	};

	const endDrag = () => {
		if (dragStartYRef.current === null) return;

		const shouldClose = dragOffsetRef.current > 120;
		dragStartYRef.current = null;
		dragOffsetRef.current = 0;
		setIsDragging(false);
		setDragOffset(0);

		if (shouldClose) {
			closeSheet();
			return;
		}
	};

	return (
		<section
			aria-label="회고 작성하기"
			className={[
				"absolute bottom-0 left-0 z-30 flex h-[436px] w-full flex-col rounded-t-[40px] bg-white shadow-[0_-2px_6.2px_rgba(0,0,0,0.13)]",
				isDragging
					? "transition-none"
					: "transition-transform duration-300 ease-out",
				isOpen ? "" : "pointer-events-none",
				isSaving ? "cursor-wait" : "",
			].join(" ")}
			style={{
				transform: isOpen ? `translateY(${dragOffset}px)` : "translateY(100%)",
			}}
		>
			<div
				className="flex h-[23px] cursor-grab touch-none items-start justify-center pt-[7px] active:cursor-grabbing"
				onPointerDown={beginDrag}
				onPointerMove={moveSheet}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
			>
				<div className="h-1 w-[115px] rounded-md bg-[#D1D5DB]" />
			</div>
			<div className="mt-3 flex h-6 items-center justify-between px-[23px]">
				<button
					type="button"
					onClick={closeSheet}
					disabled={isSaving}
					aria-label="회고 작성 닫기"
					className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-40"
				>
					<CloseIcon aria-hidden="true" />
				</button>
				<div className="flex min-w-0 items-center gap-2">
					<h2 className="m-0 text-[15px] font-semibold leading-none text-[#6B7280]">
						회고 작성하기
					</h2>
					{experienceFeedback ? (
						<span className="text-[12px] font-medium text-[#9CA3AF]">
							경험 {experienceFeedback.displayOrder + 1}
						</span>
					) : null}
				</div>
				<div className="flex items-center gap-[10px]">
					<button
						type="button"
						onClick={() => setIsGuideOpen((current) => !current)}
						aria-controls="retrospective-guide"
						aria-expanded={isGuideOpen}
						aria-label="회고 작성 안내"
						className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
					>
						<InfoIcon aria-hidden="true" className="h-[21px] w-[21px]" />
					</button>
					<button
						type="button"
						onClick={saveSheet}
						disabled={isSaving}
						aria-label="회고 저장하기"
						className={[
							"flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
							hasRetrospectiveContent ? "text-[#0073FF]" : "text-[#6B7280]",
						].join(" ")}
					>
						<CheckIcon aria-hidden="true" />
					</button>
				</div>
			</div>
			{errorMessage ? (
				<p className="mx-[39px] mt-4 mb-0 text-[13px] font-medium text-red-500">
					{errorMessage}
				</p>
			) : null}
			{isGuideOpen ? (
				<div
					id="retrospective-guide"
					className="mx-[23px] mt-5 rounded-2xl bg-[#F3F4F6] px-4 py-3 text-[14px] leading-[1.5] text-[#4B5563]"
				>
					<p className="m-0 font-semibold text-black">
						어떤 점을 돌아보면 좋을까요?
					</p>
					<ul className="m-0 mt-2 list-disc space-y-1 pl-5">
						<li>이 피드백을 보고 새롭게 알게 된 점</li>
						<li>다음에 더 잘해보고 싶은 행동</li>
						<li>계속 유지하고 싶은 나의 강점</li>
					</ul>
				</div>
			) : null}
			<label className="sr-only" htmlFor="retrospective-editor">
				회고 내용
			</label>
			<textarea
				id="retrospective-editor"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="나의 회고를 작성해보세요."
				className="mt-[30px] min-h-0 flex-1 w-full resize-none border-0 bg-transparent px-[39px] pb-2 text-[20px] leading-[1.5] text-[#4B5563] outline-none placeholder:text-[#D1D5DB]"
			/>
			<p className="m-0 px-[39px] pb-8 text-right text-[13px] font-medium leading-none text-[#9CA3AF]">
				{characterCount}자
			</p>
		</section>
	);
}
