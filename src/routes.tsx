import { Route, Routes } from "react-router";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { GroupsPage } from "@/pages/groups/GroupsPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/feedback" element={<FeedbackPage />} />
			<Route path="/groups" element={<GroupsPage />} />
		</Routes>
	);
}
