import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getAnalysisHistory } from "@/features/feedback-groups/api";
import { BottomNavigation, Header } from "@/shared/components";
import { AnalysisHistoryCard } from "./_components/AnalysisHistoryCard";

type AnalysisTab = "AI 분석" | "자기소개서";

const ANALYSIS_TABS: AnalysisTab[] = ["AI 분석", "자기소개서"];

export function AnalysisHistoryPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<AnalysisTab>("AI 분석");
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["analysis-history"],
		queryFn: getAnalysisHistory,
	});
	const analyses = data?.analyses ?? [];

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
							onClick={() => setActiveTab(tab)}
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
			<main className="flex-1 px-[17px] mt-4 pb-32">
				{isLoading ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">불러오는 중...</span>
					</div>
				) : isError ? (
					<div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
						<span className="text-[16px] font-medium text-red-500">
							{error instanceof Error
								? error.message
								: "내역을 불러오지 못했어요."}
						</span>
						<button
							type="button"
							onClick={() => refetch()}
							className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
						>
							다시 불러오기
						</button>
					</div>
				) : analyses.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">
							생성한 피드백이 없어요
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{analyses.map((item) => (
							<AnalysisHistoryCard
								key={item.analysisId}
								item={item}
								onClick={() => navigate(`/analysis/ai/${item.analysisId}`)}
							/>
						))}
					</div>
				)}
			</main>

			<BottomNavigation activeTab="report" />
		</div>
	);
}
