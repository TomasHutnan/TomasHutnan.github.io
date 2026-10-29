---
title: InteraX
description: End-to-end clinical pharmacology pipeline screening for critical drug-drug interactions with HL7 FHIR export and local RAG search.
tags:
    - python
    - medical-ai
    - machine-learning
    - rag
    - vector-search
    - fhir
    - data-processing
type: team
startedAt: 2026-10-16
completedAt: 2026-10-17
featured: false

repo: https://github.com/TomasHutnan/interax
demo: https://www.youtube.com/watch?v=o8Fo_oQnjxc

cover: ../../assets/projects/interax/cover.webp

role: ML Engineer
shortRoleDescription: Architected clinical data integration, FHIR infrastructure, and vector search for DDI screening.
contribution: Harmonized disparate clinical datasets (SÚKL, DDInter, CPIC), developed initial extraction and transformation logic in Jupyter prototypes, structured the local Drug-Drug Interaction database, architected HL7 FHIR cloud deployment, and implemented an InterSystems IRIS Vector Search database for RAG-powered clinical guideline evaluation.

collaborators:
    - Dávid Kepič
    - Adrián Mikolaj
    - Jakub Blišťan
---

InteraX was developed during Rakathon 2026 for the PillGaze challenge as an end-to-end clinical pharmacology pipeline designed to streamline medication safety. The system tackles the challenge of ingesting unstructured medication data, standardizing it against trusted medical registries, and screening for critical drug-drug interactions (DDIs) before exporting interoperable patient health records.

To ensure clinical reliability, the pipeline harmonizes disparate data sources into a unified extraction and screening format. This includes linking national databases such as the Czech State Institute for Drug Control (SÚKL) registry with interaction databases like DDInter and clinical pharmacogenomics guidelines from CPIC. Unstructured medication inputs are parsed, normalized, and converted into secure, standardized HL7 FHIR Release 4 payloads ready for modern healthcare system integration.

To avoid reliance on restrictive external third-party APIs, the platform incorporates a local vector database built on InterSystems IRIS Vector Search. Complex clinical guidelines and interaction literature are embedded and indexed locally, powering a context-aware Retrieval-Augmented Generation (RAG) system that evaluates interaction risks directly within the project's self-hosted infrastructure.

Development followed a rapid iterative workflow, starting with Jupyter notebook proofs of concept to validate extraction, transformation, and interaction logic against sample datasets. Once validated, workflows were transitioned into production API services backed by a structured local interaction database and cloud-deployed FHIR infrastructure.

InteraX demonstrates how modern data engineering, local vector search, and healthcare interoperability standards can be united to deliver a reliable, privacy-preserving clinical decision support system under hackathon time constraints.
