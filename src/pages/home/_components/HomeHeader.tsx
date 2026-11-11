import type { CSSProperties } from "react";

import MyIcon from "@/assets/icons/my.svg?react";

interface HomeHeaderProps {
	onAccountClick: () => void;
}

const LOGO_LETTERS = [
	{ id: "s", value: "S" },
	{ id: "e-first", value: "e" },
	{ id: "e-second", value: "e" },
	{ id: "n", value: "n" },
	{ id: "b", value: "B" },
	{ id: "y", value: "y" },
] as const;

function SeenByLogo() {
	return (
		<h1 className="seenby-logo seenby-logo--wave m-0" aria-label="SeenBy">
			{LOGO_LETTERS.map((letter, index) => (
				<span
					key={letter.id}
					className="seenby-logo__wave-letter"
					style={{ "--letter-index": index } as CSSProperties}
					aria-hidden="true"
				>
					{letter.value}
				</span>
			))}
		</h1>
	);
}

export function HomeHeader({ onAccountClick }: HomeHeaderProps) {
	return (
		<header className="flex items-center justify-between">
			<SeenByLogo />
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
