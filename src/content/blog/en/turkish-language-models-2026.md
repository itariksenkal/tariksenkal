---
title: "Turkish Language Models in 2026: A Verified Landscape"
description: "The Turkish open-weight LLM landscape with a Hugging Face link behind every claim: Cosmos, Kumru, Trendyol, Kanarya, BILGE — and how to spot models that do not exist."
publishDate: "2026-08-13T23:39:00+03:00"
lang: en
category: "Models"
tags: ["Models", "AI"]
translation: "turkce-dil-modelleri-2026"
heroImage:
  src: "../../../assets/blog/covers/turkish-language-models-2026.jpg"
  alt: "Turkish Language Models in 2026: A Verified Landscape"
---

Search for "Turkish open-source LLM" and some of the top results list models that do not exist. Invented repository names, invented benchmark scores, and a US export-control regulation presented as a model licence. This article does the opposite: every model name links to a real Hugging Face repository, every number says where it came from, and nothing I could not verify appears here at all. At the end there is a script that lets you check any list yourself in twenty seconds.

## A warning first: models that do not exist

A list page currently ranking near the top of Turkish search results contains these model names: `KanarYa-Mistral-7B-tr`, `Kumru AI-7.4B`, `Cosmos-Llama-1-70B`, `TÜBİTAK BİLGEM-13B`, `bilgem-tr-llm-70b`, and a `t3-ai-defence-7b` said to be published under an "ITAR/EAR Custom License".

> None of those repositories exist — and ITAR/EAR is US export-control law, not a model licence.

Do not take my word for it either. Verification takes thirty seconds, and this script runs:

```python
from huggingface_hub import HfApi
from huggingface_hub.utils import RepositoryNotFoundError

api = HfApi()
candidates = [
    # claimed, unverifiable repositories
    "asafaya/KanarYa-Mistral-7B-tr",
    "vngrs-ai/Kumru-AI-7.4B",
    "ytu-ce-cosmos/Cosmos-Llama-1-70B",
    # ones that genuinely exist
    "asafaya/kanarya-2b",
    "vngrs-ai/Kumru-2B",
    "ytu-ce-cosmos/Turkish-Llama-8b-v0.1",
]

for repo in candidates:
    try:
        info = api.model_info(repo)
        print("EXISTS ", repo, "| license:", info.card_data.get("license"))
    except RepositoryNotFoundError:
        print("MISSING", repo)
```

The rule to apply when reading any model list: **if a row gives no repository ID and no licence, it is a claim, not information.** The Turkish AI ecosystem's biggest problem is not a shortage of models; it is a shortage of verifiable writing about them.

## The verified landscape

Every row below was checked against Hugging Face while writing.

| Organisation | Verified models |
| --- | --- |
| **Cosmos** — Yıldız Technical University, Computer Engineering (not ITU) | `Turkish-Llama-8b-v0.1` (on Llama-3-8B, 30 GB Turkish corpus), `Turkish-Gemma-9b-v0.1` (on Gemma-2-9B), the ModernBERT-TR family: `-base`, `-embed`, `-reranker`, `-guardrail` (~0.1B) |
| **VNGRS** | `Kumru-2B` and `Kumru-2B-Base`; the VBART family (Small → XLarge) plus summarisation and title-generation variants |
| **Trendyol** | `Trendyol-LLM-8B-T1`, `Trendyol-LLM-Asure-12B` (built on Gemma 3-12B, multimodal), `Trendyol-Cybersecurity-LLM-v2-70B-Q4_K_M` |
| **Kanarya** — Ali Safaya | Only `kanarya-750m` and `kanarya-2b`. Untouched since March 2024; there is no 7B variant |
| **BERTurk** — dbmdz | Real and widely used, but published by the **Bavarian State Library** — not a Turkish institution |
| **Turkcell** | `Turkcell-LLM-7b-v1` exists but has not been updated since April 2024 — effectively dormant |

The most striking thing about this table is what is missing from it: **there is no Turkish-specific open-weight model above 12B.** The ecosystem's real centre of mass sits between 2B and 12B, and it is surprisingly strong on the encoder side (BERT and ModernBERT derivatives).

That has a direct consequence. If you need a large model for Turkish, the answer is not a Turkish-specific model but a multilingual one that handles Turkish well. The cleanest-licensed option in that category is `utter-project/EuroLLM-22B-Instruct-2512` — 22.6B parameters, **Apache-2.0**, with Turkish explicitly among its 35 supported languages.

## Licences: what "open" does and does not mean

"Open source" is the single most misapplied label in these listings. The verified position:

-   `Turkish-Llama-8b-v0.1` is under the **Llama 3 licence**. Not Apache — it carries use restrictions and attribution obligations.
-   `Turkish-Gemma-9b-v0.1` and `Trendyol-LLM-Asure-12B` are under the **Gemma licence**. Also not Apache-2.0 — labelling these two as "Apache" is the most common error in Turkish listings.
-   `EuroLLM-22B-Instruct-2512` genuinely is **Apache-2.0**.

