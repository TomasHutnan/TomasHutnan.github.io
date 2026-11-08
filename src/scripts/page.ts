/**
 * Runs `setup` on every page: the first load and each client-side navigation.
 * Module scripts only execute once, so anything that touches the page has to
 * start here. Listeners on `document` or `window` should take the signal, which
 * aborts when the page is swapped out, so they don't outlive their page.
 */
export function onPageLoad(setup: (signal: AbortSignal) => void) {
	let controller: AbortController | undefined;
	document.addEventListener("astro:before-swap", () => controller?.abort());
	document.addEventListener("astro:page-load", () => {
		controller?.abort();
		controller = new AbortController();
		setup(controller.signal);
	});
}
