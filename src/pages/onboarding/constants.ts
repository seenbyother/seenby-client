import { SELF_KEYWORD_CATEGORIES } from "@/features/onboarding/selfKeywords";

const ONBOARDING_TITLE_BY_CATEGORY = {
	mood: (name: string) => `${name} 님은\n어떤 분위기의 사람인가요?`,
	relationship: (name: string) => `${name} 님은 함께 있을 때\n어떤 모습인가요?`,
	tendency: (name: string) => `${name} 님을 더 잘 표현하는 단어를\n골라주세요`,
};

const ONBOARDING_SUBTITLE_BY_CATEGORY = {
	mood: "첫인상이나 분위기에 가까운 단어를 골라주세요",
	relationship: "성격이나 사람을 대하는 모습과 가까운 단어를 골라주세요",
	tendency: "성격이나 가치관에 가까운 단어들이에요",
};

export const ONBOARDING_KEYWORD_STEPS = SELF_KEYWORD_CATEGORIES.map(
	(category) => ({
		id: category.id,
		title: ONBOARDING_TITLE_BY_CATEGORY[category.id],
		subtitle: ONBOARDING_SUBTITLE_BY_CATEGORY[category.id],
		keywords: category.keywords,
	}),
);
