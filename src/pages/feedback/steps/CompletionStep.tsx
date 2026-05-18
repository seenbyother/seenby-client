import characterCheer from "@/assets/images/character_cheer.png";
import { Button } from "@/shared/components";

interface CompletionStepProps {
	recipientName: string;
	groupName: string;
	onDone: () => void;
}

export function CompletionStep({ recipientName, groupName, onDone }: CompletionStepProps) {
	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<div className="flex-1 flex flex-col items-center justify-center">
				<div className="flex flex-col items-center gap-[43px] w-[250px]">
					<div className="flex flex-col gap-2 text-center w-full">
						<p className="text-[24px] font-semibold leading-[160%] tracking-[-0.02em] text-[#374151] m-0">
							{groupName}
						</p>
						<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-[#030712] m-0 whitespace-pre-line">
							{recipientName} 님에게{"\n"}피드백을 전송했어요
						</p>
					</div>
					<img src={characterCheer} alt="" className="w-[204px] h-[171px] object-cover" />
				</div>
			</div>

			<div className="px-5 pb-8">
				<Button onClick={onDone}>완료</Button>
			</div>
		</div>
	);
}
