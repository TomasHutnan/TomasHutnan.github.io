import { isStrongTag } from "../utils/tags";
import { createTagCloud } from "./tag-cloud";

// Clouds that only link to the projects page. The projects page's own cloud
// is driven by project-filter.ts instead, so it isn't marked static.
for (const cloud of document.querySelectorAll<HTMLElement>(
	"[data-tag-cloud-static]",
)) {
	const words = [
		...cloud.querySelectorAll<HTMLElement>("[data-tag-count]"),
	].map((element) => {
		const count = Number(element.dataset.tagCount);
		return { element, count, strong: isStrongTag(count) };
	});
	createTagCloud(cloud).update(words);
}
