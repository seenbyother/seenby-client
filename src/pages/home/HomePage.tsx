import { useNavigate } from "react-router";
import AlarmIcon from "@/assets/home/alarm.svg?react";
import heartCharacter from "@/assets/home/heart.png";
import MyPageIcon from "@/assets/home/mypage.svg?react";
import { BottomNavigation } from "@/shared/components";

const receivedTags = ["#신중함", "#부지런함", "#상냥한"];

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

export function HomePage() {
	const navigate = useNavigate();

	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="relative mx-auto h-[100svh] w-full max-w-[402px] overflow-hidden bg-[#F8F8F8]">
				<div className="h-full overflow-y-auto px-5 pb-[132px] pt-8">
					<header className="flex items-center justify-between">
						<h1 className="m-0 text-[24px] font-bold leading-none">SeenBy</h1>
						<div className="flex items-center gap-2">
							<IconButton ariaLabel="알림">
								<AlarmIcon aria-hidden="true" />
							</IconButton>
							<IconButton
								ariaLabel="마이페이지"
								onClick={() => navigate("/login")}
							>
								<MyPageIcon aria-hidden="true" />
							</IconButton>
						</div>
					</header>

					<section className="mt-6">
						<h2 className="m-0 text-[28px] font-bold leading-[1.18]">
							민경님,
							<br />
							새로운 <span className="text-[#0073FF]">시선</span>이 도착했어요
						</h2>
					</section>

					<section className="mt-6 flex flex-col gap-5">
						<InsightCard />

						<div className="flex flex-col gap-3 rounded-[20px] bg-white p-4">
							<ActionRow
								icon={<LinkIcon />}
								title="피드백 링크 생성하기"
								description="공유하고 나에 대해서 알아보기"
								onClick={() => navigate("/feedback-group/create")}
							/>
							<ActionRow
								icon={<QuoteIcon />}
								title="나의 한줄 소개 확인하기"
								description="이력서/자소서 한줄 소개가 고민이라면"
								onClick={() => undefined}
							/>
						</div>

						<PerspectiveCard />
					</section>
				</div>

				<BottomNavigation activeTab="home" />
			</div>
		</main>
	);
}

function InsightCard() {
	return (
		<div className="flex min-h-[153px] items-center justify-between rounded-[20px] bg-[rgba(0,115,255,0.05)] px-[28px] py-4">
			<div className="min-w-0">
				<p className="m-0 text-[12px] font-medium leading-normal">
					민경님의 가장 잘 나타내는 모습은
				</p>
				<strong className="mt-2 block text-[38px] font-bold leading-none text-[#0073FF]">
					꼼꼼함
				</strong>
				<div className="mt-3 flex flex-wrap gap-1">
					{receivedTags.map((tag) => (
						<span
							key={tag}
							className="rounded-[10px] bg-white px-1 py-1 text-[12px] font-bold leading-none text-black/50"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
			<img
				src={heartCharacter}
				alt=""
				className="h-[121px] w-[98px] shrink-0 object-contain object-center"
			/>
		</div>
	);
}

function PerspectiveCard() {
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

interface IconButtonProps {
	ariaLabel: string;
	children: React.ReactNode;
	onClick?: () => void;
}

function IconButton({ ariaLabel, children, onClick }: IconButtonProps) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
			className="flex h-6 w-6 items-center justify-center border-0 bg-transparent p-0 text-[#222222]"
		>
			{children}
		</button>
	);
}

interface ActionRowProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	onClick: () => void;
}

function ActionRow({ icon, title, description, onClick }: ActionRowProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex w-full items-center justify-between rounded-2xl border-0 bg-transparent px-[10px] py-4 text-left transition-colors active:bg-[#F4F4F4]"
		>
			<span className="flex min-w-0 items-center gap-[10px]">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#0073FF]">
					{icon}
				</span>
				<span className="min-w-0">
					<span className="block truncate text-[16px] font-bold leading-normal text-black">
						{title}
					</span>
					<span className="block truncate text-[12px] font-normal leading-normal text-black">
						{description}
					</span>
				</span>
			</span>
			<ChevronRightIcon />
		</button>
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

function LinkIcon() {
	return (
		<svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
			<path
				d="M13.4 10.7h-2.7a5.3 5.3 0 0 0 0 10.6h4"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<path
				d="M18.6 21.3h2.7a5.3 5.3 0 1 0 0-10.6h-4"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<path
				d="M12.8 16h6.4"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function QuoteIcon() {
	return (
		<svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
			<path
				d="M9 12h6v5.1c0 4.1-2 6.5-6 7.3v-3.1c1.7-.5 2.6-1.5 2.7-3.1H9V12Zm11 0h6v5.1c0 4.1-2 6.5-6 7.3v-3.1c1.7-.5 2.6-1.5 2.7-3.1H20V12Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function ChevronRightIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			className="h-6 w-6 shrink-0 text-black/50"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="m9 5 7 7-7 7"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
