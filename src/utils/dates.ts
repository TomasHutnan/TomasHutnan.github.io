// Frontmatter dates parse as UTC midnight. Formatting them in UTC keeps the
// output the same on every machine; a local timezone west of UTC would shift
// them to the previous day, and sometimes the previous month.
const LOCALE = "en-US";
const TIME_ZONE = "UTC";

export function formatMonthYear(date: Date): string {
	return date.toLocaleDateString(LOCALE, {
		month: "short",
		year: "numeric",
		timeZone: TIME_ZONE,
	});
}

function formatMonth(date: Date): string {
	return date.toLocaleDateString(LOCALE, {
		month: "short",
		timeZone: TIME_ZONE,
	});
}

export function formatDateRange(start?: Date, end?: Date): string {
	if (!start) return "";
	if (!end) return `${formatMonthYear(start)} — In progress`;

	if (start.getUTCFullYear() !== end.getUTCFullYear()) {
		return `${formatMonthYear(start)} — ${formatMonthYear(end)}`;
	}
	if (start.getUTCMonth() !== end.getUTCMonth()) {
		return `${formatMonth(start)} — ${formatMonthYear(end)}`;
	}
	return formatMonthYear(start);
}
