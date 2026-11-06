---
title: "Prefix Caching Economics: When Does the Cache Actually Pay?"
description: "Cache reads cost 0.1x, writes 1.25x. Break-even is two requests. So why is your cache silently doing nothing? Minimum prefixes, the 20-block rule and the parallel trap."
publishDate: "2026-08-13T23:59:00+03:00"
lang: en
category: "Cost"
tags: ["Cost", "AI"]
translation: "onek-onbellekleme-ekonomisi"
heroImage:
  src: "../../../assets/blog/bimg-17.jpg"
  alt: "Prefix Caching Economics: When Does the Cache Actually Pay?"
---

You turned prompt caching on and the bill did not move. This is one of the most common silent failures I see in production, because when caching fails it does not raise an error — it just stops saving you money. This article does two things: first it shows with arithmetic exactly when a cache turns a profit, then it enumerates why yours probably is not working. The break-even math is rarely published anywhere, and that is precisely the part that decides whether caching is worth it.

## What prefix caching actually caches

As a language model processes your prompt it produces intermediate representations for every token and stores them as the key-value pairs attention will consume. That store is the **KV cache**. Prefix caching rests on a simple observation: if the leading, unchanged portion of your prompt is byte-for-byte identical to a previous request, there is no need to recompute it.

> Cache matching starts at the very beginning of the prompt and is exact — a single changed space near the top invalidates everything after it.

One rule follows from this and governs everything else: **stable content first, variable content last.** System instructions, tool definitions and slow-moving document context belong at the front; the user's current question and any timestamp belong at the end. Putting `Current time: 2026-08-13 14:33` at the top of a system prompt is functionally identical to disabling caching.

## The break-even arithmetic: two requests or three?

Pricing has three components, quoted as multipliers against the base input price. Cache **reads cost roughly 0.1×**; cache **writes cost 1.25× at the 5-minute TTL** and **2× at the 1-hour TTL**.

With those three numbers the break-even point is just arithmetic. If you will reuse the same prefix _N_ times, the uncached cost is `N × 1.0` and the cached cost is `write + (N-1) × 0.1`.

```text
5-minute TTL (write 1.25x)
  N=1 :  1.25          vs  1.00   -> loss
  N=2 :  1.25 + 0.10 = 1.35  vs  2.00   -> profit
  N=5 :  1.25 + 0.40 = 1.65  vs  5.00   -> 3.0x saving

1-hour TTL (write 2.00x)
  N=2 :  2.00 + 0.10 = 2.10  vs  2.00   -> still a loss
  N=3 :  2.00 + 0.20 = 2.20  vs  3.00   -> profit
```

So you break even on the **second request at the 5-minute TTL and the third at the 1-hour TTL**. The practical consequence is that a longer TTL is not automatically better: unless you will hit the prefix at least three times within the window, the longer TTL never repays its write premium.

You do not have to estimate any of this — the API response reports each component separately, so you can compute your true effective multiplier directly:

```python
def effective_multiplier(usage, ttl="5m"):
    """Effective input multiplier for one response's usage block.
    1.0 = uncached baseline. Lower means real savings."""
    write_rate = 1.25 if ttl == "5m" else 2.0
    fresh = usage["input_tokens"]                    # uncached
    write = usage["cache_creation_input_tokens"]     # written this request
    read  = usage["cache_read_input_tokens"]         # served from cache
    total = fresh + write + read
    if total == 0:
        return 0.0
    weighted = fresh * 1.0 + write * write_rate + read * 0.1
    return weighted / total

# Example: 20,000-token stable prefix, 400-token question
warm = {"input_tokens": 400, "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 20000}
print(round(effective_multiplier(warm), 3))   # 0.118  -> ~8.5x cheaper
```

<div class="callout"><strong>Tip:</strong> Emit this as a production metric. Track the <em>effective multiplier</em>, not the cache hit rate — hit rate can read 90% while short prefixes keep the multiplier above 1.0. The multiplier is what the invoice reflects.</div>

## Silent failure: the minimum prefix length

Here is the real problem. A cacheable prefix has a **minimum token length**, and that minimum varies by model. Worse, it is not monotonic: it is **512 tokens** on the newest models, **1,024** on the previous generation, but **4,096** on some mid-generation models.

Fall below that threshold and the request does not fail. No error, no warning. The `cache_creation_input_tokens` field simply comes back as `0` and you spend months believing caching is on. This is the source of most "we enabled prompt caching and the bill did not change" reports — someone swapped the model and the prefix fell under the threshold.

The fix is not to enable caching but to _assert_ that it engaged, and to do that in a deploy gate rather than by eyeballing it once:

```python
MIN_PREFIX = {          # minimum cacheable prefix by model class
    "newest":    512,
    "previous": 1024,
    "mid-gen":  4096,
}

def assert_cache_active(response, model_class, expected_prefix_tokens):
    threshold = MIN_PREFIX[model_class]
    u = response["usage"]
    written = u.get("cache_creation_input_tokens", 0)
    read    = u.get("cache_read_input_tokens", 0)

    if expected_prefix_tokens < threshold:
        raise ValueError(
            f"Prefix is {expected_prefix_tokens} tokens; {model_class} requires "
            f"{threshold}. Caching is SILENTLY off. Grow the prefix or change model.")

    if written == 0 and read == 0:
        raise ValueError(
            "Both cache_creation and cache_read are 0 — the cache never engaged. "
            "Check the cache_control marker and prefix stability.")
    return True
```

