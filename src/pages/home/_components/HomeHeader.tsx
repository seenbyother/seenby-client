import { type CSSProperties, useEffect, useState } from "react";

import IcChevronRight from "@/assets/icons/ic_chevron_right.svg?react";
import MyIcon from "@/assets/icons/my.svg?react";

interface HomeHeaderProps {
	onAccountClick: () => void;
}

const LOGO_VARIANTS = [
	{ id: "underline", name: "A · 라인 드로우" },
	{ id: "bounce", name: "B · 바운스" },
	{ id: "ripple", name: "C · 리플" },
	{ id: "typing", name: "D · 타이핑" },
] as const;

const RIPPLE_LETTERS = [
	{ id: "s", value: "S" },
	{ id: "e-first", value: "e" },
	{ id: "e-second", value: "e" },
	{ id: "n", value: "n" },
	{ id: "b", value: "B" },
	{ id: "y", value: "y" },
] as const;

const TYPING_WORD = "SeenBy";

type LogoVariant = (typeof LOGO_VARIANTS)[number]["id"];

function TypingLogo() {
	const [characterCount, setCharacterCount] = useState(0);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setCharacterCount(TYPING_WORD.length);
			return;
		}

		let timeoutId: number;
		let nextCharacterCount = 0;

		const typeNextCharacter = () => {
			nextCharacterCount += 1;
			setCharacterCount(nextCharacterCount);

			if (nextCharacterCount < TYPING_WORD.length) {
				timeoutId = window.setTimeout(typeNextCharacter, 165);
				return;
			}

			timeoutId = window.setTimeout(() => {
				nextCharacterCount = 0;
				setCharacterCount(0);
				timeoutId = window.setTimeout(typeNextCharacter, 500);
			}, 1800);
		};

		timeoutId = window.setTimeout(typeNextCharacter, 450);

		return () => window.clearTimeout(timeoutId);
	}, []);

	const visibleWord = TYPING_WORD.slice(0, characterCount);
	const seenText = visibleWord.slice(0, 4);
	const byText = visibleWord.slice(4);

	return (
		<h1 className="seenby-logo seenby-logo--typing m-0" aria-label="SeenBy">
			<span className="seenby-logo__typing-sizer" aria-hidden="true">
				{TYPING_WORD}
			</span>
			<span className="seenby-logo__typing-live" aria-hidden="true">
				<span>{seenText}</span>
				<span className="seenby-logo__typing-accent">{byText}</span>
				<span className="seenby-logo__typing-caret" />
			</span>
		</h1>
	);
}

function SeenByLogo({ variant }: { variant: LogoVariant }) {
	if (variant === "underline") {
		return (
			<h1
				className="seenby-logo seenby-logo--underline m-0"
				aria-label="SeenBy"
			>
				<span aria-hidden="true">SeenBy</span>
			</h1>
		);
	}

	if (variant === "bounce") {
		return (
			<h1 className="seenby-logo seenby-logo--bounce m-0" aria-label="SeenBy">
				<span aria-hidden="true">Seen</span>
				<span className="seenby-logo__bounce-by" aria-hidden="true">
					By
				</span>
			</h1>
		);
	}

	if (variant === "ripple") {
		return (
			<h1 className="seenby-logo seenby-logo--ripple m-0" aria-label="SeenBy">
				{RIPPLE_LETTERS.map((letter, index) => (
					<span
						key={letter.id}
						className="seenby-logo__ripple-letter"
						style={{ "--letter-index": index } as CSSProperties}
						aria-hidden="true"
					>
						{letter.value}
					</span>
				))}
			</h1>
		);
	}

	return <TypingLogo />;
}

export function HomeHeader({ onAccountClick }: HomeHeaderProps) {
	const [logoIndex, setLogoIndex] = useState(0);
	const activeLogo = LOGO_VARIANTS[logoIndex];

	const showNextLogo = () => {
		setLogoIndex((currentIndex) => (currentIndex + 1) % LOGO_VARIANTS.length);
	};

	return (
		<header className="flex items-center justify-between">
			<div className="flex min-w-0 items-center gap-2">
				<SeenByLogo key={activeLogo.id} variant={activeLogo.id} />
				<button
					type="button"
					onClick={showNextLogo}
					aria-label={`다음 로고 시안 보기. 현재 ${activeLogo.name}`}
					className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-0 bg-[#EDF6FF] p-0 shadow-[0_2px_8px_rgba(0,115,255,0.12)] transition-[background-color,transform,box-shadow] active:scale-90 active:bg-[#DCEEFF] active:shadow-none"
				>
					<IcChevronRight width={14} height={14} aria-hidden="true" />
				</button>
			</div>
			<button
				type="button"
				aria-label="마이페이지 열기"
				onClick={onAccountClick}
				className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#222222] transition-colors active:bg-black/5"
			>
				<MyIcon width={24} height={24} aria-hidden="true" />
			</button>
		</header>
	);
}
