---
title: "How Speech Recognition Works: From Sound Waves to Text"
description: "How does speech-to-text work? Audio features, end-to-end models like Whisper, word error rate, why Turkish is hard, and what to know about voice data privacy."
publishDate: "2026-11-29T09:17:00+03:00"
lang: en
category: "Basics"
tags: ["Speech Recognition", "Artificial Intelligence", "Turkish NLP"]
translation: "ses-tanima-nasil-calisir"
heroImage:
  src: "../../../assets/blog/covers/how-speech-recognition-works.jpg"
  alt: "Illustration of a sound wave turning into text"
---

When you dictate a message to your phone, get an automatic transcript of a meeting, or hear a call centre ask you to "briefly describe your request", the same technology is at work: automatic speech recognition, or speech-to-text. It feels simple because people do it effortlessly. To a computer, though, speech is nothing more than tiny fluctuations in air pressure. As someone who works on Turkish natural language processing, I want to walk through how sound becomes text, how accuracy is measured, why a language like Turkish poses extra challenges, and what to keep in mind before you hand your voice to an app.

## What sound looks like to a computer

A microphone converts vibrations in the air into an electrical signal. That signal is measured thousands of times per second and stored as a sequence of numbers, a process called _sampling_. Speech systems commonly work at 16,000 samples per second, so one minute of speech is roughly a million numbers.

Models can work with this raw sequence, but it is usually transformed first. The audio is cut into short windows of 20–30 milliseconds, and for each window the system measures how much energy sits at each frequency. The result is a _spectrogram_: time on one axis, frequency on the other, and brightness for energy. Most systems use a frequency scale that mimics how human hearing works (the Mel scale). Suddenly the difference between "a" and "e", or the hiss of an "s", becomes a visible pattern a model can learn.

## From pipelines to end-to-end models

For decades, speech recognisers were built from separate parts:

- **Acoustic model:** maps slices of audio to probabilities of phonemes (sound units).
- **Pronunciation lexicon:** says which phoneme sequences spell which words.
- **Language model:** answers "which word sequence is more likely?", helping choose between "recognise speech" and "wreck a nice beach".

Each part needed its own expertise and data. The approach that now dominates is _end-to-end_: a single neural network takes the spectrogram and produces text directly, learning the intermediate steps on its own.

A well-known example is **Whisper**, released by OpenAI in 2022. According to its paper, it was trained on 680,000 hours of labelled audio collected from the web, of which 117,000 hours covered 96 languages other than English. Whisper resamples audio to 16 kHz, splits it into 30-second segments, turns each into a Mel spectrogram, and uses an encoder-decoder Transformer to generate text as tokens (small pieces of words). The decoder behaves much like a language model, predicting each token from the ones before it.

End-to-end models are notably more robust to noise, different microphones and accents. Their weakness comes from that same language-model behaviour: when the audio is unclear, or during long silences, they can produce a fluent sentence nobody actually said. For anything important, a human should review the transcript.

## Measuring accuracy: word error rate

The standard metric is **word error rate** (WER). The system's output is aligned with a human-written reference transcript, and three kinds of errors are counted:

| Error type | Meaning | Example (reference: "I will arrive at three tomorrow") |
|---|---|---|
| Substitution (S) | Wrong word | "I will arrive at **tree** tomorrow" |
| Deletion (D) | Missing word | "I will arrive three tomorrow" |
| Insertion (I) | Extra word | "I will **then** arrive at three tomorrow" |

The formula is WER = (S + D + I) / N, where N is the number of words in the reference. A 10% WER means roughly one error every ten words. Lower is better, and with many insertions the rate can even exceed 100%.

<div class="callout"><strong>Tip:</strong> When a product claims "95% accuracy", ask what data it was measured on. Clean read-aloud speech and a noisy phone call can differ several-fold in error rate. A small test set built from your own recordings is the most honest benchmark you can get.</div>

## Why Turkish is harder than it looks

Turkish is a useful case study because it stresses speech systems in several ways at once.

**Agglutination.** Turkish builds words by stacking suffixes, so one word can carry what English expresses in a whole phrase: "evlerimizdekilerden" means roughly "from the ones in our houses". The number of possible word forms is practically unlimited, so a model will regularly meet forms it has never seen. WER is also harsh here: a single wrong suffix makes the entire word count as an error. Character error rate (CER) is a fairer companion metric for Turkish.

