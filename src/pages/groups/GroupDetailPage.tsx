import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";
import { FeedbackCard, type FeedbackItem } from "./_components/FeedbackCard";

type Group = {
	id: number;
	name: string;
	memberCount: number;
	status: "진행중" | "종료";
	startDate: string;
	endDate?: string;
};

type FilterTab = "전체" | "회고 미완료" | "회고 완료";
const FILTER_TABS: FilterTab[] = ["전체", "회고 미완료", "회고 완료"];

// TODO: 실제 API 연동 시 MOCK_GROUPS, MOCK_FEEDBACKS 제거 및 Group 타입을 FeedbackGroup으로 교체
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

const MOCK_FEEDBACKS: Record<number, FeedbackItem[]> = {
	1: [
		{ id: 1, name: "김연우", isReviewed: false, hasReflection: false },
		{ id: 2, name: "이지현", isReviewed: false, hasReflection: false },
		{ id: 3, name: "박민준", isReviewed: true, hasReflection: true },
		{ id: 4, name: "최서연", isReviewed: true, hasReflection: true },
		{ id: 5, name: "정다운", isReviewed: true, hasReflection: true },
		{ id: 6, name: "한소희", isReviewed: true, hasReflection: true },
		{ id: 7, name: "오승현", isReviewed: true, hasReflection: true },
		{ id: 8, name: "윤재원", isReviewed: true, hasReflection: true },
	],
	2: [
		{ id: 1, name: "김연우", isReviewed: true, hasReflection: true },
		{ id: 2, name: "이지현", isReviewed: true, hasReflection: true },
		{ id: 3, name: "박민준", isReviewed: true, hasReflection: true },
		{ id: 4, name: "최서연", isReviewed: true, hasReflection: true },
	],
	3: [],
	4: [
		{ id: 1, name: "김연우", isReviewed: true, hasReflection: true },
		{ id: 2, name: "이지현", isReviewed: true, hasReflection: true },
	],
};

export function GroupDetailPage() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<FilterTab>("전체");
	const [isCollecting, setIsCollecting] = useState(false);
	const [showAiInfo, setShowAiInfo] = useState(false);

	const id = Number(groupId);
	const group = MOCK_GROUPS.find((g) => g.id === id);
	const allFeedbacks = MOCK_FEEDBACKS[id] ?? [];
	const isAiAvailable = allFeedbacks.length > 0 && allFeedbacks.every((f) => f.hasReflection);

	const filteredFeedbacks =
		activeTab === "전체"
			? allFeedbacks
			: allFeedbacks.filter((f) =>
					activeTab === "회고 완료" ? f.hasReflection : !f.hasReflection,
				);

	if (!group) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
				<span className="text-black/50">그룹을 찾을 수 없어요</span>
			</div>
		);
	}

	const dateLabel =
		group.status === "진행중"
			? `${group.startDate} ~`
			: `${group.startDate} ~ ${group.endDate}`;

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

			{/* Group Title */}
			<div className="flex flex-col gap-2 px-5 mt-4">
				<h1 className="text-[30px] font-bold text-black leading-tight m-0">{group.name}</h1>
				<p className="text-[14px] text-black m-0">{dateLabel}</p>
			</div>

			{/* Actions */}
			<div className="flex flex-col gap-5 px-5 mt-[26px]">
				{/* 피드백 수집 활성화 */}
				<button
					type="button"
					onClick={() => setIsCollecting((prev) => !prev)}
					className="w-full bg-white rounded-[16px] flex items-center justify-between px-[10px] py-4 border-none cursor-pointer"
				>
					<span className="text-[16px] font-bold text-black">피드백 수집 활성화</span>
					<div
						className="relative w-[49px] h-[26px] rounded-[80px] transition-colors duration-200 flex-shrink-0"
						style={{ background: isCollecting ? "rgba(0,115,255,0.8)" : "#D9D9D9" }}
					>
						<div
							className="absolute top-[2px] w-[22px] h-[22px] rounded-full bg-white transition-all duration-200"
							style={{ left: isCollecting ? "25px" : "2px" }}
						/>
					</div>
				</button>

				{/* 피드백 링크 복사하기 */}
				<button
					type="button"
					className="w-full bg-white rounded-[16px] flex items-center justify-between px-[10px] py-4 border-none cursor-pointer"
				>
					<span className="text-[16px] font-bold text-black">피드백 링크 복사하기</span>
					<span
						className="text-[14px]"
						style={{ color: "#696969", textDecoration: "underline" }}
					>
						복사하기
					</span>
				</button>
			</div>


			{/* Filter Tabs */}
			<div className="flex items-center gap-[5px] px-5 mt-5">
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

			{/* Feedback List */}
			<main className="flex-1 px-5 mt-5 pb-36">
				{filteredFeedbacks.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">아직 받은 피드백이 없어요</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{filteredFeedbacks.map((feedback) => (
							<FeedbackCard key={feedback.id} feedback={feedback} />
						))}
					</div>
				)}
			</main>

			{/* AI 분석 FAB */}
			<div className="fixed bottom-10 right-5 flex flex-col items-end gap-2">
				{showAiInfo && (
					<div className="rounded-[16px] px-3 py-3" style={{ background: "#A9A9A9" }}>
						<p className="text-[12px] font-medium leading-[1.6] m-0 whitespace-pre-line" style={{ color: "#EDF0FF" }}>
							{"피드백 수집이 종료되면\n수집된 피드백을 기반으로\nAI 인사이트 분석이 가능해요."}
						</p>
					</div>
				)}
				<button
					type="button"
					onClick={() =>
						isAiAvailable
							? navigate(`/groups/${id}/analysis`)
							: setShowAiInfo((prev) => !prev)
					}
					className="flex items-center gap-[10px] px-5 py-[14px] rounded-[60px] border-none cursor-pointer"
					style={{
						background: isAiAvailable ? "#0073FF" : "#A9A9A9",
						boxShadow: "0px 0px 3.1px 1px rgba(0,0,0,0.25)",
					}}
				>
					<span className="text-[16px] font-medium" style={{ color: "#EDF0FF" }}>
						AI 분석
					</span>
				</button>
			</div>

		</div>
	);
}
