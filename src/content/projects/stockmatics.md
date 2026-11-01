---
title: StockMatics
description: AI-powered financial market analytics platform for tracking sentiment, political influence, and event-driven market behavior.
tags:
    - machine-learning
    - nlp
    - llm
    - fintech
    - python
    - pytorch
    - transformers
    - fastapi
    - nextjs
    - typescript
    - postgresql
    - data-engineering
    - backend
type: team
startedAt: 2025-02-28
completedAt: 2025-03-01
awards:
    - newsmatics-hackathon-2025-winner
featured: true
featuredOrder: 3

repo: https://github.com/newsmatics-hackathon-2025/team-ae2025-02-28
demo: https://www.youtube.com/watch?v=mfA4vSHSiD0

cover: ../../assets/projects/stockmatics/cover.webp

role: ML Engineer
shortRoleDescription: Developed NLP-driven analytics linking news sentiment with financial market behavior.
contribution: Designed database schemas and implemented PostgreSQL infrastructure using Neon, developed NLP-based sentiment analysis for the Fear and Greed index using NLTK, worked on transformer-based text embeddings for consensus analysis, and contributed to LLM-powered market summaries.

collaborators:
    - Robert Hudák
    - Dávid Kepič
    - Adrián Mikolaj
---

StockMatics was developed during the Newsmatics Hackathon 2025 as a platform for analyzing financial markets through the lens of news data, sentiment, and political influence. The goal was to uncover relationships between real-world events and market behavior using data-driven and machine learning approaches. The platform processes news articles and market data to identify spike events, analyze sentiment, and detect patterns that may influence financial markets. A key feature is the Fear and Greed Index, which scores sentiment by how positively or negatively companies are mentioned in news coverage.

Sentiment analysis was implemented using NLTK, while transformer-based embeddings measured consensus between news providers on the same topic. Large language models generated concise summaries of market developments. The platform also tracks political coverage and bias by analyzing the origin and timing of news articles.

The backend was built with Python and FastAPI, with a PostgreSQL database hosted on Neon. The frontend was built with Next.js and TypeScript. It won the Newsmatics Hackathon 2025.
