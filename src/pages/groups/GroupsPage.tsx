import { useState } from "react";
import { useNavigate } from "react-router";
import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";
import IcPlus from "@/assets/icons/ic_plus.svg?react";
import { BottomNavigation } from "@/shared/components";
import { type Group, GroupCard } from "./_components/GroupCard";

type FilterTab = "전체" | "진행중" | "종료";

const MOCK_GROUPS: Group[] = [
	{ id: 1, name: "SeenBy 프로젝트", memberCount: 4, status: "진행중", startDate: "2026.02" },
	{ id: 2, name: "SeenBy 프로젝트", memberCount: 4, status: "진행중", startDate: "2026.02" },
	{
		id: 3,
		name: "SeenBy 프로젝트",
		memberCount: 2,
		status: "종료",
		startDate: "2025.02.01",
		endDate: "2025.03.06",
	},
	{
		id: 4,
		name: "SeenBy 프로젝트",
		memberCount: 2,
		status: "종료",
		startDate: "2025.02.01",
		endDate: "2025.03.06",
	},
];

const FILTER_TABS: FilterTab[] = ["전체", "진행중", "종료"];

export function GroupsPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<FilterTab>("전체");
	const [groups] = useState<Group[]>(MOCK_GROUPS);

	const filteredGroups =
		activeTab === "전체" ? groups : groups.filter((g) => g.status === activeTab);

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			{/* Header */}
			<header className="flex items-center justify-center relative px-5 py-[10px]">
				<button
					type="button"
					onClick={() => navigate(-1)}
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
			<div className="fixed bottom-28 right-5">
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

			<BottomNavigation activeTab="feedback" />
		</div>
	);
}
