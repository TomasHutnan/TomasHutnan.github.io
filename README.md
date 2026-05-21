# Portfolio (Astro)

A minimal personal portfolio built with Astro. Content is driven by Markdown files in the `content/` folder and rendered with lightweight Astro components.

**Quick Start**

- **Prerequisites**: Node.js >= 22.12.0
- **Install**: `npm install`
- **Develop**: `npm run dev` — starts the local dev server
- **Build**: `npm run build`
- **Preview**: `npm run preview`

**Project Structure**

- **Content**: content/ — Markdown entries for projects and awards (see [content/projects](content/projects))
- **Pages & Layouts**: src/pages, src/layouts — site routes and layout templates
- **Components**: src/components — reusable UI pieces (e.g., `Navbar.astro`, `ProjectCard.astro`)
- **Assets**: src/assets or public/ — images and static files

**Add or Edit Content**

- Create a new Markdown file in `content/projects` with frontmatter (title, slug, date, tags, short description). The site reads these files and generates the project pages.

Example frontmatter:

```yaml
---
title: "My Project"
slug: "my-project"
date: 2025-01-01
tags: [astro, web]
description: "Short summary of the project."
---
```

**Deploy**

- Build and publish the `dist/` output to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

**License**

This repository is licensed under the terms in the `LICENSE` file.
