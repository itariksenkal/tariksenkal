---
title: "LLM Hallucinations: Why They Happen and How to Reduce Them"
description: "Why do LLMs hallucinate and how can you reduce it? Practical measures with grounding, RAG, verification, self-checking, and temperature tuning."
publishDate: "2026-08-09T23:09:00+03:00"
lang: en
category: "Reliability"
tags: ["Reliability", "AI"]
translation: "llm-halusinasyon-azaltma"
heroImage:
  src: "../../../assets/blog/covers/reducing-llm-hallucinations.jpg"
  alt: "LLM Hallucinations: Why They Happen and How to Reduce Them"
---

Large language models will sometimes produce a wrong answer without the slightest hesitation, in a tone of complete confidence. We call this a "hallucination," and it happens not because the model is broken but because it is working exactly as designed. Is it inevitable? No. With the right measures we can't reduce it to zero, but we can rein it in dramatically. In this post we'll explain why it happens intuitively, then build a practical mitigation belt.

## What is a hallucination, and why does it happen?

A large language model (LLM) is not a "store of facts." It is a statistical engine that predicts _what the next word should be_ based on patterns learned from enormous amounts of text. Think of the word prediction on your phone's keyboard: type "Today the weather is very…" and it suggests "nice" or "hot." An LLM does the same thing; but because it has read millions of documents, its predictions become accurate enough to produce fluent paragraphs, code, even poetry.

And that is exactly where the problem lies: the model's goal is not "to tell the truth" but "to produce a plausible next word." Ask it for a source that doesn't exist and it won't recall a real one; it will simply generate "what a real source ought to look like." The result: content that never existed but looks convincing.

> The danger of a hallucination is not that the model errs; it's that it is fluent and confident enough to hide the fact that it erred.

A real incident makes this concrete: in the 2023 U.S. case **Mata v. Avianca**, lawyers cited six precedent decisions that ChatGPT had produced while drafting a brief. None of the cases were real; all six were entirely fabricated. The court sanctioned the lawyers. The lesson is clear: the mistake wasn't using AI, it was accepting its output without ever verifying it.

The main drivers of hallucination are:

-   **Knowledge gaps:** When asked about something absent from or rare in its training data, the model tends to "fill the gap."
-   **Knowledge cutoff:** The model's knowledge freezes at a certain date; anything after that is "guessed."
-   **Ambiguous or contradictory questions:** An unclear prompt pushes the model into assumptions.
-   **Excessive helpfulness:** The model may have been shaped to produce an answer rather than say "I don't know."

## Grounding and RAG

The single most effective measure is to not leave the model alone with its own "memory." Picture a student: in a closed-book exam they may invent things from memory; in an open-book exam they must base their answer on the text in front of them. Grounding does exactly this.

The most common method is **RAG** (Retrieval-Augmented Generation). The logic is simple: the model doesn't write the answer straight from memory. It first _retrieves_ the relevant text from a trusted source (a document store, documentation, a file the user uploaded), then produces its answer _anchored_ to that text.

```text
// Simple RAG flow (pseudocode)
question = user_input()

// 1) RETRIEVE: find the documents closest to the question
chunks = vector_db.search(embed(question), top_k=5)

// 2) GROUND: pass only these chunks as context
prompt = """
Answer based on the SOURCE text below.
If the answer is not in the source, say "Not found in source".
Add a citation [chunk-id] next to each claim.

SOURCE:
{chunks}

QUESTION: {question}
"""

// 3) GENERATE + CITE
answer = llm(prompt, temperature=0.2)
```

Note three crucial details: (1) Instruct the model to say "not found" instead of inventing when the answer isn't in the source. (2) Require citations; a traceable answer is a verifiable answer. (3) The retrieval step itself must be accurate — if the wrong document is retrieved, the answer built on it will be wrong too. RAG reduces hallucination substantially but doesn't eliminate it; that's why it's one defense layer, not the only one.

<div class="callout"><strong>Tip:</strong> In RAG, retrieval quality matters more than generation quality. Measure your search/embedding layer first; before blaming the model, make sure you actually handed it the right document.</div>

## Temperature and decoding settings

**Temperature** is a setting that controls how "creative" the model is when choosing the next word. A low value (e.g. 0–0.3) steers it toward the most likely, safest option; a high value (e.g. 0.8–1.2) increases variety and surprise.

