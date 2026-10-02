import type {
	AnalysisDetail,
	AnalysisKeyword,
	AnalysisSelfOtherRow,
} from "@/features/feedback-groups/api";

export type AnalysisStepMeta = {
	title: string;
	description: string;
};

export type AnalysisTypeCode =
	| "PIONEER"
	| "RELIABLE"
	| "EXPLORER"
	| "HELPER"
	| "THINKER"
	| "ENERGIZER";

type RuntimeAnalysisDetail = Omit<AnalysisDetail, "group"> & {
	group?: AnalysisDetail["group"] & { title?: unknown };
	feedbackGroup?: {
		id?: unknown;
		name?: unknown;
		title?: unknown;
	};
	feedbackGroupName?: unknown;
	groupName?: unknown;
};

export type AnalysisViewModel = {
	groupId: number;
	groupName: string;
	analyzedAt: string;
	steps: AnalysisStepMeta[];
	summary: string;
	strengths: { title: string; description: string }[];
	growthSummary: string;
	keywords: AnalysisKeyword[];
	insightSummary: string;
	insights: { title: string; content: string }[];
	selfAwareness: number;
	comparisonRows: AnalysisSelfOtherRow[];
	actions: { title: string; description: string }[];
	reviewGuide: string;
	finalType: {
		code: AnalysisTypeCode;
		name: string;
		description: string;
		traits: string[];
		strength: string;
		growthPoint: string;
	};
	usedFeedbacks: { id: number; displayName: string }[];
};

const DEFAULT_STRENGTHS = [
	{ title: "실행력", description: "속도와 완성도" },
	{ title: "운영 능력", description: "문서화와 일정 관리" },
	{ title: "분위기 조율", description: "아이디어와 디자인 기여" },
];

const DEFAULT_ACTIONS = [
	{ title: "회의 전 준비", description: "말할 포인트 1~2개 메모하기" },
	{
		title: "의도 먼저 공유",
		description: "선택지와 우려를 2~3문장으로 정리하기",
	},
	{ title: "아이디어 제안", description: "주 1회 내 생각을 팀 대화에 남기기" },
];

