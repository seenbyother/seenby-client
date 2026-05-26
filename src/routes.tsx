import { Navigate, Route, Routes } from "react-router";
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage";
import { AuthSuccessPage } from "@/pages/auth/AuthSuccessPage";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import LoginPage from "@/pages/login/LoginPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/auth/callback" element={<AuthCallbackPage />} />
			<Route path="/auth/success" element={<AuthSuccessPage />} />
			<Route path="/feedback" element={<FeedbackPage />} />
		</Routes>
	);
}
