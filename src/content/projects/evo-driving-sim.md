---
title: Evolutionary Driving Simulator
description: 2D simulation environment using evolutionary neural networks to train autonomous driving agents without backpropagation.
tags:
    - machine-learning
    - evolutionary-algorithms
    - simulation
    - python
type: solo
startedAt: 2026-01-11
completedAt: 2026-01-26
featured: false

repo: https://github.com/tomashutnan/evo-driving-sim

cover: ../../assets/projects/evo-driving-sim/cover.webp
gallery:
    - video:
          - /media/projects/evo-driving-sim/showcase.webm
          - /media/projects/evo-driving-sim/showcase.mp4
      poster: ../../assets/projects/evo-driving-sim/cover.webp
      alt: Red and blue agents driving a winding track during evolutionary training, with live counters for active and crashed cars.

role: ML Engineer
shortRoleDescription: Built a simulation framework for training neural networks with genetic algorithms and real-time visualization.
contribution: Designed and implemented the full simulation environment, neural network representation, and genetic training pipeline, including a custom map editor and real-time visualization system.
---

This project explores training neural networks without gradient-based methods by using evolutionary algorithms, providing a deeper understanding of learning beyond standard backpropagation. By removing reliance on differentiability, the approach enables experimentation in environments where gradients are unavailable or difficult to define.

The system is a 2D top-down driving simulator where agents navigate custom tracks using sensor inputs. Neural network weights are evolved using a genetic algorithm, with each generation evaluated based on driving performance and improved through selection and mutation.

The architecture cleanly separates simulation, evolution, and visualization. A custom map editor allows rapid environment design, while a real-time viewer enables observation and analysis of agent behavior during training.

To improve generalization, a retention-based training strategy was implemented across multiple tracks, encouraging agents to retain useful behaviors instead of overfitting to a single environment.

### Key Features

- Genetic algorithm training for neural network controllers
- Multi-track retention strategy for improved generalization
- Real-time visualization of agent behavior and training
- Interactive map editor for rapid experimentation

This project demonstrates a strong understanding of machine learning fundamentals, including neural network representation, optimization strategies, and system design for experimentation.
