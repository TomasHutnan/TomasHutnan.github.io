import {
	getTagAriaLabel,
	getTagCloudFontSize,
	isStrongTag,
} from "../utils/tags";

const cloud = document.querySelector<HTMLElement>("[data-tag-cloud]");
const summary = document.querySelector<HTMLElement>("[data-filter-summary]");
const clearButton = document.querySelector<HTMLButtonElement>(
	"[data-filter-clear]",
);

function getSelectedFromUrl(knownSlugs: Set<string>): Set<string> {
	const param = new URLSearchParams(window.location.search).get("tags") ?? "";
	return new Set(
		param
			.split(",")
			.map((slug) => slug.trim())
			.filter((slug) => knownSlugs.has(slug)),
	);
}

function writeSelectedToUrl(selected: Set<string>) {
	const query = selected.size > 0 ? `?tags=${[...selected].join(",")}` : "";
	history.replaceState({}, "", `${window.location.pathname}${query}`);
}

function initProjectFilter(
	cloud: HTMLElement,
	summary: HTMLElement,
	clearButton: HTMLButtonElement,
) {
	const cloudLinks = [
		...cloud.querySelectorAll<HTMLAnchorElement>("[data-tag-slug]"),
	];
	const cardLinks = [
		...document.querySelectorAll<HTMLAnchorElement>(
			"[data-tag-slugs] [data-tag-slug]",
		),
	];
	const cards = [
		...document.querySelectorAll<HTMLElement>("[data-tag-slugs]"),
	].map((element) => ({
		element,
		tags: (element.dataset.tagSlugs ?? "").split(" ").filter(Boolean),
	}));
	const knownSlugs = new Set(cloudLinks.map(getSlug));

	function getSlug(link: HTMLElement) {
		return link.dataset.tagSlug ?? "";
	}

	function getLabel(link: HTMLElement) {
		return link.textContent?.trim() ?? "";
	}

	function getVisibleCards(selected: Set<string>) {
		return cards.filter(({ tags }) =>
			[...selected].every((slug) => tags.includes(slug)),
		);
	}

	function countTags(visibleCards: typeof cards) {
		const counts = new Map<string, number>();
		for (const { tags } of visibleCards) {
			for (const slug of tags) {
				counts.set(slug, (counts.get(slug) ?? 0) + 1);
			}
		}
		return counts;
	}

	function renderCloud(counts: Map<string, number>, selected: Set<string>) {
		const countOf = (link: HTMLElement) => counts.get(getSlug(link)) ?? 0;
		const maxCount = Math.max(1, ...counts.values());
		const focusedElement = document.activeElement;

		const ordered = cloudLinks.toSorted(
			(left, right) =>
				countOf(right) - countOf(left) ||
				getLabel(left).localeCompare(getLabel(right)),
		);

		for (const link of ordered) {
			const slug = getSlug(link);
			const count = countOf(link);
			const nextSelected = new Set(selected);
			if (!nextSelected.delete(slug)) nextSelected.add(slug);

			link.hidden = count === 0;
			link.href =
				nextSelected.size > 0
					? `/projects/?tags=${[...nextSelected].join(",")}`
					: "/projects/";
			link.style.fontSize = `${getTagCloudFontSize(count, maxCount)}px`;
			link.classList.toggle("tag-box--strong", isStrongTag(count));
			link.setAttribute(
				"aria-label",
				getTagAriaLabel(getLabel(link), count),
			);
		}

		cloud.append(...ordered);
		// Re-appending a focused link would otherwise drop keyboard focus.
		if (focusedElement instanceof HTMLElement) focusedElement.focus();
	}

	function renderActiveLinks(selected: Set<string>) {
		for (const link of [...cloudLinks, ...cardLinks]) {
			const isActive = selected.has(getSlug(link));
			link.classList.toggle("active", isActive);
			if (isActive) {
				link.setAttribute("aria-current", "true");
			} else {
				link.removeAttribute("aria-current");
			}
		}
	}

	function sync(selected: Set<string>) {
		const visibleCards = getVisibleCards(selected);
		if (visibleCards.length === 0) {
			// Reachable only through a hand-edited URL: an empty page helps
			// nobody, so fall back to showing everything.
			writeSelectedToUrl(new Set());
			sync(new Set());
			return;
		}

		for (const card of cards) {
			card.element.hidden = !visibleCards.includes(card);
		}
		renderCloud(countTags(visibleCards), selected);
		renderActiveLinks(selected);

		const count = visibleCards.length;
		summary.textContent = `Showing ${count} project${count === 1 ? "" : "s"}`;
		clearButton.hidden = selected.size === 0;
	}

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const link = target.closest<HTMLAnchorElement>("[data-tag-slug]");
		if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;

		event.preventDefault();
		const selected = getSelectedFromUrl(knownSlugs);
		const slug = getSlug(link);
		if (!selected.delete(slug)) selected.add(slug);
		writeSelectedToUrl(selected);
		sync(selected);
	});

	clearButton.addEventListener("click", () => {
		writeSelectedToUrl(new Set());
		sync(new Set());
	});

	sync(getSelectedFromUrl(knownSlugs));
}

if (cloud && summary && clearButton) {
	initProjectFilter(cloud, summary, clearButton);
}
