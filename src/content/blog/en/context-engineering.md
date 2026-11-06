---
title: "Context Engineering: The Discipline That Replaced Prompt Engineering"
description: "Context engineering is the discipline of deciding which tokens earn a place in a limited context window at each step. Context rot, lost-in-the-middle, pruning and summarisation strategies."
publishDate: "2026-08-09T23:35:00+03:00"
lang: en
category: "Architecture"
tags: ["Architecture", "AI"]
translation: "baglam-muhendisligi"
heroImage:
  src: "../../../assets/blog/bimg-11.jpg"
  alt: "Context Engineering: The Discipline That Replaced Prompt Engineering"
---

A few years ago the key to a good AI product was finding the right sentence. Not any more. Agents now run over many steps, call tools, read documents, and fill the context window as they go. The decisive skill is no longer writing a clever instruction but **deciding which tokens earn a place in the window at each step** — context engineering.

## From prompt to context

For a single-turn chat, prompt engineering was enough. An agent runs across dozens of steps: tool outputs, intermediate results, error messages and user history accumulate. By step thirty, what the model sees is not the instruction you wrote but everything that has piled up since.

Context engineering manages that accumulation. Its question is precise: _what is the smallest set of high-signal tokens this step needs in order to decide correctly?_

## Context rot

There is a counterintuitive but consistent finding: models get measurably worse as context grows. Even when the window holds a million tokens, filling it does not improve performance — it usually degrades it. More information does not mean a better answer.

<div class="callout"><strong>The core principle:</strong> a context window is a desk, not a warehouse. The more paper you pile on it, the harder it becomes to find what you need.</div>

## Position matters

Where information sits matters nearly as much as whether it is there at all. Models use content at the beginning and end of the context noticeably better than content in the middle — the effect known as "lost in the middle".

The practical consequence: put the critical instruction first and the most relevant evidence last. Long, medium-importance filler can live in the middle.

## Four core strategies

-   **Select:** retrieve only the documents this step needs, not everything. Retrieval quality _is_ context quality.
-   **Compress:** summarise long tool outputs and prior steps. Keep the result, not the raw log.
-   **Prune:** drop intermediate steps that are no longer relevant. As an agent progresses, old error messages become noise.
-   **Offload:** hold long-lived state in external memory rather than the window, and fetch it when needed.

## Building a context budget

| Section | Guidance | Note |
| --- | --- | --- |
| System instruction | Fixed, short | Place first |
| Tool definitions | Only the tools needed | Drop unused ones |
| Retrieved evidence | Most of the budget | Place near the end |
| Conversation history | Summarised | Do not keep it raw |
| Headroom | 20-30 percent | Leave room for the answer |

Measure the budget. A team that does not know how many tokens each section consumes is chasing latency and cost problems blind.

## Frequently asked questions

<div class="faq"><details><summary>Have long-context models made RAG unnecessary?</summary><p>No. A long window does not make carrying irrelevant content cheap; it merely makes it possible. Retrieval still governs both quality and cost.</p></details><details><summary>Does summarising lose information?</summary><p>It does, and that is a deliberate trade. Keeping critical identifiers, numbers and decisions in structured form while summarising the narrative is a good middle path.</p></details><details><summary>How do I measure this?</summary><p>Run the same task set at different context budgets. Most teams are surprised to find accuracy rises when context shrinks.</p></details></div>

---

Context engineering is a disciplined stance against the instinct to "give the model more". For more, see [RAG architecture](/en/posts/what-is-rag-how-to-build/) and [LLM cost optimisation](/en/posts/llm-cost-optimization/).
