---
title: "MCP (Model Context Protocol): A Common Language for AI Tooling"
description: "MCP gives models a standard interface to tools and data sources. The client-server model, the N-times-M problem, security boundaries and practical use."
publishDate: "2026-08-09T23:30:00+03:00"
lang: en
category: "Tooling"
tags: ["Tooling", "AI"]
translation: "mcp-model-baglam-protokolu"
heroImage:
  src: "../../../assets/blog/bimg-16.jpg"
  alt: "MCP (Model Context Protocol): A Common Language for AI Tooling"
---

Every time you want to connect a model to your own data, you do the same work: you write a connector. Decide to use a different model, and you write it again. The **Model Context Protocol** is a shared interface aimed at removing that repetition.

<div class="callout"><strong>Update:</strong> The <code>2026-07-28</code> revision removed sessions, the <code>Mcp-Session-Id</code> header and the <code>initialize</code> handshake. The concepts on this page still hold; for the transport-layer changes read <a href="/en/posts/mcp-stateless-architecture-2026/">MCP 2026: why the protocol went stateless</a>.</div>

## The problem it solves

This is the N-times-M problem: with N models and M data sources, the number of connectors you need is their product. Every new tool must be wired to every model separately. A shared protocol turns that product into a sum: each source is written once as a server, and each model becomes a client once.

## How it works

The architecture rests on a client-server split. An **MCP server** exposes a specific capability — a filesystem, a database, an API. The application hosting the model acts as a **client**, connects to that server, discovers which capabilities exist, and invokes them when needed.

Discoverability is the key point: the client learns at runtime which tools a server offers and which parameters they expect. Adding a new capability therefore does not require changing client code.

<div class="callout"><strong>An analogy:</strong> using one connection standard instead of carrying a separate cable for every device. Both the device and the cable can change; the interface stays fixed.</div>

## What it exposes

-   **Tools:** actions the model can invoke — run a query, read a file, create a record.
-   **Resources:** data the model can read — documents, schemas, configuration.
-   **Prompts:** reusable, prepared instructions.

## Security boundaries

Giving a model tools means giving it authority. Three rules matter most in practice: servers should run with the narrowest permission that actually works, irreversible actions should require approval, and tool output must never be treated as trusted instruction.

That last point matters: a document arriving from outside can carry text that looks like an instruction to the model. This is precisely the surface for an [indirect prompt injection](/en/posts/prompt-injection-jailbreaks/) attack.

## When to use it

| Situation | MCP |
| --- | --- |
| One model, one tool | An extra layer |
| Several sources, one application | Brings order |
| Sharing tools with other teams | The real payoff |
| Possibility of switching models | Reduces lock-in |

## Frequently asked questions

<div class="faq"><details><summary>How does it differ from function calling?</summary><p>Function calling is how a model <em>requests</em> a tool. MCP is how that tool is <em>defined and served</em>. They complement rather than replace each other.</p></details><details><summary>Is there a performance cost?</summary><p>It adds a network hop. Negligible in most scenarios, though direct integration is faster for very high-frequency calls.</p></details><details><summary>How many tools should I define?</summary><p>Few. Dozens of tool definitions fill the context window and make selection harder for the model. Expose only the tools that task needs.</p></details></div>

---

MCP is a practical standard that removes repeated integration work from the agent ecosystem. For more, see [function calling](/en/posts/function-calling-structured-output/) and [autonomous agent architectures](/en/posts/autonomous-agent-architectures/).
