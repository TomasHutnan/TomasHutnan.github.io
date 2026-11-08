/**
 * Packs the tag links into a cumulus-shaped cloud.
 *
 * The silhouette is a union of circles ("puffs") over a flat-bottomed body,
 * drawn in SVG with a blur-and-threshold filter that melts the circles into
 * one soft shape. Words are placed largest first along an elliptical spiral
 * from the cloud's centre, and each one must sit inside the circles (with a
 * margin) and clear every word placed before it. When a word doesn't fit, the
 * fonts shrink a little and, past a floor, the cloud grows taller instead.
 *
 * Everything is deterministic, so the same tags always give the same cloud.
 * Without JavaScript the links stay a plain wrapped list.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/** The shape is generated in a viewBox this wide; height follows the aspect. */
const VIEW_WIDTH = 1000;

const MIN_FONT = 11;
const MAX_FONT = 40;
const BASE_MIN_FONT = 13;
const EVEN_FONT = 19;
const LINE_HEIGHT = 1.15;
const PAD_X = 6;
const PAD_Y = 2;
/** Gap kept between words. */
const GAP = 3;
/** How far inside the silhouette a word must stay, in px. */
const EDGE_MARGIN = 10;
/** Word area over cloud area that a first attempt aims for. */
const TARGET_DENSITY = 0.42;
const MAX_ATTEMPTS = 40;
/** Spiral radius gained per radian, and distance between samples, in px. */
const SPIRAL_GROWTH = 1.6;
const SPIRAL_STRIDE = 3;

export interface CloudWord {
	element: HTMLElement;
	count: number;
	strong: boolean;
}

interface Puff {
	x: number;
	y: number;
	r: number;
}

interface Shape {
	aspect: number;
	height: number;
	/** The flat bottom edge. */
	base: number;
	puffs: Puff[];
	body: { x0: number; x1: number; y0: number; y1: number };
	/** Where the spiral starts, roughly the centre of mass. */
	centre: { x: number; y: number };
}

interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

function buildShape(aspect: number): Shape {
	const height = VIEW_WIDTH / aspect;
	const left = 40;
	const right = VIEW_WIDTH - 40;
	const span = right - left;
	const base = height * 0.92;
	// Puff sizes follow the shorter side, so a tall cloud gets more puffs
	// down its flanks instead of a few huge ones.
	const unit = Math.min(height, VIEW_WIDTH * 0.6);
	const puffs: Puff[] = [];

	// A dome of distinct puffs across the top, tallest in the middle.
	const count = Math.max(3, Math.round(aspect * 2.6));
	const spacing = span / count;
	for (let index = 0; index < count; index++) {
		const t = (index + 0.5) / count;
		const lift = Math.sin(Math.PI * t) ** 0.9;
		// A slight asymmetry reads as natural rather than drawn with a compass.
		const wobble = 1 + 0.08 * Math.sin(index * 2.3 + 0.7);
		const radius =
			Math.min(spacing * 0.82, unit * (0.16 + 0.26 * lift)) * wobble;
		const top = unit * (0.02 + 0.36 * (1 - lift));
		puffs.push({ x: left + t * span, y: top + radius, r: radius });
	}
	const domeBottom = Math.min(...puffs.map((puff) => puff.y));
	const flankTop = Math.max(puffs[0].y, puffs[count - 1].y);

	// The base is flat and tucked in under the widest lobes, like a cumulus.
	const lobeRadius = unit * 0.25;
	const baseRadius = unit * 0.15;
	const baseLeft = left + lobeRadius * 1.3;
	const baseRight = right - lobeRadius * 1.3;
	const baseCount = Math.max(
		2,
		Math.round((baseRight - baseLeft) / (baseRadius * 1.6)) + 1,
	);
	for (let index = 0; index < baseCount; index++) {
		const t = index / (baseCount - 1);
		puffs.push({
			x: baseLeft + t * (baseRight - baseLeft),
			y: base - baseRadius,
			r: baseRadius * (1 + 0.06 * Math.sin(index * 2.9)),
		});
	}

	// Lobes bulge out along both flanks.
	const flankBottom = base - baseRadius * 1.8;
	const lobes = Math.max(
		1,
		Math.round((flankBottom - flankTop) / (lobeRadius * 1.3)),
	);
	for (let index = 0; index < lobes; index++) {
		const y = flankTop + ((index + 0.5) / lobes) * (flankBottom - flankTop);
		const radius = lobeRadius * (1 + 0.08 * Math.sin(index * 1.9 + 0.4));
		puffs.push(
			{ x: left + radius, y, r: radius },
			{ x: right - radius * 0.94, y: y + unit * 0.03, r: radius * 0.94 },
		);
	}

	const shape: Shape = {
		aspect,
		height,
		base,
		puffs,
		body: {
			x0: left + lobeRadius * 0.8,
			x1: right - lobeRadius * 0.8,
			y0: domeBottom,
			y1: base - baseRadius,
		},
		centre: { x: VIEW_WIDTH / 2, y: height / 2 },
	};
	shape.centre = centroid(shape);
	return shape;
}

