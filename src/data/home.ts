export interface QuickInfoItem {
	label: string;
	value: string;
}

export interface SkillGroup {
	title: string;
	items: string[];
}

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
	title: "Informatics Student — Machine Learning & Computer Vision",
	summary:
		"I build machine learning systems and the software around them, from medical imaging to GPU pipelines.",
};

export const quickInfo: QuickInfoItem[] = [
	{ label: "Location", value: "Brno, Czechia / Slovakia" },
	{
		label: "Education",
		value: "Masaryk University — Bachelor's in Informatics (in progress)",
	},
	{
		label: "Current roles",
		value: "Teaching Assistant & Research Assistant",
	},
];

export const aboutParagraphs = [
	"I like building practical AI: medical diagnostics, financial tools, generative apps and games. Alongside my studies, I teach AI, algorithms and programming, and research LLM safety for clinical use.",
];

export const skillGroups: SkillGroup[] = [
	{
		title: "Core Stack",
		items: [
			"Python",
			"C++",
			"PyTorch",
			"Docker",
			"Linux",
			"OpenCV",
			"Pandas",
		],
	},
	{
		title: "Also Used",
		items: [
			"TypeScript",
			"C#",
			"FastAPI",
			"PostgreSQL",
			"MongoDB",
			"React",
		],
	},
	{
		title: "Specializations",
		items: [
			"Computer Vision",
			"NLP",
			"GPU Optimization",
			"Automated Testing",
		],
	},
	{
		title: "Languages",
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
