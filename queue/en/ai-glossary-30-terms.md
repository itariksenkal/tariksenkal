---
title: "AI Glossary: 30 Essential Terms Explained in Plain Language"
description: "Model, token, parameter, hallucination, RAG, agent, GPU and more: a practical glossary explaining 30 common AI terms in one or two plain sentences each."
publishDate: "2026-11-14T09:17:00+03:00"
lang: en
category: "Basics"
tags: ["Artificial Intelligence", "Glossary", "Basics"]
translation: "yapay-zeka-sozlugu-30-kavram"
heroImage:
  src: "../../../assets/blog/covers/ai-glossary-30-terms.jpg"
  alt: "Glossary illustration showing grouped artificial intelligence terms"
---

If someone in a meeting says “we fine-tuned the model, added RAG and hallucinations went down” and half of the sentence floats past you, you are in good company. AI moved into everyday life quickly, but the vocabulary that came with it was rarely explained along the way. In my work on Turkish language processing and large language models, the questions I hear most often are not technical but conceptual: “What exactly is a parameter?” “Is open source the same as open weights?” In this post I group 30 common terms into five clusters and explain each one in a sentence or two. The goal is not to make you an expert, but to help you follow a news story, a product launch or a slide deck without getting lost.

## The foundations

Let’s start with the widest frame. These five terms nest inside one another like rings: artificial intelligence is the outermost ring, and the model is the concrete thing you actually use.

| Term | Plain explanation |
|---|---|
| **Artificial intelligence (AI)** | The umbrella name for systems that perform tasks we usually associate with human intelligence, such as predicting, recommending, deciding or generating content. |
| **Machine learning** | An approach where, instead of writing every rule by hand, we let the computer extract patterns from examples. Most AI applications today are built this way. |
| **Deep learning** | Machine learning with neural networks that have many layers. It is the technique behind the big leaps in image recognition, speech and language models. |
| **Neural network** | A mathematical structure made of many simple, connected computing units. It is named after the brain, but it behaves more like a calculator that transforms numbers layer by layer. |
| **Model** | The concrete artifact produced by training: files and software that take an input and produce an output. “The model behind a chatbot” refers to this. |

## How a model learns

What a model “knows” is really millions or billions of numbers that were tuned during training. These terms describe the stages of that process.

| Term | Plain explanation |
|---|---|
| **Training data** | All the examples a model sees while learning: text, images, audio. Much of a model’s strengths and blind spots come from this data. |
| **Training** | The repeated process of comparing the model’s guesses with correct answers and nudging it to reduce its errors. For large models it can take weeks and cost a great deal. |
| **Parameter** | One of the adjustable numbers inside a model. A “70-billion-parameter model” contains 70 billion values set by training; more parameters usually means more capacity, but also more cost. |
| **Pre-training** | The first and most expensive stage, where a model learns general language or visual skills from a very large, broad dataset. |
| **Fine-tuning** | Extra training of a pre-trained model on a smaller, specialised dataset to adapt it to a particular task or style. |
| **Alignment** | The effort to make a model’s behaviour match human intentions and values: be helpful, avoid harm, stay honest. |
| **RLHF** | “Reinforcement learning from human feedback.” People mark which answers they prefer, a reward signal is learned from those choices, and the model is tuned toward it. |

For a deeper look, see my post on [RLHF and model alignment](/en/posts/rlhf-model-alignment/).

## The language of language models

These are the words that show up most in chatbot news. Knowing how a language model sees text also explains why it sometimes makes odd mistakes.

| Term | Plain explanation |
|---|---|
| **Large language model (LLM)** | A model trained on huge amounts of text that writes by repeatedly predicting the most likely next piece of text. |
| **Token** | The small chunks a model splits text into: a word, part of a word or a punctuation mark. In agglutinative languages such as Turkish, a single word is often split into several tokens. |
| **Context window** | The maximum number of tokens a model can “see” at once. If a conversation or document exceeds it, the overflow is not taken into account. |
| **Prompt** | Everything you give the model: instructions, questions, examples. The clearer and richer in context it is, the better the answer tends to be. |
| **Inference** | A trained model producing an answer to a new input. This is what runs when you ask a question, and it is a separate cost from training. |
| **Hallucination** | When a model confidently states something that is not true. Technical literature also calls it “confabulation”. |
| **Embedding** | A long list of numbers that represents the meaning of a piece of text. Texts with similar meanings get similar numbers, which is the basis of semantic search. |

If you want more detail, I explain tokens and embeddings [here](/en/posts/tokens-embeddings/) and the inner workings of a language model [here](/en/posts/how-llms-work/).

