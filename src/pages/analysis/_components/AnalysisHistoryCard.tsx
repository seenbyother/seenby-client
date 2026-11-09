import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";

interface AnalysisHistoryCardProps {
	title: string;
	dateLabel: string;
	statusLabel?: string;
	statusTone?: "blue" | "gray" | "red";
	isProcessing?: boolean;
	disabled?: boolean;
	message?: string;
	actionLabel?: string;
	onAction?: () => void;
	onClick: () => void;
}

export function AnalysisHistoryCard({
	title,
	dateLabel,
	statusLabel,
	statusTone = "gray",
	isProcessing = false,
	disabled = false,
	message,
	actionLabel,
	onAction,
	onClick,
}: AnalysisHistoryCardProps) {
	const hasFooter = Boolean(message || (actionLabel && onAction));

	return (
		<article
			className={[
				"w-full overflow-hidden rounded-[20px] bg-white transition-opacity",
				isProcessing ? "generation-processing-card" : "",
			].join(" ")}
		>
			<button
				type="button"
				onClick={onClick}
				disabled={disabled}
				aria-busy={isProcessing || undefined}
				className="flex w-full cursor-pointer items-center justify-between gap-2 border-none bg-transparent p-4 text-left disabled:cursor-default"
			>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="flex min-w-0 items-start gap-3">
						<span className="line-clamp-2 min-w-0 text-[20px] font-bold leading-tight text-black">
							{title}
						</span>
						{statusLabel ? (
							<span
								role="status"
								className={[
									"mt-[3px] shrink-0 rounded-full px-2 py-1 text-[11px] font-bold leading-none",
									getStatusToneClassName(statusTone),
								].join(" ")}
							>
								{statusLabel}
							</span>
						) : null}
					</div>
					<span className="text-[16px] text-black">{dateLabel}</span>
				</div>
				{disabled ? null : <IcChevronRight className="shrink-0" />}
			</button>

			{hasFooter ? (
				<div
					className={[
						"mx-4 mb-4 flex min-h-9 items-center gap-2.5 rounded-xl px-3 py-2",
						statusTone === "red" ? "bg-[#FFF5F5]" : "bg-[#F5F8FC]",
					].join(" ")}
				>
					{message ? (
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<span
								aria-hidden="true"
								className={[
									"h-1.5 w-1.5 shrink-0 rounded-full",
									statusTone === "red" ? "bg-[#F05B61]" : "bg-[#2884F6]",
									isProcessing && !actionLabel ? "animate-pulse" : "",
								].join(" ")}
							/>
							<p
								role="status"
								className={[
									"m-0 min-w-0 flex-1 text-[12px] font-medium leading-[1.35]",
									statusTone === "red" ? "text-[#8C4145]" : "text-[#596579]",
								].join(" ")}
							>
								{message}
							</p>
						</div>
					) : null}
					{actionLabel && onAction ? (
						<button
							type="button"
							onClick={onAction}
							className="inline-flex h-7 shrink-0 items-center gap-1 rounded-lg border-none bg-white px-2 text-[11px] font-bold leading-none text-[#1476FF] shadow-[0_1px_3px_rgba(20,118,255,0.12)] active:bg-[#EAF3FF]"
						>
							<svg
								aria-hidden="true"
								className="h-3 w-3"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M13 4.75V2.5m0 2.25h-2.25M13 4.75A5.5 5.5 0 1 0 13.35 10"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							{actionLabel}
						</button>
					) : null}
				</div>
			) : null}
		</article>
	);
}

function getStatusToneClassName(tone: AnalysisHistoryCardProps["statusTone"]) {
	switch (tone) {
		case "blue":
			return "bg-[#EDF5FF] text-[#1476FF]";
		case "red":
			return "bg-[#FFECEC] text-[#FF4D4F]";
		default:
			return "bg-[#F3F4F6] text-[#71717A]";
	}
}
