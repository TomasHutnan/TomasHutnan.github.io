---
title: Ministry of Truth
description: Text-based decision-making game implemented in .NET MAUI, focusing on data-driven architecture and clean separation of concerns.
tags:
  - csharp
  - dotnet
  - maui
  - game-development
  - mvvm
  - software-architecture
  - data-processing
type: solo
startedAt: 2026-04-17
completedAt: 2026-05-10
featured: true

repo: https://github.com/TomasHutnan/ministry-of-truth

cover: ../../assets/projects/ministry-of-truth/cover.webp

role: Full-stack Developer
contribution: Designed and implemented the full application architecture, including a game engine, data handling layer, MVVM-based UI structure, and dependency injection setup, with focus on testability and separation of concerns.
---

Ministry of Truth is a text-based decision-making game developed as a course project for PB178: Introduction to Development in C#/.NET. The game places the player in the role of a state censor, making rapid decisions to approve or reject documents under a dynamically changing ideological rule set.

The core gameplay revolves around time-pressured decisions, where each round presents a short text along with an active rule. Players must carefully balance correctness and restraint, as both mistakes and over-censorship are penalized.

The application was designed with a strong emphasis on clean architecture and testability. Game logic is fully separated from UI and persistence layers, enabling easier validation and extension. Data is handled in a data-driven manner, with texts, rules, and violations loaded from CSV files. The system supports complex CSV parsing, including quoted fields and embedded delimiters.

A unified repository layer manages data access, text set loading, and persistence, supporting both bundled default datasets and custom user-provided ZIP archives. Text sets are extracted into application storage and made available through a centralized repository implementation.

The UI layer follows the MVVM pattern, with dependency injection used to construct views and provide view models. Navigation is handled via a dedicated service capable of passing runtime state between screens, such as game results and scoring data.

Additional features include visual feedback systems such as loading overlays and dynamic UI updates during gameplay, including time-based progress indicators and error highlighting.

This project demonstrates strong understanding of software architecture principles, including separation of concerns, data-driven design, and maintainable system structure within a modern .NET application.