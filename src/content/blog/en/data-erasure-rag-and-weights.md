---
title: "Erasing Personal Data From a RAG Index — and From Fine-Tuned Weights"
description: "A deletion request touches six places: source, chunks, vectors, caches, logs and fine-tuned weights. A practical erasure strategy and schema for each of them."
publishDate: "2026-08-13T23:51:00+03:00"
lang: en
category: "Applications"
tags: ["Applications", "AI"]
translation: "kvkk-llm-veri-silme"
heroImage:
  src: "../../../assets/blog/covers/data-erasure-rag-and-weights.jpg"
  alt: "Erasing Personal Data From a RAG Index — and From Fine-Tuned Weights"
---

When a user says "delete my data", in a conventional application that is a `DELETE` statement. In an LLM system the same personal data can live in at least six places, and one of them is irreversible. This article is not a legal essay; it is an erasure architecture an engineer can implement. One caveat first: what follows is engineering practice, not legal advice — work with your own counsel for the final assessment.

## Where personal data lives in an LLM system

Preparing for a deletion request starts with an inventory. In a typical RAG plus fine-tuning architecture, one person's data sits in:

| Layer | Erasability |
| --- | --- |
| Source document store | Easy — an ordinary delete |
| Chunked text table | Easy, if provenance was recorded |
| Vector index | Moderate — may require index compaction |
| Prompt/response logs and traces | Frequently forgotten — the biggest silent risk |
| Caches (prompt cache, application cache) | Expiry-dependent; rarely on the inventory |
| Fine-tuned model weights | Practically irreversible |

That table is itself a compliance artifact: knowing in advance which six systems a data-subject request has to sweep turns response time from weeks into hours.

## The deletable layer: source, chunks, vectors

The first three layers are erasable in one transaction if designed for it. The key decision is this: **every chunk and every vector must carry which source document and which data subject it came from.** That column cannot be added retroactively.

```sql
CREATE TABLE rag_chunk (
  id           bigserial PRIMARY KEY,
  document_id  uuid        NOT NULL,
  subject_id   uuid,                       -- whose personal data this is
  text         text        NOT NULL,
  embedding    vector(1536) NOT NULL,
  source_path  text        NOT NULL,
  added_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON rag_chunk (subject_id) WHERE subject_id IS NOT NULL;
CREATE INDEX ON rag_chunk (document_id);
```

```sql
-- Erasure: three layers in one transaction
BEGIN;
  DELETE FROM rag_chunk WHERE subject_id = $1;     -- chunk and vector together
  UPDATE source_document SET deleted = true, content = NULL
    WHERE subject_id = $1;
  INSERT INTO erasure_log (subject_id, request_id, layer, at)
    VALUES ($1, $2, 'rag', now());                 -- leave evidence
COMMIT;
```

One vector-side detail matters: in row-based solutions such as pgvector, deleting the row deletes the vector. Some external vector databases tombstone instead, with real removal arriving at index compaction. Verify how yours behaves and, if it tombstones, make compaction part of the erasure flow.

<div class="callout"><strong>Tip:</strong> Do not forget derived records. A summary, a memory entry or a classification result can keep carrying personal data after the source is gone. Every derived record must store which records it came from; otherwise erasure is incomplete by construction.</div>

## The forgotten layer: caches and logs

This is the most frequently skipped place in practice. Prompt and response logs, traces and error reports usually carry personal data in the clear and sit outside the erasure flow entirely.

Three rules make it manageable. **One:** never write personal data into logs — mask before the tracing layer, not inside it. **Two:** if you must write it, set a short retention and document it; a thirty-day retention naturally narrows the scope of any deletion request. **Three:** add the subject identifier as a field on log records; you cannot erase from a log you cannot query.

On the cache side, the practical approach is to document rather than to rely on expiry: write down how long each cache lives and when it is purged following a deletion request.

## The hard layer: fine-tuned weights

Honesty is required here: **there is no practical, reliable way to erase one person's data from fine-tuned model weights.** Machine unlearning is an active research area, but it offers no auditable guarantee at production scale. So the engineering answer is not erasure but _avoidance_.

A workable strategy has three steps:

1.  **Never let personal data into the training set.** Make PII detection and masking a mandatory step in dataset construction; this prevents the one problem that cannot be solved later.
2.  **Put knowledge in the index, not the weights.** Where person-specific knowledge is needed, use RAG — this is RAG's strongest compliance argument: the knowledge lives in an erasable layer.
3.  **If unavoidable, plan for retraining.** Version the training set and record which record entered which version, so that retraining on cleaned data is at least _possible_ when a request arrives.

