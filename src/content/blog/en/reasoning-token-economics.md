---
title: "From Thinking Budgets to Effort Levels: What Reasoning Actually Costs"
description: "You pay for hidden thinking tokens. Effort levels replaced thinking budgets, task budgets arrived, caching breaks when you change them, and more thinking can hurt."
publishDate: "2026-08-13T23:47:00+03:00"
lang: en
category: "Cost"
tags: ["Cost", "AI"]
translation: "akil-yurutme-token-maliyeti"
heroImage:
  src: "../../../assets/blog/covers/reasoning-token-economics.jpg"
  alt: "From Thinking Budgets to Effort Levels: What Reasoning Actually Costs"
---

When you query a reasoning model, most of the bill comes from text you never see. The model thinks, that thinking produces tokens, and those tokens are billed. On top of that, in 2026 the dial you use to control this cost changed: manual thinking budgets are gone, effort levels replaced them, and task budgets arrived as a genuinely new primitive.

## The invisible line item

In a classic model call, cost has two components: input and output. With a reasoning model a third appears — the intermediate text the model produces before arriving at an answer. The user never sees it; you pay for it.

> With reasoning models, cost is driven not by the length of the question but by how much the model thinks.

The budgeting consequence is that the same prompt costs different amounts on different runs. A fixed-price estimate becomes impossible; what you need instead is **cost per task**. Published measurements show a striking spread along that axis: at comparable intelligence levels, cost per task ranges from $0.04 to $3.25.

## From budgets to effort: the dial changed

For a long time the control was a manually specified thinking budget: `thinking: {"type": "enabled", "budget_tokens": N}`. It had known constraints — `budget_tokens` had a minimum of 1,024 and had to be less than `max_tokens`.

That interface is deprecated on 4.6-generation models and **returns a 400 on 4.7 and later**. The replacement has two parts:

```json
{
  "model": "…",
  "thinking": { "type": "adaptive" },
  "output_config": { "effort": "medium" }
}
```

`effort` has five levels: `low`, `medium`, `high`, `xhigh`, `max`. The default is `high` and no beta header is required. Gemini exposes the same idea as `thinking_level`, and OpenAI's `reasoning_effort` maps onto the same axis through the compatibility layer. This is no longer one vendor's feature but the industry's shared dial.

## Effort governs tool calls too

This is the detail most teams miss and the one that costs the most. `effort` governs _all tokens_ — including tool calls. Lowering effort does not merely shorten thinking; the model **makes fewer tool calls**.

For agentic workloads the consequence is behavioural: lower effort means less investigation, less verification and a shallower result. In the documentation's own words, effort is a behavioural signal, not a strict token budget.

<div class="callout"><strong>Tip:</strong> Treat effort as a quality dial rather than a cost brake. To cut cost, change the model first (routing), shrink the context second, and lower effort last. Reversing that order buys savings by quietly lowering quality.</div>

## Task budgets: a new primitive

The **task budget**, introduced in mid-2026, is an advisory token budget for an _entire agentic loop_ rather than a single request, with a countdown that is visible to the model. It is used behind a beta header and has a minimum of **20,000 tokens**.

Two behavioural properties matter. First: it is **a hint, not a hard cap** — exceeding it does not truncate the request; the model paces itself against it. Second and more important: **an undersized budget produces refusal-like behaviour**. Rather than starting work it cannot finish, the model scopes down or declines. Asking for a thirty-file refactor with a 20,000-token budget does not buy a cheap result; it buys an unstarted one.

## The caching trap

This is documented behaviour that surprises people when they measure it: **changing the effort level mid-conversation invalidates your prompt cache.** The reason is simple — effort and thinking settings are rendered into the prompt, so the prefix changes and the cache misses. The same was true of the old `budget_tokens`.

The practical rule: **vary effort across workloads, not within a cached session.** An apparently clever optimisation — "low effort on easy questions, high on hard ones" — applied inside one session can wipe out your cache savings and raise total cost.

```python
# WRONG: changing effort in the same session breaks the cache
for q in questions:
    effort = "low" if easy(q) else "high"
    answer = model(session, q, effort=effort)      # cache miss on every switch

# RIGHT: split by workload, keep it constant within a session
cheap_lane = Lane(effort="low")     # classification, summarisation
heavy_lane = Lane(effort="high")    # analysis, code generation
for q in questions:
    (cheap_lane if easy(q) else heavy_lane).run(q)
```

## Where more thinking hurts

Intuition says more thinking produces better answers. Two 2026 papers bound that intuition.

The first (arXiv:2604.10739, 12 April 2026) shows marginal returns collapsing at high budgets and models _abandoning previously correct answers_. Its more actionable finding: optimal thinking length varies with difficulty, so allocating the same budget to every question is provably suboptimal.

The second (arXiv:2606.00376, 29 May 2026) draws a more architectural line: on state-tracking tasks, tool-integrated reasoning reaches **76–94%** while pure chain-of-thought reaches **17–42%**. Beyond a depth threshold, unaided accuracy drops below 50%, and fine-tuning recovers less than 3 percentage points of it. That is not a training gap but an architectural ceiling.

The shared engineering conclusion is clean: **on state-tracking work, buy tool use rather than more thinking.** For counting, ordering, date arithmetic and multi-step state updates, a calculator tool is both cheaper and more accurate than the highest effort level.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Thinking tokens are invisible but billed; measure cost per task rather than assuming a fixed price.</li><li>Manual thinking budgets are deprecated and return a 400 on 4.7 and later — use <code>adaptive</code> plus the five-level <code>effort</code>.</li><li>Effort also changes how many tool calls happen: lower effort means less investigation, not just shorter thinking.</li><li>Changing effort inside a session invalidates the prompt cache — vary it across workloads instead.</li></ul></div>

<div class="faq"><details><summary>Do I pay for thinking tokens?</summary><p>Yes. The intermediate text a reasoning model produces before answering is billed and is not shown in the interface. That is why the same prompt costs different amounts on different runs, and why cost planning has to be per task rather than per request.</p></details><details><summary>What is the effort parameter and which level should I use?</summary><p>A five-step dial controlling how much effort the model spends: low, medium, high, xhigh, max, defaulting to high. Low or medium suffices for narrow work like classification and summarisation; high and above earns its cost on analysis, code generation and multi-step agent tasks. Compare on your own task set.</p></details><details><summary>When is a reasoning model unnecessary?</summary><p>When the task is single-step and pattern-based — classification, extraction, format conversion — reasoning adds only cost and latency. And for state-tracking work, giving the model a tool beats giving it more thinking; published measurements put the gap between the two very wide.</p></details></div>

---

In production, knowing what reasoning costs matters more than knowing what it is. For what test-time compute actually is see [reasoning models](/en/posts/reasoning-models-test-time-compute/), for the other cost levers see [LLM cost optimization](/en/posts/llm-cost-optimization/), and for sending each question to the right model see [model routing and cascades](/en/posts/model-routing-cascades/).
