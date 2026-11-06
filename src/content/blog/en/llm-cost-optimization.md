---
title: "LLM Cost Optimization: Cutting the Bill with Tokens, Caching, Model Choice, and RAG"
description: "Practical levers for lowering your LLM bill: reducing token consumption, prompt caching, matching the task to the model, batch processing, and the small model + RAG balance. Cost optimization in the right order, with intuitive analogies and example code."
publishDate: "2026-08-09T23:19:00+03:00"
lang: en
category: "Cost"
tags: ["Cost", "AI"]
translation: "llm-maliyet-optimizasyonu"
heroImage:
  src: "../../../assets/blog/covers/llm-cost-optimization.jpg"
  alt: "LLM Cost Optimization: Cutting the Bill with Tokens, Caching, Model Choice, and RAG"
---

A large language model (LLM) prototype looks deceptively cheap: you fire off a few requests and the bill is a rounding error. Then the product ships, usage grows, and one morning your monthly API invoice exceeds an engineer's salary. The good news is that LLM cost is largely an architectural choice, not a fate. This article walks through the practical levers for bringing it down — from cutting token consumption and prompt caching to choosing the right model, batch processing, and the "small model + RAG" balance — using everyday analogies.

## Where does the cost actually come from?

The first step to understanding an LLM bill is grasping that pricing is based on **tokens**. A token is the small chunk a model uses to process text; roughly, one word is a few tokens. The key point: input and output tokens are priced separately, and output is usually far more expensive.

Let's make it concrete. At the time of writing, an example price table looks like this:

-   **Large, most capable model:** $5 per 1 million input tokens, $25 per 1 million output tokens.
-   **Balanced mid-tier model:** $3 per 1 million input, $15 per 1 million output.
-   **Small, fast model:** $1 per 1 million input, $5 per 1 million output.

> Two patterns jump out: output tokens cost about five times more than input, and input cost varies up to fivefold across models. Most optimization revolves around these two facts.

Think of it like a taxi ride: input tokens are the flag-drop fee, output tokens are the per-kilometer charge. There are expensive and cheap ways to reach the same destination; the trick is choosing the route wisely.

## Reducing token consumption

The most direct lever is reducing the number of tokens going into and out of each request. A few practical habits yield real savings here:

-   **Trim the prompt:** Unnecessary pleasantries, repeated instructions, and bloated examples burn money on every request. Keep instructions short and clear.
-   **Constrain the output:** For tasks like classification, ask the model for a single word, not a long explanation. Set `max_tokens` to what the task actually needs.
-   **Prune the context:** In long conversations, summarize older turns or drop irrelevant parts instead of resending everything each time.
-   **Don't guess, measure:** Use token-counting endpoints before sending a request. Tools like OpenAI's `tiktoken` can miscount for other models; prefer your model's own token counter.

<div class="callout"><strong>Tip:</strong> Measure first. Starting optimization without knowing the answer to "how many tokens is our system prompt?" is searching for savings in the dark. A single long system prompt, multiplied across thousands of requests, can be the biggest line item on the bill.</div>

## Prompt caching

Most applications send the same large block of text at the start of every request: a fixed system prompt, a long document, a stable tool list. This repeating prefix is reprocessed every time and paid for, in tokens, at full price every time. **Prompt caching** eliminates exactly this waste.

The logic is like a study desk in a library: instead of hauling the shared books in every morning, you leave them on the desk; the next day you only add that day's notes. The cache processes the prefix once and stores it; later requests "read" the same prefix far more cheaply.

The economics are striking: a cache read costs about one-tenth of the normal input price. A cache write asks for a small one-time premium (roughly 1.25× for a 5-minute cache). So even when the same prefix is used across just two requests, it starts to pay off.

```text
// Caching is a PREFIX match:
// Render order is always: tools -> system -> messages

Request 1:  [ large fixed system prompt ][ user question A ]
            ^------- CACHE WRITE --------^   (full price + ~25% premium)

Request 2:  [ large fixed system prompt ][ user question B ]
            ^------- CACHE READ ---------^   (~10% price)  ✓ savings

// One rule: if a SINGLE byte changes anywhere in the prefix,
// everything after it is invalidated and rewritten.
```

The most common cause of a cache silently breaking is a prefix you assumed was fixed actually changing on every request. Putting a timestamp like `now: 14:32` or a random ID in the system prompt, or serializing JSON without sorting keys, invalidates the cache every time. The fix: move volatile content to the _end_ of the prefix and keep the stable part byte-for-byte identical.

> Is the cache actually working? Check the `cache_read_input_tokens` field in the response usage data. If it stays zero across repeated requests, a silent variable is breaking the prefix every time.

## Choosing the right model

Model choice is the most powerful lever in the cost–quality tradeoff, but the common mistake here is using either the largest or the smallest model for every task. The right approach is to **match the task to the model.**

-   **The largest model** is for complex reasoning, multi-step agentic tasks, and cases where an error is expensive.
-   **The balanced mid-tier model** is the sweet spot for most production workloads: more than enough for good summarization, rewriting, or question answering.
-   **The small, fast model** is ideal for high-volume, well-defined tasks like classification, labeling, and simple extraction — and it lowers latency too.

