---
title: "MCP Apps: Interactive UI Inside the Conversation"
description: "The MCP Apps extension turns tool results into interactive UI. ui:// resources, the _meta.ui field, sandboxed iframes and the postMessage protocol, with real code."
publishDate: "2026-08-13T23:54:00+03:00"
lang: en
category: "Product"
tags: ["Product", "AI"]
translation: "mcp-apps-sohbet-icinde-arayuz"
heroImage:
  src: "../../../assets/blog/bimg-14.jpg"
  alt: "MCP Apps: Interactive UI Inside the Conversation"
---

The user says "show me my free slots next week" and the agent dumps fourteen lines of text. They want to pick one, but there's nothing to pick — they have to describe it in prose. MCP Apps closes exactly that gap: a tool can return its result as a working interface rendered inside the conversation instead of as flat text. This article walks the mechanism end to end, with real code.

## Where text stops working

A chat interface is not the right interface for everything. The model being good at producing text doesn't mean the user should express everything in text. Three kinds of interaction are structurally bad in prose:

-   **Selection:** pointing at one of fourteen options. In text the user says "the third one", the model miscounts, and a turn is wasted.
-   **Adjustment:** setting a range, a threshold, a colour. "A bit darker" is no substitute for a slider.
-   **Dense data:** a table, a calendar, a map. Serialised into prose it burns tokens and reads badly.

> Text is a good output format; it doesn't have to be a good input format.

MCP Apps solves this as an official _extension_ to MCP (spec dated `2026-01-26`). It doesn't touch the core protocol; it adds the ability to attach an interface to a tool result on top of the existing tool machinery. Today it's supported by Claude and Claude Desktop, VS Code GitHub Copilot, Microsoft 365 Copilot, Goose, Postman, MCPJam and Archestra.AI.

## ui:// resources and the \_meta.ui link

The mechanism has two parts, both built from MCP primitives that already existed.

The first is **a resource published under the `ui://` scheme**. Just as your server publishes a file or a database record, it publishes an HTML document. That document is the interface.

The second is **the tool's `_meta.ui` field**. The tool definition declares, via `_meta.ui.resourceUri`, which `ui://` resource should render its result. That declaration lives in the tool _definition_, not in the result — and this detail matters: the client knows which interface will be needed before the tool has even been called, so it can **preload** it. By the time the tool result arrives the iframe is ready, and the user never watches a white box load.

```json
{
  "name": "free_slots",
  "description": "Return available time slots in a date range.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": { "type": "string", "format": "date" },
      "end":   { "type": "string", "format": "date" }
    },
    "required": ["start", "end"]
  },
  "_meta": {
    "ui": {
      "resourceUri": "ui://calendar/slot-picker",
      "permissions": [],
      "csp": {
        "connect-src": [],
        "img-src": ["https://cdn.internal.local"]
      }
    }
  }
}
```

`permissions` declares whether the interface may reach sensitive browser capabilities such as microphone or camera; `csp` declares which external origins it may talk to. Both default to the most restrictive setting — unless you ask, your interface can reach nothing.

## Server side: wiring a tool to a UI

A minimal server with the Python SDK. We publish two things: the `ui://` resource and the tool bound to it.

```text
from mcp.server.fastmcp import FastMCP
from datetime import date, timedelta

mcp = FastMCP("calendar")

SLOT_PICKER_HTML = """<!doctype html>
<meta charset="utf-8">
<style>
  body { font: 14px system-ui; margin: 0; padding: 12px; }
  button { display:block; width:100%; margin:4px 0; padding:8px; }
</style>
<div id="list">Loading…</div>
<script type="module" src="ui://calendar/slot-picker.js"></script>
"""

@mcp.resource("ui://calendar/slot-picker", mime_type="text/html")
def slot_picker_ui() -> str:
    return SLOT_PICKER_HTML

@mcp.tool(
    annotations={
        "_meta": {"ui": {"resourceUri": "ui://calendar/slot-picker"}}
    }
)
def free_slots(start: str, end: str) -> dict:
    """Return available time slots in a date range."""
    day = date.fromisoformat(start)
    last = date.fromisoformat(end)
    slots = []
    while day <= last:
        if day.weekday() < 5:                     # weekdays only
            for hour in (10, 14, 16):
                slots.append(f"{day.isoformat()}T{hour:02d}:00")
        day += timedelta(days=1)
    return {"slots": slots}
```

Note that the tool **still returns structured data**. Adding a UI is not converting the tool's result into HTML. The model keeps seeing the data form — because even if the user never touches the interface, the model still needs to be able to say "there are three free slots". The interface is a layer on top of the data, not a replacement for it.

<div class="callout"><strong>Tip:</strong> Write the tool result for two audiences at once: enough for the model, enough for the UI. Keep the model-facing part short (three slots, not three hundred) and send the full list the interface needs in a separate field. Otherwise the price of a rich interface is an enormous JSON blob read into context on every turn.</div>

## Client side: the postMessage protocol

The interface runs inside a sandboxed iframe and cannot reach the parent page. Its only channel to the host is `postMessage`, and the language spoken over it is a JSON-RPC dialect like MCP itself. Method names split into two groups: UI-specific ones carry a `ui/` prefix (such as `ui/initialize`), while shared ones like calling a tool use MCP's familiar names (`tools/call`).

A minimal client on the interface side:

