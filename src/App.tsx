import { useState } from "react";
import appleIcon from "./assets/apple.svg";
import googleIcon from "./assets/google.svg";
import kakaoIcon from "./assets/kakao.svg";
import "./App.css";

type SocialProvider = "kakao" | "google" | "apple";

const SOCIAL_PROVIDERS: {
	id: SocialProvider;
	label: string;
	shortLabel: string;
	icon: string;
}[] = [
	{
		id: "kakao",
		label: "카카오로 계속하기",
		shortLabel: "카카오",
		icon: kakaoIcon,
	},
	{
		id: "google",
		label: "Google로 계속하기",
		shortLabel: "Google",
		icon: googleIcon,
	},
	{
		id: "apple",
		label: "Apple로 계속하기",
		shortLabel: "Apple",
		icon: appleIcon,
	},
];

function App() {
	const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
		null,
	);
	const [notice, setNotice] = useState("");

	const handleSocialLogin = (provider: SocialProvider) => {
		setLoadingProvider(provider);
		setNotice("");
		console.log(`${provider} login`);

		window.setTimeout(() => {
			setLoadingProvider(null);
			setNotice("SNS 로그인 연동 전 UI 확인용 상태입니다.");
		}, 700);
	};

	const handleTermsClick = (type: "terms" | "privacy") => {
		console.log(`${type} clicked`);
	};

	return (
		<main className="login-page">
			<section className="login-screen" aria-labelledby="login-title">
				<div className="login-hero">
					<div className="brand-copy">
						<h1 id="login-title">SeenBy</h1>
						<p>나에 대한 새로운 인사이트</p>
					</div>
				</div>

				<div className="login-actions">
					<div className="social-login-list">
						{SOCIAL_PROVIDERS.map((provider) => {
							const isLoading = loadingProvider === provider.id;
							const buttonLabel =
								provider.id === "kakao" ? provider.label : provider.shortLabel;

							return (
								<button
									className={`social-login-button ${provider.id}`}
									disabled={loadingProvider !== null}
									key={provider.id}
									onClick={() => handleSocialLogin(provider.id)}
									type="button"
								>
									<img
										alt=""
										aria-hidden="true"
										className="social-icon"
										src={provider.icon}
									/>
									<span>{isLoading ? "연결 준비 중..." : buttonLabel}</span>
								</button>
							);
						})}
					</div>

					{notice && (
						<p className="login-notice" role="status">
							{notice}
						</p>
					)}

					<p className="terms">
						<button type="button" onClick={() => handleTermsClick("terms")}>
							이용약관
						</button>
						<span aria-hidden="true"> 및 </span>
						<button type="button" onClick={() => handleTermsClick("privacy")}>
							개인정보처리방침
						</button>
					</p>
				</div>
			</section>
		</main>
	);
}

export default App;
