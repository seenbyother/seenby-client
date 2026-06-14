import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
	type FeedbackGroupDetail,
	type FeedbackGroupsResponse,
	getFeedbackGroupDetail,
	updateFeedbackGroupLinkActive,
} from "@/features/feedback-groups/api";
import { Header } from "@/shared/components";
import { formatYearMonth, formatYearMonthDay } from "@/shared/utils/date";
import { FeedbackCard, type FeedbackItem } from "./_components/FeedbackCard";
import { FloatingActionButton } from "./_components/FloatingActionButton";
import { getErrorMessage } from "./utils";

type FilterTab = "전체" | "회고 미완료" | "회고 완료";

const FILTER_TABS: FilterTab[] = ["전체", "회고 미완료", "회고 완료"];

function toFeedbackItem(
	answer: FeedbackGroupDetail["answers"][number],
): FeedbackItem {
	return {
		id: answer.id,
		name: answer.reviewerName,
		isReviewed: answer.retrospectiveCompleted,
		hasReflection: answer.retrospectiveCompleted,
	};
}

function getDateLabel(group: FeedbackGroupDetail) {
	const startDate = formatYearMonth(group.createdAt);

	if (group.linkActive) {
		return `${startDate} ~`;
	}

	return `${startDate} ~ ${group.endDate ? formatYearMonthDay(group.endDate) : ""}`;
}

