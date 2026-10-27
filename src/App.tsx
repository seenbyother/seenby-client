import * as Sentry from "@sentry/react";
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
					<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
						<AppRoutes />
					</Sentry.ErrorBoundary>
				</div>
			</BrowserRouter>
		</QueryProvider>
	);
}

function ErrorFallback() {
	return (
		<main className="min-h-screen bg-white text-black">
			<section className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center px-5 text-center">
				<h1 className="mt-5 mb-0 text-[22px] font-bold leading-[135%]">
					문제가 발생했어요
				</h1>
				<p className="mt-2 mb-0 text-[15px] font-medium leading-[150%] text-[#71717A]">
					잠시 후 다시 시도해주세요.
				</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-6 h-11 rounded-full bg-[#0073FF] px-6 text-[15px] font-semibold text-white"
				>
					새로고침
				</button>
			</section>
		</main>
	);
}
