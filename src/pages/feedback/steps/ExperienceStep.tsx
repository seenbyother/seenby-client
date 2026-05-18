import { Button, ProgressBar } from "@/shared/components";

interface ExperienceStepProps {
	recipientName: string;
	experiences: string[];
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
	onNext: () => void;
}

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${el.scrollHeight}px`;
}

export function ExperienceStep({ recipientName, experiences, onChange, onAdd, onNext }: ExperienceStepProps) {
	const hasContent = experiences.some((e) => e.trim().length > 0);

	return (
		<div className="min-h-screen flex flex-col bg-white text-left">
			<div className="px-5 pt-8">
				<ProgressBar step={5} totalSteps={6} />
			</div>

			<div className="px-5 pt-[42px] flex-1">
				<div className="flex flex-col gap-2">
					<p className="text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black m-0">
						{recipientName} 님과 함께한
						<br />
						경험을 나눠주세요.
					</p>
					<p className="text-[16px] font-medium leading-[150%] text-[#71717A] m-0">
						감정이나 생각은 제외하고 객관적인 사실만 작성해주세요.
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-3">
					{experiences.map((exp, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: ordered list items
						<div key={index} className="flex items-start gap-[13px] px-1">
							<span className="text-[20px] font-medium leading-[150%] text-black w-[18px] shrink-0 mt-0.5">
								{index + 1}.
							</span>
							<div className="flex flex-col flex-1">
								<textarea
									value={exp}
									onChange={(e) => {
										onChange(index, e.target.value);
										autoResize(e.target);
									}}
									placeholder="-"
									rows={1}
									className="w-full resize-none overflow-hidden text-[20px] font-medium leading-[150%] text-black placeholder:text-[#D9D9D9] bg-transparent outline-none border-none"
									style={{ height: "auto" }}
								/>
								<div className="h-[2px] bg-[#D9D9D9]" />
							</div>
						</div>
					))}
				</div>

				<div className="mt-4 flex justify-center">
					<button
						type="button"
						onClick={onAdd}
						className="w-[30px] h-[30px] rounded-full bg-[rgba(0,115,255,0.05)] flex items-center justify-center text-[#0073FF] text-xl leading-none cursor-pointer border-none outline-none"
					>
						+
					</button>
				</div>
			</div>

			<div className="px-5 pb-8 flex flex-col gap-2">
				<button
					type="button"
					className="text-[14px] font-medium leading-[150%] text-[#475569] underline self-center bg-transparent border-none cursor-pointer outline-none"
				>
					어떻게 작성하는지 모르겠어요
				</button>
				<Button onClick={onNext} disabled={!hasContent}>
					다음
				</Button>
			</div>
		</div>
	);
}
