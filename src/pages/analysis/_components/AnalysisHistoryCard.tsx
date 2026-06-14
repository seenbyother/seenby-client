import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";

interface AnalysisHistoryCardProps {
	title: string;
	dateLabel: string;
	statusLabel?: string;
	statusTone?: "blue" | "gray" | "red";
	disabled?: boolean;
	dimmed?: boolean;
	onClick: () => void;
}

export function AnalysisHistoryCard({
	title,
	dateLabel,
	statusLabel,
	statusTone = "gray",
	disabled = false,
	dimmed = false,
	onClick,
}: AnalysisHistoryCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={[
				"w-full text-left bg-white rounded-[20px] p-4 flex items-center justify-between gap-2 border-none cursor-pointer transition-opacity disabled:cursor-default",
				dimmed ? "opacity-45" : "",
			].join(" ")}
		>
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 items-start gap-3">
					<span className="line-clamp-2 min-w-0 text-[20px] font-bold leading-tight text-black">
						{title}
					</span>
					{statusLabel ? (
						<span
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
			<IcChevronRight className="shrink-0" />
		</button>
	);
}

function getStatusToneClassName(tone: AnalysisHistoryCardProps["statusTone"]) {
	switch (tone) {
		case "blue":
			return "bg-[#EAF3FF] text-[#0073FF]";
		case "red":
			return "bg-[#FFECEC] text-[#FF4D4F]";
		default:
			return "bg-[#F3F4F6] text-[#71717A]";
	}
}
