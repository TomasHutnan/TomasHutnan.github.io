---
title: Nutritional Data Clustering
description: Semantic categorization of 10,000+ USDA food ingredients using unsupervised learning.
tags:
    - machine-learning
    - unsupervised-learning
    - data-science
    - python
    - scikit-learn
    - pandas
type: university
role: Data Scientist
startedAt: 2026-02-01
completedAt: 2026-04-30
cover: ../../assets/projects/ib031-nutritional-clustering/cover.webp
gallery:
    - image: ../../assets/projects/ib031-nutritional-clustering/full.webp
      alt: Six charts comparing the food clusters, including t-SNE, silhouette and macronutrient plots.
collaborators:
    - Eva Hatalčíková
---

Preprocessing used Log1p transformations, standard scaling, and Atwater equation validation. Custom nutrient ratios captured key dietary relationships, and t-SNE and UMAP were applied for dimensionality reduction and visualization. The project compared DBSCAN, HDBSCAN, and K-Means. K-Means with k=6 was selected, grouping ingredients into six interpretable dietary categories.
