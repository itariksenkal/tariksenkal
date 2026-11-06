---
title: "AI in Smart Cities: From Traffic Lights to Waste, Benefits and Risks"
description: "Traffic signals, public transport demand, energy and water networks, waste collection: how AI is used in smart cities, and where privacy should draw the line."
publishDate: "2026-12-01T09:17:00+03:00"
lang: en
category: "Applications"
tags: ["Artificial Intelligence", "Smart Cities", "Privacy"]
translation: "akilli-sehirlerde-yapay-zeka"
heroImage:
  src: "../../../assets/blog/covers/ai-in-smart-cities.jpg"
  alt: "City skyline connected by streams of data"
---

You have probably sat at a red light while the crossing road stood completely empty, or waited at a stop only to watch three buses on the same route arrive one after another. Cities are vast, complex systems; traffic, transit, energy, water and waste run on millions of small decisions every day. The "smart city" idea is to base those decisions on better data and better forecasts. AI is a big part of that idea, but it also carries the risk of turning the city into a space where everyone is watched. With a background in environmental engineering, I tend to look at cities partly through the lens of air quality and resource use, and in this post I want to cover both the benefits and the limits worth respecting.

## Traffic lights: the most visible example

Most traffic signals run on fixed timing plans or simple detectors. AI can help in two ways: by modelling traffic patterns at intersections in much more detail, and by coordinating neighbouring intersections. A few seconds gained at one junction can easily be lost to a queue at the next.

A well-known example is Google Research's **Project Green Light**. According to Google's July 2024 update, the system models stop-and-go patterns and waiting times at intersections from Google Maps driving trends, then gives city traffic engineers recommendations for adjusting signal timing. The key detail: the city's engineers decide and implement the changes; the system does not control lights in real time. Google reports that early numbers across more than 70 intersections show potential to cut stops by up to 30% and intersection emissions by up to 10%. These are early, company-reported figures and are best read alongside independent evaluations.

Less stop-and-go is not just about saving time. Exhaust emissions rise when vehicles brake and accelerate, so air quality around intersections is directly affected.

## Forecasting public transport demand

The core question in public transport is: how many vehicles does each line need, and when? By combining smart-card ticketing data, vehicle location systems, calendars, weather and city events, machine learning models can forecast passenger demand hour by hour. That helps set service frequency, prevent buses on the same line from bunching together, and plan extra services for football matches or concerts.

The catch is that this data is, in effect, a record of individual movements. Knowing where someone boards and alights every day can easily reveal their home and workplace. Working with aggregated, anonymised data is a basic requirement of good design here.

## Energy and water networks

A city's hidden infrastructure can benefit too:

- **Electricity demand forecasting:** Predicting hourly consumption helps balance the grid and make better use of renewable sources.
- **Leak detection in water networks:** Unusual patterns in pressure and flow sensors can flag a burst pipe or slow leak underground early. Water lost in the network wastes both the resource and the energy used to pump it.
- **Building energy management:** Adjusting heating and cooling in public buildings based on occupancy and weather forecasts is one of the easier ways to cut consumption.

What these applications share is that they touch relatively little personal data. Pressure readings from a water main reveal nothing about anyone's private life, which makes this a sensible place for a city to start.

## Waste collection

Waste trucks often follow fixed routes, emptying every container at the same frequency whether it is full or nearly empty. With fill-level sensors in containers and route optimisation algorithms, crews can visit only the containers that are close to full. That means fewer kilometres, less fuel, less noise and lower emissions. Often what gets called "AI" here is a well-posed optimisation problem plus reliable sensors, a useful reminder that not every smart solution needs a large neural network.

<div class="callout"><strong>Tip:</strong> When assessing a smart city project, ask which problem it solves and how success is measured. Concrete targets such as waiting time, water loss rate or kilometres driven are far more trustworthy than vague promises of a "smarter" city.</div>

## Privacy and surveillance: where is the line?

The most sensitive part of the smart city debate is cameras and facial recognition. Counting vehicles to measure congestion and identifying individual people in a crowd are very different things, yet the same camera infrastructure can do both.

The EU's Artificial Intelligence Act (Regulation 2024/1689), published in 2024, prohibits in principle the use of **real-time remote biometric identification** in publicly accessible spaces for law enforcement. The exceptions are narrow, covering situations such as searching for missing persons or specific victims, preventing a specific and imminent threat, and locating suspects of certain serious crimes, and they generally require prior authorisation from a judicial or independent authority. In Türkiye, the Personal Data Protection Law (No. 6698) classifies biometric data as a special category of personal data and subjects its processing to strict conditions.

In my view, well-designed projects tend to follow a few principles:

- **Purpose limitation:** A system installed to count traffic should not be repurposed for identifying people.
- **Data minimisation:** Where possible, store only the count, not the image; process footage on the device and discard it.
- **Transparency:** Residents should be able to find out what data is collected and why.
- **Auditability:** Algorithmic decisions should be open to independent review.

<div class="callout"><strong>Note:</strong> This section is general information, not legal advice. Whether a specific project complies with the law should be assessed by a qualified professional.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>In smart cities, AI is mostly used for forecasting and optimisation: traffic, passenger demand, energy, water and waste.</li><li>In signal optimisation, the model often recommends and the city engineer decides; early results are promising but mostly company-reported.</li><li>Infrastructure networks that touch little personal data are a safe and productive place to start.</li><li>Cameras and facial recognition are where the line between a smart city and a surveillance city is drawn; the EU has imposed strict limits there.</li></ul></div>

<div class="faq"><details><summary>Does a smart city mean cameras everywhere?</summary><p>No. Many smart city applications need no cameras at all: pressure sensors in water mains, fill-level sensors in bins, or aggregated ticketing data. Where cameras are used, it is possible to count without storing images.</p></details><details><summary>Is AI controlling the traffic lights?</summary><p>In most deployments AI produces recommendations or adjusts timings within predefined limits. Safety rules and final decisions remain with traffic engineers.</p></details><details><summary>How is my personal data protected in smart city systems?</summary><p>It depends on who runs the system and which laws apply, such as the GDPR in the EU or KVKK in Türkiye. You can check the operator's privacy notice and contact its data controller to ask what is collected.</p></details></div>

---

**Sources**

- [Google: Project Green Light's work to reduce urban emissions using AI (July 2024)](https://blog.google/outreach-initiatives/sustainability/google-ai-project-greenlight/)
- [EUR-Lex: Regulation (EU) 2024/1689, the Artificial Intelligence Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)
- [Future of Privacy Forum: Red lines under the EU AI Act on real-time remote biometric identification](https://fpf.org/blog/red-lines-under-the-eu-ai-act-restricting-real-time-remote-biometric-identification-systems-for-law-enforcement-purposes/)
- [Turkish Personal Data Protection Law No. 6698 (official legislation portal, Turkish)](https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf)
