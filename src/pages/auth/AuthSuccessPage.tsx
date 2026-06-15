import { Link } from "react-router";
import { useCurrentUser } from "@/features/auth/hooks";
import { getPostLoginRedirectPath } from "@/features/onboarding/routing";
import "./AuthSuccessPage.css";

export function AuthSuccessPage() {
	const { data: currentUser, isError, isLoading } = useCurrentUser();

	if (isLoading) {
		return (
			<AuthSuccessScreen
				title="로그인 확인 중"
				message="온보딩 상태를 확인하고 있어요."
			/>
		);
	}

	if (isError || !currentUser) {
		return (
			<AuthSuccessScreen
				title="로그인 확인 실패"
				message="다시 로그인해 주세요."
				actionPath="/login"
				actionLabel="로그인으로 가기"
			/>
		);
	}

	return (
		<AuthSuccessScreen
			title="로그인 완료"
			message="SeenBy에 정상적으로 로그인되었습니다."
			actionPath={getPostLoginRedirectPath(currentUser)}
			actionLabel="홈으로 가기"
		/>
	);
}

interface AuthSuccessScreenProps {
	title: string;
	message: string;
	actionPath?: string;
	actionLabel?: string;
}

function AuthSuccessScreen({
	title,
	message,
	actionPath,
	actionLabel,
}: AuthSuccessScreenProps) {
	return (
		<main className="auth-success-page">
			<section
				className="auth-success-screen"
				aria-labelledby="auth-success-title"
			>
				<div className="auth-success-content">
					<div className="auth-success-mark" aria-hidden="true">
						✓
					</div>
					<h1 id="auth-success-title">{title}</h1>
					<p>{message}</p>
					{actionPath && actionLabel ? (
						<Link className="auth-success-action" to={actionPath}>
							{actionLabel}
						</Link>
					) : null}
				</div>
			</section>
		</main>
	);
}
