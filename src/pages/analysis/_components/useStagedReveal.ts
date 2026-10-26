import { useEffect, useState } from "react";

/**
 * Mount 직후 두 프레임을 기다렸다가 CSS transition을 시작합니다.
 * 컴포넌트가 사라질 때 예약된 모든 프레임도 함께 정리합니다.
 */
export function useStagedReveal(animated: boolean): boolean {
	const [revealed, setRevealed] = useState(!animated);

	useEffect(() => {
		if (!animated) {
			setRevealed(true);
			return;
		}

		setRevealed(false);
		let secondFrame: number | undefined;
		const firstFrame = requestAnimationFrame(() => {
			secondFrame = requestAnimationFrame(() => setRevealed(true));
		});

		return () => {
			cancelAnimationFrame(firstFrame);
			if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
		};
	}, [animated]);

	return revealed;
}
