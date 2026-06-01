import { Route, Routes } from "react-router";
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage";
import { AuthSuccessPage } from "@/pages/auth/AuthSuccessPage";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { GroupsPage } from "@/pages/groups/GroupsPage";
import { FeedbackGroupCreatePage } from "@/pages/feedback-group/FeedbackGroupCreatePage";
import { HomePage } from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/feedback" element={<FeedbackPage />} />
			<Route path="/groups" element={<GroupsPage />} />
			<Route path="/" element={<HomePage />} />
			<Route path="/home" element={<HomePage />} />
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
				path="/feedback"
				element={
					<WebViewShell>
						<FeedbackPage />
					</WebViewShell>
				}
			/>
			<Route
				path="/feedback-group/create"
				element={
					<WebViewShell>
						<FeedbackGroupCreatePage />
					</WebViewShell>
				}
			/>
			<Route
				path="/feedback-groups/new"
				element={
					<WebViewShell>
						<FeedbackGroupCreatePage />
					</WebViewShell>
				}
			/>
		</Routes>
	);
}

interface WebViewShellProps {
	children: React.ReactNode;
}

function WebViewShell({ children }: WebViewShellProps) {
	return (
		<div className="max-w-[402px] mx-auto w-full min-h-screen text-left">
			{children}
		</div>
	);
}