**Accents and regional speech.** Vowel length, the soft "ğ", swallowed syllables in fast speech, and regional varieties from the Black Sea coast to eastern Anatolia all vary. If the training data leans towards standard Istanbul Turkish, error rates rise elsewhere.

**Code-switching.** Everyday and workplace Turkish is full of mixed sentences such as "toplantıya join oldum" ("I joined the meeting"), where an English root takes a Turkish suffix. Models often stumble on exactly these.

**Data.** English has hundreds of thousands of hours of training audio; openly available Turkish data is far smaller. Mozilla's volunteer-built Common Voice dataset, for example, lists about 129 validated hours of Turkish in its version 25.0, released in March 2026. It is a valuable resource, but the gap in scale is obvious.

**Normalisation.** Is it "3 March" or "three march"? "Dr." or "doctor"? Even a correct transcription counts as wrong if it is written differently from the reference. Turkish also has the dotted and dotless i (İ/i and I/ı), and tools that apply English case rules can quietly corrupt text before it is scored.

## Voice data and privacy

A recording contains more than words. It can reveal who is speaking, hints about their age, their emotional state, and the voices of other people in the room. That makes voice recordings personal data that deserve careful handling.

In Türkiye, the Personal Data Protection Law (KVKK, Law No. 6698) lists biometric data as a special category of personal data. Using a recording to identify or verify a person, as with a voiceprint, can move it into that more strictly protected category. In the EU, the GDPR takes a similar approach to biometric data used for identification. Even recordings processed only for transcription remain personal data.

Questions worth asking before you use a speech service:

- **Where is the audio processed?** On the device or in the cloud, and if in the cloud, in which country?
- **Is the recording kept?** Is the audio deleted after transcription, and if not, for how long is it stored?
- **Is it used for training?** Many services make this a setting; check the default.
- **Who else is being recorded?** Tell meeting participants before you start transcribing.

<div class="callout"><strong>Note:</strong> This section is general information, not legal advice. If you are processing voice data in an organisation, consult a qualified professional.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Speech recognition first turns audio into a representation such as a spectrogram, then a model generates text from it.</li><li>End-to-end models like Whisper have largely replaced multi-part pipelines, but they can invent text when audio is unclear.</li><li>Word error rate (WER) is the standard metric; for Turkish, character error rate gives a fairer picture.</li><li>Agglutination, regional accents, code-switching and limited open data make Turkish especially challenging.</li><li>Voice recordings are personal data: ask where they are processed, how long they are kept and whether they are used for training.</li></ul></div>

<div class="faq"><details><summary>Is speech recognition the same as a voice assistant?</summary><p>No. Speech recognition only converts speech to text. A voice assistant then tries to understand that text, take an action and usually speak a reply using text-to-speech. Speech recognition is the first link in that chain.</p></details><details><summary>How can I get better transcripts?</summary><p>Keep the microphone close, reduce background noise and avoid people talking over each other. If your recordings contain many names or technical terms, use custom vocabulary or context hints where the tool offers them. Always review the output.</p></details><details><summary>What counts as a "good" word error rate?</summary><p>There is no single threshold; it depends on the use. Some errors are fine for personal notes, while subtitles, medical or legal records need much lower error rates plus human review. What matters is measuring on data that resembles your own.</p></details><details><summary>Does a transcription app keep my voice?</summary><p>It depends on the app. Check its privacy policy for where audio is processed, how long it is stored and whether it is used to improve models, and look for settings that let you opt out.</p></details></div>

---

**Sources**

- [Radford et al., "Robust Speech Recognition via Large-Scale Weak Supervision" (Whisper paper)](https://ar5iv.labs.arxiv.org/html/2212.04356)
- [Hugging Face Evaluate: word error rate (WER) metric](https://huggingface.co/spaces/evaluate-metric/wer/blob/main/README.md)
- [Mozilla Common Voice Scripted Speech 25.0 – Turkish dataset](https://datacollective.mozillafoundation.org/datasets/cmn2e7kbl01k2mm07gm5n1bc9)
- [Turkish Personal Data Protection Law No. 6698 (official legislation portal, Turkish)](https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf)
