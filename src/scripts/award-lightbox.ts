import { createLightbox } from "./lightbox";
import { onPageLoad } from "./page";

onPageLoad(() => {
	document
		.querySelectorAll<HTMLElement>("[data-award-photos]")
		.forEach((root) => createLightbox(root));
});
