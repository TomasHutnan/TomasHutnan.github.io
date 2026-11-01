import { createLightbox } from "./lightbox";

document
	.querySelectorAll<HTMLElement>("[data-award-photos]")
	.forEach((root) => createLightbox(root));
