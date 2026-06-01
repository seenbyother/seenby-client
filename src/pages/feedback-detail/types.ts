export interface FeedbackAnswerDetail {
	id: number;
	feedbackGroupId: number;
	reviewerName: string;
	experienceCount: number;
	experienceFeedbacks: ExperienceFeedback[];
	keywords: string[];
	submittedAt: string;
	createdAt: string;
}

export interface ExperienceFeedback {
	id: number;
	experience: string;
	feedback: string;
	displayOrder: number;
}
