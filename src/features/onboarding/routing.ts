import type { CurrentUser } from "@/features/auth/api";

export function getPostLoginRedirectPath(user: CurrentUser) {
	return user.onboardingCompleted ? "/home" : "/onboarding";
}
