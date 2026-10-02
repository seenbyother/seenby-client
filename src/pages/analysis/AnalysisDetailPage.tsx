import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router";
import {
	hasViewedAnalysis,
	markAnalysisViewed,
} from "@/features/feedback-groups/analysisViewed";
import {
	deleteFeedbackAnalysis,
	getAnalysisDetail,
} from "@/features/feedback-groups/api";
import { ActionMenu, ConfirmDialog, Header } from "@/shared/components";
import { formatKoreanDate } from "@/shared/utils/date";
import {
	ActionPlanSection,
	ComparisonSection,
	FinalTypeSection,
	InsightSection,
	KeywordsSection,
	SelfAwarenessCard,
	SummarySection,
	UsedFeedbackSection,
} from "./_components/AnalysisSections";
import { AnalysisStepView } from "./_components/AnalysisStepView";
import { ANALYSIS_PREVIEW_DATA, toAnalysisViewModel } from "./model";
import { getErrorMessage } from "./utils";

function scrollToPageTop() {
	window.scrollTo({ top: 0, behavior: "instant" });
}

type AnalysisViewReturnState = {
	analysisId: number;
	stepIndex: number;
};

function getAnalysisViewReturnState(
	state: unknown,
): AnalysisViewReturnState | null {
	if (!state || typeof state !== "object" || !("analysisViewReturn" in state)) {
		return null;
	}

	const value = state.analysisViewReturn;
	if (!value || typeof value !== "object") return null;
	if (!("analysisId" in value) || !("stepIndex" in value)) return null;
	if (
		typeof value.analysisId !== "number" ||
		typeof value.stepIndex !== "number" ||
		!Number.isInteger(value.stepIndex) ||
		value.stepIndex < 0
	) {
		return null;
	}

	return {
		analysisId: value.analysisId,
		stepIndex: value.stepIndex,
	};
}

export function AnalysisDetailPage({ preview = false }: { preview?: boolean }) {
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();
	const { analysisId } = useParams<{ analysisId: string }>();
	const [searchParams] = useSearchParams();
	const isPreview = preview || analysisId === "preview";
	const id = Number(analysisId);
	const isValidId = Number.isInteger(id) && id > 0;
	const forceMode = import.meta.env.DEV ? searchParams.get("mode") : null;
	const [analysisViewReturn] = useState(() =>
		getAnalysisViewReturnState(location.state),
	);
	const shouldRestoreAnalysisView = analysisViewReturn?.analysisId === id;
	const [isFirstReadView, setIsFirstReadView] = useState<boolean | null>(() => {
		if (shouldRestoreAnalysisView) return true;
		if (forceMode === "first") return true;
		if (forceMode === "history" || isPreview) return false;
		return null;
	});
	const [stepIndex, setStepIndex] = useState(
		shouldRestoreAnalysisView ? analysisViewReturn.stepIndex : 0,
	);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const detailQuery = useQuery({
		queryKey: ["analysis-detail", id],
		queryFn: () => getAnalysisDetail(id),
		enabled: !isPreview && isValidId,
	});
	const rawData = isPreview ? ANALYSIS_PREVIEW_DATA : detailQuery.data;
	const data = rawData ? toAnalysisViewModel(rawData) : null;
	const deleteAnalysisMutation = useMutation({
		mutationFn: () => deleteFeedbackAnalysis(id),
		onSuccess: async () => {
			queryClient.removeQueries({ queryKey: ["analysis-detail", id] });
			await queryClient.invalidateQueries({ queryKey: ["analysis-history"] });
			navigate("/analysis", { replace: true });
		},
	});

	useEffect(() => {
		if (!rawData || isFirstReadView !== null) return;
		setIsFirstReadView(rawData.isRead === false && !hasViewedAnalysis(id));
	}, [id, isFirstReadView, rawData]);

	useEffect(() => {
		if (!shouldRestoreAnalysisView) return;
		navigate(`${location.pathname}${location.search}`, {
			replace: true,
			state: null,
		});
	}, [location.pathname, location.search, navigate, shouldRestoreAnalysisView]);

	const maxStepIndex = data?.steps.length ?? 0;
	const safeStepIndex = Math.min(stepIndex, maxStepIndex);
	const completeFirstRead = () => {
		if (!isPreview) markAnalysisViewed(id);
	};
	const handleBack = () => {
		if (isFirstReadView && safeStepIndex > 0) {
			scrollToPageTop();
			setStepIndex(safeStepIndex - 1);
			return;
		}

		if (isFirstReadView) completeFirstRead();
		navigate(-1);
	};
	const handleExit = () => {
		completeFirstRead();
		navigate("/analysis", { replace: true });
	};
	const isLoading = !isPreview && detailQuery.isLoading;
	const isError = !isPreview && (!isValidId || detailQuery.isError);
	const isResolvingViewMode = Boolean(data && isFirstReadView === null);
	const handleStepFeedbackSelect = (feedbackId: number) => {
		navigate(`${location.pathname}${location.search}`, {
			replace: true,
			state: {
				analysisViewReturn: {
					analysisId: id,
					stepIndex: safeStepIndex,
				},
			},
			flushSync: true,
		});
		navigate(`/feedback/detail/${feedbackId}`);
	};

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<Header
				title={
					isFirstReadView === false ? "피드백 분석 내역" : "AI 분석 리포트"
				}
				onBack={handleBack}
				withBottomSpacing={false}
				rightContent={
					data && isFirstReadView === true ? (
						<ExitAnalysisButton onClick={handleExit} />
					) : data && !isPreview && isFirstReadView === false ? (
						<ActionMenu
							items={[
								{
									label: "다시 생성하기",
									onSelect: () =>
										navigate(
											`/groups/${data.groupId}/analysis?mode=analysis-regenerate&analysisId=${id}`,
										),
								},
								{
									label: "삭제하기",
									destructive: true,
									onSelect: () => setIsDeleteDialogOpen(true),
								},
							]}
						/>
					) : undefined
				}
			/>
			{isDeleteDialogOpen ? (
				<ConfirmDialog
					title="분석 결과를 삭제할까요?"
					description="삭제된 분석 결과는 복구할 수 없어요."
					confirmLabel="삭제하기"
					pendingLabel="삭제 중..."
					isPending={deleteAnalysisMutation.isPending}
					errorMessage={
						deleteAnalysisMutation.isError
							? getErrorMessage(
									deleteAnalysisMutation.error,
									"분석 결과를 삭제하지 못했어요.",
								)
							: undefined
					}
					onConfirm={() => deleteAnalysisMutation.mutate()}
					onCancel={() => setIsDeleteDialogOpen(false)}
				/>
			) : null}
			{isLoading || isResolvingViewMode ? (
				<Loading />
			) : isError ? (
				<ErrorState
					message={
						!isValidId
							? "유효한 분석 번호를 확인해주세요."
							: detailQuery.error instanceof Error
								? detailQuery.error.message
								: "분석 결과를 불러오지 못했어요."
					}
					onBack={() => navigate(-1)}
				/>
			) : data ? (
				isFirstReadView ? (
					<AnalysisStepView
						data={data}
						stepIndex={safeStepIndex}
						onStepIndexChange={setStepIndex}
						onSelectFeedback={handleStepFeedbackSelect}
					/>
				) : (
					<AnalysisContent data={data} />
				)
			) : null}
		</div>
	);
}

