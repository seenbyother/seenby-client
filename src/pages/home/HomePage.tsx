import { useNavigate } from "react-router";
import { BottomNavigation } from "@/shared/components";
import { HomeActionCard } from "./_components/HomeActionCard";
import { HomeHeader } from "./_components/HomeHeader";
import { InsightCard } from "./_components/InsightCard";
import { PerspectiveCard } from "./_components/PerspectiveCard";

export function HomePage() {
	const navigate = useNavigate();

	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="relative mx-auto h-[100svh] w-full max-w-[402px] overflow-hidden bg-[#F8F8F8]">
				<div className="h-full overflow-y-auto px-5 pb-[132px] pt-8">
					<HomeHeader onMyPageClick={() => navigate("/login")} />

					<section className="mt-6">
						<h2 className="m-0 text-[28px] font-bold leading-[1.18]">
							민경님,
							<br />
							새로운 <span className="text-[#0073FF]">시선</span>이 도착했어요
						</h2>
					</section>

					<section className="mt-6 flex flex-col gap-5">
						<InsightCard />

						<HomeActionCard
							onCreateFeedbackGroup={() => navigate("/feedback-group/create")}
							onCheckIntro={() => undefined}
						/>

						<PerspectiveCard />
					</section>
				</div>

				<BottomNavigation activeTab="home" />
			</div>
		</main>
	);
}
