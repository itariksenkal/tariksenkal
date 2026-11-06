---
title: "How to Spot Deepfakes: Clues, Their Limits and Better Habits"
description: "What deepfakes are, which clues give them away and why those fall short, plus content credentials (C2PA), verification habits and what to do if targeted."
publishDate: "2026-11-17T09:17:00+03:00"
lang: en
category: "Security"
tags: ["Deepfakes", "Artificial Intelligence", "Fact-Checking", "Online Safety"]
translation: "deepfake-nasil-anlasilir"
heroImage:
  src: "../../../assets/blog/covers/how-to-spot-deepfakes.jpg"
  alt: "A face split into a real half and an AI-generated half"
---

A video of a politician saying something they never said, an ad in which a familiar celebrity recommends an investment, a manager on a video call urgently asking for a money transfer: all of these can now be produced with AI. These “deepfakes” are getting easier to make and harder to tell apart from reality. In this post I explain what deepfakes are, which clues can give them away, and, more importantly, why those clues are not enough on their own. As someone who builds AI systems, I will say it up front: building verification habits is a far sturdier defence than trusting your eyes.

## What is a deepfake?

A deepfake is image, video or audio content created or altered with AI so that it shows a real person, place or event as if something happened that did not. The word combines “deep learning” and “fake”.

The most common types:

- **Face swaps:** the face of a person in a video is replaced with someone else’s.
- **Lip-syncing:** a real person’s mouth movements are altered so they appear to say words they never said.
- **Voice cloning:** a short voice sample is used to imitate someone’s voice reading any text.
- **Fully synthetic images:** a scene or a person who never existed is generated from scratch.

These techniques have legitimate uses too, in film-making, dubbing and accessibility. The trouble starts when they are used without consent and to deceive. One well-known example of how costly that can be: in a case Hong Kong police described in February 2024, and which British engineering firm Arup confirmed in May 2024, an employee was persuaded by a video call featuring deepfakes of colleagues he recognised and transferred about HK$200 million.

## Visual and audio clues

In a public service announcement issued in December 2024, the US Federal Bureau of Investigation (FBI) listed warning signs to watch for in AI-enabled fraud. Those, plus other commonly cited clues, can be summarised as follows:

| Where to look | Possible clue |
|---|---|
| Hands and teeth | Extra or missing fingers, teeth that blur into each other |
| Face and edges | Asymmetry, blurring along the hairline or jaw |
| Eyes and blinking | Unnatural gaze, very little or irregular blinking |
| Light and shadow | Lighting on the face that does not match the scene, inconsistent shadows |
| Accessories and background | Glasses or earrings that warp, nonsensical text |
| Voice | Flat intonation, unnatural breaths and pauses, word choices that do not fit how the person normally speaks |
| Sync | Lips and audio slightly out of step, lag in the video |

<div class="callout"><strong>Note:</strong> None of these clues is proof on its own. A heavily compressed, low-resolution video can look glitchy even if it is real, while a well-made deepfake may show none of these signs.</div>

## The limits of spotting clues

Relying on visual clues has three basic problems.

First, **the technology improves quickly.** A few years ago, “faces that never blink” and “six-fingered hands” were the best-known tells; in newer models they are much rarer. A clue that works today may not work tomorrow.

Second, **fakes usually circulate in low quality.** Videos shared on social media are compressed, cropped and screen-recorded again and again. That process introduces glitches into real videos and hides the traces in fake ones.

Third, **detection tools make mistakes too.** A tool saying “90% fake” does not mean the content is definitely fake, and a “real” verdict is no guarantee either. These tools can help, but they are not enough for a final decision.

So the real question is not “is this video fake?” but **“where did this content come from, and who can vouch for it?”**

## Provenance: C2PA and content credentials

Instead of trying to catch fakes, another approach focuses on proving where authentic content comes from. **C2PA** (the Coalition for Content Provenance and Authenticity) develops an open standard for verifying the origin and history of digital content. **Content Credentials**, based on that standard, attach a cryptographically signed record to a file: when and with what tool it was created, what edits it went through, and whether AI was involved.

