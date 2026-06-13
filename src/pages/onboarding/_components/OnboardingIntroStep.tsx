import mascotHeart from "@/assets/images/ch_heart.png";
import { OnboardingLayout } from "./OnboardingLayout";

interface OnboardingIntroStepProps {
	userName: string;
	onStart: () => void;
}

export function OnboardingIntroStep({
	userName,
	onStart,
}: OnboardingIntroStepProps) {
	return (
		<OnboardingLayout
			actionLabel="시작하기"
			onAction={onStart}
			contentClassName="flex flex-col items-center pt-[118px]"
		>
			<section
				className="w-full text-center"
				aria-labelledby="onboarding-intro-title"
			>
				<p className="m-0 text-[24px] font-semibold leading-[160%] tracking-[-0.02em] text-[#374151]">
					{userName} 님이 생각하는
				</p>
				<h1
					id="onboarding-intro-title"
					className="m-0 text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-[#030712]"
				>
					‘진짜 나’는 어떤 모습인가요?
				</h1>
				<p className="mt-3 mb-0 text-[16px] font-medium leading-[150%] text-[#71717A]">
					나 자신을 설명할 때 떠오르는 단어를 선택해 주세요
				</p>
			</section>

			<img
				src={mascotHeart}
				alt=""
				aria-hidden="true"
				className="mt-[86px] h-[168px] w-[168px] object-contain"
			/>
		</OnboardingLayout>
	);
}
