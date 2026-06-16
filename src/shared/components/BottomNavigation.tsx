import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import FeedbackIcon from "@/assets/bottombar/feedback.svg?react";
import HomeIcon from "@/assets/bottombar/home.svg?react";
import ReportIcon from "@/assets/bottombar/report.svg?react";

export type BottomNavigationTab = "report" | "home" | "feedback";

interface BottomNavigationProps {
	activeTab?: BottomNavigationTab;
	onTabChange?: (tab: BottomNavigationTab) => void;
}

const navigationItems: {
	tab: BottomNavigationTab;
	ariaLabel: string;
	icon: React.ReactNode;
}[] = [
	{
		tab: "report",
		ariaLabel: "보고서",
		icon: <ReportIcon aria-hidden="true" />,
	},
	{
		tab: "home",
		ariaLabel: "홈",
		icon: <HomeIcon aria-hidden="true" />,
	},
	{
		tab: "feedback",
		ariaLabel: "피드백",
		icon: <FeedbackIcon aria-hidden="true" />,
	},
];

const DEFAULT_INDICATOR_STEP = 103.5;
const ROUTE_CHANGE_DELAY_MS = 180;

export function BottomNavigation({
	activeTab = "home",
	onTabChange,
}: BottomNavigationProps) {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(activeTab);
	const routeChangeTimerRef = useRef<number | null>(null);
	const selectedIndex = navigationItems.findIndex(
		(item) => item.tab === selectedTab,
	);
	const indicatorOffset = Math.max(selectedIndex, 0) * DEFAULT_INDICATOR_STEP;

	useEffect(() => {
		setSelectedTab(activeTab);
	}, [activeTab]);

	useEffect(() => {
		return () => {
			if (routeChangeTimerRef.current !== null) {
				window.clearTimeout(routeChangeTimerRef.current);
			}
		};
	}, []);

	const navigateAfterIndicatorMoves = (path: string) => {
		if (routeChangeTimerRef.current !== null) {
			window.clearTimeout(routeChangeTimerRef.current);
		}

		routeChangeTimerRef.current = window.setTimeout(() => {
			navigate(path);
			routeChangeTimerRef.current = null;
		}, ROUTE_CHANGE_DELAY_MS);
	};

	const selectTab = (tab: BottomNavigationTab) => {
		if (tab === selectedTab) {
			return;
		}

		setSelectedTab(tab);

		if (onTabChange) {
			onTabChange(tab);
			return;
		}

		if (tab === "home") {
			navigateAfterIndicatorMoves("/home");
		}

		if (tab === "report") {
			navigateAfterIndicatorMoves("/analysis");
		}

		if (tab === "feedback") {
			navigateAfterIndicatorMoves("/groups");
		}
	};

	return (
		<nav
			aria-label="하단 내비게이션"
			className="fixed bottom-[25px] left-1/2 z-50 isolate flex h-[85px] w-[min(362px,calc(100%-40px))] -translate-x-1/2 select-none items-center justify-between overflow-hidden rounded-full border border-white/35 bg-white/25 px-[30px] py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl"
		>
			<div
				aria-hidden="true"
				className="absolute left-[30px] top-2 h-[69px] w-[95px] rounded-[45px] bg-[#555555]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-14px_24px_rgba(255,255,255,0.24),0_16px_30px_rgba(15,23,42,0.10)] transition-transform duration-300 ease-out"
				style={{ transform: `translateX(${indicatorOffset}px)` }}
			/>
			{navigationItems.map((item) => (
				<NavItem
					key={item.tab}
					ariaLabel={item.ariaLabel}
					selected={selectedTab === item.tab}
					onClick={() => selectTab(item.tab)}
				>
					{item.icon}
				</NavItem>
			))}
		</nav>
	);
}

interface NavItemProps {
	ariaLabel: string;
	children: React.ReactNode;
	selected: boolean;
	onClick: () => void;
}

function NavItem({ ariaLabel, children, selected, onClick }: NavItemProps) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			aria-current={selected ? "page" : undefined}
			onClick={onClick}
			className="relative z-10 flex h-[69px] w-[95px] items-center justify-center rounded-[45px] border-0 bg-transparent p-[10px]"
		>
			<span
				className={[
					"flex h-[50px] w-[50px] items-center justify-center rounded-full transition-all duration-300 ease-out",
					selected
						? "bg-white text-[#0073FF] shadow-[0_10px_22px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
						: "bg-white/72 text-[#222222] shadow-[0_8px_18px_rgba(15,23,42,0.08)]",
				].join(" ")}
			>
				{children}
			</span>
		</button>
	);
}
