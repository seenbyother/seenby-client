import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import linkCharacter from "@/assets/images/link.png";
import kakaoIcon from "@/assets/kakao.svg";
import LinkIcon from "@/assets/link.svg?react";
import { GroupCreateHeader } from "@/pages/feedback-group/_components/GroupCreateHeader";
import { ShareButton } from "@/pages/feedback-group/_components/ShareButton";
import { StepTitle } from "@/pages/feedback-group/_components/StepTitle";
import { Button, Input, KeywordChip } from "@/shared/components";

type CreateStep = "name" | "relation" | "complete";

const RELATION_OPTIONS = ["동료", "상사", "후배", "친구", "가족"];

export function FeedbackGroupCreatePage() {
	const navigate = useNavigate();
	const [step, setStep] = useState<CreateStep>("name");
	const [groupName, setGroupName] = useState("");
	const [relation, setRelation] = useState("");

	const trimmedGroupName = groupName.trim();
	const shareUrl = useMemo(() => {
		const slug = encodeURIComponent(trimmedGroupName || "SeenBy");
		return `${window.location.origin}/feedback?group=${slug}`;
	}, [trimmedGroupName]);

	const goBack = () => {
		if (step === "relation") {
			setStep("name");
			return;
		}

		if (step === "complete") {
			setStep("relation");
			return;
		}

		if (window.history.length > 1) {
			navigate(-1);
			return;
		}

		navigate("/login");
	};

	const copyShareLink = async () => {
		if (!navigator.clipboard) {
			return;
		}

		await navigator.clipboard.writeText(shareUrl);
	};

	const shareToKakao = async () => {
		await copyShareLink();
	};

	const submitGroupName = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!trimmedGroupName) {
			return;
		}

		setStep("relation");
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
							<div className="w-full h-[52px] rounded-xl bg-[#F3F4F6] px-4 py-2 flex items-center text-[20px] font-medium leading-[150%] text-black">
								{relation}
							</div>
						</div>

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

					<div className="px-5 pb-8">
						<Button onClick={() => setStep("complete")} disabled={!relation}>
							완료
						</Button>
					</div>
				</>
			)}

			{step === "complete" && (
				<>
					<div className="flex-1 flex flex-col items-center px-5 pt-[139px]">
						<div className="text-center">
							<h1 className="m-0 text-[32px] font-semibold leading-[160%] tracking-[-0.02em] text-black">
								“{trimmedGroupName || "SeenBy"}” 그룹 생성 완료
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
						<Button onClick={() => navigate("/feedback")}>확인</Button>
					</div>
				</>
			)}
		</div>
	);
}
