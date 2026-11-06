---
title: "How Are AI Models Trained? A Guide for Non-Engineers"
description: "From data collection and pre-training to fine-tuning and evaluation: the life of a language model, what drives its cost, and why data quality matters most."
publishDate: "2026-11-21T09:17:00+03:00"
lang: en
category: "Basics"
tags: ["Artificial Intelligence", "Language Models", "Data"]
translation: "yapay-zeka-modeli-nasil-egitilir"
heroImage:
  src: "../../../assets/blog/covers/how-ai-models-are-trained.jpg"
  alt: "Diagram of the data, training and evaluation stages of an AI model"
---

When you ask a chat assistant a question, you get a fluent and often accurate answer in seconds. Behind that answer sits months of preparation: collecting and cleaning an enormous amount of text, a training run that keeps thousands of processors busy for weeks, and a separate phase in which the model learns to behave like a helpful assistant. Knowing this story is useful well beyond engineering teams. It explains much of what a model is good at, where it tends to fail, and why building one is so expensive. In this post I walk through the life of a language model step by step, without drowning in technical detail.

## It all starts with data

A language model learns by playing a deceptively simple game: predicting what comes next in a piece of text. More precisely, it predicts the next "token", a word or a fragment of a word. To get good at this game it needs to see a staggering number of examples, so the first job is gathering data: publicly available web pages, books, encyclopaedic content, open-source code, scientific papers and similar sources.

Raw data is messy. It contains hundreds of copies of the same page, boilerplate ads, broken characters, spam and personal information. So most of it gets cleaned: duplicates are removed, low-quality pages are filtered out, languages are identified, and harmful or sensitive content is stripped where possible. The FineWeb work published by a Hugging Face team in 2024 is a good illustration. They built a dataset of roughly 15 trillion tokens from 96 Common Crawl snapshots, and reported that models trained on a 1.3-trillion-token subset filtered for educational content did dramatically better on knowledge and reasoning benchmarks.

<div class="callout"><strong>Tip:</strong> "How big is the model?" is only half the question. "What data was it trained on, and how clean was it?" matters just as much. For a language like Turkish, good performance starts with having enough high-quality Turkish text in the training mix.</div>

## Pre-training: learning language and the world by reading

Once the data is ready, the longest and most expensive phase begins: **pre-training**. The model tries to predict the continuation of texts, and every time it guesses wrong its internal parameters (think of billions of tiny adjustment knobs) are nudged slightly. Repeated over trillions of tokens, this process lets the model absorb grammar, relationships between words, factual knowledge and even some patterns of reasoning, all statistically.

The result is a **base model**. It knows a lot, but it is not yet a good conversational partner. Ask it a question and it may simply continue with more questions, because all it has learned is to continue text.

There is an important balance here between model size and the amount of data. DeepMind's 2022 "Chinchilla" paper showed that a 70-billion-parameter model, trained with the same compute budget but about four times more data, outperformed the 280-billion-parameter Gopher on a wide range of evaluations. Making the model bigger is not enough; you also have to feed it enough of the right data.

## Fine-tuning and alignment: from knowledgeable to helpful

Turning a base model into a useful assistant takes a second phase, which roughly has two steps:

1.  **Supervised fine-tuning:** the model is trained on example prompts and responses written by people, so it learns to follow instructions and answer in an appropriate format.
2.  **Learning from preferences:** the model produces several answers to the same prompt, people (or helper models that imitate human preferences) rank them, and the model is pushed towards the preferred ones. The best-known method is reinforcement learning from human feedback (RLHF).

The effect can be surprisingly large. In OpenAI's 2022 InstructGPT paper, human evaluators preferred outputs from a 1.3-billion-parameter fine-tuned model over those of the 175-billion-parameter GPT-3, a model about 100 times larger. This phase is also where a model's approach to harmful requests and its behaviour in ambiguous situations are shaped.

## Evaluation: "looks good" is not good enough

Before release, a trained model gets measured. There are several ways to do this:

-   **Benchmarks:** ready-made question sets for maths, coding, general knowledge, reading comprehension and so on.
-   **Human evaluation:** real people compare and score answers.
-   **Safety testing:** "red teaming", where testers deliberately push the model and try misuse scenarios.
-   **Domain-specific tests:** questions drawn from the actual use case, whether legal, medical or customer support.

