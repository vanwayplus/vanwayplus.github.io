---
title: Towards a Meta-Learning Assisted Universal Neural Receiver-- An Empirical Study
published: 2024-10-21
#description: /
tags: [Communication, Machine Learning, 6G]
image: './main.png'
category: Research
draft: false
---
Now available on IEEE:
https://ieeexplore.ieee.org/abstract/document/10765768

## Abstract
AI-native air interfaces, such as neural receivers, are pivotal for ensuring efficient communication in 6G networks. By leveraging the capabilities of neural networks, neural receivers aim to learn the characteristics of physical channels and configure numerous radio parameters more effectively than manual feature engineering. However, the practical deployment of these systems is hindered by high training costs and uncertainty surrounding their ability to generalize, which have not been sufficiently explored in the literature thus far. To fill this gap, we explicitly identify nine distinct data domains to investigate the generalization abilities of neural receivers. These domains arise from user behaviors, environmental scenarios, and base station configurations. We additionally explore the use of meta-learning techniques while simultaneously addressing the issue of data dimension mismatch through zero-padding to further bolster generalization. Comprehensive numerical experiments conducted using Nvidia's Sionna physical layer simulator demonstrate that our neural receiver adapts to new scenarios with just a few seconds of fine-tuning, which yields competitive and sometimes superior performance compared to neural receivers trained directly on identical scenarios.