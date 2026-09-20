import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MyIcon from "@/assets/icons/my.svg?react";
import { deleteCurrentUser, logout } from "@/features/auth/api";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import { getCoverLetters } from "@/features/cover-letters/api";
import {
	getAnalysisHistory,
	getFeedbackGroups,
} from "@/features/feedback-groups/api";
import { getSelfKeywords } from "@/features/onboarding/api";
import { Header } from "@/shared/components";

type AccountAction = "logout" | "deleteAccount";

export function MyPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [accountAction, setAccountAction] = useState<AccountAction | null>(
		null,
	);
	const { data: currentUser } = useCurrentUser();
	const {
		data: selfKeywords,
		isError: isKeywordsError,
		isLoading: isKeywordsLoading,
		refetch: refetchSelfKeywords,
	} = useQuery({
		queryKey: ["me", "self-keywords"],
		queryFn: getSelfKeywords,
	});
	const {
		data: feedbackGroups,
		isError: isGroupsError,
		isLoading: isGroupsLoading,
		refetch: refetchFeedbackGroups,
	} = useQuery({
		queryKey: ["feedback-groups"],
		queryFn: getFeedbackGroups,
	});
	const {
		data: analysisHistory,
		isError: isAnalysisError,
		isLoading: isAnalysisLoading,
		refetch: refetchAnalysisHistory,
	} = useQuery({
		queryKey: ["analysis-history"],
		queryFn: getAnalysisHistory,
	});
	const {
		data: coverLetters,
		isError: isCoverLettersError,
		isLoading: isCoverLettersLoading,
		refetch: refetchCoverLetters,
	} = useQuery({
		queryKey: ["cover-letters"],
		queryFn: getCoverLetters,
	});

	const finishAccountAction = async () => {
		await queryClient.cancelQueries();
		queryClient.clear();
		window.location.replace("/login");
	};
	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: finishAccountAction,
	});
	const deleteAccountMutation = useMutation({
		mutationFn: deleteCurrentUser,
		onSuccess: finishAccountAction,
	});
	const isAccountActionPending =
		logoutMutation.isPending || deleteAccountMutation.isPending;
	const accountActionError =
		logoutMutation.error ?? deleteAccountMutation.error;
	const receivedFeedbackCount = (feedbackGroups?.groups ?? []).reduce(
		(total, group) => total + group.answerCount,
		0,
	);
	const analysisCount = analysisHistory?.analyses.length ?? 0;
	const coverLetterCount = coverLetters?.coverLetterCount ?? 0;
	const userName = getCurrentUserName(currentUser);
	const hasActivityError =
		isGroupsError || isAnalysisError || isCoverLettersError;

	const openAccountConfirmation = (action: AccountAction) => {
		logoutMutation.reset();
		deleteAccountMutation.reset();
		setAccountAction(action);
	};

	const closeAccountConfirmation = () => {
		if (isAccountActionPending) {
			return;
		}

		logoutMutation.reset();
		deleteAccountMutation.reset();
		setAccountAction(null);
	};

	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="mx-auto min-h-screen w-full max-w-[402px] pb-10">
				<Header title="마이페이지" onBack={() => navigate("/home")} />

				<div className="flex flex-col gap-5 px-5">
					<section className="flex items-center gap-4 rounded-3xl bg-white p-5">
						<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEF5FF] text-[#222222]">
							<MyIcon width={28} height={28} aria-hidden="true" />
						</div>
						<div>
							<h2 className="m-0 text-[20px] font-bold leading-[135%]">
								{userName}님
							</h2>
							<p className="mb-0 mt-1 text-[14px] font-medium text-[#71717A]">
								나에 대한 새로운 시선을 쌓고 있어요
							</p>
						</div>
					</section>

					<section>
						<SectionTitle>나를 나타내는 키워드</SectionTitle>
						<div className="mt-3 rounded-3xl bg-white p-5">
							{isKeywordsLoading ? (
								<p className="m-0 text-[14px] text-[#A1A9B2]">불러오는 중...</p>
							) : isKeywordsError ? (
								<InlineLoadError
									message="키워드를 불러오지 못했어요."
									onRetry={() => refetchSelfKeywords()}
								/>
							) : selfKeywords?.length ? (
								<div className="flex flex-wrap gap-2">
									{selfKeywords.map((keyword) => (
										<span
											key={keyword}
											className="rounded-full bg-[#EEF5FF] px-3 py-2 text-[14px] font-semibold text-[#0073FF]"
										>
											{keyword}
										</span>
									))}
								</div>
							) : (
								<p className="m-0 text-[14px] text-[#71717A]">
									아직 선택한 키워드가 없어요.
								</p>
							)}
						</div>
					</section>

					<section>
						<SectionTitle>나의 활동</SectionTitle>
						{hasActivityError ? (
							<div className="mt-3 rounded-2xl bg-[#FFF1F1] px-4 py-3">
								<InlineLoadError
									message="일부 활동 정보를 불러오지 못했어요."
									onRetry={() => {
										void Promise.all([
											refetchFeedbackGroups(),
											refetchAnalysisHistory(),
											refetchCoverLetters(),
										]);
									}}
								/>
							</div>
						) : null}
						<div className="mt-3 grid grid-cols-3 gap-2">
							<ActivityCard
								count={receivedFeedbackCount}
								hasError={isGroupsError}
								isLoading={isGroupsLoading}
								label="받은 피드백"
								onClick={() => navigate("/groups")}
							/>
							<ActivityCard
								count={analysisCount}
								hasError={isAnalysisError}
								isLoading={isAnalysisLoading}
								label="AI 분석"
								onClick={() => navigate("/analysis")}
							/>
							<ActivityCard
								count={coverLetterCount}
								hasError={isCoverLettersError}
								isLoading={isCoverLettersLoading}
								label="자기소개서"
								onClick={() => navigate("/analysis?tab=cover-letter")}
							/>
						</div>
					</section>

					<section>
						<SectionTitle>계정 관리</SectionTitle>
						<div className="mt-3 overflow-hidden rounded-3xl bg-white px-4">
							<AccountButton
								label="로그아웃"
								onClick={() => openAccountConfirmation("logout")}
							/>
							<div className="h-px bg-[#ECEEF1]" />
							<AccountButton
								destructive
								label="회원 탈퇴"
								onClick={() => openAccountConfirmation("deleteAccount")}
							/>
						</div>
					</section>
				</div>
			</div>

			{accountAction ? (
				<AccountConfirmDialog
					action={accountAction}
					errorMessage={getAccountActionErrorMessage(accountActionError)}
					isPending={isAccountActionPending}
					onCancel={closeAccountConfirmation}
					onConfirm={() => {
						if (accountAction === "logout") {
							logoutMutation.mutate();
							return;
						}

						deleteAccountMutation.mutate();
					}}
				/>
			) : null}
		</main>
	);
}

