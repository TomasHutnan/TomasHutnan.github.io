export const isPlainLeftClick = (event: MouseEvent) =>
	event.button === 0 &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

export function createLightbox(
	root: HTMLElement,
	onShow?: (link: HTMLAnchorElement) => void,
) {
	const dialog = root.querySelector<HTMLDialogElement>("[data-lightbox]");
	const image = root.querySelector<HTMLImageElement>("[data-lightbox-image]");
	if (!dialog || !image) return null;

	const links = [...root.querySelectorAll<HTMLAnchorElement>("[data-zoom]")];
	const prevButton = dialog.querySelector<HTMLElement>(
		"[data-lightbox-prev]",
	);
	const nextButton = dialog.querySelector<HTMLElement>(
		"[data-lightbox-next]",
	);
	let currentIndex = 0;

	const showImage = (index: number) => {
		currentIndex = (index + links.length) % links.length;
		const link = links[currentIndex];
		image.src = link.href;
		image.alt = link.querySelector("img")?.alt ?? "";
		onShow?.(link);
	};

	const step = (delta: number) => showImage(currentIndex + delta);

	for (const button of [prevButton, nextButton]) {
		if (button) button.hidden = links.length < 2;
	}
	prevButton?.addEventListener("click", () => step(-1));
	nextButton?.addEventListener("click", () => step(1));
	dialog
		.querySelector("[data-lightbox-close]")
		?.addEventListener("click", () => dialog.close());

	// A click on the dialog itself, not its content, landed on the backdrop.
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close();
	});

	dialog.addEventListener("keydown", (event) => {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		event.preventDefault();
		step(event.key === "ArrowLeft" ? -1 : 1);
	});

	links.forEach((link, index) => {
		link.addEventListener("click", (event) => {
			if (!isPlainLeftClick(event)) return;
			event.preventDefault();
			showImage(index);
			dialog.showModal();
		});
	});

	return { isOpen: () => dialog.open };
}
