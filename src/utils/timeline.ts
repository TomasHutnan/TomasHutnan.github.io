import type { CollectionEntry } from "astro:content";

type Project = CollectionEntry<"projects">;
type Award = CollectionEntry<"awards">;

export interface TimelineAward {
	title: string;
	date: Date;
	/** Horizontal position on the track, 0-100. */
	at: number;
}

export interface TimelineRow {
	project: Project;
	start: Date;
	/** Missing while the project is in progress. */
	end?: Date;
	/** Horizontal position and length on the track, 0-100. */
	left: number;
	width: number;
	awards: TimelineAward[];
}

export interface Timeline {
	rows: TimelineRow[];
	/** One tick per 1 January in the range, positioned 0-100. */
	years: { year: number; at: number }[];
	/** Projects without a start date, which can't be placed. */
	plannedCount: number;
}

function startOfYear(year: number) {
	return Date.UTC(year, 0, 1);
}

/**
 * Lays projects out on a shared time axis, oldest first. The axis runs from
 * the January before the first project to the January after `now`, so the
 * page is a snapshot of the day it was built.
 */
export function buildTimeline(
	projects: Project[],
	awards: Award[],
	now = new Date(),
): Timeline {
	const placed = projects
		.filter((project) => project.data.startedAt)
		.toSorted(
			(left, right) =>
				left.data.startedAt!.getTime() -
				right.data.startedAt!.getTime(),
		);

	const firstYear =
		placed[0]?.data.startedAt!.getUTCFullYear() ?? now.getUTCFullYear();
	const lastYear = now.getUTCFullYear() + 1;
	const from = startOfYear(firstYear);
	const span = startOfYear(lastYear) - from;
	const position = (time: number) => ((time - from) / span) * 100;

	const awardsById = new Map(awards.map((award) => [award.id, award]));

	const rows = placed.map((project) => {
		const start = project.data.startedAt!;
		const end = project.data.completedAt;
		const left = position(start.getTime());
		const right = position((end ?? now).getTime());

		return {
			project,
			start,
			end,
			left,
			width: Math.max(0, right - left),
			awards: (project.data.awards ?? [])
				.map((reference) => awardsById.get(reference.id))
				.filter((award) => award !== undefined)
				.map((award) => ({
					title: award.data.title,
					date: award.data.date,
					at: position(award.data.date.getTime()),
				})),
		};
	});

	const years = [];
	for (let year = firstYear; year <= lastYear; year++) {
		years.push({ year, at: position(startOfYear(year)) });
	}

	return {
		rows,
		years,
		plannedCount: projects.length - placed.length,
	};
}
