---
title: "Agent Memory Systems: What Lives Outside the Context Window"
description: "How agent memory actually works: episodic, semantic and procedural stores, a real pgvector schema, the tool landscape, and controls against memory poisoning."
publishDate: "2026-08-13T23:45:00+03:00"
lang: en
category: "Agents"
tags: ["Agents", "AI"]
translation: "ajan-bellek-sistemleri"
heroImage:
  src: "../../../assets/blog/covers/agent-memory-systems.jpg"
  alt: "Agent Memory Systems: What Lives Outside the Context Window"
---

"Remembering" means two different things for an agent, and conflating them muddles the architecture. The first is whatever is inside the context window — which disappears when the session ends. The second is what persists outside it. This article is about the second: what to store, where, when to delete it, and what happens when what you stored has been poisoned.

## Memory is not context

**Context engineering** is deciding what enters a limited window on this step. **Memory** is deciding what persists outside it. Different questions, different failure modes, different tools.

> Context is a desk; memory is an archive. Clearing the desk does not erase the archive.

The distinction mattered more in 2026, because memory is no longer something you must build yourself: memory and context editing became first-class primitives in provider APIs. But the decision about _what_ to store remains yours, and that is the hard part.

## Three kinds of memory and what each is for

| Type | What it stores and why it matters |
| --- | --- |
| **Episodic** | Events: "the user cancelled order X on 3 March". Timestamped, singular, verifiable. The genuinely valuable type for support and personalisation. |
| **Semantic** | Generalisations: "this user is a developer who likes technical detail". Useful, but an _inference_ and therefore capable of being wrong. |
| **Procedural** | How-to knowledge: "for this customer, invoicing requires approval first". Changes agent behaviour directly — the highest-impact and highest-risk type. |

The most common mistake is dumping all three into one "notes" table. They must be separated because their _lifetimes_ differ: an episodic record never changes (the event happened), a semantic record decays, and a procedural record must be updated _immediately_ when reality changes — a stale procedure is a wrong action.

## Four components: write, extract, retrieve, maintain

A systems study published in June 2026 (arXiv:2606.24775) decomposes memory into exactly these four components and evaluates **12 memory systems plus 2 baselines across 5 workloads spanning 11 datasets**. The headline finding does not make architecture selection easier, but it is honest: **no architecture wins universally** — effectiveness depends on workload/architecture alignment. Its second finding is more directly actionable: **localized maintenance is more cost-efficient than global reorganization.** Update the record you touched in place rather than periodically rebuilding the store.

1.  **Representation and storage:** what form a record takes — free text, structured fields, an embedding, or all three.
2.  **Extraction:** deciding which information from a conversation deserves to become memory. Most noise enters here.
3.  **Retrieval and routing:** which records enter context for which query.
4.  **Maintenance:** updating, merging, resolving contradictions, expiring. The most neglected component.

<div class="callout"><strong>Tip:</strong> Do not enable memory writes by default. "Extract notes from every conversation" produces hundreds of mutually contradictory records within weeks and degrades retrieval quality. Make writing a tool call: the model must <em>deliberately</em> say "remember this", and that call must be schema-validated.</div>

## A working pgvector schema

Before buying a memory product, see how far the PostgreSQL you already run gets you. This schema covers the episodic/semantic/procedural split, multi-tenant isolation, provenance and expiry together:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE agent_memory (
  id          bigserial PRIMARY KEY,
  tenant_id   uuid        NOT NULL,          -- multi-tenant isolation
  subject_id  uuid        NOT NULL,          -- who or what it is about
  kind        text        NOT NULL
              CHECK (kind IN ('episodic','semantic','procedural')),
  content     text        NOT NULL,
  embedding   vector(1536) NOT NULL,
  source      text        NOT NULL,          -- 'user' | 'tool' | 'inference'
  confidence  real        NOT NULL DEFAULT 0.5,
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz,                   -- NULL = no expiry
  deleted     boolean     NOT NULL DEFAULT false
);

