export type ServiceGroup = "apps" | "admin";

export interface Service {
	id: string;
	name: string;
	/** What it is, in a few words. */
	role: string;
	/** What it does for me. */
	description: string;
	group: ServiceGroup;
	/** Only for services meant to be open to visitors. */
	href?: string;
}

export const homelabIntro =
	"The services I run for myself on one small VPS under hutnan.dev. Everything is a Docker Compose stack behind a single Caddy proxy.";

export const services: Service[] = [
	{
		id: "forgejo",
		name: "Forgejo",
		role: "Git hosting",
		description:
			"Self-hosted Git forge for private repositories, mirrors and experiments that don't belong on GitHub.",
		group: "apps",
	},
	{
		id: "live",
		name: "Live",
		role: "Live presentations",
		description:
			"My own service for presenting Quarto reveal.js decks: viewers follow along on their phones, I draw on the slides, and the audience asks questions.",
		group: "apps",
		href: "https://live.hutnan.dev",
	},
	{
		id: "seafile",
		name: "Seafile",
		role: "Files and drive",
		description:
			"File sync and sharing across my devices, in place of a commercial cloud drive.",
		group: "apps",
	},
	{
		id: "searxng",
		name: "SearXNG",
		role: "Metasearch engine",
		description:
			"Private search that queries several engines at once, without tracking or ads.",
		group: "apps",
	},
	{
		id: "vaultwarden",
		name: "Vaultwarden",
		role: "Passwords",
		description:
			"A lightweight Bitwarden-compatible server, so the official Bitwarden apps sync against my own vault.",
		group: "apps",
	},
	{
		id: "xandikos",
		name: "Xandikos",
		role: "Contacts and calendar sync",
		description:
			"A small CardDAV and CalDAV server that keeps contacts and calendars in sync across phone and laptop.",
		group: "apps",
	},
	{
		id: "dockge",
		name: "Dockge",
		role: "Stack manager",
		description:
			"A web UI over the Compose files: start, stop, update and edit each stack.",
		group: "admin",
	},
	{
		id: "glances",
		name: "Glances",
		role: "System metrics",
		description:
			"Live CPU, memory, disk and container usage for the server.",
		group: "admin",
	},
	{
		id: "paperless",
		name: "Paperless-ngx",
		role: "Document archive",
		description:
			"Scanned letters and documents, OCR'd, tagged and searchable.",
		group: "admin",
	},
];

/** How the pieces fit together, shown under the diagram. */
export const homelabPractices = [
	{
		title: "One proxy, configured by labels",
		text: "Caddy runs with caddy-docker-proxy. Each container declares its own domain in Compose labels, Caddy picks it up and serves it over HTTPS with automatic certificates.",
	},
	{
		title: "A shared network",
		text: "Every stack joins one Docker network, web. Only Caddy publishes ports, so no app is reachable except through the proxy.",
	},
	{
		title: "Dashboard from the same labels",
		text: "A Homepage dashboard lists the services, grouped from the same Compose labels, so adding a stack adds its tile.",
	},
	{
		title: "Admin tools stay private",
		text: "Dockge, Glances and Paperless can control or expose the server and my documents, so they aren't linked anywhere public.",
	},
];
