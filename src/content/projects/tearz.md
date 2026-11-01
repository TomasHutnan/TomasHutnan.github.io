---
title: Tearz
description: Hackathon prototype that screens tear ferning microscopy images for eye and systemic diseases.
tags:
    - computer-vision
    - deep-learning
    - medical-ai
    - python
    - pytorch
    - keras
    - scikit-learn
    - machine-learning
    - image-processing
type: team
startedAt: 2026-04-18
completedAt: 2026-04-19

awards:
    - upjs-hackkosice-2026-honorable

featured: true
featuredOrder: 1

repo: https://github.com/TomasHutnan/ae-tearz/

cover: ../../assets/projects/tearz/cover.webp

role: Project Lead
shortRoleDescription: Led a diagnostic prototype for non-invasive disease screening.
contribution: Led development of the diagnostic pipeline, including preprocessing design, feature engineering, and model architecture decisions, as well as overall system integration and technical direction.

collaborators:
    - Robert Hudák
    - Dávid Kepič
    - Adrián Mikolaj
---

Tearz is a diagnostic prototype built on tear ferning microscopy, a non-invasive test. It screens for glaucoma, dry eye, multiple sclerosis and diabetes. The system is a two-stage pipeline. The first stage is a high-sensitivity screener that flags samples showing any condition. The second stage uses a deep-learning ensemble to identify the specific pathology, with confidence scores.

The preprocessing pipeline was inspired by Gwyddion-based techniques, incorporating pseudo-field flattening, row alignment, CLAHE, and skeletonization to isolate crystalline tear structures from noise. Feature engineering focused on extracting topological and textural properties, including fractal dimension and Haralick features, which were used in a logistic regression classifier for initial screening. For classification, a 5-fold ResNet50 ensemble was trained using transfer learning, label smoothing, and test-time augmentation. Special care was taken to prevent data leakage by enforcing subject-level splits.

Key challenges included removing fine-grained sensor noise without damaging structural detail, working with a small dataset, and optimizing computation by moving from 16-bit to 8-bit processing. The screener reached a 93% F1 score for detecting whether any condition is present. We measured this on our own train/test split of the 169 samples provided by UPJŠ, which supplied the challenge.
