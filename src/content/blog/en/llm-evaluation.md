---
title: "How Do We Evaluate LLMs? Automatic Metrics, LLM-as-Judge and RAG Faithfulness"
description: "A guide to LLM evaluation: automatic metrics, LLM-as-judge, human evaluation, domain-specific test sets, and measuring faithfulness for RAG systems."
publishDate: "2026-08-09T23:07:00+03:00"
lang: en
category: "Evaluation"
tags: ["Evaluation", "AI"]
translation: "llm-degerlendirme"
heroImage:
  src: "../../../assets/blog/covers/llm-evaluation.jpg"
  alt: "How Do We Evaluate LLMs? Automatic Metrics, LLM-as-Judge and RAG Faithfulness"
---

Building a language model is the easy part; knowing whether it is actually "good" is much harder. Because a "good answer" usually can't be boiled down to a single correct number. This article walks through the main ways to evaluate LLMs, when each one works, and — especially for RAG systems — how to measure faithfulness, all in plain, intuitive terms.

## Why is evaluation hard?

Think of a math exam: the answer is either right or wrong, and grading is easy. Now think of an essay exam. What makes an essay "good"? Fluency, originality, faithfulness to the topic? Two teachers may give the same text different marks. LLM outputs are mostly of the second kind: free-form text, many "acceptable" answers, and a definition of "correct" that shifts with context.

That's why no single metric is enough. You have to think in layers: a pyramid that starts with cheap, fast automatic checks and moves, when needed, toward the more expensive but more reliable judgment of humans.

> You can't improve what you don't measure; but what you measure wrongly will improve you in the wrong direction.

## Automatic metrics

The cheapest layer is metrics that automatically compare the model's output against a reference answer. They are fast, repeatable, and require no human; but they are shallow.

-   **Exact match / accuracy:** Ideal for tasks where the answer matches a known label exactly — multiple choice, classification, extraction. "Is the answer A?"
-   **Overlap metrics (BLEU, ROUGE):** In translation and summarization, they count word/phrase overlap between the generated text and a reference. Fast, but they measure surface, not meaning: say the same thing in different words and you may score low.
-   **Embedding-based similarity (e.g. BERTScore):** Converts texts into meaning vectors and compares similarity. Captures synonymy better than raw word overlap.
-   **pass@k (for code):** Does the generated code actually pass the tests? Here "correctness" is measurable beyond dispute; it either runs or it doesn't.

<div class="callout"><strong>Tip:</strong> Use automatic metrics like a "smoke test." A low score is a bad sign; but a high score alone does not mean "high quality." A summary can overlap heavily with the reference and still contain a false claim.</div>

## LLM-as-judge: making the model a referee

When metrics like BLEU miss meaning, a natural idea follows: have another strong language model evaluate the answer. This is called "LLM-as-judge." The judge model is given a _rubric_ and the answer to evaluate, and it produces a score or a preference.

There are two common forms: scoring a single answer (say 1-5), and asking it to prefer one of two answers (is A or B better?). The second is usually more stable, because an "absolute score" is hard even for humans, while "which one is better" gets answered more consistently.

```text
SYSTEM: You are an impartial judge evaluating an answer.
Rate it 1-5 on the criteria below and give a rationale.
- Accuracy: Are the claims factual?
- Relevance: Does it answer the question?
- Faithfulness: Is it grounded only in the given context?

QUESTION: {question}
CONTEXT: {retrieved_documents}
ANSWER: {model_answer}

OUTPUT (JSON):
{"accuracy": ?, "relevance": ?, "faithfulness": ?, "rationale": "..."}
```

It's powerful but has pitfalls. Judge models can unfairly favor **longer answers** and a **style resembling their own**; they can show bias based on option order (picking A just because it came first). So it's good practice to randomize option order, provide a clear rubric, and validate the judge's decisions against humans from time to time.

## Human evaluation

The gold standard is still the human. Especially for style, helpfulness, safety, and nuanced domain knowledge, no metric fully replaces human judgment. Common methods:

-   **Likert scale:** Raters score each answer on a scale such as 1-5.
-   **Pairwise comparison (A/B):** They are asked which of two outputs is better. Humans are more consistent at relative than absolute judgments.
-   **Error labeling:** The rater marks _where_ the answer went wrong (hallucination, missing information, wrong tone). This answers not just "how many points" but "what to fix."

