import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";
import type { FeedbackItem } from "./_components/FeedbackCard";

const MOCK_FEEDBACKS: Record<number, FeedbackItem[]> = {
	2: [
		{ id: 1, name: "김연우", isReviewed: true, hasReflection: true },
		{ id: 2, name: "이지현", isReviewed: true, hasReflection: true },
		{ id: 3, name: "박민준", isReviewed: true, hasReflection: true },
		{ id: 4, name: "최서연", isReviewed: true, hasReflection: true },
	],
};

type Step = "selectFeedback" | "selectSelfKeywords";
type SelfKeywordCategoryId = "mood" | "relationship" | "tendency";

type SelfKeywordCategory = {
	id: SelfKeywordCategoryId;
	title: string;
	description: string;
	keywords: string[];
};

const SELF_KEYWORD_CATEGORIES: SelfKeywordCategory[] = [
	{
		id: "mood",
		title: "분위기",
		description: "평소 나의 첫인상이나 분위기에 가까운 단어를 골라주세요",
		keywords: [
			"유쾌한",
			"차분한",
			"활동적인",
			"행복한",
			"따뜻한",
			"친절한",
			"상냥한",
			"외향적인",
			"내향적인",
			"수줍어하는",
			"똑똑한",
			"품위있는",
			"강한 인상",
			"낙천적인",
			"긴장한",
			"감정적인",
			"관대한",
		],
	},
	{
		id: "relationship",
		title: "관계",
		description: "성격이나 사람을 대하는 모습과 가까운 단어를 골라주세요",
		keywords: [
			"믿음직한",
			"도움이 되는",
			"철저한",
			"마음이 넓은",
			"동정심 있는",
			"솔직한",
			"조심성 있는",
			"융통성 있는",
			"성숙한",
			"자기 주장이 강한",
			"참을성 있는",
			"논리적인",
			"실용적인",
			"겸손한",
			"독립적인",
			"민감한",
			"자발적인",
			"생각이 깊은",
		],
	},
	{
		id: "tendency",
		title: "성향",
		description: "성격이나 가치관에 가까운 단어를 골라주세요",
		keywords: [
			"재능있는",
			"영리한",
			"독창적인",
			"재치있는",
			"총명한",
			"박식한",
			"지혜가 있는",
			"용기있는",
			"적극적인",
			"자신감 있는",
			"이상주의적인",
			"엄격한",
			"양향적인",
			"자의식이 강한",
			"까다로운",
			"어리숙함",
		],
	},
];

