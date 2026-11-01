import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

type Project = CollectionEntry<"projects">;

export type GalleryItem =
	| { kind: "image"; image: ImageMetadata; alt: string }
	| { kind: "video"; sources: string[]; poster: ImageMetadata; alt: string }
	| { kind: "youtube"; videoId: string; poster: ImageMetadata; alt: string };

export function getProjectHref(project: Project): string {
	return `/projects/${project.id}/`;
}

function getRecencyTime(project: Project): number {
	const date = project.data.completedAt ?? project.data.startedAt;
	return date?.getTime() ?? 0;
}

export function sortProjectsByRecency(projects: Project[]): Project[] {
	return projects.toSorted(
		(left, right) => getRecencyTime(right) - getRecencyTime(left),
	);
}

export function getFeaturedProjects(projects: Project[]): Project[] {
	return projects
		.filter((project) => project.data.featured)
		.toSorted(
			(left, right) =>
				(left.data.featuredOrder ?? 0) -
				(right.data.featuredOrder ?? 0),
		);
}

export function getYouTubeVideoId(url?: string): string | undefined {
	if (!url) return undefined;

	const { hostname, pathname, searchParams } = new URL(url);
	if (hostname === "youtu.be") return pathname.slice(1) || undefined;
	if (hostname.endsWith("youtube.com")) {
		return searchParams.get("v") ?? undefined;
	}
	return undefined;
}

export function getGalleryItems(project: Project): GalleryItem[] {
	const { title, demo, cover, gallery } = project.data;
	const items: GalleryItem[] = [];

	const videoId = getYouTubeVideoId(demo);
	if (videoId) {
		// Covers can be tight crops meant for cards, too small for the full stage.
		const firstImage = gallery.find((item) => "image" in item)?.image;
		items.push({
			kind: "youtube",
			videoId,
			poster: firstImage ?? cover,
			alt: `${title} demo video`,
		});
	}

	for (const item of gallery) {
		if ("image" in item) {
			items.push({ kind: "image", image: item.image, alt: item.alt });
			continue;
		}
		items.push({
			kind: "video",
			sources: item.video,
			poster: item.poster,
			alt: item.alt,
		});
	}

	return items;
}
