import type { CollectionEntry } from "astro:content";

type Award = CollectionEntry<"awards">;
type Project = CollectionEntry<"projects">;

export interface AwardYearGroup {
	year: number;
	awards: Award[];
}

export function groupAwardsByYear(awards: Award[]): AwardYearGroup[] {
	const newestFirst = awards.toSorted(
		(left, right) =>
			right.data.date.getTime() - left.data.date.getTime() ||
			left.data.title.localeCompare(right.data.title),
	);

	const groups: AwardYearGroup[] = [];
	for (const award of newestFirst) {
		const year = award.data.date.getUTCFullYear();
		const currentGroup = groups.at(-1);

		if (currentGroup?.year === year) {
			currentGroup.awards.push(award);
		} else {
			groups.push({ year, awards: [award] });
		}
	}
	return groups;
}

export function mapAwardsToProjects(projects: Project[]): Map<string, Project> {
	return new Map(
		projects.flatMap((project) =>
			(project.data.awards ?? []).map(
				(award) => [award.id, project] as const,
			),
		),
	);
}
