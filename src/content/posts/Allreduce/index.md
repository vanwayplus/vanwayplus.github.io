---
title: AllReduce Scheduling with Hierarchical Deep Reinforcement Learning
published: 2023-01-10
#description: /
tags: [Network, Reinforcement Learning, Data Center]
image: './main.png'
category: Research
draft: false
---
Now available on Arxiv:
https://arxiv.org/abs/2503.21013

## Abstract
AllReduce is a technique in distributed computing which saw use in many critical applications of deep learning. Existing methods of AllReduce scheduling oftentimes lack flexibility due to being topology-specific or relying on extensive handcrafted designs that require domain-specific knowledge. In this work, we aim to alleviate this inflexibility by proposing a deep-reinforcement-learning (DRL)-based pipeline that can generate AllReduce scheduling for various network topologies without topology-specific design features. The flow scheduling module of this pipeline consists of two hierarchically-structured DRL policies that work cooperatively to find optimal scheduling. We showcase the performance of our method compared to the baseline methods on three topologies: BCube, DCell, and Jellyfish. Finally, we contributed a Python-based simulation environment simulating AllReduce scheduling on these network topologies.