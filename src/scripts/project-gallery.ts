const SWITCH_THRESHOLD = 0.6;

const prefersReducedMotion = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollBehavior = (): ScrollBehavior =>
	prefersReducedMotion() ? "auto" : "smooth";

const isPlainLeftClick = (event: MouseEvent) =>
	event.button === 0 &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

function createYouTubeFrame(videoId: string, title: string) {
	const iframe = document.createElement("iframe");
	iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
	iframe.title = title;
	iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
	iframe.allowFullscreen = true;
	return iframe;
}

function initLightbox(
	gallery: HTMLElement,
	showSlideFor: (link: HTMLAnchorElement) => void,
) {
	const dialog = gallery.querySelector<HTMLDialogElement>("[data-lightbox]");
	const image = gallery.querySelector<HTMLImageElement>(
		"[data-lightbox-image]",
	);
	if (!dialog || !image) return null;

	const links = [
		...gallery.querySelectorAll<HTMLAnchorElement>("[data-zoom]"),
	];
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
		showSlideFor(link);
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

	links.forEach((link, index) => {
		link.addEventListener("click", (event) => {
			if (!isPlainLeftClick(event)) return;
			event.preventDefault();
			showImage(index);
			dialog.showModal();
		});
	});

	return { isOpen: () => dialog.open, step };
}

function initGallery(gallery: HTMLElement) {
	const track = gallery.querySelector<HTMLElement>("[data-slides]");
	if (!track) return;

	const slides = [...track.children] as HTMLElement[];
	const thumbStrip = gallery.querySelector<HTMLElement>("[data-thumbs]");
	const thumbs = [
		...gallery.querySelectorAll<HTMLAnchorElement>("[data-thumb]"),
	];
	const prevButton = gallery.querySelector<HTMLButtonElement>(
		"[data-gallery-prev]",
	);
	const nextButton = gallery.querySelector<HTMLButtonElement>(
		"[data-gallery-next]",
	);
	const youtubeLinkByFrame = new Map<HTMLIFrameElement, HTMLAnchorElement>();
	let activeIndex = 0;

	const stopMedia = (slide: HTMLElement) => {
		slide.querySelector("video")?.pause();

		const frame = slide.querySelector("iframe");
		const link = frame && youtubeLinkByFrame.get(frame);
		if (!frame || !link) return;
		// Removing the frame is the only way to stop a cross-origin player.
		frame.replaceWith(link);
		youtubeLinkByFrame.delete(frame);
	};

	const startMedia = (slide: HTMLElement) => {
		if (prefersReducedMotion()) return;
		// Rejection only means the browser refused autoplay; controls remain.
		slide
			.querySelector("video")
			?.play()
			.catch(() => {});
	};

	const centerThumb = (thumb: HTMLElement) => {
		if (!thumbStrip) return;
		const listItem = thumb.parentElement ?? thumb;
		thumbStrip.scrollTo({
			left:
				listItem.offsetLeft -
				(thumbStrip.clientWidth - listItem.offsetWidth) / 2,
			behavior: scrollBehavior(),
		});
	};

	const setActive = (index: number) => {
		activeIndex = index;
		slides.forEach((slide, slideIndex) => {
			const isActive = slideIndex === index;
			// Keeps off-screen links and players out of the tab order.
			slide.inert = !isActive;
			if (!isActive) stopMedia(slide);
		});
		thumbs.forEach((thumb, thumbIndex) => {
			thumb.setAttribute("aria-current", String(thumbIndex === index));
		});
		if (thumbs[index]) centerThumb(thumbs[index]);
		startMedia(slides[index]);
	};

	const show = (index: number) => {
		const target = (index + slides.length) % slides.length;
		track.scrollTo({
			left: slides[target].offsetLeft,
			behavior: scrollBehavior(),
		});
	};

	const lightbox = initLightbox(gallery, (link) => {
		const slide = link.closest("li");
		if (slide) show(slides.indexOf(slide));
	});

	// Observing the scroll position means swipes, arrows and thumbnails all
	// funnel through one code path.
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				setActive(slides.indexOf(entry.target as HTMLElement));
			}
		},
		{ root: track, threshold: SWITCH_THRESHOLD },
	);
	slides.forEach((slide) => observer.observe(slide));

	thumbs.forEach((thumb, index) => {
		thumb.addEventListener("click", (event) => {
			if (!isPlainLeftClick(event)) return;
			event.preventDefault();
			show(index);
		});
	});

	for (const [button, delta] of [
		[prevButton, -1],
		[nextButton, 1],
	] as const) {
		if (!button) continue;
		button.hidden = false;
		button.addEventListener("click", () => show(activeIndex + delta));
	}

	track.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element) || !isPlainLeftClick(event)) return;

		const link = target.closest<HTMLAnchorElement>("[data-youtube-id]");
		if (!link?.dataset.youtubeId) return;

		event.preventDefault();
		const label = link.getAttribute("aria-label") ?? "Video";
		const frame = createYouTubeFrame(link.dataset.youtubeId, label);
		youtubeLinkByFrame.set(frame, link);
		link.replaceWith(frame);
		frame.focus();
	});

	gallery.addEventListener("keydown", (event) => {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		// Arrow keys on a focused player seek within the video.
		if (event.target instanceof HTMLVideoElement) return;

		event.preventDefault();
		const delta = event.key === "ArrowLeft" ? -1 : 1;
		if (lightbox?.isOpen()) {
			lightbox.step(delta);
		} else {
			show(activeIndex + delta);
		}
	});

	setActive(0);
}

document.querySelectorAll<HTMLElement>("[data-gallery]").forEach(initGallery);
