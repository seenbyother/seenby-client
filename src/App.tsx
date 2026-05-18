import { BrowserRouter } from "react-router";
import { AppRoutes } from "@/routes";

export default function App() {
	return (
		<BrowserRouter>
			<div className="max-w-[402px] mx-auto w-full min-h-screen text-left">
				<AppRoutes />
			</div>
		</BrowserRouter>
	);
}
