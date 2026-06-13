import type { ReactNode } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { useCurrentUser } from "@/features/auth/hooks";
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage";
import { AuthSuccessPage } from "@/pages/auth/AuthSuccessPage";
import { ForbiddenPage } from "@/pages/auth/ForbiddenPage";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { FeedbackDetailPage } from "@/pages/feedback-detail/FeedbackDetailPage";
import { FeedbackGroupCreatePage } from "@/pages/feedback-group/FeedbackGroupCreatePage";
import { GroupAnalysisPage } from "@/pages/groups/GroupAnalysisPage";
import { GroupAnalysisResultPage } from "@/pages/groups/GroupAnalysisResultPage";
import { GroupDetailPage } from "@/pages/groups/GroupDetailPage";
import { GroupsPage } from "@/pages/groups/GroupsPage";
import { HomePage } from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<WebViewShell />}>
				{/* public */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/auth/callback" element={<AuthCallbackPage />} />
				<Route path="/auth/success" element={<AuthSuccessPage />} />
				<Route path="/forbidden" element={<ForbiddenPage />} />
				<Route path="/feedback" element={<FeedbackPage />} />
				<Route path="/onboarding" element={<OnboardingPage />} />

				{/* protected */}
				<Route element={<ProtectedRoute />}>
					<Route index element={<HomePage />} />
					<Route path="/home" element={<HomePage />} />
					<Route
						path="/feedback/detail/:answerId"
						element={<FeedbackDetailPage />}
					/>
					<Route path="/groups" element={<GroupsPage />} />
					<Route path="/groups/:groupId" element={<GroupDetailPage />} />
					<Route
						path="/groups/:groupId/analysis"
						element={<GroupAnalysisPage />}
					/>
					<Route
						path="/groups/:groupId/analysis/result"
						element={<GroupAnalysisResultPage />}
					/>
					<Route
						path="/feedback-group/create"
						element={<FeedbackGroupCreatePage />}
					/>
					<Route
						path="/feedback-groups/new"
						element={<FeedbackGroupCreatePage />}
					/>
				</Route>
			</Route>
		</Routes>
	);
}

function ProtectedRoute() {
	const { isError, isLoading } = useCurrentUser();

	if (isLoading) {
		return <AuthCheckScreen />;
	}

	if (isError) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

function AuthCheckScreen() {
	return (
		<main className="min-h-screen bg-white text-black">
			<section className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center px-5 text-center">
				<div
					className="h-9 w-9 animate-spin rounded-full border-4 border-[#E8EBF0] border-t-[#0073FF]"
					aria-hidden="true"
				/>
				<h1 className="mt-5 mb-0 text-[22px] font-bold leading-[135%]">
					로그인 확인 중
				</h1>
				<p className="mt-2 mb-0 text-[15px] font-medium leading-[150%] text-[#71717A]">
					잠시만 기다려주세요.
				</p>
			</section>
		</main>
	);
}

interface WebViewShellProps {
	children?: ReactNode;
}

function WebViewShell({ children }: WebViewShellProps) {
	return (
		<div className="max-w-[402px] mx-auto w-full min-h-screen text-left">
			{children ?? <Outlet />}
		</div>
	);
}
