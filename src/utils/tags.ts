import type { CollectionEntry } from "astro:content";
import { TAG_LABELS, type TagSlug } from "../data/tags";

const MIN_CLOUD_FONT_SIZE = 13;
const MAX_CLOUD_FONT_SIZE = 18;
const STRONG_TAG_MIN_COUNT = 4;

export interface TagStat {
	slug: TagSlug;
	label: string;
	count: number;
}

export function getTagHref(slug: string): string {
	return `/projects/?tags=${slug}`;
}

export function isStrongTag(count: number): boolean {
	return count >= STRONG_TAG_MIN_COUNT;
}

export function getTagCloudFontSize(count: number, maxCount: number): number {
	const ratio = maxCount <= 1 ? 0 : (count - 1) / (maxCount - 1);

	return (
		MIN_CLOUD_FONT_SIZE +
		ratio * (MAX_CLOUD_FONT_SIZE - MIN_CLOUD_FONT_SIZE)
	);
}

export function getTagAriaLabel(label: string, count: number): string {
	return `${label} (${count} project${count === 1 ? "" : "s"})`;
}

export function collectTagStats(
	projects: CollectionEntry<"projects">[],
): TagStat[] {
	const counts = new Map<TagSlug, number>();

	for (const project of projects) {
		for (const slug of project.data.tags) {
			counts.set(slug, (counts.get(slug) ?? 0) + 1);
		}
	}

	return [...counts.entries()]
		.map(([slug, count]) => ({ slug, label: TAG_LABELS[slug], count }))
		.sort(
			(left, right) =>
				right.count - left.count ||
				left.label.localeCompare(right.label),
		);
}
