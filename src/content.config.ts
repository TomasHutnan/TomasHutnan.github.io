import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
            type: z.enum(['solo', 'team', 'university']),

            // Status: Planned, if missing
            startedAt: z.coerce.date().optional(),
            // Status: In Progress, if missing, otherwise Finished
            completedAt: z.coerce.date().optional(),  

            awards: z.array(reference('awards')).optional(),
            featured: z.boolean().default(false),
            featuredOrder: z.number().optional(),

            repo: z.url().optional(),
            demo: z.url().optional(),
            paper: z.url().optional(),
    
            cover: image(),
            gallery: z.array(image()).optional(),

            role: z.string().optional(),
            shortRoleDescription: z.string().optional(),
            contribution: z.string().optional(),
            collaborators: z.array(z.string()).optional()
        })
});

const awards = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/awards' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            event: z.string(),
            issuer: z.string(),
            date: z.coerce.date(),
            featured: z.boolean().default(false),
            cover: image().optional()
        })
});

export const collections = {
    projects,
    awards
};