<div class="callout"><strong>Tip:</strong> Hallucination is not a glitch so much as a side effect of how these models work: they produce the most likely continuation, not the verified truth. It is a good habit to double-check anything important, especially names, dates, numbers and citations.</div>

## How we actually use AI

The same underlying model can be packaged in very different ways. These terms describe the layer where a model becomes a product.

| Term | Plain explanation |
|---|---|
| **Generative AI** | AI that creates new text, images, audio or code, rather than only classifying or predicting. |
| **Chatbot** | An application that offers a language model through a conversational interface. The model and the app are not the same thing; one model can power many apps. |
| **Multimodal model** | A model that can understand or produce several kinds of data, such as text plus images, audio or video. |
| **RAG** | “Retrieval-augmented generation.” Relevant documents are found first and handed to the model, so the answer rests on sources rather than memory. |
| **Agent** | An AI system that pursues a goal step by step: it plans, uses tools (search, calculators, email) and decides its next action based on results. |
| **Reasoning model** | A model that spends extra computation “thinking” through intermediate steps before answering. It can do better on maths and multi-step problems, but is slower and costlier. |

## Infrastructure and the wider ecosystem

The last cluster covers what happens behind the scenes, and a few debates inside the industry.

| Term | Plain explanation |
|---|---|
| **GPU** | A processor that performs thousands of simple calculations at the same time. Originally built for graphics, it is now the workhorse of AI training and inference. |
| **Open-weights model** | A model whose parameters (weights) anyone can download and run. Not every open-weights model is “open source”: training data and code may be withheld, and the licence may be restrictive. |
| **Benchmark** | A standard test set used to compare models. Useful, but if test questions leaked into training data, scores can overstate real-world performance. |
| **API** | An interface that lets one piece of software talk to another. Companies often sell model access through an API, priced per use. |
| **Quantization** | Storing a model’s numbers with fewer bits to cut memory and compute needs. The model gets smaller and faster, sometimes at a small cost in quality. |

## Connecting the dots

A glossary teaches words one by one, but meaning lives in the relationships. So here are all 30 terms in a single story.

A company gathers a large body of **training data** and runs months of **pre-training** on thousands of **GPUs**. The result is a **large language model** with billions of **parameters**. It is **aligned** using methods such as **fine-tuning** and **RLHF**, then measured on **benchmarks**. Afterwards it is either offered through an **API** and a **chatbot**, or released as an **open-weights** model that someone can shrink with **quantization** and run on their own machine.

When you write a **prompt**, your text is split into **tokens** and placed in the **context window**; the model performs **inference** to produce an answer. If the answer is not grounded in sources, the risk of **hallucination** grows, which is why **RAG** uses **embeddings** to find relevant documents and pass them to the model. When the model carries out a task step by step using tools, we call it an **agent**.

This chain helps you place news in context. A headline about a “bigger model” is about parameters; “cheaper” is often about inference and quantization; “more reliable” usually points to alignment and RAG.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>AI is the umbrella; machine learning, deep learning and language models are layers beneath it.</li><li>A model’s “knowledge” is a set of trained parameters; training and inference are separate processes with separate costs.</li><li>Hallucination is a natural by-product of predicting the most likely continuation; RAG and a verification habit reduce the risk.</li><li>Open weights and open source are not the same thing; check the licence and what is actually shared.</li></ul></div>

<div class="faq"><details><summary>Is AI the same thing as machine learning?</summary><p>No. AI is the overall goal; machine learning is today’s most common way of reaching it. Every machine learning system is an AI system, but historically there have also been rule-based AI systems that do not learn.</p></details><details><summary>Do more parameters always mean a better model?</summary><p>Not always. Parameter count signals capacity, but data quality, training method and alignment matter just as much. Some small models compete with much larger ones on specific tasks.</p></details><details><summary>What is the difference between a chatbot and a model?</summary><p>The model is the engine that generates answers; the chatbot is the product that wraps it with an interface, rules and extra features such as file uploads or web search. The same model can behave differently in different products.</p></details><details><summary>Do I need a technical background to understand these terms?</summary><p>No. An intuitive grasp is enough to judge the news and use the tools thoughtfully. The mathematical detail matters mainly to people who build these systems.</p></details></div>

---

**Sources**

- [OECD – Explanatory memorandum on the updated OECD definition of an AI system](https://oecd.ai/en/ai-publications/explanatory-memorandum-on-the-updated-oecd-definition-of-an-ai-system)
- [NIST AI 600-1 – Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [Google for Developers – Machine Learning Glossary](https://developers.google.com/machine-learning/glossary)
- [NTIA – Dual-Use Foundation Models with Widely Available Model Weights](https://www.ntia.gov/issues/artificial-intelligence/open-model-weights-report)
