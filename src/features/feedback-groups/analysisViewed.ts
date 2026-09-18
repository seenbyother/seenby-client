const STORAGE_KEY_PREFIX = "seenby:analysis-viewed:";

export function hasViewedAnalysis(analysisId: number): boolean {
	try {
		return localStorage.getItem(`${STORAGE_KEY_PREFIX}${analysisId}`) !== null;
	} catch {
		return false;
	}
}

export function markAnalysisViewed(analysisId: number): void {
	try {
		localStorage.setItem(`${STORAGE_KEY_PREFIX}${analysisId}`, "1");
	} catch {
		// ignore
	}
}
