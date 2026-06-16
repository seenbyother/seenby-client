import type { CSSProperties } from "react";
import type { HomeSelfKeyword, RankedHomeKeyword } from "@/features/home/api";
import { AnalysisHint } from "./InsightCard";

export function PerspectiveCard({
	otherKeywords,
	selfKeywords,
}: PerspectiveCardProps) {
	const hasOtherKeywords = otherKeywords.length > 0;
	const otherWords = [...otherKeywords]
		.sort((a, b) => a.rank - b.rank)
		.slice(0, 4)
		.map(({ keyword }, index, keywords) => ({
			id: `other-${index}-${keyword}`,
			label: keyword,
			rowIndex: index,
			rowCount: keywords.length,
		}));
	const selfWords = selfKeywords
		.slice(0, 3)
		.map(({ keyword }, index, keywords) => ({
			id: `self-${index}-${keyword}`,
			label: keyword,
			rowIndex: index,
			rowCount: keywords.length,
		}));

	return (
		<div className="flex flex-col gap-3">
			<div className="rounded-2xl bg-white px-4 py-5">
				<h3 className="m-0 text-[20px] font-semibold leading-normal">
					서로의 시선은 이렇게 달라요
				</h3>

				<div className="mt-3 grid grid-cols-[minmax(0,1fr)_33px_minmax(0,1fr)] items-center gap-3">
					<PerspectiveColumn
						badge="타인이 경험한 나"
						badgeClassName="bg-[rgba(0,115,255,0.11)] text-[#0073FF]"
						arrowClassName="bg-[#E1F0FF]"
						emptyText="???"
						side="left"
						words={otherWords}
					/>
					<div className="relative flex h-[128px] items-center justify-center">
						<div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#EFEFEF]" />
						<div className="relative z-[1] flex h-[33px] w-[33px] items-center justify-center rounded-full bg-white text-[12px] font-bold text-[#616161] shadow-[0_0_2px_rgba(0,0,0,0.12)]">
							VS
						</div>
					</div>
					<PerspectiveColumn
						badge="내가 생각하는 나"
						badgeClassName="bg-black/10 text-black/70"
						arrowClassName="bg-[#E5E5E5]"
						emptyText="선택 전"
						side="right"
						words={selfWords}
					/>
				</div>
			</div>
			{!hasOtherKeywords ? <AnalysisHint /> : null}
		</div>
	);
}

interface PerspectiveCardProps {
	otherKeywords: RankedHomeKeyword[];
	selfKeywords: HomeSelfKeyword[];
}

interface PerspectiveColumnProps {
	badge: string;
	badgeClassName: string;
	arrowClassName: string;
	emptyText: string;
	side: CloudSide;
	words: CloudWord[];
}

function PerspectiveColumn({
	badge,
	badgeClassName,
	arrowClassName,
	emptyText,
	side,
	words,
}: PerspectiveColumnProps) {
	return (
		<div className="flex min-w-0 flex-col items-center gap-3">
			<div className="relative h-[30px] w-full max-w-[124px]">
				<div
					className={[
						"flex h-[25px] items-center justify-center truncate rounded-2xl px-[10px] py-[5px] text-[12px] font-semibold leading-none",
						badgeClassName,
					].join(" ")}
				>
					{badge}
				</div>
				<div
					className={[
						"absolute left-1/2 top-[20px] h-3 w-3 -translate-x-1/2 rotate-45",
						arrowClassName,
					].join(" ")}
				/>
			</div>
			<div className="relative h-[116px] w-full min-w-0 max-w-[136px] overflow-hidden text-[#3A3A3A]">
				{words.length > 0 ? (
					<WordCloud side={side} words={words} />
				) : (
					<span className="absolute left-1/2 top-1/2 whitespace-nowrap text-[14px] font-semibold text-black/30 [transform:translate(-50%,-50%)]">
						{emptyText}
					</span>
				)}
			</div>
		</div>
	);
}

type CloudWord = {
	id: string;
	label: string;
	rowCount: number;
	rowIndex: number;
};

type CloudSide = "left" | "right";

function WordCloud({ side, words }: { side: CloudSide; words: CloudWord[] }) {
	return (
		<>
			{words.map((word) => (
				<span
					key={word.id}
					className={[
						"absolute inline-block overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[1.08] tracking-normal",
						getCloudWordClassName(word),
					].join(" ")}
					style={getCloudWordStyle(word, side)}
				>
					{word.label}
				</span>
			))}
		</>
	);
}

