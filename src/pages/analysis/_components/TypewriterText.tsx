import { useEffect, useState } from "react";

interface TypewriterTextProps {
	text: string;
	className?: string;
	speed?: number;
}

export function TypewriterText({
	text,
	className,
	speed = 10,
}: TypewriterTextProps) {
	const [displayedLength, setDisplayedLength] = useState(0);

	useEffect(() => {
		setDisplayedLength(0);

		if (!text) {
			return;
		}

		const timer = setInterval(() => {
			setDisplayedLength((prev) => {
				const next = prev + 1;
				if (next >= text.length) {
					clearInterval(timer);
				}
				return next;
			});
		}, speed);

		return () => clearInterval(timer);
	}, [text, speed]);

	return <p className={className}>{text.slice(0, displayedLength)}</p>;
}
