declare global {
	interface Window {
		Kakao: {
			isInitialized(): boolean;
			init(key: string): void;
			Share: {
				sendCustom(options: {
					templateId: number;
					templateArgs?: Record<string, string>;
				}): void;
			};
		};
	}
}

function initKakao(): boolean {
	const key = import.meta.env.VITE_KAKAO_APP_KEY as string | undefined;

	if (!key) {
		console.error("[Kakao] VITE_KAKAO_APP_KEY가 설정되지 않았습니다.");
		return false;
	}

	if (!window.Kakao) {
		console.error("[Kakao] Kakao SDK가 로드되지 않았습니다. index.html 스크립트를 확인하세요.");
		return false;
	}

	if (!window.Kakao.isInitialized()) {
		window.Kakao.init(key);
	}

	return window.Kakao.isInitialized();
}

export function shareToKakaoWithTemplate(templateId: number, templateArgs: Record<string, string>) {
	try {
		if (!initKakao()) return;
		window.Kakao.Share.sendCustom({ templateId, templateArgs });
	} catch (error) {
		console.error("[Kakao] 공유 실패:", error);
	}
}
