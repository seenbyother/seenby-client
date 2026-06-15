import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import {
	createFeedbackAnalysis,
	createFeedbackCoverLetter,
	type FeedbackAnalysisCreateResult,
	type FeedbackCoverLetterCreateResult,
	getFeedbackGroupDetail,
} from "@/features/feedback-groups/api";
import { getSelfKeywords } from "@/features/onboarding/api";
import {
	countSelfKeywordsInCategory,
	getDisplayableSelfKeywords,
	getOrderedSelfKeywords,
	MAX_SELF_KEYWORD_COUNT_BY_CATEGORY,
	SELF_KEYWORD_CATEGORIES,
	SELF_KEYWORD_CATEGORY_BY_KEYWORD,
	type SelfKeywordCategory,
	type SelfKeywordCategoryId,
} from "@/features/onboarding/selfKeywords";
import { Header } from "@/shared/components";
import { FloatingActionButton } from "./_components/FloatingActionButton";
import { getErrorMessage } from "./utils";

type Step = "selectFeedback" | "selectSelfKeywords";

const MIN_ANALYSIS_FEEDBACK_COUNT = 3;

type AnalysisSubmitResult = {
	analysis: FeedbackAnalysisCreateResult;
	coverLetter: FeedbackCoverLetterCreateResult;
};

type AnalysisSubmitFailure = {
	message: string;
};