function text(value: unknown, fallback = ""): string {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function finiteNumber(value: unknown, fallback = 0): number {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function firstText(...values: unknown[]): string {
	for (const value of values) {
		const normalized = text(value);
		if (normalized) return normalized;
	}
	return "";
}

function splitParagraphs(value: unknown): string[] {
	return text(value)
		.split(/\n+/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

export function getAnalysisGroupName(data: AnalysisDetail): string {
	const source = data as RuntimeAnalysisDetail;
	return firstText(
		source.group?.name,
		source.group?.title,
		source.feedbackGroup?.name,
		source.feedbackGroup?.title,
		source.feedbackGroupName,
		source.groupName,
	);
}

export function toAnalysisViewModel(
	data: AnalysisDetail,
	fallbackGroupName = "",
): AnalysisViewModel {
	const source = data as RuntimeAnalysisDetail;
	const insightParagraphs = splitParagraphs(data.insight);
	const actionParagraphs = splitParagraphs(data.actionPlan);
	const group = source.group;
	const feedbackGroup = source.feedbackGroup;
	const selfAwareness = Math.min(
		100,
		Math.max(0, finiteNumber(data.selfAwareness)),
	);
	const keywords = Array.isArray(data.topKeywords)
		? data.topKeywords
				.filter((item) => item && typeof item === "object")
				.map((item, index) => ({
					rank: finiteNumber(item.rank, index + 1),
					keyword: text(item.keyword, "키워드"),
					count: Math.max(0, finiteNumber(item.count)),
				}))
		: [];
	const comparisonRows = Array.isArray(data.selfOtherComparison?.rows)
		? data.selfOtherComparison.rows
				.filter((row) => row && typeof row === "object")
				.map((row) => ({
					label: text(row.label, "항목"),
					selfView: Array.isArray(row.selfView) ? row.selfView : [],
					otherView: Array.isArray(row.otherView) ? row.otherView : [],
				}))
		: [];

	return {
		groupId: finiteNumber(group?.id, finiteNumber(feedbackGroup?.id)),
		groupName: firstText(getAnalysisGroupName(data), fallbackGroupName),
		analyzedAt: text(data.analyzedAt),
		steps: [
			{
				title: "믿고 맡길 수 있는 실행형 팀원이에요",
				description: "동료들이 반복해서 언급한 평가를 모았어요.",
			},
			{
				title: "자주 언급된 표현으로 동료가 보는 나를 확인해요",
				description: "횟수가 같은 키워드는 같은 길이로 표시했어요.",
			},
			{
				title: "강점은 이미 충분해요. 표현하면 영향력이 커져요",
				description: "긴 분석을 핵심 판단과 행동으로 나눴어요.",
			},
			{
				title: `나와 타인이 보는 모습이 ${selfAwareness}% 일치해요`,
				description: "차이가 큰 부분만 간단히 비교해 보세요.",
			},
			{
				title: "4주 동안 반복할 3가지 습관이에요",
				description: "매주 같은 행동을 실천하며 변화를 확인해요.",
			},
			{
				title: "당신의 피드백 유형을 발견했어요",
				description: "동료의 시선에서 발견한 나만의 강점이에요.",
			},
		],
		summary: text(data.feedbackSummary, "아직 표시할 피드백 요약이 없어요."),
		strengths: DEFAULT_STRENGTHS,
		growthSummary: "의견을 더 자주 말하고 의도를 공유하기",
		keywords,
		insightSummary:
			insightParagraphs[0] ?? "아직 표시할 분석 인사이트가 없어요.",
		insights: [
			{
				title: "이미 인정받은 강점",
				content: insightParagraphs[1] ?? "높은 신뢰 · 실행력 · 문서화",
			},
			{
				title: "영향력을 키우는 방법",
				content:
					insightParagraphs[2] ??
					"발언 빈도와 의도 공유를 조금만 늘리면 팀이 더 쉽게 방향을 이해하고 따라와요.",
			},
		],
		selfAwareness,
		comparisonRows,
		actions: DEFAULT_ACTIONS.map((action, index) => ({
			title: action.title,
			description: actionParagraphs[index] ?? action.description,
		})),
		reviewGuide: "팀 반응을 돌아보고 발언 방식을 조절해요.",
		finalType: {
			code: "RELIABLE",
			name: "든든한 신뢰형",
			description: "신뢰를 쌓고 끝까지 해내는 사람",
			traits: ["신뢰도", "실행력", "안정감"],
			strength: text(
				data.totalSummary,
				"피드백이 쌓이면 나만의 강점을 더 정확히 보여드릴게요.",
			),
			growthPoint: "아이디어와 의도를 더 자주 나눠 보세요.",
		},
		usedFeedbacks:
			data.id === 0
				? [
						{ id: 101, displayName: "김연우님의 피드백" },
						{ id: 104, displayName: "박서윤님의 피드백" },
						{ id: 108, displayName: "이도현님의 피드백" },
						{ id: 112, displayName: "최지우님의 피드백" },
					]
				: [],
	};
}

export const ANALYSIS_PREVIEW_DATA: AnalysisDetail = {
	id: 0,
	status: "COMPLETED",
	readAt: null,
	group: { id: 1, selfIntroductionId: null, name: "SeenBy 프로젝트" },
	analyzedAt: "2026-05-02T09:00:00",
	feedbackSummary:
		"일을 빠르고 완성도 높게 처리하며 팀 진행을 원활하게 만드는 사람이에요.",
	topKeywords: [
		[1, "도움이 되는", 3],
		[2, "믿음직한", 3],
		[3, "생각이 깊은", 3],
		[4, "재능있는", 3],
		[5, "상냥한", 2],
		[6, "영리한", 2],
		[7, "유쾌한", 2],
		[8, "재치있는", 2],
		[9, "적극적인", 2],
		[10, "내향적인", 1],
	].map(([rank, keyword, count]) => ({
		rank: Number(rank),
		keyword: String(keyword),
		count: Number(count),
	})),
	insight:
		"빠르고 철저한 실행력으로 팀의 기준과 기대치를 끌어올리고 있어요.\n높은 신뢰 · 실행력 · 문서화\n발언 빈도와 의도 공유를 조금만 늘리면 팀이 더 쉽게 방향을 이해하고 따라와요.",
	selfAwareness: 81.8,
	selfOtherComparison: {
		rows: [
			{
				label: "Strengths",
				selfView: ["유쾌함", "자신감"],
				otherView: ["믿음직함", "철저함"],
			},
			{
				label: "Growth Areas",
				selfView: ["조심성"],
				otherView: ["의견 표현", "공유"],
			},
			{
				label: "Tendencies",
				selfView: ["재치", "용기"],
				otherView: ["신속함", "완성도"],
			},
		],
	},
	actionPlan:
		"말할 포인트 1~2개 메모하기\n선택지와 우려를 2~3문장으로 정리하기\n주 1회 내 생각을 팀 대화에 남기기",
	totalSummary: "신뢰도와 실행력으로 프로젝트를 안정적으로 이끌어요.",
};
