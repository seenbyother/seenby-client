import { useNavigate, useLocation } from "react-router";
import IcFeedback from "@/assets/icons/ic_person.svg?react";
import IcHome from "@/assets/icons/ic_home.svg?react";
import IcGroups from "@/assets/icons/ic_groups.svg?react";

type TabKey = "analysis" | "home" | "groups";

const TAB_ROUTES: Record<TabKey, string> = {
	analysis: "/analysis",
	home: "/",
	groups: "/groups",
};

const TABS: { key: TabKey; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
	{ key: "analysis", Icon: IcFeedback },
	{ key: "home", Icon: IcHome },
	{ key: "groups", Icon: IcGroups },
];

function getActiveTab(pathname: string): TabKey {
	if (pathname.startsWith("/analysis")) return "analysis";
	if (pathname.startsWith("/groups")) return "groups";
	return "home";
}

export function BottomNavigation() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const activeTab = getActiveTab(pathname);

	return (
		<nav className="fixed bottom-0 left-0 right-0 flex justify-center pb-2">
			<div
				className="flex justify-between items-center px-[30px] py-2 rounded-[100px] w-full mx-5"
				style={{ background: "rgba(214,214,214,0.1)" }}
			>
				{TABS.map(({ key, Icon }) => {
					const isActive = activeTab === key;
					return (
						<button
							key={key}
							type="button"
							onClick={() => navigate(TAB_ROUTES[key])}
							className="flex justify-center items-center w-[95px] h-[69px] rounded-[45px] border-none bg-transparent cursor-pointer"
							style={isActive ? { background: "rgba(85,85,85,0.1)" } : undefined}
						>
							<div
								className="flex justify-center items-center w-[50px] h-[50px] rounded-[35px] bg-white shadow-[2px_4px_15px_0px_rgba(0,0,0,0.05)]"
								style={{ color: isActive ? "#0073FF" : "#000000" }}
							>
								<Icon />
							</div>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
