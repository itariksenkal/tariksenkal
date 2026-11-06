---
title: "With a 1M-Token Window, Do You Still Need RAG?"
description: "Does a 1M-token window make RAG obsolete? Context rot, the measured token cost of non-English text, and a third option: pushing long context into filesystem tool calls."
publishDate: "2026-08-13T23:38:00+03:00"
lang: en
category: "Architecture"
tags: ["Architecture", "AI"]
translation: "uzun-baglam-mi-rag-mi"
heroImage:
  src: "../../../assets/blog/covers/long-context-vs-rag.jpg"
  alt: "With a 1M-Token Window, Do You Still Need RAG?"
---

Your model has a 1M-token context window. Your entire policy corpus is 400K tokens. The obvious question follows: if it all fits, why maintain a RAG pipeline at all? It is a fair question, and the honest answer is that fitting is not the same as being used well — and the bill behaves differently than you expect. Here is the long answer, with numbers I measured rather than borrowed.

## 1M is table stakes now

A few years ago context length was a marketing line. In 2026 it is not: the current Claude family ships a 1M-token window with 128K max output, and Google's fast Gemini models are also at 1M. "How many tokens" has stopped being a selection criterion and become a baseline feature.

> The question moved from "how big is the window" to "how much of the window actually works".

That distinction has a name: the gap between the _advertised_ window and the _effective_ one. The advertised window is how many tokens the model will accept without erroring. The effective window is the range over which it uses those tokens with equal reliability — and it is almost always smaller.

## Context rot: what happens as the window fills

The reference work here is Chroma's context-rot study, and it is a **2025** artifact — 14 July 2025, 18 models across Anthropic, OpenAI, Google and Alibaba. 2026 blog posts routinely misdate it. Its five experiments produced these findings:

-   **Length alone degrades performance** — even on _simple_ tasks. Accuracy falls as input grows without the task getting harder.
-   **A single distractor hurts**, and multiple distractors compound. A paragraph that resembles the answer but is wrong is the most dangerous content in your context.
-   **Position matters:** accuracy is highest when the target appears early.
-   **Models scored better on shuffled haystacks than on coherent ones** — counterintuitive, and therefore the finding worth remembering.
-   Behaviour under uncertainty is family-dependent: Claude models tend to abstain when unsure, while GPT models hallucinate more in the presence of distractors.

The engineering lesson is unambiguous: putting more into the window is not a lever that raises accuracy. Frequently it is the opposite.

## Where it breaks: dynamic synthesis, not static retrieval

What 2026 added was localisation of the failure. AgentLongBench (arXiv:2601.20730, 28 January 2026) tests from 32K up to 4M tokens and finds that current models are fine at **static retrieval** — pulling a fact out of a long text — and fail at **dynamic synthesis**, combining information that accumulates across the context into a decision. AMA-Bench (arXiv:2602.22769, 26 February 2026) attributes part of this to the lossiness of similarity-based retrieval.

This explains why needle-in-a-haystack tests mislead: they measure precisely the thing models are already good at. Your production workload is usually the other thing — extracting contradictions across a hundred pages of contracts, tracking a decision that changed over a conversation, remembering what was done across a thirty-step agent session.

<div class="callout"><strong>Tip:</strong> Do not make this decision from a needle test. Build a 30–50 question set from your own documents, run it both ways — full 400K context and 5-chunk RAG — and measure two things: accuracy and cost per question. The decision comes from two tables, not from intuition.</div>

## The non-English tax, measured

Every context and cost calculation copied from an English source breaks on non-English text, because the same meaning costs more tokens. That claim is asserted everywhere and quantified nowhere. So let us quantify it — this script runs:

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

tr = ("Sözleşmenin feshi hâlinde tarafların karşılıklı yükümlülükleri sona erer "
      "ve tazminat talepleri saklıdır. Çalışanlarımızın yıllık izin hakları, "
      "çalışma süresine göre hesaplanmaktadır. Bu bilgilendirme metni yalnızca "
      "genel bilgi amacıyla hazırlanmıştır ve hukuki tavsiye niteliği taşımaz.")

en = ("If the contract is terminated, the mutual obligations of the parties end "
      "and claims for damages are reserved. The annual leave entitlements of our "
      "employees are calculated according to their length of service. This notice "
      "has been prepared for general information purposes only and does not "
      "constitute legal advice.")

for name, text in (("TR", tr), ("EN", en)):
    n = len(enc.encode(text))
    print(name, "tokens:", n, "| chars per token:", round(len(text) / n, 2))
