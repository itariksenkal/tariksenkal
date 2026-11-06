---
title: "Agent Harness Design: Generator–Evaluator and Context Anxiety"
description: "Why long-running agents wrap up early: context anxiety, why resets beat compaction, the generator-evaluator split and file-based handoff between agents."
publishDate: "2026-08-13T23:44:00+03:00"
lang: en
category: "Architecture"
tags: ["Architecture", "AI"]
translation: "ajan-kosum-mimarisi"
heroImage:
  src: "../../../assets/blog/covers/agent-harness-design.jpg"
  alt: "Agent Harness Design: Generator–Evaluator and Context Anxiety"
---

The strangest behaviour in a long-running agent task is this: the agent does not finish, but acts as if it did. It writes a summary, says "complete", and stops — while work remains. That behaviour now has a name and a known cause. This article is about the _harness_ layer built around a single agent loop: which parts genuinely matter, and which ones multiply cost twentyfold and earn it.

## What a harness is, and how it differs from the agent

An **agent** is a model plus tools plus a loop. A **harness** is the structure built around that loop to make sure the work is actually done: task decomposition, persisted intermediate artifacts, a separate evaluation step, retries and context management.

> The agent does the work; the harness is what makes the work real.

The size of that difference has been measured. In Anthropic's harness-design work (24 March 2026) the same retro-game task took **20 minutes and $9** with a bare agent, and **6 hours and $200** under a full harness. A digital audio workstation build by the same team took 3 hours 50 minutes and $124.70. The harness is not cheap — but it was the version that produced shippable output.

The right way to read that table is to see the harness as _quality insurance_ rather than acceleration. Twenty times the cost only makes sense where correctness is worth twenty times more.

## Context anxiety: rushing as the window fills

**Context anxiety** is the tendency of a model to wrap up prematurely as its context window fills. Anthropic named it in Claude Sonnet 4.5: as remaining space shrinks, the model tries to conclude, skips remaining steps and declares completion.

This is an architecture problem, not a prompt problem, and it has two practical consequences. First: **do not let the agent feel how full the window is.** Writing the remaining token count into context is the most direct way to trigger the behaviour. Second: rather than squeezing a long task into one window, split it.

<div class="callout"><strong>Tip:</strong> Detecting the "summarise and stop" mode is easy: no new tool calls in the last two turns and output that switches into summary register. Treat that pattern as a <em>warning</em> rather than a completion signal — at that point the harness should open a new session, not accept the task as done.</div>

## Why resets beat compaction

When context fills you have two options: _compaction_ (summarise history and continue) or a _reset_ (open a new session carrying only the state you choose). Intuition favours compaction; measurement favoured the reset.

The reason is elegant: compaction does not give the agent a clean slate. The summary still carries traces of earlier attempts, abandoned approaches and failed hypotheses; the model still sees them and stays under their influence. A reset is genuinely a fresh start — the only thing carried across is what you deliberately chose to carry.

```python
# Reset instead of compaction: YOU choose what carries over
HANDOFF = """Objective: {goal}
Completed steps:
{done}
Remaining steps:
{todo}
Known constraints:
{constraints}
Note: details of earlier attempts were deliberately not carried over."""

def new_session(state):
    handoff = HANDOFF.format(
        goal=state.goal,
        done="\n".join(f"- {s}" for s in state.done),
        todo="\n".join(f"- {s}" for s in state.todo),
        constraints="\n".join(f"- {c}" for c in state.constraints))
    return Session(system=SYSTEM, first_message=handoff)   # clean window
```

The real difference is _who writes_ the summary. A model summarising its own history also launders its own mistakes. Generating the handoff from a structured state object removes that risk entirely.

## The generator-evaluator split

This is the single highest-return part of a harness. The observation: **agents over-praise their own output.** Ask the same model whether the work is good and it will nearly always say yes. But defining an _independent_ evaluator agent and tuning it — writing what it should look at, what evidence to gather, what threshold to apply — is entirely tractable.

The practical arrangement:

1.  The **generator** does the work and writes output to a file.
2.  The **evaluator** sees only the output and the success criteria — never the generator's reasoning. This separation is critical; an evaluator that sees the justification gets persuaded by it.
3.  The evaluator returns something _concrete_: pass/fail plus a list of items to fix.
4.  The generator fixes; the loop repeats at most N times.

Making subjective quality gradable comes from the same place: "is the interface good" cannot be evaluated, but "does anything overflow at three viewport widths, is contrast above 4.5:1, is there an empty state" can. Give the evaluator a checklist, not a judgement call.

## Sprint contracts and file-based handoff

A **sprint contract** is the generator and evaluator agreeing on testable success criteria before implementation starts. It removes the later "that is not what I meant" argument and gives the evaluator something concrete to measure. Anthropic's own experience contains an instructive correction here: they later _removed_ the sprint construct — the contract idea persists, but the ceremony around it can cost more than it returns. Apply the same test to your own harness: if a component has no measured contribution, delete it.

**File-based handoff** is the sturdiest form of the inter-agent channel. Rather than messaging each other, agents write and read files. The advantages are concrete: output persists across crashes, humans can inspect it, it enters version control, and only the needed slice ever enters a context window.

```text
work/
  task.md            # sprint contract: objective + success criteria
  plan.md            # the generator's plan
  output/            # produced artifacts
  review-01.md       # evaluator report (pass/fail + items)
  review-02.md
  state.json         # structured state the harness keeps (for handoff)
```

## When a harness is not worth building

A harness is a cost, and it does not pay everywhere. It does not pay when:

-   **The task finishes in one turn.** An evaluator adds latency and cost, nothing else.
-   **Success criteria cannot be written down.** Without a concrete criterion the evaluator just restates the generator's opinion.
-   **Failure is cheap.** If a wrong output costs little, re-running is cheaper than a harness.
-   **A human is already in the loop.** With a human reviewer present, a second model reviewer is redundant.

There is exactly one case where it clearly pays: **long, multi-step work with verifiable output where errors are expensive.** Code generation, data transformation, document processing pipelines. Where those three conditions do not hold together, building a harness is decoration rather than engineering.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>The same task cost 20 minutes and $9 bare versus 6 hours and $200 harnessed — a harness buys quality, not speed.</li><li>Context anxiety is real: models wrap up early as the window fills, so keep remaining-token information out of context.</li><li>Resets beat compaction because a summary still carries traces of abandoned approaches.</li><li>Give the evaluator the output and a checklist — never the generator's reasoning.</li></ul></div>

<div class="faq"><details><summary>What is an agent harness?</summary><p>The layer built around an agent loop that ensures the work is actually complete: task decomposition, artifacts written to files, an independent evaluation step, retries and context management. The agent does the work; the harness guarantees the result.</p></details><details><summary>What is context anxiety and how do I prevent it?</summary><p>The tendency of a model to wrap up early, skip steps and declare completion as its context window fills. Two preventions: keep remaining-token information out of the context, and split long tasks across sessions rather than squeezing them into one window.</p></details><details><summary>Compaction or reset?</summary><p>On long runs a reset works better, because compaction never gives the agent a clean slate — the summary carries traces of failed attempts. With a reset you choose what carries over, and you should generate that handoff from a structured state object rather than from a model-written summary.</p></details></div>

---

The harness is what turns an agent from a demo into a production component. For the architectural options of the loop see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/), for what the evaluator should measure see [agent evaluation](/en/posts/agent-evaluation/), and for deciding what enters the window see [context engineering](/en/posts/context-engineering/).
