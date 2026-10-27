import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { initializeAnalytics } from "@/shared/analytics";
import { initSentry } from "@/shared/lib/sentry";
import "./index.css";

initSentry();
initializeAnalytics();

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
