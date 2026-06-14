import type { ReactNode } from "react";

interface AnalysisCardProps {
	title: string;
	children: ReactNode;
}

export function AnalysisCard({ title, children }: AnalysisCardProps) {
	return (
		<section className="bg-white rounded-[20px] p-4 flex flex-col gap-5">
			<h2 className="m-0 text-[16px] font-bold text-black">{title}</h2>
			{children}
		</section>
	);
}
