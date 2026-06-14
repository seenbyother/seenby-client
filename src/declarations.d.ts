declare module "*.svg?react" {
	import type { SVGProps } from "react";

	const ReactComponent: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
	export default ReactComponent;
}

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
