---
title: "Speculative Decoding: Getting Faster Tokens From the Same Model"
description: "Draft models, EAGLE, MTP, n-gram and suffix decoding. Why acceptance rate is the only metric that matters, how to configure vLLM, and when speculation does not help."
publishDate: "2026-08-13T23:58:00+03:00"
lang: en
category: "Infrastructure"
tags: ["Infrastructure", "AI"]
translation: "spekulatif-kod-cozme"
heroImage:
  src: "../../../assets/blog/covers/speculative-decoding.jpg"
  alt: "Speculative Decoding: Getting Faster Tokens From the Same Model"
---

Token generation is inherently sequential: each token waits for the previous one, and every step reads billions of weights out of memory. Speculative decoding attacks that bottleneck without changing the output — a cheap predictor proposes several tokens ahead and the real model verifies all of them in a single pass. In 2026 the menu of methods has grown well beyond "draft model". This article covers the methods, the one metric that actually matters, and the cases where speculation simply does not pay.

## Why decoding is slow: the memory bandwidth wall

Producing a single token during the decode phase requires reading _all_ of the model's weights out of HBM, while performing comparatively little arithmetic. The phase is therefore not compute-bound but **memory-bandwidth-bound** — your GPU's tensor cores idle while the memory path saturates.

> You read the weights once whether you produce one token or ten; the entire gain of speculative decoding comes from that asymmetry.

Which suggests the idea: if some cheap mechanism can guess the next few tokens, we can ask the real model "are these right?" in _one_ forward pass. Verification uses the same weight read as generation but scores several positions at once, so every accepted extra token is close to free.

## The core loop: propose, verify, accept

1.  **Propose:** a draft source (a small model, an extra head, or a simple lookup) proposes the next _k_ tokens.
2.  **Verify:** the target model scores those _k_ positions in a single forward pass.
3.  **Accept:** proposals are checked in order from the start; everything up to the first mismatch is accepted, the target's own token is written at the mismatch, and the remainder is discarded.

The critical property is that with a correct acceptance rule, verification **does not change** the output distribution. Speculative decoding is not an approximation — it reduces latency at no quality cost, which separates it from genuinely lossy techniques like quantization.

```python
# The essence of the acceptance loop (illustrative; real implementations batch)
def speculative_step(target, draft, context, k=4):
    proposed = draft.generate(context, k)              # cheap k-token guess
    target_dists = target.score(context, proposed)     # ONE forward pass

    accepted = []
    for i, tok in enumerate(proposed):
        if target.accepts(target_dists[i], tok):
            accepted.append(tok)
        else:
            accepted.append(target.sample(target_dists[i]))  # correction
            return context + accepted                        # rest discarded
    # if everything was accepted, one bonus token comes for free
    accepted.append(target.sample(target_dists[k]))
    return context + accepted
```

The gain per step is the number of accepted tokens. If everything is rejected you advance by one token having also paid for the draft — the economics of the whole system hinge on this.

## The 2026 method menu

vLLM now ships a family rather than a single method. The choice is not "which is fastest" but "which fits _your_ model and traffic":

-   **EAGLE:** the strong general-purpose option. Gains are largest at _low QPS_ — if the GPU is already saturated there is little spare capacity to speculate with.
-   **MTP (multi-token prediction):** the best option when your target model supports it natively, with no separate draft model to carry.
-   **Draft model:** the classic approach. Requires a small model sharing the same tokenizer and consumes extra VRAM.
-   **PARD:** parallel draft generation, focused on lowering draft latency.
-   **MLP Speculator:** a lightweight prediction head.
-   **n-gram:** no model at all; it exploits repetition already present in the context. Very cheap, gains are modest.
-   **Suffix decoding:** chooses depth dynamically and needs no extra model.
-   **Custom proposer:** the escape hatch for plugging in your own predictor.

n-gram and suffix decoding share one big advantage: no extra model, so no VRAM cost and no deployment complexity. They work surprisingly well whenever **text repeats from the context** — structured output, code completion, quoting from a long document. RAG answers fall squarely in this class, since the model frequently quotes source passages verbatim and n-gram catches exactly that.

<div class="callout"><strong>Tip:</strong> Start with the methods that need no extra model. Enabling n-gram or suffix decoding is one config line; adding EAGLE or a draft model is a deployment, a VRAM budget and a version-compatibility problem. Measure, and if the gain is enough, stop there.</div>

## Acceptance rate: the only real metric

Speculative decoding has **no** fixed speedup multiple. The vLLM documentation deliberately declines to publish one, stating plainly that real gains depend on model family, traffic pattern, hardware and sampling settings. Treat any "3× faster" claim you read online as unportable to your setup.

What you must measure is the **acceptance rate**: the fraction of proposed tokens that get accepted. A simple model makes clear where the gain comes from:

