export type SelfKeywordCategoryId = "mood" | "relationship" | "tendency";

export type SelfKeywordCategory = {
	id: SelfKeywordCategoryId;
	title: string;
	description: string;
	keywords: string[];
};

export const MAX_SELF_KEYWORD_COUNT_BY_CATEGORY = 5;

export const SELF_KEYWORD_CATEGORIES: SelfKeywordCategory[] = [
	{
		id: "mood",
		title: "분위기",
		description: "평소 나의 첫인상이나 분위기에 가까운 단어를 골라주세요",
		keywords: [
			"유쾌한",
			"차분한",
			"활동적인",
			"행복한",
			"따뜻한",
			"친절한",
			"상냥한",
			"외향적인",
			"내향적인",
			"내성적인",
			"수줍어하는",
			"똑똑한",
			"품위있는",
			"강한 인상",
			"낙천적인",
			"긴장한",
			"감정적인",
			"관대한",
		],
	},
	{
		id: "relationship",
		title: "관계",
		description: "성격이나 사람을 대하는 모습과 가까운 단어를 골라주세요",
		keywords: [
			"믿음직한",
			"도움이 되는",
			"철저한",
			"마음이 넓은",
			"동정심 있는",
			"솔직한",
			"조심성 있는",
			"융통성 있는",
			"성숙한",
			"자기 주장이 강한",
			"참을성 있는",
			"논리적인",
			"실용적인",
			"겸손한",
			"독립적인",
			"민감한",
			"자발적인",
			"생각이 깊은",
		],
	},
	{
		id: "tendency",
		title: "성향",
		description: "성격이나 가치관에 가까운 단어를 골라주세요",
		keywords: [
			"재능있는",
			"영리한",
			"독창적인",
			"재치있는",
			"총명한",
			"박식한",
			"지혜가 있는",
			"용기있는",
			"적극적인",
			"자신감 있는",
			"이상주의적인",
			"엄격한",
			"양향적인",
			"자의식이 강한",
			"까다로운",
			"어리숙함",
		],
	},
];

export const SELF_KEYWORD_CATEGORY_BY_KEYWORD = new Map(
	SELF_KEYWORD_CATEGORIES.flatMap((category) =>
		category.keywords.map((keyword) => [keyword, category.id] as const),
	),
);

export const KNOWN_SELF_KEYWORDS = new Set(
	SELF_KEYWORD_CATEGORY_BY_KEYWORD.keys(),
);

export function getDisplayableSelfKeywords(savedKeywords: string[]) {
	const selected = new Set<string>();
	const selectedCountsByCategory = new Map<SelfKeywordCategoryId, number>();

	for (const keyword of savedKeywords) {
		if (selected.has(keyword) || !KNOWN_SELF_KEYWORDS.has(keyword)) {
			continue;
		}

		const categoryId = SELF_KEYWORD_CATEGORY_BY_KEYWORD.get(keyword);

		if (!categoryId) {
			continue;
		}

		const selectedCount = selectedCountsByCategory.get(categoryId) ?? 0;

		if (selectedCount >= MAX_SELF_KEYWORD_COUNT_BY_CATEGORY) {
			continue;
		}

		selected.add(keyword);
		selectedCountsByCategory.set(categoryId, selectedCount + 1);
	}

	return Array.from(selected);
}

export function countSelfKeywordsInCategory(
	selectedKeywords: Set<string>,
	categoryId: SelfKeywordCategoryId,
) {
	const category = SELF_KEYWORD_CATEGORIES.find(
		(item) => item.id === categoryId,
	);

	if (!category) {
		return 0;
	}

	return category.keywords.filter((keyword) => selectedKeywords.has(keyword))
		.length;
}

export function getOrderedSelfKeywords(selectedKeywords: Set<string>) {
	return SELF_KEYWORD_CATEGORIES.flatMap((category) =>
		category.keywords.filter((keyword) => selectedKeywords.has(keyword)),
	);
}
