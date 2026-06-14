import type { ReactNode } from "react";
import { Button } from "@/shared/components";

interface OnboardingLayoutProps {
	children: ReactNode;
	actionLabel: string;
	onAction: () => void;
	actionDisabled?: boolean;
	contentClassName?: string;
}

export function OnboardingLayout({
	children,
	actionLabel,
	onAction,
	actionDisabled = false,
	contentClassName = "",
}: OnboardingLayoutProps) {
	return (
		<main className="min-h-screen bg-white text-left text-black">
			<div className="relative mx-auto flex min-h-[100svh] w-full max-w-[402px] flex-col overflow-hidden bg-white">
				<div className={`flex-1 px-5 ${contentClassName}`}>{children}</div>
				<div className="px-5 pb-8 pt-5">
					<Button onClick={onAction} disabled={actionDisabled}>
						{actionLabel}
					</Button>
				</div>
			</div>
		</main>
	);
}
