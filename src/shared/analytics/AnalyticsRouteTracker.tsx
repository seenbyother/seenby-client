import { useEffect } from "react";
import { useLocation } from "react-router";
import { trackPageView } from "./analytics";

export function AnalyticsRouteTracker() {
	const { pathname } = useLocation();

	useEffect(() => {
		trackPageView(pathname);
	}, [pathname]);

	return null;
}
