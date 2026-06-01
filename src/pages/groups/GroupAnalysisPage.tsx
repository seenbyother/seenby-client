import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import IcArrowLeft from "@/assets/ic_arrow_left.svg?react";
import characterCheer from "@/assets/images/character_cheer.png";
import type { FeedbackItem } from "./_components/FeedbackCard";

const MOCK_FEEDBACKS: Record<number, FeedbackItem[]> = {
	2: [
		{ id: 1, name: "김연우", isReviewed: true, hasReflection: true },
		{ id: 2, name: "이지현", isReviewed: true, hasReflection: true },
		{ id: 3, name: "박민준", isReviewed: true, hasReflection: true },
		{ id: 4, name: "최서연", isReviewed: true, hasReflection: true },
	],
};

type Step = "select" | "submitted";

export function GroupAnalysisPage() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const [step, setStep] = useState<Step>("select");

	const id = Number(groupId);
	const feedbacks = MOCK_FEEDBACKS[id] ?? [];

	const [selectedIds, setSelectedIds] = useState<Set<number>>(
		() => new Set(feedbacks.map((f) => f.id)),
	);

	const allSelected = feedbacks.length > 0 && selectedIds.size === feedbacks.length;

	const toggleAll = () => {
		setSelectedIds(allSelected ? new Set() : new Set(feedbacks.map((f) => f.id)));
	};

	const toggleItem = (itemId: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(itemId)) next.delete(itemId);
			else next.add(itemId);
			return next;
		});
	};

	if (step === "submitted") {
		return (
			<div className="min-h-screen bg-[#F8F8F8] relative">
				{/* Header */}
				<header className="flex items-center justify-center relative px-5 py-[10px]">
					<button
						type="button"
						onClick={() => navigate(`/groups/${id}`)}
						className="absolute left-5 bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
						aria-label="뒤로 가기"
					>
						<IcArrowLeft width={32} height={32} />
					</button>
					<span className="text-[20px] text-black">피드백 그룹 만들기</span>
				</header>

				<p
					className="w-full m-0 mt-[145px] text-center text-[32px] font-semibold text-black leading-[160%]"
					style={{ letterSpacing: "-0.02em" }}
				>
					피드백이 제출되었어요
				</p>

				<p className="w-full m-0 mt-[20px] text-center text-[16px] font-medium text-black leading-[150%]">
					분석하는데 시간이 조금 걸려요
				</p>

				<img
					src={characterCheer}
					alt=""
					width={123}
					height={135}
					className="block mx-auto mt-[51px]"
				/>

				{/* 확인 버튼: Figma y:798 → bottom 20px */}
				<div className="absolute bottom-5 left-0 right-0 px-5">
					<button
						type="button"
						onClick={() => navigate("/groups")}
						className="w-full rounded-[16px] border-none cursor-pointer flex items-center justify-center"
						style={{ background: "#0073FF", height: 56 }}
					>
						<span className="text-[17px] font-semibold text-white">확인</span>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8] flex flex-col relative">
			{/* Header */}
			<header className="flex items-center px-5 py-[10px]">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="bg-transparent border-none cursor-pointer outline-none p-[6px] -ml-[6px]"
					aria-label="뒤로 가기"
				>
					<IcArrowLeft width={32} height={32} />
				</button>
			</header>

			{/* Content */}
			<div className="flex flex-col gap-3 px-5 mt-4 pb-36">
				{/* 전체 선택 */}
				<button
					type="button"
					onClick={toggleAll}
					className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
				>
					<CircleCheckbox checked={allSelected} />
					<span className="text-[16px] font-medium text-black leading-[21px]">전체 선택</span>
				</button>

				{/* 피드백 목록 */}
				<div className="flex flex-col gap-5">
					{feedbacks.map((feedback) => (
						<button
							key={feedback.id}
							type="button"
							onClick={() => toggleItem(feedback.id)}
							className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
						>
							<CircleCheckbox checked={selectedIds.has(feedback.id)} />
							<div className="flex-1 bg-white rounded-[20px] p-4">
								<div className="flex items-center justify-between p-[10px]">
									<span className="text-[16px] font-bold text-black">
										{feedback.name}님의 피드백
									</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* 제출 하기 FAB */}
			<div className="absolute bottom-10 right-5">
				<button
					type="button"
					onClick={() => setStep("submitted")}
					disabled={selectedIds.size === 0}
					className="flex items-center gap-[10px] px-5 py-[14px] rounded-[60px] border-none cursor-pointer"
					style={{
						background: selectedIds.size > 0 ? "#0073FF" : "#A9A9A9",
						boxShadow: "0px 0px 3.1px 1px rgba(0,0,0,0.25)",
					}}
				>
					<span className="text-[16px] font-medium" style={{ color: "#EDF0FF" }}>
						제출 하기 →
					</span>
				</button>
			</div>
		</div>
	);
}

function CircleCheckbox({ checked }: { checked: boolean }) {
	if (checked) {
		return (
			<div className="w-6 h-6 rounded-full bg-[#3182F6] flex items-center justify-center flex-shrink-0">
				<svg width="12" height="9" viewBox="0 0 12 9" fill="none">
					<path
						d="M1 4L4.5 7.5L11 1"
						stroke="white"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		);
	}
	return (
		<div className="w-6 h-6 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#DADADA" }} />
	);
}