```python
def expected_speedup(acceptance, k, draft_cost):
    """acceptance : probability a proposed token is accepted (0-1)
       k          : tokens proposed per step
       draft_cost : draft step cost relative to a target step (e.g. 0.15)
       Returns speedup vs no speculation (1.0 = no gain)"""
    a = acceptance
    # expected accepted tokens per step (including the bonus token)
    if a == 1.0:
        expected_tokens = k + 1
    else:
        expected_tokens = (1 - a ** (k + 1)) / (1 - a)
    step_cost = 1.0 + draft_cost      # verification + draft
    return expected_tokens / step_cost

for a in (0.9, 0.7, 0.5, 0.3):
    print(a, round(expected_speedup(a, k=4, draft_cost=0.15), 2))

# 0.9 -> 3.56    high acceptance: large gain
# 0.7 -> 2.41
# 0.5 -> 1.68
# 0.3 -> 1.24    low acceptance: the gain approaches the draft cost
```

Two things fall out of this. First, the gain erodes quickly as acceptance drops. Second, and less widely understood: raising _k_ is not always good — at a low acceptance rate, longer proposals just pay draft cost for tokens that will be rejected anyway. When acceptance is low, shrinking `k` helps more than growing it.

## Configuring it in vLLM

Configuration is a single flag carrying JSON:

```text
# n-gram: no extra model, the cheapest starting point
vllm serve MODEL_NAME \
  --speculative-config '{"method": "ngram", "num_speculative_tokens": 4}'

# Draft model: a small model sharing the same tokenizer
vllm serve BIG_MODEL \
  --speculative-config '{"method": "draft", "model": "SMALL_MODEL", "num_speculative_tokens": 4}'

# EAGLE
vllm serve MODEL_NAME \
  --speculative-config '{"method": "eagle", "model": "EAGLE_HEAD", "num_speculative_tokens": 4}'
```

One constraint to know before you ship: speculative decoding is **incompatible with pipeline parallelism in vLLM 0.15.0 and earlier**. If your model does not fit on one node and is therefore split with pipeline parallelism, verify your version first.

On measurement, the right approach is not total wall time but tracking **ITL** (inter-token latency) alongside the acceptance rate. Speculation does not improve time-to-first-token — that phase is already compute-bound. What it improves is streaming speed after the first token.

## Where it does not help

This is the honest section, because speculation is not a set-and-forget switch.

-   **High QPS / saturated GPUs:** if continuous batching already fills the bandwidth, there is no spare capacity for speculation to exploit. The gain erodes and can go negative. The benefit is greatest at low to moderate traffic on latency-sensitive single requests.
-   **When batch throughput is the goal:** speculation is a latency optimization, not a throughput one. On overnight batch jobs you are measuring the wrong metric to begin with.
-   **High temperature and diversity:** the more your sampling settings diversify the output, the harder it is for the draft to anticipate the target, and acceptance falls.
-   **Creative, free-form text:** acceptance drops wherever predictability drops. Conversely, code, JSON, templated responses and quotation-heavy RAG output are the most productive territory.
-   **Draft/target mismatch:** if the draft model's tokenizer and language coverage do not overlap the target's, acceptance collapses. A practical warning for Turkish: a small draft model trained mostly on English will show a markedly lower acceptance rate on Turkish generation than on English. Always measure acceptance on your _Turkish_ request sample rather than porting an English measurement over.

The decision rule is simple: enable n-gram first, measure acceptance on your own traffic, and move to heavier methods only if the gain justifies it. Deploying EAGLE without measuring first is how most teams end up spending VRAM for nothing.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Decoding is memory-bandwidth-bound; speculation converts idle compute capacity into tokens.</li><li>Implemented correctly it leaves the output distribution unchanged — a rare optimization with no quality trade-off.</li><li>There is no fixed speedup multiple; acceptance rate on your own traffic is the only metric to measure.</li><li>Gains erode at high QPS, high temperature and free-form text, and peak on code, JSON and quotation-heavy RAG.</li></ul></div>

<div class="faq"><details><summary>What is speculative decoding, and does it reduce quality?</summary><p>It is an inference acceleration technique where a small, cheap predictor proposes the next few tokens and the real model verifies all of them in a single pass. With a correct acceptance rule the output distribution is unchanged, so there is no quality loss — unlike quantization. Rejected proposals are discarded and the target model's own token is written at that step.</p></details><details><summary>How much speedup should I expect?</summary><p>The honest answer is that it must be measured, not assumed. The vLLM documentation deliberately publishes no multiple, because real gains depend on model family, traffic pattern, hardware and sampling settings. Measure your acceptance rate: at 0.9 with four proposed tokens the gain is large; at 0.3 it is barely worth the complexity.</p></details><details><summary>Which method should I start with?</summary><p>Start with n-gram or suffix decoding, which need no extra model — one config line, no VRAM cost, and they work well on repetitive text. If the gain is insufficient, move to MTP when your target model supports it natively, and to EAGLE when it does not. A draft model is the classic option but the most expensive, since it demands tokenizer compatibility and additional VRAM.</p></details></div>

---

Speculation is the cleanest way to get faster tokens from the same weights, but it is not an infrastructure strategy on its own. For where a draft model comes from see [small language models](/en/posts/small-language-models/), for levers beyond latency see [LLM cost optimization](/en/posts/llm-cost-optimization/), and for making these measurements permanent see [MLOps and shipping to production](/en/posts/mlops-ai-to-production/).
