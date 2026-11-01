---
title: Ministry of Truth
description: Text-based decision-making game implemented in .NET MAUI, focusing on data-driven architecture and clean separation of concerns.
tags:
    - csharp
    - dotnet
    - game-development
    - system-design
    - ui-development
type: university
startedAt: 2026-04-17
completedAt: 2026-05-10
featured: false

repo: https://github.com/TomasHutnan/ministry-of-truth

cover: ../../assets/projects/ministry-of-truth/cover.webp

role: Software Engineer
shortRoleDescription: Built a data-driven game with clean architecture and testable logic in .NET MAUI.
contribution: Designed and implemented the full application architecture, including a game engine, data handling layer, MVVM-based UI structure, and dependency injection setup, decomposing the code so each feature could be tested on its own.
---

Ministry of Truth is a text-based game built for PB178: Introduction to Development in C#/.NET. The player is a state censor, approving or rejecting documents against changing rules under time pressure. Mistakes and over-censorship are both penalized.

Game logic is separated from the UI and data layers, and the code is decomposed so each feature can be tested on its own. Texts and rules load from CSV files, from either bundled sets or user-supplied ZIP archives. The UI uses MVVM with dependency injection.