```python
import re

NATIONAL_ID = re.compile(r"\b[1-9][0-9]{10}\b")
IBAN  = re.compile(r"\bTR[0-9]{2}[0-9A-Z]{20}\b")
EMAIL = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.]+\b")
PHONE = re.compile(r"\b(?:\+90|0)?5[0-9]{9}\b")

def valid_national_id(s: str) -> bool:
    """Turkish national ID: 11 digits, non-zero first digit, two check digits."""
    if len(s) != 11 or not s.isdigit() or s[0] == "0":
        return False
    d = [int(c) for c in s]
    if (sum(d[0:9:2]) * 7 - sum(d[1:8:2])) % 10 != d[9]:
        return False
    return sum(d[:10]) % 10 == d[10]

def mask(text: str) -> str:
    """Run BEFORE writing to a training set or to logs."""
    text = NATIONAL_ID.sub(
        lambda m: "[NATIONAL_ID]" if valid_national_id(m.group()) else m.group(), text)
    text = IBAN.sub("[IBAN]", text)
    text = EMAIL.sub("[EMAIL]", text)
    text = PHONE.sub("[PHONE]", text)
    return text
```

The checksum validation is not decoration: masking every eleven-digit number without validating it also destroys order numbers and product codes, and renders the dataset unusable.

## Compliance by design

Compliance has to be an architectural property rather than a layer bolted on afterwards. Four design decisions suffice:

-   **The subject identifier travels through every layer.** Source, chunk, vector, memory record, log — all of them.
-   **Derived records keep their provenance.** A summary knows which documents produced it.
-   **Erasure is a flow, not a query.** It walks six layers in order, records each step, and produces evidence at the end.
-   **There is a deletion test.** Create a subject in staging, delete them, then search all six layers. Without that test your erasure flow does not work.

On the regulatory side there is also a newer source in Turkey: the data protection authority's generative-AI guidance published on 24 November 2025. Its content sits inside a PDF, so it is not indexed and not answerable from search; download it directly and read it against your own systems. Most engineering teams miss it for exactly that reason.

## Transfer, retention and documentation

Erasure is only part of compliance. For an LLM feature you also need three things in writing, and all three depend on provider choice.

1.  **A cross-border transfer analysis.** For every model provider, document where the data goes and on which legal basis. This is done per provider and updated when the provider changes.
2.  **Retention configuration.** Provider-side data retention is now a configurable, documentable control on most platforms — set it deliberately rather than accepting the default, and record the decision.
3.  **A processing record.** Your agent audit log can double as the personal-data processing record. Design one log to serve both purposes rather than building two systems.

One closing note: assume your system prompt can leak. Do not put customer names, internal rules or personal data into it; OWASP's 2026 edition renamed this risk _Hidden Context Exposure_ and kept sensitive information disclosure at number two on its list.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Personal data lives in six places in an LLM system; the erasure flow must walk all six and produce evidence.</li><li>Write the subject identifier onto chunk and vector records — that column cannot be added retroactively.</li><li>Erasing from fine-tuned weights is impractical; the answer is avoidance — keep person-specific knowledge in the RAG index, not the weights.</li><li>Logs and caches are the most-skipped layer; mask before the tracing layer rather than inside it.</li></ul></div>

<div class="faq"><details><summary>How do I delete personal data from a RAG index?</summary><p>In one transaction, if chunk and vector records carry a subject identifier: delete the chunks, mark the source document, and write an erasure record. Verify whether your vector database truly removes or merely tombstones; if it tombstones, add index compaction to the flow.</p></details><details><summary>Can a person's data be erased from a fine-tuned model?</summary><p>There is no practical, auditable way. Machine unlearning is active research but offers no production-scale guarantee. The right approach is avoidance: keep personal data out of the training set, hold person-specific knowledge in a RAG index, and version the training set so retraining remains possible.</p></details><details><summary>What documentation does an LLM feature need?</summary><p>At minimum three things: a per-provider cross-border transfer analysis, a record of the retention configuration you chose, and a personal-data processing record. If you design your agent audit log to satisfy the third, you avoid building a second system. Work with your own counsel for the final assessment.</p></details></div>

---

Compliance is an architectural property rather than a layer added later — and erasability is its most concrete test. For AI in legal work see [AI in legal practice](/en/posts/ai-in-legal-practice/), for building the erasable knowledge layer see [the RAG guide](/en/posts/what-is-rag-how-to-build/), and for deletion behaviour on the vector side see [vector databases](/en/posts/vector-databases-guide/).
