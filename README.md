# Portfolio (Astro)

Personal portfolio of Tomáš Hutňan, live at [hutnan.dev](https://hutnan.dev). A static Astro site with content in Markdown and no CSS framework.

## Quick start

Requires Node.js >= 22.12 (`mise.toml` pins the version CI uses).

```sh
npm install
npm run dev        # local dev server
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Before pushing, run `npx prettier --check .`, `npm run lint` and `npm run typecheck`. CI runs the same checks, and a deploy waits for them to pass.

## Project structure

- `src/content/projects`, `src/content/awards`: Markdown entries, validated by `src/content.config.ts`.
- `src/data/home.ts`: home page copy.
- `src/data/tags.ts`: the tag taxonomy, mapping each slug to its display label.
- `src/pages`, `src/layouts`, `src/components`: routes and UI.
- `src/scripts`: browser code for the project filter and gallery.
- `src/utils`: shared logic for dates, tags, projects and awards.
- `src/pages/og`: link-preview cards (1200×630 JPEG), drawn at build time by `src/utils/share-card.ts`. Pages pick theirs with `<Layout shareCard>`.
- `public/media`: videos, which Astro's image pipeline can't process.

## Adding a project

Create `src/content/projects/my-project.md`. The filename is the URL slug.

```yaml
---
title: My Project
description: Short summary of the project.
tags: # slugs from src/data/tags.ts, most important first; cards show four
    - python
    - machine-learning
type: solo # solo | team | university
role: ML Engineer
startedAt: 2026-01-01
completedAt: 2026-02-01 # omit while in progress

cover: ../../assets/projects/my-project/cover.webp

repo: https://github.com/you/my-project
demo: https://www.youtube.com/watch?v=VIDEO_ID
---
The Markdown body is the project write-up.
```

A tag that isn't in `src/data/tags.ts` fails the build. Add it there first if it's genuinely new.

### Gallery

The media viewer appears on a project's page when it has at least one slide, and takes the place of the cover. A YouTube `demo` automatically becomes the first slide. It uses the cover as its poster and loads nothing from YouTube until it's played. Add more slides with `gallery`:

```yaml
gallery:
    - image: ../../assets/projects/my-project/1.webp
      alt: What the screenshot shows.
    - video: # in public/media/; smallest format first
          - /media/projects/my-project/clip.webm
          - /media/projects/my-project/clip.mp4
      poster: ../../assets/projects/my-project/cover.webp
      alt: What the clip shows.
```

Any aspect ratio works, because media is letterboxed rather than cropped.

## Deploy

Pushing to `main` runs the CI checks and then deploys to GitHub Pages.

## License

This repository is licensed under the terms in the `LICENSE` file.
