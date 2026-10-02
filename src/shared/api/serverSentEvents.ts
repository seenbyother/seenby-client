export function parseJsonServerSentEvent(
	event: Event,
): Record<string, unknown> | null {
	if (!(event instanceof MessageEvent) || typeof event.data !== "string") {
		return null;
	}

	try {
		const value: unknown = JSON.parse(event.data);
		return value !== null && typeof value === "object" && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: null;
	} catch {
		return null;
	}
}
