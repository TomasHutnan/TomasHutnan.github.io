---
title: CUDA Image Enhancement
description: GPU-accelerated image enhancement pipeline, focusing on performance, validation, and architectural clarity. (TESCAN Collaboration)
tags:
    - cuda
    - cpp
    - gpu-programming
    - image-processing
    - computer-vision
    - performance-optimization
    - testing
    - python
type: university
startedAt: 2026-03-01
completedAt: 2026-05-19
featured: true
featuredOrder: 2

repo: https://github.com/TomasHutnan/cuda-image-enhacement

cover: ../../assets/projects/cuda-image-enhancement/cover.webp

role: GPU Engineer
shortRoleDescription: Built a high-performance CUDA pipeline for image processing and validation.
contribution: Designed and implemented a multi-stage CUDA-based image processing pipeline, optimized performance-critical kernels, and developed testing and validation workflows to ensure numerical correctness and reproducibility.
---

This project was developed as part of the PV162 Image Processing course in collaboration with TESCAN, focusing on high-performance GPU implementation of a grayscale image enhancement pipeline. The system reimplements a reference CPU pipeline using CUDA, executing a structured four-stage workflow consisting of Non-local Means denoising, Unsharp Mask sharpening, Richardson–Lucy deconvolution, and Histogram Stretch normalization. All processing is performed on the GPU using normalized floating-point representations, with support for both 8-bit and 16-bit grayscale input data.

The architecture emphasizes a device-resident pipeline, minimizing host-device transfers while preserving optional intermediate outputs for validation and debugging. Catch2 unit tests check functional correctness, and MAE, RMSE, PSNR and SSIM compare the output against the CPU reference. Performance work focused on the Non-local Means and Richardson–Lucy kernels. The pipeline processes 1024×1024 images at 25+ FPS on a laptop RTX 2050, while the original reference Python script took about 10 seconds per image.
