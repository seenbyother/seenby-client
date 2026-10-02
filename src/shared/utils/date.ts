type DateParts = {
	year: number;
	month: string;
	day: string;
};

function getDateParts(dateStr: string): DateParts | null {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return null;

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return { year, month, day };
}

export function formatYearMonth(dateStr: string) {
	const parts = getDateParts(dateStr);
	return parts ? `${parts.year}.${parts.month}` : "";
}

export function formatYearMonthDay(dateStr: string) {
	const parts = getDateParts(dateStr);
	return parts ? `${parts.year}.${parts.month}.${parts.day}` : "";
}

export function formatKoreanDate(dateStr: string) {
	const parts = getDateParts(dateStr);
	return parts ? `${parts.year}년 ${parts.month}월 ${parts.day}일` : "";
}
