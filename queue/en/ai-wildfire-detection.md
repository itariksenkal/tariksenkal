---
title: "AI for Wildfire Detection: From Tower Cameras to Satellites"
description: "Lookout-tower cameras, satellite fire detection, spread models and risk maps: how AI helps detect and manage wildfires, with Türkiye examples and honest limits."
publishDate: "2026-12-04T09:17:00+03:00"
lang: en
category: "Environment"
tags: ["Artificial Intelligence", "Wildfires", "Environment"]
translation: "orman-yangini-tespitinde-yapay-zeka"
heroImage:
  src: "../../../assets/blog/covers/ai-wildfire-detection.jpg"
  alt: "Smoke rising from a forested hill with a lookout-tower camera"
---

With wildfires, the first minutes decide almost everything. A thin column of smoke can be put out by a small crew, while a fire with the wind behind it can burn for days and threaten thousands of hectares and nearby towns. So the most important question in firefighting is simple: how early can we spot a fire? Because of my background in environmental engineering, I also look at wildfires through an air-quality lens; smoke can raise fine-particle pollution in cities many kilometres away. In this post I cover how AI is used for fire detection, spread forecasting and risk mapping, what Türkiye is doing, and where these systems fall short.

## From lookout towers to smart cameras

For decades, early detection relied on lookouts in hilltop towers scanning the horizon with binoculars. It is still valuable, but nobody can stay fully alert for hours on end.

Today, cameras mounted on towers sweep the horizon continuously, and computer vision models trained to recognise smoke patterns analyse the footage. When the model sees something suspicious it raises an alert, and an operator checks it. Because each camera's position and viewing direction are known, smoke seen by more than one camera can be located approximately.

One well-known example is **ALERTCalifornia**. According to UC San Diego's October 2023 update, the network consists of more than 1,050 cameras watching California's highest fire-risk areas. When the AI notices an anomaly, it alerts watchstanders, and crews respond only after a human has confirmed it. After testing in summer 2023, the system was rolled out in September 2023 to all 21 units of CAL FIRE, California's forestry and fire protection department.

## What Türkiye is doing

Türkiye's General Directorate of Forestry (OGM) uses a similar approach. In February 2022, the then minister of agriculture and forestry said that cameras on lookout towers were detecting smoke in forests using AI and machine learning, that the rollout had started in Antalya and expanded to Muğla, and that alerts are sent to the relevant units by SMS or MMS once smoke is detected. Camera and tower counts have been reported with different figures at different times, so I am not quoting a number here; OGM's official statements are the best place for current figures.

OGM's other tool is an AI-supported **Decision Support System**, in use since 2022. According to a March 2024 statement from the Ministry of Agriculture and Forestry, it brings together weather data, data from the national Forest Information System (ORBİS), drone imagery and satellite images. It aims to estimate the likelihood of fires starting, anticipate how an active fire will behave and spread, recommend an intervention strategy and support timely evacuation of threatened settlements. The system was nominated for the 2024 World Summit on the Information Society (WSIS) Prizes run by the UN's International Telecommunication Union, and news reports in June 2024, citing the minister, said it placed second in the environment category.

## Detecting fires from space

Where cameras cannot see, in remote and mountainous terrain, satellites help. NASA's **FIRMS** (Fire Information for Resource Management System) publishes active fire detections from the MODIS and VIIRS sensors worldwide, generally within about three hours of observation. VIIRS has a resolution of roughly 375 metres and MODIS about 1 kilometre.

These sensors pick up unusually hot spots on the ground in infrared bands. But with pixels hundreds of metres wide, a very small, newly started fire can be missed, and each satellite passes over a given area only a few times a day. Satellite data is therefore better suited to tracking large fires, following fire perimeters and building a broad situational picture than to catching the first minutes. New geostationary satellites and small-satellite constellations aim to narrow that gap.

## Spread models and risk maps