export function GroupAnalysisPage() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const [step, setStep] = useState<Step>("selectFeedback");
	const [openCategoryId, setOpenCategoryId] =
		useState<SelfKeywordCategoryId>("mood");
	const [selectedSelfKeywords, setSelectedSelfKeywords] = useState<Set<string>>(
		() => new Set(),
	);

	const id = Number(groupId);
	const feedbacks = MOCK_FEEDBACKS[id] ?? [];

	const [selectedIds, setSelectedIds] = useState<Set<number>>(
		() => new Set(feedbacks.map((f) => f.id)),
	);

	const allSelected =
		feedbacks.length > 0 && selectedIds.size === feedbacks.length;

	const toggleAll = () => {
		setSelectedIds(
			allSelected ? new Set() : new Set(feedbacks.map((f) => f.id)),
		);
	};

	const toggleItem = (itemId: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(itemId)) next.delete(itemId);
			else next.add(itemId);
			return next;
		});
	};

	const toggleSelfKeyword = (keyword: string) => {
		setSelectedSelfKeywords((prev) => {
			const next = new Set(prev);
			if (next.has(keyword)) next.delete(keyword);
			else next.add(keyword);
			return next;
		});
	};

	if (step === "selectSelfKeywords") {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
				<header className="flex items-center px-5 py-[10px]">
					<button
						type="button"
						onClick={() => setStep("selectFeedback")}
						className="bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
						aria-label="뒤로 가기"
					>
						<IcArrowLeft width={32} height={32} />
					</button>
				</header>

				<div className="flex-1 overflow-y-auto px-5 mt-4 pb-36">
					<h1 className="m-0 whitespace-pre-line text-[26px] font-bold leading-[135%] text-black">
						내가 생각하는{"\n"}나의 모습을 골라주세요
					</h1>
					<p className="mt-3 mb-0 text-[15px] font-medium leading-[150%] text-[#696969]">
						AI 분석에서 비교할 자기 인식 키워드로 사용돼요
					</p>

					<div className="mt-7 flex flex-col gap-3">
						{SELF_KEYWORD_CATEGORIES.map((category) => (
							<SelfKeywordSection
								key={category.id}
								category={category}
								isOpen={openCategoryId === category.id}
								selectedKeywords={selectedSelfKeywords}
								onToggleOpen={() => setOpenCategoryId(category.id)}
								onToggleKeyword={toggleSelfKeyword}
							/>
						))}
					</div>
				</div>

				<div className="absolute bottom-10 right-5">
					<button
						type="button"
						onClick={() => navigate(`/groups/${id}`)}
						disabled={selectedSelfKeywords.size === 0}
						className="flex items-center gap-[10px] px-5 py-[14px] rounded-[60px] border-none cursor-pointer disabled:cursor-not-allowed"
						style={{
							background: selectedSelfKeywords.size > 0 ? "#0073FF" : "#A9A9A9",
							boxShadow: "0px 0px 3.1px 1px rgba(0,0,0,0.25)",
						}}
					>
						<span
							className="text-[16px] font-medium"
							style={{ color: "#EDF0FF" }}
						>
							제출 하기 →
						</span>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			{/* Header */}
			<header className="flex items-center px-5 py-[10px]">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
					aria-label="뒤로 가기"
				>
					<IcArrowLeft width={32} height={32} />
				</button>
			</header>

			{/* Content */}
			<div className="flex flex-col gap-3 px-5 mt-4 pb-36">
				{/* 전체 선택 */}
				<button
					type="button"
					onClick={toggleAll}
					className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
				>
					<CircleCheckbox checked={allSelected} />
					<span className="text-[16px] font-medium text-black leading-[21px]">
						전체 선택
					</span>
				</button>

				{/* 피드백 목록 */}
				<div className="flex flex-col gap-5">
					{feedbacks.map((feedback) => (
						<button
							key={feedback.id}
							type="button"
							onClick={() => toggleItem(feedback.id)}
							className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
						>
							<CircleCheckbox checked={selectedIds.has(feedback.id)} />
							<div className="flex-1 bg-white rounded-[20px] p-4">
								<div className="flex items-center justify-between p-[10px]">
									<span className="text-[16px] font-bold text-black">
										{feedback.name}님의 피드백
									</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* 제출 하기 FAB */}
			<div className="absolute bottom-10 right-5">
				<button
					type="button"
					onClick={() => setStep("selectSelfKeywords")}
					disabled={selectedIds.size === 0}
					className="flex items-center gap-[10px] px-5 py-[14px] rounded-[60px] border-none cursor-pointer"
					style={{
						background: selectedIds.size > 0 ? "#0073FF" : "#A9A9A9",
						boxShadow: "0px 0px 3.1px 1px rgba(0,0,0,0.25)",
					}}
				>
					<span
						className="text-[16px] font-medium"
						style={{ color: "#EDF0FF" }}
					>
						다음 →
					</span>
				</button>
			</div>
		</div>
	);
}

type SelfKeywordSectionProps = {
	category: SelfKeywordCategory;
	isOpen: boolean;
	selectedKeywords: Set<string>;
	onToggleOpen: () => void;
	onToggleKeyword: (keyword: string) => void;
};

function SelfKeywordSection({
	category,
	isOpen,
	selectedKeywords,
	onToggleOpen,
	onToggleKeyword,
}: SelfKeywordSectionProps) {
	return (
		<section className="rounded-[20px] bg-white px-4 py-4">
			<button
				type="button"
				onClick={onToggleOpen}
				className="flex w-full items-center justify-between border-none bg-transparent p-0 text-left"
				aria-expanded={isOpen}
			>
				<div>
					<h2 className="m-0 text-[18px] font-bold leading-[135%] text-black">
						{category.title}
					</h2>
					<p className="mt-1 mb-0 text-[13px] font-medium leading-[150%] text-[#8A8A8A]">
						{category.description}
					</p>
				</div>
				<span
					className={[
						"ml-4 text-[18px] font-bold text-[#A9A9A9] transition-transform duration-200",
						isOpen ? "rotate-180" : "",
					].join(" ")}
					aria-hidden="true"
				>
					⌄
				</span>
			</button>

			{isOpen && (
				<div className="mt-5 flex flex-wrap gap-x-2 gap-y-3">
					{category.keywords.map((keyword) => (
						<SelfKeywordChip
							key={keyword}
							label={keyword}
							selected={selectedKeywords.has(keyword)}
							onClick={() => onToggleKeyword(keyword)}
						/>
					))}
				</div>
			)}
		</section>
	);
}

type SelfKeywordChipProps = {
	label: string;
	selected: boolean;
	onClick: () => void;
};

function SelfKeywordChip({ label, selected, onClick }: SelfKeywordChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				"min-h-[36px] rounded-full border px-[14px] py-[7px] text-[15px] font-medium leading-none transition-colors",
				selected
					? "border-[#2F80FF] bg-[#2F80FF] text-white"
					: "border-[#E6EBF5] bg-white text-black",
			].join(" ")}
		>
			{label}
		</button>
	);
}

function CircleCheckbox({ checked }: { checked: boolean }) {
	if (checked) {
		return (
			<div className="w-6 h-6 rounded-full bg-[#3182F6] flex items-center justify-center flex-shrink-0">
				<svg
					width="12"
					height="9"
					viewBox="0 0 12 9"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M1 4L4.5 7.5L11 1"
						stroke="white"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		);
	}
	return (
		<div
			className="w-6 h-6 rounded-full border-2 flex-shrink-0"
			style={{ borderColor: "#DADADA" }}
		/>
	);
}
