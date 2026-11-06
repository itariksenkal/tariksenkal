---
title: "Monitoring Emissions from Space: How Satellites Track Pollution"
description: "How Sentinel-5P/TROPOMI tracks NO₂ and methane, what Copernicus's new satellites add, how AI finds emission plumes, and the limits of clouds and resolution."
publishDate: "2026-11-11T09:17:00+03:00"
lang: en
category: "Environment"
tags: ["Satellites", "Emissions", "Artificial Intelligence"]
translation: "uydu-verisiyle-emisyon-takibi"
heroImage:
  src: "../../../assets/blog/covers/satellite-emissions-monitoring.jpg"
  alt: "A satellite map of atmospheric pollution"
---

Seeing gas from a factory chimney or a leaking pipeline from space would have sounded like science fiction a few decades ago. Today, satellites in Europe's Copernicus programme map nitrogen dioxide and methane over almost the entire planet every day, and the data are openly available. That means emissions can be tracked not only through self-reported figures but also through independent observation. Working with air-pollution and climate data, I find this field genuinely exciting, but knowing what a satellite can and cannot see is just as important. This post covers both.

## How does a satellite "see" pollution?

Every gas in the atmosphere absorbs specific wavelengths of sunlight in its own characteristic way. A spectrometer on the satellite measures light reflected from the surface and atmosphere across many narrow wavelength bands. From these "fingerprints", scientists calculate how much of a gas sits in the column of air between the satellite and the ground.

One important detail: a satellite usually measures the **column amount**, the total from the ground up through the atmosphere. That is not the same as the surface concentration measured by ground stations, which is what matters directly for health. Models are needed to bridge the two.

## Sentinel-5P and TROPOMI: a daily global map

One of the most important tools of recent years is the Copernicus **Sentinel-5P** satellite. Launched on 13 October 2017, it carries the **TROPOMI** spectrometer, which provides:

- Nitrogen dioxide (NO₂)
- Methane (CH₄)
- Ozone (O₃)
- Carbon monoxide (CO)
- Formaldehyde (HCHO)
- Sulphur dioxide (SO₂)
- Cloud and aerosol information

Its swath of roughly 2,600 km lets it see almost the whole planet once a day, passing over at around 13:30 local time. Since August 2019 its pixels in the UV-visible bands have been about 5.5 × 3.5 km. The satellite has outlived its seven-year design life, and ESA's 2026 mission-status briefings show it still delivering data.

**NO₂ maps** clearly show cities, major roads, ports and power plants. Because NO₂ is relatively short-lived in the atmosphere, it stays concentrated near its source, which makes it a good indicator of human activity.

**Methane** is a different story. For this potent greenhouse gas, TROPOMI can see large releases over oil and gas fields, coal mines and landfills. But pinpointing individual facilities requires higher-resolution satellites.

## The next generation: Sentinel-4 and Sentinel-5

Copernicus's atmospheric family gained two important members in 2025:

- **Sentinel-4** flies on the geostationary MTG-Sounder satellite and is designed to watch Europe and its surroundings hourly. Its first NO₂, SO₂ and ozone images were released in October 2025. Hourly observation is a big step forward for tracking how pollution changes through the day.
- **Sentinel-5** is on board MetOp-SG-A1, launched on an Ariane 6 on 13 August 2025, and is intended to take over Sentinel-5P's global monitoring role in the long run. Its first images have been released.

Commercial and non-profit missions are part of the picture too, though not always as planned. MethaneSAT, built to track methane, lost contact in June 2025, about a year after its March 2024 launch, and was judged unrecoverable. That shows why spreading space-based monitoring across several satellites and sources matters.

<div class="callout"><strong>Tip:</strong> Copernicus data are free through the Copernicus Data Space Ecosystem. A good way to get a feel for the data is to look at the ready-made NO₂ product over one city for a few months.</div>

## Where does AI come in?

Satellites produce terabytes of imagery every day, far too much to scan by eye. AI takes on three main jobs:

1. **Finding plumes:** Image models such as convolutional neural networks can automatically flag plumes in methane or NO₂ maps that stand out from the background and stretch downwind from a source.
2. **Filtering noise:** Bright surfaces, snow, water and cloud edges can cause false alarms. Models are trained to weed these out.
3. **Estimating source and rate:** Combined with wind data, detections can be used to estimate which facility a plume came from and roughly how much gas is being released per hour.

A concrete example is the UN Environment Programme's **Methane Alert and Response System (MARS)**. It combines data from more than 30 satellite instruments with scientific expertise and AI models to detect large methane releases and notify the relevant governments and companies. Yet according to a UNEP report presented at COP29, fewer than half of more than 1,200 alerts had been acknowledged. Technology alone is not enough; institutions need to turn detection into action.

## Limits: satellites cannot see everything

- **Clouds:** These optical measurements cannot see beneath clouds. A cloudy region can go days without data.
- **Resolution:** A pixel several kilometres wide shows a city but may not resolve a single chimney.
- **Timing:** Polar-orbiting satellites see a place once a day, so intraday changes or short leaks can be missed. Geostationary missions like Sentinel-4 are starting to close that gap over Europe.
- **Column versus surface:** Satellites measure the column; surface concentrations and health effects need model-based interpretation.
- **Surface conditions:** Snow, water and very dark surfaces make methane retrievals especially difficult.

<div class="callout"><strong>Note:</strong> Satellite data do not replace ground stations; they complement them. The most reliable picture comes from using satellites, ground measurements and models together.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Since 2017, Sentinel-5P/TROPOMI has produced near-daily global maps of NO₂, methane and other gases.</li><li>In 2025, Sentinel-4 (hourly, Europe) and Sentinel-5 (global) delivered their first images.</li><li>AI is used to find plumes in huge data streams, filter false alarms and estimate sources.</li><li>Clouds, resolution and once-a-day overpasses mean satellite data should be read alongside ground measurements.</li></ul></div>

<div class="faq"><details><summary>Can satellites measure carbon dioxide too?</summary><p>Yes, there are CO₂-measuring satellites, but because the background level of CO₂ is so high, separating human emissions is harder than for NO₂ or methane. Dedicated European missions are planned for this.</p></details><details><summary>Are these data really open to everyone?</summary><p>The Copernicus programme follows a free and open data policy. Raw and processed products are available online, alongside ready-made map services for non-specialists.</p></details><details><summary>What happens when a satellite spots a leak?</summary><p>It depends on who detects it and through which mechanism. UNEP's MARS, for example, notifies the relevant governments and, where possible, facility operators about large methane releases; responding remains their responsibility.</p></details></div>

---

**Sources**

- [Copernicus SentiWiki: Sentinel-5P mission](https://sentiwiki.copernicus.eu/web/s5p-mission)
- [ESA: Sentinel-4 images](https://www.esa.int/ESA_Multimedia/Missions/Sentinel-4/(result_type)/images)
- [ESA: Sentinel-5 images](https://www.esa.int/ESA_Multimedia/Missions/Sentinel-5/(result_type)/images)
- [UNEP: About the Methane Alert and Response System (MARS)](https://unep.org/about-methane-alert-and-response-system-mars)
- [MethaneSAT: MethaneSAT Loses Contact with Satellite](https://www.methanesat.org/project-updates/methanesat-loses-contact-satellite)