Once a fire starts, the next question is where it will go and how fast. Fire spread models use wind speed and direction, humidity, slope and fuel (vegetation type and dryness) to simulate a fire's likely progress. Traditionally they rest on physics and empirical relationships; machine learning is increasingly used to speed them up or complement them by learning from past fires.

**Risk maps** show which areas are most dangerous on which days, before any fire starts. In Europe, **EFFIS** (the European Forest Fire Information System), run by the European Commission's Joint Research Centre under the Copernicus programme, publishes fire danger forecasts based on weather forecasts. These rely on the Canadian Fire Weather Index system, which is widely used around the world. Risk maps help pre-position crews and equipment and plan forest access bans.

<div class="callout"><strong>Tip:</strong> Before heading into a forested area in summer, check official fire danger notices and any access bans. If you see smoke or flames in Türkiye, call the 112 emergency number. No automated system fully replaces an early report from a member of the public.</div>

## Limits and false alarms

The biggest practical problem with AI-based fire detection is false alarms. Camera systems can mistake fog, low cloud, dust, agricultural burning, factory chimneys or even sun glare for smoke. A system that raises too many false alarms creates "alarm fatigue" among operators and makes it more likely that a real alert is missed. Lowering sensitivity, on the other hand, raises the risk of missing real fires. Setting that balance is an operational decision as much as a technical one.

Other limits include:

- **Line of sight:** A camera cannot see smoke behind a ridge; valleys and dense forest create blind spots.
- **Night and bad weather:** Visible-light cameras cannot see smoke at night; infrared cameras cost more.
- **Satellite latency and resolution:** Small fires may go undetected, and clouds or thick smoke can block the view.
- **Data and upkeep:** Cameras, communication links and models all need continuous maintenance and updating.

<div class="callout"><strong>Note:</strong> These systems work best on an "AI flags, humans confirm" model. Automation speeds up detection; final decisions and the response belong to experienced crews.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Early detection is the most critical factor in fighting wildfires; AI can shorten it by continuously scanning camera and satellite imagery.</li><li>In Türkiye, OGM uses tower cameras for smoke detection and an AI-supported Decision Support System in use since 2022.</li><li>Satellites are strong for tracking large fires but can miss very small, new ones.</li><li>Spread models and risk maps help crews get into position before and during fires.</li><li>False alarms are the core challenge; human-in-the-loop systems are the healthiest design.</li></ul></div>

<div class="faq"><details><summary>Can AI prevent wildfires altogether?</summary><p>No. AI helps identify risky days and areas, detect fires early and plan the response. Since most wildfires are caused by people, prevention depends largely on careful behaviour and enforcement.</p></details><details><summary>Can I look at satellite fire data myself?</summary><p>Yes. NASA FIRMS and Europe's EFFIS both offer public online maps of active fires and fire danger. The data can be delayed, though, so in an emergency always contact the authorities.</p></details><details><summary>Have cameras replaced human lookouts?</summary><p>Not entirely. Cameras and AI can scan large areas without a break, but experienced staff are still needed to confirm alerts and interpret the situation on the ground. In practice the two work together.</p></details></div>

---

**Sources**

- [Türkiye Ministry of Agriculture and Forestry: AI system used against forest fires nominated for international award (March 2024, Turkish)](https://www.tarimorman.gov.tr/Haber/6249/Orman-Yanginlariyla-Mucadelede-Kullanilan-Yapay-Zek%C3%A2-Sistemi-Uluslararasi-Odule-Aday)
- [Türkiye Gazetesi: Minister Pakdemirli, "We detect smoke with AI" (February 2022, Turkish)](https://www.turkiyegazetesi.com.tr/gundem/bakan-pakdemirli-dumani-yapay-zeka-ile-tespit-ediyoruz-820437)
- [NASA FIRMS: Fire Information for Resource Management System](https://firms2.modaps.eosdis.nasa.gov/)
- [EFFIS: European Forest Fire Information System](https://forest-fire.emergency.copernicus.eu/)
- [UC San Diego Today: ALERTCalifornia (October 2023)](https://today.ucsd.edu/story/alert-california)
