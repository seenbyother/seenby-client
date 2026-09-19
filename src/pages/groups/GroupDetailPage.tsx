import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import kakaoIcon from "@/assets/kakao.svg";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import {
	deleteFeedbackGroup,
	type FeedbackGroupDetail,
	type FeedbackGroupsResponse,
	getFeedbackGroupDetail,
	updateFeedbackGroup,
	updateFeedbackGroupLinkActive,
} from "@/features/feedback-groups/api";
import {
	CONTEXT_OPTIONS,
	RELATION_OPTIONS,
} from "@/pages/feedback-group/constants";
import { ApiError } from "@/shared/api";
import { ActionMenu, ConfirmDialog, Header } from "@/shared/components";
import { shareToKakaoWithTemplate } from "@/shared/lib/kakao";
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
	const { data: currentUser } = useCurrentUser();
	const userName = getCurrentUserName(currentUser);
	const [activeTab, setActiveTab] = useState<FilterTab>("전체");
	const [showAiInfo, setShowAiInfo] = useState(false);
	const [copyMessage, setCopyMessage] = useState("");
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [editedGroupName, setEditedGroupName] = useState("");
	const [editedRelationshipType, setEditedRelationshipType] = useState("");
	const [editedContextType, setEditedContextType] = useState("");

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
	const updateGroupMutation = useMutation({
		mutationFn: (body: {
			name: string;
			relationshipType: string;
			contextType: string;
		}) => updateFeedbackGroup(id, body),
		onSuccess: async (_updatedGroup, body) => {
			queryClient.setQueryData<FeedbackGroupDetail>(
				["feedback-group", id],
				(current) =>
					current
						? {
								...current,
								name: body.name,
								relationshipType: body.relationshipType,
								contextType: body.contextType,
							}
						: current,
			);
			await queryClient.invalidateQueries({ queryKey: ["feedback-groups"] });
			setIsEditDialogOpen(false);
		},
	});
	const deleteGroupMutation = useMutation({
		mutationFn: () => deleteFeedbackGroup(id),
		onSuccess: async () => {
			queryClient.removeQueries({ queryKey: ["feedback-group", id] });
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["feedback-groups"] }),
				queryClient.invalidateQueries({ queryKey: ["analysis-history"] }),
				queryClient.invalidateQueries({ queryKey: ["cover-letters"] }),
			]);
			navigate("/groups", { replace: true });
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
	const isAlreadyAnalyzed =
		group?.aiAnalysisStatus === "COMPLETED" ||
		group?.coverLetterStatus === "COMPLETED";
	const isAiAvailable =
		!group?.linkActive &&
		answers.length >= 3 &&
		answers.every((answer) => answer.retrospectiveCompleted) &&
		!isAlreadyAnalyzed;

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

	const shareGroupToKakao = () => {
		if (!group?.linkToken) return;
		shareToKakaoWithTemplate(134316, {
			userName,
			link: `feedback?token=${group.linkToken}`,
		});
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
			<Header
				onBack={() => navigate(-1)}
				withBottomSpacing={false}
				rightAction={
					<ActionMenu
						items={[
							{
								label: "그룹 정보 수정",
								onSelect: () => {
									const cachedGroup = queryClient
										.getQueryData<FeedbackGroupsResponse>(["feedback-groups"])
										?.groups.find((item) => item.id === id);
									updateGroupMutation.reset();
									setEditedGroupName(group.name);
									setEditedRelationshipType(
										group.relationshipType ??
											cachedGroup?.relationshipType ??
											"",
									);
									setEditedContextType(
										group.contextType ?? cachedGroup?.contextType ?? "",
									);
									setIsEditDialogOpen(true);
								},
							},
							{
								label: "그룹 삭제",
								destructive: true,
								onSelect: () => setIsDeleteDialogOpen(true),
							},
						]}
					/>
				}
			/>

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

				<div className="w-full bg-white rounded-[16px] flex items-center justify-between px-[10px] py-4">
					<span className="text-[16px] font-bold text-black">
						피드백 링크 복사하기
					</span>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={shareGroupToKakao}
							className="border-none p-1.5 rounded-full cursor-pointer flex items-center justify-center"
							style={{ background: "#FEE500" }}
							aria-label="카카오톡으로 공유하기"
						>
							<img src={kakaoIcon} alt="" className="w-4 h-4 object-contain" />
						</button>
						<button
							type="button"
							onClick={copyFeedbackLink}
							className="border-none bg-transparent p-0 cursor-pointer text-[14px]"
							style={{ color: "#696969", textDecoration: "underline" }}
						>
							복사하기
						</button>
					</div>
				</div>
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
								{isAlreadyAnalyzed
									? "이미 AI 분석 내역이 존재해요."
									: "피드백이 3개 이상 수집되고\n수집이 종료된 후 모든 피드백의\n회고가 완료되면 AI 인사이트 분석이 가능해요."}
							</p>
						</div>
					) : null
				}
			>
				AI 분석
			</FloatingActionButton>

			{isEditDialogOpen ? (
				<GroupEditDialog
					name={editedGroupName}
					relationshipType={editedRelationshipType}
					contextType={editedContextType}
					originalValues={{
						name: group.name,
						relationshipType: group.relationshipType,
						contextType: group.contextType,
					}}
					isPending={updateGroupMutation.isPending}
					errorMessage={
						updateGroupMutation.isError
							? getGroupActionErrorMessage(
									updateGroupMutation.error,
									"그룹 정보를 수정하지 못했어요.",
								)
							: null
					}
					onNameChange={setEditedGroupName}
					onRelationshipTypeChange={setEditedRelationshipType}
					onContextTypeChange={setEditedContextType}
					onCancel={() => {
						updateGroupMutation.reset();
						setIsEditDialogOpen(false);
					}}
					onSave={() =>
						updateGroupMutation.mutate({
							name: editedGroupName.trim(),
							relationshipType: editedRelationshipType.trim(),
							contextType: editedContextType.trim(),
						})
					}
				/>
			) : null}

			{isDeleteDialogOpen ? (
				<ConfirmDialog
					title={`‘${group.name}’ 그룹을 삭제할까요?`}
					description="그룹을 삭제하면 다시 복구할 수 없어요. 연결된 피드백과 분석 내역도 확인하기 어려울 수 있어요."
					confirmLabel="삭제하기"
					destructive
					isPending={deleteGroupMutation.isPending}
					errorMessage={
						deleteGroupMutation.isError
							? getGroupActionErrorMessage(
									deleteGroupMutation.error,
									"그룹을 삭제하지 못했어요.",
								)
							: null
					}
					onCancel={() => {
						deleteGroupMutation.reset();
						setIsDeleteDialogOpen(false);
					}}
					onConfirm={() => deleteGroupMutation.mutate()}
				/>
			) : null}
		</div>
	);
}

