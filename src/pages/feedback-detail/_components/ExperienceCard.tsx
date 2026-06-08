import type { ExperienceFeedback } from "@/pages/feedback-detail/types";

interface ExperienceCardProps {
	experienceFeedback: ExperienceFeedback;
	recipientName: string;
}

export function ExperienceCard({
	experienceFeedback,
	recipientName,
}: ExperienceCardProps) {
	const experienceNumber = experienceFeedback.displayOrder + 1;

	return (
		<article className="rounded-[20px] bg-white p-4">
			<h2 className="m-0 text-center text-[16px] font-bold leading-normal">
				{recipientName} 님과 함께한 경험 {experienceNumber}
			</h2>
			<div className="mt-5 flex flex-col gap-5">
				<TextBlock
					label={`경험 ${experienceNumber}`}
					text={experienceFeedback.experience}
				/>
				<TextBlock
					label={`경험 ${experienceNumber}에 대한 생각`}
					text={experienceFeedback.feedback}
				/>
			</div>
		</article>
	);
}

interface TextBlockProps {
	label: string;
	text: string;
}

function TextBlock({ label, text }: TextBlockProps) {
	return (
		<div className="flex flex-col gap-1">
			<p className="m-0 text-[14px] font-semibold leading-[1.252] text-[#656565]">
				{label}
			</p>
			<p className="m-0 break-keep text-[16px] font-normal leading-[1.252] text-black">
				{text}
			</p>
		</div>
	);
}