function SectionTitle({ children }: { children: string }) {
	return (
		<h2 className="m-0 text-[16px] font-bold text-[#222222]">{children}</h2>
	);
}

interface ActivityCardProps {
	count: number;
	hasError: boolean;
	isLoading: boolean;
	label: string;
	onClick: () => void;
}

function ActivityCard({
	count,
	hasError,
	isLoading,
	label,
	onClick,
}: ActivityCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl border-0 bg-white px-2 py-4 text-center active:bg-[#F3F4F6]"
		>
			<strong className="text-[22px] font-bold text-[#0073FF]">
				{isLoading || hasError ? "-" : count}
			</strong>
			<span className="mt-1 text-[12px] font-semibold text-[#71717A]">
				{label}
			</span>
		</button>
	);
}

interface AccountButtonProps {
	destructive?: boolean;
	label: string;
	onClick: () => void;
}

function AccountButton({
	destructive = false,
	label,
	onClick,
}: AccountButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex h-14 w-full items-center justify-between border-0 bg-white px-1 text-left text-[15px] font-semibold ${destructive ? "text-[#E5484D]" : "text-[#222222]"}`}
		>
			{label}
			<span
				aria-hidden="true"
				className="text-[20px] font-normal text-[#A1A9B2]"
			>
				›
			</span>
		</button>
	);
}

interface AccountConfirmDialogProps {
	action: AccountAction;
	errorMessage?: string;
	isPending: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

function AccountConfirmDialog({
	action,
	errorMessage,
	isPending,
	onCancel,
	onConfirm,
}: AccountConfirmDialogProps) {
	const isLogout = action === "logout";
	const cancelButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		cancelButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isPending) {
				onCancel();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isPending, onCancel]);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-8">
			<button
				type="button"
				aria-label="확인 창 닫기"
				className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
				disabled={isPending}
				onClick={onCancel}
			/>
			<section
				aria-labelledby="account-confirm-title"
				aria-describedby="account-confirm-description"
				aria-modal="true"
				className="relative z-10 w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
				role="dialog"
			>
				<h2
					id="account-confirm-title"
					className="m-0 text-[17px] font-bold text-[#222222]"
				>
					{isLogout ? "로그아웃할까요?" : "회원 탈퇴할까요?"}
				</h2>
				<p
					id="account-confirm-description"
					className="mb-0 mt-2 text-[13px] font-medium leading-[150%] text-[#71717A]"
				>
					{isLogout
						? "언제든지 카카오 계정으로 다시 로그인할 수 있어요."
						: "계정 데이터가 삭제되며 다시 복구할 수 없어요."}
				</p>

				{errorMessage ? (
					<p
						className="mb-0 mt-3 rounded-lg bg-[#FFF1F1] px-3 py-2 text-[12px] font-semibold leading-[140%] text-[#D83A40]"
						aria-live="polite"
					>
						{errorMessage}
					</p>
				) : null}

				<div className="mt-5 grid grid-cols-2 gap-2">
					<button
						type="button"
						ref={cancelButtonRef}
						disabled={isPending}
						onClick={onCancel}
						className="h-10 rounded-xl border-0 bg-[#F0F2F4] text-[13px] font-bold text-[#555D67] disabled:opacity-50"
					>
						취소
					</button>
					<button
						type="button"
						aria-busy={isPending}
						disabled={isPending}
						onClick={onConfirm}
						className={`h-10 rounded-xl border-0 text-[13px] font-bold text-white disabled:opacity-50 ${isLogout ? "bg-[#0073FF]" : "bg-[#E5484D]"}`}
					>
						{isPending ? "처리 중..." : isLogout ? "로그아웃" : "탈퇴하기"}
					</button>
				</div>
			</section>
		</div>
	);
}

interface InlineLoadErrorProps {
	message: string;
	onRetry: () => void;
}

function InlineLoadError({ message, onRetry }: InlineLoadErrorProps) {
	return (
		<div className="flex items-center justify-between gap-3">
			<p className="m-0 text-[13px] font-medium text-[#D83A40]">{message}</p>
			<button
				type="button"
				onClick={onRetry}
				className="shrink-0 rounded-full border-0 bg-white px-3 py-1.5 text-[12px] font-bold text-[#0073FF]"
			>
				다시 시도
			</button>
		</div>
	);
}

function getAccountActionErrorMessage(error: unknown) {
	if (!error) {
		return undefined;
	}

	if (error instanceof Error && error.message.trim()) {
		return error.message;
	}

	return "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
