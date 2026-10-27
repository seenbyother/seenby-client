type AnalyticsParameter = string | number | boolean;

export type AnalyticsEventName =
	| "login"
	| "onboarding_completed"
	| "feedback_group_created"
	| "feedback_link_shared"
	| "feedback_submitted"
	| "retrospective_saved"
	| "ai_generation_requested"
	| "ai_generation_completed"
	| "cover_letter_generation_requested"
	| "cover_letter_generation_completed";

export type AnalyticsEventParameters = Record<
	string,
	AnalyticsParameter | null | undefined
>;

const GA_SCRIPT_ID = "seenby-google-analytics";
const CLARITY_SCRIPT_ID = "seenby-microsoft-clarity";
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;
const CLARITY_PROJECT_ID_PATTERN = /^[a-z0-9]+$/i;
const CLARITY_EXCLUDED_PATHS = new Set(["/auth/callback", "/feedback"]);
const PRODUCTION_HOSTNAMES = new Set(["seenby.kr", "www.seenby.kr"]);
const DEFAULT_GA_MEASUREMENT_ID = "G-SHCL9KJ52P";
const DEFAULT_CLARITY_PROJECT_ID = "yzorz3boar";

const gaMeasurementId =
	import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || DEFAULT_GA_MEASUREMENT_ID;
const clarityProjectId =
	import.meta.env.VITE_CLARITY_PROJECT_ID?.trim() || DEFAULT_CLARITY_PROJECT_ID;

let isGoogleAnalyticsInitialized = false;
let isClarityInitialized = false;

export function initializeAnalytics() {
	if (!isAnalyticsEnabled()) return;

	initializeGoogleAnalytics();
	initializeClarity(window.location.pathname);
}

export function trackPageView(pathname: string) {
	if (!isAnalyticsEnabled()) return;

	const pagePath = normalizeAnalyticsPath(pathname);
	initializeClarity(pathname);

	if (isGoogleAnalyticsInitialized && window.gtag) {
		window.gtag("event", "page_view", {
			page_location: `${window.location.origin}${pagePath}`,
			page_path: pagePath,
			page_title: document.title,
		});
	}

	if (isClarityInitialized && window.clarity) {
		window.clarity("set", "page_path", pagePath);
	}
}

export function trackEvent(
	name: AnalyticsEventName,
	parameters: AnalyticsEventParameters = {},
) {
	if (!isAnalyticsEnabled()) return;

	const sanitizedParameters = Object.fromEntries(
		Object.entries(parameters).filter(
			(entry): entry is [string, AnalyticsParameter] =>
				entry[1] !== null && entry[1] !== undefined,
		),
	);

	if (isGoogleAnalyticsInitialized && window.gtag) {
		window.gtag("event", name, sanitizedParameters);
	}

	if (isClarityInitialized && window.clarity) {
		window.clarity("event", name);
	}
}

export function normalizeAnalyticsPath(pathname: string) {
	const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
	const routePatterns: Array<[RegExp, string]> = [
		[/^\/groups\/[^/]+\/analysis\/result$/, "/groups/:groupId/analysis/result"],
		[/^\/groups\/[^/]+\/analysis$/, "/groups/:groupId/analysis"],
		[/^\/groups\/[^/]+$/, "/groups/:groupId"],
		[/^\/feedback\/detail\/[^/]+$/, "/feedback/detail/:answerId"],
		[/^\/analysis\/ai\/[^/]+$/, "/analysis/ai/:analysisId"],
		[/^\/cover-letters\/[^/]+$/, "/cover-letters/:coverLetterId"],
	];

	return (
		routePatterns.find(([pattern]) => pattern.test(normalizedPathname))?.[1] ??
		normalizedPathname
	);
}

function isAnalyticsEnabled() {
	const configuredValue =
		import.meta.env.VITE_ANALYTICS_ENABLED?.trim().toLowerCase();

	if (configuredValue === "true") return true;
	if (configuredValue === "false") return false;

	return (
		import.meta.env.PROD && PRODUCTION_HOSTNAMES.has(window.location.hostname)
	);
}

function initializeGoogleAnalytics() {
	if (
		isGoogleAnalyticsInitialized ||
		!gaMeasurementId ||
		!GA_MEASUREMENT_ID_PATTERN.test(gaMeasurementId)
	) {
		return;
	}

	window.dataLayer = window.dataLayer ?? [];
	window.gtag =
		window.gtag ??
		((...args: unknown[]) => {
			window.dataLayer?.push(args);
		});

	window.gtag("js", new Date());
	window.gtag("config", gaMeasurementId, {
		allow_google_signals: false,
		allow_ad_personalization_signals: false,
		send_page_view: false,
	});

	if (!document.getElementById(GA_SCRIPT_ID)) {
		const script = document.createElement("script");
		script.id = GA_SCRIPT_ID;
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
		document.head.appendChild(script);
	}

	isGoogleAnalyticsInitialized = true;
}

function initializeClarity(pathname: string) {
	const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

	if (
		isClarityInitialized ||
		CLARITY_EXCLUDED_PATHS.has(normalizedPathname) ||
		!clarityProjectId ||
		!CLARITY_PROJECT_ID_PATTERN.test(clarityProjectId)
	) {
		return;
	}

	if (!window.clarity) {
		const queuedCommands: unknown[][] = [];
		const clarityQueue = (...args: unknown[]) => queuedCommands.push(args);
		clarityQueue.q = queuedCommands;
		window.clarity = clarityQueue;
	}

	if (!document.getElementById(CLARITY_SCRIPT_ID)) {
		const script = document.createElement("script");
		script.id = CLARITY_SCRIPT_ID;
		script.async = true;
		script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityProjectId)}`;
		document.head.appendChild(script);
	}

	isClarityInitialized = true;
}
