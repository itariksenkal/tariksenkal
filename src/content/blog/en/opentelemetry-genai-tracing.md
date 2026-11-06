---
title: "OpenTelemetry GenAI: Tracing Agents on a Standard Schema"
description: "The gen_ai.* conventions are still unstable, and they are still the only standard for agent tracing. The span tree, operation names, MCP propagation, and version pinning."
publishDate: "2026-08-13T23:49:00+03:00"
lang: en
category: "Observability"
tags: ["Observability", "AI"]
translation: "opentelemetry-genai-izleme"
heroImage:
  src: "../../../assets/blog/covers/opentelemetry-genai-tracing.jpg"
  alt: "OpenTelemetry GenAI: Tracing Agents on a Standard Schema"
---

When an agent call goes wrong, being able to answer "what happened at which step" depends less on which tracing tool you bought than on the schema you wrote the traces with. If the schema is bespoke, changing tools means rewriting everything. In 2026 there is a standard for this — and its most important property is that it is not stable yet, and that the correct engineering posture is to adopt it anyway, deliberately.

## Why not invent your own schema

Most teams start LLM tracing with their own JSON logs: model name, token counts, duration. That works for three months. Then you add an agent and need nested steps; then you buy an observability product and have to bend your schema to it; then a second system in the team uses different field names and the two cannot be compared.

> The tracing schema is the most expensive decision to change later, because you cannot backfill history.

OpenTelemetry's GenAI semantic conventions solve exactly this: they standardise field names and span structure, so the code that writes traces and the tool that displays them become independent.

## Not stable — and what that means

This is the practical headline. Every `gen_ai.*` attribute, span, metric and event still carries a **Development** badge; none is Stable. The conventions also moved house: as of **v1.42.0 (12 June 2026)** they left the main `semantic-conventions` repository for a dedicated `open-telemetry/semantic-conventions-genai` repository covering GenAI clients, **MCP**, and provider-specific conventions.

The correct posture is: **adopt now, pin the version.** Inventing your own schema is worse; but adopting without pinning means your dashboards silently empty on some upgrade.

<div class="callout"><strong>Tip:</strong> Record the convention version you are on as a resource attribute where possible, and put it in your deployment notes. When a field name changes, knowing which date the new schema starts from is what rescues your queries.</div>

## The span tree: what an agent run looks like

The conventions' most valuable contribution is modelling an agent run as a **span tree** rather than a single call. The central attribute is `gen_ai.operation.name`, and its values map directly onto the vocabulary of agent architecture: `create_agent`, `invoke_agent`, `invoke_workflow`, `execute_tool`, `retrieval`, `plan` and memory operations.

```text
invoke_agent  support-agent                     12.4s
├─ plan                                          1.9s
├─ retrieval  contract-index                     0.6s   (8 chunks)
├─ execute_tool  get_customer                    0.3s
├─ chat  claude-sonnet-4-5                       3.1s   (in 8.2k / out 412)
├─ execute_tool  create_invoice                  0.9s   ERROR timeout
├─ execute_tool  create_invoice  (retry)         1.1s
└─ chat  claude-sonnet-4-5                       3.4s   (in 9.9k / out 260)
```

That tree answers questions flat logs cannot: where latency accumulated, which tool was retried, where the tokens went, and why two runs of the same task behaved differently.

## Working instrumentation

Without a library, manual instrumentation looks like this — the real task is getting the attribute names right:

