import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import CopyIcon from "@/assets/icons/copy.svg?react";
import chTextImage from "@/assets/images/ch_text.png";
import { getCoverLetterDetail } from "@/features/cover-letters/api";
import { Header } from "@/shared/components";

const CATEGORY_LABELS: Record<string, string> = {
	COLLABORATION: "협업",
	PROBLEM_SOLVING: "문제 해결",
	COMMUNICATION: "소통",
	LEADERSHIP: "리더십",
	RESPONSIBILITY: "책임감",
	CHALLENGE: "도전",
	GROWTH: "성장",
};

export function CoverLetterDetailPage() {
	const navigate = useNavigate();
	const { coverLetterId } = useParams<{ coverLetterId: string }>();
	const id = Number(coverLetterId);
	const isValidCoverLetterId = Number.isInteger(id) && id > 0;
	const [copyMessage, setCopyMessage] = useState("");
	const copyMessageTimerRef = useRef<number | null>(null);

	const {
		data: coverLetter,
		error,
		isError,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["cover-letter", id],
		queryFn: () => getCoverLetterDetail(id),
		enabled: isValidCoverLetterId,
	});

	const categoryLabel = useMemo(() => {
		if (!coverLetter?.selectedCategory) {
			return "AI";
		}

		return (
			CATEGORY_LABELS[coverLetter.selectedCategory] ??
			coverLetter.selectedCategory.replaceAll("_", " ")
		);
	}, [coverLetter?.selectedCategory]);

	const plainContent = coverLetter
		? markdownToPlainText(coverLetter.content)
		: "";

	const copyContent = async () => {
		if (!plainContent) {
			return;
		}

		if (copyMessageTimerRef.current !== null) {
			window.clearTimeout(copyMessageTimerRef.current);
		}

		try {
			await navigator.clipboard.writeText(plainContent);
			setCopyMessage("복사했어요");
		} catch {
			setCopyMessage("복사하지 못했어요");
		}

		copyMessageTimerRef.current = window.setTimeout(() => {
			setCopyMessage("");
			copyMessageTimerRef.current = null;
		}, 1500);
	};

	useEffect(() => {
		return () => {
			if (copyMessageTimerRef.current !== null) {
				window.clearTimeout(copyMessageTimerRef.current);
			}
		};
	}, []);

	if (!isValidCoverLetterId) {
		return (
			<CoverLetterLayout onBack={() => navigate(-1)}>
				<CenteredMessage>자기소개서를 찾을 수 없어요</CenteredMessage>
			</CoverLetterLayout>
		);
	}

	if (isLoading) {
		return (
			<CoverLetterLayout onBack={() => navigate(-1)}>
				<CenteredMessage>불러오는 중...</CenteredMessage>
			</CoverLetterLayout>
		);
	}

	if (isError || !coverLetter) {
		return (
			<CoverLetterLayout onBack={() => navigate(-1)}>
				<div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center">
					<span className="text-[16px] font-medium text-red-500">
						{getErrorMessage(error)}
					</span>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-full border-none bg-[#0073FF] px-4 py-2 text-[14px] font-bold text-white"
					>
						다시 불러오기
					</button>
				</div>
			</CoverLetterLayout>
		);
	}

	return (
		<CoverLetterLayout onBack={() => navigate(-1)}>
			<main className="flex flex-1 flex-col px-[18px] pb-[94px] pt-[5px]">
				<h1 className="m-0 max-w-[290px] whitespace-pre-line text-[24px] font-bold leading-[1.2] text-black">
					{categoryLabel} 역량이 잘 드러난{"\n"}자기소개서가 완성됐어요
				</h1>

				<section className="mt-6 flex h-[118px] items-start gap-3 overflow-hidden rounded-[22px] border border-[#DBEAFE] bg-[#EEF6FF] px-[17px] py-[14px] shadow-[0_4px_7px_rgba(0,0,0,0.05)]">
					<div className="z-10 flex min-w-0 flex-1 flex-col gap-[3px]">
						<div className="flex min-w-0 flex-col gap-[2px]">
							<p className="m-0 text-[13px] font-bold leading-[18px] text-[#0073FF]">
								이 경험에 집중했어요
							</p>
							<p className="m-0 line-clamp-2 break-keep text-[17px] font-bold leading-[1.12] text-[#111827]">
								{coverLetter.categoryTitle}
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<SourceBadge>
								피드백 {coverLetter.sourceFeedbackCount}개 반영
							</SourceBadge>
							<SourceBadge>
								회고 {coverLetter.sourceRetrospectCount}개 반영
							</SourceBadge>
						</div>
					</div>
					<img
						src={chTextImage}
						alt=""
						className="mt-1 h-[77px] w-[62px] shrink-0 object-contain"
					/>
				</section>

				<section className="mt-5 rounded-[20px] border border-[#EDF0FF] bg-white px-4 pb-[31px] pt-[21px]">
					<div className="flex items-start justify-between gap-3">
						<h2 className="m-0 min-w-0 flex-1 text-[16px] font-bold leading-[1.25] text-black">
							{coverLetter.coverLetterTitle}
						</h2>
						<button
							type="button"
							onClick={copyContent}
							className="flex shrink-0 items-center gap-1 border-none bg-transparent p-0 text-[#0072FF]"
						>
							<CopyIcon width={11} height={11} aria-hidden="true" />
							<span className="text-[12px] font-bold leading-[16px]">
								{copyMessage || "복사하기"}
							</span>
						</button>
					</div>
					<div className="mt-5 text-[14px] font-normal leading-[1.45] text-black">
						<MarkdownContent content={coverLetter.content} />
					</div>
				</section>
			</main>

			<div className="fixed bottom-5 left-1/2 w-full max-w-[402px] -translate-x-1/2 px-5">
				<button
					type="button"
					onClick={() => navigate(`/groups/${coverLetter.feedbackGroupId}`)}
					className="h-14 w-full rounded-[16px] border-none bg-[#E5E7EB] text-[17px] font-medium leading-[1.25] text-[#111827]"
				>
					피드백 보러가기
				</button>
			</div>
		</CoverLetterLayout>
	);
}

