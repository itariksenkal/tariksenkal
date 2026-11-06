---
title: "Prompt Regression Testing: Putting Evals in CI"
description: "Build a golden set from production logs, wire a promptfoo CI gate, calibrate an LLM judge, and avoid the string-matching traps that break non-English evals."
publishDate: "2026-08-13T23:48:00+03:00"
lang: en
category: "Evaluation"
tags: ["Evaluation", "AI"]
translation: "prompt-regresyon-testleri"
heroImage:
  src: "../../../assets/blog/covers/prompt-regression-testing.jpg"
  alt: "Prompt Regression Testing: Putting Evals in CI"
---

You changed the prompt, tried three examples, it looked fine, you shipped. A week later support reports that a different scenario broke. What breaks that cycle is not better prompt writing; it is turning evaluation into a _build step_. This article is about where the measurement runs rather than what the metrics mean: golden sets, CI gates, judge calibration and the string-matching traps that silently produce wrong results.

## Where the golden set comes from

The most common mistake is inventing the test set at a desk. Invented questions do not resemble what real users ask, so your tests pass while production breaks. The right source is production logs.

> A golden set is not written; it is extracted from production.

The practical method: sample 200 random requests from the last thirty days, cluster them by hand, and pick 3-5 representatives per cluster. The result is usually a 50-150 example set, and that is enough. Add two more groups on top: **past bugs** (every fixed defect becomes a test — this is the real value of a regression set) and **edge cases** (empty input, very long input, mixed-language input, an attack attempt).

## A three-layer test pyramid

Sending every example to an LLM judge is expensive and unnecessary. Build three layers from cheap to expensive, each taking only what passed the previous one.

| Layer | What it does and what it costs |
| --- | --- |
| **1\. Deterministic** | Schema validation, JSON parsing, required fields, banned phrases, length limits. Free, in milliseconds. It catches a surprising share of failures. |
| **2\. Reference-based** | Cases where the expected answer is known: a classification label, an extracted field, a computed number. Cheap and exact. |
| **3\. Judged** | Free-text quality. Expensive, slow and needs calibration — reserve it for questions the first two layers cannot answer. |

The benefit of the pyramid is speed rather than cost: layer one can run on every commit, layer two on every pull request, layer three nightly.

## A working CI gate with promptfoo

The tools in this space are **promptfoo**, **RAGAS** (RAG-specific metrics), **DeepEval**, and on the hosted side **LangSmith** and **Braintrust**. The fastest start is promptfoo, because it is one YAML file and one command.

```text
# promptfooconfig.yaml
prompts:
  - file://prompts/support-v3.txt
providers:
  - id: anthropic:messages:claude-sonnet-4-5
    config: { temperature: 0 }

defaultTest:
  assert:
    - type: is-json
      value:
        type: object
        required: [intent, priority, summary]
    - type: not-contains
      value: "as a language model"
    - type: latency
      threshold: 4000

tests:
  - description: billing dispute
    vars: { message: "I was charged twice last month and want a refund." }
    assert:
      - type: equals
        value: '{"intent":"refund_request","priority":"high"}'
        transform: 'JSON.stringify({intent: output.intent, priority: output.priority})'

  - description: empty input
    vars: { message: "" }
    assert:
      - type: javascript
        value: output.intent === "unknown"
```

```bash
# CI step: break the build below threshold
npx promptfoo@latest eval -c promptfooconfig.yaml \
  --output result.json --fail-on-error
npx promptfoo@latest eval --assert-pass-rate 0.95
```

Running the gate on pull requests is what turns a prompt into code. A prompt change is now a diff, it has tests, and it does not merge if they fail.

<div class="callout"><strong>Tip:</strong> Run tests at <code>temperature: 0</code>, but also run a separate nightly pass at the temperature you actually use in production. A system that passes deterministically and behaves inconsistently in production is failing precisely where you are not measuring.</div>

## Judge calibration: reliability is not validity

If you are going to use an LLM judge, you should know the most comprehensive 2026 reliability study (arXiv:2606.19544, 17 June 2026): **21 judges across 9 providers, 118 runs and roughly 541,000 individual judgments**. Its findings should be read before you build a judge:

