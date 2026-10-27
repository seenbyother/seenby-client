import { BrowserRouter } from "react-router";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppRoutes } from "@/routes";
import { AnalyticsRouteTracker } from "@/shared/analytics";

export default function App() {
	return (
		<QueryProvider>
			<BrowserRouter>
				<AnalyticsRouteTracker />
				<div className="w-full min-h-screen text-left" data-clarity-mask="true">
					<AppRoutes />
				</div>
			</BrowserRouter>
		</QueryProvider>
	);
}