A practical technique is **cascade routing**: you send the request to a cheap model first; if the model is unsure or the task exceeds a certain complexity threshold, you escalate to a stronger model. Like a hospital's triage system: not every patient goes straight to the head surgeon; most cases are handled by a general practitioner, and only those that truly need it are referred to a specialist.

<div class="callout"><strong>Tip:</strong> Don't downgrade the model on your own to save cost; that's the user's decision. Instead, build an evaluation (eval) set and measure whether the small model is actually good enough for the task. If quality doesn't drop, the savings are free; if it does, you were cutting in the wrong place.</div>

## Batch processing

Not every request needs an instant answer. For latency-insensitive work — nightly report generation, labeling a large document set, data enrichment — **batch processing** endpoints come into play.

The logic is like shipping: for an urgent package you call a courier and pay a premium; but if you hand a hundred packages to standard shipping at once, the unit cost drops sharply. The batch endpoint works the same way: it sends requests in bulk, has the results ready within a window (usually within an hour, at most 24 hours), and in return charges **half the standard price**.

The best part is that batch works alongside the other optimizations: caching, small-model selection, and token trimming all apply to batched requests too. So anywhere you can sacrifice latency, you have a chance to halve the cost without changing anything else.

> Simple rule: if a user is waiting for the answer on screen, it's a real-time request; if you can queue it and read the result later, it's batch.

## The small model + RAG balance

Most teams assume "bigger model, better results" and load everything onto the most expensive model. Yet for many tasks the root of the problem isn't the model's _intelligence_ but its inability to reach the right _knowledge_. This is where the combination of a small model and RAG (Retrieval-Augmented Generation) offers a strong balance.

The difference is this: asking a large model to recall information _from memory_ is both expensive and risks fabrication (hallucination). Instead, if you pull the relevant document from a vector database, add it to the prompt, and ask a small model to answer _based only on this text_, the task drops from "knowing" to "reading and summarizing." That is a far easier task, and the small model handles it comfortably.

-   **Cost falls:** You no longer need an expensive model's reasoning power on every query.
-   **Accuracy rises:** The answer is grounded in real documents; it can be cited, and hallucination drops.
-   **Freshness is gained:** The knowledge lives outside the model; adding a new document doesn't require retraining.

There is, of course, a balancing question: a RAG setup needs a vector database, chunking, and embedding; and the retrieved documents increase the input token count of every request. So "small model + RAG" is usually cheaper than "large model, no RAG," but not blindly — you need to verify it by measuring on your own workload.

## A decision flow that combines it all

These levers aren't rivals; they're layers. A mature system uses them all together. The pseudocode below captures the right order for bringing cost down in most projects:

```python
def optimize_cost(request):
    # 1. Trim the prompt and constrain the output
    request = trim_prompt(request)
    request.max_tokens = actual_task_need(request)

    # 2. Cache the fixed prefix
    if has_large_fixed_prefix(request):
        request.cache_control = "ephemeral"

    # 3. If knowledge is needed, fetch it via RAG, not from memory
    if needs_external_knowledge(request):
        request.context = vector_db.fetch(request.question)
        model = "small-fast-model"
    else:
        model = pick_by_task_difficulty(request)  # cascade routing

    # 4. If latency doesn't matter, halve the cost
    if latency_insensitive(request):
        return enqueue_batch(request, model)

    return send_realtime(request, model)
```

Order matters: first cut token waste (usually the fastest win), then cache the repeating prefix, then match the task to the right model, and finally route latency-insensitive work to batch. Each layer compounds on the one before it.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Cost is computed per token; output tokens are much more expensive than input.</li><li>The first step is always to measure: count tokens before you optimize.</li><li>Caching brings a repeating prefix down to roughly one-tenth of the price; a single changed byte breaks it.</li><li>Match the task to the model; don't load everything onto the largest model — use cascade routing.</li><li>Send latency-insensitive work in batches: half the standard price.</li><li>Small model + RAG is a both cheap and accurate balance for most knowledge-heavy tasks.</li></ul></div>

<div class="faq"><details><summary>What's the easiest first step to lower cost?</summary><p>Cut token waste. Trimming the system prompt, removing unnecessary examples, and setting <code>max_tokens</code> to the task's real need often yields serious savings without changing a single line of code. Right after that, turn on caching for the repeating prefix.</p></details><details><summary>Caching doesn't seem to be working — why?</summary><p>Almost always there's a variable silently breaking the prefix: a timestamp in the system prompt, a random ID, or unsorted JSON. If <code>cache_read_input_tokens</code> in the response stays zero, compare the prefix of two consecutive requests byte by byte and move whatever changes to the end of the prefix.</p></details><details><summary>Should I always pick the smallest model for cost?</summary><p>No. The right method is to match the task to the model. A small model is excellent for simple, high-volume tasks; but on complex reasoning it can lower quality and require more retries, actually ending up more expensive. Build an eval set and measure that the small model is genuinely good enough for that task.</p></details></div>

---

LLM cost optimization isn't a single trick; it's layering token trimming, caching, model selection, batch, and RAG in the right order. If you're curious how we apply these levers in practice across Turkish AI products, take a look at the approach of [HatsonTech](/en/posts/what-is-hatsontech/).
