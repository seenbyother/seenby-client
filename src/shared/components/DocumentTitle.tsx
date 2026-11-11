import { useEffect } from "react";
import { matchPath, useLocation } from "react-router";

type TitleRoute = {
	path: string;
	label: string;
};

const TITLE_ROUTES: TitleRoute[] = [
	{ path: "/login", label: "로그인" },
	{ path: "/auth/callback", label: "로그인 처리 중" },
	{ path: "/auth/success", label: "로그인 완료" },
	{ path: "/forbidden", label: "접근 제한" },
	{ path: "/feedback", label: "피드백 작성" },
	{ path: "/onboarding", label: "시작하기" },
	{ path: "/mypage", label: "마이페이지" },
	{ path: "/settings/notifications", label: "알림 설정" },
	{ path: "/feedback/detail/:answerId", label: "피드백 상세" },
	{ path: "/analysis", label: "AI 분석 내역" },
	{ path: "/analysis/ai/preview", label: "AI 분석 미리보기" },
	{ path: "/analysis/ai/:analysisId", label: "AI 분석" },
	{ path: "/cover-letters/:coverLetterId", label: "AI 자기소개서" },
	{ path: "/groups", label: "피드백 그룹" },
	{ path: "/groups/:groupId/analysis/result", label: "그룹 분석 결과" },
	{ path: "/groups/:groupId/analysis", label: "그룹 분석" },
	{ path: "/groups/:groupId", label: "그룹 상세" },
	{ path: "/feedback-group/create", label: "그룹 만들기" },
	{ path: "/feedback-groups/new", label: "그룹 만들기" },
];

export function DocumentTitle() {
	const { pathname } = useLocation();

	useEffect(() => {
		document.title = getDocumentTitle(pathname);
	}, [pathname]);

	return null;
}

function getDocumentTitle(pathname: string) {
	if (pathname === "/" || pathname === "/home") {
		return "SeenBy";
	}

	const route = TITLE_ROUTES.find(({ path }) =>
		matchPath({ path, end: true }, pathname),
	);

	return route ? `${route.label} | SeenBy` : "SeenBy";
}
