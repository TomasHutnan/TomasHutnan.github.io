/** Public services are on the internet behind Caddy; the rest only on my tailnet. */
export type Access = "public" | "tailscale";

export interface Service {
	id: string;
	name: string;
	/** What it is, in a few words. */
	role: string;
	/** What it does for me. */
	description: string;
	access: Access;
	/** Subdomain of hutnan.dev, for public services. */
	subdomain?: string;
	/** False when the address has no page a visitor could open, like a DAV endpoint. */
	browsable?: boolean;
}

/** Things under hutnan.dev that don't run on the server. */
export interface ExternalService {
	name: string;
	role: string;
	address: string;
	href?: string;
	host: string;
}

export const homelabIntro =
	"The services I run for myself on one small Hetzner VPS under hutnan.dev. Everything is a Docker Compose stack, and everything public sits behind a single Caddy proxy.";

export const services: Service[] = [
	{
		id: "forgejo",
		name: "Forgejo",
		role: "Git hosting",
		description:
			"Self-hosted Git forge for private repositories, mirrors and experiments that don't belong on GitHub.",
		access: "public",
		subdomain: "git",
	},
	{
		id: "live",
		name: "Live",
		role: "Live presentations",
		description:
			"My own service for teaching from Quarto reveal.js decks: students follow on their own screens, I draw on the slides, and the room asks questions.",
		access: "public",
		subdomain: "live",
	},
	{
		id: "seafile",
		name: "Seafile",
		role: "Files and drive",
		description:
			"File sync and sharing across my devices, in place of a commercial cloud drive.",
		access: "public",
		subdomain: "drive",
	},
	{
		id: "searxng",
		name: "SearXNG",
		role: "Metasearch engine",
		description:
			"Private search that queries several engines at once, without tracking or ads.",
		access: "public",
		subdomain: "search",
	},
	{
		id: "vaultwarden",
		name: "Vaultwarden",
		role: "Passwords",
		description:
			"A lightweight Bitwarden-compatible server. The official Bitwarden apps encrypt the vault on my devices and sync it here, so the server only ever stores ciphertext.",
		access: "public",
		subdomain: "vault",
	},
	{
		id: "xandikos",
		name: "Xandikos",
		role: "Contacts and calendar sync",
		description:
			"A small CardDAV and CalDAV server that keeps contacts and calendars in sync across phone and laptop.",
		access: "public",
		subdomain: "dav",
		browsable: false,
	},
	{
		id: "paperless",
		name: "Paperless-ngx",
		role: "Document archive",
		description:
			"Scanned letters and documents, OCR'd, tagged and searchable.",
		access: "tailscale",
	},
	{
		id: "dockge",
		name: "Dockge",
		role: "Stack manager",
		description:
			"A web UI over the Compose files: start, stop, update and edit each stack.",
		access: "tailscale",
	},
	{
		id: "glances",
		name: "Glances",
		role: "System metrics",
		description:
			"Live CPU, memory, disk and container usage for the server.",
		access: "tailscale",
	},
];

export const externalServices: ExternalService[] = [
	{
		name: "This site",
		role: "Portfolio",
		address: "hutnan.dev",
		href: "https://hutnan.dev",
		host: "GitHub Pages",
	},
	{
		name: "Drill",
		role: "Practice tests",
		address: "drill.hutnan.dev",
		href: "https://drill.hutnan.dev",
		host: "GitHub Pages",
	},
	{
		name: "Mail",
		role: "Email",
		address: "tomas@hutnan.dev",
		href: "mailto:tomas@hutnan.dev",
		host: "Purelymail",
	},
];

export function getServiceUrl(service: Service) {
	return service.subdomain
		? `https://${service.subdomain}.hutnan.dev`
		: undefined;
}

/** How the pieces fit together, shown under the diagram. */
export const homelabPractices = [
	{
		title: "One proxy, configured by labels",
		text: "Caddy runs with caddy-docker-proxy. Every public stack joins one Docker network, web, and declares its domain in Compose labels; Caddy picks it up and serves it over HTTPS with automatic certificates.",
	},
	{
		title: "Admin tools off the internet",
		text: "Paperless, Dockge and Glances are reachable only over Tailscale, from my own devices.",
	},
	{
		title: "Not relying on obscurity",
		text: "Listing everything here is deliberate. Each service has its own strong password, and nothing depends on an address staying secret.",
	},
	{
		title: "Dashboard from the same labels",
		text: "A Homepage dashboard lists the services, grouped from the same Compose labels, so adding a stack adds its tile.",
	},
];