One trap to watch for: if test questions leak into the training data, the model may have effectively memorised the answers and the score will look better than it should. Serious teams therefore also keep private test sets. Personally, I put more trust in small, carefully built test sets that resemble real usage than in headline benchmark numbers.

## Where do the compute and the cost come from?

Training a large model means thousands of graphics processors (GPUs) working together for weeks or months. The main cost buckets look like this:

| Item | What it covers |
|---|---|
| Hardware | GPUs, servers and the networking that connects them |
| Staff | Researchers and engineers, including failed experiments |
| Energy | Electricity and cooling during training |
| Data | Collection, cleaning, labelling and human feedback |

According to a 2024 analysis by Epoch AI, the cost of the final training run for frontier models has grown about 2.4x per year since 2016. For models like GPT-4 and Gemini Ultra, roughly half to two-thirds of the cost went to hardware, a third to a half to staff, and only 2–6% to energy. Stanford's 2025 AI Index notes that training compute for notable models doubles roughly every five months. The same report also finds that the cost of running a model at a fixed performance level fell more than 280-fold between November 2022 and October 2024. Training is getting more expensive while using models is getting cheaper.

For most organisations, training from scratch is not the realistic path. Fine-tuning an existing model on your own data, or leaving the model unchanged and handing it your documents at query time (RAG), costs a fraction as much.

## Why data quality comes first

A model's behaviour is largely a mirror of the data it has seen. Frequent errors, biases or gaps in the data show up directly in its answers. That is why you often hear the same observation in the field: with a fixed budget, investing in cleaner data frequently beats training a bigger model. The Chinchilla and FineWeb results above point the same way. During fine-tuning, a few thousand carefully crafted examples can be worth more than tens of thousands of careless ones.

Working on Turkish NLP, I see this regularly. Turkish word structure, where a single word can carry many suffixes, the gap between formal and everyday language, and domain-specific terminology all make well-chosen Turkish data even more important.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>A language model is first pre-trained by predicting the next token across a huge, cleaned body of text.</li><li>Fine-tuning and learning from human preferences turn a knowledgeable base model into an assistant that follows instructions.</li><li>Evaluation should combine public benchmarks with private test sets that resemble real use.</li><li>Most of the cost is hardware and people; training is getting pricier while using models is getting cheaper.</li><li>Data quality matters as much as model size, and often more.</li></ul></div>

<div class="faq"><details><summary>What is the difference between training a model and using it?</summary><p>Training is the expensive, one-off process in which the model's parameters are learned from data. Using it (inference) means the trained model generating an answer to each request; it is far cheaper and the model is no longer learning, only applying what it learned.</p></details><details><summary>Does the model learn from me while we chat?</summary><p>The model's parameters do not change during a conversation. Some services may, depending on your settings, use conversations for future training, so it is worth reading the data policy of the service you use and keeping sensitive information out.</p></details><details><summary>Do I need to train my own model for my company?</summary><p>Usually not. Using an existing model with your documents via RAG, or doing a small fine-tune, is much faster and cheaper than training from scratch. Training from scratch tends to make sense only for very specific language or domain needs.</p></details><details><summary>Why do models sometimes make things up?</summary><p>Because they are trained to produce the most likely continuation, not the true one. Even when their knowledge is thin, they can produce a fluent answer. Systems that cite sources and careful evaluation reduce this risk but do not eliminate it.</p></details></div>

---

**Sources**

-   [Hoffmann et al. (2022), Training Compute-Optimal Large Language Models (Chinchilla), arXiv](https://arxiv.org/abs/2203.15556)
-   [Ouyang et al. (2022), Training language models to follow instructions with human feedback, arXiv](https://arxiv.org/abs/2203.02155)
-   [Penedo et al. (2024), The FineWeb Datasets, arXiv](https://arxiv.org/abs/2406.17557)
-   [Epoch AI (2024), How Much Does It Cost to Train Frontier AI Models?](https://epoch.ai/blog/how-much-does-it-cost-to-train-frontier-ai-models)
-   [Stanford HAI, AI Index Report 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report)
