---
title: Tearz
description: AI-powered tear ferning microscopy diagnostic tool for non-invasive detection of systemic diseases.
tags:
  - machine-learning
  - computer-vision
  - deep-learning
  - pytorch
  - keras
  - scikit-learn
  - medical-ai
type: team
startedAt: 2026-04-18
completedAt: 2026-04-19

awards:
  - upjs-hackkosice-2026-honorable

featured: true

repo: https://github.com/TomasHutnan/ae-tearz/

cover: ../../assets/projects/tearz/cover.webp

role: Project Lead
contribution: Led development of the diagnostic pipeline, including preprocessing design, feature engineering, and model architecture decisions, as well as overall system integration and technical direction.

collaborators:
  - Robert Hudák
  - Dávid Kepič
  - Adrián Mikolaj
---

Tearz was developed as a diagnostic tool based on tear ferning microscopy, aiming to provide a non-invasive method for early detection of systemic diseases such as multiple sclerosis and diabetes.

The system operates as a two-stage pipeline. The first stage functions as a high-sensitivity screener that flags potentially unhealthy samples. The second stage uses a deep-learning ensemble to classify specific pathologies including glaucoma, dry eye, sclerosis, and diabetes, delivering predictions along with confidence scores through a clinician-friendly interface.

The preprocessing pipeline was inspired by Gwyddion-based techniques, incorporating pseudo-field flattening, row alignment, CLAHE, and skeletonization to isolate crystalline tear structures from noise. Feature engineering focused on extracting topological and textural properties, including fractal dimension and Haralick features, which were used in a logistic regression classifier for robust initial screening.

For classification, a 5-fold ResNet50 ensemble was trained using transfer learning, label smoothing, and test-time augmentation to improve performance on a limited dataset. Special care was taken to prevent data leakage by enforcing subject-level splits.

Key challenges included removing fine-grained sensor noise without damaging structural detail, dealing with a small dataset of only 169 samples, and optimizing computation by transitioning from 16-bit to 8-bit processing pipelines.

The project demonstrated strong performance in pathology screening and emphasized the importance of preprocessing quality and interpretable model design in low-data medical contexts.