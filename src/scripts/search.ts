import type { SearchEntry } from "../utils/search-index";
import { normalize, prepare, search } from "./search-match";
import { onPageLoad } from "./page";

const GROUP_LABELS: Record<SearchEntry["kind"], string> = {
	page: "Pages",
	project: "Projects",
	tag: "Tags",
	award: "Awards",
};

/** Wraps the parts of `text` that match a query word in <mark>. */
function highlight(text: string, terms: string[]): DocumentFragment {
	const fragment = document.createDocumentFragment();
	const folded = normalize(text);
	// Normalising never changes length for the Latin text used here, but
	// guard anyway so a mismatch can't misplace the marks.
	if (folded.length !== text.length || terms.length === 0) {
		fragment.append(text);
		return fragment;
	}

	const marked = new Array<boolean>(text.length).fill(false);
	for (const term of terms) {
		let from = folded.indexOf(term);
		while (from !== -1) {
			marked.fill(true, from, from + term.length);
			from = folded.indexOf(term, from + term.length);
		}
	}

	let start = 0;
	for (let index = 1; index <= text.length; index++) {
		if (index < text.length && marked[index] === marked[start]) continue;
		const piece = text.slice(start, index);
		if (marked[start]) {
			const mark = document.createElement("mark");
			mark.textContent = piece;
			fragment.append(mark);
		} else {
			fragment.append(piece);
		}
		start = index;
	}
	return fragment;
}

function initSearch(
	dialog: HTMLDialogElement,
	indexJson: string,
	signal: AbortSignal,
) {
	const input = dialog.querySelector<HTMLInputElement>("[data-search-input]");
	const list = dialog.querySelector<HTMLUListElement>(
		"[data-search-results]",
	);
	const empty = dialog.querySelector<HTMLElement>("[data-search-empty]");
	if (!input || !list || !empty) return;

	const items = prepare(JSON.parse(indexJson) as SearchEntry[]);
	let options: HTMLAnchorElement[] = [];
	let active = 0;

	function setActive(index: number) {
		if (options.length === 0) return;
		active = (index + options.length) % options.length;
		options.forEach((option, position) =>
			option.setAttribute("aria-selected", String(position === active)),
		);
		const current = options[active];
		input!.setAttribute("aria-activedescendant", current.id);
		current.scrollIntoView({ block: "nearest" });
	}

	function render() {
		const query = input!.value;
		const terms = normalize(query).split(/\s+/).filter(Boolean);
		const results = search(items, query);

		// Group by kind, keeping each group in rank order and the groups in
		// the order their best result ranked.
		const groups = new Map<SearchEntry["kind"], SearchEntry[]>();
		for (const entry of results) {
			const group = groups.get(entry.kind) ?? [];
			group.push(entry);
			groups.set(entry.kind, group);
		}

		list!.replaceChildren();
		options = [];
		for (const [kind, entries] of groups) {
			const heading = document.createElement("li");
			heading.className = "search-group";
			heading.setAttribute("role", "presentation");
			heading.textContent = GROUP_LABELS[kind];
			list!.append(heading);

			for (const entry of entries) {
				const item = document.createElement("li");
				item.setAttribute("role", "presentation");
				const link = document.createElement("a");
				link.id = `search-option-${options.length}`;
				link.href = entry.href;
				link.setAttribute("role", "option");
				const title = document.createElement("span");
				title.append(highlight(entry.title, terms));
				const detail = document.createElement("span");
				detail.className = "search-detail";
				detail.append(highlight(entry.detail, terms));
				link.append(title, detail);
				item.append(link);
				list!.append(item);
				options.push(link);
			}
		}

		empty!.hidden = options.length > 0;
		if (options.length > 0) setActive(0);
		else input!.removeAttribute("aria-activedescendant");
	}

	function open() {
		if (dialog.open) return;
		input!.value = "";
		render();
		dialog.showModal();
		input!.focus();
	}

	input.addEventListener("input", render);

	input.addEventListener("keydown", (event) => {
		// A search field's own Escape only clears the text, so close here.
		if (event.key === "Escape") dialog.close();
		else if (event.key === "ArrowDown") setActive(active + 1);
		else if (event.key === "ArrowUp") setActive(active - 1);
		else if (event.key === "Enter" && options[active]) {
			options[active].click();
		} else return;
		event.preventDefault();
	});

	list.addEventListener("mousemove", (event) => {
		const link = (event.target as Element).closest("a");
		const index = link ? options.indexOf(link) : -1;
		if (index !== -1 && index !== active) setActive(index);
	});

	// Following a link to the page already open (a tag on /projects/, say)
	// wouldn't reload anything, so close the dialog either way.
	list.addEventListener("click", () => dialog.close());

	// A click on the backdrop lands on the dialog element itself.
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close();
	});

	document.addEventListener(
		"keydown",
		(event) => {
			const target = event.target as HTMLElement;
			const typing =
				target.isContentEditable ||
				["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

			if (
				(event.metaKey || event.ctrlKey) &&
				event.key.toLowerCase() === "k"
			) {
				event.preventDefault();
				if (dialog.open) dialog.close();
				else open();
			} else if (event.key === "/" && !typing && !dialog.open) {
				event.preventDefault();
				open();
			}
		},
		{ signal },
	);

	for (const trigger of document.querySelectorAll("[data-search-open]")) {
		trigger.addEventListener("click", open);
	}
}

onPageLoad((signal) => {
	// The button shows Ctrl K until it knows it's on a Mac.
	if (/Mac|iPhone|iPad/.test(navigator.platform)) {
		for (const shortcut of document.querySelectorAll(
			"[data-search-shortcut]",
		)) {
			shortcut.textContent = "⌘K";
		}
	}

	const dialog = document.querySelector<HTMLDialogElement>("[data-search]");
	const indexJson = document.querySelector(
		"[data-search-index]",
	)?.textContent;
	if (dialog && indexJson) initSearch(dialog, indexJson, signal);
});