function centroid(shape: Shape) {
	let sumY = 0;
	let hits = 0;
	const steps = 48;
	for (let row = 0; row < steps; row++) {
		for (let column = 0; column < steps; column++) {
			const x = ((column + 0.5) / steps) * VIEW_WIDTH;
			const y = ((row + 0.5) / steps) * shape.height;
			if (!insideShape(shape, x, y, 0)) continue;
			sumY += y;
			hits++;
		}
	}
	return hits === 0 ? shape.centre : { x: VIEW_WIDTH / 2, y: sumY / hits };
}

function insideShape(shape: Shape, x: number, y: number, margin: number) {
	const { body } = shape;
	if (y > shape.base - margin) return false;
	if (
		x >= body.x0 + margin &&
		x <= body.x1 - margin &&
		y >= body.y0 + margin
	) {
		return true;
	}
	return shape.puffs.some(
		(puff) => Math.hypot(x - puff.x, y - puff.y) <= puff.r - margin,
	);
}

/** Samples the rectangle's edges, which is enough for a union of convex parts. */
function rectInsideShape(shape: Shape, rect: Rect, margin: number) {
	const stepX = Math.max(4, rect.w / Math.ceil(rect.w / 14));
	const stepY = Math.max(4, rect.h / Math.ceil(rect.h / 14));
	const right = rect.x + rect.w;
	const bottom = rect.y + rect.h;

	for (let x = rect.x; x <= right + 0.01; x += stepX) {
		if (!insideShape(shape, x, rect.y, margin)) return false;
		if (!insideShape(shape, x, bottom, margin)) return false;
	}
	for (let y = rect.y + stepY; y < bottom; y += stepY) {
		if (!insideShape(shape, rect.x, y, margin)) return false;
		if (!insideShape(shape, right, y, margin)) return false;
	}
	return true;
}

function overlaps(rect: Rect, placed: Rect[], gap: number) {
	return placed.some(
		(other) =>
			rect.x < other.x + other.w + gap &&
			other.x < rect.x + rect.w + gap &&
			rect.y < other.y + other.h + gap &&
			other.y < rect.y + rect.h + gap,
	);
}

/** Font size before any fitting, on a gentle curve so mid counts still read. */
function baseFontSize(count: number, maxCount: number) {
	// One project selected: every tag ties, so show them all at a mid size.
	if (maxCount <= 1) return EVEN_FONT;
	const ratio = (count - 1) / (maxCount - 1);
	return BASE_MIN_FONT + ratio ** 0.75 * (MAX_FONT - BASE_MIN_FONT);
}

let measureContext: CanvasRenderingContext2D | null = null;

function measureText(text: string, font: string) {
	measureContext ??= document.createElement("canvas").getContext("2d");
	if (!measureContext) return text.length * 8;
	measureContext.font = font;
	return measureContext.measureText(text).width;
}

interface Measured {
	word: CloudWord;
	label: string;
	base: number;
	weight: number;
}

interface Placement {
	word: CloudWord;
	fontSize: number;
	x: number;
	y: number;
}

/**
 * Tries to place every word in a cloud `width` px wide. The shape works in
 * viewBox units, and the scale factor converts between the two.
 */
