import { BrowserRouter } from "react-router";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppRoutes } from "@/routes";

export default function App() {
	return (
		<QueryProvider>
			<BrowserRouter>
				<div className="w-full min-h-screen text-left">
					<AppRoutes />
				</div>
			</BrowserRouter>
		</QueryProvider>
	);
}
