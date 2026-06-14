import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import IcPlus from "@/assets/icons/ic_plus.svg?react";
import { getFeedbackGroups } from "@/features/feedback-groups/api";
import { BottomNavigation, Header } from "@/shared/components";
import { GroupCard } from "./_components/GroupCard";
import { getErrorMessage } from "./utils";

type FilterTab = "전체" | "진행중" | "종료";

const FILTER_TABS: FilterTab[] = ["전체", "진행중", "종료"];

export function GroupsPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<FilterTab>("전체");
	const { data, error, isError, isLoading, refetch } = useQuery({
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
			<Header
				title="피드백 내역"
				onBack={() => navigate(-1)}
				withBottomSpacing={false}
			/>

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
				{isLoading ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">불러오는 중...</span>
					</div>
				) : isError ? (
					<div className="flex h-48 flex-col items-center justify-center gap-3 px-5 text-center">
						<span className="text-[16px] font-medium text-red-500">
							{getErrorMessage(error, "피드백 내역을 불러오지 못했어요.")}
						</span>
						<button
							type="button"
							onClick={() => refetch()}
							className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
						>
							다시 불러오기
						</button>
					</div>
				) : filteredGroups.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">
							생성한 피드백이 없어요
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{filteredGroups.map((group) => (
							<GroupCard
								key={group.id}
								group={group}
								onClick={() => navigate(`/groups/${group.id}`)}
							/>
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
					<span className="text-[16px] font-medium text-[#EDF0FF]">
						피드백 집단 추가
					</span>
				</button>
			</div>

			<BottomNavigation activeTab="feedback" />
		</div>
	);
}
