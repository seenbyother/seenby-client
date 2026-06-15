import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Header } from "@/shared/components";

type AnalysisResultState =
	| {
			status: "error";
			message: string;
	  }
	| {
			status: "success";
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
	const groupDetailPath = groupId ? `/groups/${groupId}` : "/groups";
	const retryPath = groupId ? `/groups/${groupId}/analysis` : "/groups";
	const errorMessage =
		resultState?.status === "error" && resultState.message.trim()
			? resultState.message
			: "잠시 후 다시 시도하거나 선택한 피드백을 확인해주세요.";

	if (resultState?.status === "success") {
		return <Navigate to="/analysis" replace />;
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8] text-black">
			<Header
				title="AI 분석 요청 실패"
				onBack={() => navigate(groupDetailPath)}
				withBottomSpacing={false}
			/>

			<main className="flex min-h-[calc(100svh-64px)] flex-col px-5 pb-8 pt-16">
				<section className="flex flex-1 flex-col items-center text-center">
					<div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#FFECEC] text-[34px] font-bold text-[#FF4D4F]">
						!
					</div>

					<h1 className="mb-0 mt-7 text-[27px] font-bold leading-[135%] text-black">
						AI 분석 요청을 완료하지 못했어요
					</h1>
					<p className="mb-0 mt-3 text-[15px] font-medium leading-[160%] text-[#71717A]">
						선택한 피드백을 확인한 뒤 다시 요청해주세요.
					</p>

					<div className="mt-10 w-full rounded-[20px] bg-white px-5 py-5 text-left">
						<p className="m-0 text-[14px] font-semibold text-[#71717A]">
							실패 사유
						</p>
						<p className="mb-0 mt-2 text-[15px] font-semibold leading-[150%] text-black">
							{errorMessage}
						</p>
					</div>
				</section>

				<div className="mt-10 flex flex-col gap-3">
					<button
						type="button"
						onClick={() => navigate(retryPath)}
						className="h-[52px] rounded-[16px] border-none bg-[#0073FF] text-[16px] font-semibold text-white"
					>
						다시 시도하기
					</button>
					<button
						type="button"
						onClick={() => navigate("/analysis")}
						className="h-[52px] rounded-[16px] border border-[#EDF0FF] bg-white text-[16px] font-semibold text-black"
					>
						AI 분석 내역 보기
					</button>
				</div>
			</main>
		</div>
	);
}
