---
title: "What Is a GPU, and Why Does It Matter So Much for AI?"
description: "How a GPU differs from a CPU, why parallel matrix math matters for AI, what VRAM and HBM do, training versus inference, and why GPUs are scarce and costly."
publishDate: "2026-11-20T09:17:00+03:00"
lang: en
category: "Infrastructure"
tags: ["GPU", "Artificial Intelligence", "Hardware", "Infrastructure"]
translation: "gpu-nedir-yapay-zeka-icin-neden-onemli"
heroImage:
  src: "../../../assets/blog/covers/what-is-a-gpu-for-ai.jpg"
  alt: "Rows of GPU servers in a data centre rack"
---

AI news regularly makes headlines out of how many thousands of GPUs a company has bought, how much it is investing in data centres, or the market value of chipmakers. But what exactly is a GPU, and how did a component once associated with gaming PCs become AI’s most critical resource? In this post I explain the GPU in plain terms by comparing it with the CPU: why AI needs parallel computation, why memory matters as much as raw processing power, how training differs from everyday use, and why GPUs are both scarce and expensive. I will also touch on something anyone working with language models learns quickly: the bottleneck is often memory rather than compute.

## CPU and GPU: two ways of working

The **CPU** (central processing unit), your computer’s main processor, has a small number of very powerful, versatile cores. It can handle any kind of task, runs complex decision logic quickly and usually works through tasks one after another. It is what runs your operating system, browser and word processor.

The **GPU** (graphics processing unit) was originally designed to calculate the colours of millions of pixels on a screen at once. To do that, it packs together a very large number of simpler cores. Individually they are less flexible than CPU cores, but they can all work at the same time.

A common analogy: a CPU is a kitchen with a few master chefs who can cook anything. A GPU is a huge team that can chop thousands of onions simultaneously. For one complicated dish, the chefs win; for thousands of identical operations, the big team wins by a mile.

| Aspect | CPU | GPU |
|---|---|---|
| Core design | Few, powerful and versatile | Many, simpler |
| Strong at | Sequential, branching, complex logic | Repeating the same operation over large data |
| Typical use | Operating systems, applications, databases | Graphics, scientific computing, AI |
| Role in AI | Prepares data, orchestrates the process | Carries the main computational load |

## Why AI needs parallel computation

Much of what happens inside a neural network is **matrix multiplication**: multiplying and adding up long tables of numbers. Even to produce a single piece of text (a token), a language model performs billions of multiplications and additions. Most of these operations are independent of one another, which means they can be done at the same time.

That is exactly where a GPU shines. Thousands of cores run those independent calculations in parallel. Modern data-centre GPUs also include units designed specifically for matrix multiplication.

The connection was not accidental. NVIDIA’s CUDA platform, which made it easier to program GPUs for non-graphics work, was announced in 2006. In 2012, the neural network by Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton that made a big leap in the ImageNet image recognition competition was trained, as their paper highlights, using an efficient GPU implementation. That work is widely seen as a turning point for GPU use in deep learning. If you want to know what calculations happen inside a language model, see my post on [how large language models work](/en/posts/how-llms-work/).

## Memory: why VRAM and HBM matter so much

A fast GPU is not enough on its own; data has to reach it quickly too. A GPU’s own memory is called **VRAM**. For a model to run, most of its parameters need to fit in that memory.

A simple calculation gives a sense of scale: if each parameter of a 70-billion-parameter model is stored in 16 bits (2 bytes), the weights alone need about 140 GB. On top of that comes memory for the conversation context and intermediate calculations. Consumer graphics cards have far less memory than that, so large models are either split across several GPUs or shrunk with techniques such as [quantization](/en/posts/quantization-in-production/).

That is why data-centre GPUs use **HBM** (high-bandwidth memory). HBM stacks memory chips on top of one another and places them very close to the processor, allowing much more data to move every second. For example, NVIDIA lists 80 GB of memory and 3.35 terabytes per second of memory bandwidth for the H100 SXM. In practice, many AI workloads hit this bandwidth limit before they run out of compute: the GPU cores sit waiting for data.

<div class="callout"><strong>Tip:</strong> When judging whether a GPU is suitable for AI, look beyond processing power to memory capacity and bandwidth. If you want to run a local model on your own computer, the amount of VRAM is usually the deciding factor.</div>

