export interface ExperienceEntry {
	title: string;
	organization: string;
	period: string;
	bullets: string[];
}

export type ContactIcon = "email" | "linkedin" | "github";

export interface ContactLink {
	label: string;
	href: string;
	value: string;
	icon: ContactIcon;
}

export const hero = {
	name: "Tomáš Hutňan",
	title: "Machine learning and the software around it.",
	summary:
		"Informatics student at Masaryk University. I teach AI and algorithms, and research LLM safety for clinical use.",
};

export const highlights = [
	"1st place, Newsmatics Hackathon 2025",
	"Tatra Banka Challenge winner, 2024 and 2026",
];

export const location =
	"Brno, Czechia during the semester, originally from Košice, Slovakia";

export interface SkillLine {
	label: string;
	items: string[];
}

/**
 * Lines under the home tag cloud. Tools used everywhere don't belong on any
 * one project, so they would never show in a cloud built from project tags.
 */
export const skillLines: SkillLine[] = [
	{ label: "Every day", items: ["Linux", "Git"] },
	{ label: "Also", items: ["OpenCV"] },
	{
		label: "Languages",
		items: ["English (C1/C2)", "German (A1/A2)", "Slovak (Native)"],
	},
];

export const experienceEntries: ExperienceEntry[] = [
	{
		title: "Research Assistant",
		organization: "Masaryk University",
		period: "2026 Oct — Present",
		bullets: [
			"Research LLM safety and clinical guardrails within Project EMPOWER.",
			"Generate synthetic oncology datasets to test where models fail.",
		],
	},
	{
		title: "Teaching Assistant",
		organization: "Masaryk University",
		period: "2025 Sep — Present",
		bullets: [
			"Teach Introduction to AI, Algorithms & Data Structures, and Foundations of Programming.",
		],
	},
	{
		title: "SQA Intern",
		organization: "ChyronHego",
		period: "2024 Nov — 2025 Dec",
		bullets: [
			"Built Python test automation and wrote 1,000+ automated test cases.",
			"Worked with SQL, APIs, and Docker-based infrastructure.",
		],
	},
];

export const contactLinks: ContactLink[] = [
	{
		label: "Email",
		href: "mailto:tomas@hutnan.dev",
		value: "tomas@hutnan.dev",
		icon: "email",
	},
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/hutnan",
		value: "linkedin.com/in/hutnan",
		icon: "linkedin",
	},
	{
		label: "GitHub",
		href: "https://github.com/TomasHutnan",
		value: "github.com/TomasHutnan",
		icon: "github",
	},
];
