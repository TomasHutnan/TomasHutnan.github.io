import type { CollectionEntry } from 'astro:content';
import { slugify } from './slug';

export interface TagStat {
	tag: string;
	slug: string;
	count: number;
}

export interface TagCloudItem extends TagStat {
	x: number;
	y: number;
	width: number;
	height: number;
	fontSize: number;
}

function estimateTagBox(tag: string, fontSize: number) {
	const width = Math.max(72, tag.length * fontSize * 0.62 + 28);
	const height = Math.max(36, fontSize * 1.55 + 18);

	return { width, height };
}

function overlaps(left: { x: number; y: number; width: number; height: number }, right: { x: number; y: number; width: number; height: number }, gap = 0.8) {
	return !(
		left.x + left.width / 2 + gap <= right.x - right.width / 2 ||
		left.x - left.width / 2 - gap >= right.x + right.width / 2 ||
		left.y + left.height / 2 + gap <= right.y - right.height / 2 ||
		left.y - left.height / 2 - gap >= right.y + right.height / 2
	);
}

function spiralPoint(step: number) {
	const angle = step * 0.52;
	const radius = 18 * Math.sqrt(step);

	return {
		x: radius * Math.cos(angle),
		y: radius * Math.sin(angle)
	};
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

export function buildTagCloud(projects: CollectionEntry<'projects'>[]) {
	const tags = collectTagStats(projects);
	const maxCount = tags[0]?.count ?? 1;
	const placed: Array<{ x: number; y: number; width: number; height: number }> = [];
	const rawItems = tags.map((tag) => {
		const fontSize = 15 + (tag.count / maxCount) * 18;
		const { width, height } = estimateTagBox(tag.tag, fontSize);

		return {
			...tag,
			fontSize,
			width,
			height
		};
	});

	const sortedItems = [...rawItems].sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag));
	const positioned = sortedItems.map((item, index) => {
		let candidate = { x: 0, y: 0 };
		let found = false;

		for (let step = 0; step < 2500; step += 1) {
			const point = step === 0 ? { x: 0, y: 0 } : spiralPoint(step + index * 7);
			candidate = { x: point.x, y: point.y };
			const testBox = { ...candidate, width: item.width, height: item.height };

			if (placed.every((existing) => !overlaps(testBox, existing))) {
				placed.push(testBox);
				found = true;
				break;
			}
		}

		if (!found) {
			placed.push({ x: candidate.x, y: candidate.y, width: item.width, height: item.height });
		}

		return {
			...item,
			x: candidate.x,
			y: candidate.y
		};
	});

	const minX = Math.min(...placed.map((item) => item.x - item.width / 2));
	const maxX = Math.max(...placed.map((item) => item.x + item.width / 2));
	const minY = Math.min(...placed.map((item) => item.y - item.height / 2));
	const maxY = Math.max(...placed.map((item) => item.y + item.height / 2));
	const padding = 2.5;
	const width = Math.max(80, maxX - minX + padding * 2);
	const height = Math.max(48, maxY - minY + padding * 2);
	const offsetX = -minX + padding;
	const offsetY = -minY + padding;

	return {
		width,
		height,
		items: positioned.map((item) => {
			return {
				...item,
				x: item.x + offsetX,
				y: item.y + offsetY
			} satisfies TagCloudItem;
		})
	};
}