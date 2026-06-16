import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BackIcon from "@/assets/feedback/before.svg?react";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import {
	getFeedbackAnswerDetail,
	saveFeedbackRetrospect,
} from "@/features/feedback-answers/api";
import { ExperienceCard } from "@/pages/feedback-detail/_components/ExperienceCard";
import { RetrospectiveCard } from "@/pages/feedback-detail/_components/RetrospectiveCard";
import { RetrospectiveSheet } from "@/pages/feedback-detail/_components/RetrospectiveSheet";
import { ApiError } from "@/shared/api";

function getErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		const body = error.body as { error?: unknown; message?: unknown };

		if (typeof body?.message === "string") {
			return body.message;
		}

		if (typeof body?.error === "string") {
			return body.error;
		}
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "피드백 답변을 불러오지 못했어요.";
}

export function FeedbackDetailPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { answerId } = useParams<{ answerId: string }>();
	const { data: currentUser } = useCurrentUser();
	const recipientName = getCurrentUserName(currentUser);
	const currentAnswerId = Number(answerId);
	const isValidAnswerId =
		Number.isInteger(currentAnswerId) && currentAnswerId > 0;
	const { data, error, isError, isLoading, refetch } = useQuery({
		queryKey: ["feedback-answer", currentAnswerId],
		queryFn: () => getFeedbackAnswerDetail(currentAnswerId),
		enabled: isValidAnswerId,
	});
	const [
		retrospectivesByExperienceFeedbackId,
		setRetrospectivesByExperienceFeedbackId,
	] = useState<Record<number, string>>({});
	const [editingExperienceFeedbackId, setEditingExperienceFeedbackId] =
		useState<number | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [retrospectiveSaveError, setRetrospectiveSaveError] = useState<
		string | null
	>(null);
	const saveRetrospectMutation = useMutation({
		mutationFn: ({
			experienceFeedbackId,
			retrospect,
		}: {
			experienceFeedbackId: number;
			retrospect: string | null;
		}) => saveFeedbackRetrospect(experienceFeedbackId, retrospect),
		onSuccess: async () => {
			setRetrospectiveSaveError(null);
			setIsSheetOpen(false);
			setEditingExperienceFeedbackId(null);

			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["feedback-answer", currentAnswerId],
				}),
				data
					? queryClient.invalidateQueries({
							queryKey: ["feedback-group", data.feedbackGroupId],
						})
					: Promise.resolve(),
			]);
		},
		onError: (mutationError) => {
			setRetrospectiveSaveError(getErrorMessage(mutationError));
		},
	});

	useEffect(() => {
		if (!data) {
			return;
		}

		setRetrospectivesByExperienceFeedbackId((current) => {
			const next = { ...current };

			for (const experienceFeedback of data.experienceFeedbacks) {
				if (
					next[experienceFeedback.id] === undefined &&
					experienceFeedback.retrospect !== undefined
				) {
					next[experienceFeedback.id] = experienceFeedback.retrospect ?? "";
				}
			}

			return next;
		});
	}, [data]);

	const activeExperienceFeedback =
		editingExperienceFeedbackId === null
			? null
			: (data?.experienceFeedbacks.find(
					(item) => item.id === editingExperienceFeedbackId,
				) ?? null);
	const activeRetrospective = activeExperienceFeedback
		? (retrospectivesByExperienceFeedbackId[activeExperienceFeedback.id] ?? "")
		: "";

	const openRetrospectiveEditor = (experienceFeedbackId: number) => {
		setRetrospectiveSaveError(null);
		setEditingExperienceFeedbackId(experienceFeedbackId);
		setIsSheetOpen(true);
	};

	const updateRetrospective = (value: string) => {
		if (editingExperienceFeedbackId === null) return;

		setRetrospectivesByExperienceFeedbackId((current) => ({
			...current,
			[editingExperienceFeedbackId]: value,
		}));
	};

	const saveRetrospective = () => {
		if (saveRetrospectMutation.isPending) {
			return;
		}

		if (editingExperienceFeedbackId === null) {
			setIsSheetOpen(false);
			return;
		}

		const retrospect =
			retrospectivesByExperienceFeedbackId[editingExperienceFeedbackId] ?? "";

		saveRetrospectMutation.mutate({
			experienceFeedbackId: editingExperienceFeedbackId,
			retrospect,
		});
	};

	const closeSheet = () => {
		setRetrospectiveSaveError(null);
		setIsSheetOpen(false);
	};

	const submittedDate = data
		? new Intl.DateTimeFormat("ko-KR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}).format(new Date(data.submittedAt))
		: "";

	if (!isValidAnswerId) {
		return (
			<FeedbackDetailLayout onBack={() => navigate(-1)}>
				<div className="flex h-[60vh] items-center justify-center">
					<span className="text-[18px] text-black/50">
						피드백 답변을 찾을 수 없어요
					</span>
				</div>
			</FeedbackDetailLayout>
		);
	}

	if (isLoading) {
		return (
			<FeedbackDetailLayout onBack={() => navigate(-1)}>
				<div className="flex h-[60vh] items-center justify-center">
					<span className="text-[18px] text-black/50">불러오는 중...</span>
				</div>
			</FeedbackDetailLayout>
		);
	}

	if (isError || !data) {
		return (
			<FeedbackDetailLayout onBack={() => navigate(-1)}>
				<div className="flex h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center">
					<span className="text-[16px] font-medium text-red-500">
						{getErrorMessage(error)}
					</span>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
					>
						다시 불러오기
					</button>
				</div>
			</FeedbackDetailLayout>
		);
	}

	return (
		<FeedbackDetailLayout
			onBack={() => navigate(-1)}
			sheet={
				<RetrospectiveSheet
					isOpen={isSheetOpen}
					experienceFeedback={activeExperienceFeedback}
					value={activeRetrospective}
					onChange={updateRetrospective}
					onClose={closeSheet}
					onSave={saveRetrospective}
					isSaving={saveRetrospectMutation.isPending}
					errorMessage={retrospectiveSaveError}
				/>
			}
		>
			<section className="mb-6 flex items-end justify-between">
				<h1 className="m-0 text-[24px] font-bold leading-none">
					{data.reviewerName} 님의 피드백
				</h1>
				<p className="m-0 text-center text-[12px] leading-none text-[#696969]">
					{submittedDate}
				</p>
			</section>

			<section className="rounded-[20px] bg-white p-4">
				<h2 className="m-0 text-[16px] font-bold leading-normal">
					{recipientName} 님에게 어울리는 단어
				</h2>
				{data.keywords.length === 0 ? (
					<p className="mt-3 mb-0 text-[14px] text-[#696969]">
						선택된 단어가 없어요
					</p>
				) : (
					<div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3">
						{data.keywords.map((keyword) => (
							<KeywordBadge key={keyword} keyword={keyword} />
						))}
					</div>
				)}
			</section>

			<p className="my-6 text-right text-[12px] leading-none text-[#696969]">
				총 {data.experienceCount}개
			</p>

			<div className="flex flex-col gap-6">
				{data.experienceFeedbacks.map((experienceFeedback) => (
					<section key={experienceFeedback.id} className="flex flex-col gap-5">
						<ExperienceCard
							experienceFeedback={experienceFeedback}
							recipientName={recipientName}
						/>
						<RetrospectiveCard
							experienceFeedback={experienceFeedback}
							retrospective={
								retrospectivesByExperienceFeedbackId[experienceFeedback.id] ??
								""
							}
							isEditing={
								editingExperienceFeedbackId === experienceFeedback.id &&
								isSheetOpen
							}
							onToggleEdit={() =>
								editingExperienceFeedbackId === experienceFeedback.id &&
								isSheetOpen
									? saveRetrospective()
									: openRetrospectiveEditor(experienceFeedback.id)
							}
							onOpen={() => openRetrospectiveEditor(experienceFeedback.id)}
						/>
					</section>
				))}
			</div>
		</FeedbackDetailLayout>
	);
}

