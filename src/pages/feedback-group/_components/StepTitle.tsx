interface StepTitleProps {
	title: string;
	description: string;
}

export function StepTitle({ title, description }: StepTitleProps) {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="m-0 text-[28px] font-semibold leading-[160%] tracking-[-0.02em] text-black">
				{title}
			</h1>
			<p className="m-0 text-[16px] font-medium leading-[150%] text-[#71717A]">
				{description}
			</p>
		</div>
	);
}
