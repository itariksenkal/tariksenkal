---
title: "Autonomous Agent Architectures: Plan-and-Execute, Agent Fleets and the Cost Reality"
description: "Agents are more than a single loop. ReAct, plan-and-execute, supervisor-worker patterns, heterogeneous model use, and how to keep cost under control across agent fleets."
publishDate: "2026-08-09T23:34:00+03:00"
lang: en
category: "Agents"
tags: ["Agents", "AI"]
translation: "otonom-ajan-mimarileri"
heroImage:
  src: "../../../assets/blog/covers/autonomous-agent-architectures.jpg"
  alt: "Autonomous Agent Architectures: Plan-and-Execute, Agent Fleets and the Cost Reality"
---

Building your first agent is easy: give a model tools, put it in a loop, and it works. Making it reliable, cheap and predictable is an architectural problem. In systems making thousands of calls, **which model does which job** determines both the quality and the entire bill.

## Three core patterns

-   **The ReAct loop:** think, call a tool, observe, repeat. Simple and flexible, but because it carries the whole context each step it grows expensive on long tasks and can drift.
-   **Plan-and-execute:** a capable model produces the whole plan first, then cheaper models carry out the steps.
-   **Supervisor-worker:** a coordinator distributes tasks to specialised sub-agents and merges their results.

## Why plan-and-execute is cheap

In ReAct every step goes to the strongest model, and the context grows each time. Plan-and-execute separates the two: expensive reasoning happens once, and repetitive work falls to a cheap model. Against using a frontier model for everything, the saving can be very large; reductions approaching ninety percent are reported in industry write-ups.

<div class="callout"><strong>The trade-off:</strong> because the plan is made up front, an unexpected change in the environment can invalidate it. Practical systems therefore include a replanning trigger.</div>

## Supervisor and workers

When a task parallelises naturally this pattern is strong: each sub-agent focuses on a narrow job, carries its own context, and returns only a summary. Context isolation is one of the most valuable properties in agent systems — noise from one subtask does not pollute the others.

The cost is coordination complexity. When sub-agents return contradictory results, who decides must be defined explicitly.

## Heterogeneous model use

| Tier | Model | Work |
| --- | --- | --- |
| Planning | Strong, expensive | Strategy, resolving ambiguity |
| Execution | Mid-tier | Standard steps, tool calls |
| High frequency | Small model | Classification, extraction, formatting |

Using one model is simple but expensive. In a tiered approach the real engineering work is deciding which step belongs to which tier — and measuring it.

## Stopping the loop

The most common production failure in autonomous systems is the infinite loop: the agent calls the same tool repeatedly, makes no progress, and cost accumulates. Every agent needs three limits: a maximum step count, a maximum token budget, and a progress check. When there is no progress, stopping beats continuing.

## Frequently asked questions

<div class="faq"><details><summary>Is a multi-agent system always better?</summary><p>No. When the task is naturally sequential, a single agent is simpler, cheaper and easier to debug. Multi-agent architectures pay off on genuinely parallel work.</p></details><details><summary>How do I observe agent decisions?</summary><p>Log every step with its input, chosen tool, output and token cost. An agent you cannot trace is an agent you cannot debug.</p></details><details><summary>Where should human approval sit?</summary><p>Immediately before irreversible actions: transferring money, sending email, deleting data. Read operations can proceed unattended.</p></details></div>

---

Agent architecture is less about model choice than about designing a division of labour. For more, see [context engineering](/en/posts/context-engineering/) and [function calling](/en/posts/function-calling-structured-output/).
