declare module "*.svg?react" {
	import type { SVGProps } from "react";

	const ReactComponent: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
	export default ReactComponent;
}

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_ANALYTICS_ENABLED?: string;
	readonly VITE_GA_MEASUREMENT_ID?: string;
	readonly VITE_CLARITY_PROJECT_ID?: string;
	readonly VITE_KAKAO_APP_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	dataLayer?: unknown[][];
	gtag?: (...args: unknown[]) => void;
	clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
}
