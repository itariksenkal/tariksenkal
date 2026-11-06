---
title: "OWASP Agentic Top 10: What ASI01–ASI10 Mean in Code"
description: "Turning each item of the OWASP Agentic Top 10 (2026) into an implementable control — a config, a policy and a test — instead of restating the risk."
publishDate: "2026-08-13T23:40:00+03:00"
lang: en
category: "Security"
tags: ["Security", "AI"]
translation: "owasp-ajan-guvenlik-riskleri"
heroImage:
  src: "../../../assets/blog/bimg-09.jpg"
  alt: "OWASP Agentic Top 10: What ASI01–ASI10 Mean in Code"
---

Almost everything written about agent security does the same thing: it lists risks. The list is useful, but when you close it nothing in your system has changed. This article does not repeat the list — it turns each item of OWASP's 2026 agentic risk framework into _a control you can write today_. For every item I ask one question: which config, which policy and which test closes this?

## Two frameworks, eight months apart

2026 was the year the frameworks landed. The **OWASP Top 10 for Agentic Applications 2026** was published on 9 December 2025 and named ten agent-specific risks. Eight months later, on 3 August 2026, the **OWASP GenAI LLM Top 10 2026** arrived — the first edition in which real-world incident data carried weight (roughly 25% incident data, 75% expert consensus).

The verified movements in that list matter for agent engineering: Prompt Injection stayed at #1, Sensitive Information Disclosure stayed at #2, **Excessive Agency climbed to #3**, Unbounded Consumption rose four places, output handling fell from 5th to 10th, and **System Prompt Leakage was renamed Hidden Context Exposure**. Prompt injection now also covers cross-modal attacks hidden in images and audio.

> Everything that rose is agent-driven — agency, consumption and context. What fell is classic application security: output handling.

OWASP's own framing is also this article's thesis: stop trying to build a model that cannot be fooled, and build the system around it so that when the model is fooled — and it will be — nothing important breaks.

## ASI01–ASI03: goal, tools, identity

-   **ASI01 — Agent Goal Hijack.** Control: re-inject the system instruction and the user's goal on _every_ turn, and never place tool output into the instruction channel. Test: a regression test that runs the agent against a goal-rewriting payload and asserts the final-turn objective still matches the first-turn one.
-   **ASI02 — Tool Misuse & Exploitation.** Control: an allowlist plus a parameter schema plus a rate limit for every tool. The tool must validate its own input too; "the model will produce correct parameters" is not a security assumption. Test: unit tests showing schema-violating calls are rejected at the tool layer.
-   **ASI03 — Identity & Privilege Abuse.** Control: the agent must act with the privileges of _the user who triggered the action_, not its own. Use short-lived, narrowly scoped tokens and keep broad grants off the agent's service account. Test: an integration test proving that requesting a record the user cannot reach is denied through the agent too.

## ASI04–ASI06: supply chain, code execution, memory

-   **ASI04 — Agentic Supply Chain.** Control: pin tool-server and plugin versions, record a hash of every tool definition, and halt deployment when it changes. This is the cheapest available defence against a dependency that turns malicious after the fact.
-   **ASI05 — Unexpected Code Execution.** Control: run model-generated code only in a container with no network, a read-only filesystem, and wall-clock and memory limits. Shell access should not be the default; where it is enabled, enable it with a command allowlist.
-   **ASI06 — Memory & Context Poisoning.** Control: store provenance for every memory write and mark content from untrusted sources as a _quotation_, not as fact. Treat writing to memory as a tool call in its own right: permission, schema and audit record required.

<div class="callout"><strong>Tip:</strong> The insidious property of memory poisoning is its delay — written today, triggered three weeks later. Recording write time, source and the session identity that wrote each memory entry is the only thing that makes post-incident analysis possible.</div>

## ASI07–ASI10: comms, cascades, trust, rogue agents

-   **ASI07 — Insecure Inter-Agent Communication.** Control: carry inter-agent messages over an authenticated channel and sign the sending agent's identity. Text one agent sends another is still _untrusted input_ to the receiver.
-   **ASI08 — Cascading Failures.** Control: circuit breakers, step budgets and a cap on spawned sub-agents. If a sub-agent's failure sends the parent into a retry, the system drowns itself without exponential backoff and a global budget.
-   **ASI09 — Human-Agent Trust Exploitation.** Control: an approval screen must show _which concrete records will change_, not what the agent intends. "Shall I clean up the files?" is a bad approval; "these 14 files will be deleted" is a good one. Approval fatigue is a vulnerability.
-   **ASI10 — Rogue Agents.** Control: inventory. If you cannot list which agents run under which identities with access to which tools, you cannot close this item. Include scheduled and background agents.

