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
role: Researcher
startedAt: 2026-06-01
cover: ../../assets/projects/methane-segmentation-fpga/cover.webp
---

This ongoing project tests whether methane segmentation can run on board, so less data has to be sent to the ground. It compares Post-Training Quantization (PTQ) with Quantization-Aware Training (QAT), measuring how INT8 quantization affects memory, throughput and power on a ZCU104 FPGA with Vitis AI. The models are benchmarked against low-power CPUs on the MARS-EMIT dataset.
