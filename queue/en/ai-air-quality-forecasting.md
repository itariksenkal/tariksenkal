---
title: "How AI Forecasts Air Quality: Data, Models and Limits"
description: "Air-quality forecasting from station, weather and satellite data: physics models like CAMS, gradient boosting and LSTMs, fair evaluation and key limitations."
publishDate: "2026-11-10T09:17:00+03:00"
lang: en
category: "Environment"
tags: ["Air Quality", "Artificial Intelligence", "Machine Learning"]
translation: "yapay-zeka-ile-hava-kalitesi-tahmini"
heroImage:
  src: "../../../assets/blog/covers/ai-air-quality-forecasting.jpg"
  alt: "An air-quality forecast map and data flow"
---

Should you walk your child to school tomorrow morning, or postpone the outdoor run by a day? Today's measurements are not enough for that; you need tomorrow's forecast. Air-quality forecasting resembles weather forecasting with an extra difficulty: it must account not only for wind and temperature, but also for where pollutants come from, how they are transported and how they transform in the atmosphere. Having worked on air-pollutant modelling and air-quality forecasting, I want to outline in this post which data and methods produce a forecast, and where they struggle.

## The raw material: three data sources

A good air-quality forecast usually combines three kinds of data.

**1. Ground stations:** Hourly measurements of PM2.5, PM10, NO₂, O₃ and SO₂. This is the most reliable data, but it represents only the station's location and can contain gaps.

**2. Meteorology:** Wind speed and direction, temperature, humidity, precipitation and, crucially, boundary-layer height, which controls vertical mixing. On calm winter days with a temperature inversion, pollutants are trapped near the ground. Many pollution episodes are explained more by weather than by emissions.

**3. Satellite and model fields:** Satellites provide column measurements over wide areas, and global models produce estimated fields where there are no stations. These are especially valuable for long-range events such as desert dust or wildfire smoke.

## The physics-based approach: chemical transport models

The classic method simulates the atmosphere with physics and chemistry equations. These models combine emission inventories (traffic, industry, heating), a weather forecast and chemical reactions to compute the three-dimensional distribution of pollutants.

The best-known European example is the Copernicus Atmosphere Monitoring Service (CAMS), which offers two layers:

- **Global forecast:** Atmospheric composition forecasts run at ECMWF, updated twice a day and extending five days ahead, with initial conditions informed by satellite and in-situ observations.
- **European regional forecast:** An ensemble of eleven air-quality models at about 0.1 degrees (~10 km), four days ahead. The median of the models is used as the forecast and the spread between them as an indication of uncertainty.

The strength of physics-based models is causality: change an emission source and you can ask how the result changes. Their weaknesses are uncertain emission inventories, high computational cost and systematic local biases.

## The machine-learning approach

Machine-learning models do not solve equations; they learn relationships from historical data. A typical station-level forecast is set up like this: the target is tomorrow's PM2.5, and the inputs are recent measurements, weather forecasts and calendar information.

- **Gradient boosting (XGBoost, LightGBM):** Strong, fast and relatively interpretable on tabular data. In many published comparisons it stands out as a good starting point, especially when past pollution values are included as inputs.
- **LSTMs and other deep-learning models:** They can capture long dependencies in time series. They can help with many stations and long histories, but need more data and more careful tuning.
- **Hybrid approaches:** Correcting a physics model's output with machine learning (statistical post-processing) is very common in practice. Published work on calibrating CAMS regional forecasts against local stations is one example.

Feature preparation for a simple station model might look roughly like this:

```python
import pandas as pd

df["pm25_lag1"] = df["pm25"].shift(1)      # yesterday's value
df["pm25_lag2"] = df["pm25"].shift(2)
df["pm25_avg7"] = df["pm25"].rolling(7).mean()
df["month"]     = df.index.month           # seasonality
df["target"]    = df["pm25"].shift(-1)     # tomorrow's value
# + forecast wind, temperature, humidity, boundary-layer height
```

Recently, large models bridging both worlds have appeared too. Microsoft's Aurora model, published in Nature in 2025, can produce five-day global air-pollution forecasts; in its developers' evaluation it beat the CAMS analysis on 74% of targets. Results like this are promising, but independent, long-term validation is still needed.

<div class="callout"><strong>Tip:</strong> Before judging a machine-learning model, always compare it with a simple baseline: "tomorrow will be like today" (persistence). Because air quality is strongly autocorrelated, many models beat this baseline by less than you might expect.</div>

## How to evaluate a forecast

A single "accuracy" percentage can mislead. Several measures are usually combined:

- **RMSE and MAE:** Average error size. RMSE penalises large errors more.
- **Bias:** Does the model systematically over- or under-predict?
- **Correlation:** Does it capture day-to-day ups and downs?
- **Category hits:** Was an "unhealthy" day actually forecast as "unhealthy"? From a public-health perspective this is often the key question; missing bad days costs more than small errors on good ones.

Another critical point is splitting the data in time order. A randomly split test set can leak future information into training and make results look better than they are.

## Limits: where models struggle

- **Rare events:** Desert dust, wildfires or unexpected industrial incidents are scarce in historical data, so purely data-driven models can miss them.
- **Changing emissions:** A new road, a closed power plant or a switch in heating fuel can break relationships learned from the past.
- **Weather errors:** An air-quality forecast is only as good as its weather forecast. If wind or inversion is wrong, so is the pollution forecast.
- **Station representativeness:** A roadside station and a park station in the same neighbourhood can measure very different values.
- **Data gaps:** Outages and maintenance create missing data, and how gaps are filled affects results.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Air-quality forecasts combine station measurements, meteorology, and satellite and model fields.</li><li>Physics-based systems like CAMS offer causality; machine learning can add fast, accurate local corrections.</li><li>The best results often come from hybrid approaches.</li><li>For evaluation, a persistence baseline, time-ordered splits and success at catching bad days are essential.</li></ul></div>

<div class="faq"><details><summary>Will machine learning replace physics-based models?</summary><p>In the near term the two are more likely to be used together. Machine learning brings speed and local accuracy, while physics models are still needed to test emission scenarios and understand rare events.</p></details><details><summary>How far ahead can air quality be forecast?</summary><p>Operational systems typically forecast a few days ahead; for example, the CAMS global forecast runs five days and the European regional forecast four days. Accuracy declines with lead time as weather uncertainty grows.</p></details><details><summary>Can I build a simple model for my own city?</summary><p>Yes, a basic gradient-boosting model using open station and weather data is feasible. The important thing is to compare it honestly against a persistence baseline and not to treat it as a substitute for official forecasts.</p></details></div>

---

**Sources**

- [Copernicus Atmosphere Monitoring Service: Global atmospheric composition forecasts](https://atmosphere.copernicus.eu/global-atmospheric-composition-forecasts-were-never-so-fine-tuned)
- [Calibrating the CAMS European multi-model air quality forecasts for regional air pollution monitoring (arXiv)](https://arxiv.org/abs/2201.13355)
- [Bodnar et al.: A Foundation Model for the Earth System (arXiv preprint; Nature, 2025)](https://arxiv.org/abs/2405.13063)
- [Microsoft Research: Introducing Aurora](https://www.microsoft.com/en-us/research/blog/introducing-aurora-the-first-large-scale-foundation-model-of-the-atmosphere/)
- [World Health Organization: Ambient (outdoor) air quality and health](https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health)
