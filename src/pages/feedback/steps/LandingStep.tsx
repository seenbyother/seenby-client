import characterNote from "@/assets/images/character_note.png";
import { Button } from "@/shared/components";

interface LandingStepProps {
	recipientName: string;
	groupName: string;
	onAnonymous: () => void;
	onLogin: () => void;
}

export function LandingStep({ recipientName, groupName, onAnonymous, onLogin }: LandingStepProps) {
	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<div className="flex-1 flex flex-col px-[26px] pt-[156px]">
				<div className="flex flex-col gap-2 text-center">
					<p className="text-[24px] font-semibold leading-[160%] tracking-[-0.02em] text-[#374151] m-0">
						{groupName}
					</p>
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-[#030712] m-0">
						{recipientName} 님이 피드백을 요청했어요
					</p>
				</div>

				<div className="flex justify-center mt-10">
					<img src={characterNote} alt="캐릭터" className="w-[187px] h-[227px] object-contain" />
				</div>
			</div>

			<div className="px-5 pb-8 flex flex-col gap-2">
				<Button onClick={onLogin}>로그인 후 나도 피드백 요청하기</Button>
				<Button variant="secondary" onClick={onAnonymous}>
					로그인 없이 피드백 작성하기
				</Button>
			</div>
		</div>
	);
}