export function GroupAnalysisPage() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const [step, setStep] = useState<Step>("selectFeedback");
	const [openCategoryId, setOpenCategoryId] =
		useState<SelfKeywordCategoryId | null>("mood");
	const [selectedSelfKeywords, setSelectedSelfKeywords] = useState<Set<string>>(
		() => new Set(),
	);
	const [hasLoadedSavedSelfKeywords, setHasLoadedSavedSelfKeywords] =
		useState(false);

	const id = Number(groupId);
	const isValidGroupId = Number.isInteger(id) && id > 0;
	const { data: currentUser } = useCurrentUser();
	const userName = getCurrentUserName(currentUser);

	const {
		data: group,
		error,
		isError,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["feedback-group", id],
		queryFn: () => getFeedbackGroupDetail(id),
		enabled: isValidGroupId,
	});
	const {
		data: savedSelfKeywords,
		error: savedSelfKeywordsError,
		isLoading: isSavedSelfKeywordsLoading,
	} = useQuery({
		queryKey: ["me", "self-keywords"],
		queryFn: getSelfKeywords,
		enabled: step === "selectSelfKeywords",
	});

	const feedbacks = useMemo(
		() =>
			(group?.answers ?? []).filter((answer) => answer.retrospectiveCompleted),
		[group?.answers],
	);

	const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());

	const analysisMutation = useMutation<
		AnalysisSubmitResult,
		AnalysisSubmitFailure
	>({
		mutationFn: async () => {
			const answerIds = Array.from(selectedIds);
			const selfKeywords = getOrderedSelfKeywords(selectedSelfKeywords);
			const requestBody = {
				answerIds,
				selfKeywords,
			};
			const [analysisResult, coverLetterResult] = await Promise.allSettled([
				createFeedbackAnalysis(id, requestBody),
				createFeedbackCoverLetter(id, requestBody),
			]);

			if (
				analysisResult.status !== "fulfilled" ||
				coverLetterResult.status !== "fulfilled"
			) {
				throw {
					message:
						"AI 분석 요청을 완료하지 못했어요. 잠시 후 다시 시도해주세요.",
				};
			}

			const analysis = analysisResult.value;
			const coverLetter = coverLetterResult.value;

			return { analysis, coverLetter };
		},
		onSuccess: () => {
			navigate("/analysis", { replace: true });
		},
		onError: (error) => {
			navigate(`/groups/${id}/analysis/result`, {
				state: {
					status: "error",
					message: error.message,
				},
			});
		},
	});

	useEffect(() => {
		setSelectedIds(new Set(feedbacks.map((feedback) => feedback.id)));
	}, [feedbacks]);

	useEffect(() => {
		if (
			step !== "selectSelfKeywords" ||
			!savedSelfKeywords ||
			hasLoadedSavedSelfKeywords
		) {
			return;
		}

		if (selectedSelfKeywords.size > 0) {
			setHasLoadedSavedSelfKeywords(true);
			return;
		}

		setSelectedSelfKeywords(
			new Set(getDisplayableSelfKeywords(savedSelfKeywords)),
		);
		setHasLoadedSavedSelfKeywords(true);
	}, [
		hasLoadedSavedSelfKeywords,
		savedSelfKeywords,
		selectedSelfKeywords.size,
		step,
	]);

	const allSelected =
		feedbacks.length > 0 && selectedIds.size === feedbacks.length;
	const canGoToSelfKeywordStep =
		selectedIds.size >= MIN_ANALYSIS_FEEDBACK_COUNT;

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
			if (next.has(keyword)) {
				next.delete(keyword);
				return next;
			}

			const categoryId = SELF_KEYWORD_CATEGORY_BY_KEYWORD.get(keyword);
			const selectedCountInCategory = categoryId
				? countSelfKeywordsInCategory(prev, categoryId)
				: 0;

			if (
				categoryId &&
				selectedCountInCategory >= MAX_SELF_KEYWORD_COUNT_BY_CATEGORY
			) {
				return prev;
			}

			next.add(keyword);
			return next;
		});
	};

	const toggleKeywordCategory = (categoryId: SelfKeywordCategoryId) => {
		setOpenCategoryId((current) =>
			current === categoryId ? null : categoryId,
		);
	};

	const goToSelfKeywordStep = () => {
		setOpenCategoryId("mood");
		setStep("selectSelfKeywords");
	};

	if (!isValidGroupId) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
				<span className="text-black/50">그룹을 찾을 수 없어요</span>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
				<span className="text-black/50">불러오는 중...</span>
			</div>
		);
	}

	if (isError || !group) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8F8F8] px-5 text-center">
				<span className="text-[16px] font-medium text-red-500">
					{getErrorMessage(error, "피드백 목록을 불러오지 못했어요.")}
				</span>
				<button
					type="button"
					onClick={() => refetch()}
					className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
				>
					다시 불러오기
				</button>
			</div>
		);
	}

	if (step === "selectSelfKeywords") {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
				<Header
					title="나의 키워드 선택"
					onBack={() => setStep("selectFeedback")}
					withBottomSpacing={false}
				/>

				<div className="flex-1 overflow-y-auto px-5 mt-4 pb-36">
					<section>
						<h1 className="m-0 text-[24px] font-bold leading-[160%] tracking-[-0.48px] text-black">
							{userName}님의 키워드를 선택해주세요
						</h1>
						<p className="mt-3 mb-0 text-[16px] font-medium leading-[150%] text-[#71717A]">
							{group.name}에서 스스로 생각하는 {userName}님의 키워드를
							<br />
							자유롭게 선택해주세요
						</p>
					</section>

					<div className="mt-7 flex flex-col gap-3">
						{SELF_KEYWORD_CATEGORIES.map((category) => (
							<SelfKeywordSection
								key={category.id}
								category={category}
								isOpen={openCategoryId === category.id}
								selectedKeywords={selectedSelfKeywords}
								maxSelectedCount={MAX_SELF_KEYWORD_COUNT_BY_CATEGORY}
								onToggleOpen={() => toggleKeywordCategory(category.id)}
								onToggleKeyword={toggleSelfKeyword}
							/>
						))}
					</div>
				</div>

				<FloatingActionButton
					onClick={() => analysisMutation.mutate()}
					disabled={
						selectedSelfKeywords.size === 0 ||
						analysisMutation.isPending ||
						isSavedSelfKeywordsLoading
					}
					active={
						selectedSelfKeywords.size > 0 &&
						!analysisMutation.isPending &&
						!isSavedSelfKeywordsLoading
					}
					className="min-w-[134px]"
					topContent={
						savedSelfKeywordsError ? (
							<p className="m-0 text-right text-[13px] font-medium text-red-500">
								{getErrorMessage(
									savedSelfKeywordsError,
									"저장된 자기 인식 키워드를 불러오지 못했어요.",
								)}
							</p>
						) : analysisMutation.isError ? (
							<p className="m-0 text-right text-[13px] font-medium text-red-500">
								{getErrorMessage(
									analysisMutation.error,
									"AI 분석을 요청하지 못했어요.",
								)}
							</p>
						) : null
					}
				>
					<span className="text-[16px] font-medium leading-none">
						{analysisMutation.isPending
							? "제출 중"
							: isSavedSelfKeywordsLoading
								? "불러오는 중"
								: "제출 하기"}
					</span>
					<span className="text-[24px] leading-none" aria-hidden="true">
						→
					</span>
				</FloatingActionButton>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			<Header
				title="피드백 선택"
				onBack={() => navigate(-1)}
				withBottomSpacing={false}
			/>

			<div className="flex flex-col gap-3 px-5 mt-4 pb-36">
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

				{feedbacks.length === 0 ? (
					<div className="flex h-48 items-center justify-center">
						<span className="text-[18px] font-medium text-black/50">
							회고 완료된 피드백이 없어요
						</span>
					</div>
				) : (
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
											{feedback.reviewerName}님의 피드백
										</span>
									</div>
								</div>
							</button>
						))}
					</div>
				)}
			</div>

			<FloatingActionButton
				onClick={goToSelfKeywordStep}
				disabled={!canGoToSelfKeywordStep}
				active={canGoToSelfKeywordStep}
				topContent={
					feedbacks.length > 0 && !canGoToSelfKeywordStep ? (
						<p className="m-0 text-right text-[13px] font-medium text-[#71717A]">
							최소 {MIN_ANALYSIS_FEEDBACK_COUNT}개의 피드백을 선택해주세요
						</p>
					) : null
				}
			>
				다음 →
			</FloatingActionButton>
		</div>
	);
}

