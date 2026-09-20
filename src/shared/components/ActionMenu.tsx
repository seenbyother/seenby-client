import { useEffect, useId, useRef, useState } from "react";
import IcKebab from "@/assets/icons/ic_kebab.svg?react";

export type ActionMenuItem = {
	label: string;
	onSelect: () => void;
	destructive?: boolean;
	disabled?: boolean;
};

export function ActionMenu({ items }: { items: ActionMenuItem[] }) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const menuId = useId();

	useEffect(() => {
		if (!isOpen) return;

		const closeOnOutsideClick = (event: PointerEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("pointerdown", closeOnOutsideClick);
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.removeEventListener("pointerdown", closeOnOutsideClick);
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		itemRefs.current.find((item) => item && !item.disabled)?.focus();
	}, [isOpen]);

	const closeMenu = () => {
		setIsOpen(false);
		window.requestAnimationFrame(() => triggerRef.current?.focus());
	};

	const moveFocus = (currentIndex: number, direction: 1 | -1) => {
		for (let offset = 1; offset <= items.length; offset += 1) {
			const nextIndex =
				(currentIndex + direction * offset + items.length) % items.length;
			const nextItem = itemRefs.current[nextIndex];
			if (nextItem && !nextItem.disabled) {
				nextItem.focus();
				return;
			}
		}
	};

	return (
		<div ref={containerRef} className="relative z-50">
			<button
				ref={triggerRef}
				type="button"
				aria-label="더보기"
				aria-expanded={isOpen}
				aria-controls={menuId}
				onClick={() => setIsOpen((open) => !open)}
				className="flex h-8 w-8 items-center justify-center rounded-full border-0 bg-transparent p-0 active:bg-black/5"
			>
				<IcKebab aria-hidden="true" />
			</button>

			{isOpen ? (
				<div
					id={menuId}
					role="menu"
					className="absolute right-0 top-11 z-[60] w-[152px] overflow-hidden rounded-[14px] border border-[#ECEEF1] bg-white py-1 shadow-[0_10px_28px_rgba(15,23,42,0.14)]"
				>
					{items.map((item, index) => (
						<button
							key={item.label}
							ref={(element) => {
								itemRefs.current[index] = element;
							}}
							type="button"
							role="menuitem"
							disabled={item.disabled}
							onKeyDown={(event) => {
								if (event.key === "ArrowDown" || event.key === "ArrowUp") {
									event.preventDefault();
									moveFocus(index, event.key === "ArrowDown" ? 1 : -1);
								}
								if (event.key === "Escape") {
									event.preventDefault();
									closeMenu();
								}
							}}
							onClick={() => {
								setIsOpen(false);
								item.onSelect();
							}}
							className={`flex h-11 w-full items-center border-0 bg-white px-4 text-left text-[14px] font-semibold active:bg-[#F6F7F8] disabled:opacity-50 ${
								item.destructive
									? `${index > 0 ? "border-t border-[#F0F1F3]" : ""} text-[#E5484D]`
									: "text-[#222222]"
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
