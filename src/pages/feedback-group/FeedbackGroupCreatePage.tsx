import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import linkCharacter from "@/assets/images/link.png";
import kakaoIcon from "@/assets/kakao.svg";
import LinkIcon from "@/assets/link.svg?react";
import {
	createFeedbackGroup,
	type FeedbackGroupsResponse,
} from "@/features/feedback-groups/api";
import { getCurrentUserName, useCurrentUser } from "@/features/auth/hooks";
import { GroupCreateHeader } from "@/pages/feedback-group/_components/GroupCreateHeader";
import { ShareButton } from "@/pages/feedback-group/_components/ShareButton";
import { StepTitle } from "@/pages/feedback-group/_components/StepTitle";
import { CONTEXT_OPTIONS, RELATION_OPTIONS } from "@/pages/feedback-group/constants";
import { ApiError } from "@/shared/api";
import { Button, Input, KeywordChip } from "@/shared/components";
import { shareToKakaoWithTemplate } from "@/shared/lib/kakao";

type CreateStep = "name" | "relation" | "context" | "complete";

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

	return "피드백 그룹을 생성하지 못했어요.";
}

export function FeedbackGroupCreatePage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: currentUser } = useCurrentUser();
	const userName = getCurrentUserName(currentUser);
	const [step, setStep] = useState<CreateStep>("name");
	const [groupName, setGroupName] = useState("");
	const [relation, setRelation] = useState("");
	const [contextType, setContextType] = useState("");
	const [linkToken, setLinkToken] = useState("");

	const trimmedGroupName = groupName.trim();
	const shareUrl = linkToken
		? `${window.location.origin}/feedback?token=${linkToken}`
		: "";

	const createMutation = useMutation({
		mutationFn: createFeedbackGroup,
		onSuccess: (group) => {
			queryClient.setQueryData<FeedbackGroupsResponse>(
				["feedback-groups"],
				(current) => {
					if (!current) {
						return { groupCount: 1, groups: [group] };
					}

					if (current.groups.some((item) => item.id === group.id)) {
						return current;
					}

					return {
						groupCount: current.groupCount + 1,
						groups: [group, ...current.groups],
					};
				},
			);
			queryClient.invalidateQueries({ queryKey: ["feedback-groups"] });
			setLinkToken(group.linkToken);
			setStep("complete");
		},
	});

	const goBack = () => {
		if (step === "relation") { setStep("name"); return; }
		if (step === "context") { setStep("relation"); return; }
		if (step === "complete") { setStep("context"); return; }

		if (window.history.length > 1) {
			navigate(-1);
			return;
		}
		navigate("/login");
	};

	const copyShareLink = async () => {
		if (!navigator.clipboard || !shareUrl) return;
		await navigator.clipboard.writeText(shareUrl);
	};

	const shareToKakao = () => {
		shareToKakaoWithTemplate(134316, {
			userName,
			link: `feedback?token=${linkToken}`,
		});
	};

	const submitGroupName = (event: { preventDefault(): void }) => {
		event.preventDefault();
		if (!trimmedGroupName) return;
		setStep("relation");
	};

	const submitContext = () => {
		if (!contextType.trim()) return;
		createMutation.mutate({
			name: trimmedGroupName,
			relationshipType: relation,
			contextType: contextType.trim(),
		});
	};

	return (
		<div
			className={[
				"min-h-screen flex flex-col text-left",
				step === "complete" ? "bg-[#F8F8F8]" : "bg-white",
			].join(" ")}
		>
			<GroupCreateHeader onBack={goBack} />

			{step === "name" && (
				<form className="contents" onSubmit={submitGroupName}>
					<div className="px-5 pt-[30px] flex-1">
						<StepTitle
							title="그룹 이름을 입력해주세요"
							description="아래의 이름으로 피드백이 전송돼요."
						/>

						<div className="mt-[30px]">
							<p className="mb-2 mt-0 block text-[14px] font-medium leading-[150%] text-black">
								그룹 이름
							</p>
							<Input value={groupName} onChange={setGroupName} />
						</div>
					</div>

					<div className="px-5 pb-8">
						<Button type="submit" disabled={!trimmedGroupName}>
							다음
						</Button>
					</div>
				</form>
			)}

			{step === "relation" && (
				<>
					<div className="px-5 pt-[30px] flex-1">
						<StepTitle
							title="이 그룹의 관계를 선택해주세요"
							description="관계에 따라 분석 내용이 달라져요"
						/>

						<div className="mt-[30px]">
							<p className="mb-2 mt-0 block text-[14px] font-medium leading-[150%] text-black">
								그룹 관계
							</p>
							<div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
								{RELATION_OPTIONS.map((option) => (
									<KeywordChip
										key={option}
										label={option}
										selected={relation === option}
										onClick={() => setRelation(option)}
									/>
								))}
							</div>
						</div>

						<div className="mt-5">
							<p className="mb-2 mt-0 block text-[14px] font-medium leading-[150%] text-black">
								직접 입력
							</p>
							<Input value={relation} onChange={(val) => setRelation(val)} />
						</div>
					</div>

					<div className="px-5 pb-8">
						<Button onClick={() => setStep("context")} disabled={!relation}>
							다음
						</Button>
					</div>
				</>
			)}

			{step === "context" && (
				<>
					<div className="px-5 pt-[30px] flex-1">
						<StepTitle
							title="이 그룹의 상황을 선택해주세요"
							description="상황에 따라 분석 내용이 달라져요"
						/>

						<div className="mt-[30px]">
							<p className="mb-2 mt-0 block text-[14px] font-medium leading-[150%] text-black">
								그룹 상황
							</p>
							<div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
								{CONTEXT_OPTIONS.map((option) => (
									<KeywordChip
										key={option}
										label={option}
										selected={contextType === option}
										onClick={() => setContextType(option)}
									/>
								))}
							</div>
						</div>

						<div className="mt-5">
							<p className="mb-2 mt-0 block text-[14px] font-medium leading-[150%] text-black">
								직접 입력
							</p>
							<Input
								value={contextType}
								onChange={(val) => setContextType(val)}
							/>
						</div>
					</div>

					<div className="px-5 pb-8">
						{createMutation.isError && (
							<p className="mb-3 mt-0 text-center text-[14px] font-medium text-red-500">
								{getErrorMessage(createMutation.error)}
							</p>
						)}
						<Button
							onClick={submitContext}
							disabled={!contextType.trim() || createMutation.isPending}
						>
							{createMutation.isPending ? "생성 중..." : "완료"}
						</Button>
					</div>
				</>
			)}

			{step === "complete" && (
				<>
					<div className="flex-1 flex flex-col items-center px-5 pt-[50px]">
						<div className="text-center">
							<h1 className="m-0 text-[32px] font-semibold leading-[160%] tracking-[-0.02em] text-black">
								"{trimmedGroupName || "SeenBy"}" 그룹 생성 완료
							</h1>
							<p className="mt-1 mb-0 text-[16px] font-medium leading-[150%] text-black">
								링크를 공유해서 피드백을 수집해보세요.
							</p>
						</div>

						<img
							src={linkCharacter}
							alt=""
							className="mt-[54px] w-[123px] h-[135px] object-contain"
						/>

						<div className="mt-[35px] w-full flex flex-col gap-[13px]">
							<ShareButton onClick={copyShareLink}>
								<LinkIcon width={24} height={24} aria-hidden="true" />
								<span>링크 복사하기</span>
							</ShareButton>
							<ShareButton variant="kakao" onClick={shareToKakao}>
								<img
									src={kakaoIcon}
									alt=""
									className="w-4 h-4 object-contain"
								/>
								<span>카카오톡으로 공유하기</span>
							</ShareButton>
						</div>
					</div>

					<div className="px-5 pb-8">
						<Button onClick={() => navigate("/groups")}>확인</Button>
					</div>
				</>
			)}
		</div>
	);
}