<div class="callout"><strong>Tip:</strong> If this is going into a commercial product, read the licence from the repository's <code>README</code> metadata <code>license</code> field rather than the prose of the model card, and archive that state with a date. Card text and metadata occasionally disagree, and your legal team will want the metadata.</div>

## BILGE and T3: the state-backed side

**BİLGE** is the national language model developed by TÜBİTAK BİLGEM. What is verifiable: it was trained on more than one trillion tokens, scored 44.44 out of 50 on a cultural-translation evaluation, and has an official presentation site. Two things are not verifiable, and saying so is part of the job: **the parameter count is contested** — different outlets describe a family spanning 1.9B to 122B versus a single 37B model — and **no source confirms that BİLGE is open-weight.** Calling it "Turkey's open-source model" is therefore not supportable today.

**T3 AI**, developed by the T3 Foundation with Baykar and launched at TEKNOFEST, has a beta available. Claims circulating about an export-controlled defence variant have no primary source behind them.

## The benchmark reality: language-specific does not mean better

This is the most overlooked finding in the whole discussion. **Cetvel**, from Koç University's KUIS AI group (arXiv:2508.16431, accepted to EACL 2026), evaluated 33 open-weight models up to 70B across 23 tasks and found that _Turkish-centric instruction-tuned models generally underperform relative to multilingual or general-purpose models, despite being tailored for the language._ Llama 3 and Mistral beat Turkish-specific models on many tasks.

That is not an argument against Turkish models. It is an argument that **a language label is not a performance guarantee.** A 9B model with continued Turkish pretraining may well beat a multilingual model of the same size on Turkish — but there is no guarantee it beats a strong 70B multilingual one.

Where to look on the benchmark side: **TurkBench** (arXiv:2601.07020, 8,151 samples, 21 subtasks, EACL 2026 SIGTURK), the older **TR-MMLU** reference (arXiv:2501.00593), and for live standings `yerel.ai/leaderboard` plus the `alibayram` TR-MMLU table on Hugging Face. Self-reported model-card scores are usable too — the `Turkish-Gemma-9b-v0.1` card reports a 63.31 average on Turkish benchmarks — but they are the _publisher's own measurement_, not independent, and should be labelled that way.

## A practical selection flow

1.  **Is the task classification, tagging or search?** You do not need a generative model. The ModernBERT-TR family (~0.1B) is dramatically faster and cheaper for this.
2.  **Doing semantic search?** Pick a dedicated Turkish embedding model and encode both queries and documents with the same one.
3.  **Generative work where data cannot leave the organisation?** The 8B–12B continued-pretraining models are a reasonable starting point; read the licence first.
4.  **Need the quality ceiling?** Stop looking for a Turkish-specific model and benchmark a strong multilingual one on your own task set.
5.  **In every case:** decide from a 50–200 example evaluation set built from your own data, not from a leaderboard. Public leaderboards do not measure your job.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Several model names circulating in Turkish search results never existed; any row without a repository ID and a licence is a claim, not information.</li><li>The verified landscape clusters between 2B and 12B — there is no Turkish-specific open-weight model above 12B.</li><li>Cosmos and Trendyol models sit under Llama 3 / Gemma licences, not Apache-2.0. EuroLLM-22B is genuinely Apache-2.0 and supports Turkish.</li><li>Cetvel found Turkish-centric instruction-tuned models can underperform multilingual ones: a language label is not a performance guarantee.</li></ul></div>

<div class="faq"><details><summary>What is the best open-source LLM for Turkish?</summary><p>There is no single answer, and lists claiming otherwise deserve suspicion. For classification and search, the ModernBERT-TR family; for in-house generative work, the 8B–12B continued-pretraining models; where you need the quality ceiling, a strong multilingual model. Decide on your own evaluation set.</p></details><details><summary>Kumru or Trendyol LLM?</summary><p>They sit at different scales, so they are not direct competitors. In their verified form Kumru is a 2B-class model while Trendyol publishes at 8B and 12B. For a small, fast base, Kumru; for more capacity, the Trendyol side — but read the Gemma licence before commercial use.</p></details><details><summary>Is BILGE open source?</summary><p>No primary source confirms that. BİLGE is reported to have been trained on over a trillion tokens and to have scored 44.44/50 on a cultural-translation evaluation, while its parameter count is inconsistent across sources. Absent any confirmation of open weights, it should not be described as an open-weight model.</p></details></div>

---

What the Turkish AI ecosystem needs is not more lists but verifiable ones. For the wider open-weight picture see [open-source LLMs](/en/posts/open-source-llms/), for how to measure a model on your own data see [LLM evaluation](/en/posts/llm-evaluation/), and for why a small model is often enough see [small language models](/en/posts/small-language-models/).