Running this once after the first request is enough. The moment the silent failure becomes loud, the problem stops existing.

## The twenty-block rule and agent loops

A single request may define at most **four cache breakpoints**. When the system looks backwards from a breakpoint for a match, it walks back **at most 20 content blocks**.

In a plain chat application this never matters. In agent loops it bites immediately: every tool call and every tool result is a separate content block. An agent that makes ten tool calls in a single turn burns through twenty blocks at once. Your breakpoint then cannot reach back to the earlier prefix and the hit disappears silently — exactly where caching would have mattered most, in long agent runs.

-   **Move the breakpoint forward:** place it at the most recent stable point in accumulated history rather than at the head of the prefix, shortening the distance the 20-block walk must cover.
-   **Coalesce tool results:** merging five small results into one block slows the block counter by a factor of five.
-   **Measure block growth:** make blocks-added-per-turn a metric; by the time it approaches 20, the cache is already gone.

## The parallel request trap

This one is invisible until you measure it. If you fire **N requests with an identical prefix simultaneously, all of them pay full price.** The reason is straightforward: the others leave before the first request has finished writing the cache, so there is nothing for them to read.

In a batch job classifying fifty documents against the same system prompt, that means the entire saving evaporates. The correct pattern is a _warm-up turn_: send one request, wait for the first token, then fan the rest out in parallel.

```python
import asyncio

async def warm_then_fan_out(requests, call):
    """Write the cache with one request, then run the rest in parallel."""
    if not requests:
        return []
    first = await call(requests[0])          # cache is written here
    rest = await asyncio.gather(*(call(r) for r in requests[1:]))
    return [first, *rest]

# WRONG: all at once -> N x full price, zero hits
# results = await asyncio.gather(*(call(r) for r in requests))
```

On a fifty-document batch this one-line difference pulls input cost down by roughly an order of magnitude, and the latency it adds is exactly one request.

## Push cache-breakers to the end of the prompt

Most cache-breakers are details nobody thinks of as "content": a session id buried in the system prompt, a username, a clock, an A/B flag, or a tool list rendered in nondeterministic order. Each of them makes the prefix different on every request.

-   **Keep tool definitions in a stable order:** if you build them from a dictionary, sort by key — reordering alone breaks the cache.
-   **Put timestamps last:** if the model needs the date, supply it next to the user message, not at the top of the system prompt.
-   **Isolate personalisation:** anything user-specific must sit outside the prefix, or the cache fragments once per user.
-   **Pin the model version:** calling an alias means your cache silently resets whenever the provider rolls the version behind it.

Which leads to the most useful rule here: **treat caching as a prompt-architecture decision, not a setting.** A cache-friendly prompt is _designed_ stable-first, variable-last; it is not obtained by flipping a flag afterwards.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Reads cost 0.1×, writes 1.25× at 5 minutes and 2× at 1 hour — break-even is the second and third request respectively.</li><li>The minimum prefix is 512, 1,024 or 4,096 tokens depending on the model; below it caching fails with no error at all.</li><li>A breakpoint walks back at most 20 content blocks, and agent turns burn that budget fast with tool calls.</li><li>Parallel requests sharing a prefix all pay full price — send one warm-up request first, then fan out.</li></ul></div>

<div class="faq"><details><summary>Does prompt caching really reduce cost?</summary><p>Yes, as long as you reuse the prefix, and the effect is large: with a 20,000-token stable prefix the effective input multiplier drops from 1.0 to roughly 0.12. But on one-off requests caching <em>increases</em> cost because of the write premium. The rule is to reuse the prefix at least twice within a 5-minute TTL, or three times within a 1-hour TTL.</p></details><details><summary>Why is my cache not working when I get no error?</summary><p>Almost always one of two causes: your prefix is below the model's minimum length (512 / 1,024 / 4,096 tokens depending on the model), or the prefix changes on every request. Neither raises an error — <code>cache_creation_input_tokens</code> and <code>cache_read_input_tokens</code> simply stay at zero. Assert on both fields in a deploy gate.</p></details><details><summary>Is the KV cache the same thing as prompt caching?</summary><p>They are two layers of the same mechanism. The KV cache is the inference-time structure holding per-token key-value representations, used even within a single generation. Prompt caching is the product layer that persists the shared-prefix portion of those representations <em>across requests</em> and prices it at a discount.</p></details></div>

---

Done properly, caching is the largest cost lever available from a single architectural decision. For the other levers see [LLM cost optimization](/en/posts/llm-cost-optimization/), for splitting a prompt into stable and variable layers see [context engineering](/en/posts/context-engineering/), and for wiring these assertions into a deployment pipeline see [MLOps and shipping to production](/en/posts/mlops-ai-to-production/).
