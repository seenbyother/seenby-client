import "./AuthSuccessPage.css";

export function AuthSuccessPage() {
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
					<h1 id="auth-success-title">로그인 완료</h1>
					<p>SeenBy에 정상적으로 로그인되었습니다.</p>
				</div>
			</section>
		</main>
	);
}
