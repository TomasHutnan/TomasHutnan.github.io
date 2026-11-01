export function getExternalLinkProps(href: string) {
	if (href.startsWith("mailto:")) return {};
	return { target: "_blank", rel: "noopener noreferrer" };
}
