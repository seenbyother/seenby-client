import { Route, Routes } from "react-router";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/feedback" element={<FeedbackPage />} />
		</Routes>
	);
}
