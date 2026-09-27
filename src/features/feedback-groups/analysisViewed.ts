const STORAGE_KEY_PREFIX = "seenby:analysis-viewed:";

function getStorageKey(analysisId: number): string | null {
	return Number.isInteger(analysisId) && analysisId > 0
		? `${STORAGE_KEY_PREFIX}${analysisId}`
		: null;
}

export function hasViewedAnalysis(analysisId: number): boolean {
	const key = getStorageKey(analysisId);
	if (!key) return false;

	try {
		return localStorage.getItem(key) !== null;
	} catch {
		return false;
	}
}

export function markAnalysisViewed(analysisId: number): void {
	const key = getStorageKey(analysisId);
	if (!key) return;

	try {
		localStorage.setItem(key, "1");
	} catch {
		// ignore
	}
}