interface GroupEditDialogProps {
	name: string;
	relationshipType: string;
	contextType: string;
	originalValues: {
		name: string;
		relationshipType: string;
		contextType: string;
	};
	isPending: boolean;
	errorMessage: string | null;
	onNameChange: (value: string) => void;
	onRelationshipTypeChange: (value: string) => void;
	onContextTypeChange: (value: string) => void;
	onCancel: () => void;
	onSave: () => void;
}

function GroupEditDialog({
	name,
	relationshipType,
	contextType,
	originalValues,
	isPending,
	errorMessage,
	onNameChange,
	onRelationshipTypeChange,
	onContextTypeChange,
	onCancel,
	onSave,
}: GroupEditDialogProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const onCancelRef = useRef(onCancel);
	const titleId = useId();
	onCancelRef.current = onCancel;
	const trimmedName = name.trim();
	const trimmedRelationshipType = relationshipType.trim();
	const trimmedContextType = contextType.trim();
	const hasChanges =
		trimmedName !== originalValues.name.trim() ||
		trimmedRelationshipType !== originalValues.relationshipType?.trim() ||
		trimmedContextType !== originalValues.contextType?.trim();
	const canSave =
		trimmedName.length > 0 &&
		trimmedRelationshipType.length > 0 &&
		trimmedContextType.length > 0 &&
		hasChanges &&
		!isPending;

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		inputRef.current?.focus();
		inputRef.current?.select();
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isPending) onCancelRef.current();
		};
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [isPending]);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-6 py-8">
			<button
				type="button"
				aria-label="그룹명 수정 창 닫기"
				disabled={isPending}
				onClick={onCancel}
				className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
			/>
			<form
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				onSubmit={(event) => {
					event.preventDefault();
					if (canSave) onSave();
				}}
				className="relative z-10 max-h-full w-full max-w-[354px] overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
			>
				<h2 id={titleId} className="m-0 text-[17px] font-bold text-[#222222]">
					그룹 정보 수정
				</h2>
				<label
					htmlFor="group-name"
					className="mt-4 block text-[12px] font-semibold text-[#71717A]"
				>
					그룹명
				</label>
				<input
					ref={inputRef}
					id="group-name"
					value={name}
					maxLength={30}
					disabled={isPending}
					onChange={(event) => onNameChange(event.target.value)}
					className="mt-2 h-11 w-full rounded-xl border border-[#DDE1E6] px-3 text-[15px] font-semibold text-[#222222] outline-none focus:border-[#0073FF] disabled:opacity-50"
				/>
				<p className="mb-0 mt-1 text-right text-[11px] text-[#A1A9B2]">
					{name.length}/30
				</p>

				<ChoiceField
					label="그룹 관계"
					options={RELATION_OPTIONS}
					value={relationshipType}
					disabled={isPending}
					onChange={onRelationshipTypeChange}
				/>
				<ChoiceField
					label="그룹 상황"
					options={CONTEXT_OPTIONS}
					value={contextType}
					disabled={isPending}
					onChange={onContextTypeChange}
				/>
				{errorMessage ? (
					<p
						aria-live="polite"
						className="mb-0 mt-3 rounded-lg bg-[#FFF1F1] px-3 py-2 text-[12px] font-semibold text-[#D83A40]"
					>
						{errorMessage}
					</p>
				) : null}
				<div className="mt-5 grid grid-cols-2 gap-2">
					<button
						type="button"
						disabled={isPending}
						onClick={onCancel}
						className="h-10 rounded-xl border-0 bg-[#F0F2F4] text-[13px] font-bold text-[#555D67] disabled:opacity-50"
					>
						취소
					</button>
					<button
						type="submit"
						disabled={!canSave}
						className="h-10 rounded-xl border-0 bg-[#0073FF] text-[13px] font-bold text-white disabled:opacity-40"
					>
						{isPending ? "저장 중..." : "저장"}
					</button>
				</div>
			</form>
		</div>
	);
}

