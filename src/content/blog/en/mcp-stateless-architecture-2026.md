---
title: "MCP 2026: Why the Protocol Went Stateless, and What Your Server Must Change"
description: "The 2026-07-28 MCP revision removed sessions, the Mcp-Session-Id header and the initialize handshake. MRTR, server/discover and a concrete migration plan."
publishDate: "2026-08-13T23:36:00+03:00"
lang: en
category: "Tools"
tags: ["Tools", "AI"]
translation: "mcp-durumsuz-mimari-2026"
heroImage:
  src: "../../../assets/blog/bimg-12.jpg"
  alt: "MCP 2026: Why the Protocol Went Stateless, and What Your Server Must Change"
---

You put your MCP server behind a load balancer, requests scattered across nodes, and everything broke. So you enabled sticky sessions, then moved session state into Redis, then discovered that when a node dies the session dies with it. The 28 July 2026 revision removed the problem at its root: the protocol itself is now stateless. This article walks through exactly what changed, which field names replaced which, and the order in which your server should be migrated.

## The change in one sentence

The previous MCP revision was `2025-11-25`. The `2026-07-28` revision is the largest change since the protocol launched, and it fits in a sentence:

> MCP is now a stateless protocol — your server is not required to remember anything between two requests.

Concretely: protocol-level sessions and the `Mcp-Session-Id` header are gone from the Streamable HTTP transport; the `initialize` / `notifications/initialized` handshake has been removed; and `tools/list`, `resources/list` and `prompts/list` no longer vary per connection. Your server scales horizontally behind a plain round-robin load balancer with no sticky routing.

The mapping table is the thing you will actually use during migration:

| 2025-11-25 | 2026-07-28 |
| --- | --- |
| `Mcp-Session-Id` header | Removed — servers mint explicit handles passed as ordinary tool arguments |
| `initialize` + `notifications/initialized` | Removed — every request carries version and capabilities in `_meta` |
| Capability discovery inside the handshake | `server/discover` RPC (servers _MUST_ implement it) |
| Server-initiated requests (`sampling/createMessage`, `roots/list`, `elicitation/create`) | MRTR — interim `resultType: "input_required"` results |
| HTTP GET stream + `resources/subscribe` | A single `subscriptions/listen` stream |
| SSE resumability (`Last-Event-ID`) | Removed — a broken stream loses the request; re-issue with a new request ID |

## Why sessions were removed

In a session-based protocol the server holds per-client context in memory. That is elegant in a single-process dev server and causes three concrete problems in production. First, **sticky routing**: the load balancer has to pin a client to a node, which fights autoscaling and blue-green deploys. Second, **durability**: restart a node and the session evaporates, forcing a fresh handshake. Third, **cacheability**: if list endpoints vary per connection, no intermediary can cache them.

State did not disappear in the new design — it moved out of the protocol and into your application. A server that genuinely needs cross-call state now mints an explicit handle and passes it back and forth as an ordinary tool argument. You design the state, you scope it, and you choose where it lives.

<div class="callout"><strong>Tip:</strong> The handle must be minted by the server, never accepted as free text from the client. A server that treats a client-supplied string as a handle has an open door to cross-tenant data leakage. Sign the handle, or bind it server-side to an authenticated identity.</div>

## server/discover and \_meta: the new handshake

Removing the handshake did not remove version negotiation. Every request now carries its own version and capabilities inside `_meta`. The keys are long and namespaced — copy them carefully:

```text
POST /mcp HTTP/1.1
Content-Type: application/json
Mcp-Method: tools/call
Mcp-Name: search_contracts

{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "search_contracts",
    "arguments": { "query": "termination notice" },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {},
      "io.modelcontextprotocol/clientInfo": { "name": "example-client", "version": "3.1.0" }
    }
  }
}
```

The `Mcp-Method` and `Mcp-Name` headers are now required on Streamable HTTP POST requests. Anyone who has written a gateway will see the point immediately: an edge layer can route, rate-limit and meter without parsing a single byte of JSON body.

A client that wants to pick a version up front calls `server/discover` — and servers **must** implement it:

```text
--> {"jsonrpc":"2.0","id":1,"method":"server/discover"}

<-- {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "protocolVersions": ["2026-07-28", "2025-11-25"],
    "capabilities": { "tools": {}, "resources": {} },
    "_meta": {
      "io.modelcontextprotocol/serverInfo": { "name": "legal-search-mcp", "version": "1.4.0" }
    }
  }
}
```

A version mismatch is no longer silently tolerated: the server returns `UnsupportedProtocolVersionError`. Error codes were also renumbered under a new allocation policy — `-32000`…`-32019` stays implementation-defined, `-32020`…`-32099` is reserved for the specification. The codes introduced in this draft moved accordingly: `HeaderMismatch` to `-32020`, `MissingRequiredClientCapability` to `-32021`, `UnsupportedProtocolVersion` to `-32022`. Resource-not-found also moved from `-32002` to `-32602` to align with JSON-RPC.

## MRTR: servers can no longer call clients

Under the old model a server could interrupt itself and send a request to the client: "generate a completion for me" (`sampling/createMessage`), "which directories can I see" (`roots/list`), "ask the user this" (`elicitation/create`). All three are gone. The replacement pattern is **MRTR — Multi Round-Trip Requests**.

It works much like HTTP's `401`\-and-retry flow. If the server cannot finish, it returns an _interim_ result; the client gathers the missing information and re-sends _the same request_ carrying it:

