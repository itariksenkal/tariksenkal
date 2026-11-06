---
title: "Enterprise LLM Budgeting: Token Overhead, FX Risk and the Real Unit Cost"
description: "A measured token-overhead figure, cache economics and FX exposure combined into a working unit-cost model — and an honest API-versus-self-host break-even."
publishDate: "2026-08-13T23:42:00+03:00"
lang: en
category: "Cost"
tags: ["Cost", "AI"]
translation: "kurumsal-llm-butcesi"
heroImage:
  src: "../../../assets/blog/bimg-20.jpg"
  alt: "Enterprise LLM Budgeting: Token Overhead, FX Risk and the Real Unit Cost"
---

The first problem you hit when budgeting for LLMs is that every reference you can find is built on English text and priced in dollars. Non-English text costs more tokens for the same content, the invoice arrives in one currency while your revenue is in another, and the real unit of cost is not "a million tokens" but "a completed task". This article combines those variables into one working model — measured rather than assumed.

## The wrong unit: tasks, not million tokens

Providers price per million tokens, so everyone budgets per million tokens. The problem: two models finish the same job with very different token counts, and some do not finish it at all. A cheap model that fails three times has cost more than the expensive one.

> The right budgeting unit is **cost per successfully completed task**; million tokens is an input line, not a measure of outcome.

This is now a measured axis. Artificial Analysis' Intelligence Index v4.1 (15 June 2026) reports cost per task spanning a range of **more than eighty times** at broadly comparable index positions: $3.25 for Claude Fable 5, $1.78 for Opus 4.8 at max effort, $0.99 for GPT-5.5 at xhigh and $0.04 for DeepSeek V4 Pro at max. The entire economic case for routing lives in that table: sending every job to the most expensive model is not an engineering decision, it is a budget accident.

## The token tax, measured

That non-English text costs more tokens is universally asserted and almost never measured. Measured on a parallel text pair with the `o200k_base` tokenizer:

| Measurement | Turkish / English |
| --- | --- |
| Tokens for identical content | 80 / 54 → about **1.48×** |
| Characters per token | 3.58 / 5.83 |

```text
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

def measure(text: str) -> dict:
    n = len(enc.encode(text))
    return {"tokens": n, "chars_per_token": round(len(text) / n, 2)}

# Run 20-30 real samples from your own corpus;
# copying a ratio out of a blog post will mislead your budget.
```