Think of it like a cook's hand with salt: a little salt yields a consistent, predictable taste; a lot of salt sometimes produces something brilliant, sometimes a disaster. For tasks where you want factual accuracy (summarization, Q&A, data extraction) use **low** temperature. For brainstorming, ad copy, or creative writing, a higher value makes sense.

-   **Factual/technical answers:** temperature ≈ 0.0–0.3
-   **Balanced conversation:** ≈ 0.4–0.7
-   **Creative generation:** ≈ 0.8–1.2

An important caveat: low temperature _reduces but does not remove_ hallucination. If the model confidently treats a false fact as "most likely," lowering the temperature will just make it repeat that error more consistently. So temperature isn't a solution on its own; it's a setting that complements grounding.

## Verification and self-checking

Humans also make mistakes in a first draft; the difference is that we read what we wrote once more. We can apply the same discipline to the model.

-   **Self-check:** Ask the model to re-examine its own answer against the source and flag any unsupported claims.
-   **Cross-verification:** Ask the same question several times (or to different models); if answers are inconsistent, that's a "low confidence" signal.
-   **Programmatic verification:** Check the output's format and factuality with code — e.g. whether a given URL resolves, or whether a citation actually appears in the source.
-   **Human oversight:** In high-stakes domains (law, healthcare, finance) final approval always rests with an expert. AI speeds up the draft; it doesn't take over responsibility.

```python
// Verify citations in code
for claim in answer.claims:
    if claim.citation not in source_text:
        flag(claim, "Could not be verified in source")
        # show to user or reject the answer
```

> Don't leave verification to the model's good intentions. Verify what's verifiable with code; leave only what requires judgment to a human.

## Prompt and system design

Most hallucinations come not from a bad model but from a vague prompt. Sharpening the prompt alone makes a big difference:

-   **Explicitly grant permission to not know:** The line "If you're not sure, say 'I don't know'" reduces the pressure to invent.
-   **Narrow the scope:** Constraints like "rely only on the given text" or "don't infer the date range" cut off assumptions.
-   **Ask for step-by-step reasoning:** For complex tasks, asking for reasoning first and the conclusion second improves consistency.
-   **Fix the output format:** Structured output (JSON, tables) both eases verification and curbs free-form invention.

If you want to build an architecture that is grounded, verifiable, and reviewed by humans, we describe how we apply this in practice on our [HatsonTech](/en/posts/what-is-hatsontech/) page.

## Practical checklist

1.  For factual tasks, use **RAG**; ground the answer in a source and require citations.
2.  Choose **temperature** by task; keep it low when you need accuracy.
3.  Add the **"say so if you don't know"** permission to the prompt.
4.  **Verify citations and format with code**; make free text auditable.
5.  **Cross-verify** the answer to test for inconsistency.
6.  Make **human approval** mandatory in the flow for high-stakes cases.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Hallucination isn't a malfunction; it's the natural consequence of a "predict the next word" design.</li><li>The single strongest measure is grounding (RAG); the model is forced to "read and cite" instead of "recall."</li><li>Low temperature improves accuracy but doesn't end hallucination on its own.</li><li>Verify what's verifiable with code, and what needs judgment with a human.</li><li>Safety lives not in one layer but in overlapping layers of defense.</li></ul></div>

<div class="faq"><details><summary>Can hallucination be prevented entirely?</summary><p>It can't be reduced to zero, because the model is a probabilistic prediction engine. But when RAG, low temperature, verification, and human oversight are used together, the rate drops to a practically acceptable level.</p></details><details><summary>If I use RAG, should I set temperature to zero?</summary><p>Not strictly, but keeping it low (0–0.3) is sensible for factual tasks. RAG supplies the source, and low temperature reduces the model's tendency to drift from it. The two complement each other.</p></details><details><summary>How do I get the model to say "I don't know"?</summary><p>Add the permission explicitly to the prompt ("say 'not found' if it's not in the source"), narrow the scope, and require citations. Rejecting any claim without a citation in code nudges the model toward honesty.</p></details></div>

---

In short: hallucination is the price of fluency, but it is not our fate. Once you anchor the model to reality and make its answers verifiable, AI stops being a "confident invention machine" and becomes a reliable assistant. The key is not a single magic button; it's a stack of small, disciplined measures layered on top of one another.
