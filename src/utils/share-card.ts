import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import type { ImageMetadata } from "astro";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import sharp from "sharp";

/** The size LinkedIn, X and Slack all render as a large preview card. */
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

const COLORS = {
	background: "#0b1120",
	surface: "#111827",
	border: "#1f2937",
	text: "#e2e8f0",
	muted: "#94a3b8",
	primary: "#67e8f9",
	primaryTint: "rgba(34, 211, 238, 0.12)",
	award: "#e3c77b",
};

// Satori takes plain objects shaped like React elements.
interface Node {
	type: string;
	props: Record<string, unknown> & { style?: Record<string, unknown> };
}

function h(
	type: string,
	style: Record<string, unknown>,
	children?: unknown,
	props: Record<string, unknown> = {},
): Node {
	return { type, props: { ...props, style, children } };
}

const require = createRequire(import.meta.url);

async function font(file: string) {
	return readFile(require.resolve(`@fontsource/${file}`));
}

let fontsPromise: Promise<Parameters<typeof satori>[1]["fonts"]> | undefined;

/** Latin plus latin-ext, which has the š and ň in "Tomáš Hutňan". */
function loadFonts() {
	fontsPromise ??= Promise.all(
		(
			[
				["Inter", "inter", 400],
				["Inter", "inter", 600],
				["Space Grotesk", "space-grotesk", 700],
			] as const
		).flatMap(([name, pkg, weight]) =>
			// Satori doesn't fall back between files of one family, so the
			// latin-ext half gets its own name and goes second in fontFamily.
			["latin", "latin-ext"].map(async (subset) => ({
				name: subset === "latin" ? name : `${name} Ext`,
				weight,
				style: "normal" as const,
				data: await font(
					`${pkg}/files/${pkg}-${subset}-${weight}-normal.woff`,
				),
			})),
		),
	);
	return fontsPromise;
}

/** Satori can't read WebP, so covers are converted to a PNG data URL. */
async function toDataUrl(image: ImageMetadata, width: number, height: number) {
	// Astro adds fsPath to imported images at build time.
	const path = (image as ImageMetadata & { fsPath?: string }).fsPath;
	if (!path) throw new Error(`No file path for image ${image.src}`);
	const png = await sharp(path)
		.resize(width, height, { fit: "cover", position: "attention" })
		.png()
		.toBuffer();
	return `data:image/png;base64,${png.toString("base64")}`;
}

// A type alias rather than an interface, so it can be passed as page props.
export type CardContent = {
	/** Small line above the title. */
	eyebrow: string;
	title: string;
	description: string;
	tags?: string[];
	/** Gold lines above the tags, such as awards. */
	highlights?: string[];
	cover?: ImageMetadata;
};

const COVER_WIDTH = 470;

async function cardTree(content: CardContent): Promise<Node> {
	const {
		eyebrow,
		title,
		description,
		tags = [],
		highlights = [],
		cover,
	} = content;
	const coverUrl = cover
		? await toDataUrl(cover, COVER_WIDTH * 2, CARD_HEIGHT * 2)
		: undefined;

	const text = h(
		"div",
		{
			display: "flex",
			flexDirection: "column",
			flex: 1,
			padding: "64px 56px 56px 72px",
		},
		[
			h(
				"div",
				{
					display: "flex",
					color: COLORS.primary,
					fontSize: 24,
					fontWeight: 600,
					letterSpacing: 1,
				},
				eyebrow,
			),
			h(
				"div",
				{
					display: "flex",
					marginTop: 22,
					color: COLORS.text,
					fontFamily: "Space Grotesk, Space Grotesk Ext",
					fontSize: title.length > 24 ? 58 : 72,
					fontWeight: 700,
					letterSpacing: -1.5,
					lineHeight: 1.05,
				},
				title,
			),
			h(
				"div",
				{
					display: "block",
					marginTop: 24,
					color: COLORS.muted,
					fontSize: 28,
					lineHeight: 1.4,
					lineClamp: 3,
				},
				description,
			),
			h("div", { display: "flex", flex: 1 }),
			...highlights.map((line) =>
				h(
					"div",
					{
						display: "flex",
						alignItems: "center",
						marginBottom: 18,
						color: COLORS.award,
						fontSize: 24,
						fontWeight: 600,
					},
					[
						h("div", {
							width: 14,
							height: 14,
							marginRight: 14,
							background: COLORS.award,
							transform: "rotate(45deg)",
						}),
						line,
					],
				),
			),
			tags.length > 0
				? h(
						"div",
						{ display: "flex", flexWrap: "wrap", gap: 12 },
						tags.map((tag) =>
							h(
								"div",
								{
									display: "flex",
									padding: "8px 18px",
									borderRadius: 999,
									background: COLORS.primaryTint,
									color: COLORS.primary,
									fontSize: 22,
									fontWeight: 600,
								},
								tag,
							),
						),
					)
				: null,
		],
	);

	const coverPanel = coverUrl
		? h(
				"div",
				{ display: "flex", position: "relative", width: COVER_WIDTH },
				[
					h(
						"img",
						{
							width: COVER_WIDTH,
							height: CARD_HEIGHT,
							objectFit: "cover",
						},
						undefined,
						{
							src: coverUrl,
							width: COVER_WIDTH,
							height: CARD_HEIGHT,
						},
					),
					// Fades the cover into the background on its left edge.
					h("div", {
						position: "absolute",
						inset: 0,
						backgroundImage: `linear-gradient(90deg, ${COLORS.background} 0%, rgba(11, 17, 32, 0) 45%)`,
					}),
				],
			)
		: null;

	return h(
		"div",
		{
			display: "flex",
			width: CARD_WIDTH,
			height: CARD_HEIGHT,
			background: COLORS.background,
			backgroundImage:
				"radial-gradient(circle at 0% 0%, rgba(34, 211, 238, 0.14), rgba(11, 17, 32, 0) 55%)",
			borderBottom: `6px solid ${COLORS.primary}`,
			fontFamily: "Inter, Inter Ext",
		},
		[text, coverPanel],
	);
}

export async function renderCard(content: CardContent): Promise<Buffer> {
	const tree = await cardTree(content);
	const svg = await satori(tree as never, {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
		fonts: await loadFonts(),
	});
	return new Resvg(svg, { fitTo: { mode: "width", value: CARD_WIDTH } })
		.render()
		.asPng();
}

/** The card's URL for a page: "default", "projects" or "projects/<id>". */
export function getShareCardPath(slug: string): string {
	return `/og/${slug}.png`;
}
