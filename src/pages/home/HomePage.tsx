import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import { getHomeKeywordSummary } from "@/features/home/api";
import { BottomNavigation } from "@/shared/components";
import { HomeActionCard } from "./_components/HomeActionCard";
import { HomeHeader } from "./_components/HomeHeader";
import { InsightCard } from "./_components/InsightCard";
import { PerspectiveCard } from "./_components/PerspectiveCard";

export function HomePage() {
	const navigate = useNavigate();
	const { data: currentUser } = useCurrentUser();
	const {
		data: homeKeywordSummary,
		error,
		isError,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["home"],
		queryFn: getHomeKeywordSummary,
		enabled: Boolean(currentUser),
	});

	if (!currentUser) {
		return null;
	}

	const userName = getCurrentUserName(currentUser);
	const otherKeywords = homeKeywordSummary?.otherKeywords?.keywords ?? [];
	const selfKeywords = homeKeywordSummary?.selfKeywords?.keywords ?? [];

	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="relative mx-auto h-[100svh] w-full max-w-[402px] overflow-hidden bg-[#F8F8F8]">
				<div className="h-full overflow-y-auto px-5 pb-[132px] pt-8">
					<HomeHeader />

					<section className="mt-6">
						<h2 className="m-0 text-[28px] font-bold leading-[1.18]">
							{userName}님,
							<br />
							새로운 <span className="text-[#0073FF]">시선</span>이 도착했어요
						</h2>
					</section>

					<section className="mt-6 flex flex-col gap-5">
						<InsightCard
							userName={userName}
							keywords={otherKeywords}
							isLoading={isLoading}
						/>

						{isError ? (
							<div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-5 text-center">
								<p className="m-0 text-[14px] font-semibold text-red-500">
									{getHomeErrorMessage(error)}
								</p>
								<button
									type="button"
									onClick={() => refetch()}
									className="mx-auto rounded-full border-0 bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
								>
									다시 불러오기
								</button>
							</div>
						) : null}

						<HomeActionCard
							onCreateFeedbackGroup={() => navigate("/feedback-group/create")}
							onCheckIntro={() => navigate("/analysis?tab=cover-letter")}
						/>

						<PerspectiveCard
							otherKeywords={otherKeywords}
							selfKeywords={selfKeywords}
						/>
					</section>
				</div>

				<BottomNavigation activeTab="home" />
			</div>
		</main>
	);
}

function getHomeErrorMessage(error: unknown) {
	if (error instanceof Error && error.message.trim()) {
		return error.message;
	}

	return "홈 키워드를 불러오지 못했어요.";
}
