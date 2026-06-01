const othersWords = [
	{ label: "계획적", className: "left-0 top-[2px] text-[20px]" },
	{ label: "분석적", className: "left-[71px] top-[5px] text-[16px]" },
	{ label: "긍정적", className: "left-[53px] top-[36px] text-[30px]" },
	{ label: "말이 많다", className: "left-2 top-[45px] text-[10px]" },
];

const selfWords = [
	{ label: "게으름", className: "left-0 top-[2px] text-[20px]" },
	{ label: "긍정적", className: "left-[71px] top-[5px] text-[16px]" },
	{ label: "급하다", className: "left-[28px] top-[35px] text-[30px]" },
];

export function PerspectiveCard() {
	return (
		<div className="rounded-2xl bg-white px-4 py-5">
			<h3 className="m-0 text-[20px] font-semibold leading-normal">
				서로의 시선은 이렇게 달라요
			</h3>

			<div className="mt-4 grid grid-cols-[1fr_33px_1fr] items-center gap-3">
				<PerspectiveColumn
					badge="타인이 경험한 나"
					badgeClassName="bg-[rgba(0,115,255,0.11)] text-[#0073FF]"
					arrowClassName="bg-[#E1F0FF]"
					words={othersWords}
				/>
				<div className="relative flex h-[145px] items-center justify-center">
					<div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#EFEFEF]" />
					<div className="relative z-10 flex h-[33px] w-[33px] items-center justify-center rounded-full bg-white text-[12px] font-bold text-[#616161] shadow-[0_0_2px_rgba(0,0,0,0.12)]">
						VS
					</div>
				</div>
				<PerspectiveColumn
					badge="내가 생각하는 나"
					badgeClassName="bg-black/10 text-black/70"
					arrowClassName="bg-[#E5E5E5]"
					words={selfWords}
				/>
			</div>
		</div>
	);
}

interface PerspectiveColumnProps {
	badge: string;
	badgeClassName: string;
	arrowClassName: string;
	words: { label: string; className: string }[];
}

function PerspectiveColumn({
	badge,
	badgeClassName,
	arrowClassName,
	words,
}: PerspectiveColumnProps) {
	return (
		<div className="flex min-w-0 flex-col items-center gap-5">
			<div className="relative h-[30px] w-[104px]">
				<div
					className={[
						"flex h-[25px] items-center justify-center rounded-2xl px-[10px] py-[5px] text-[12px] font-semibold leading-none",
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
			<div className="relative h-[68px] w-[136px] text-black/80">
				{words.map((word) => (
					<span
						key={word.label}
						className={`absolute whitespace-nowrap leading-none ${word.className}`}
					>
						{word.label}
					</span>
				))}
			</div>
		</div>
	);
}
