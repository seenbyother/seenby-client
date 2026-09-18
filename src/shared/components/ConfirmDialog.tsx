import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	pendingLabel?: string;
	isPending?: boolean;
	errorMessage?: string;
	destructive?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmDialog({
	title,
	description,
	confirmLabel = "확인",
	cancelLabel = "취소",
	pendingLabel = "처리 중...",
	isPending = false,
	errorMessage,
	destructive = true,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const cancelButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		cancelButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isPending) {
				onCancel();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isPending, onCancel]);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-8">
			<button
				type="button"
				aria-label="확인 창 닫기"
				className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
				disabled={isPending}
				onClick={onCancel}
			/>
			<section
				aria-labelledby="confirm-dialog-title"
				aria-describedby={
					description ? "confirm-dialog-description" : undefined
				}
				aria-modal="true"
				className="relative z-10 w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
				role="dialog"
			>
				<h2
					id="confirm-dialog-title"
					className="m-0 text-[17px] font-bold text-[#222222]"
				>
					{title}
				</h2>
				{description ? (
					<p
						id="confirm-dialog-description"
						className="mb-0 mt-2 text-[13px] font-medium leading-[150%] text-[#71717A]"
					>
						{description}
					</p>
				) : null}

				{errorMessage ? (
					<p
						className="mb-0 mt-3 rounded-lg bg-[#FFF1F1] px-3 py-2 text-[12px] font-semibold leading-[140%] text-[#D83A40]"
						aria-live="polite"
					>
						{errorMessage}
					</p>
				) : null}

				<div className="mt-5 grid grid-cols-2 gap-2">
					<button
						type="button"
						ref={cancelButtonRef}
						disabled={isPending}
						onClick={onCancel}
						className="h-10 rounded-xl border-0 bg-[#F0F2F4] text-[13px] font-bold text-[#555D67] disabled:opacity-50"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						aria-busy={isPending}
						disabled={isPending}
						onClick={onConfirm}
						className={`h-10 rounded-xl border-0 text-[13px] font-bold text-white disabled:opacity-50 ${destructive ? "bg-[#E5484D]" : "bg-[#0073FF]"}`}
					>
						{isPending ? pendingLabel : confirmLabel}
					</button>
				</div>
			</section>
		</div>
	);
}