## Training and inference: two different workloads

GPUs are used in two distinct phases of AI, and their needs differ.

**Training** is when a model learns from data. Large models can require thousands of GPUs working together for weeks or even months. Here the speed of the connections between GPUs matters as much as their individual power, because they constantly exchange results. Training is a large, infrequent investment.

**Inference** is when a trained model answers users. A single question is a tiny job compared with training, but when millions of people ask questions every day, the total load becomes huge and continuous. Inference is about speed (how fast the answer arrives) and cost (resources spent per question). That is why companies turn to smaller models, quantization and caching for inference.

| | Training | Inference |
|---|---|---|
| What happens | The model learns from data | The model answers a request |
| Scale | Many GPUs, long runs, infrequent | Small job per request, but continuous and widespread |
| Key needs | Total compute, fast links between GPUs | Low latency, memory bandwidth, cost efficiency |

## Why GPUs are scarce and expensive

In recent years, demand for AI GPUs has repeatedly outstripped supply. There are several structural reasons:

- **A complex supply chain.** The most advanced AI chips can only be made in a handful of cutting-edge fabs. Beyond the chip itself, they need HBM and advanced packaging technology that combines memory and processor in a single package, and each of these steps has limited capacity. In 2023, TSMC’s leadership expected the shortage of AI GPUs to last about a year and a half.
- **Few suppliers.** HBM is made by a small number of manufacturers, and a few companies dominate the AI accelerator market.
- **The software ecosystem.** Libraries and tools built up over many years increase dependence on particular hardware; switching to alternative chips is possible but takes effort.
- **Concentrated demand.** Large tech companies and AI labs reserve capacity years in advance through contracts.
- **Geopolitical constraints.** Some countries restrict exports of advanced AI chips, which makes supply chains more complicated.

Because prices change quickly by model, generation and period, I am deliberately not quoting numbers here. But the overall picture is clear: AI compute, together with energy and cooling, is one of the biggest cost items in the field today. That makes [cost optimisation](/en/posts/llm-cost-optimization/) and more efficient [small language models](/en/posts/small-language-models/) increasingly important.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>A CPU excels at sequential work with a few powerful cores; a GPU excels at parallel work with many simpler cores.</li><li>Because the matrix multiplications at the heart of neural networks parallelise well, GPUs became AI’s workhorse.</li><li>Memory capacity and bandwidth (VRAM, HBM) are often as decisive as compute, or more so.</li><li>Training is a large, infrequent workload; inference is small per request but continuous, and their needs differ.</li><li>A complex supply chain, few suppliers and concentrated demand make GPUs scarce and expensive.</li></ul></div>

<div class="faq"><details><summary>Can I run an AI model on my gaming PC’s graphics card?</summary><p>Yes, especially small and quantized open-weights models. The limiting factor is usually the card’s memory (VRAM). Very large models will not fit on consumer cards.</p></details><details><summary>Does AI only run on GPUs?</summary><p>No. Small models can run on a CPU, just more slowly. Some companies also build accelerators designed specifically for AI; Google’s TPUs are one example. Still, GPUs are the most common choice today.</p></details><details><summary>Which is more expensive, training or inference?</summary><p>As a one-off cost, training is very large. But for a widely used model, the cumulative cost of serving millions of users can approach or exceed the training cost over time. Which dominates depends on the scale of use.</p></details><details><summary>How is HBM different from normal computer memory?</summary><p>HBM stacks memory chips and places them very close to the processor, so it can move far more data per second. That reduces the time GPU cores spend waiting for data when running large models.</p></details></div>

---

**Sources**

- [NVIDIA – What’s the Difference Between a CPU and a GPU?](https://blogs.nvidia.com/blog/2009/12/16/whats-the-difference-between-a-cpu-and-a-gpu/)
- [NVIDIA – H100 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h100/)
- [Krizhevsky, Sutskever, Hinton – ImageNet Classification with Deep Convolutional Neural Networks (NeurIPS 2012)](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)
- [Tom’s Hardware – TSMC: Shortage of Nvidia’s AI GPUs to Persist for 1.5 Years](https://www.tomshardware.com/news/tsmc-shortage-of-nvidias-ai-gpus-to-persist-for-15-years)