Think of it as a kind of digital label. But C2PA’s own explainer stresses an important limit: content credentials show that the record is intact and who signed it; they **make no judgement about whether the content is true or accurate.** The credentials can also be stripped from a file, for example when someone takes a screenshot or uploads it to some platforms. The standard provides additional methods such as watermarks or fingerprints so the record can be found again in that case. In short, the presence of credentials is a useful signal, but their absence alone is not proof of fakery.

Regulation is moving as well. Article 50 of the European Union’s AI Act requires those who deploy AI to create or share deepfake content to disclose that it is artificially generated; these transparency obligations apply from 2 August 2026. For the separate duty on generative AI providers to mark outputs in a machine-readable way, systems already on the market were given a short transition period.

## Verification habits

Rather than trusting your eyes and ears, these habits give much more reliable results:

1. **Notice the emotion.** Content that makes you angry, scared or rushed is the most shared and the most manipulated. Pause for a minute before sharing.
2. **Find the source.** Who first published the video, and where? Does it appear on official accounts or reputable news outlets?
3. **Run a reverse image search.** Take a frame from the video and look for older or original versions. Plenty of “new” content is a doctored old clip.
4. **Check the context.** Do the location, weather, date and event fit together?
5. **Verify through another channel.** If a friend or manager asks for something unusual in a video or voice message, call them back on a number you already know.

## What to do if you are targeted

If you find fake content depicting you, act methodically rather than in a panic:

- **Preserve evidence.** Save links, screenshots, the accounts that shared it and the dates.
- **Report it to the platform.** Most large platforms have reporting channels for non-consensual or misleading synthetic content.
- **Do not hand over money or information.** If the content is being used for extortion, meeting demands rarely ends the problem.
- **Contact the authorities.** Report to your local police or national cybercrime unit; in serious cases, get help from a lawyer.
- **Warn the people around you.** Especially if your voice or likeness is being used for fraud, alert family and colleagues.

This section is general information, not legal advice.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>A deepfake is AI-generated or AI-altered content that shows a real person or event as if something happened that did not.</li><li>Clues in hands, eyes, lighting and voice can help, but they lose reliability as the technology improves.</li><li>C2PA content credentials show where content came from, not whether it is true; their absence is not proof of fakery.</li><li>Your strongest defence is a verification habit: pause, find the source, confirm through another channel.</li></ul></div>

<div class="faq"><details><summary>Can I rely on deepfake detection apps?</summary><p>Use them as one signal, not a verdict. They can flag real content as fake and fake content as real. Checking the source and context always matters more.</p></details><details><summary>If a photo has no content credentials, is it fake?</summary><p>No. Most content does not carry credentials yet, and they can be removed by screenshots or re-uploads. Missing credentials only mean the origin cannot be verified that way.</p></details><details><summary>How can I protect myself from being deepfaked?</summary><p>Full protection is hard, but you can lower the risk: keep social accounts private, limit public posts of your voice and video, and agree on a verification word with family for emergencies.</p></details><details><summary>Is making a deepfake always illegal?</summary><p>No; there are legitimate uses in film, parody and accessibility. But using someone’s likeness without consent in deceptive, degrading or fraudulent content can be unlawful under various laws in many countries.</p></details></div>

---

**Sources**

- [FBI IC3 – Criminals Use Generative Artificial Intelligence to Facilitate Financial Fraud (3 December 2024)](https://www.ic3.gov/PSA/2024/PSA241203)
- [C2PA – Content Credentials Explainer](https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html)
- [EUR-Lex – EU Artificial Intelligence Act, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [Dezeen – Arup victim of multimillion-dollar deepfake video scam in Hong Kong (17 May 2024)](https://www.dezeen.com/2024/05/17/arup-victim-deepfake-video-scam/)
