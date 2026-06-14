import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import {
	type CoverLettersResponse,
	getCoverLetters,
} from "@/features/cover-letters/api";
import {
	type AnalysisHistoryResponse,
	getAnalysisHistory,
} from "@/features/feedback-groups/api";
import { BottomNavigation, Header } from "@/shared/components";
import { formatYearMonthDay } from "@/shared/utils/date";
import { AnalysisHistoryCard } from "./_components/AnalysisHistoryCard";

type AnalysisTab = "AI 분석" | "자기소개서";

const ANALYSIS_TABS: AnalysisTab[] = ["AI 분석", "자기소개서"];

export function AnalysisHistoryPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab: AnalysisTab =
		searchParams.get("tab") === "cover-letter" ? "자기소개서" : "AI 분석";
	const isAnalysisTab = activeTab === "AI 분석";
	const analysisQuery = useQuery({
		queryKey: ["analysis-history"],
		queryFn: getAnalysisHistory,
		enabled: isAnalysisTab,
	});
	const coverLettersQuery = useQuery({
		queryKey: ["cover-letters"],
		queryFn: getCoverLetters,
		enabled: !isAnalysisTab,
	});
	const activeQuery = isAnalysisTab ? analysisQuery : coverLettersQuery;
	const historyItems = isAnalysisTab
		? getAnalysisHistoryItems(analysisQuery.data)
		: getCoverLetterHistoryItems(coverLettersQuery.data);
	const isRefreshing = activeQuery.isFetching && !activeQuery.isLoading;

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
				<div className="mb-3 flex justify-end">
					<button
						type="button"
						onClick={() => activeQuery.refetch()}
						disabled={activeQuery.isFetching}
						className="flex h-8 w-8 items-center justify-center border-none bg-transparent p-0 text-[#0073FF] disabled:cursor-not-allowed disabled:opacity-50"
						aria-label={isRefreshing ? "새로고침 중" : "새로고침"}
					>
						<RefreshIcon className={isRefreshing ? "animate-spin" : ""} />
					</button>
				</div>

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
								disabled={item.disabled}
								dimmed={item.dimmed}
								onClick={() => {
									if (!item.disabled) {
										navigate(item.href);
									}
								}}
							/>
						))}
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
	disabled?: boolean;
	dimmed?: boolean;
};

function getAnalysisHistoryItems(
	data: AnalysisHistoryResponse | undefined,
): VisibleHistoryItem[] {
	if (!data) {
		return [];
	}

	return data.analyses.map((item) => ({
		id: item.analysisId,
		title: item.group.title,
		dateLabel: formatYearMonthDay(item.analyzedAt ?? item.createdAt),
		href: `/analysis/ai/${item.analysisId}`,
		statusLabel: item.status === "PROCESSING" ? "작성 중" : "완료",
		statusTone: item.status === "PROCESSING" ? "blue" : "gray",
	}));
}

function getCoverLetterHistoryItems(
	data: CoverLettersResponse | undefined,
): VisibleHistoryItem[] {
	if (!data) {
		return [];
	}

	return data.coverLetters.map((item) => ({
		id: item.id,
		title: item.feedbackGroupName,
		dateLabel: formatYearMonthDay(item.completedAt ?? item.createdAt),
		href: `/cover-letters/${item.id}`,
		statusLabel: getCoverLetterStatusLabel(item.status),
		statusTone: getCoverLetterStatusTone(item.status),
		disabled: item.status === "FAILED",
		dimmed: item.status === "FAILED",
	}));
}

function getCoverLetterStatusLabel(
	status: CoverLettersResponse["coverLetters"][number]["status"],
) {
	switch (status) {
		case "PROCESSING":
			return "작성 중";
		case "FAILED":
			return "실패";
		default:
			return "완료";
	}
}

function getCoverLetterStatusTone(
	status: CoverLettersResponse["coverLetters"][number]["status"],
): VisibleHistoryItem["statusTone"] {
	switch (status) {
		case "PROCESSING":
			return "blue";
		case "FAILED":
			return "red";
		default:
			return "gray";
	}
}

function RefreshIcon({ className = "" }: { className?: string }) {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			aria-hidden="true"
		>
			<path
				d="M20 6v5h-5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4 18v-5h5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.1 9A7 7 0 0 1 17.7 6.4L20 11"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M17.9 15A7 7 0 0 1 6.3 17.6L4 13"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