The budget consequence is direct: **on a Turkish-heavy workload your input cost runs roughly half again higher than the same work in English**, and the same factor shows up in context capacity, prefill time and therefore latency. Why Turkish tokenizes this way is a separate, linguistic subject — read [the technical explanation of Turkish tokenization](https://halideyilmaz.com/en/posts/tokenization-turkish-challenges/) for that; the job here is turning the ratio into a budget.

<div class="callout"><strong>Tip:</strong> Measure the ratio on 200 real requests pulled from your production logs, not on one sentence, and split it <em>by request type</em>. The system prompt is usually English while user content is not; the two ratios differ, and it is the mix that sets your total.</div>

## Cache economics: when does it pay?

Prompt caching is the one lever that claws most of the token tax back, because long stable system instructions are exactly the cacheable part. The pricing logic: cache **reads** cost about **0.1×** the base input price, while **writes** cost **1.25×** at a 5-minute TTL and **2×** at a 1-hour TTL.

Break-even follows, and it arrives surprisingly early:

-   **5-minute TTL:** 1.25 (write) + 0.1 (read) = 1.35 < 2.0 (two uncached requests) → **pays off on the second request.**
-   **1-hour TTL:** 2.0 + 0.2 = 2.2 < 3.0 (three uncached) → **pays off on the third.**

Omitting this from a budget model makes you overstate cost by two or three times on any system with a large stable prefix. The inverse is equally dangerous: _assuming_ the cache works without verifying it understates the budget. Measure the cache read and write token counters in production; if they are zero, caching is not happening.

## FX exposure: the invisible line item

No English-language source writes about this, because it is not their problem. It is yours: the invoice is in dollars, the revenue is not. Planning an annual budget at a fixed exchange rate ignores the single largest risk in that budget. The model should carry it explicitly:

```text
from dataclasses import dataclass

@dataclass
class Price:
    input_usd_m: float         # USD per million input tokens
    output_usd_m: float        # USD per million output tokens
    cache_read_mult: float = 0.10
    cache_write_mult: float = 1.25    # 5-minute TTL

def monthly_cost(price: Price, requests: int, in_tok: int, out_tok: int,
                 cache_hit_ratio: float, fx: float, fx_buffer: float = 0.15) -> dict:
    """cache_hit_ratio: share of input served from cache (0..1)."""
    m = 1_000_000
    cached   = in_tok * cache_hit_ratio
    uncached = in_tok - cached

    input_usd = requests * (
        uncached / m * price.input_usd_m
        + cached / m * price.input_usd_m * price.cache_read_mult)
    output_usd = requests * out_tok / m * price.output_usd_m
    total_usd = input_usd + output_usd

    return {
        "usd": round(total_usd, 2),
        "local_today": round(total_usd * fx, 2),
        "local_buffered": round(total_usd * fx * (1 + fx_buffer), 2),  # budget this one
    }
```

Three practical rules. **One:** budget the buffered rate, not today's rate — take the buffer from your own finance team's assumption; the 15% here is a placeholder. **Two:** track actual consumption in USD, not local currency, or you will mistake a currency move for a usage increase. **Three:** the most effective FX hedge is architectural, not financial — every decision that reduces token consumption (caching, routing, smaller models, shorter outputs) reduces currency exposure at the same time.

## API or self-host? The break-even

Self-hosting usually enters the conversation for data-residency reasons and is then retrofitted with a cost justification. Keep them separate: privacy is a requirement, cost is a calculation, and the calculation usually favours the API.

An honest TCO has to include these lines — and everything after the first three is almost always forgotten:

1.  **GPU** — purchase amortisation or hourly rental.
2.  **Hosting** — power, cooling, network; or the cloud instance fee.
3.  **Idle time** — the critical line. With an API you pay nothing when you are not using it; a self-hosted GPU bills overnight too. Eight busy hours a day means two-thirds of the capacity is wasted.
4.  **Engineering** — setup, upgrades, quantization, on-call. This routinely exceeds the hardware cost.
5.  **Quality delta** — if the open-weight model's task success rate is lower, price the extra attempts in.

The practical threshold: **steady, high load** (genuinely high GPU utilisation) can favour self-hosting. **Variable or low load** almost always favours the API. For most teams the best answer is hybrid — high-volume narrow work (classification, extraction, embeddings) on your own hardware, low-volume hard work on the API.

## Attribution and circuit breakers

Budget planning only works if you can see the spend. Two things are required. **Tagging:** attach a customer/team/feature identifier to every request and aggregate cost along those dimensions — this is the only route to internal chargeback and it is painful to add retroactively. **Circuit breakers:** set daily and monthly caps, alert at 80% and block at 100%.

```python
class BudgetBreaker:
    def __init__(self, daily_usd: float):
        self.limit = daily_usd
        self.spent = 0.0

    def allow(self, estimated_usd: float) -> bool:
        if self.spent + estimated_usd > self.limit:
            return False                    # reject and queue the request
        return True

    def record(self, actual_usd: float, tags: dict) -> None:
        self.spent += actual_usd
        emit_metric("llm_cost_usd", actual_usd, tags)  # team/customer/feature
```

One warning: on reasoning models the effort level changes not only how long the model thinks but _how many tool calls it makes_. So if your estimate is built purely on input and output token counts, you will systematically underestimate agentic workloads. Estimate agent work per _task_, not per request.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Budget in cost per successful task; published measurements show an eighty-fold spread along that axis.</li><li>Measured: Turkish costs about 1.48× the tokens of equivalent English — build the budget with that multiplier and verify it on your own data.</li><li>Caching breaks even on the second request at 5-minute TTL and the third at 1-hour; verify with the response counters rather than assuming.</li><li>Budget a buffered exchange rate and track consumption in USD; every token-reducing architectural decision also reduces FX exposure.</li></ul></div>

<div class="faq"><details><summary>Is non-English text really more expensive?</summary><p>Yes, because the same content splits into more tokens. On a parallel pair measured with <code>o200k_base</code> the ratio was about 1.48×, with characters per token dropping from 5.83 to 3.58. The ratio varies by tokenizer and text type, so measure it on your own corpus.</p></details><details><summary>Should I use an API or self-host?</summary><p>Steady, high load can favour self-hosting; variable or low load almost always favours the API, because you do not pay for idle GPUs. Include engineering and on-call in the comparison — they usually exceed the hardware line. Data residency is a requirement and should be evaluated separately from cost.</p></details><details><summary>How do I manage currency risk in an AI budget?</summary><p>Plan with a buffered exchange rate, track realised consumption in USD rather than local currency so you do not confuse an FX move with a volume increase, and expect the real reduction to come from architecture: caching, routing, shorter outputs and smaller models all shrink exposure directly.</p></details></div>

---

A budget stops being an obstacle once it becomes predictable. For the full set of cost levers see [LLM cost optimization](/en/posts/llm-cost-optimization/), for the architecture that sends each job to the right model see [model routing and cascades](/en/posts/model-routing-cascades/), and to see how much work the cheap tier can absorb see [small language models](/en/posts/small-language-models/).
