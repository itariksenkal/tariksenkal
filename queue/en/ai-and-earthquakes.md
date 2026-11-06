---
title: "AI and Earthquakes: What It Can and Cannot Do"
description: "Can AI predict earthquakes? A calm look at machine learning for seismic detection, early warning and satellite damage mapping after Türkiye's 2023 quakes."
publishDate: "2026-12-03T09:17:00+03:00"
lang: en
category: "Society"
tags: ["Artificial Intelligence", "Earthquakes", "Disaster Management"]
translation: "deprem-ve-yapay-zeka"
heroImage:
  src: "../../../assets/blog/covers/ai-and-earthquakes.jpg"
  alt: "Seismograph trace next to a satellite damage map"
---

In Türkiye, earthquakes are a subject that has touched almost everyone's life. After the Kahramanmaraş earthquakes of 6 February 2023, claims such as "AI knew the earthquake was coming" or "a big one will hit on this date" spread widely on social media. As someone who works in AI, I think it matters to explain calmly what the technology can and cannot do, because false hope and false fear both make it harder for people to make good decisions. This post looks at three areas: detecting seismic signals, early warning systems, and damage assessment after an earthquake. But first, the question people ask most.

## Can earthquakes be predicted?

The short answer is no, not reliably, not today. The US Geological Survey (USGS) answers this question with a plain "No": neither the USGS nor any other scientists have ever predicted a major earthquake. The agency adds that it does not know how to, and does not expect to know how any time in the foreseeable future.

It helps to separate three ideas:

| Concept | What it says | Possible? |
|---|---|---|
| **Prediction** | An earthquake of a given size will strike a given place on a given date | No; there is no scientifically demonstrated method |
| **Forecast** | The probability of an earthquake of a given size in a region over coming years | Yes; hazard maps and building codes rely on it |
| **Early warning** | Once a quake has started, an alert arrives seconds before the shaking reaches you | Yes, but only seconds to tens of seconds |

AI does not change this table. A model learning patterns in past data does not mean it can name the date of a future major earthquake. Large earthquakes are rare, so there are few examples to learn from, and we cannot directly observe what is happening inside faults. When you see a post claiming that "AI said an earthquake will hit on this date", treat it as an unverified claim, not a scientific finding.

<div class="callout"><strong>Tip:</strong> For any earthquake prediction claim, ask three questions. Are the date, place and magnitude specific? Has the method been described in a peer-reviewed scientific publication? Are the person's or system's past misses counted too? If the answers are unsatisfying, do not take the claim seriously.</div>

## How machine learning reads seismic signals

Where AI has genuinely made a difference in seismology is in finding and measuring earthquakes in recordings. Seismometers record continuously, and their data mixes traffic, wind, ocean waves and small earthquakes. Separating a quake's signal from noise and timing the arrival of P and S waves (phase picking) was long done largely by analysts or by simple algorithms.

Deep learning models can do this faster and more sensitively. **EQTransformer**, published in Nature Communications in 2020, combines earthquake detection and P- and S-phase picking in a single network. Models like this can add large numbers of small earthquakes that older methods missed to earthquake catalogues.

Why does that matter? More complete catalogues help scientists understand how fault systems behave, how aftershock sequences evolve and which areas are active. That indirectly improves hazard estimates. It still does not produce a prediction machine.

## Early warning: a race, not a forecast

Early warning systems do not know about an earthquake in advance; they work after it has begun. An earthquake first sends out faster but less damaging P waves, followed by slower, more destructive S waves. When stations near the epicentre detect a quake, the information can travel electronically far faster than the seismic waves. A city further away might gain anywhere from a few seconds to tens of seconds of warning. Very close to the epicentre, the warning time is close to zero.

The situation in Türkiye needs careful wording. Boğaziçi University's Kandilli Observatory operates an early warning system in Istanbul. According to Kandilli's statement in March 2023, the signal goes to institutions that request it and is aimed at reducing secondary disasters, such as preventing gas explosions or shutting down certain facilities. The same statement said that Türkiye did not have a public-facing earthquake early warning system. While preparing this post (November 2026), I could not find an official announcement that AFAD, the national disaster agency, has launched a nationwide public early warning system; check AFAD's and Kandilli's official channels for the current status.

