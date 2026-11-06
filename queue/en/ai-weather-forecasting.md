---
title: "AI Weather Forecasting: GraphCast, GenCast and ECMWF's AIFS"
description: "How machine-learning weather models differ from numerical weather prediction, when ECMWF's AIFS went operational, and what these models still cannot do."
publishDate: "2026-11-12T09:17:00+03:00"
lang: en
category: "Climate"
tags: ["Artificial Intelligence", "Meteorology", "Climate"]
translation: "yapay-zeka-ile-hava-tahmini"
heroImage:
  src: "../../../assets/blog/covers/ai-weather-forecasting.jpg"
  alt: "A global weather forecast map with a neural network overlay"
---

For decades, weather forecasting has been one of the most important jobs for the world's most powerful supercomputers. Models that simulate the atmosphere with physics equations can now predict the next few days with remarkable skill. In the past few years a different approach has arrived: machine-learning models that learn from historical weather data and can produce a forecast in seconds rather than hours of supercomputer time. When the European Centre for Medium-Range Weather Forecasts (ECMWF) began running an AI model operationally in 2025, it showed that this is no longer only a research topic. Having worked on high-performance computing infrastructure such as Türkiye's TRUBA, I have been following this shift closely. In this post I explain how these models work, how they differ from the classic method and what they still cannot do.

## The classic method: numerical weather prediction

Numerical weather prediction (NWP) divides the atmosphere into a three-dimensional grid and uses physics equations to calculate how wind, temperature, humidity and pressure evolve in each cell. It has two steps:

1. **Data assimilation:** Millions of observations from satellites, ground stations, radiosondes, aircraft and buoys are combined with the model to produce the best estimate of the atmosphere "right now".
2. **Forecast:** Starting from that state, the equations are stepped forward in time.

ECMWF's physics-based model, the IFS, runs at about 9 km grid spacing, which demands enormous computing power. And because weather is chaotic, the same forecast is run dozens of times with slightly perturbed conditions to account for initial uncertainty. This is called an **ensemble forecast**.

## What do machine-learning models do?

Machine-learning models do not solve equations. Instead, they learn from decades of historical atmospheric data, above all ECMWF's ERA5 reanalysis, the answer to "if the atmosphere looks like this now, what will it look like a few hours from now?" Applying that step repeatedly extends the forecast days ahead.

The models that stand out:

- **Pangu-Weather (Huawei):** Published in Nature in 2023, it was among the first studies to show that machine learning could compete with physics-based models at medium range.
- **GraphCast (Google DeepMind):** Published in Science in 2023. It produces a 10-day forecast at about 0.25 degrees (~25 km at the equator) in under a minute on Google's TPU hardware. The paper reports it was more accurate than ECMWF's deterministic operational model, HRES, on 90% of 2,760 variable and lead-time combinations.
- **GenCast (Google DeepMind):** Published in Nature in December 2024. Instead of a single forecast, it produces a probabilistic ensemble. According to DeepMind, it beat ECMWF's ensemble, ENS, on 97.2% of 1,320 targets.

| Model | Developer | Type | Key note |
|---|---|---|---|
| Pangu-Weather | Huawei | Deterministic | 2023, Nature |
| GraphCast | Google DeepMind | Deterministic | 2023, Science; ~0.25° |
| GenCast | Google DeepMind | Probabilistic (ensemble) | December 2024, Nature |
| AIFS Single | ECMWF | Deterministic | Operational since 25 February 2025 |
| AIFS ENS | ECMWF | Probabilistic (ensemble) | Operational since 1 July 2025 |

## ECMWF's AIFS: from research to operations

One of the most important milestones was ECMWF making its own machine-learning model, the **AIFS** (Artificial Intelligence Forecasting System), operational:

- **AIFS Single** went operational on 25 February 2025. ECMWF says it outperforms physics-based models on many measures, with gains of up to 20% in some areas, including tropical cyclone tracks. Its energy use per forecast is about 1,000 times lower than the physics-based approach.
- **AIFS ENS**, the ensemble version, went operational on 1 July 2025, adding an expression of forecast uncertainty.

An important point: the AIFS did not replace the physics-based IFS; it runs **alongside** it. ECMWF describes the two systems as complementary. The AIFS Single grid spacing is also 28 km, coarser than the IFS's 9 km.

<div class="callout"><strong>Tip:</strong> When you read that an AI weather model "beat the physics model", check which variables, which lead times and which reference model were used. A phrase like "90% of targets" does not mean superiority under every condition.</div>

## What these models cannot do

The success of machine-learning weather models is real, but their limits matter just as much:

- **They still rely on physics:** Most of these models start from an initial state produced by a conventional data-assimilation system. The observation network and physics-based infrastructure have not gone away.
- **Outside the training data:** Because they learn from the past, they can struggle with extreme events that have few precedents in the record. As the climate warms, "record" events become more frequent, which makes this an important test.
- **Blurring:** Deterministic models can smooth forecasts at longer lead times to minimise average error. That improves average scores but can dampen the peaks of severe events. Probabilistic models partly ease this problem.
- **Resolution and local detail:** A 25–28 km grid struggles with fog in a valley or a sudden local downpour. Local forecasts need additional methods.
- **Variables:** Some variables, such as precipitation, remain hard. A precipitation issue in the first AIFS version, for example, was fixed in an update in August 2025.
- **Not climate projections:** These models are trained for weather on a scale of days. Multi-decade climate scenarios are a different problem requiring different tools.

<div class="callout"><strong>Note:</strong> Physics-based models can answer "why": you can change a process and see how the outcome changes. Machine-learning models are strongest at "what will happen". That is why using the two together makes sense.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Classic numerical weather prediction solves physics equations; machine-learning models learn how the atmosphere evolves from historical data.</li><li>GraphCast, GenCast and Pangu-Weather showed in peer-reviewed papers that they can compete with physics models on many measures.</li><li>ECMWF's AIFS went operational on 25 February 2025 and its ensemble, AIFS ENS, on 1 July 2025; both run alongside the IFS.</li><li>Dependence on physics-based initial conditions, extremes, blurring and resolution remain key limits.</li></ul></div>

<div class="faq"><details><summary>Does the weather app on my phone use AI?</summary><p>Apps draw on different sources; some use AI models, some physics-based models, and many a mix of both plus local corrections. Which one is used usually depends on the app's data provider.</p></details><details><summary>Will AI models replace meteorologists?</summary><p>It does not look that way. However good the models get, interpreting warnings, communicating uncertainty and bringing in local knowledge still require human expertise.</p></details><details><summary>Are these models openly available?</summary><p>It varies by model. ECMWF shares AIFS forecast data as open data, and code and weights for some research models have been released. Check each model's own page for terms of use.</p></details></div>

---

**Sources**

- [ECMWF: ECMWF's AI forecasts become operational](https://www.ecmwf.int/node/29308)
- [ECMWF: An update to ECMWF's machine-learned weather forecast model AIFS (arXiv)](https://arxiv.org/html/2509.18994v1)
- [Lam et al.: GraphCast: Learning skillful medium-range global weather forecasting (arXiv)](https://arxiv.org/abs/2212.12794)
- [Google DeepMind: GenCast predicts weather and the risks of extreme conditions with state-of-the-art accuracy](https://deepmind.google/discover/blog/gencast-predicts-weather-and-the-risks-of-extreme-conditions-with-sota-accuracy/)
- [ECMWF: AIFS machine learning data](https://ecmwf.int/en/forecasts/dataset/aifs-machine-learning-data)