## Putting the policy in code

Most of the controls above collapse into one place: a permission gate that runs _before_ the tool does. The pattern below is small but real, and satisfies ASI02, ASI03 and ASI09 simultaneously:

```text
from dataclasses import dataclass

@dataclass(frozen=True)
class Permission:
    tool: str
    read_only: bool           # writing tools are a separate class
    needs_approval: bool      # irreversible actions
    max_calls: int            # per-session rate limit

POLICY = {
    "search_docs":  Permission("search_docs",  True,  False, 40),
    "delete_doc":   Permission("delete_doc",   False, True,   2),
    "send_email":   Permission("send_email",   False, True,   1),
}

class PolicyError(Exception):
    pass

def call(tool: str, args: dict, ctx) -> dict:
    perm = POLICY.get(tool)
    if perm is None:
        raise PolicyError(f"not on the allowlist: {tool}")            # ASI02
    if ctx.counter[tool] >= perm.max_calls:
        raise PolicyError(f"rate limit exceeded: {tool}")             # ASI08
    if not ctx.user_may(tool, args):
        raise PolicyError("insufficient user privilege")              # ASI03
    if perm.needs_approval and not ctx.approved(tool, args):
        raise PolicyError("awaiting human approval")                  # ASI09

    ctx.counter[tool] += 1
    ctx.audit(tool, args)      # every call leaves a trace
    return TOOLS[tool](**args)
```

The important property of this gate is that it lives _outside_ the model. Telling the model "do not delete things" is a suggestion; a `needs_approval` check at the gate is a rule. Security comes from rules, not suggestions.

## Where to start: a 30-day order

1.  **Inventory (ASI10).** Tabulate agents, their identities and their tools. You cannot protect an agent you do not know about.
2.  **Allowlist and schema (ASI02).** Build the gate above and make the default deny.
3.  **Privilege reduction (ASI03).** Move broad service-account grants into user context.
4.  **Isolation (ASI05).** Move code execution into a network-isolated container.
5.  **Budgets and breakers (ASI08).** Cap steps, sub-agents and tokens.
6.  **Audit and memory provenance (ASI06).** Make every tool call and every memory write leave a trace.

Those six steps close most of the ten in practice. The remainder — supply-chain pinning and inter-agent signing — can come later, but should not be forgotten.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Read OWASP's 2026 agentic framework as a control list, not a risk list: every item has a configuration counterpart.</li><li>Everything that rose in the 2026 LLM Top 10 is agent-driven — Excessive Agency to #3, Unbounded Consumption up four places.</li><li>The tool permission gate must live outside the model: an instruction is a suggestion, a gate check is a rule.</li><li>Approval screens must show concrete effects rather than intent — approval fatigue is exactly what ASI09 describes.</li></ul></div>

<div class="faq"><details><summary>What is the OWASP agentic security list?</summary><p>The OWASP Top 10 for Agentic Applications, published 9 December 2025, names ten risks specific to agent-based systems: goal hijack, tool misuse, identity and privilege abuse, supply chain, unexpected code execution, memory and context poisoning, insecure inter-agent communication, cascading failures, human-agent trust exploitation and rogue agents.</p></details><details><summary>How does it differ from the LLM Top 10?</summary><p>The LLM Top 10 covers model-centric risks — prompt injection, sensitive information disclosure, excessive agency. The agentic list covers what appears once the model uses tools, keeps memory and talks to other agents. They are layered rather than competing: prompt injection touches six of the ten agentic categories.</p></details><details><summary>How does a small team implement all of this?</summary><p>Do not implement all of it; implement it in order. Inventory, a tool permission gate and privilege reduction close most of the risk in three steps and none of them requires a product purchase. Isolation and budgets follow in a second wave, supply-chain pinning in a third.</p></details></div>

---

Once the risk list becomes a control list, agent security stops being frightening and becomes ordinary engineering. For the underlying attack see [prompt injection and jailbreaks](/en/posts/prompt-injection-jailbreaks/), for defences at the output layer see [guardrails and content moderation](/en/posts/guardrails-content-moderation/), and for the loop these controls sit inside see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/).
