import type { CollectionEntry } from 'astro:content';
import { slugify } from './slug';

export interface TagStat {
	tag: string;
	slug: string;
	count: number;
}

export interface TagCloudOptions {
	minFontSize?: number;
	maxFontSize?: number;
}

export function getTagCloudFontSize(count: number, maxCount: number, options: TagCloudOptions = {}) {
	const minFontSize = options.minFontSize ?? 15;
	const maxFontSize = options.maxFontSize ?? 33;
	const ratio = maxCount <= 1 ? 0 : (count - 1) / (maxCount - 1);

	return minFontSize + ratio * (maxFontSize - minFontSize);
}

export function collectTagStats(projects: CollectionEntry<'projects'>[]): TagStat[] {
	const counts = new Map<string, { tag: string; count: number }>();

	for (const project of projects) {
		for (const tag of project.data.tags) {
			const slug = slugify(tag);
			const existing = counts.get(slug);

			if (existing) {
				existing.count += 1;
			} else {
				counts.set(slug, { tag, count: 1 });
			}
		}
	}

	return [...counts.entries()]
		.map(([slug, entry]) => ({ tag: entry.tag, slug, count: entry.count }))
		.sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag));
}