Phones play a role too. Google's Android Earthquake Alerts system uses phone accelerometers as tiny seismometers. During the 6 February 2023 earthquakes, however, it did not perform as intended. As reported by Anadolu Agency in July 2025, Google acknowledged, in an analysis by its researchers published in Science and in company statements, that the system estimated the first magnitude 7.8 quake at 4.5–4.9 and sent its highest-level "Take Action" alert to only 469 people. Google said the alert could have reached around 10 million people within 157 km of the epicentre, and that it has since revised the algorithm. It is a clear reminder that machine-learning systems can struggle precisely when they are needed most: in very large, rare events.

## Rapid damage assessment after the quake

Another area where AI and remote sensing contribute concretely is the first hours and days after a disaster. How many buildings collapsed in which neighbourhood? Which roads are blocked? Fast answers determine where search-and-rescue teams and aid go.

On 6 February 2023, the EU's Copernicus Emergency Management Service activated its rapid mapping module, on behalf of AFAD, less than four hours after the magnitude 7.8 earthquake. Copernicus's bulletin of 10 February reports 20 areas of interest, a first damage-grading map delivered 40 hours after activation, and 53 maps produced by 10 February. Analysts used very high-resolution optical satellite images taken in the days after the earthquake.

Mapping like this relies heavily on expert image interpretation, while machine learning models are increasingly used to speed it up by comparing before-and-after images and automatically flagging potentially damaged buildings. The limits are real: a building whose floors have pancaked can look intact from above, and clouds, shadows and viewing angles affect results. Satellite-based assessments do not replace field teams; they show them where to start.

<div class="callout"><strong>Note:</strong> During and after an earthquake, follow official sources such as AFAD, Kandilli Observatory and local governors' offices. Unverified app notifications and social media posts can cause panic.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Earthquakes cannot be reliably predicted today, and AI has not changed that.</li><li>Machine learning has brought real progress in detecting small earthquakes and picking seismic phases.</li><li>Early warning is not prediction; it buys seconds after a quake begins. For a nationwide public system in Türkiye, follow official announcements.</li><li>Satellite imagery and AI can speed up post-disaster damage assessment but do not replace ground verification.</li><li>The most effective protection is still sound buildings and preparedness.</li></ul></div>

<div class="faq"><details><summary>Can animals sense earthquakes in advance?</summary><p>There are many anecdotes, but animal behaviour has not been scientifically shown to reliably forecast earthquakes. Any method would need to get the date, place and magnitude right repeatedly to count.</p></details><details><summary>Should I trust earthquake alerts on my phone?</summary><p>Phone-based alerts can buy a few seconds after a quake starts, but as 2023 showed, they can make mistakes in very large events. If you receive one, it makes sense to drop, cover and hold on, then wait for official information.</p></details><details><summary>How can AI help with earthquake preparedness?</summary><p>It can support building inventories, prioritising high-risk structures, scenario-based loss estimates and post-disaster logistics. It cannot replace a safe building stock and personal preparedness.</p></details></div>

---

**Sources**

- [USGS: Can you predict earthquakes?](https://www.usgs.gov/faqs/can-you-predict-earthquakes)
- [Mousavi et al. (2020), "Earthquake transformer", Nature Communications](https://www.nature.com/articles/s41467-020-17591-w)
- [CNN Türk: Kandilli's statement on the earthquake early warning system (March 2023, Turkish)](https://www.cnnturk.com/turkiye/kandilliden-deprem-erken-uyari-sistemi-aciklamasi-1902771)
- [Anadolu Agency: Google admits it failed to alert 10M in Türkiye about severity of 2023 earthquakes (July 2025)](https://aa.com.tr/en/science-technology/google-admits-it-failed-to-alert-10m-in-turkiye-about-severity-of-2023-earthquakes/3644795)
- [Copernicus EMS: Information Bulletin 165 on damage assessment after the Türkiye earthquake](https://mapping.emergency.copernicus.eu/news/information-bulletin-165-the-copernicus-emergency-management-service-assesses-the-damage-caused-by-the-earthquake-in-t%C3%BCrkiye/)
