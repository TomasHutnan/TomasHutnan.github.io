import { existsSync } from "node:fs";
import { defineCollection, reference } from "astro:content";
import type { SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { TAG_SLUGS } from "./data/tags";

// Videos live in public/ because Astro's image pipeline can't process them, so
// nothing else would catch a mistyped path before it became a broken player.
const publicVideoPath = z
	.string()
	.regex(/^\/media\/.+\.(mp4|webm)$/)
	.refine((path) => existsSync(`public${path}`), {
		error: "Video file not found in public/",
	});

const galleryItem = (image: SchemaContext["image"]) =>
	z.union([
		z.object({ image: image(), alt: z.string() }),
		z.object({
			// List the smallest format first; browsers play the first they support.
			video: z.array(publicVideoPath).min(1),
			poster: image(),
			alt: z.string(),
		}),
	]);

const projects = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				// Cards show the first four, so order tags by importance.
				tags: z.array(z.enum(TAG_SLUGS)).min(1),
				type: z.enum(["solo", "team", "university"]),

				// Status: Planned, if missing
				startedAt: z.coerce.date().optional(),
				// Status: In Progress, if missing, otherwise Finished
				completedAt: z.coerce.date().optional(),

				awards: z.array(reference("awards")).optional(),
				featured: z.boolean().default(false),
				featuredOrder: z.number().optional(),

				repo: z.url().optional(),
				// A YouTube demo also becomes the first gallery slide.
				demo: z.url().optional(),
				paper: z.url().optional(),

				cover: image(),
				gallery: z.array(galleryItem(image)).default([]),

				role: z.string(),
				shortRoleDescription: z.string().optional(),
				contribution: z.string().optional(),
				collaborators: z.array(z.string()).optional(),
			})
			.refine(
				(project) =>
					!project.featured || project.featuredOrder !== undefined,
				{ error: "Featured projects need a featuredOrder" },
			),
});

const awards = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/awards" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			event: z.string(),
			issuer: z.string(),
			date: z.coerce.date(),
			cover: image().optional(),
		}),
});

export const collections = {
	projects,
	awards,
};
