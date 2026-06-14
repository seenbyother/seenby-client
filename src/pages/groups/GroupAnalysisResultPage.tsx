import { useLocation, useNavigate, useParams } from "react-router";
import type {
	FeedbackAnalysisCreateResult,
	FeedbackCoverLetterCreateResult,
} from "@/features/feedback-groups/api";
import { Header } from "@/shared/components";

type AnalysisResultState =
	| {
			status: "success";
			analysis: FeedbackAnalysisCreateResult;
			coverLetter: FeedbackCoverLetterCreateResult;
	  }
	| {
			status: "error";
			message: string;
	  };

function isAnalysisResultState(value: unknown): value is AnalysisResultState {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as { status?: unknown };

	return state.status === "success" || state.status === "error";
}

export function GroupAnalysisResultPage() {
	const navigate = useNavigate();
	const { groupId } = useParams<{ groupId: string }>();
	const { state } = useLocation();
	const resultState = isAnalysisResultState(state) ? state : null;
	const isSuccess = resultState?.status === "success";

	return (
		<div className="min-h-screen bg-[#F8F8F8] text-black">
			<Header
				title={isSuccess ? "AI 분석 요청 완료" : "AI 분석 요청 실패"}
				onBack={() => navigate(`/groups/${groupId}`)}
				withBottomSpacing={false}
			/>

			<main className="flex min-h-[calc(100svh-64px)] flex-col px-5 pb-8 pt-14">
				<section className="flex flex-1 flex-col items-center text-center">
					<div
						className={[
							"flex h-[72px] w-[72px] items-center justify-center rounded-full text-[34px] font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.10)]",
							isSuccess ? "bg-[#0073FF]" : "bg-[#FF4D4F]",
						].join(" ")}
						aria-hidden="true"
					>
						{isSuccess ? "✓" : "!"}
					</div>

					<h1 className="mb-0 mt-7 text-[28px] font-bold leading-[135%] text-black">
						{isSuccess
							? "AI 분석 생성을 시작했어요"
							: "요청을 완료하지 못했어요"}
					</h1>
					<p className="mb-0 mt-3 text-[15px] font-medium leading-[160%] text-[#71717A]">
						{isSuccess
							? "분석 결과와 자기소개서가 준비되면 결과 화면에서 확인할 수 있어요."
							: (resultState?.message ??
								"잠시 후 다시 시도하거나 선택한 피드백을 확인해주세요.")}
					</p>

					{isSuccess ? (
						<div className="mt-10 flex w-full flex-col gap-3">
							<ResultCard
								label="AI 분석 결과 ID"
								value={String(resultState.analysis.analysisId)}
							/>
							<ResultCard
								label="AI 자기소개서 ID"
								value={String(resultState.coverLetter.id)}
								onClick={() =>
									navigate(`/cover-letters/${resultState.coverLetter.id}`)
								}
							/>
							<ResultCard
								label="자기소개서 생성 상태"
								value={resultState.coverLetter.status}
							/>
						</div>
					) : null}
				</section>

				<div className="mt-10 flex flex-col gap-3">
					<button
						type="button"
						onClick={() =>
							isSuccess
								? navigate(`/cover-letters/${resultState.coverLetter.id}`)
								: navigate(-1)
						}
						className="h-[52px] rounded-[16px] border-none bg-[#0073FF] text-[16px] font-semibold text-white"
					>
						{isSuccess ? "자기소개서 보러가기" : "이전으로 돌아가기"}
					</button>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="h-[52px] rounded-[16px] border border-[#EDF0FF] bg-white text-[16px] font-semibold text-black"
					>
						홈으로 돌아가기
					</button>
				</div>
			</main>
		</div>
	);
}

function ResultCard({
	label,
	value,
	onClick,
}: {
	label: string;
	value: string;
	onClick?: () => void;
}) {
	const Element = onClick ? "button" : "div";

	return (
		<Element
			type={onClick ? "button" : undefined}
			onClick={onClick}
			className="flex w-full items-center justify-between rounded-[20px] border-none bg-white px-5 py-4 text-left"
		>
			<span className="text-[14px] font-medium text-[#71717A]">{label}</span>
			<span className="text-[16px] font-bold text-black">{value}</span>
		</Element>
	);
}
