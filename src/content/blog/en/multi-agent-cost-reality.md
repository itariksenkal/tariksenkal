---
title: "Multi-Agent Systems: 15× the Tokens, 90% Better — Which One Is You?"
description: "When multi-agent architectures win and when they burn money: reconciling two primary sources, the token multiplier, failure modes and a concrete decision table."
publishDate: "2026-08-13T23:52:00+03:00"
lang: en
category: "Agents"
tags: ["Agents", "AI"]
translation: "coklu-ajan-maliyet-gercegi"
heroImage:
  src: "../../../assets/blog/bimg-07.jpg"
  alt: "Multi-Agent Systems: 15× the Tokens, 90% Better — Which One Is You?"
---

There are two solid engineering write-ups on multi-agent architecture and they appear to say opposite things: one reports multi-agent beating a single agent by 90%, the other argues you should not build multi-agent systems at all. They do not actually conflict — they are talking about different kinds of work. This article covers that reconciliation and the numbers that make the decision for you.

## The number on the benefit side

Anthropic's engineering note on their multi-agent research system (13 June 2025) reports an orchestrator-worker arrangement beating single-agent Opus 4 by **90.2%** on internal breadth-first research evaluations. An impressive figure — but a second finding in the same piece reframes the first:

> Token usage alone explains 80% of the performance variance.

Multi-agent architecture works largely _because it causes enough tokens to be spent_. That does not make the architecture worthless; it clarifies what you are buying. Doing the same work with one agent and a larger budget is also an option — and usually a simpler one.

## The number on the cost side

The second number from the same source is the other half of the decision: **a single agent uses roughly 4× the tokens of an ordinary chat interaction, and a multi-agent system roughly 15×.**

Fill in the table with your own figures to see what that multiplier means:

| Arrangement | Relative token consumption |
| --- | --- |
| Single-turn chat | 1× |
| Single agent (tool loop) | ~4× |
| Multi-agent (orchestrator + workers) | ~15× |

So moving to multi-agent means doing the same work at roughly **four times** the cost (4× → 15×). The question to ask first: on this task, is accuracy worth a fourfold cost difference?

## The counter-argument

Cognition's "Don't Build Multi-Agents" (12 June 2025) approaches the subject from a completely different angle, and the technical argument is strong: **when sub-agents run independently, actions carry implicit decisions, and those decisions conflict.**

Their example captures it: on a task to build a Flappy Bird clone, one sub-agent produced Mario-style assets while another drew an incompatible bird. Neither sub-agent made a mistake; each simply made its own implicit design decision and nothing shared them.

The recommendation that follows has two parts: **pass sub-agents full traces rather than just messages** — because the decision lives in the action, not the message — and default to a single-threaded, linear agent plus context compression.

<div class="callout"><strong>Tip:</strong> Before handing a sub-agent a task, test its ambiguity: run the same instruction twice and check whether the outputs are mutually compatible. If they are not, that instruction will produce conflicts in a multi-agent arrangement. Vague task descriptions are the most common source of multi-agent failure.</div>

## Reconciliation: a one-sentence rule

Put the two sources side by side and the contradiction disappears. The work Anthropic won on is _breadth-first research_: scanning many independent sources in parallel. The work Cognition showed losing is _interdependent construction_: writing code where one file affects another.

> Multi-agent wins on parallelisable, read-heavy work; it loses on write-heavy work with interdependencies.

Anthropic's own write-up agrees: it lists shared-context domains, heavy interdependencies and limited parallelisability as bad fits — and explicitly includes **most coding work** in that list.

## Failure modes and the cost ceiling

If you have decided to build one, close the known failure modes up front. The primary sources name these:

-   **Over-spawning:** the orchestrator starts more workers than needed. Control: a hard cap.
-   **Endless searching:** a worker with no notion of "enough" keeps looking. Control: step and token budgets plus an explicit stop criterion.
-   **Duplicated work:** two workers do the same thing. Control: partition task descriptions so they cannot overlap and write results to a shared file.
-   **Vague task descriptions:** the most expensive failure. Control: give every subtask an input, an expected output format and a success criterion.
-   **Sequential bottlenecks:** an apparently parallel arrangement that is in fact waiting on one step; verify from traces that the parallelism is real.

The security side matters too: OWASP's 2026 agentic framework names **insecure inter-agent communication (ASI07)** and **cascading failures (ASI08)** as distinct risks. Text one sub-agent sends another is still untrusted input to the receiver, and one sub-agent's failure can send the parent into an unbounded retry.

That is why in multi-agent systems a **global token budget** is a safety control rather than an optimisation:

```python
class TaskBudget:
    """One ceiling for the whole tree: orchestrator plus every sub-agent."""
    def __init__(self, max_tokens: int, max_subagents: int = 5):
        self.max_tokens = max_tokens
        self.max_subagents = max_subagents
        self.spent = 0
        self.spawned = 0

    def spawn(self):
        if self.spawned >= self.max_subagents:
            raise RuntimeError("sub-agent cap exceeded")
        self.spawned += 1

    def charge(self, tokens: int):
        self.spent += tokens
        if self.spent > self.max_tokens:
            raise RuntimeError(
                f"task budget exceeded: {self.spent}/{self.max_tokens}")
```

## The decision table

| Nature of the work | Architecture |
| --- | --- |
| Multi-source, parallel, read-heavy research | Multi-agent |
| Subtasks are independent and outputs merge cleanly | Multi-agent |
| Writing code, refactoring, cross-file consistency | Single agent + context compression |
| Linear flow where each step feeds the next | Single agent |
| Cost-sensitive, high-volume work | Single agent; raise effort if needed |
| One-off work where accuracy far outweighs cost | Multi-agent or a harness |

One closing suggestion: before moving to multi-agent, try _a single agent with a larger budget_. If token spend explains most of the variance in the gains, that experiment usually answers whether the architectural complexity is needed at all — and far more cheaply.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>A multi-agent system beat a single agent by 90.2% on internal evals — but token usage alone explains 80% of the variance.</li><li>The token multiplier: chat 1×, single agent ~4×, multi-agent ~15×. The move costs roughly four times as much.</li><li>Multi-agent wins on parallelisable, read-heavy work and loses on interdependent, write-heavy work — including most coding.</li><li>Before switching, try a single agent with a bigger budget; it usually shows the complexity is unnecessary.</li></ul></div>

<div class="faq"><details><summary>Single agent or multi-agent?</summary><p>If the work is parallelisable and read-heavy — scanning many independent sources — multi-agent wins. If steps feed each other and outputs must stay consistent, as in most code work, a single agent plus context compression is better and far cheaper.</p></details><details><summary>How much does multi-agent increase cost?</summary><p>Per the primary measurement, a single agent uses about 4× the tokens of ordinary chat and a multi-agent system about 15×. Moving from one to the other is therefore roughly a fourfold cost increase; measure whether the accuracy gain justifies it.</p></details><details><summary>What is the most common multi-agent failure?</summary><p>Vague task descriptions. When sub-agents run independently, each makes its own implicit design decisions and those decisions conflict, producing outputs that are individually correct and collectively incoherent. Giving every subtask an input, an expected output format and a success criterion prevents most of it.</p></details></div>

---

Multi-agent is a trade-off rather than a capability; the right question is not "can I build one" but "is this work worth it". For the architectural options see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/), for the full set of cost levers see [LLM cost optimization](/en/posts/llm-cost-optimization/), and for the cheaper way to route work see [model routing and cascades](/en/posts/model-routing-cascades/).
