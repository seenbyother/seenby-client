import appleIcon from "@/assets/apple.svg";
import googleIcon from "@/assets/google.svg";
import kakaoIcon from "@/assets/kakao.svg";
import { startKakaoLogin } from "@/features/auth/api";
import "./LoginPage.css";

type SocialPlatform = "kakao" | "google" | "apple";

const SOCIAL_PLATFORMS: {
	id: SocialPlatform;
	label: string;
	shortLabel: string;
	icon: string;
	isVisible: boolean;
}[] = [
	{
		id: "kakao",
		label: "카카오로 계속하기",
		shortLabel: "카카오",
		icon: kakaoIcon,
		isVisible: true,
	},
	{
		id: "google",
		label: "Google로 계속하기",
		shortLabel: "Google",
		icon: googleIcon,
		isVisible: false,
	},
	{
		id: "apple",
		label: "Apple로 계속하기",
		shortLabel: "Apple",
		icon: appleIcon,
		isVisible: false,
	},
];

const VISIBLE_SOCIAL_PLATFORMS = SOCIAL_PLATFORMS.filter(
	(platform) => platform.isVisible,
);

function LoginPage() {
	const handleSocialLogin = (platform: SocialPlatform) => {
		if (platform === "kakao") {
			startKakaoLogin();
		}
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
						{VISIBLE_SOCIAL_PLATFORMS.map((platform) => {
							const buttonLabel =
								platform.id === "kakao" ? platform.label : platform.shortLabel;

							return (
								<button
									className={`social-login-button ${platform.id}`}
									key={platform.id}
									onClick={() => handleSocialLogin(platform.id)}
									type="button"
								>
									<img
										alt=""
										aria-hidden="true"
										className="social-icon"
										src={platform.icon}
									/>
									<span>{buttonLabel}</span>
								</button>
							);
						})}
					</div>

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

export default LoginPage;