```ts
// ui://calendar/slot-picker.js
let nextId = 1;
const pending = new Map();

function call(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    window.parent.postMessage(
      { jsonrpc: "2.0", id, method, params },
      "*"                       // pin the host origin in production
    );
  });
}

window.addEventListener("message", (ev) => {
  const msg = ev.data;
  if (!msg || msg.jsonrpc !== "2.0") return;

  // A response?
  if (msg.id !== undefined && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(msg.error) : resolve(msg.result);
  }
});

// 1) Handshake — the host hands over the tool result here.
const init = await call("ui/initialize", {
  capabilities: { tools: {} }
});

// 2) Render the data.
const list = document.getElementById("list");
list.textContent = "";
for (const slot of init.toolResult.slots) {
  const b = document.createElement("button");
  b.textContent = new Date(slot).toLocaleString();
  b.onclick = async () => {
    // 3) User picked one — call another tool on the same server.
    await call("tools/call", {
      name: "book_appointment",
      arguments: { slot }
    });
    list.textContent = "Appointment booked.";
  };
  list.appendChild(b);
}
```

What that flow means: when the user clicks a button, that isn't a message written to the model — it's a direct tool call. No model turn is waited on, nothing is misread, no tokens are spent. It is also dangerous, which is why the next section exists.

## Sandboxed iframes and the permission model

The iframe running the interface is sandboxed: it cannot reach the parent document's DOM, cookies or storage. That's the minimum condition for HTML sent by a server not to be able to hijack the host application. It is not a _sufficient_ condition, because the interface still holds one capability: `tools/call`.

So set three rules up front when designing an MCP App:

1.  **Partition the tools callable from the UI.** Tools triggered by user interaction should sit in a different set from the ones the agent calls on its own. "Book appointment" is fine from the interface; "delete all appointments" is not.
2.  **Verify the origin.** In the example above the `postMessage` target is `"*"`, which is wrong in production. Learn the host's origin from the `ui/initialize` response, target it on every subsequent message, and check `ev.origin` on incoming ones.
3.  **Don't just request permissions, justify them.** If you ask for microphone in `permissions`, explain in the interface itself why the user would grant it. Clients are expected to prompt the user; unexplained requests get declined.

There's also an easily missed threat model: the interface HTML comes from the server, and the server may be untrusted. When you install a third-party MCP server, you also allow it to render an interface inside your conversation. The sandbox makes that harmless, but it doesn't make it _unconvincing_ — an interface drawing a fake login form is still a fake login form inside an iframe. Apply the same scrutiny to the server's provenance as you do to its tool permissions.

## When to render UI, when to return text

Attaching a UI to every tool is tempting and wrong. The distinction that works:

1.  **If the user must select or adjust something → UI.** Selection and adjustment done in prose inflate the turn count and the misunderstanding rate.
2.  **If the result is dense and structural → UI.** Calendars, tables, maps, charts. Serialising these is both expensive and lossy.
3.  **If the result is an answer → text.** "The invoice total is $412" needs no interface. Adding one only adds latency.
4.  **If the result feeds the model's reasoning → text as well, always.** UI for the user, data for the model. A tool that returns only an interface leaves the model blind and unable to reason about what it just showed.

That last point is the important one from a product perspective. The appeal of MCP Apps looks like "turning the conversation into an app", but that isn't the real win. The real win is being able to slip an interaction in without interrupting the conversation — the user makes their choice, the chat picks up where it left off, and the model keeps seeing the whole flow.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>MCP Apps is an official extension (<code>2026-01-26</code>); it doesn't change the core protocol, it attaches UI to tool results.</li><li><code>_meta.ui.resourceUri</code> in the tool definition points at a <code>ui://</code> resource, which the host preloads before the tool is called.</li><li>The interface runs in a sandboxed iframe and speaks JSON-RPC to the host over <code>postMessage</code>: <code>ui/</code>-prefixed methods such as <code>ui/initialize</code>, plus <code>tools/call</code>.</li><li>Write the tool result for both the model and the UI; returning only an interface blinds the model on subsequent turns.</li></ul></div>

<div class="faq"><details><summary>How is an MCP App different from a regular web app?</summary><p>Lifecycle and context. An MCP Apps interface doesn't exist on its own; it is born as the result of a tool call, starts with that call's data, and lives inside the conversation. It also has no authentication, routing or state management of its own — all of that already lives in the MCP server and the host application. The right mental model isn't "a mini-app embedded in chat" but "an interactive rendering of a tool result".</p></details><details><summary>Can the interface act without the model knowing?</summary><p>Yes — <code>tools/call</code> from the interface doesn't wait for a model turn. That's a feature, but it makes permission design mandatory. Keep UI-callable tools in a separate set, keep side-effecting and irreversible operations out of that set, and lean on the host application's approval flow.</p></details><details><summary>What happens on a client that doesn't support it?</summary><p>The tool keeps working normally. A client that doesn't recognise <code>_meta.ui</code> ignores it and renders the structured result as text. That's why your tool must return a meaningful data result under all conditions: the interface is an enhancement layer, not a prerequisite for the tool to function.</p></details></div>

---

In short: MCP Apps drops a small interface into exactly the place where chat is weakest — the moment of selecting and adjusting — and lets the conversation carry on unbroken. For the product side of these decisions see [AI product UX](/en/posts/ai-product-ux/); for the protocol fundamentals see [the MCP introduction](/en/posts/model-context-protocol/); and for how tools are described to the model in the first place see [function calling](/en/posts/function-calling-structured-output/).
