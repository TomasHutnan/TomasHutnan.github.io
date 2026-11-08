/**
 * Only the cover of the card that was clicked morphs into its project page.
 * Cards carry their name as data, not as a view-transition-name, because the
 * home page and the projects page show the same cards: with names on all of
 * them, every card would fly to its new spot on each navigation.
 */
document.addEventListener("astro:before-preparation", (event) => {
	for (const element of document.querySelectorAll<HTMLElement>(
		"[data-cover-transition]",
	)) {
		element.style.viewTransitionName = "";
	}

	const source = event.sourceElement;
	const cover = source
		?.closest(".project-card")
		?.querySelector<HTMLElement>("[data-cover-transition]");
	if (cover && source instanceof HTMLAnchorElement) {
		cover.style.viewTransitionName = cover.dataset.coverTransition ?? "";
	}
});
