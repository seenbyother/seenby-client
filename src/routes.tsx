import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useCurrentUser } from "@/features/auth/hooks";
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage";
import { AuthSuccessPage } from "@/pages/auth/AuthSuccessPage";
import { ForbiddenPage } from "@/pages/auth/ForbiddenPage";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { FeedbackDetailPage } from "@/pages/feedback-detail/FeedbackDetailPage";
import { FeedbackGroupCreatePage } from "@/pages/feedback-group/FeedbackGroupCreatePage";
import { GroupAnalysisPage } from "@/pages/groups/GroupAnalysisPage";
import { GroupDetailPage } from "@/pages/groups/GroupDetailPage";
import { GroupsPage } from "@/pages/groups/GroupsPage";
import { HomePage } from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<HomePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/home"
				element={
					<ProtectedRoute>
						<HomePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/login"
				element={
					<WebViewShell>
						<LoginPage />
					</WebViewShell>
				}
			/>
			<Route
				path="/auth/callback"
				element={
					<WebViewShell>
						<AuthCallbackPage />
					</WebViewShell>
				}
			/>
			<Route
				path="/auth/success"
				element={
					<WebViewShell>
						<AuthSuccessPage />
					</WebViewShell>
				}
			/>
			<Route
				path="/forbidden"
				element={
					<WebViewShell>
						<ForbiddenPage />
					</WebViewShell>
				}
			/>
			<Route
				path="/feedback"
				element={
					<WebViewShell>
						<FeedbackPage />
					</WebViewShell>
				}
			/>
			<Route
				path="/feedback/detail/:answerId"
				element={
					<ProtectedRoute>
						<WebViewShell>
							<FeedbackDetailPage />
						</WebViewShell>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/groups"
				element={
					<ProtectedRoute>
						<WebViewShell>
							<GroupsPage />
						</WebViewShell>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/groups/:groupId"
				element={
					<ProtectedRoute>
						<WebViewShell>
							<GroupDetailPage />
						</WebViewShell>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/groups/:groupId/analysis"
				element={
					<ProtectedRoute>
						<WebViewShell>
							<GroupAnalysisPage />
						</WebViewShell>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/feedback-group/create"
				element={
					<ProtectedRoute>
						<WebViewShell>
							<FeedbackGroupCreatePage />
						</WebViewShell>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/feedback-groups/new"
				element={
					<ProtectedRoute>
						<WebViewShell>
							<FeedbackGroupCreatePage />
						</WebViewShell>
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

type ProtectedRouteProps = {
	children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isError, isLoading } = useCurrentUser();

	if (isLoading) {
		return <AuthCheckScreen />;
	}

	if (isError) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
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
	children: ReactNode;
}

function WebViewShell({ children }: WebViewShellProps) {
	return (
		<div className="max-w-[402px] mx-auto w-full min-h-screen text-left">
			{children}
		</div>
	);
}
