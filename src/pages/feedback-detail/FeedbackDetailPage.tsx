import { useState } from "react";
import { useNavigate } from "react-router";
import BackIcon from "@/assets/feedback/before.svg?react";
import { ExperienceCard } from "@/pages/feedback-detail/_components/ExperienceCard";
import { RetrospectCard } from "@/pages/feedback-detail/_components/RetrospectCard";
import { RetrospectSheet } from "@/pages/feedback-detail/_components/RetrospectSheet";
import type { FeedbackAnswer } from "@/pages/feedback-detail/types";

const feedbackAnswer: FeedbackAnswer = {
	id: 4,
	feedbackGroupId: 4,
	reviewerName: "김연우",
	experienceCount: 5,
	experienceFeedbacks: [
		{
			id: 1,
			experience:
				"팀 프로젝트 회의 때 매번 회의록을 정리해서 팀원들에게 공유했어요.",
			feedback: "책임감이 강하고 팀을 안정적으로 이끄는 사람이라고 느꼈어요.",
			displayOrder: 0,
		},
		{
			id: 2,
			experience:
				"행사 뒤풀이 자리에서 처음 보는 사람들과 먼저 대화를 시작했어요.",
			feedback: "사람들을 편하게 만들어주는 밝은 에너지가 있는 사람 같았어요.",
			displayOrder: 1,
		},
		{
			id: 3,
			experience:
				"일정이 촉박할 때도 역할을 나누고 마감 시간을 먼저 확인했어요.",
			feedback:
				"상황을 빠르게 정리하고 팀이 움직일 수 있게 도와주는 사람이었어요.",
			displayOrder: 2,
		},
		{
			id: 4,
			experience:
				"발표 자료를 만들 때 사소한 오탈자와 흐름까지 꼼꼼하게 봐줬어요.",
			feedback: "완성도를 높이기 위해 끝까지 책임지는 모습이 인상적이었어요.",
			displayOrder: 3,
		},
		{
			id: 5,
			experience:
				"의견이 엇갈릴 때 상대 이야기를 끝까지 듣고 중간에서 정리해줬어요.",
			feedback:
				"갈등을 부드럽게 풀어내고 모두가 납득할 수 있게 만드는 사람이었어요.",
			displayOrder: 4,
		},
	],
	keywords: ["친절함", "긍정적", "솔직한", "박식한"],
	submittedAt: "2026-04-27T00:00:00",
	createdAt: "2026-04-27T00:00:00",
};

const RECIPIENT_NAME = "김민경";

const initialRetrospectsByExperienceFeedbackId: Record<number, string> = {
	1: "",
	2: "감사합니다. 나의 회고를 길게 작성하는 더미 텍스트입니다. 감사합니다. 나의 회고를 길게 작성하는 더미 텍스트입니다.",
	3: "",
	4: "",
	5: "",
};

export function FeedbackDetailPage() {
	const navigate = useNavigate();
	const [
		retrospectsByExperienceFeedbackId,
		setRetrospectsByExperienceFeedbackId,
	] = useState(initialRetrospectsByExperienceFeedbackId);
	const [editingExperienceFeedbackId, setEditingExperienceFeedbackId] =
		useState<number | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const activeExperienceFeedback =
		editingExperienceFeedbackId === null
			? null
			: (feedbackAnswer.experienceFeedbacks.find(
					(item) => item.id === editingExperienceFeedbackId,
				) ?? null);
	const activeRetrospect = activeExperienceFeedback
		? (retrospectsByExperienceFeedbackId[activeExperienceFeedback.id] ?? "")
		: "";

	const openRetrospectEditor = (experienceFeedbackId: number) => {
		setEditingExperienceFeedbackId(experienceFeedbackId);
		setIsSheetOpen(true);
	};

	const updateRetrospect = (value: string) => {
		if (editingExperienceFeedbackId === null) return;

		setRetrospectsByExperienceFeedbackId((current) => ({
			...current,
			[editingExperienceFeedbackId]: value,
		}));
	};

	const saveRetrospect = () => {
		setIsSheetOpen(false);
		setEditingExperienceFeedbackId(null);
	};

	const closeSheet = () => {
		setIsSheetOpen(false);
	};

	const submittedDate = new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(feedbackAnswer.submittedAt));

	return (
		<main className="min-h-screen bg-[#F8F8F8] text-left text-black">
			<div className="relative mx-auto h-[100svh] w-full max-w-[402px] overflow-hidden bg-[#F8F8F8]">
				<div className="h-full overflow-y-auto px-[19px] pb-[124px] pt-8">
					<header className="mb-6 flex h-8 items-center">
						<button
							type="button"
							onClick={() => navigate(-1)}
							aria-label="뒤로 가기"
							className="flex h-8 w-8 items-center justify-center border-0 bg-transparent p-0"
						>
							<BackIcon aria-hidden="true" />
						</button>
					</header>

					<section className="mb-6 flex items-end justify-between">
						<h1 className="m-0 text-[24px] font-bold leading-none">
							{feedbackAnswer.reviewerName} 님의 피드백
						</h1>
						<p className="m-0 text-center text-[12px] leading-none text-[#696969]">
							{submittedDate}
						</p>
					</section>

					<section className="rounded-[20px] bg-white p-4">
						<h2 className="m-0 text-[16px] font-bold leading-normal">
							{RECIPIENT_NAME} 님에게 어울리는 단어
						</h2>
						<div className="mt-3 grid grid-cols-4 gap-3">
							{feedbackAnswer.keywords.map((keyword) => (
								<span
									key={keyword}
									className="flex h-8 items-center justify-center whitespace-nowrap rounded-[20px] border border-[rgba(0,115,255,0.1)] bg-[rgba(0,115,255,0.05)] px-[10px] text-[13px] font-semibold leading-none text-[#0073FF]"
								>
									#{keyword}
								</span>
							))}
						</div>
					</section>

					<p className="my-6 text-right text-[12px] leading-none text-[#696969]">
						총 {feedbackAnswer.experienceCount}개
					</p>

					<div className="flex flex-col gap-6">
						{feedbackAnswer.experienceFeedbacks.map((experienceFeedback) => (
							<section
								key={experienceFeedback.id}
								className="flex flex-col gap-5"
							>
								<ExperienceCard
									experienceFeedback={experienceFeedback}
									recipientName={RECIPIENT_NAME}
								/>
								<RetrospectCard
									experienceFeedback={experienceFeedback}
									retrospect={
										retrospectsByExperienceFeedbackId[experienceFeedback.id] ??
										""
									}
									isEditing={
										editingExperienceFeedbackId === experienceFeedback.id &&
										isSheetOpen
									}
									onToggleEdit={() =>
										editingExperienceFeedbackId === experienceFeedback.id &&
										isSheetOpen
											? saveRetrospect()
											: openRetrospectEditor(experienceFeedback.id)
									}
									onOpen={() => openRetrospectEditor(experienceFeedback.id)}
								/>
							</section>
						))}
					</div>
				</div>

				<RetrospectSheet
					isOpen={isSheetOpen}
					experienceFeedback={activeExperienceFeedback}
					value={activeRetrospect}
					onChange={updateRetrospect}
					onClose={closeSheet}
					onSave={saveRetrospect}
				/>
			</div>
		</main>
	);
}