export function GroupDetailPage() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState<FilterTab>("전체");
	const [showAiInfo, setShowAiInfo] = useState(false);
	const [copyMessage, setCopyMessage] = useState("");

	const id = Number(groupId);
	const isValidGroupId = Number.isInteger(id) && id > 0;

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

	const linkActiveMutation = useMutation({
		mutationFn: (linkActive: boolean) =>
			updateFeedbackGroupLinkActive(id, linkActive),
		onMutate: async (linkActive) => {
			await queryClient.cancelQueries({ queryKey: ["feedback-group", id] });
			await queryClient.cancelQueries({ queryKey: ["feedback-groups"] });

			const previousGroup = queryClient.getQueryData<FeedbackGroupDetail>([
				"feedback-group",
				id,
			]);
			const previousGroups = queryClient.getQueryData<FeedbackGroupsResponse>([
				"feedback-groups",
			]);
			const optimisticEndDate = linkActive ? null : new Date().toISOString();

			queryClient.setQueryData<FeedbackGroupDetail>(
				["feedback-group", id],
				(current) =>
					current
						? {
								...current,
								linkActive,
								endDate: optimisticEndDate,
							}
						: current,
			);
			queryClient.setQueryData<FeedbackGroupsResponse>(
				["feedback-groups"],
				(current) =>
					current
						? {
								...current,
								groups: current.groups.map((item) =>
									item.id === id
										? {
												...item,
												linkActive,
												endDate: optimisticEndDate,
											}
										: item,
								),
							}
						: current,
			);

			return { previousGroup, previousGroups };
		},
		onSuccess: (updatedGroup) => {
			queryClient.setQueryData<FeedbackGroupDetail>(
				["feedback-group", id],
				(current) =>
					current
						? {
								...current,
								linkActive: updatedGroup.linkActive,
								endDate: updatedGroup.endDate,
								updatedAt: updatedGroup.updatedAt,
							}
						: current,
			);
			queryClient.setQueryData<FeedbackGroupsResponse>(
				["feedback-groups"],
				(current) =>
					current
						? {
								...current,
								groups: current.groups.map((item) =>
									item.id === updatedGroup.id ? updatedGroup : item,
								),
							}
						: current,
			);
			queryClient.invalidateQueries({ queryKey: ["feedback-groups"] });
		},
		onError: (_error, _linkActive, context) => {
			if (context?.previousGroup) {
				queryClient.setQueryData(["feedback-group", id], context.previousGroup);
			}

			if (context?.previousGroups) {
				queryClient.setQueryData(["feedback-groups"], context.previousGroups);
			}
		},
	});

	const answers = group?.answers ?? [];
	const filteredAnswers =
		activeTab === "전체"
			? answers
			: answers.filter((answer) =>
					activeTab === "회고 완료"
						? answer.retrospectiveCompleted
						: !answer.retrospectiveCompleted,
				);
	const isAiAvailable =
		!group?.linkActive &&
		answers.length > 0 &&
		answers.every((answer) => answer.retrospectiveCompleted);

	const copyFeedbackLink = async () => {
		if (!group?.linkToken) return;

		const shareUrl = `${window.location.origin}/feedback?token=${group.linkToken}`;

		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopyMessage("링크를 복사했어요.");
		} catch {
			setCopyMessage("링크 복사에 실패했어요.");
		}
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
					{getErrorMessage(error, "그룹을 불러오지 못했어요.")}
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

	const dateLabel = getDateLabel(group);

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			<Header onBack={() => navigate(-1)} withBottomSpacing={false} />

			<div className="flex flex-col gap-2 px-5 mt-4">
				<h1 className="text-[30px] font-bold text-black leading-tight m-0">
					{group.name}
				</h1>
				<p className="text-[14px] text-black m-0">{dateLabel}</p>
			</div>

			<div className="flex flex-col gap-5 px-5 mt-[26px]">
				<button
					type="button"
					onClick={() =>
						!linkActiveMutation.isPending &&
						linkActiveMutation.mutate(!group.linkActive)
					}
					className="w-full bg-white rounded-[16px] flex items-center justify-between px-[10px] py-4 border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
					disabled={linkActiveMutation.isPending}
				>
					<span className="text-[16px] font-bold text-black">
						피드백 수집 활성화
					</span>
					<div
						className="relative w-[49px] h-[26px] rounded-[80px] transition-colors duration-200 flex-shrink-0"
						style={{
							background: group.linkActive ? "rgba(0,115,255,0.8)" : "#D9D9D9",
						}}
					>
						<div
							className="absolute top-[2px] w-[22px] h-[22px] rounded-full bg-white transition-all duration-200"
							style={{ left: group.linkActive ? "25px" : "2px" }}
						/>
					</div>
				</button>
				{linkActiveMutation.isError && (
					<p className="-mt-3 mb-0 px-[10px] text-[13px] font-medium text-red-500">
						{getErrorMessage(
							linkActiveMutation.error,
							"피드백 수집 상태를 변경하지 못했어요.",
						)}
					</p>
				)}

				<button
					type="button"
					onClick={copyFeedbackLink}
					className="w-full bg-white rounded-[16px] flex items-center justify-between px-[10px] py-4 border-none cursor-pointer"
				>
					<span className="text-[16px] font-bold text-black">
						피드백 링크 복사하기
					</span>
					<span
						className="text-[14px]"
						style={{ color: "#696969", textDecoration: "underline" }}
					>
						복사하기
					</span>
				</button>
				{copyMessage && (
					<p className="-mt-3 mb-0 px-[10px] text-[13px] font-medium text-[#696969]">
						{copyMessage}
					</p>
				)}
			</div>

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

			<main className="flex-1 px-5 mt-5 pb-36">
				{filteredAnswers.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<span className="text-[20px] text-black/50">
							아직 받은 피드백이 없어요
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{filteredAnswers.map((answer) => (
							<FeedbackCard
								key={answer.id}
								feedback={toFeedbackItem(answer)}
								onClick={() => navigate(`/feedback/detail/${answer.id}`)}
							/>
						))}
					</div>
				)}
			</main>

			<FloatingActionButton
				onClick={() =>
					isAiAvailable
						? navigate(`/groups/${id}/analysis`)
						: setShowAiInfo((prev) => !prev)
				}
				active={isAiAvailable}
				topContent={
					showAiInfo ? (
						<div
							className="rounded-[16px] px-3 py-3"
							style={{ background: "#A9A9A9" }}
						>
							<p
								className="text-[12px] font-medium leading-[1.6] m-0 whitespace-pre-line"
								style={{ color: "#EDF0FF" }}
							>
								{
									"피드백 수집이 종료되면\n수집된 피드백을 기반으로\nAI 인사이트 분석이 가능해요."
								}
							</p>
						</div>
					) : null
				}
			>
				AI 분석
			</FloatingActionButton>
		</div>
	);
}
