import heartCharacter from "@/assets/home/heart.png";
import textCharacter from "@/assets/images/ch_text.png";
import type { RankedHomeKeyword } from "@/features/home/api";

const EMPTY_SECONDARY_KEYWORDS = ["empty-1", "empty-2", "empty-3"];

type InsightCardProps = {
	userName: string;
	keywords: RankedHomeKeyword[];
	isLoading?: boolean;
};

export function InsightCard({
	userName,
	keywords,
	isLoading = false,
}: InsightCardProps) {
	const rankedKeywords = [...keywords].sort((a, b) => a.rank - b.rank);
	const hasKeywords = rankedKeywords.length > 0;
	const primaryKeyword = rankedKeywords[0]?.keyword;
	const secondaryKeywords = rankedKeywords.slice(1, 4);
	const displayKeyword = isLoading ? "..." : (primaryKeyword ?? "???");
	const characterImage = hasKeywords ? heartCharacter : textCharacter;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex min-h-[153px] items-center justify-between rounded-[20px] bg-[rgba(0,115,255,0.05)] px-[28px] py-4">
				<div className="min-w-0 max-w-[172px]">
					<p className="m-0 text-[12px] font-medium leading-normal">
						{userName}님의 가장 잘 나타내는 모습은
					</p>
					<strong
						className="mt-2 block max-w-[172px] whitespace-nowrap font-bold leading-none text-[#0073FF]"
						style={{ fontSize: getPrimaryKeywordFontSize(displayKeyword) }}
					>
						{displayKeyword}
					</strong>
					<div className="mt-3 flex max-w-full flex-wrap gap-1">
						{hasKeywords
							? secondaryKeywords.map(({ rank, keyword }) => (
									<KeywordChip
										key={`${rank}-${keyword}`}
										label={`#${keyword}`}
									/>
								))
							: EMPTY_SECONDARY_KEYWORDS.map((keyword) => (
									<KeywordChip key={keyword} label="#???" />
								))}
					</div>
				</div>
				<img
					src={characterImage}
					alt=""
					className={[
						"shrink-0 object-contain object-center",
						hasKeywords ? "h-[121px] w-[98px]" : "h-[124px] w-[118px]",
					].join(" ")}
				/>
			</div>
			{!hasKeywords && !isLoading ? <AnalysisHint /> : null}
		</div>
	);
}

function KeywordChip({ label }: { label: string }) {
	return (
		<span className="max-w-full rounded-[10px] bg-white px-2 py-1 text-[12px] font-bold leading-tight text-black/50 [overflow-wrap:anywhere]">
			{label}
		</span>
	);
}

export function AnalysisHint() {
	return (
		<p className="m-0 pl-4 text-[14px] font-semibold leading-normal text-[#C4C4C4]">
			• 피드백을 받으면 분석할 수 있어요
		</p>
	);
}

function getPrimaryKeywordFontSize(keyword: string) {
	const baseSize = keyword.length >= 5 ? 34 : 38;
	const lengthSafeMaxSize = Math.floor(172 / Math.max(keyword.length, 1));

	return `${Math.max(18, Math.min(baseSize, lengthSafeMaxSize))}px`;
}