-- filtered similarity search by tenant and kind
CREATE INDEX ON agent_memory USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON agent_memory (tenant_id, subject_id, kind) WHERE NOT deleted;
```

```sql
-- retrieval: always filter by tenant first, then rank by similarity
SELECT id, content, kind, source, confidence
FROM   agent_memory
WHERE  tenant_id  = $1
  AND  subject_id = $2
  AND  NOT deleted
  AND  (expires_at IS NULL OR expires_at > now())
ORDER  BY embedding <=> $3
LIMIT  8;
```

Three details make this production-grade. The `source` column distinguishes whether a record came from the user, from a tool, or from the model's own inference — that column is the only basis a poisoning investigation has. `expires_at` stops semantic records from silently rotting. And the `deleted` flag makes erasure auditable, leaving a trace before the row is physically removed.

## The tool landscape: library or roll your own?

There are several mature options here: **Mem0**, **Zep**, **Letta** and **LangMem**. The choice comes down to three questions:

-   **Do you have a maintenance policy?** If not, a library earns its keep — its real value is in extraction and merge logic.
-   **Does data location matter to you?** If it does, your own PostgreSQL schema is the simplest and most auditable route.
-   **Do memory queries entangle with product logic?** If they do (for example "only this department's records"), writing your own layer becomes unavoidable.

Be careful on the benchmark side: claims about which memory benchmarks are "canonical" mostly originate from companies selling in this space. The independent published evaluation concluded that architectures cannot be universally ranked anyway. Measure on your own workload.

## Memory poisoning and the right to erasure

OWASP's 2026 agentic framework names _Memory and Context Poisoning_ as ASI06. The attack is simple: text from an untrusted source is written into memory as fact and, weeks later in a completely different session, changes the agent's behaviour. In procedural memory that translates directly into a wrong action.

Four controls make it manageable: **(1)** route writes through a schema-validated tool call; **(2)** record provenance on every entry and assign low confidence to inference-derived records; **(3)** gate procedural writes behind human approval — the highest-impact type deserves the tightest gate; **(4)** prioritise by source at retrieval time and present untrusted-source records as quotations: "the user claimed that…".

Erasure is an architectural requirement too. When someone's data must be deleted, memory can live in three places: as a row in the database, as an embedding in the vector index, and as a summary inside another record. The third is the insidious one — "user X complained about Y" survives after you delete X's record. Design for it from the start: every derived record should store which records it was derived from.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Context is inside the window and memory is outside it; conflating them muddles the architecture.</li><li>Separate episodic, semantic and procedural memory — their lifetimes and risk profiles differ.</li><li>Independent evaluation found no memory architecture wins universally, and that localized maintenance beats global reorganization on cost.</li><li>Record provenance on every entry; without that column neither poisoning analysis nor erasure is implementable.</li></ul></div>

<div class="faq"><details><summary>What is an agent memory system?</summary><p>Everything an agent persists outside its context window, plus the layer that manages it: writing, extraction, retrieval and maintenance. Unlike context, which vanishes at the end of a session, it persists — and it produces its own failure modes: staleness, contradiction and poisoning.</p></details><details><summary>Should I buy a memory product?</summary><p>First measure how far PostgreSQL with pgvector gets you; for most teams needing multi-tenant isolation, provenance and expiry, it is enough. The real value of a library is its extraction and merge logic, so it is a sensible choice if you do not intend to write that logic yourself.</p></details><details><summary>What is memory poisoning?</summary><p>Content from an untrusted source being written into memory as fact and then changing the agent's behaviour in later sessions. Its delayed nature makes it hard to detect. Routing writes through a tool call, recording provenance and gating procedural writes behind approval closes most of the risk.</p></details></div>

---

Memory stops an agent starting from zero every time — but only if you control what is stored and what is erased. For what enters the window see [context engineering](/en/posts/context-engineering/), for the retrieval infrastructure underneath see [vector databases](/en/posts/vector-databases-guide/), and for the loop that consumes memory see [autonomous agent architectures](/en/posts/autonomous-agent-architectures/).
