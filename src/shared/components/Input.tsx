interface InputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
}

export function Input({ value, onChange, placeholder, type = "text" }: InputProps) {
	return (
		<input
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className="w-full h-[52px] rounded-xl bg-[#F3F4F6] border-2 border-transparent focus:border-[rgba(0,115,255,0.62)] outline-none text-[20px] font-medium leading-[150%] text-black placeholder:text-[#9CA3AF] transition-colors"
			style={{ paddingTop: 8, paddingBottom: 11, paddingLeft: 16, paddingRight: 16 }}
		/>
	);
}
