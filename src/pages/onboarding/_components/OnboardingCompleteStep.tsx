import mascotReady from "@/assets/images/character_cheer.png";
import { OnboardingLayout } from "./OnboardingLayout";

interface OnboardingCompleteStepProps {
	userName: string;
	onStart: () => void;
}

export function OnboardingCompleteStep({
	userName,
	onStart,
}: OnboardingCompleteStepProps) {
	return (
		<OnboardingLayout
			actionLabel="시작하기"
			onAction={onStart}
			contentClassName="flex flex-col items-center pt-[118px]"
		>
			<section
				className="w-full text-center"
				aria-labelledby="onboarding-complete-title"
			>
				<p className="m-0 text-[24px] font-semibold leading-[160%] tracking-[-0.02em] text-[#374151]">
					나를 알아갈 준비가 끝났어요
				</p>
				<h1
					id="onboarding-complete-title"
					className="m-0 whitespace-pre-line break-keep text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-[#030712]"
				>
					{`${userName} 님의 새로운 인사이트를\n찾으러 가볼까요?`}
				</h1>
			</section>

			<img
				src={mascotReady}
				alt=""
				aria-hidden="true"
				className="mt-[86px] h-[168px] w-[208px] object-contain"
			/>
		</OnboardingLayout>
	);
}
