---
title: "A2A: How Agents Talk to Each Other — and Why It Isn't MCP's Rival"
description: "A2A v1.0 standardises agent discovery and task delegation. Agent Cards, the task lifecycle, how it differs from MCP, and the agentic commerce layer above it."
publishDate: "2026-08-13T23:53:00+03:00"
lang: en
category: "Tools"
tags: ["Tools", "AI"]
translation: "ajanlar-arasi-protokol-a2a"
heroImage:
  src: "../../../assets/blog/bimg-15.jpg"
  alt: "A2A: How Agents Talk to Each Other — and Why It Isn't MCP's Rival"
---

Your company has a travel agent, finance has an expense-approval agent, and neither knows the other exists. For the travel agent to request approval, it must either learn finance's internal logic or somebody must write an integration between them. A2A standardises exactly that problem: letting one agent find another and hand it work — without seeing inside it. This article covers how A2A works and draws a clean line between it and MCP.

## A2A and MCP are not the same layer

"A2A or MCP?" is a badly framed question; the two describe different relationships. A2A's own positioning says so explicitly: **complementary**.

|  | MCP | A2A |
| --- | --- | --- |
| Who talks to whom | Agent ↔ tool | Agent ↔ agent |
| The other side is | A deterministic function (read a file, run a query) | A system that reasons on its own and has its own tools |
| Contract | Input schema → output | Capability description → task, with a state machine |
| Duration | Usually a single short call | Long-running: minutes, hours, human approvals in between |
| Visibility | The tool fully exposes what it does | The agent _does not_ expose its internal logic, prompts or tools |

> MCP is an agent reaching for something; A2A is an agent handing work to somebody else.

That last row is the important one. You could wrap an agent as an MCP tool — technically it's possible — but then you'd have no contract expressing that the other side may take a long time, report intermediate state, wait on human approval and make its own decisions. That's why A2A exists.

Governance has matured too: A2A reached **v1.0**, was started by Google and then donated to the **Linux Foundation**, and is now run by a Technical Steering Committee spanning AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP and ServiceNow. Licence is Apache-2.0.

## The Agent Card

Discovery is A2A's first problem: how does one agent learn what another _can do_? The answer is a machine-readable description published on the agent's own domain — the **Agent Card**.

```json
{
  "protocolVersion": "1.0",
  "name": "Expense Approval Agent",
  "description": "Evaluates and approves expense requests against company policy.",
  "url": "https://finance.example.com/a2a",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "Example Inc.",
    "url": "https://example.com"
  },
  "version": "2.3.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "defaultInputModes":  ["text/plain", "application/json"],
  "defaultOutputModes": ["application/json"],
  "securitySchemes": {
    "corporate-oidc": {
      "type": "openIdConnect",
      "openIdConnectUrl": "https://id.example.com/.well-known/openid-configuration"
    }
  },
  "security": [{ "corporate-oidc": [] }],
  "skills": [
    {
      "id": "expense-approval",
      "name": "Expense approval",
      "description": "Approves or rejects an expense request against policy.",
      "tags": ["finance", "approval"],
      "examples": [
        "$340 flight, New York to Boston, client visit",
        "3 nights hotel accommodation, $1,200"
      ]
    }
  ]
}
```

The most useful part of the card is `skills`. Note that a skill is not a rigid JSON schema like an MCP tool; it's a job described in _natural language_ plus a few examples. The reason is that the caller is also a language model. The calling agent reads this description and decides "does the work I'm holding fit this?" The examples are therefore functional, not decorative.

<div class="callout"><strong>Tip:</strong> Write the skill description to answer two questions: what it <em>does</em> and what it <em>doesn't</em>. The most common integration failure is a calling agent delegating out-of-scope work because it "roughly fits". A sentence like "handles requests under $5,000 only; above that goes to human approval" does work no schema field can do.</div>

## The task lifecycle

A2A's core object is the **task**. A task is an entity with an identity whose state changes over time — not a single request/response. This is long-running work written into the protocol.

```text
submitted ──> working ──┬──> completed      (done)
                        ├──> input-required (awaiting input)
                        ├──> failed         (error)
                        ├──> canceled       (cancelled)
                        └──> rejected       (not accepted)

      input-required ──> working   (once the client answers)
```

The `input-required` state is the distinguishing one. The remote agent can stop mid-task and say "this request sits at the policy boundary and needs a manager's sign-off". The calling agent surfaces that to its user, collects the answer, and passes it back into the same task. The task ID stays constant throughout, so both sides know where in the work they are.

Task output comes back in two forms: **messages** (conversational intermediate output) and **artifacts** (durable produced output — a report, a file, a structured result). For long-running work there's the `pushNotifications` capability: the client supplies a callback address and the agent notifies it on state changes. You don't have to hold a connection open for a task that takes hours.

## A delegation flow, end to end

In Python, from discovery to result. Read the card, pick a matching skill, submit the task, track its state.

