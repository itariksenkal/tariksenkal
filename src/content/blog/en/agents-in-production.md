---
title: "Taking AI Agents to Production: The Demo Works — Does the System?"
description: "What it takes to run an AI agent in production: timeouts, idempotency, circuit breakers, prompt versioning, canary rollout and cost per successful task — with code."
publishDate: "2026-08-13T23:43:00+03:00"
lang: en
category: "Agents"
tags: ["Agents", "AI"]
translation: "ajanlari-uretime-almak"
heroImage:
  src: "../../../assets/blog/covers/agents-in-production.jpg"
  alt: "Taking AI Agents to Production: The Demo Works — Does the System?"
---

The demo works. Thirty seconds, four tool calls, a correct answer. Then you put it in front of real users and discover that the model was never the hard part — everything built around it was. This article is about that everything: deployment topology, timeouts, idempotency, failure taxonomy, prompt versioning and the two metrics that actually tell you whether an agent is working.

## The real gap between a demo and a system

That gap now has a published measurement. In Anthropic's harness-design work (24 March 2026) the same task was measured two ways: a bare agent finished in **20 minutes for $9**, and the same task under a full harness took **6 hours and $200**. Twenty times the cost — and the second one was the version that produced production-quality output.

> Taking an agent to production is not about making it faster; it is about building a system around it that catches failure.

Look at where the difference comes from and the list is familiar: evaluation steps, retries, verification, persisting intermediate artifacts, human approval. Which means shipping an agent is not a model problem but a distributed systems problem — and the classic distributed systems toolkit transfers almost unchanged.

## Deployment topology: sync or queue?

This is the first architectural decision and the one most often got wrong. If an agent task averages thirty seconds and occasionally takes five minutes, putting it inside an HTTP request is a mistake: the client times out, the user closes the tab, the work is abandoned halfway, and you pay for half a task.

| Situation | Topology |
| --- | --- |
| < 5 seconds, single tool call | Synchronous HTTP |
| 5–60 seconds, a few steps | Streaming + progress events |
| \> 1 minute, or highly variable | Queue + job ID + polling or webhook |
| Hours, with human approval | Durable workflow + checkpoints |

For long-running work 2026 also produced a protocol-level answer: MCP's `io.modelcontextprotocol/tasks` extension defines durable task handles — `working`, `input_required`, `completed`, `failed` and `cancelled` states, polling via `tasks/get`, mid-flight input via `tasks/update`, and survival across client crashes. "Long-running job" no longer has to be a bespoke structure you invent.

## Idempotency, timeouts and retries

The most expensive production failure agents produce is a duplicated side effect: the same email sent twice, the same order created twice. The cause is always the same — a timeout fires, the system retries, and the first call had actually succeeded.

The fix is classic too: every tool with a side effect takes an _idempotency key_, and a second call with the same key returns the first result instead of repeating the work.

```python
import hashlib, json

def idempotency_key(task_id: str, tool: str, args: dict) -> str:
    body = json.dumps(args, sort_keys=True, ensure_ascii=False)
    raw = f"{task_id}|{tool}|{body}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:32]

def safe_call(tool, args, task_id, store, timeout=30):
    key = idempotency_key(task_id, tool.name, args)
    previous = store.get(key)
    if previous is not None:
        return previous                     # do not re-run; return the result

    result = tool.run(**args, timeout=timeout)
    store.set(key, result, ttl=86400)       # keep for 24 hours
    return result
```

Two rules travel with it: **give every tool a timeout** (the default is not infinite, it is whatever you set) and **bound retries with exponential backoff**. Automatic retry on a side-effecting tool must never be enabled without an idempotency key.

<div class="callout"><strong>Tip:</strong> Remember that under MCP's 2026 revision a broken stream loses the request and the client re-issues it with a new request ID. That turns idempotency from a good practice into a protocol requirement.</div>

## A failure taxonomy worth naming

"The agent didn't work" is not a bug report. Teams that succeed in production share one habit: they classify failures into named categories, because each category has a different fix.

