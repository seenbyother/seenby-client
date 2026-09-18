import { useState } from "react";
import IcKebab from "@/assets/icons/ic_kebab.svg?react";

interface KebabMenuItem {
	label: string;
	onClick: () => void;
	destructive?: boolean;
}

interface KebabMenuProps {
	items: KebabMenuItem[];
	ariaLabel?: string;
}

export function KebabMenu({ items, ariaLabel = "더보기" }: KebabMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative shrink-0">
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-label={ariaLabel}
				className="flex h-8 w-8 items-center justify-center bg-transparent border-none p-0 cursor-pointer"
			>
				<IcKebab />
			</button>

			{isOpen ? (
				<>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						aria-label="메뉴 닫기"
						className="fixed inset-0 z-10 bg-transparent border-none p-0 cursor-default"
					/>
					<div className="absolute right-0 top-full z-20 mt-1 w-28 overflow-hidden rounded-[12px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
						{items.map((item) => (
							<button
								key={item.label}
								type="button"
								onClick={() => {
									setIsOpen(false);
									item.onClick();
								}}
								className={[
									"w-full whitespace-nowrap px-4 py-3 text-left text-[14px] font-semibold bg-transparent border-none cursor-pointer",
									item.destructive ? "text-[#FF4D4F]" : "text-black",
								].join(" ")}
							>
								{item.label}
							</button>
						))}
					</div>
				</>
			) : null}
		</div>
	);
}
