---
title: "Compaction or Reset? Managing Context in Long Agent Sessions"
description: "What to do when the context window fills up: context editing, the clear_tool_uses strategy, server-side compaction and full context resets — with a decision rule."
publishDate: "2026-08-13T23:56:00+03:00"
lang: en
category: "Architecture"
tags: ["Architecture", "AI"]
translation: "baglam-sikistirma-ve-sifirlama"
heroImage:
  src: "../../../assets/blog/covers/context-compaction-and-reset.jpg"
  alt: "Compaction or Reset? Managing Context in Long Agent Sessions"
---

Your agent is forty tool calls deep, the context window is 80% full, and every turn costs more than the last. You have three options: delete old tool results, summarise the conversation, or close the session and start fresh. These are not the same operation, and picking the wrong one costs you accuracy, not just money. This article separates all three at the API level and gives you a rule for choosing between them.

## Three operations, three different losses

All three get described as "managing context", but they sit in different places technically. Let's separate them:

| Operation | What it does | What it loses |
| --- | --- | --- |
| **Context editing** | _Deletes_ old tool-call results from the history; remaining messages are untouched | The content of the cleared tool outputs — the model can no longer see them |
| **Compaction** | Has the model _summarise_ the conversation and installs the summary as the new history | Detail and precision; the summary is one model's interpretation |
| **Context reset** | Ends the session; the next one starts from a handoff note _you_ wrote | Everything implicit — nothing the agent "kept in mind" but never wrote down survives |

> Editing makes room, compaction tries to preserve meaning, and a reset gives the agent a clean mind.

Their _cost_ profiles differ too. Editing is nearly free: you simply pay for a shorter prompt. Compaction is an extra inference — you read the whole history in as input one more time. A reset is the cheapest of the three, because you (or a short dedicated task) write the note, but it is also the one that demands the most discipline.

## Context editing: pruning tool results

This is no longer a pattern you hand-roll. In the Claude API it's a named primitive: a `context_management` field carrying **strategies**. The most-used one is `clear_tool_uses_20250919`, which clears the oldest tool results once the context crosses a threshold.

```text
import anthropic

client = anthropic.Anthropic()

resp = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    betas=["context-management-2025-06-27"],
    tools=[{
        "name": "read_file",
        "description": "Read a file from disk.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
    }],
    context_management={
        "edits": [{
            "type": "clear_tool_uses_20250919",
            "trigger": {"type": "input_tokens", "value": 60000},
            "keep": {"type": "tool_uses", "value": 5},
            "clear_at_least": {"type": "input_tokens", "value": 10000},
            "exclude_tools": ["read_file"],
            "clear_tool_inputs": False,
        }]
    },
    messages=[{"role": "user", "content": "Scan the repo and fix the tests."}],
)

print(resp.usage.input_tokens)
```

What the fields mean, with their defaults:

-   **`trigger`:** The threshold at which clearing kicks in. Defaults to `100000` input tokens. Below it, nothing is cleared.
-   **`keep`:** How many of the most recent tool calls survive. Defaults to **3** tool uses.
-   **`clear_at_least`:** If clearing happens, it must free at least this many tokens; otherwise skip it. Repeated tiny clears invalidate your prompt cache for nothing — this field exists precisely to stop that.
-   **`exclude_tools`:** Tools whose results are never cleared. Put the file read the agent will still be referring to two steps later in here.
-   **`clear_tool_inputs`:** Defaults to `false`, meaning the tool call's _parameters_ stay and only its _result_ is removed. That's a good default: the model remembers what it tried, it just no longer sees the full output.

Don't guess what happened — the response reports it:

```python
edits = resp.context_management.applied_edits
for e in edits:
    print(e.type, e.cleared_tool_uses, e.cleared_input_tokens)
# clear_tool_uses_20250919 12 41883
```

<div class="callout"><strong>Tip:</strong> Choose <code>trigger</code> against your <em>prompt-cache</em> behaviour, not against the window limit. Every clear invalidates the cached prefix from the deletion point onward. A low threshold with frequent clears can cost more in cache misses than it saves in tokens.</div>

## Compaction: summarising to continue

Editing deletes; compaction summarises. They are separate features and not substitutes. Compaction reads the history back to the model and replaces it with a short narrative, so "what we did" survives stripped of detail. This was the hand-rolled pattern for years; it now also exists as a server-side primitive (`compact_20260112`).

If you write your own loop, the critical decision is what the summarisation prompt asks for. A bad summary says "the user reported a bug, the agent inspected some files"; a good one carries _actionable_ information:

```text
COMPACT_PROMPT = """Summarise the agent session below so that a fresh agent
can pick up exactly where it left off.
Fill in these four headings and write nothing else:

1. GOAL — what the user asked for (one sentence, do not reword).
2. WORK DONE — which files changed, which commands ran, what they
   returned. Reproduce file paths and commands verbatim.
3. VERIFIED FACTS — things that were checked and confirmed
   (version numbers, schema fields, error messages). No guesses.
4. OPEN QUESTIONS — what is still unresolved and gates the next step.

Shorten prose freely, but never paraphrase an exact string:
file paths, commands and error text are copied, not summarised."""
```

That last line matters. The classic compaction failure is discarding the _literal strings_ the agent needs next — a file path, a table name, an error message — as "unnecessary detail". The agent then re-runs a search for the same file and spends back everything compaction saved.

Compaction also has an insidious side effect: the summary becomes a summary of a summary. After three or four rounds you hold an increasingly abstract text carrying no concrete detail at all. A simple guard: **never compact a summary**. Always compact the raw history, and pin the previous summary unchanged at the top.

