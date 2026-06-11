import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";
import IcPlus from "@/assets/icons/ic_plus.svg?react";
import { getFeedbackGroups } from "@/features/feedback-groups/api";
import { BottomNavigation } from "@/shared/components";
import { GroupCard } from "./_components/GroupCard";

type FilterTab = "전체" | "진행중" | "종료";

const FILTER_TABS: FilterTab[] = ["전체", "진행중", "종료"];

export function GroupsPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<FilterTab>("전체");
	const { data } = useQuery({
		queryKey: ["feedback-groups"],
		queryFn: getFeedbackGroups,
	});
	const groups = data?.groups ?? [];

	const filteredGroups =
		activeTab === "전체"
			? groups
			: groups.filter((g) =>
					activeTab === "진행중" ? g.linkActive : !g.linkActive,
				);

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			{/* Header */}
			<header className="flex items-center justify-center relative px-5 py-[10px]">
				<button
					type="button"
					className="absolute left-5 bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
					aria-label="뒤로 가기"
				>
					<IcArrowLeft width={32} height={32} />
				</button>
				<h1 className="text-[20px] font-normal text-black m-0">피드백 내역</h1>
			</header>

			{/* Filter Tabs */}
			<div className="flex items-center gap-[5px] px-5 mt-3">
				{FILTER_TABS.map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className="px-2 py-1 rounded-[13px] text-[14px] font-bold leading-[21px] text-white border-none cursor-pointer"
						style={{ background: activeTab === tab ? "#0073FF" : "#BBBBBB" }}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Content */}
			<main className="flex-1 px-5 mt-5 pb-32">
				{filteredGroups.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">생성한 피드백이 없어요</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{filteredGroups.map((group) => (
							<GroupCard key={group.id} group={group} onClick={() => navigate(`/groups/${group.id}`)} />
						))}
					</div>
				)}
			</main>

			{/* FAB */}
			<div className="absolute bottom-30 right-5">
				<button
					type="button"
					onClick={() => navigate("/feedback-group/create")}
					className="flex items-center gap-2.5 px-5 py-4 rounded-[60px] bg-[#0073FF] border-none cursor-pointer"
					style={{ boxShadow: "0px 0px 3.1px 1px rgba(0,0,0,0.25)" }}
				>
					<IcPlus />
					<span className="text-[16px] font-medium text-[#EDF0FF]">피드백 집단 추가</span>
				</button>
			</div>

			<BottomNavigation />
		</div>
	);
}
