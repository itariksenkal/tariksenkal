---
title: "Model Routing and Cascades: Stop Sending Every Task to the Same Model"
description: "Routing sends each request to the model whose cost and capability fit it. Cascade architectures, confidence thresholds, escalation paths and measuring the real cost-quality curve."
publishDate: "2026-08-09T23:32:00+03:00"
lang: en
category: "Architecture"
tags: ["Architecture", "AI"]
translation: "model-yonlendirme-kademeleme"
heroImage:
  src: "../../../assets/blog/bimg-14.jpg"
  alt: "Model Routing and Cascades: Stop Sending Every Task to the Same Model"
---

Most AI products start with one model and stay there. As traffic grows so does the bill, because a simple intent classification and a complex analysis are both going to the same expensive model. **Routing** removes that waste: it sends each request to the cheapest model capable of handling it.

## Routing versus cascading

These are two distinct patterns. **Routing** classifies the request up front and sends it straight to the right model; one call is made. **Cascading** tries the cheap model first and escalates to the expensive one if the result is not good enough; sometimes two calls are made.

Routing is cheaper, but a misclassification hits quality directly. Cascading is safer but raises total cost in the worst case.

## What to decide on

-   **Task type:** summarising, extraction and formatting to the small model; multi-step analysis to the large one.
-   **Input length and complexity:** short, single questions are usually handled by a small model.
-   **Risk:** when the cost of an error is high, do not economise.
-   **Latency budget:** when a user is waiting, speed may outrank quality.

<div class="callout"><strong>Start simple:</strong> your first router does not have to be an LLM. A rule-based classifier or a small trained model routes most traffic correctly and costs almost nothing.</div>

## Confidence thresholds and escalation

The critical question in a cascade is how you know the cheap model's answer is good enough. Practical signals include the model's own stated uncertainty, whether the output conforms to the schema, consistency with retrieved evidence, and approval from a simple verifier model.

Every cascade needs an explicit _escalation path_: what happens below the threshold must be defined up front, not left ambiguous.

## No routing without measurement

| Metric | Why |
| --- | --- |
| Accuracy per tier | Is the small model genuinely sufficient |
| Escalation rate | Is the saving real |
| End-to-end latency | Are two calls making users wait |
| Cost per request | The actual objective |

If the escalation rate reaches sixty percent, the cascade is not working: you are making both the cheap and the expensive call, adding cost rather than saving it.

## Common mistakes

Three recur most: never re-evaluating the router, running both tiers with the same prompt (a small model does better with a different instruction), and not monitoring quality. The cost drop shows up immediately; the quality drop is noticed weeks later.

## Frequently asked questions

<div class="faq"><details><summary>Isn't the router itself a cost?</summary><p>Yes, but a small one. A rule-based or small-model router costs a negligible amount next to what it saves.</p></details><details><summary>Does it combine with caching?</summary><p>Absolutely. Checking the cache before routing is the cheapest step of all; repeated requests never reach a model.</p></details><details><summary>How many tiers should there be?</summary><p>Two is usually enough. A third tier adds complexity and debugging burden faster than it adds savings.</p></details></div>

---

Routing is the most direct way to scale without sacrificing quality, and it is the optimisation most teams reach for too late. For more, see [LLM cost optimisation](/en/posts/llm-cost-optimization/) and [small language models](/en/posts/small-language-models/).