interface ChoiceFieldProps {
	label: string;
	options: readonly string[];
	value: string;
	disabled: boolean;
	onChange: (value: string) => void;
}

function ChoiceField({
	label,
	options,
	value,
	disabled,
	onChange,
}: ChoiceFieldProps) {
	return (
		<fieldset className="mt-4 border-0 p-0">
			<legend className="text-[12px] font-semibold text-[#71717A]">
				{label}
			</legend>
			<div className="mt-2 flex flex-wrap gap-2">
				{options.map((option) => (
					<button
						key={option}
						type="button"
						disabled={disabled}
						aria-pressed={value === option}
						onClick={() => onChange(option)}
						className={`h-8 rounded-full border px-3 text-[12px] font-semibold transition-colors disabled:opacity-50 ${
							value === option
								? "border-[#0073FF] bg-[#0073FF] text-white"
								: "border-[rgba(0,115,255,0.12)] bg-[rgba(0,115,255,0.05)] text-[#0073FF]"
						}`}
					>
						{option}
					</button>
				))}
			</div>
			<label className="mt-2 block">
				<span className="sr-only">{label} 직접 입력</span>
				<input
					value={value}
					maxLength={30}
					disabled={disabled}
					onChange={(event) => onChange(event.target.value)}
					placeholder="직접 입력"
					className="h-10 w-full rounded-xl border border-[#DDE1E6] px-3 text-[13px] font-medium text-[#222222] outline-none placeholder:text-[#A1A9B2] focus:border-[#0073FF] disabled:opacity-50"
				/>
			</label>
		</fieldset>
	);
}

function getGroupActionErrorMessage(error: unknown, fallback: string) {
	if (error instanceof ApiError) {
		return `${fallback} 잠시 후 다시 시도해주세요.`;
	}

	const message = error instanceof Error ? error.message : "";
	const containsServerFieldName = [
		"relationshipType",
		"contextType",
		"statusCode",
		"statuscode",
	].some((fieldName) => message.includes(fieldName));

	if (containsServerFieldName) {
		return `${fallback} 잠시 후 다시 시도해주세요.`;
	}

	return message.trim() || fallback;
}
