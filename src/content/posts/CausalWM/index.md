---
title: "CausalWM: Causal Chain-of-Thought Reasoning for Embodied World Model"
published: 2026-09-19
description: "A 16B embodied world model that makes physical reasoning explicit — predicting optical flow, then 3D pointmaps, then future video, with each step reused as context for the next. Top-1 on the TriWorldBench leaderboard."
tags: [World Models, Embodied AI, Causal Learning, Robot Learning]
image: 'https://aetherlabsai.github.io/CausalWM/assets/CausalWM_Comparison_preview.png?v=bfa81fd29ed9'
coverFit: contain
category: Research
authors: [Ziming Xu, Shuang Liang, Ruobing Han, Ziqiao Xi, Mingxing Rao, Kun Zhou, Zijun Zhang, Yuchen Yan, Yufan Wei, Junbo Huang, Yifei Shao, Fang Nan, Biwei Huang]
draft: false
---

Now available on arXiv.

<div class="paper-links">
<a href="https://arxiv.org/abs/2609.23184">arXiv</a>
<a href="https://aetherlabsai.github.io/CausalWM/">Project Page</a>
</div>

## Abstract

Embodied world models learn to predict future physical dynamics from visual observations and control signals, where physical knowledge is implicitly entangled within latent representations. We introduce CausalWM, a 16B embodied world model that performs explicit causal chain-of-thought reasoning before future video prediction. CausalWM organizes useful variables into a reasoning trajectory, allowing the model to progressively capture causal dependencies underlying physical evolution. To train CausalWM, we collect 31K hours embodied data and develop a three-stage paradigm consisting of large-scale video pre-training, causal CoT mid-training, and multi-objective RL post-training. Despite using only a limited set of supervised CoT variables, CausalWM exhibits emergent in-context learning capabilities, enabling contextual visual feature guidance and efficient few-step generation. CausalWM achieves state-of-the-art performance across language-conditioned, action-conditioned, single-view and multi-view benchmarks, including Top-1 performance on TriWorldBench leaderboard.

![CausalWM vs. direct future prediction: the causal reasoning chain (optical flow → pointmaps → RGB) outperforms direct prediction, scoring 66.04 on TriWorldBench and 89.9 on the PAI-Bench robot domain.](https://aetherlabsai.github.io/CausalWM/assets/CausalWM_Comparison_preview.png?v=bfa81fd29ed9)

## TL;DR

Embodied world models predict future physical dynamics from visual observations and control signals, but their physical knowledge is **implicitly entangled** in latent representations. **CausalWM** instead performs **explicit causal chain-of-thought reasoning** before predicting the future: it predicts **optical flow**, then **3D pointmaps**, then **future RGB video** — reusing each completed prediction as context for the next (O → F → P → V).

The whole chain runs on **one shared diffusion Transformer**: causal attention blocks information from later stages from leaking backward, while attention within each stream stays bidirectional. Despite being supervised with only a limited set of CoT variables, the model shows emergent in-context learning — it can even generate the future in **one denoising step per stage** (3 steps total), at **5.16×** the speed of the full 20/20/20 schedule.

## Training

A three-stage paradigm on ~31K hours of embodied data (curated to ~20K hours of interaction experience across 20 source families: human egocentric video, real robots, and simulation):

1. **Large-scale video pre-training**
2. **Causal CoT mid-training**
3. **Multi-objective RL post-training**

## Results

- **#1 of 36 models on the TriWorldBench leaderboard** (66.04 TWB-Score), with 2 first-place and 5 second-place finishes across the 19 official metrics.
- **State-of-the-art 89.9 RO score** on the PAI-Bench language-conditioned robot domain.
- Language instructions and robot actions provide complementary ways to steer the imagined future.

![The CausalWM framework: visual context and multimodal conditioning guide causal optical-flow, pointmap, and future-RGB prediction, with the three training stages and in-context control.](https://aetherlabsai.github.io/CausalWM/assets/CausalWM_Connected_preview.png?v=4430cd7a8437)

