import { type ReactNode, useEffect, useId, useRef } from "react";

interface ConfirmDialogProps {
	title: string;
	description: ReactNode;
	confirmLabel: string;
	onCancel: () => void;
	onConfirm: () => void;
	isPending?: boolean;
	destructive?: boolean;
	errorMessage?: string | null;
}

export function ConfirmDialog({
	title,
	description,
	confirmLabel,
	onCancel,
	onConfirm,
	isPending = false,
	destructive = false,
	errorMessage,
}: ConfirmDialogProps) {
	const titleId = useId();
	const descriptionId = useId();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const onCancelRef = useRef(onCancel);
	onCancelRef.current = onCancel;

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		cancelRef.current?.focus();

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isPending) onCancelRef.current();
		};
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [isPending]);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-8">
			<button
				type="button"
				aria-label="확인 창 닫기"
				disabled={isPending}
				onClick={onCancel}
				className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
			/>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				className="relative z-10 w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
			>
				<h2 id={titleId} className="m-0 text-[17px] font-bold text-[#222222]">
					{title}
				</h2>
				<p
					id={descriptionId}
					className="mb-0 mt-2 whitespace-pre-line break-keep text-[13px] font-medium leading-[150%] text-[#71717A]"
				>
					{description}
				</p>
				{errorMessage ? (
					<p
						aria-live="polite"
						className="mb-0 mt-3 rounded-lg bg-[#FFF1F1] px-3 py-2 text-[12px] font-semibold leading-[140%] text-[#D83A40]"
					>
						{errorMessage}
					</p>
				) : null}
				<div className="mt-5 grid grid-cols-2 gap-2">
					<button
						ref={cancelRef}
						type="button"
						disabled={isPending}
						onClick={onCancel}
						className="h-10 rounded-xl border-0 bg-[#F0F2F4] text-[13px] font-bold text-[#555D67] disabled:opacity-50"
					>
						취소
					</button>
					<button
						type="button"
						aria-busy={isPending}
						disabled={isPending}
						onClick={onConfirm}
						className={`h-10 rounded-xl border-0 text-[13px] font-bold text-white disabled:opacity-50 ${destructive ? "bg-[#E5484D]" : "bg-[#0073FF]"}`}
					>
						{isPending ? "처리 중..." : confirmLabel}
					</button>
				</div>
			</section>
		</div>
	);
}