```text
# Round 1 — the server needs a user confirmation
<-- {
  "result": {
    "resultType": "input_required",
    "inputRequests": [{
      "id": "confirm-1",
      "method": "elicitation/create",
      "params": { "message": "Archive this contract permanently?" }
    }],
    "requestState": "arch-9f21"
  }
}

# Round 2 — the client re-sends the SAME request with inputResponses
--> {
  "method": "tools/call",
  "params": {
    "name": "archive_contract",
    "arguments": { "id": "SZL-4412" },
    "inputResponses": [{ "id": "confirm-1", "result": { "action": "accept" } }],
    "requestState": "arch-9f21"
  }
}
```

The load-bearing detail here is `requestState`. Because the server is stateless, whatever it needs to remember between the two rounds it encodes into that field itself, and the client carries it back. The second detail: **every result** now carries a required `resultType` field — `"complete"` for ordinary results, `"input_required"` for interim ones. Results from earlier-protocol servers that omit the field must be treated as `"complete"`.

## Removals, deprecations and the 12-month window

This revision also adopted a formal feature lifecycle policy — Active, Deprecated and Removed states with a minimum **twelve-month** deprecation window. The following still work today, but nothing new should adopt them:

-   **Roots, Sampling and Logging** are deprecated, with explicit suggested migrations: pass directories and files as tool parameters, resource URIs or server configuration instead of Roots; integrate directly with an LLM provider API instead of Sampling; log to `stderr` on stdio, or use OpenTelemetry, instead of Logging.
-   **The HTTP+SSE transport** — already superseded since `2025-03-26` — is now formally Deprecated under the lifecycle policy. Move to Streamable HTTP.
-   **OAuth 2.0 Dynamic Client Registration (RFC 7591)** is deprecated in favour of _Client ID Metadata Documents_. DCR remains only for backwards compatibility with authorization servers that do not support CIMD.

Outright removals are a separate list: `ping`, `logging/setLevel`, `notifications/roots/list_changed`, SSE stream resumability with `Last-Event-ID` redelivery, and the `notifications/elicitation/complete` notification introduced in `2025-11-25`. Log level is now set per request via `io.modelcontextprotocol/logLevel` in `_meta`, and servers must not emit `notifications/message` for requests that did not include it.

And one relocation: experimental tasks moved out of the core protocol into the `io.modelcontextprotocol/tasks` extension. The blocking `tasks/result` method was replaced by polling via `tasks/get`, client-to-server input arrives through `tasks/update`, and `tasks/list` was removed.

## A migration order for your server

Do these in order; each step depends on the one before it.

1.  **Turn session memory into handles.** If your server has anything shaped like `sessions[session_id]`, move each field either onto the request or behind a server-minted handle.
2.  **Implement `server/discover`.** It is mandatory. Publish your supported version list and capabilities there.
3.  **Read `_meta`, write `_meta`.** Validate the incoming protocol version, return `UnsupportedProtocolVersionError` on mismatch, and attach `io.modelcontextprotocol/serverInfo` to every result.
4.  **Add `resultType` to every result.** Forgetting this field is the single most common migration bug.
5.  **Convert server-initiated calls to MRTR.** Rewrite confirmation and user-question flows around `input_required` plus `requestState`.
6.  **Add `ttlMs` and `cacheScope` to list results.** Use `"private"` for per-user tool lists and `"public"` for lists identical to everyone. Also return `tools/list` in a _deterministic_ order: a stable order is what lets the client's prompt cache hit.
7.  **Delete the reconnection assumption.** If a stream breaks the request is lost and the client re-issues it with a new request ID — so write your tools to be _idempotent_.

The quiet reward for statelessness is this: once those seven steps are done your server behaves like any other HTTP service, and health checks, autoscaling, caching and gateway metering all come for free.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>The <code>2026-07-28</code> revision removed sessions, the <code>Mcp-Session-Id</code> header and the <code>initialize</code> handshake; state moved from the protocol into your application.</li><li>Version and capabilities now travel in <code>_meta</code> on every request, and implementing <code>server/discover</code> is mandatory.</li><li>Servers cannot call clients any more: confirmation and input flows run through MRTR using <code>resultType: "input_required"</code> and <code>requestState</code>.</li><li>Roots, Sampling, Logging and OAuth DCR are deprecated under a minimum 12-month window; SSE resumability was removed outright.</li></ul></div>

<div class="faq"><details><summary>What happens if my MCP server stays on the old revision?</summary><p>Nothing breaks immediately. <code>server/discover</code> doubles as a backwards-compatibility probe, and clients must treat results without a <code>resultType</code> field as <code>"complete"</code>. But the deprecation window is defined as a minimum of twelve months — that is a schedule, not a permanent guarantee.</p></details><details><summary>How do I run a multi-step operation without sessions?</summary><p>Two paths. For short flows, MRTR: the server returns <code>input_required</code>, encodes whatever it must remember into <code>requestState</code>, and the client re-sends the same request. For long-running work, the <code>io.modelcontextprotocol/tasks</code> extension: the server returns a task handle, the client polls <code>tasks/get</code> and supplies interim input via <code>tasks/update</code>.</p></details><details><summary>Should I use Streamable HTTP or stdio?</summary><p>If the server runs locally for a single user, stdio is simplest. If it serves multiple clients over a network, use Streamable HTTP — that is where the entire scaling benefit of statelessness lives. The HTTP+SSE transport is now Deprecated and should not be chosen for a new project.</p></details></div>

---

In short, MCP stopped being a session protocol and became an ordinary request-response protocol, which makes running your server in production markedly easier. If you want the fundamentals first, the [introduction to MCP](/en/posts/model-context-protocol/) is still a valid starting point; how tools are described to a model is covered in [function calling](/en/posts/function-calling-structured-output/), and the loop that actually calls those tools is covered in [autonomous agent architectures](/en/posts/autonomous-agent-architectures/).