function CoverLetterLayout({
	children,
	onBack,
}: {
	children: React.ReactNode;
	onBack: () => void;
}) {
	return (
		<div className="relative flex min-h-screen flex-col bg-[#F8F8F8] text-black">
			<Header onBack={onBack} withBottomSpacing={false} />
			{children}
		</div>
	);
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-[60vh] items-center justify-center px-5 text-center">
			<span className="text-[18px] font-medium text-black/50">{children}</span>
		</div>
	);
}

function SourceBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-[13px] border border-[#DBEAFE] bg-white px-[9px] py-1 text-center text-[11px] font-semibold leading-4 text-[#0073FF]">
			{children}
		</span>
	);
}

function MarkdownContent({ content }: { content: string }) {
	const blocks = splitMarkdownBlocks(content);

	return (
		<>
			{blocks.map(({ key, text }) => (
				<p key={key} className="m-0 mb-5 last:mb-0">
					{renderInlineMarkdown(text)}
				</p>
			))}
		</>
	);
}

function renderInlineMarkdown(text: string) {
	const parts = splitMarkdownInlineParts(text);

	return parts.map(({ key, text: part }) => {
		const isStrong = part.startsWith("**") && part.endsWith("**");
		const value = isStrong ? part.slice(2, -2) : part;

		return isStrong ? (
			<strong
				key={key}
				className="font-semibold text-[#0073FF] underline underline-offset-2"
			>
				{value}
			</strong>
		) : (
			<span key={key}>{value}</span>
		);
	});
}

function splitMarkdownBlocks(content: string) {
	return splitWithPositionKeys(content, /\n{2,}/g, "block");
}

function splitMarkdownInlineParts(content: string) {
	return splitWithPositionKeys(content, /(\*\*[^*]+\*\*)/g, "inline");
}

function splitWithPositionKeys(
	content: string,
	separator: RegExp,
	keyPrefix: string,
) {
	const parts: { key: string; text: string }[] = [];
	let offset = 0;

	for (const part of content.split(separator).filter(Boolean)) {
		const position = content.indexOf(part, offset);
		const start = position >= 0 ? position : offset;

		parts.push({
			key: `${keyPrefix}-${start}-${part.length}`,
			text: part,
		});
		offset = start + part.length;
	}

	return parts;
}

function markdownToPlainText(content: string) {
	return content
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.trim();
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "자기소개서를 불러오지 못했어요.";
}
