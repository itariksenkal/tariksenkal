---
title: "The Energy and Water Footprint of AI: What the Numbers Say"
description: "How much electricity and water data centres use, why estimates for a single AI query vary so widely, and what actually reduces the footprint of AI."
publishDate: "2026-11-08T09:17:00+03:00"
lang: en
category: "Climate"
tags: ["Artificial Intelligence", "Energy", "Climate"]
translation: "yapay-zekanin-enerji-ve-su-ayak-izi"
heroImage:
  src: "../../../assets/blog/covers/ai-energy-and-water-footprint.jpg"
  alt: "Energy and water use of AI data centres"
---

Asking a chatbot a question feels like a few seconds of activity on a screen. Behind the answer, though, there are chips running in a data centre, systems cooling them and an electricity grid powering it all. Over the past few years, "how much energy and water does AI use?" has become a common question in public and policy debates, and the answers range from alarming to overly reassuring. Working with language models myself, it is a question I ask too. In this post I try to set out what reliable sources say, why the numbers differ so much, and what actually reduces the footprint.

## The big picture: how much electricity do data centres use?

One of the most cited sources is the International Energy Agency's *Energy and AI* report, published in 2025. Its headline figures:

- Data centres consumed about **415 TWh** of electricity in 2024, roughly **1.5%** of global electricity use.
- Their consumption has grown by around 12% a year since 2017.
- In the IEA's Base Case it more than doubles to about **945 TWh** by 2030.
- In 2024 about 45% of that consumption was in the United States, 25% in China and 15% in Europe.

Two points are worth stressing. First, these figures cover all data centres, not just AI: email, video streaming, cloud storage and banking systems are all in there. AI is the fastest-growing part. Second, the IEA itself stresses the uncertainty: across its scenarios, 2035 demand ranges from 700 to 1,700 TWh.

At global scale 1.5% may look small. But data centres cluster in particular places, so their effect on local grids can be much more noticeable. Often the real question is less the global total than where, and from which sources, new capacity in a given city or region will be supplied.

## Where does water come in?

The water footprint has two parts, and much of the confusion comes from mixing them up.

1. **Direct water use:** Data centres consume water to cool servers, especially in evaporative cooling systems.
2. **Indirect water use:** The power plants generating the data centre's electricity also use water, with thermal plants' cooling needs being the typical example.

If a company reports only on-site cooling water, the second part is left out. That is why independent estimates diverge so much. An analysis by Rystad Energy, for example, projects that direct cooling water demand from data centres could reach about 644 billion litres by 2030, while studies that also count water used in electricity generation arrive at far higher numbers. These figures are not directly comparable, because they measure different things.

<div class="callout"><strong>Tip:</strong> When you see a headline saying "AI uses this much water", check whether the figure covers only on-site cooling or also water used to generate the electricity. The difference can be several-fold.</div>

## How much energy does a single query use?

The most detailed public data we have comes from a technical paper Google released in August 2025. According to the company, a **median text prompt** in the Gemini apps uses about:

- **0.24 Wh** of energy,
- **0.03 g** of CO₂-equivalent emissions,
- **0.26 mL** of water.

The same paper shows that a narrower calculation counting only the active AI chips gives roughly 0.10 Wh. The company also reports that the energy per median prompt fell 33-fold over twelve months.

These numbers are useful but need context:

- They exclude model training, the user's device and network infrastructure.
- The water figure covers on-site cooling only; critics pointed out that indirect water from electricity generation was left out.
- A "median text prompt" represents a short question. Long documents, image or video generation, and models that perform multi-step "reasoning" can require much more computation.
- At the time of release the paper had not been peer-reviewed.

## Why do estimates vary so much?

It is possible to find per-query figures that differ tenfold. There are several reasonable explanations:

- **Where the boundary is drawn:** Just the chip, or the whole server, idle capacity and cooling too? Even within Google's own paper, this choice more than doubles the number.
- **Model size and task:** A short question to a small model is not the same as a long analysis from a large one.
- **Hardware and efficiency:** Newer chips and well-optimised software can do the same work with much less energy.
- **Source of electricity:** The same kilowatt-hour means very different emissions on a renewables-heavy grid versus a coal-heavy one.
- **Missing data:** Most companies do not publish detailed figures, so outside estimates have to rely on assumptions.

## What actually reduces the footprint?

For an individual user, skipping one query has a small effect. The big differences come from system-level choices:

- **Right-sized models:** Instead of using the largest model for everything, choose one as large as the task needs. Small models are often enough for classification or short summaries.
- **Software efficiency:** Quantisation, batching, caching and avoiding needlessly long outputs deliver the same result with less computation.
- **Efficient facilities:** Data centres that spend less energy and water on cooling, and low-water cooling designs in water-stressed regions.
- **Clean electricity:** Access to renewable power, and even shifting workloads to hours or regions where clean electricity is plentiful.
- **Transparent reporting:** What is not measured cannot be managed. Shared, comparable reporting standards move the debate from guesses to data.

<div class="callout"><strong>Note:</strong> In the same report the IEA also estimates that AI could save energy in buildings, industry and grid management. But it is explicit that this potential will not materialise automatically and that it is far from enough on its own to address climate change.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>According to the IEA, data centres used about 415 TWh in 2024, roughly 1.5% of global electricity; the 2030 Base Case is about 945 TWh.</li><li>Water use splits into direct (cooling) and indirect (power generation); read figures in light of what they cover.</li><li>Google's August 2025 data puts a median Gemini text prompt at about 0.24 Wh and 0.26 mL of water, with notable exclusions.</li><li>The biggest gains come from right-sized models, software efficiency, clean electricity and transparent reporting.</li></ul></div>

<div class="faq"><details><summary>Does an AI query use more energy than a web search?</summary><p>In general, large language models need more computation than a classic search, but the gap varies greatly with model size, prompt length and hardware. Quoting a single fixed ratio would be misleading.</p></details><details><summary>Which uses more energy, training or usage?</summary><p>Training a large model takes a very large amount of energy in one go. But as a model serves millions of users, the share of usage (inference) grows. Which dominates depends on how much, and for how long, the model is used.</p></details><details><summary>What can I do as an individual?</summary><p>Choosing the right tool for the job and avoiding needlessly long outputs or repeated regenerations are sensible steps. But the larger impact comes from organisations' decisions on model choice, data-centre siting and transparent reporting.</p></details></div>

---

**Sources**

- [IEA: Energy and AI – Executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)
- [Google: Measuring the environmental impact of delivering AI at Google Scale (arXiv, 2025)](https://arxiv.org/abs/2508.15734)
- [DatacenterDynamics: Google says median Gemini prompt uses 0.24 watt-hours and 0.26 mL of water](https://www.datacenterdynamics.com/en/news/google-median-gemini-prompt-uses-024-watt-hours-of-power-and-consumes-026ml-of-water/)
- [Down To Earth: Data centre water consumption could triple to 644 billion litres by 2030](https://www.downtoearth.org.in/science-technology/data-centre-water-consumption-could-triple-to-644-billion-litres-by-2030)
