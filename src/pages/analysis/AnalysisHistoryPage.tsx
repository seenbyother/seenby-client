import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import {
	type CoverLettersResponse,
	getCoverLetters,
} from "@/features/cover-letters/api";
import { useCoverLetterGenerationEvents } from "@/features/cover-letters/useCoverLetterGenerationEvents";
import {
	type AnalysisHistoryResponse,
	getAnalysisHistory,
} from "@/features/feedback-groups/api";
import { useAnalysisGenerationEvents } from "@/features/feedback-groups/useAnalysisGenerationEvents";
import type { GenerationRecoveryPhase } from "@/shared/api";
import { BottomNavigation, Header } from "@/shared/components";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { formatYearMonthDay } from "@/shared/utils/date";
import { AnalysisHistoryCard } from "./_components/AnalysisHistoryCard";

type AnalysisTab = "AI 분석" | "자기소개서";

const ANALYSIS_TABS: AnalysisTab[] = ["AI 분석", "자기소개서"];
const ANALYSIS_PAGE_SIZE = 10;

export function AnalysisHistoryPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab: AnalysisTab =
		searchParams.get("tab") === "cover-letter" ? "자기소개서" : "AI 분석";
	const isAnalysisTab = activeTab === "AI 분석";
	const analysisQuery = useInfiniteQuery({
		queryKey: ["analysis-history"],
		queryFn: ({ pageParam }) =>
			getAnalysisHistory({ page: pageParam, size: ANALYSIS_PAGE_SIZE }),
		initialPageParam: 0,
		getNextPageParam: (lastPage) =>
			lastPage.hasNext ? lastPage.page + 1 : undefined,
		enabled: isAnalysisTab,
	});
	const coverLettersQuery = useQuery({
		queryKey: ["cover-letters"],
		queryFn: getCoverLetters,
		enabled: !isAnalysisTab,
	});
	const analysisEvents = useAnalysisGenerationEvents(
		analysisQuery.data,
		isAnalysisTab,
	);
	const coverLetterEvents = useCoverLetterGenerationEvents(
		coverLettersQuery.data,
		!isAnalysisTab,
	);
	const activeQuery = isAnalysisTab ? analysisQuery : coverLettersQuery;
	const historyItems = isAnalysisTab
		? getAnalysisHistoryItems(
				analysisQuery.data?.pages,
				analysisEvents.recoveryById,
			)
		: getCoverLetterHistoryItems(
				coverLettersQuery.data,
				coverLetterEvents.recoveryById,
			);
	const sentinelRef = useInfiniteScrollSentinel({
		hasNextPage: isAnalysisTab && (analysisQuery.hasNextPage ?? false),
		isFetchingNextPage: analysisQuery.isFetchingNextPage,
		onLoadMore: () => analysisQuery.fetchNextPage(),
	});

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			<Header
				title="AI분석 내역"
				onBack={() => navigate(-1)}
				withBottomSpacing={false}
			/>

			{/* Segmented Tab */}
			<div className="flex items-center justify-center px-[17px] mt-3">
				<div className="flex w-full rounded-[10px] bg-[#EFEFEF] p-1">
					{ANALYSIS_TABS.map((tab) => (
						<button
							key={tab}
							type="button"
							onClick={() =>
								setSearchParams(
									tab === "자기소개서" ? { tab: "cover-letter" } : {},
								)
							}
							className="flex-1 py-2 rounded-lg text-[16px] border-none cursor-pointer transition-all duration-200"
							style={{
								background:
									activeTab === tab ? "rgba(255,255,255,0.8)" : "transparent",
								fontWeight: activeTab === tab ? 700 : 600,
								color: activeTab === tab ? "#000000" : "#A1A9B2",
							}}
						>
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Content */}
			<main className="flex-1 px-[17px] mt-3 pb-32">
				{activeQuery.isLoading ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">불러오는 중...</span>
					</div>
				) : activeQuery.isError ? (
					<div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
						<span className="text-[16px] font-medium text-red-500">
							{activeQuery.error instanceof Error
								? activeQuery.error.message
								: "내역을 불러오지 못했어요."}
						</span>
						<button
							type="button"
							onClick={() => activeQuery.refetch()}
							className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
						>
							다시 불러오기
						</button>
					</div>
				) : historyItems.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">
							생성한 {activeTab}이 없어요
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{historyItems.map((item) => (
							<AnalysisHistoryCard
								key={`${activeTab}-${item.id}`}
								title={item.title}
								dateLabel={item.dateLabel}
								statusLabel={item.statusLabel}
								statusTone={item.statusTone}
								isProcessing={item.isProcessing}
								disabled={item.disabled}
								message={item.message}
								actionLabel={item.actionLabel}
								onAction={
									item.actionLabel
										? () => {
												if (item.actionHref) navigate(item.actionHref);
											}
										: undefined
								}
								onClick={() => {
									if (!item.disabled) {
										navigate(item.href);
									}
								}}
							/>
						))}
						{isAnalysisTab ? <div ref={sentinelRef} /> : null}
						{isAnalysisTab && analysisQuery.isFetchingNextPage ? (
							<div className="flex items-center justify-center py-4">
								<span className="text-[14px] text-black/50">
									불러오는 중...
								</span>
							</div>
						) : null}
					</div>
				)}
			</main>

			<BottomNavigation activeTab="report" />
		</div>
	);
}

