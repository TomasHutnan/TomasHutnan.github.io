---
title: CUDA Image Processing Pipeline (TESCAN Collaboration)
description: GPU-accelerated image processing pipeline implementing a multi-stage grayscale enhancement workflow with CUDA, focusing on performance, validation, and architectural clarity.
tags:
  - cuda
  - cplusplus
  - gpu-programming
  - image-processing
  - computer-vision
  - performance-optimization
  - testing
type: university
startedAt: 2026-03-01
completedAt: 2026-05-19
featured: true

repo: https://gitlab.fi.muni.cz/xhutnan/pv162-tescan-gpu

cover: ../../assets/projects/pv162-tescan-gpu/cover.webp

role: GPU Engineer
contribution: Designed and implemented a multi-stage CUDA-based image processing pipeline, optimized performance-critical kernels, and developed testing and validation workflows to ensure numerical correctness and reproducibility.
---

This project was developed as part of the PV162 Image Processing course in collaboration with TESCAN, focusing on high-performance GPU implementation of a grayscale image enhancement pipeline.

The system reimplements a reference CPU pipeline using CUDA, executing a structured four-stage workflow consisting of Non-local Means denoising, Unsharp Mask sharpening, Richardson–Lucy deconvolution, and Histogram Stretch normalization. All processing is performed on the GPU using normalized floating-point representations, with support for both 8-bit and 16-bit grayscale input data.

The architecture emphasizes a device-resident pipeline, minimizing host-device transfers while preserving optional intermediate outputs for validation and debugging. Each stage of the pipeline produces stable outputs with consistent naming, enabling reproducible testing and comparison against reference implementations.

A comprehensive validation framework was developed using both C++ and Python tooling. Unit tests powered by Catch2 verify functional correctness, while reference comparison metrics such as MAE, RMSE, PSNR, and SSIM ensure numerical parity with the baseline pipeline.

Performance optimizations were applied to computationally intensive stages, including Non-local Means and Richardson–Lucy kernels, improving execution efficiency while maintaining output stability. A recent refinement introduced symmetric mirroring for border handling, enhancing edge quality without impacting performance or test consistency.

Additional tools include CLI-based execution workflows, dataset manifest validation, and experimental OpenGL-based visualization for interactive inspection of intermediate results.

This project demonstrates strong experience in GPU programming, performance optimization, reproducible experimentation, and building robust, testable data processing pipelines.