type SelfKeywordSectionProps = {
	category: SelfKeywordCategory;
	isOpen: boolean;
	selectedKeywords: Set<string>;
	maxSelectedCount: number;
	onToggleOpen: () => void;
	onToggleKeyword: (keyword: string) => void;
};

function SelfKeywordSection({
	category,
	isOpen,
	selectedKeywords,
	maxSelectedCount,
	onToggleOpen,
	onToggleKeyword,
}: SelfKeywordSectionProps) {
	const selectedCount = countSelfKeywordsInCategory(
		selectedKeywords,
		category.id,
	);
	const isLimitReached = selectedCount >= maxSelectedCount;

	return (
		<section>
			<button
				type="button"
				onClick={onToggleOpen}
				className="flex items-center gap-1 border-none bg-transparent p-0 text-left"
				aria-expanded={isOpen}
			>
				<span
					className={[
						"flex size-6 items-center justify-center text-[20px] font-medium leading-none text-black transition-transform duration-200",
						isOpen ? "" : "rotate-180",
					].join(" ")}
					aria-hidden="true"
				>
					⌃
				</span>
				<h2 className="m-0 text-[24px] font-medium leading-[150%] text-black">
					{category.title}
				</h2>
			</button>

			{isOpen && (
				<div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
					{category.keywords.map((keyword) => (
						<SelfKeywordChip
							key={keyword}
							label={keyword}
							selected={selectedKeywords.has(keyword)}
							disabled={!selectedKeywords.has(keyword) && isLimitReached}
							onClick={() => onToggleKeyword(keyword)}
						/>
					))}
				</div>
			)}
			{isOpen && isLimitReached ? (
				<p className="mt-3 mb-0 text-[13px] font-medium leading-[150%] text-[#2F80FF]">
					각 카테고리에서 최대 {maxSelectedCount}개까지 선택할 수 있어요
				</p>
			) : null}
		</section>
	);
}

type SelfKeywordChipProps = {
	label: string;
	selected: boolean;
	disabled?: boolean;
	onClick: () => void;
};

function SelfKeywordChip({
	label,
	selected,
	disabled = false,
	onClick,
}: SelfKeywordChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={[
				"min-h-[40px] rounded-full border px-[14px] py-2 text-[16px] font-medium leading-[150%] transition-colors disabled:cursor-not-allowed disabled:opacity-35",
				selected
					? "border-[#2F80FF] bg-[#2F80FF] text-white"
					: "border-[#EDF0FF] bg-transparent text-black",
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