## Reset: an actual clean slate

Anthropic's engineering write-up on harness design for long-running applications reports a counterintuitive finding: over long runs, **context resets beat compaction**. The reason fits in one sentence — compaction doesn't give the agent a clean slate. A summarised history is still a history: the dead ends, wrong assumptions and abandoned approaches are still in there, faded but present, and they keep pulling the agent back down the same paths.

The same work names a second concept, **context anxiety**: as the window fills, the model starts wrapping up prematurely — "this is probably good enough for now". Compaction doesn't fix that, because the sense of fullness comes from the length of the history itself. A reset does.

In practice a reset looks like this: the agent finishes a phase, writes its results to _files_, the session closes, and the next session starts by reading only those files. The filesystem becomes the inter-session channel — not the conversation history.

```text
session-01/  ← closed, history discarded
  NOTES.md        # handoff note (below)
  schema.sql      # verified schema dump
  failures.txt    # reproducible error text

session-02/  ← opened by reading NOTES.md + schema.sql
```

## How to write a handoff note

The whole value of a reset lives in this note. Too thin and the agent redoes the first session's work. Too fat and the reset was pointless. The format that works carries three constraints: **fixed headings**, **verbatim strings**, and **a hard ceiling**.

1.  **Fixed headings:** Use a template rather than free prose. If the agent fills the same four headings every time, the next session knows where to look.
2.  **Verbatim strings:** File paths, commands, version numbers and error text are copied, not described.
3.  **A hard ceiling:** Give the note a token budget (say 1,500). Without a ceiling it slowly turns into a second context window.

```text
# HANDOFF — session 01

## GOAL
Fix the VAT total bug in the invoice PDF parser.

## STATE
- Bug is in the `round()` call at `parsers/invoice.py:212`.
- `pytest tests/test_invoice.py -k vat` → 3 failed, 11 passed.
- All failures share one trait: amounts whose cents end in .005.

## VERIFIED FACTS
- Project is on Python 3.12; `decimal.Decimal` is already a dependency.
- `ROUND_HALF_UP` is the expected behaviour (docs/accounting.md, line 40).

## NEXT STEP
Replace float arithmetic with `Decimal` + `ROUND_HALF_UP`,
then run only the `-k vat` tests.

## TRIED, DIDN'T WORK
- `math.floor(x*100)/100` instead of `round(x, 2)`: broke 2 more tests.
```

That last heading is the most-skipped and the most valuable. Without a "tried, didn't work" list, the new session marches into the old session's dead end with exactly the same enthusiasm.

## The decision rule, and what to measure

A rule that holds up in practice:

1.  **If tool outputs are what's bloating the context → context editing.** Long file reads, search results, HTTP responses. These are bulky and usually dead weight once consumed. Try this first; it's the cheapest and loses the least.
2.  **If the conversation itself is the bulk and the task is unchanged → compaction.** A multi-turn negotiation, a long debugging dialogue. Continuity is what matters, not detail.
3.  **If the work is crossing a phase boundary → reset.** "Research is done, now we write" or "design approved, now we implement". A phase boundary is the natural home of a clean slate.
4.  **If the agent repeats the same mistake a third time → reset, not compaction.** Repetition is the signal that the history is poisoning the agent; summarising that history dilutes the poison rather than removing it.

Once you've picked a rule, measure it. Three numbers are worth tracking on long sessions: **input tokens per turn** (shows whether editing is working), **cache read ratio** (shows whether clearing is breaking your cache), and **cost per successful task**. The last one is the only real arbiter: a strategy that halves your tokens and halves your task success rate has bought you nothing.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Editing deletes, compaction summarises, reset starts clean — three distinct operations, not interchangeable.</li><li><code>clear_tool_uses_20250919</code> defaults: trigger at 100,000 input tokens, keep the last 3 tool uses; <code>clear_tool_inputs</code> is off by default.</li><li>Over long runs resets beat compaction, because even a summarised history drags the agent back into its old dead ends.</li><li>A reset is only as good as its handoff note: fixed headings, verbatim strings, and a "tried, didn't work" list.</li></ul></div>

<div class="faq"><details><summary>Does context editing work alongside prompt caching?</summary><p>It does, but it needs care. Every clear invalidates the cached prefix from the deletion point onward, so the request right after a clear will most likely miss the cache. That's what <code>clear_at_least</code> is for: it prevents breaking the cache for a small gain. A high threshold with rare, large clears is usually cheaper than frequent small ones.</p></details><details><summary>Should I write my own compaction or use the server-side feature?</summary><p>Write your own if you need control over the summary format — particularly when literal strings like file paths and error text must survive intact. For a general-purpose chat agent, server-side compaction means less code. Don't run both: two different shrinking policies over the same history produce unpredictable results.</p></details><details><summary>After a reset, doesn't the agent genuinely lose context?</summary><p>It does — that's the point. The only things that cross the boundary are your handoff note and the files. So resets work in systems disciplined enough to write that note. If you have the agent write it, do it as a separate step with a fixed template before closing the session; a "and by the way, take notes" instruction wedged into the middle of the work reliably produces incomplete notes.</p></details></div>

---

In short: context management isn't a preference, it's mandatory infrastructure for long agent sessions — and the right tool depends on what is actually doing the bloating. For what goes inside the window, see [context engineering](/en/posts/context-engineering/); for shrinking the token bill, see [LLM cost optimisation](/en/posts/llm-cost-optimization/); and for the loop this all runs inside, see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/).
