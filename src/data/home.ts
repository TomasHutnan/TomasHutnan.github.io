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

export interface ContactLink {
	label: string;
	href: string;
	value: string;
}

export const hero = {
	name: 'Tomáš Hutňan',
	title: 'Informatics Student — Machine Learning & Computer Vision',
	summary:
		'I build intelligent systems, data-driven applications, and interactive software.'
};

export const quickInfo: QuickInfoItem[] = [
	{ label: 'Location', value: 'Brno, Czechia / Slovakia' },
	{ label: 'Education', value: 'Masaryk University — Informatics (BC, in progress)' },
	{ label: 'Current role', value: 'Teaching Assistant' },
];

export const aboutParagraphs = [
	'An informatics student focused on machine learning, computer vision, and data-driven systems.',
	'I enjoy building practical applications of AI, from medical diagnostics and financial systems to generative tools and interactive games.',
	'Alongside my studies, I teach programming and algorithms, helping students build strong foundations in software development.'
];

export const skillGroups: SkillGroup[] = [
	{ title: 'Machine Learning & Data', items: ['Python', 'PyTorch', 'Pandas / NumPy', 'Computer Vision'] },
	{ title: 'Backend & Systems', items: ['C#', 'SQL / NoSQL', 'REST / gRPC APIs', 'Docker'] },
	{ title: 'Fullstack', items: ['React', 'TypeScript', 'Next.js'] },
	{ title: 'Tools', items: ['Git', 'Cloud Platforms', 'Auth Systems'] }
];

export const experienceEntries: ExperienceEntry[] = [
	{
		title: 'SQA Intern',
		organization: 'ChyronHego',
		period: '2024 Nov — 2025 Dec',
		bullets: ['Develop automation systems in Python.', 'Work with SQL, APIs, and Docker-based infrastructure.']
	},
	{
		title: 'Teaching Assistant',
		organization: 'Masaryk University',
		period: 'Current',
		bullets: [
			'Teaching Foundations of Programming.',
			'Teaching Algorithms & Data Structures.',
			'Reviewing assignments and mentoring students.'
		]
	}
];

export const contactLinks: ContactLink[] = [
	{ label: 'Email', href: 'mailto:tomas.hutnan147@gmail.com', value: 'tomas.hutnan147@gmail.com' },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/hutnan', value: 'linkedin.com/in/hutnan' },
	{ label: 'GitHub', href: 'https://github.com/TomasHutnan', value: 'github.com/TomasHutnan' }
];