function tryLayout(
	words: Measured[],
	shape: Shape,
	width: number,
	fontScale: number,
	fontFamily: string,
): Placement[] | null {
	const scale = width / VIEW_WIDTH;
	const margin = EDGE_MARGIN / scale;
	const gap = GAP / scale;
	const placed: Rect[] = [];
	const placements: Placement[] = [];
	const { x: cx, y: cy } = shape.centre;
	const stretch = shape.aspect * 0.85;
	const maxRadius = VIEW_WIDTH;

	for (const [index, item] of words.entries()) {
		const fontSize = Math.max(MIN_FONT, item.base * fontScale);
		const textWidth = measureText(
			item.label,
			`${item.weight} ${fontSize}px ${fontFamily}`,
		);
		const w = (textWidth + PAD_X * 2) / scale;
		const h = (fontSize * LINE_HEIGHT + PAD_Y * 2) / scale;

		// The golden angle spreads consecutive words around the centre
		// instead of stacking them all on one side.
		const startAngle = index * 2.399963;
		let found: Rect | null = null;

		// Steps a constant ~3px along the spiral; a fixed angle step would
		// leap over gaps far from the centre.
		const growth = SPIRAL_GROWTH / scale;
		const stride = SPIRAL_STRIDE / scale;
		for (
			let theta = 0;
			;
			theta += Math.min(0.5, stride / (growth * theta + 1))
		) {
			const radius = growth * theta;
			if (radius > maxRadius) break;
			const angle = startAngle + theta;
			const rect = {
				x: cx + Math.cos(angle) * radius * stretch - w / 2,
				y: cy + Math.sin(angle) * radius - h / 2,
				w,
				h,
			};
			if (overlaps(rect, placed, gap)) continue;
			if (!rectInsideShape(shape, rect, margin)) continue;
			found = rect;
			break;
		}

		if (!found) return null;
		placed.push(found);
		placements.push({
			word: item.word,
			fontSize,
			x: found.x * scale,
			y: found.y * scale,
		});
	}

	return placements;
}

function solve(words: Measured[], containerWidth: number, fontFamily: string) {
	const wide = containerWidth >= 640;
	let aspect = wide ? 2.35 : 1.15;

	// Size the cloud to its words, so a filtered cloud shrinks with them.
	const wordArea = words.reduce((sum, item) => {
		const width = measureText(
			item.label,
			`${item.weight} ${item.base}px ${fontFamily}`,
		);
		return (
			sum + (width + PAD_X * 2) * (item.base * LINE_HEIGHT + PAD_Y * 2)
		);
	}, 0);
	const shapeFill = 0.72;
	const idealWidth = Math.sqrt(
		(wordArea / TARGET_DENSITY / shapeFill) * aspect,
	);
	const minWidth = Math.min(containerWidth, wide ? 420 : 260);
	let width = Math.max(minWidth, Math.min(containerWidth, idealWidth));
	let fontScale = 1;

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const shape = buildShape(aspect);
		const placements = tryLayout(
			words,
			shape,
			width,
			fontScale,
			fontFamily,
		);
		if (placements) return { shape, width, placements };

		if (width < containerWidth) {
			width = Math.min(containerWidth, width * 1.08);
		} else if (fontScale > 0.74) {
			fontScale *= 0.94;
		} else {
			aspect = Math.max(0.45, aspect * 0.92);
		}
	}
	return null;
}

