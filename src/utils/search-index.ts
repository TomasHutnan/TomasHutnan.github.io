import { getCollection } from "astro:content";
import { TAG_LABELS } from "../data/tags";
import { getShortEventName, mapAwardsToProjects } from "./awards";
import { getProjectHref, sortProjectsByRecency } from "./projects";
import { collectTagStats, getTagHref } from "./tags";

export type SearchKind = "page" | "project" | "tag" | "award";

export interface SearchEntry {
	kind: SearchKind;
	title: string;
	/** One line shown under the title. */
	detail: string;
	href: string;
	/** Extra text that matches but isn't shown, such as tag names. */
	keywords: string;
	/** Shown before typing. */
	suggested?: boolean;
}

/** Fixed pages. A new top-level page should be added here too. */
const PAGES: SearchEntry[] = [
	{
		kind: "page",
		title: "Home",
		detail: "Experience, selected work and awards",
		href: "/",
		keywords: "about experience",
		suggested: true,
	},
	{
		kind: "page",
		title: "All projects",
		detail: "Every project, filterable by tag",
		href: "/projects/",
		keywords: "work portfolio",
		suggested: true,
	},
	{
		kind: "page",
		title: "Contact",
		detail: "Email, LinkedIn and GitHub",
		href: "/#contact",
		keywords: "email linkedin github hire",
	},
	{
		kind: "page",
		title: "Resume",
		detail: "PDF",
		href: "/resume.pdf",
		keywords: "cv resume",
	},
];

export async function buildSearchIndex(): Promise<SearchEntry[]> {
	const projects = sortProjectsByRecency(await getCollection("projects"));
	const awards = await getCollection("awards");
	const awardProjects = mapAwardsToProjects(projects);

	const projectEntries = projects.map((project): SearchEntry => ({
		kind: "project",
		title: project.data.title,
		detail: project.data.description,
		href: getProjectHref(project),
		keywords: [
			project.data.role,
			...project.data.tags.map((slug) => TAG_LABELS[slug]),
		].join(" "),
		suggested: project.data.featured,
	}));

	const tagEntries = collectTagStats(projects).map(
		({ slug, label, count }): SearchEntry => ({
			kind: "tag",
			title: label,
			detail: `${count} project${count === 1 ? "" : "s"}`,
			href: getTagHref(slug),
			keywords: slug.replaceAll("-", " "),
		}),
	);

	const awardEntries = awards
		.toSorted(
			(left, right) =>
				right.data.date.getTime() - left.data.date.getTime(),
		)
		.map((award): SearchEntry => {
			const project = awardProjects.get(award.id);
			return {
				kind: "award",
				title: award.data.shortTitle,
				detail: project
					? `${getShortEventName(award.data.event)} · ${project.data.title}`
					: getShortEventName(award.data.event),
				href: project ? getProjectHref(project) : "/#awards",
				// Also joined up, so "hackkosice" finds "Hack Košice".
				keywords: `${award.data.title} ${award.data.event} ${award.data.event.replaceAll(" ", "")} ${award.data.issuer}`,
			};
		});

	return [...PAGES, ...projectEntries, ...tagEntries, ...awardEntries];
}