```ts
import asyncio
import httpx

BASE = "https://finance.example.com"

# get_task / send_followup / ask_user follow the same pattern:
# tasks/get, message/send (with taskId), and your own UI respectively.

async def read_card(client: httpx.AsyncClient) -> dict:
    # The Agent Card is published at a well-known path.
    r = await client.get(f"{BASE}/.well-known/agent-card.json")
    r.raise_for_status()
    return r.json()

async def send_task(client, url, text, token) -> dict:
    r = await client.post(
        url,
        headers={"Authorization": f"Bearer {token}"},
        json={
            "jsonrpc": "2.0",
            "id": 1,
            "method": "message/send",
            "params": {
                "message": {
                    "role": "user",
                    "messageId": "msg-1",
                    "parts": [{"kind": "text", "text": text}],
                }
            },
        },
    )
    r.raise_for_status()
    return r.json()["result"]

async def delegate(request_text: str, token: str) -> dict:
    async with httpx.AsyncClient(timeout=30) as client:
        card = await read_card(client)

        # Skill selection: filter by tag, leave the rest to the model.
        matches = [s for s in card["skills"] if "approval" in s["tags"]]
        if not matches:
            raise RuntimeError("This agent offers no approval skill.")

        task = await send_task(client, card["url"], request_text, token)

        while task["status"]["state"] in ("submitted", "working"):
            await asyncio.sleep(2)
            task = await get_task(client, card["url"], task["id"], token)

        if task["status"]["state"] == "input-required":
            # Ask the user, then feed the answer back into the SAME task.
            answer = await ask_user(task["status"]["message"])
            task = await send_followup(
                client, card["url"], task["id"], answer, token
            )

        return task
```

Three things to watch in that loop. First, **the timeout belongs to the caller** — the remote agent has no contract about how long it will take, so the decision to give up is yours. Second, **prefer notifications over polling**; if `pushNotifications` is supported, replace the `while` loop with a callback endpoint. Third, don't conflate `rejected` with `failed`: the first means "I'm not taking this work" and retrying is pointless, while the second may be transient.

## Agentic commerce: the layer on top

Where A2A got concrete in 2026 is agents _buying_ from one another. Once task delegation is standardised, the next question is how payment happens, and two efforts are filling that gap.

-   **Agentic Commerce Protocol** — published jointly by OpenAI and Stripe, Apache-2.0, working over REST and MCP. It's live inside ChatGPT, making merchant catalogues and the order flow directly consumable by an agent.
-   **AP2 (Agent Payments Protocol)** — Google's approach, announced 16 September 2025. At its centre are _signed Mandates_: the spending authority a user grants their agent is cryptographically signed and verifiable along the chain. It launched with 60+ partners including Mastercard, PayPal, Amex, Adyen and Etsy.

Both are asking the same question: when an agent spends money on your behalf, who proves that the authority genuinely came from you, and how? AP2's signed-mandate answer is an attempt to solve the authentication layer of agentic commerce — because "my agent said so" means nothing in a payment dispute.

## Security: ASI07 and boundaries

OWASP's 2026 agentic risk list names **ASI07 — Insecure Inter-Agent Communication** as its own entry, and A2A opens precisely that surface. Three things to get right:

1.  **A remote agent is an untrusted content source.** The text it returns enters your agent's context. Treat it as _user input_ in your own system: don't call side-effecting tools with values derived from it.
2.  **Delegated authority compounds.** If agent A delegates to B and B delegates to C, what authority C is running under gets murky fast. Take the Agent Card's `securitySchemes` seriously and narrow the scope of the delegated token at every hop — never widen it.
3.  **The card itself must be verified.** An Agent Card is JSON published on a domain; if the channel fetching it isn't TLS-protected, or if the card arrives from a different domain at the end of a redirect, you don't know who you're talking to.

A practical rule: treat every agent you connect to over A2A as a third-party API sitting outside your system — because it is. Even within the same organisation. Architectures where inter-agent trust is high by default collapse at the first poisoned task result.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>MCP is the agent↔tool layer, A2A the agent↔agent layer; A2A positions itself as complementary to MCP, not competing with it.</li><li>A2A v1.0 sits under the Linux Foundation with a committee spanning AWS, Cisco, Google, IBM, Microsoft, Salesforce, SAP and ServiceNow; licence Apache-2.0.</li><li>Discovery runs through Agent Cards and work through tasks with a state machine; <code>input-required</code> puts long-running, human-approved flows into the protocol.</li><li>Agentic commerce is the layer above: ACP (OpenAI + Stripe) and AP2's signed Mandates both attack the same proof-of-authority problem.</li></ul></div>

<div class="faq"><details><summary>Do I have to rewrite my agent to use A2A?</summary><p>No. A2A imposes nothing on your agent's internal architecture — which model you use, how you reason, which tools you call are all outside the protocol's view. Two things need adding: a published Agent Card and an HTTP endpoint that speaks the task lifecycle. Putting an existing agent behind that endpoint is usually a few hundred lines of wrapper.</p></details><details><summary>Would one system use both MCP and A2A?</summary><p>That's exactly the typical setup. Your agent reaches its own tools over MCP — database, filesystem, search. Work it can't handle itself, owned by another team or company, it delegates over A2A. The two sit at different layers of the same call stack; you don't have to pick one and drop the other.</p></details><details><summary>If the remote agent gets it wrong, who is responsible?</summary><p>The protocol doesn't settle that, but it makes it visible. The task object's ID, its state transitions and the artifacts it returns leave an auditable trail — which request went to which agent when, and what came back. Apportioning liability is a contractual matter; your engineering job is to keep that trail complete and to grant delegated authority in the narrowest scope that works.</p></details></div>

---

In short: A2A supplies the missing common language for agents to find each other and hand off work — and it does so one layer above MCP rather than in place of it. For how the tool layer works see [the MCP introduction](/en/posts/model-context-protocol/); for the internal architecture of these agents see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/); and for how tools get described to a model see [function calling](/en/posts/function-calling-structured-output/).
