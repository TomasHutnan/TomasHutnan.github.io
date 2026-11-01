---
title: InteraX
description: Hackathon prototype that screens medications for drug-drug interactions, with HL7 FHIR export and guideline-based RAG search.
tags:
    - medical-ai
    - rag
    - fhir
    - python
    - machine-learning
    - llm
    - data-engineering
    - system-design
type: team
startedAt: 2026-10-16
completedAt: 2026-10-17
featured: false

repo: https://github.com/TomasHutnan/interax
demo: https://www.youtube.com/watch?v=o8Fo_oQnjxc

cover: ../../assets/projects/interax/cover.webp
gallery:
    - image: ../../assets/projects/interax/1.webp
      alt: Clinician dashboard listing a patient's prescriptions and FOLFOX4 regimen beside drug interactions ranked by severity.
    - image: ../../assets/projects/interax/2.webp
      alt: Confirmation dialog for sending a patient's medications and observed interactions to the FHIR repository.
    - image: ../../assets/projects/interax/3.webp
      alt: Mobile views of a patient form with voice input and a saved form with a temporary access PIN.

role: Data Engineer
shortRoleDescription: Architected clinical data integration, FHIR infrastructure, and vector search for DDI screening.
contribution: Harmonized clinical datasets (SÚKL, DDInter, CPIC), built the initial extraction and transformation logic in Jupyter prototypes, structured the drug-drug interaction database, deployed HL7 FHIR infrastructure on Azure, and implemented InterSystems IRIS Vector Search for RAG over clinical guidelines.

collaborators:
    - Dávid Kepič
    - Adrián Mikolaj
    - Jakub Blišťan
---

InteraX was built at Rakathon 2026 for the PillGaze challenge. It reads a patient's medications from photos, matches them against the Czech SÚKL registry, DDInter and CPIC guidelines, screens them for dangerous drug-drug interactions, and exports the result as HL7 FHIR R4. For each interaction, it tries to explain the cause and specific symptoms where the guideline sources allow. Clinical guidelines are embedded in InterSystems IRIS Vector Search, so the RAG layer runs inside our own deployment rather than through a third-party API.

The system was deployed on Azure and shares no patient identifiers. Only medication photos are sent for analysis. Doctors receive a drug list through a one-time code, and that upload contains no patient information and expires after a few hours. We validated the logic in Jupyter notebooks before moving it into API services.
