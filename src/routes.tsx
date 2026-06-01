import { Route, Routes } from "react-router";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { GroupAnalysisPage } from "@/pages/groups/GroupAnalysisPage";
import { GroupDetailPage } from "@/pages/groups/GroupDetailPage";
import { GroupsPage } from "@/pages/groups/GroupsPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/feedback" element={<FeedbackPage />} />
			<Route path="/groups" element={<GroupsPage />} />
			<Route path="/groups/:groupId" element={<GroupDetailPage />} />
			<Route path="/groups/:groupId/analysis" element={<GroupAnalysisPage />} />
		</Routes>
	);
}