function AnalysisContent({
	data,
}: {
	data: ReturnType<typeof toAnalysisViewModel>;
}) {
	const navigate = useNavigate();
	return (
		<main className="pb-10 [overflow-wrap:anywhere]">
			<div className="px-5 pb-7 pt-0 text-center">
				<h1 className="m-0 text-[30px] font-bold text-[#14171C]">
					{data.groupName}
				</h1>
				<p className="mb-0 mt-2 text-[14px] text-black/70">
					{formatKoreanDate(data.analyzedAt)}
				</p>
			</div>
			<div className="flex flex-col gap-5 px-[18px]">
				<SummarySection data={data} />
				<KeywordsSection data={data} />
				<InsightSection data={data} />
				<SelfAwarenessCard data={data} />
				<ComparisonSection data={data} />
				<ActionPlanSection data={data} />
				<FinalTypeSection data={data} />
				{data.usedFeedbacks.length > 0 ? (
					<UsedFeedbackSection
						data={data}
						onSelect={(feedbackId) =>
							navigate(`/feedback/detail/${feedbackId}`)
						}
					/>
				) : null}
			</div>
		</main>
	);
}

function ExitAnalysisButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="AI 분석 나가기"
			className="h-8 rounded-[10px] border-0 bg-[#EAF4FF] px-3 text-[12px] font-bold text-[#0073FF] active:bg-[#DCEEFF]"
		>
			나가기
		</button>
	);
}

function Loading() {
	return (
		<div className="flex h-[calc(100svh-64px)] items-center justify-center">
			<div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E8EBF0] border-t-[#0073FF]" />
		</div>
	);
}
function ErrorState({
	message,
	onBack,
}: {
	message: string;
	onBack: () => void;
}) {
	return (
		<div className="flex h-[calc(100svh-64px)] flex-col items-center justify-center gap-3 px-5 text-center">
			<span className="text-[16px] font-medium text-red-500">{message}</span>
			<button
				type="button"
				onClick={onBack}
				className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
			>
				돌아가기
			</button>
		</div>
	);
}
