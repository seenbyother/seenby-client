import type {
	AnalysisDetail,
	AnalysisTypeCode,
} from "@/features/feedback-groups/api";

export type AnalysisStepMeta = {
	title: string;
	description: string;
};

export type AnalysisKeywordView = {
	rank: number;
	keyword: string;
	count: number;
};

export type AnalysisComparisonRowView = {
	label: string;
	selfView: string[];
	otherView: string[];
};

export type AnalysisViewModel = {
	groupId: number;
	groupName: string;
	analyzedAt: string;
	steps: AnalysisStepMeta[];
	summary: string;
	strengths: { title: string; description: string }[];
	growthSummary: string;
	keywords: AnalysisKeywordView[];
	insightSummary: string;
	insights: { title: string; content: string }[];
	selfAwareness: number;
	comparisonRows: AnalysisComparisonRowView[];
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

function text(value: unknown, fallback = ""): string {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function finiteNumber(value: unknown, fallback = 0): number {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringList(value: unknown): string[] {
	return Array.isArray(value)
		? value.map((item) => text(item)).filter(Boolean)
		: [];
}

const ANALYSIS_TYPE_CODES = new Set<AnalysisTypeCode>([
	"HELPER",
	"ENERGIZER",
	"RELIABLE",
	"THINKER",
	"EXPLORER",
	"PIONEER",
]);

function analysisTypeCode(value: unknown): AnalysisTypeCode {
	return typeof value === "string" &&
		ANALYSIS_TYPE_CODES.has(value as AnalysisTypeCode)
		? (value as AnalysisTypeCode)
		: "RELIABLE";
}

export function toAnalysisViewModel(data: AnalysisDetail): AnalysisViewModel {
	const selfAwareness = Math.min(
		100,
		Math.max(0, finiteNumber(data.selfAwarenessAnalysis.selfAwarenessScore)),
	);
	const strengths = Array.isArray(data.summaryAnalysis.strengths)
		? data.summaryAnalysis.strengths.map((strength) => ({
				title: text(strength.title, "강점"),
				description: text(strength.description),
			}))
		: [];
	const keywords = Array.isArray(data.keywordAnalysis.keywords)
		? data.keywordAnalysis.keywords.map((keyword, index) => ({
				rank: index + 1,
				keyword: text(keyword.label, "키워드"),
				count: Math.max(0, finiteNumber(keyword.count)),
			}))
		: [];
	const insights = Array.isArray(data.insightAnalysis.insights)
		? data.insightAnalysis.insights.map((insight) => ({
				title: text(insight.title, "핵심 인사이트"),
				content: text(insight.content),
			}))
		: [];
	const comparisonRows = Array.isArray(
		data.selfAwarenessAnalysis.comparisonRows,
	)
		? data.selfAwarenessAnalysis.comparisonRows.map((row) => ({
				label: text(row.label, "항목"),
				selfView: stringList(row.selfValues),
				otherView: stringList(row.othersValues),
			}))
		: [];
	const actions = Array.isArray(data.actionPlan.actions)
		? data.actionPlan.actions.map((action) => ({
				title: text(action.title, "실천 습관"),
				description: text(action.description),
			}))
		: [];

	return {
		groupId: finiteNumber(data.feedbackGroupId),
		groupName: text(data.feedbackGroupName, "피드백 그룹"),
		analyzedAt: text(data.analyzedAt),
		steps: [
			{
				title: text(
					data.summaryAnalysis.pageTitle,
					"동료가 바라본 나의 모습을 확인해요",
				),
				description: "동료들이 반복해서 언급한 평가를 모았어요.",
			},
			{
				title: "자주 언급된 표현으로 동료가 보는 나를 확인해요",
				description: "횟수가 같은 키워드는 같은 길이로 표시했어요.",
			},
			{
				title: text(
					data.insightAnalysis.pageTitle,
					"강점을 표현하면 영향력이 더 커져요",
				),
				description: "긴 분석을 핵심 판단과 행동으로 나눴어요.",
			},
			{
				title: `나와 타인이 보는 모습이 ${selfAwareness}% 일치해요`,
				description: "차이가 큰 부분만 간단히 비교해 보세요.",
			},
			{
				title: `4주 동안 반복할 ${actions.length}가지 습관이에요`,
				description: "매주 같은 행동을 실천하며 변화를 확인해요.",
			},
			{
				title: "당신의 피드백 유형을 발견했어요",
				description: "동료의 시선에서 발견한 나만의 강점이에요.",
			},
		],
		summary: text(
			data.summaryAnalysis.summary,
			"아직 표시할 피드백 요약이 없어요.",
		),
		strengths,
		growthSummary: text(
			data.summaryAnalysis.growthSummary,
			"아직 표시할 성장 포인트가 없어요.",
		),
		keywords,
		insightSummary: text(
			data.insightAnalysis.insightSummary,
			"아직 표시할 분석 인사이트가 없어요.",
		),
		insights,
		selfAwareness,
		comparisonRows,
		actions,
		reviewGuide: text(
			data.actionPlan.reviewGuide,
			"매주 실천한 내용을 돌아보고 변화를 기록해 보세요.",
		),
		finalType: {
			code: analysisTypeCode(data.finalType.typeCode),
			name: text(data.finalType.typeName, "나의 피드백 유형"),
			description: "피드백으로 발견한 나의 협업 유형",
			traits: stringList(data.finalType.traits),
			strength: text(
				data.finalType.strength,
				"피드백이 쌓이면 나만의 강점을 더 정확히 보여드릴게요.",
			),
			growthPoint: text(
				data.finalType.growthPoint,
				"작은 행동부터 꾸준히 실천해 보세요.",
			),
		},
		usedFeedbacks: Array.isArray(data.usedFeedbacks)
			? data.usedFeedbacks
					.map((feedback) => ({
						id: finiteNumber(feedback.id),
						displayName: `${text(feedback.reviewerName, "익명")}님의 피드백`,
					}))
					.filter((feedback) => feedback.id > 0)
			: [],
	};
}

export const ANALYSIS_PREVIEW_DATA: AnalysisDetail = {
	analysisId: 0,
	feedbackGroupId: 1,
	feedbackGroupName: "SeenBy 프로젝트",
	status: "COMPLETED",
	analyzedAt: "2026-05-02T09:00:00",
	summaryAnalysis: {
		pageTitle: "믿고 맡길 수 있는 실행형 팀원이에요",
		summary:
			"일을 빠르고 완성도 높게 처리하며 팀 진행을 원활하게 만드는 사람이에요.",
		strengths: [
			{ title: "실행력", description: "속도와 완성도" },
			{ title: "운영 능력", description: "문서화와 일정 관리" },
			{ title: "분위기 조율", description: "아이디어와 디자인 기여" },
		],
		growthSummary: "의견을 더 자주 말하고 의도를 공유하기",
	},
	keywordAnalysis: {
		keywords: [
			["도움이 되는", 3],
			["믿음직한", 3],
			["생각이 깊은", 3],
			["재능있는", 3],
			["상냥한", 2],
			["영리한", 2],
			["유쾌한", 2],
			["재치있는", 2],
			["적극적인", 2],
			["내향적인", 1],
		].map(([label, count]) => ({
			label: String(label),
			count: Number(count),
		})),
	},
	insightAnalysis: {
		pageTitle: "강점은 이미 충분해요. 표현하면 영향력이 커져요",
		insightSummary:
			"빠르고 철저한 실행력으로 팀의 기준과 기대치를 끌어올리고 있어요.",
		insights: [
			{
				title: "이미 인정받은 강점",
				content: "높은 신뢰 · 실행력 · 문서화",
			},
			{
				title: "영향력을 키우는 방법",
				content:
					"발언 빈도와 의도 공유를 조금만 늘리면 팀이 더 쉽게 방향을 이해하고 따라와요.",
			},
		],
	},
	selfAwarenessAnalysis: {
		selfAwarenessScore: 81.8,
		comparisonRows: [
			{
				label: "주요 강점",
				selfValues: ["유쾌함", "자신감"],
				othersValues: ["믿음직함", "철저함"],
			},
			{
				label: "보완 필요",
				selfValues: ["조심성"],
				othersValues: ["의견 표현", "공유"],
			},
			{
				label: "성향",
				selfValues: ["재치", "용기"],
				othersValues: ["신속함", "완성도"],
			},
		],
	},
	actionPlan: {
		actions: [
			{ title: "회의 전 준비", description: "말할 포인트 1~2개 메모하기" },
			{
				title: "의도 먼저 공유",
				description: "선택지와 우려를 2~3문장으로 정리하기",
			},
			{
				title: "아이디어 제안",
				description: "주 1회 내 생각을 팀 대화에 남기기",
			},
		],
		reviewGuide: "팀 반응을 돌아보고 발언 방식을 조절해요.",
	},
	finalType: {
		typeCode: "RELIABLE",
		typeName: "든든한 신뢰형",
		traits: ["신뢰도", "실행력", "안정감"],
		strength: "신뢰도와 실행력으로 프로젝트를 안정적으로 이끌어요.",
		growthPoint: "아이디어와 의도를 더 자주 나눠 보세요.",
	},
	usedFeedbacks: [
		{ id: 101, reviewerName: "김연우" },
		{ id: 104, reviewerName: "박서윤" },
		{ id: 108, reviewerName: "이도현" },
		{ id: 112, reviewerName: "최지우" },
	],
	isRead: true,
};
