import energizerCharacter from "@/assets/analysis/ENERGIZER.png";
import explorerCharacter from "@/assets/analysis/EXPLORER.png";
import helperCharacter from "@/assets/analysis/HELPER.png";
import pioneerCharacter from "@/assets/analysis/PIONEER.png";
import reliableCharacter from "@/assets/analysis/RELIABLE.png";
import thinkerCharacter from "@/assets/analysis/THINKER.png";
import type { AnalysisViewModel } from "../model";
import { ComparisonTable } from "./ComparisonTable";
import { KeywordChart } from "./KeywordChart";
import { SelfAwarenessSection } from "./SelfAwarenessSection";

export function SummarySection({ data }: { data: AnalysisViewModel }) {
	return (
		<Card title="전체 피드백 요약">
			<p className="m-0 text-[20px] font-bold leading-[1.45] text-[#14171C]">
				{data.summary}
			</p>
			<div className="mt-7 flex flex-col gap-5">
				{data.strengths.map((item, index) => (
					<div key={item.title} className="flex items-center gap-4">
						<span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#EDF6FF] text-[14px] font-bold text-[#0073FF]">
							{String(index + 1).padStart(2, "0")}
						</span>
						<div>
							<p className="m-0 text-[16px] font-bold text-[#14171C]">
								{item.title}
							</p>
							<p className="mb-0 mt-1 text-[13px] text-[#6E737D]">
								{item.description}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="mt-7 border-t border-[#E3E8F0] pt-4">
				<p className="m-0 text-[13px] font-bold text-[#0073FF]">
					더 성장할 부분
				</p>
				<p className="mb-0 mt-1 text-[15px] font-bold text-[#14171C]">
					{data.growthSummary}
				</p>
			</div>
		</Card>
	);
}

export function KeywordsSection({
	data,
	animated = false,
}: {
	data: AnalysisViewModel;
	animated?: boolean;
}) {
	return (
		<Card title="가장 많이 받은 키워드 Top 10">
			<KeywordChart keywords={data.keywords} animated={animated} />
		</Card>
	);
}

export function InsightSection({ data }: { data: AnalysisViewModel }) {
	return (
		<Card title="분석 인사이트">
			<div className="rounded-[14px] bg-[#EDF6FF] px-[18px] py-5 text-[16px] font-bold leading-[1.55] text-[#14171C]">
				{data.insightSummary}
			</div>
			<div className="mt-5 flex flex-col gap-6">
				{data.insights.map((item) => (
					<div key={item.title}>
						<p className="m-0 text-[13px] font-bold text-[#0073FF]">
							{item.title}
						</p>
						<p className="mb-0 mt-1 text-[15px] font-semibold leading-[1.5] text-[#14171C]">
							{item.content}
						</p>
					</div>
				))}
			</div>
		</Card>
	);
}

export function SelfAwarenessCard({
	data,
	animated = false,
}: {
	data: AnalysisViewModel;
	animated?: boolean;
}) {
	return (
		<Card title="자기 인식 일치도">
			<SelfAwarenessSection
				percentage={data.selfAwareness}
				animated={animated}
			/>
		</Card>
	);
}

export function ComparisonSection({ data }: { data: AnalysisViewModel }) {
	return (
		<Card title="나 vs 타인이 보는 나">
			<ComparisonTable rows={data.comparisonRows} />
		</Card>
	);
}

export function ActionPlanSection({
	data,
	variant = "scroll",
}: {
	data: AnalysisViewModel;
	variant?: "step" | "scroll";
}) {
	return (
		<Card title="액션플랜" badge="4주간 매주 반복">
			<ol className="m-0 flex list-none flex-col p-0 pt-[10px]">
				{data.actions.map((action, index) => {
					const isLastAction = index === data.actions.length - 1;
					return (
						<li
							key={action.title}
							className={`flex gap-4 ${isLastAction && variant === "scroll" ? "h-[68px]" : "h-[91px]"}`}
						>
							<span className="flex h-[42px] w-[58px] shrink-0 items-center justify-center rounded-xl bg-[#EDF6FF] text-[12px] font-bold text-[#0073FF]">
								습관 {String(index + 1).padStart(2, "0")}
							</span>
							<div
								className={`h-[69px] min-w-0 flex-1 ${isLastAction ? "" : "border-b border-[#E3E8F0]"}`}
							>
								<p className="m-0 text-[16px] font-bold text-[#14171C]">
									{action.title}
								</p>
								<p className="mb-0 mt-1 text-[13px] leading-[1.5] text-[#6E737D]">
									{action.description}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
			<div
				className={`${variant === "step" ? "mt-[11px]" : "mt-0"} rounded-[14px] bg-[#FAFAFC] px-[14px] py-[10px]`}
			>
				<p className="m-0 text-[12px] font-bold text-[#0073FF]">
					매주 점검하기
				</p>
				<p className="mb-0 mt-1 text-[13px] text-[#6E737D]">
					{data.reviewGuide}
				</p>
			</div>
		</Card>
	);
}

const TYPE_CHARACTER: Record<AnalysisViewModel["finalType"]["code"], string> = {
	PIONEER: pioneerCharacter,
	RELIABLE: reliableCharacter,
	EXPLORER: explorerCharacter,
	HELPER: helperCharacter,
	THINKER: thinkerCharacter,
	ENERGIZER: energizerCharacter,
};

export function FinalTypeSection({
	data,
	variant = "card",
}: {
	data: AnalysisViewModel;
	variant?: "reveal" | "card";
}) {
	const character = TYPE_CHARACTER[data.finalType.code];
	if (variant === "reveal") {
		return (
			<section className="mx-auto h-[600px] w-full max-w-[362px] text-center">
				<CharacterVisual
					character={character}
					name={data.finalType.name}
					size="large"
				/>
				<h2 className="mb-0 mt-[22px] text-[27px] font-bold leading-normal text-[#0F141F]">
					{data.finalType.name}
				</h2>
				<p className="mb-0 mt-[10px] text-[14px] text-[#616B7D]">
					{data.finalType.description}
				</p>
				<div className="mx-auto mt-[22px] h-9 w-[240px] rounded-full bg-[#EBF5FF] px-5 text-[12px] font-semibold leading-9 text-[#0A66E5]">
					{data.finalType.traits.join("   ·   ")}
				</div>
				<div className="mt-6 text-left">
					<RevealResultLine
						number="01"
						label="강점"
						text={data.finalType.strength}
					/>
					<RevealResultLine
						number="02"
						label="성장 포인트"
						text={data.finalType.growthPoint}
					/>
				</div>
			</section>
		);
	}

	return (
		<section className="h-[390px] overflow-hidden rounded-[24px] border border-[#EBEDF2] bg-white text-center">
			<div className="mt-[15px]">
				<CharacterVisual
					character={character}
					name={data.finalType.name}
					size="small"
				/>
			</div>
			<h2 className="mb-0 mt-[26px] text-[24px] font-bold leading-normal text-[#0F141F]">
				{data.finalType.name}
			</h2>
			<div className="mx-auto mt-[17px] h-[34px] w-[250px] rounded-full bg-[#EDF7FF] px-5 text-[12px] font-semibold leading-[34px] text-[#0A66E5]">
				{data.finalType.traits.join(" · ")}
			</div>
			<div className="mx-[23px] mt-5 grid grid-cols-2 border-t border-[#E5EBF0] pt-[18px] text-left">
				<CardResultColumn label="강점" text={data.finalType.strength} />
				<CardResultColumn
					label="성장 포인트"
					text={data.finalType.growthPoint}
					className="border-l border-[#EBEDF2] pl-3"
				/>
			</div>
		</section>
	);
}

function CharacterVisual({
	character,
	name,
	size,
}: {
	character: string;
	name: string;
	size: "large" | "small";
}) {
	const large = size === "large";
	return (
		<div
			className={`relative mx-auto ${large ? "h-[236px] w-[299px]" : "h-[130px] w-[165px]"}`}
		>
			<div
				className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/15 blur-[5px] ${large ? "h-[18px] w-[150px]" : "h-[14px] w-[112px]"}`}
			/>
			<img
				src={character}
				alt={`${name} 캐릭터`}
				className="absolute inset-0 h-full w-full object-contain"
			/>
		</div>
	);
}

function RevealResultLine({
	number,
	label,
	text,
}: {
	number: string;
	label: string;
	text: string;
}) {
	return (
		<div className="flex min-h-[86px] gap-[10px] border-b border-[#E0E5ED] py-[3px] last:border-0 last:pt-[17px]">
			<span className="w-[38px] shrink-0 text-[24px] font-bold text-[#0A73FF]">
				{number}
			</span>
			<div className="pt-[1px]">
				<p className="m-0 text-[12px] font-bold text-[#0A73FF]">{label}</p>
				<p className="mb-0 mt-[7px] text-[13px] font-semibold leading-5 text-[#262B36]">
					{text}
				</p>
			</div>
		</div>
	);
}

function CardResultColumn({
	label,
	text,
	className = "pr-3",
}: {
	label: string;
	text: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<p className="m-0 text-[12px] font-bold text-[#0A73FF]">{label}</p>
			<p className="mb-0 mt-[7px] line-clamp-2 text-[12px] leading-[18px] text-[#3B424F]">
				{text}
			</p>
		</div>
	);
}

export function UsedFeedbackSection({
	data,
	onSelect,
}: {
	data: AnalysisViewModel;
	onSelect: (id: number) => void;
}) {
	return (
		<Card title="분석에 사용한 피드백" badge={`${data.usedFeedbacks.length}개`}>
			<div className="-mt-2 divide-y divide-[#E3E8F0]">
				{data.usedFeedbacks.map((feedback) => (
					<button
						key={feedback.id}
						type="button"
						onClick={() => onSelect(feedback.id)}
						className="flex h-16 w-full items-center justify-between border-0 bg-transparent px-0 text-left text-[15px] font-semibold text-[#14171C]"
					>
						{feedback.displayName}
						<span
							aria-hidden="true"
							className="text-[22px] font-normal text-[#A1A9B2]"
						>
							›
						</span>
					</button>
				))}
			</div>
		</Card>
	);
}

function Card({
	title,
	badge,
	children,
}: {
	title: string;
	badge?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-[20px] bg-white p-[18px]">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="m-0 text-[17px] font-bold text-[#14171C]">{title}</h2>
				{badge ? (
					<span className="rounded-full bg-[#EDF6FF] px-3 py-1.5 text-[12px] font-bold text-[#0073FF]">
						{badge}
					</span>
				) : null}
			</div>
			{children}
		</section>
	);
}
