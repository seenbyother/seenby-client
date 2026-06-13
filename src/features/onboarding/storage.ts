const ONBOARDING_COMPLETED_KEY = "seenby:onboarding:completed";

function canUseStorage() {
	return (
		typeof window !== "undefined" && typeof window.localStorage !== "undefined"
	);
}

export function hasCompletedOnboarding() {
	if (!canUseStorage()) {
		return false;
	}

	return window.localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
}

export function markOnboardingCompleted() {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
}

export function getPostLoginRedirectPath() {
	return hasCompletedOnboarding() ? "/home" : "/onboarding";
}
