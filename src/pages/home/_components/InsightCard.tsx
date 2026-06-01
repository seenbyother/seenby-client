import heartCharacter from "@/assets/home/heart.png";

const receivedTags = ["#신중함", "#부지런함", "#상냥한"];

export function InsightCard() {
	return (
		<div className="flex min-h-[153px] items-center justify-between rounded-[20px] bg-[rgba(0,115,255,0.05)] px-[28px] py-4">
			<div className="min-w-0">
				<p className="m-0 text-[12px] font-medium leading-normal">
					민경님의 가장 잘 나타내는 모습은
				</p>
				<strong className="mt-2 block text-[38px] font-bold leading-none text-[#0073FF]">
					꼼꼼함
				</strong>
				<div className="mt-3 flex flex-wrap gap-1">
					{receivedTags.map((tag) => (
						<span
							key={tag}
							className="rounded-[10px] bg-white px-1 py-1 text-[12px] font-bold leading-none text-black/50"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
			<img
				src={heartCharacter}
				alt=""
				className="h-[121px] w-[98px] shrink-0 object-contain object-center"
			/>
		</div>
	);
}
