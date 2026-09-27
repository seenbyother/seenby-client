import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
	hasViewedAnalysis,
	markAnalysisViewed,
} from "@/features/feedback-groups/analysisViewed";
import {
	deleteFeedbackAnalysis,
	getAnalysisDetail,
	getAnalysisHistory,
} from "@/features/feedback-groups/api";
import { ConfirmDialog, Header, KebabMenu } from "@/shared/components";
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
import {
	ANALYSIS_PREVIEW_DATA,
	getAnalysisGroupName,
	toAnalysisViewModel,
} from "./model";
import { getErrorMessage } from "./utils";

function scrollToPageTop() {
	window.scrollTo({ top: 0, behavior: "instant" });
}

export function AnalysisDetailPage({ preview = false }: { preview?: boolean }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { analysisId } = useParams<{ analysisId: string }>();
	const [searchParams] = useSearchParams();
	const isPreview = preview || analysisId === "preview";
	const id = Number(analysisId);
	const isValidId = Number.isInteger(id) && id > 0;
	const forceMode = import.meta.env.DEV ? searchParams.get("mode") : null;
	const [showStep, setShowStep] = useState<boolean | null>(() => {
		if (forceMode === "first") return true;
		if (forceMode === "history" || isPreview) return false;
		return null;
	});
	const [stepIndex, setStepIndex] = useState(0);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const detailQuery = useQuery({
		queryKey: ["analysis-detail", id],
		queryFn: () => getAnalysisDetail(id),
		enabled: !isPreview && isValidId,
	});
	const rawData = isPreview ? ANALYSIS_PREVIEW_DATA : detailQuery.data;
	const detailGroupName = rawData ? getAnalysisGroupName(rawData) : "";
	const shouldFetchGroupFallback =
		!isPreview && isValidId && Boolean(rawData) && !detailGroupName;
	const historyQuery = useQuery({
		queryKey: ["analysis-history"],
		queryFn: getAnalysisHistory,
		enabled: shouldFetchGroupFallback,
	});
	const historyGroupName = historyQuery.data?.analyses.find(
		(item) => item.analysisId === id,
	)?.group.title;
	const fallbackGroupName =
		historyGroupName ??
		(historyQuery.isFetched || historyQuery.isError ? "피드백 그룹" : "");
	const data = useMemo(
		() => (rawData ? toAnalysisViewModel(rawData, fallbackGroupName) : null),
		[fallbackGroupName, rawData],
	);
	const deleteAnalysisMutation = useMutation({
		mutationFn: () => deleteFeedbackAnalysis(id),
		onSuccess: async () => {
			queryClient.removeQueries({ queryKey: ["analysis-detail", id] });
			await queryClient.invalidateQueries({ queryKey: ["analysis-history"] });
			navigate("/analysis", { replace: true });
		},
	});

	useEffect(() => {
		if (!rawData || showStep !== null) return;
		setShowStep(rawData.readAt == null && !hasViewedAnalysis(id));
	}, [id, rawData, showStep]);

	useEffect(() => {
		if (showStep === true && !isPreview) markAnalysisViewed(id);
	}, [id, isPreview, showStep]);

	const handleBack = () => {
		if (showStep && stepIndex > 0) {
			scrollToPageTop();
			setStepIndex((value) => value - 1);
		} else navigate(-1);
	};
	const isLoading =
		!isPreview && (detailQuery.isLoading || historyQuery.isLoading);
	const isError = !isPreview && (!isValidId || detailQuery.isError);
	const isResolvingViewMode = data && showStep === null;

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<Header
				title={showStep === false ? "피드백 분석 내역" : "AI 분석 리포트"}
				onBack={handleBack}
				withBottomSpacing={false}
				rightContent={
					!isPreview && data && showStep === false ? (
						<KebabMenu
							items={[
								{
									label: "삭제하기",
									destructive: true,
									onClick: () => setIsDeleteDialogOpen(true),
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
				showStep ? (
					<AnalysisStepView
						data={data}
						stepIndex={stepIndex}
						onStepIndexChange={setStepIndex}
						onFinish={() => {
							setShowStep(false);
						}}
					/>
				) : (
					<AnalysisContent
						data={data}
						onShowFirst={() => {
							scrollToPageTop();
							setStepIndex(0);
							setShowStep(true);
						}}
					/>
				)
			) : null}
		</div>
	);
}

function AnalysisContent({
	data,
	onShowFirst,
}: {
	data: ReturnType<typeof toAnalysisViewModel>;
	onShowFirst: () => void;
}) {
	const navigate = useNavigate();
	return (
		<main className="pb-10">
			<div className="px-5 pb-7 pt-4 text-center">
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
			<div className="px-5 pb-2 pt-8">
				<button
					type="button"
					onClick={onShowFirst}
					className="h-14 w-full rounded-2xl border border-[#D6E8FF] bg-white text-[16px] font-bold text-[#0073FF]"
				>
					페이지네이션 화면 다시 보기
				</button>
			</div>
		</main>
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
