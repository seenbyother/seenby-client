import type { CSSProperties } from "react";
import type { HomeSelfKeyword, RankedHomeKeyword } from "@/features/home/api";
import { AnalysisHint } from "./InsightCard";

const WORD_SLOTS_BY_COUNT: Record<number, readonly CloudWordSlot[]> = {
	1: ["heroClose"],
	2: ["heroClose", "upperClose"],
	3: ["hero", "topLeft", "topRight"],
	4: ["hero", "topLeft", "topRight", "bottomLeft"],
};

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
			slot: getCloudWordSlot(index, keywords.length),
		}));
	const selfWords = selfKeywords
		.slice(0, 3)
		.map(({ keyword }, index, keywords) => ({
			id: `self-${index}-${keyword}`,
			label: keyword,
			slot: getCloudWordSlot(index, keywords.length),
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

function getCloudWordSlot(index: number, count: number) {
	const slots =
		WORD_SLOTS_BY_COUNT[count] ??
		WORD_SLOTS_BY_COUNT[4] ??
		WORD_SLOTS_BY_COUNT[3] ??
		WORD_SLOTS_BY_COUNT[2] ??
		WORD_SLOTS_BY_COUNT[1] ??
		(["heroClose"] as const);

	return slots[index] ?? "heroClose";
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
			<div className="relative h-[92px] w-full min-w-0 max-w-[136px] overflow-hidden text-[#3A3A3A]">
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
	slot: CloudWordSlot;
};

type CloudSide = "left" | "right";

type CloudWordSlot =
	| "bottomLeft"
	| "hero"
	| "heroClose"
	| "topLeft"
	| "topRight"
	| "upperClose";

function WordCloud({ side, words }: { side: CloudSide; words: CloudWord[] }) {
	return (
		<>
			{words.map((word) => (
				<span
					key={word.id}
					className={[
						"absolute inline-block overflow-hidden text-ellipsis whitespace-nowrap text-center leading-none tracking-normal",
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

function getCloudWordClassName({ slot }: CloudWord) {
	return isHeroSlot(slot)
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
	{ slot }: CloudWord,
	side: CloudSide,
): Pick<CSSProperties, "left" | "maxWidth" | "top"> {
	const position = CLOUD_WORD_POSITIONS[side][slot];

	return {
		left: position.left,
		maxWidth: position.maxWidth,
		top: position.top,
	};
}

function getCloudWordFontSize({ label, slot }: CloudWord) {
	const lengthSafeMaxSize = Math.floor(
		(isHeroSlot(slot) ? 108 : 92) / Math.max(getVisualLabelLength(label), 1),
	);

	if (isHeroSlot(slot)) {
		const baseSize = getHeroWordBaseFontSize(label);

		return `${Math.max(12, Math.min(baseSize, lengthSafeMaxSize))}px`;
	}

	const baseSize = getSecondaryWordBaseFontSize(label, slot);

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

function getSecondaryWordBaseFontSize(label: string, slot: CloudWord["slot"]) {
	if (slot === "bottomLeft") {
		if (label.length >= 7) {
			return 11;
		}

		return label.length >= 5 ? 12 : 14;
	}

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

function isHeroSlot(slot: CloudWord["slot"]) {
	return slot === "hero" || slot === "heroClose";
}

function getVisualLabelLength(label: string) {
	return Array.from(label.trim()).reduce((length, character) => {
		const isAscii = (character.codePointAt(0) ?? 0) <= 0x7f;

		return length + (isAscii ? 0.62 : 1);
	}, 0);
}

const CLOUD_WORD_POSITIONS: Record<
	CloudSide,
	Record<CloudWordSlot, { left: string; maxWidth: string; top: string }>
> = {
	left: {
		bottomLeft: { left: "31%", maxWidth: "58%", top: "81%" },
		hero: { left: "49%", maxWidth: "88%", top: "66%" },
		heroClose: { left: "49%", maxWidth: "88%", top: "58%" },
		topLeft: { left: "30%", maxWidth: "58%", top: "18%" },
		topRight: { left: "70%", maxWidth: "58%", top: "41%" },
		upperClose: { left: "38%", maxWidth: "68%", top: "31%" },
	},
	right: {
		bottomLeft: { left: "35%", maxWidth: "62%", top: "78%" },
		hero: { left: "50%", maxWidth: "88%", top: "67%" },
		heroClose: { left: "50%", maxWidth: "88%", top: "58%" },
		topLeft: { left: "31%", maxWidth: "58%", top: "17%" },
		topRight: { left: "72%", maxWidth: "56%", top: "42%" },
		upperClose: { left: "61%", maxWidth: "68%", top: "30%" },
	},
};
