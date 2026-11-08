import type { SearchEntry } from "../utils/search-index";

/** Lowercase without accents, so "tomas" finds "Tomáš". */
export function normalize(text: string): string {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
}

export interface PreparedEntry {
	entry: SearchEntry;
	title: string;
	detail: string;
	keywords: string;
}

export function prepare(entries: SearchEntry[]): PreparedEntry[] {
	return entries.map((entry) => ({
		entry,
		title: normalize(entry.title),
		detail: normalize(entry.detail),
		keywords: normalize(entry.keywords),
	}));
}

const KIND_BONUS: Record<SearchEntry["kind"], number> = {
	project: 3,
	page: 2,
	tag: 1,
	award: 0,
};

function wordStartsWith(text: string, term: string) {
	return text.startsWith(term) || text.includes(` ${term}`);
}

/**
 * Every word of the query has to appear somewhere in the entry. Hits in the
 * title, and at the start of a word, rank above hits deeper in the text.
 */
function score(item: PreparedEntry, terms: string[]): number {
	let total = KIND_BONUS[item.entry.kind];

	for (const term of terms) {
		if (item.title.startsWith(term)) total += 40;
		else if (wordStartsWith(item.title, term)) total += 30;
		else if (item.title.includes(term)) total += 20;
		else if (wordStartsWith(item.keywords, term)) total += 12;
		else if (wordStartsWith(item.detail, term)) total += 8;
		else if (item.keywords.includes(term) || item.detail.includes(term)) {
			total += 3;
		} else {
			return 0;
		}
	}
	return total;
}

export function search(
	items: PreparedEntry[],
	query: string,
	limit = 12,
): SearchEntry[] {
	const terms = normalize(query).split(/\s+/).filter(Boolean);
	if (terms.length === 0) {
		return items
			.filter((item) => item.entry.suggested)
			.map((item) => item.entry);
	}

	return items
		.map((item, index) => ({ item, index, score: score(item, terms) }))
		.filter((result) => result.score > 0)
		.sort(
			(left, right) =>
				right.score - left.score || left.index - right.index,
		)
		.slice(0, limit)
		.map((result) => result.item.entry);
}
