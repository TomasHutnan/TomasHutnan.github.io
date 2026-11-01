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
      poster: ../../assets/projects/evo-driving-sim/poster.webp
      alt: Red and blue agents driving a winding track during evolutionary training, with live counters for active and crashed cars.

role: ML Engineer
shortRoleDescription: Built a simulation framework for training neural networks with genetic algorithms and real-time visualization.
contribution: Designed and implemented the full simulation environment, neural network representation, and genetic training pipeline, including a custom map editor and real-time visualization system.
---

This project trains neural networks with a genetic algorithm instead of backpropagation, which allows experiments in environments where gradients are unavailable or hard to define. The system is a 2D top-down driving simulator where agents navigate custom tracks using sensor inputs. Neural network weights are evolved using a genetic algorithm, with each generation evaluated based on driving performance and improved through selection and mutation.

The architecture cleanly separates simulation, evolution, and visualization. A custom map editor allows rapid environment design, while a real-time viewer shows agent behavior during training. To stop agents overfitting to one track, training ran across multiple tracks with a strategy that encourages them to retain useful behaviors.