```

On this parallel pair the measured result is **80 tokens for Turkish against 54 for English** — about **1.48×** for identical content. Efficiency per character drops too: 3.58 characters per token in Turkish versus 5.83 in English. The cause is agglutination — each inflectional suffix splits into its own subword piece. The TR-MMLU work (arXiv:2501.00593) likewise flagged tokenization quality as a core weakness for Turkish.

That one number moves three things at once. **Context**: a 1M window holds roughly two-thirds as much Turkish prose as English. **Cost**: stuffing the same corpus into every request is proportionally more expensive. **Latency**: prefill scales with token count, so time-to-first-token rises too.

An important caveat: 1.48 is _one_ text pair on _one_ tokenizer. Measure it on your own corpus with your own model's tokenizer — copying a ratio out of a blog post is exactly the habit this article argues against. For the linguistic reasons behind Turkish tokenization specifically, see [this deep dive on Turkish tokenization](https://halideyilmaz.com/en/posts/tokenization-turkish-challenges/) rather than a re-derivation here.

## A third option: push context into the filesystem

The debate is usually framed as binary, but 2026 produced a strong third answer: move long-context work out of the attention mechanism and into **filesystem and shell tool calls**. "Coding Agents are Effective Long-Context Processors" (arXiv:2603.20432, 20 March 2026) reports beating published state of the art by **17.3%** on average, on corpora up to 3 trillion tokens.

The idea is an old engineering reflex: instead of loading the data into memory, write a query that goes to the data. The agent uses `grep`, `head` and `jq`, pulls only the relevant lines into context and leaves the rest on disk:

```bash
# What the agent does instead of loading 400K tokens into context:
$ grep -rn "termination notice" contracts/ | head -20
contracts/2024-supply.md:118: ... termination notice thirty days prior ...
contracts/2025-maintenance.md:64: ... termination notice must be in writing ...

$ sed -n '110,130p' contracts/2024-supply.md   # only the relevant block
```

Where your corpus already lives as files, this needs less infrastructure than RAG — no embedding pipeline, no vector store, no reindexing — and costs far less than full context. In exchange it requires an agent loop and depends on the model picking good search terms, so where semantic matching is essential RAG still wins.

## The decision table

| Situation | Choice |
| --- | --- |
| Small corpus (<100K tokens), identical on every query | Full context + prompt caching |
| Large corpus, narrow pinpoint queries | RAG |
| Corpus on a filesystem, lexical searches | Agent + shell tools |
| Documents change often, freshness is critical | RAG (keep the index current) |
| Holistic reasoning over one long document | Full context |
| Citations are mandatory | Full context is weak — RAG carries provenance naturally |

One economic detail that is frequently missed: if a large prefix repeats on every request, prompt caching makes the full-context option far more competitive than it looks, because cache reads cost a small fraction of base input price. But that only holds while the prefix is _genuinely_ stable — put variable user data at the front of the context and the saving disappears entirely.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>1M tokens is now a baseline; the differentiator is how much of the window is effectively usable.</li><li>Context rot (Chroma, 2025) shows length alone degrades accuracy and a single distractor already hurts.</li><li>Measured: the same parallel text costs 80 tokens in Turkish and 54 in English — about 1.48×. Measure your own corpus.</li><li>Do not forget the third option — filesystem and shell tool calls can beat both on the right corpus.</li></ul></div>

<div class="faq"><details><summary>Is RAG or long context better?</summary><p>There is no single answer; corpus size, query type and freshness requirements decide. For small, stable corpora full context plus prompt caching is usually simpler and sufficient. For large, frequently changing corpora, or where citations are required, RAG wins.</p></details><details><summary>What is context rot?</summary><p>The decline in model accuracy as input length grows, even when the task itself does not get harder. Chroma's 2025 study demonstrated it across 18 models: accuracy is highest when the target appears early and falls as distracting content accumulates.</p></details><details><summary>Can I just send all my documents in a 1M-token window?</summary><p>Technically yes; it is rarely the right call. Sending the whole corpus per query does not improve accuracy, it inflates time-to-first-token, and on non-English text it is proportionally more expensive. If you do have a stable prefix, prompt caching cuts that cost substantially.</p></details></div>

---

The window got bigger but the decision did not get easier — there are simply three options now instead of two. To build the retrieval path from scratch see the [RAG guide](/en/posts/what-is-rag-how-to-build/), for the discipline of deciding what earns a place in the window see [context engineering](/en/posts/context-engineering/), and to separate teaching a model from giving it knowledge see [fine-tuning vs RAG vs prompting](/en/posts/fine-tuning-vs-rag-vs-prompt/).
