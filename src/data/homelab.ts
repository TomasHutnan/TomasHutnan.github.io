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
	"The services I run for myself under hutnan.dev, on one small Hetzner VPS in the EU, because where my data is stored matters to me. Everything is a Docker Compose stack, and everything public sits behind a single Caddy proxy.";

export const services: Service[] = [
	{
		id: "forgejo",
		name: "Forgejo",
		role: "Git hosting",
		description:
			"Holds my Obsidian vault, one of the most personal things I own. It's mostly plain text and I want its full history, so it belongs in Git, just not on a public Git host.",
		access: "public",
		subdomain: "git",
	},
	{
		id: "live",
		name: "Live",
		role: "Live presentations",
		description:
			"My own service for teaching from Quarto reveal.js decks: students type the session code on its home page, follow on their own screens and ask questions while I draw on the slides.",
		access: "public",
		subdomain: "live",
	},
	{
		id: "seafile",
		name: "Seafile",
		role: "Files and drive",
		description:
			"My Google Drive replacement for whatever doesn't fit Paperless or Git: school presentations, PDF assignments, large binaries and the sheets for shared finances and split bills. Nextcloud was far more than I needed.",
		access: "public",
		subdomain: "drive",
	},
	{
		id: "searxng",
		name: "SearXNG",
		role: "Metasearch engine",
		description:
			"The default search on my laptop, iPad and GrapheneOS phone. It queries several engines at once, without tracking or ads.",
		access: "public",
		subdomain: "search",
	},
	{
		id: "vaultwarden",
		name: "Vaultwarden",
		role: "Passwords",
		description:
			"Replaced years of Firefox's built-in passwords, which always felt too exposed. The official Bitwarden apps encrypt the vault on my devices, so the server only ever stores ciphertext.",
		access: "public",
		subdomain: "vault",
	},
	{
		id: "xandikos",
		name: "Xandikos",
		role: "Contacts and calendar sync",
		description:
			"CardDAV and CalDAV for one person, with no accounts to create or secure. Thunderbird syncs it on my laptop; DAVx⁵, Fossify Calendar and the contacts app on my phone.",
		access: "public",
		subdomain: "dav",
		browsable: false,
	},
	{
		id: "paperless",
		name: "Paperless-ngx",
		role: "Document archive",
		description:
			"Every important document, uploaded and tagged through its web interface and OCR'd locally so it's searchable. That OCR is also the server's biggest CPU spike.",
		access: "tailscale",
	},
	{
		id: "dockge",
		name: "Dockge",
		role: "Stack manager",
		description:
			"A web UI over the Compose files, and where I review and apply every update. It does what I need from Portainer without the heavier UI or Kubernetes support.",
		access: "tailscale",
	},
	{
		id: "glances",
		name: "Glances",
		role: "System metrics",
		description:
			"CPU, memory, disk and container usage. Lately it shows the server filling up.",
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
		name: "Domain and backups",
		role: "Registrar and storage",
		address: "R2 object storage",
		host: "Cloudflare",
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
		title: "Lean on purpose",
		text: "Each service is the lightest tool that does the job. That keeps the attack surface small enough to reason about, and fits everything on a budget VPS.",
	},
	{
		title: "One proxy, configured by labels",
		text: "Caddy runs with caddy-docker-proxy. Every public stack joins one Docker network, web, and declares its domain in Compose labels; Caddy serves it over HTTPS with automatic certificates. The same labels feed a Homepage dashboard, so a new stack gets its tile automatically.",
	},
	{
		title: "Admin off the internet, nothing hidden",
		text: "Paperless, Dockge and Glances are reachable only over Tailscale. The rest is listed here on purpose: each service has its own strong password, and nothing depends on an address staying secret.",
	},
	{
		title: "Backups off the box",
		text: "restic pushes the data and the Compose files to Cloudflare R2 object storage.",
	},
	{
		title: "Updates by hand",
		text: "I review and apply container updates in Dockge, and update the server myself, only when I have time to fix whatever breaks. Nothing updates on its own, so a key service never breaks at a bad moment.",
	},
	{
		title: "What's next",
		text: "Glances shows the server filling up, and Paperless spikes the CPU while it OCRs an upload. The likely next step is a second VPS that runs only the core services.",
	},
];
