import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntries } from "astro:content";
import { TAG_LABELS } from "../../data/tags";
import { hero, highlights } from "../../data/home";
import { renderCard, type CardContent } from "../../utils/share-card";

const SITE = "hutnan.dev";
const CARD_TAGS = 3;

/**
 * Share cards, generated at build time: /og/default.png for most pages,
 * /og/projects.png for the project list, and one per project.
 */
export const getStaticPaths = (async () => {
	const projects = await getCollection("projects");

	const projectCards = await Promise.all(
		projects.map(async (project) => {
			const awards = project.data.awards
				? await getEntries(project.data.awards)
				: [];
			const content: CardContent = {
				eyebrow: `${SITE}  ·  Project`,
				title: project.data.title,
				description: project.data.description,
				tags: project.data.tags
					.slice(0, CARD_TAGS)
					.map((slug) => TAG_LABELS[slug]),
				highlights: awards
					.slice(0, 2)
					.map((award) => award.data.shortTitle),
				cover: project.data.cover,
			};
			return {
				params: { slug: `projects/${project.id}` },
				props: content,
			};
		}),
	);

	return [
		{
			params: { slug: "default" },
			props: {
				eyebrow: SITE,
				title: hero.name,
				description: `${hero.title} ${hero.summary}`,
				highlights,
			} satisfies CardContent,
		},
		{
			params: { slug: "projects" },
			props: {
				eyebrow: `${SITE}  ·  Projects`,
				title: "Projects",
				description: `${projects.length} projects across machine learning, games and full-stack systems, from hackathon weekends to semester-long work.`,
			} satisfies CardContent,
		},
		...projectCards,
	];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
	const png = await renderCard(props as CardContent);
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