The weaknesses of human evaluation are cost and consistency. It's essential to measure inter-annotator agreement, write clear guidelines, and show the same example to multiple people and average the results.

## Domain-specific test sets

General benchmark tables look impressive but may not reflect your work. A model can be perfect on a general knowledge test yet weak at interpreting your contract clauses or medical notes. The fix: **a test set of real examples specific to your domain.**

A good domain-specific set has these properties:

1.  **Representativeness:** It reflects the distribution of real user questions, not just easy cases.
2.  **Hard cases:** It deliberately includes corner cases, trick questions, and ambiguities.
3.  **Expert-approved answers:** Reference answers are verified by a domain expert.
4.  **Held out:** Kept separate so it doesn't leak into training data.

<div class="callout"><strong>Tip:</strong> 50-100 well-chosen, expertly labeled examples are worth more than tens of thousands of noisy ones. Build a small but clean set first, then expand over time.</div>

## Measuring faithfulness for RAG

In RAG (retrieval-augmented generation) systems there's a separate question: did the model stay _faithful_ to the documents it was given, or did it make things up? This is called faithfulness, and it differs from accuracy.

By analogy: picture a student taking an open-book exam. "Accuracy" is whether the answer is actually correct. "Faithfulness" is whether the student really drew the answer from the pages in the book. A student might have guessed the right answer by luck (correct but not faithful), or misread the book and faithfully produced a wrong answer.

The practical way to measure faithfulness is to break the answer into individual **claims** and check whether each is supported by the retrieved context:

```python
# Faithfulness ~ claims supported by context / total claims
claims = split_into_claims(answer)            # 1) extract sentences/assertions
supported = 0
for claim in claims:
    if context_supports(claim, retrieved_documents):  # 2) judge/NLI check
        supported += 1
faithfulness = supported / max(len(claims), 1) # 3) ratio = faithfulness score
```

In RAG one score isn't enough; you need to track two axes together:

-   **Faithfulness:** Does the answer contradict the retrieved documents? Is there fabrication?
-   **Context relevance:** Are the retrieved documents actually relevant to the question? A faithful but irrelevant answer is still useless.

Open-source toolkits (approaches like RAGAS, for example) largely automate these claim-based faithfulness and relevance measurements using LLM-as-judge; but they still need occasional human auditing to stay calibrated.

## A practical mixed strategy

No single method solves everything. The approach that works is a funnel that combines the layers:

1.  **In the dev loop:** Check every change instantly with fast automatic metrics and LLM-as-judge (cheap, continuous).
2.  **Before release:** Run a detailed pass on your domain-specific test set, including faithfulness.
3.  **At regular intervals:** Have humans evaluate a small but representative sample, and calibrate your LLM judge against human judgment.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>No single metric captures LLM quality; think in layers.</li><li>Automatic metrics are fast but shallow; use them as a "smoke test."</li><li>LLM-as-judge scales but is prone to biases (length, order, style).</li><li>Human evaluation remains the gold standard; measure agreement for consistency.</li><li>Build your own domain-specific test set instead of relying on general benchmarks.</li><li>In RAG, separate accuracy from faithfulness; measure faithfulness claim by claim.</li></ul></div>

<div class="faq"><details><summary>Does LLM-as-judge replace human evaluation?</summary><p>Not quite. It's a scalable proxy and great for routine checks. But because it has biases, you need to calibrate its decisions against a human sample regularly. The best approach is to use both together.</p></details><details><summary>Are faithfulness and accuracy the same thing?</summary><p>No. Accuracy is whether the answer is actually correct. Faithfulness is whether the answer is grounded only in the given context. An answer can be faithful yet wrong (wrong document), or correct yet unfaithful (a lucky guess).</p></details><details><summary>Can a small test set be reliable?</summary><p>50-100 well-chosen, expertly labeled examples can be more informative than tens of thousands of noisy ones. Build a clean, representative small set first, then grow it.</p></details></div>

---

In short, LLM evaluation is not a single number but a discipline: knowing what you're measuring, mixing cheap and expensive methods wisely, and — especially in RAG — separating faithfulness from accuracy.