function getCloudWordClassName({ rowIndex }: CloudWord) {
	return rowIndex === 0
		? "font-normal text-[#333333]"
		: "font-normal text-[#3A3A3A]";
}

function getCloudWordStyle(word: CloudWord, side: CloudSide): CSSProperties {
	return {
		fontSize: getCloudWordFontSize(word),
		transform: "translate(-50%, -50%)",
		...getCloudWordPosition(word, side),
	};
}

function getCloudWordPosition(
	{ rowCount, rowIndex }: CloudWord,
	side: CloudSide,
): Pick<CSSProperties, "left" | "maxWidth" | "top"> {
	const rows = CLOUD_WORD_LAYOUTS[Math.min(Math.max(rowCount, 1), 4)];
	const row = rows[rowIndex] ?? rows[rows.length - 1];
	const position = row[side];

	return {
		left: position.left,
		maxWidth: position.maxWidth,
		top: row.top,
	};
}

function getCloudWordFontSize({ label, rowIndex }: CloudWord) {
	const lengthSafeMaxSize = Math.floor(
		(rowIndex === 0 ? 108 : 92) / Math.max(getVisualLabelLength(label), 1),
	);

	if (rowIndex === 0) {
		const baseSize = getHeroWordBaseFontSize(label);

		return `${Math.max(12, Math.min(baseSize, lengthSafeMaxSize))}px`;
	}

	const baseSize = getSecondaryWordBaseFontSize(label);

	return `${Math.max(10, Math.min(baseSize, lengthSafeMaxSize))}px`;
}

function getHeroWordBaseFontSize(label: string) {
	if (label.length >= 7) {
		return 18;
	}

	if (label.length >= 6) {
		return 18;
	}

	if (label.length >= 5) {
		return 20;
	}

	if (label.length >= 4) {
		return 24;
	}

	return 30;
}

function getSecondaryWordBaseFontSize(label: string) {
	if (label.length >= 8) {
		return 12;
	}

	if (label.length >= 5) {
		return 14;
	}

	if (label.length >= 4) {
		return 15;
	}

	return 20;
}

function getVisualLabelLength(label: string) {
	return Array.from(label.trim()).reduce((length, character) => {
		const isAscii = (character.codePointAt(0) ?? 0) <= 0x7f;

		return length + (isAscii ? 0.62 : 1);
	}, 0);
}

const CLOUD_WORD_LAYOUTS: Record<
	number,
	readonly {
		top: string;
		left: { left: string; maxWidth: string };
		right: { left: string; maxWidth: string };
	}[]
> = {
	1: [
		{
			top: "50%",
			left: { left: "49%", maxWidth: "88%" },
			right: { left: "50%", maxWidth: "88%" },
		},
	],
	2: [
		{
			top: "34%",
			left: { left: "38%", maxWidth: "68%" },
			right: { left: "62%", maxWidth: "68%" },
		},
		{
			top: "66%",
			left: { left: "68%", maxWidth: "62%" },
			right: { left: "32%", maxWidth: "62%" },
		},
	],
	3: [
		{
			top: "23%",
			left: { left: "36%", maxWidth: "66%" },
			right: { left: "64%", maxWidth: "66%" },
		},
		{
			top: "50%",
			left: { left: "68%", maxWidth: "62%" },
			right: { left: "32%", maxWidth: "62%" },
		},
		{
			top: "77%",
			left: { left: "42%", maxWidth: "68%" },
			right: { left: "58%", maxWidth: "68%" },
		},
	],
	4: [
		{
			top: "16%",
			left: { left: "36%", maxWidth: "66%" },
			right: { left: "64%", maxWidth: "66%" },
		},
		{
			top: "39%",
			left: { left: "69%", maxWidth: "60%" },
			right: { left: "31%", maxWidth: "60%" },
		},
		{
			top: "62%",
			left: { left: "42%", maxWidth: "66%" },
			right: { left: "58%", maxWidth: "66%" },
		},
		{
			top: "85%",
			left: { left: "65%", maxWidth: "62%" },
			right: { left: "35%", maxWidth: "62%" },
		},
	],
};