-   **Tool failure:** the tool returned a 500, timed out, or produced schema-violating output. Fix at the tool layer, not in the prompt.
-   **Grounding failure:** the model called the right tool with the wrong parameters. Fix: clearer schemas and descriptions, worked examples.
-   **Planning failure:** the model chose the wrong tool or skipped a step. Fix: fewer tools, shorter instructions.
-   **Non-termination:** the agent never finishes and repeats itself. Fix: step budget, progress check, loop detection.
-   **Context overflow:** the window filled and quality dropped. Fix: compaction or a session reset.
-   **Verification failure:** the agent believes it finished and the output is wrong. Fix: a separate evaluator — the most expensive and the most important one.

Add these categories to your tracing tags. Look at the weekly distribution and the layer to improve reveals itself; without it, everyone edits the prompt, because the prompt is the most visible thing.

## Prompt versioning and canary rollout

A prompt is not a config file, it is code: it changes behaviour, it must be revertible, and it must be tested. Three things should be standard in production.

1.  **Versioning:** every prompt ships with a version tag and every request records which version ran. When quality drops, the first question will be "which version".
2.  **Canary rollout:** release a new prompt to 5% of traffic, compare metrics, then widen. The same applies to model upgrades — the model a provider calls "better" may be worse on your task.
3.  **Rollback:** test the rollback path before you need it. In agent systems rollback often covers not just the prompt but tool schemas and memory records too.

The metric set is narrow, and four are enough: **task success rate**, **cost per successful task**, **p95 completion time** and **human intervention rate**. If all four are not improving, there is no improvement — usually one is being bought with another.

## The pre-production checklist

1.  Does every tool have a timeout, a rate limit and schema validation?
2.  Do side-effecting tools take an idempotency key?
3.  Are step, token and sub-agent budgets defined — and what happens when they are exceeded?
4.  Is there a circuit breaker that halts the agent after N consecutive failures?
5.  Does every request record which prompt and model version ran?
6.  Is the trace sufficient to follow one task end to end?
7.  Do irreversible actions require approval, and does the approval screen show the concrete effect?
8.  What does the user see on failure? "Something went wrong" is not a product answer.

Most of this list is not agent-specific; it is ordinary production engineering. What agents change is that failure is far more likely and far more creative. If OWASP's 2026 LLM list moved _Excessive Agency_ to #3 and _Unbounded Consumption_ up four places, this is exactly why: the damage lands in production, at the agent layer.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>The same task cost 20 minutes and $9 bare, versus 6 hours and $200 under a full harness — and the harness produced the shippable output.</li><li>Do not put agent work longer than a minute inside an HTTP request; use a queue, a job ID and checkpoints.</li><li>Every side-effecting tool needs an idempotency key — MCP's new stream behaviour makes this a protocol requirement, not a nicety.</li><li>Classify failures into named categories; without that, everyone edits the most visible thing, which is the prompt.</li></ul></div>

<div class="faq"><details><summary>How do I take an AI agent to production?</summary><p>By building the system around the model rather than tuning the model. The right deployment topology (a queue for long work), timeouts and schema validation on every tool, idempotency on side-effecting tools, step and token budgets, a circuit breaker, prompt versioning and canary rollout. Model selection is the easiest item on that list.</p></details><details><summary>How should I measure agent cost?</summary><p>Per successful task, not per request. Work an agent finishes on the third attempt costs more than work finished on the first, and that difference is invisible in per-request metrics. Give every task an ID, sum the cost of all calls under that ID, and split by outcome.</p></details><details><summary>What if the agent loops forever?</summary><p>Three preventive rules: a step budget, a progress check (stop if state has not changed in N steps) and repetition detection (cut off when the same tool is called with the same arguments repeatedly). A global token budget then acts as a safety net — when it is exceeded, mark the task failed and requeue it.</p></details></div>

---

Shipping an agent means shifting your trust from the model to the system around it. For the general discipline of going live see [MLOps and taking AI to production](/en/posts/mlops-ai-to-production/), for the architectural options of the loop itself see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/), and to see what actually broke see [LLM observability](/en/posts/llm-observability/).