```python
from opentelemetry import trace

tracer = trace.get_tracer("app.agent")

def run_agent(task, toolbox):
    with tracer.start_as_current_span("invoke_agent support-agent") as agent_span:
        agent_span.set_attribute("gen_ai.operation.name", "invoke_agent")
        agent_span.set_attribute("gen_ai.agent.name", "support-agent")
        agent_span.set_attribute("gen_ai.conversation.id", task.session_id)

        for step in task.steps():
            if step.kind == "model":
                with tracer.start_as_current_span("chat") as s:
                    s.set_attribute("gen_ai.operation.name", "chat")
                    s.set_attribute("gen_ai.provider.name", "anthropic")
                    s.set_attribute("gen_ai.request.model", step.model)
                    resp = step.run()
                    s.set_attribute("gen_ai.usage.input_tokens",  resp.input_tokens)
                    s.set_attribute("gen_ai.usage.output_tokens", resp.output_tokens)
                    s.set_attribute("gen_ai.response.finish_reasons",
                                    [resp.finish_reason])

            elif step.kind == "tool":
                with tracer.start_as_current_span("execute_tool") as s:
                    s.set_attribute("gen_ai.operation.name", "execute_tool")
                    s.set_attribute("gen_ai.tool.name", step.tool)
                    try:
                        step.run()
                    except Exception as e:
                        s.set_status(trace.StatusCode.ERROR, str(e))
                        s.record_exception(e)
                        raise
```

The discipline here: _every_ model call and _every_ tool call gets its own span, and both sit under the same parent. Recording an agent run as a single span is the most common and most expensive instrumentation mistake.

## Trace context propagation through MCP

The quiet but significant 2026 development is that the two standards converged. MCP's `2026-07-28` revision documents OpenTelemetry trace-context propagation through `_meta` keys — `traceparent`, `tracestate` and `baggage`.

The practical payoff is large: an agent run in your client and a tool execution on an MCP server running elsewhere can appear in **the same trace tree**. Correlating server-side slowness with client-side latency was not possible without that link.

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_invoice",
    "arguments": { "customer": "…" },
    "_meta": {
      "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
      "io.modelcontextprotocol/protocolVersion": "2026-07-28"
    }
  }
}
```

If you write an MCP server, read the incoming `traceparent` and parent your spans to it; if you write a client, write the current context into every tool call. Two lines of work that later answer the hardest debugging question you will have.

## What to record and what not to

The one large decision here is whether to record prompt and response content. Without content, debugging is hard; with content, your tracing system becomes a personal-data store.

-   **Do not record content by default.** Record length, token counts, schema validation results and hashes instead.
-   **Sample.** Capture content on all error cases and on a small fraction (say 1%) of successful calls.
-   **Mask.** Strip personal data before the tracing layer, not inside it.
-   **Set retention.** Keep content-bearing traces briefly and metric-only traces for a long time.

Finally, do not neglect metrics: token usage, tool error rate, step count and cost per task are derivable from traces but should also be emitted as metrics. Traces get sampled; metrics do not.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Do not invent your own tracing schema — it is the most expensive decision to reverse.</li><li>All <code>gen_ai.*</code> conventions are still Development and moved to a dedicated repository at v1.42.0 — adopt, but pin the version.</li><li>Record an agent run as a tree of <code>chat</code> and <code>execute_tool</code> spans under <code>invoke_agent</code>, never as one span.</li><li>MCP now carries <code>traceparent</code> in <code>_meta</code>; join client and server traces into a single tree.</li></ul></div>

<div class="faq"><details><summary>What are the OpenTelemetry GenAI conventions?</summary><p>A standard defining which attribute names and span structure LLM and agent calls are recorded with. <code>gen_ai.operation.name</code> sits at the centre and models an agent run as a tree of spans such as <code>invoke_agent</code>, <code>execute_tool</code>, <code>retrieval</code> and <code>plan</code>.</p></details><details><summary>Should I use them while they are unstable?</summary><p>Yes, with the version pinned. The alternative is inventing your own schema and rewriting everything when you adopt an observability product. Record which convention version you are on and treat upgrading as a deliberate change.</p></details><details><summary>Should prompt content go into traces?</summary><p>Not by default. Length, token counts, schema results and hashes answer most debugging questions. Capture content only on errors and on a small sample of successful calls, with personal data masked and a shorter retention period.</p></details></div>

---

A standard schema is what makes your tracing tool replaceable — that is the real win. For the general framing see [LLM observability](/en/posts/llm-observability/), for turning trace data into scores see [agent evaluation](/en/posts/agent-evaluation/), and for the deployment discipline this layer sits inside see [MLOps and taking AI to production](/en/posts/mlops-ai-to-production/).
