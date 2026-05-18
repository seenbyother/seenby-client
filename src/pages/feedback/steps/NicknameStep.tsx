import { Button, Input, ProgressBar } from "@/shared/components";

interface NicknameStepProps {
	nickname: string;
	onChange: (value: string) => void;
	onNext: () => void;
}

export function NicknameStep({ nickname, onChange, onNext }: NicknameStepProps) {
	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<div className="px-5 pt-8">
				<ProgressBar step={1} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1">
				<div className="flex flex-col gap-2">
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black m-0">
						닉네임을 입력해주세요
					</p>
					<p className="text-[16px] font-medium leading-[150%] text-[#71717A] m-0">
						아래의 이름으로 피드백이 전송돼요.
					</p>
				</div>

				<div className="mt-[42px]">
					<Input value={nickname} onChange={onChange} placeholder="닉네임을 입력해주세요" />
				</div>
			</div>

			<div className="px-5 pb-8">
				<Button onClick={onNext} disabled={!nickname.trim()}>
					다음
				</Button>
			</div>
		</div>
	);
}
