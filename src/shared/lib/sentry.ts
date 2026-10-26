import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from "react-router";

export function initSentry() {
	const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

	if (!dsn) {
		console.warn(
			"[Sentry] VITE_SENTRY_DSN이 설정되지 않아 초기화를 건너뜁니다.",
		);
		return;
	}

	Sentry.init({
		dsn,
		environment: import.meta.env.MODE,
		enabled: import.meta.env.PROD,
		integrations: [
			Sentry.reactRouterV7BrowserTracingIntegration({
				useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes,
			}),
		],
		tracesSampleRate: import.meta.env.PROD ? 0.2 : 1,
	});
}
