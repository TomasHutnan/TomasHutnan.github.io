---
title: StockMatics
description: AI-powered financial market analytics platform for tracking sentiment, political influence, and event-driven market behavior.
tags:
  - python
  - machine-learning
  - natural-language-processing
  - pytorch
  - transformers
  - fastapi
  - nextjs
  - typescript
  - postgresql
  - data-analysis
  - fintech
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

StockMatics was developed during the Newsmatics Hackathon 2025 as a platform for analyzing financial markets through the lens of news data, sentiment, and political influence. The goal was to uncover relationships between real-world events and market behavior using data-driven and machine learning approaches.

The platform processes large volumes of news articles and market data to identify spike events, analyze sentiment, and detect patterns that may influence financial markets. A key feature is the Fear and Greed Index, which quantifies sentiment by evaluating how positively or negatively specific companies are mentioned in news coverage.

The system integrates natural language processing techniques to extract insights from unstructured text. Sentiment analysis was implemented using NLTK, while transformer-based embeddings were used to measure consensus between different news providers on the same topic. Large language models were also utilized to generate concise summaries of market developments.

In addition to sentiment analysis, the platform tracks political coverage and bias by analyzing the origin and timing of news articles, enabling users to better understand how geopolitical narratives align with market movements.

The backend was built with Python and FastAPI, with a PostgreSQL database hosted on Neon for scalable data storage and querying. The frontend, developed with Next.js and TypeScript, provides an interactive interface for exploring analytics and visualizations.

StockMatics demonstrates how machine learning, NLP, and data engineering can be combined to build a meaningful tool for interpreting complex financial systems. The project was recognized as the overall winner of the Newsmatics Hackathon 2025.