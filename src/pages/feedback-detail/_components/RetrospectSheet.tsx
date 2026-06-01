import type { PointerEvent } from "react";
import { useRef, useState } from "react";
import CheckIcon from "@/assets/feedback/check.svg?react";
import CloseIcon from "@/assets/feedback/close.svg?react";
import InfoIcon from "@/assets/feedback/info.svg?react";
import type { ExperienceFeedback } from "@/pages/feedback-detail/types";

interface RetrospectSheetProps {
	isOpen: boolean;
	experienceFeedback: ExperienceFeedback | null;
	value: string;
	onChange: (value: string) => void;
	onClose: () => void;
	onSave: () => void;
}

export function RetrospectSheet({
	isOpen,
	experienceFeedback,
	value,
	onChange,
	onClose,
	onSave,
}: RetrospectSheetProps) {
	const [dragOffset, setDragOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const dragStartYRef = useRef<number | null>(null);
	const dragOffsetRef = useRef(0);

	const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
		if (!isOpen) return;

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
			onClose();
			return;
		}
	};

	return (
		<section
			aria-label="회고 작성하기"
			className={[
				"absolute bottom-0 left-0 z-30 h-[436px] w-full rounded-t-[40px] bg-white shadow-[0_-2px_6.2px_rgba(0,0,0,0.13)]",
				isDragging
					? "transition-none"
					: "transition-transform duration-300 ease-out",
				isOpen ? "" : "pointer-events-none",
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
					onClick={onClose}
					aria-label="회고 작성 닫기"
					className="flex h-6 w-6 items-center justify-center border-0 bg-transparent p-0"
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
					<InfoIcon aria-hidden="true" className="h-[21px] w-[21px]" />
					<button
						type="button"
						onClick={onSave}
						aria-label="회고 저장하기"
						className="flex h-6 w-6 items-center justify-center border-0 bg-transparent p-0"
					>
						<CheckIcon aria-hidden="true" />
					</button>
				</div>
			</div>
			<label className="sr-only" htmlFor="retrospect-editor">
				회고 내용
			</label>
			<textarea
				id="retrospect-editor"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="나의 회고를 작성해보세요."
				className="mt-[30px] h-[320px] w-full resize-none border-0 bg-transparent px-[39px] text-[20px] leading-[1.5] text-[#4B5563] outline-none placeholder:text-[#D1D5DB]"
			/>
		</section>
	);
}
