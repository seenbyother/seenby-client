import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";
import linkCharacter from "@/assets/images/link.png";
import kakaoIcon from "@/assets/kakao.svg";
import LinkIcon from "@/assets/link.svg?react";
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
							<FieldLabel>그룹 이름</FieldLabel>
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
							<FieldLabel>그룹 관계</FieldLabel>
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

interface GroupCreateHeaderProps {
	onBack: () => void;
}

function GroupCreateHeader({ onBack }: GroupCreateHeaderProps) {
	return (
		<header className="h-[68px] pt-6 flex items-center justify-center px-5 relative shrink-0">
			<button
				type="button"
				onClick={onBack}
				aria-label="뒤로 가기"
				className="absolute left-5 top-[46px] -translate-y-1/2 w-6 h-6 p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center"
			>
				<IcArrowLeft width={24} height={24} />
			</button>
			<h2 className="m-0 text-[20px] font-normal leading-none text-black">
				피드백 그룹 만들기
			</h2>
		</header>
	);
}

interface StepTitleProps {
	title: string;
	description: string;
}

function StepTitle({ title, description }: StepTitleProps) {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="m-0 text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black">
				{title}
			</h1>
			<p className="m-0 text-[16px] font-medium leading-[150%] text-[#71717A]">
				{description}
			</p>
		</div>
	);
}

interface FieldLabelProps {
	children: React.ReactNode;
}

function FieldLabel({ children }: FieldLabelProps) {
	return (
		<p className="mb-2 mt-0 block text-[14px] font-medium leading-[150%] text-black">
			{children}
		</p>
	);
}

interface ShareButtonProps {
	children: React.ReactNode;
	onClick: () => void;
	variant?: "default" | "kakao";
}

function ShareButton({
	children,
	onClick,
	variant = "default",
}: ShareButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				"h-14 w-full rounded-lg border-0 px-4 py-[10px] flex items-center justify-center gap-2 cursor-pointer text-[#17181A] text-[15px] font-black leading-[160%] tracking-[-0.02em]",
				variant === "kakao" ? "bg-[#FEE500]" : "bg-white",
			].join(" ")}
		>
			{children}
		</button>
	);
}
