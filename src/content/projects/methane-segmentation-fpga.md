---
title: Methane Segmentation on FPGA
description: Ongoing research into running methane segmentation on FPGA edge devices to reduce satellite downlink data.
tags:
    - computer-vision
    - machine-learning
    - fpga
    - quantization
    - remote-sensing
type: university
startedAt: 2026-06-01
featured: false

cover: ../../assets/projects/methane-segmentation-fpga/cover.webp

role: Researcher
shortRoleDescription: Researching whether methane segmentation can run on board a satellite, on an FPGA.
contribution: Quantizing the segmentation models with post-training quantization and quantization-aware training, deploying them to a ZCU104 with Vitis AI, and benchmarking memory, throughput and power against low-power CPUs.
---

This ongoing project tests whether methane segmentation can run on board, so less data has to be sent to the ground. It compares Post-Training Quantization (PTQ) with Quantization-Aware Training (QAT), measuring how INT8 quantization affects memory, throughput and power on a ZCU104 FPGA with Vitis AI. The models are benchmarked against low-power CPUs on the MARS-EMIT dataset.
