---
title: "CD-LAM: Causally Debiased Latent Action Model for Embodied Action Conditioned World Models"
published: 2026-07-12
description: "A LAM-side causal debiasing method for continuous latent actions — removing action-irrelevant confounders before world-model training. −42%/−26% action-following error and >12× fewer training updates vs. DreamDojo."
tags: [World Models, Embodied AI, Latent Action Models, Causal Inference, Robot Learning]
image: './method.png'
coverFit: contain
category: Research
draft: false
---

New preprint out today. Work done at **Aether AI** and **UC San Diego**.

**[arXiv](https://arxiv.org/abs/2607.09185)** · **[Project Page](https://yufanwei.github.io/CD-LAM-project-page/)** · **[Code](https://github.com/yufanwei/CD-LAM)** · **[Model](https://huggingface.co/yufanwei/CD-LAM)**

![CD-LAM architecture: a latent action model paired with a three-stage debiasing pipeline — (1) LAM debiased fine-tuning via embodiment-centric reconstruction, action-centric contrastive learning, and latent space calibration; (2) ACWM debiased fine-tuning; (3) robot-action adaptation.](./method.png)

## TL;DR

Reconstruction-trained **latent action models (LAMs)** quietly encode action-*irrelevant* confounders — background motion, camera motion, object appearance — into their latent actions. Downstream **action-conditioned world models (ACWMs)** then inherit these confounders as part of the action condition: rollouts still look plausible, but *action following silently fails* — a zero action no longer freezes the embodiment, and transferred actions fail to steer new scenes.

**CD-LAM** debiases the latent action space **before** world-model training, keeping the downstream action-conditioning format unchanged.

## Method

CD-LAM combines three objectives in a lightweight three-stage pipeline (LAM debiased fine-tuning → ACWM debiased fine-tuning → robot-action based training):

- **Embodiment-centric reconstruction** — anchors the latent to the acting body rather than the scene.
- **Action-centric contrastive learning** — pulls apart latents that should encode different actions.
- **Latent space calibration** — regularizes the latent geometry so conditioning stays faithful.

## Highlights

Compared against **DreamDojo** at 2B and 14B scale:

- **−42% / −26%** action-following error (FDCE) for latent-action conditioned rollouts
- **−35% / −30%** FDCE after robot-action based training, with **+0.75 / +1.0 dB** PSNR
- Matches the baseline's full 50k-step budget with only **3k / 6k** steps — **>12× fewer** updates
- ~1 hour of debiasing data already unlocks most of the gain

## Citation

```bibtex
@article{wei2026cdlam,
  title   = {Causally Debiased Latent Action Model for Embodied Action Conditioned World Models},
  author  = {Wei, Yufan and Zhou, Kun and Mao, Lingjun and Zhang, Zijun and Xu, Ziming
             and Xi, Ziqiao and Liang, Shuang and Han, Ruobing and Yan, Yuchen
             and Wang, Xinyue and Feng, Fan and Huang, Biwei},
  journal = {arXiv preprint arXiv:2607.09185},
  year    = {2026}
}
```