function renderShape(svg: SVGSVGElement, shape: Shape) {
	const height = shape.height.toFixed(1);
	svg.setAttribute("viewBox", `0 0 ${VIEW_WIDTH} ${height}`);

	const layer = (className: string, withBody: boolean, scale = 1) => {
		const group = document.createElementNS(SVG_NS, "g");
		group.setAttribute("class", className);
		for (const puff of shape.puffs) {
			const circle = document.createElementNS(SVG_NS, "circle");
			circle.setAttribute("cx", puff.x.toFixed(1));
			circle.setAttribute("cy", puff.y.toFixed(1));
			circle.setAttribute("r", (puff.r * scale).toFixed(1));
			group.append(circle);
		}
		if (withBody) {
			const { body } = shape;
			const rect = document.createElementNS(SVG_NS, "rect");
			rect.setAttribute("x", body.x0.toFixed(1));
			rect.setAttribute("y", body.y0.toFixed(1));
			rect.setAttribute("width", (body.x1 - body.x0).toFixed(1));
			rect.setAttribute("height", (body.y1 - body.y0).toFixed(1));
			group.append(rect);
		}
		return group;
	};

	// Blur then sharpen the alpha: overlapping circles melt into one outline.
	const goo = `
		<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
		<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />`;

	svg.innerHTML = `
		<defs>
			<linearGradient id="cloud-fill" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${height}">
				<stop offset="0" style="stop-color: var(--cloud-top)" />
				<stop offset="1" style="stop-color: var(--cloud-bottom)" />
			</linearGradient>
			<radialGradient id="cloud-puff" cx="0.44" cy="0.36" r="0.5">
				<stop offset="0" style="stop-color: var(--cloud-light)" />
				<stop offset="0.45" style="stop-color: var(--cloud-light); stop-opacity: 0.55" />
				<stop offset="1" style="stop-color: var(--cloud-light); stop-opacity: 0" />
			</radialGradient>
			<filter id="cloud-goo" x="-10%" y="-20%" width="120%" height="140%">${goo}</filter>
			<filter id="cloud-rim" x="-10%" y="-20%" width="120%" height="140%">${goo}
				<feMorphology in="goo" operator="erode" radius="3" result="eroded" />
				<feComposite in="goo" in2="eroded" operator="out" result="outline" />
				<feComponentTransfer in="outline" result="faint">
					<feFuncA type="linear" slope="0.4" />
				</feComponentTransfer>
				<feOffset in="goo" dy="8" result="shifted" />
				<feComposite in="goo" in2="shifted" operator="out" result="lit" />
				<feMerge result="rim">
					<feMergeNode in="faint" />
					<feMergeNode in="lit" />
				</feMerge>
				<feGaussianBlur in="rim" stdDeviation="1.6" />
			</filter>
			<filter id="cloud-glow" x="-20%" y="-40%" width="140%" height="180%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="40" />
			</filter>
		</defs>`;
	svg.append(
		layer("cloud-glow", true),
		layer("cloud-body", true),
		// Each puff catches light on its upper side, which gives the volume.
		layer("cloud-light", false, 0.92),
		layer("cloud-rim", true),
	);
}

export function createTagCloud(container: HTMLElement) {
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("class", "tag-cloud-shape");
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("preserveAspectRatio", "none");
	container.prepend(svg);

	let words: CloudWord[] = [];
	let lastWidth = 0;
	let lastAspect = 0;

	function layout() {
		const containerWidth = container.clientWidth;
		if (containerWidth === 0) return;
		lastWidth = containerWidth;

		const visible = words.filter((word) => word.count > 0);
		const maxCount = Math.max(1, ...visible.map((word) => word.count));
		const style = getComputedStyle(container);
		const fontFamily = style.fontFamily;

		const measured: Measured[] = visible
			.map((word) => ({
				word,
				label: word.element.textContent?.trim() ?? "",
				base: baseFontSize(word.count, maxCount),
				weight: word.strong ? 700 : 400,
			}))
			.sort(
				(left, right) =>
					right.base - left.base ||
					right.label.length - left.label.length,
			);

		const result = solve(measured, containerWidth, fontFamily);
		if (!result) {
			container.classList.remove("is-cloud");
			return;
		}

		const { shape, width, placements } = result;
		const height = width / shape.aspect;
		const offsetX = (containerWidth - width) / 2;

		if (shape.aspect !== lastAspect) {
			renderShape(svg, shape);
			lastAspect = shape.aspect;
		}
		svg.style.width = `${width}px`;
		svg.style.height = `${height}px`;
		svg.style.transform = `translateX(${offsetX}px)`;
		container.style.height = `${height}px`;

		for (const { word, fontSize, x, y } of placements) {
			const style = word.element.style;
			style.fontSize = `${fontSize}px`;
			style.transform = `translate(${(x + offsetX).toFixed(1)}px, ${y.toFixed(1)}px)`;
		}
		container.classList.add("is-cloud");
	}

	let frame = 0;
	function schedule() {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(layout);
	}

	new ResizeObserver(() => {
		if (container.clientWidth !== lastWidth) schedule();
	}).observe(container);

	// Layout measures text on a canvas, so redo it once the web fonts arrive.
	void document.fonts?.ready.then(() => {
		if (words.length > 0) layout();
	});

	return {
		update(next: CloudWord[]) {
			words = next;
			layout();
			// Words that were hidden fade in where they land rather than
			// sliding in from their old spot.
			requestAnimationFrame(() => container.classList.add("is-settled"));
		},
	};
}