function KeywordBadge({ keyword }: { keyword: string }) {
	const label = `#${keyword}`;
	const fontSize = getKeywordBadgeFontSize(label);

	return (
		<span
			className="flex h-8 min-w-0 items-center justify-center whitespace-nowrap rounded-[20px] border border-[rgba(0,115,255,0.1)] bg-[rgba(0,115,255,0.05)] px-1 font-semibold leading-none text-[#0073FF]"
			style={{ fontSize }}
			title={label}
		>
			{label}
		</span>
	);
}

function getKeywordBadgeFontSize(label: string) {
	if (label.length >= 8) {
		return 10;
	}

	if (label.length >= 6) {
		return 11;
	}

	return 13;
}

type FeedbackDetailLayoutProps = {
	children: ReactNode;
	onBack: () => void;
	sheet?: ReactNode;
};

function FeedbackDetailLayout({
	children,
	onBack,
	sheet,
}: FeedbackDetailLayoutProps) {
	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="relative mx-auto h-[100svh] w-full max-w-[402px] overflow-hidden bg-[#F8F8F8]">
				<div className="h-full overflow-y-auto px-[19px] pb-[124px] pt-8">
					<header className="mb-6 flex h-8 items-center">
						<button
							type="button"
							onClick={onBack}
							aria-label="뒤로 가기"
							className="flex h-8 w-8 items-center justify-center border-0 bg-transparent p-0"
						>
							<BackIcon aria-hidden="true" />
						</button>
					</header>
					{children}
				</div>
				{sheet}
			</div>
		</main>
	);
}
