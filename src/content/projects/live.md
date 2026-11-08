---
title: Live
description: Self-hosted service for presenting Quarto slide decks live, with ink that follows each slide and step, offline-safe sync and audience questions.
tags:
    - typescript
    - backend
    - system-design
    - docker
    - testing
    - ui-development
type: solo
startedAt: 2026-10-31
featured: false

repo: https://github.com/TomasHutnan/live

cover: ../../assets/projects/live/cover.webp
gallery:
    - image: ../../assets/projects/live/presenter.webp
      alt: Presenter view of a logic seminar slide with a highlighted formula, a circled "De Morgan", a tick and a handwritten note, beside a panel with the next step and two audience questions.
    - image: ../../assets/projects/live/phones.webp
      alt: Two phones following the same annotated slide; one shows the question sheet, where the audience votes on questions and asks new ones.
    - image: ../../assets/projects/live/questions.webp
      alt: The projected question board, listing five audience questions in Slovak, ordered by their votes.
    - image: ../../assets/projects/live/join.webp
      alt: The projected join screen, a large QR code beside "Pripojte sa a pýtajte sa" and the short link live.hutnan.dev/pb016.

role: Full-Stack Developer
shortRoleDescription: Designed and built a realtime presenting service, from the WebSocket protocol to the container it ships in.
contribution: Built it alone, from the WebSocket protocol, outbox and SQLite storage to the presenter controls, the viewer, the offline export and the hardened container image, with unit and end-to-end tests throughout.
---

Live is the service I use to teach seminars at Masaryk University. I upload a Quarto reveal.js deck, share a link, and present from a password-protected page while drawing on the slides. Students follow on their own screens slide by slide and step by step, and ask questions that the rest of the room can vote up. Afterwards the annotated deck downloads as a single HTML file that works offline.

Ink belongs to the slide and step it was drawn on, so it hides when the presenter steps back and returns when they step forward. A Wi-Fi drop loses nothing: strokes, moves and questions wait in an outbox until the server acknowledges them, and every message is idempotent, so a resend after reconnecting can't duplicate or revive anything. Live strokes stream as best-effort previews, and the finished stroke is what's stored.

It's deliberately small: one Fastify process, one container, SQLite and files on a single volume. The server never runs anything it receives, decks are immutable so stored ink keeps its positions, and the container runs as a non-root user on a read-only filesystem. Requests from a foreign origin are refused, and the login rate limit can't lock out the presenter when a whole university shares one IP address. Unit tests and Playwright end-to-end tests on a real seminar deck run on every push, and only a green build publishes the image.