-   **Kappa deflation is universal.** The gap between raw agreement and chance-corrected Cohen's kappa reaches 33–41 points on MT-Bench. "My judge agrees 85% of the time" therefore says almost nothing.
-   **Rankings shift by up to 14 positions across benchmarks.** A judge being good on one benchmark says little about yours.
-   **The consistency-bias paradox:** two production-deployed judges showed test-retest reliability above 0.95 while simultaneously exhibiting position bias above 0.10. A judge can be _consistently_ biased.
-   **Verbosity bias is small** (below 0.011) — the most-feared bias turns out to be the least harmful.

That translates into three rules. **One:** validate your judge against 50-100 human-labelled examples and report kappa, not raw agreement. **Two:** randomise A/B order in pairwise comparisons and ask every pair in both directions — that is the only way to measure position bias. **Three:** version the judge prompt too; when the judge changes, historical scores stop being comparable.

One more caveat: human labels are not a gold standard either. Related work found human annotations to be substantially inconsistent in themselves, which undermines human-labelled benchmarks as ground truth. Matching a human is a ceiling, not a guarantee.

## The traps that break string matching

These break non-English evaluation quietly, and Turkish is the clearest illustration.

-   **Agglutination breaks exact match.** "iade", "iadesi" and "iadesini" are different strings for the same concept. Use exact match on classification labels only, never on free text.
-   **Lost diacritics.** Users type "gecen ay" while your reference says "geçen ay". Normalise both sides before comparing.
-   **Turkish casing.** Standard `lower()` is wrong: `"İ".lower()` returns two characters.
-   **Unicode composition.** Two visually identical strings can be different code points; `NFC` normalisation is mandatory.

```python
import unicodedata

TR_ASCII = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")

def normalize_tr(s: str) -> str:
    """Apply to BOTH sides before any comparison in evaluation."""
    s = unicodedata.normalize("NFC", s)
    s = s.replace("I", "ı").replace("İ", "i").lower()
    s = s.translate(TR_ASCII)                  # ignore diacritic differences
    return " ".join(s.split())                 # collapse whitespace

assert normalize_tr("İADE Talebi")  == normalize_tr("iade  talebi")
assert normalize_tr("Geçen ay")     == normalize_tr("gecen ay")
```

## Tuning the gate

A CI gate only works if the threshold is right. Too strict and it gets disabled; too loose and it catches nothing.

1.  **Use a regression threshold, not an absolute one.** Rather than "must exceed 95%", use "must not drop more than 2 points below main". The gate then calibrates to the system as it is today.
2.  **Separate critical tests.** Security and schema tests should break on a single failure; quality tests should look at the aggregate rate.
3.  **Measure the noise.** Before setting a threshold, run the same version five times and observe the natural variance; the threshold must sit above it.
4.  **Put cost and latency in the gate too.** A change that improves quality while tripling cost is a regression and should be discussed as one.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Do not invent the golden set; sample production logs and turn every fixed bug into a test.</li><li>Build three layers: deterministic checks per commit, reference tests per PR, judged evaluation nightly.</li><li>Validate judges with kappa and measure position bias by flipping order — raw agreement is misleading.</li><li>Normalise Unicode, casing and diacritics on both sides before any exact-match comparison.</li></ul></div>

<div class="faq"><details><summary>What is prompt regression testing?</summary><p>Automatically verifying that a prompt or model change has not broken previously working behaviour. It is the same idea as software regression testing: a fixed example set, expected results, and a gate that runs before the change merges.</p></details><details><summary>How do I build a golden dataset?</summary><p>By sampling production logs randomly and clustering by hand. Take a few representatives per cluster, then add previously fixed bugs and edge cases. 50-150 examples is enough for most systems; representativeness matters far more than size.</p></details><details><summary>Are LLM judges reliable?</summary><p>Usable when calibrated, misleading when not. The most comprehensive published study found kappa deflation of 33-41 points against raw agreement, ranking shifts of up to 14 positions across benchmarks, and marked position bias alongside very high test-retest reliability. Validate on your own set against human labels and report kappa.</p></details></div>

---

Once evaluation is a build step rather than a report, changing a prompt stops being frightening. For what the metrics mean see [LLM evaluation](/en/posts/llm-evaluation/), for the specific problems of scoring agents see [agent evaluation](/en/posts/agent-evaluation/), and for the pipeline this gate sits inside see [MLOps and taking AI to production](/en/posts/mlops-ai-to-production/).