type VisibleHistoryItem = {
	id: number;
	title: string;
	dateLabel: string;
	href: string;
	statusLabel?: string;
	statusTone?: "blue" | "gray" | "red";
	isProcessing?: boolean;
	disabled?: boolean;
	message?: string;
	actionLabel?: string;
	actionHref?: string;
};

function getAnalysisHistoryItems(
	pages: AnalysisHistoryResponse[] | undefined,
	recoveryById: Partial<Record<number, GenerationRecoveryPhase>>,
): VisibleHistoryItem[] {
	if (!pages) {
		return [];
	}

	return pages
		.flatMap((page) => page.analyses)
		.map((item) => {
			const presentation = getGenerationPresentation(
				item.status,
				item.failureReason,
				recoveryById[item.analysisId],
				`/groups/${item.group.id}/analysis?mode=analysis-regenerate&analysisId=${item.analysisId}`,
			);

			return {
				id: item.analysisId,
				title: item.group.title,
				dateLabel: formatYearMonthDay(item.analyzedAt ?? item.createdAt),
				href: `/analysis/ai/${item.analysisId}`,
				...presentation,
			};
		});
}

function getCoverLetterHistoryItems(
	data: CoverLettersResponse | undefined,
	recoveryById: Partial<Record<number, GenerationRecoveryPhase>>,
): VisibleHistoryItem[] {
	if (!data) {
		return [];
	}

	return data.coverLetters.map((item) => {
		const presentation = getGenerationPresentation(
			item.status,
			item.failureReason,
			recoveryById[item.id],
			`/groups/${item.feedbackGroupId}/analysis?mode=cover-letter-create-another`,
		);

		return {
			id: item.id,
			title: item.feedbackGroupName,
			dateLabel: formatYearMonthDay(item.completedAt ?? item.createdAt),
			href: `/cover-letters/${item.id}`,
			...presentation,
		};
	});
}

function getGenerationPresentation(
	status: "PROCESSING" | "COMPLETED" | "FAILED",
	failureReason: string | null | undefined,
	recoveryPhase: GenerationRecoveryPhase | undefined,
	regenerationHref: string,
): Pick<
	VisibleHistoryItem,
	| "statusLabel"
	| "statusTone"
	| "isProcessing"
	| "disabled"
	| "message"
	| "actionLabel"
	| "actionHref"
> {
	if (recoveryPhase === "unavailable") {
		return {
			statusLabel: "확인 불가",
			statusTone: "red",
			isProcessing: false,
			disabled: true,
			message: "삭제되었거나 결과를 확인할 수 없어요.",
		};
	}

	if (status === "FAILED") {
		return {
			statusLabel: "실패",
			statusTone: "red",
			isProcessing: false,
			disabled: true,
			message: failureReason?.trim()
				? failureReason
				: "생성에 실패했어요. 다시 요청해주세요.",
			actionLabel: "생성 다시 요청",
			actionHref: regenerationHref,
		};
	}

	if (status === "PROCESSING") {
		const isPaused = recoveryPhase === "paused";
		const isResumed = recoveryPhase === "resumed";
		const isRecovering =
			recoveryPhase === "checking" || recoveryPhase === "waiting";
		if (isPaused) {
			return {
				statusLabel: "오류",
				statusTone: "red",
				isProcessing: false,
				disabled: true,
				message: "오류를 복구하지 못했어요. 다시 생성해주세요.",
				actionLabel: "다시 생성",
				actionHref: regenerationHref,
			};
		}

		return {
			statusLabel: isRecovering ? "복구 중" : isResumed ? "작성 중" : "생성 중",
			statusTone: "blue",
			isProcessing: true,
			disabled: true,
			message: isRecovering
				? "오류가 발생했어요. 복구하는 중이에요."
				: isResumed
					? "복구됐어요. 계속 작성 중이에요."
					: undefined,
		};
	}

	return {
		statusLabel: "완료",
		statusTone: "gray",
		isProcessing: false,
		disabled: false,
	};
}
