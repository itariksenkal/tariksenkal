---
title: "Quantization in Production: FP8, NVFP4, and Where Quality Actually Drops"
description: "How to choose between FP8, NVFP4, AWQ and GPTQ: the hardware support matrix, serving with vLLM, and why low-bit quantization degrades non-English output first."
publishDate: "2026-08-13T23:57:00+03:00"
lang: en
category: "Efficiency"
tags: ["Efficiency", "AI"]
translation: "uretimde-kuantizasyon"
heroImage:
  src: "../../../assets/blog/bimg-19.jpg"
  alt: "Quantization in Production: FP8, NVFP4, and Where Quality Actually Drops"
---

Most quantization writing is about running GGUF on a laptop. On a product server the questions are different: which format actually gets faster on _your_ hardware, where does quality get lost, and how do you measure that loss on the language your users actually write in? This article focuses on the serving side — vLLM, FP8, NVFP4 and AWQ — and foregrounds something almost nobody measures: low-bit quantization does not behave the same way outside English.

## What quantization actually makes cheaper

Quantization means representing model weights — and sometimes activations — with fewer bits: taking a 16-bit weight down to 8 or 4. It buys two distinct things.

-   **Memory:** weights shrink directly. Going from 16-bit to 8-bit roughly halves the weight footprint; 4-bit quarters it. That means the model fits on a smaller GPU, or that more room remains for the KV cache on the same GPU — often the more valuable outcome, since KV cache space determines how many concurrent requests you can serve.
-   **Speed:** because the decode phase is memory-bandwidth-bound, reading fewer bits translates fairly directly into faster generation.

> Unlike speculative decoding, quantization is lossy — the question is never "does quality drop" but "where, and by how much".

## W4A16 or W8A8: what the notation really tells you

Most of the confusion here comes from not reading the notation. `W` is the weight bit width, `A` the activation bit width.

-   **W4A16:** 4-bit weights, 16-bit activations. Weights are unpacked before the math. The memory win is large and the real benefit shows up at _low concurrency_ or when you are memory-constrained. AWQ and GPTQ typically live here.
-   **W8A8:** both weights and activations at 8 bits. Because the arithmetic itself can run in 8-bit, given hardware support it raises throughput at _high concurrency_ and in batch work. FP8 and INT8 W8A8 are in this class.

The practical rule: if your bottleneck is **fitting in memory**, use W4A16; if it is **throughput under load**, use W8A8. Confusing the two is the single most common cause of "I quantized it and nothing got faster" — unpacking 4-bit weights inside a saturated batch can cost more in compute than it saves in bandwidth.

## The hardware matrix: your GPU makes the choice

vLLM's supported list is wide: FP8 (LLM Compressor, NVIDIA Model Optimizer), NVFP4/MXFP4 via Marlin, AWQ, GPTQ (GPTQModel + Marlin), INT8 W8A8, INT4 W4A8 and W4A16, bitsandbytes, TorchAO, Intel Neural Compressor and AMD Quark. But that list is not hardware-independent:

-   **NVIDIA:** the broadest support. Turing (SM 7.5) and newer covers effectively the whole menu.
-   **AMD:** markedly narrower — limited to GGUF, llm-compressor FP8, and GPTQ.
-   **CPU:** only llm-compressor INT8 W8A8 and W4A8.

So method selection is usually a constraint rather than a preference. A team on AMD that ends up not using AWQ did not evaluate it and decline — it was never on the menu.

<div class="callout"><strong>Tip:</strong> The vLLM documentation <strong>deliberately</strong> publishes no accuracy or throughput comparison between these methods. That is not an omission but an honest position: results vary by model, task and hardware. Do not port a ranking you found online into your own setup — build the benchmark below instead.</div>

## NVFP4 and the 2026 accuracy-recovery front

The 2026 story is **NVFP4**, a block-scaled 4-bit floating point format. The long-standing problem with low-bit quantization is that outliers in the weight distribution do not fit a coarse 4-bit grid; block scaling softens this by giving small groups their own scale. The research around it is squarely focused on recovering accuracy:

-   **ScaleSweep** (30 May 2026) reports preserving **more than 93%** of full-precision performance under end-to-end quantization of weights, activations, KV cache and queries. — _arXiv:2606.07618_
-   **SharQ** (25 June 2026) recovers **43–63%** of the NVFP4-to-FP16 accuracy gap _training-free_, measuring a **2.2–2.4×** latency reduction versus FP16 on an RTX 5090 and **1.2–1.4×** throughput over FP8. — _arXiv:2606.26587_

Together these suggest 4-bit is moving out of the "cheap but risky" bucket. But note the detail that matters: what SharQ recovers is _part_ of the gap. A measurable difference between NVFP4 and FP16 remains, and only you can determine whether it matters for your task.

## Where quality loss actually shows up

Quantization loss is not distributed evenly. It concentrates exactly where the model is _least confident_ — and in a multilingual model, that means languages other than English.

The mechanism is tokenization. Turkish, for instance, splits into noticeably more tokens per word than English, because its agglutinative morphology breaks a single word into several pieces. Two consequences follow:

1.  **Longer token chains, more accumulated error:** producing the same sentence takes more steps, and quantization noise re-enters at each one.
2.  **Rarer sub-word pieces:** non-English sub-word fragments appear less often in training data, so their embeddings are less sharply separated and lose discriminability faster when rounded onto a coarse grid.

In practice, a loss that looks "negligible" on an English benchmark can surface as morphological errors, dropped suffixes, mangled proper nouns and JSON schema violations in Turkish. The repeated observation is that a 4-bit model degrades on Turkish output earlier than on English — and English benchmarks will _never_ show you that.

Hence the rule: **do not make a quantization decision from an English benchmark.** Measure on your own production traffic, in the language your users actually write in.

## Build your own benchmark

A correct benchmark is not complicated; it just has to use _your_ data. Standing up the server is one line:

```text
# FP8 (W8A8) — for throughput at high concurrency
vllm serve MODEL_NAME --quantization fp8

# AWQ (W4A16) — for memory pressure and low concurrency
vllm serve MODEL_NAME_AWQ --quantization awq
```

Then send identical requests to both endpoints and measure the _quality difference_. The skeleton below checks correctness and format validity together, because quantization loss usually appears in structured output first:

```python
import json, requests

def generate(endpoint, model, prompt, max_tokens=400):
    r = requests.post(
        f"{endpoint}/v1/chat/completions",
        json={"model": model,
              "messages": [{"role": "user", "content": prompt}],
              "temperature": 0,          # must be deterministic to compare
              "max_tokens": max_tokens},
        timeout=120)
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"]

def is_valid_json(text):
    try:
        json.loads(text)
        return True
    except (json.JSONDecodeError, TypeError):
        return False

def compare(base_url, quant_url, model, samples, is_correct):
    """samples   : list of prompts — from YOUR OWN traffic
       is_correct: (prompt, output) -> bool  your task success criterion"""
    s = {"base_ok": 0, "quant_ok": 0, "base_json": 0, "quant_json": 0,
         "n": len(samples)}
    for p in samples:
        b = generate(base_url, model, p)
        q = generate(quant_url, model, p)
        s["base_ok"]    += is_correct(p, b)
        s["quant_ok"]   += is_correct(p, q)
        s["base_json"]  += is_valid_json(b)
        s["quant_json"] += is_valid_json(q)
    n = s["n"]
    print(f"accuracy  base={s['base_ok']/n:.1%}  quant={s['quant_ok']/n:.1%}")
    print(f"json      base={s['base_json']/n:.1%}  quant={s['quant_json']/n:.1%}")
    return s
```

Three things matter here. Without `temperature=0` you cannot compare two setups at all; the samples must come from real production traffic; and track JSON validity separately from accuracy, because format breakage is usually the early warning that precedes semantic degradation.

The decision itself then becomes simple: set an acceptable quality threshold (say, no more than a one-point drop in task accuracy), try the methods your hardware supports in order, and pick the most aggressive one that clears the bar. Reversing that order — choosing the smallest format first and checking quality afterwards — is the most expensive mistake in production.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>W4A16 addresses memory pressure and low concurrency; W8A8 addresses throughput under load. Confusing them explains most "no speedup" results.</li><li>Hardware usually decides the method: NVIDIA Turing+ is broadest, AMD is narrow, CPU is INT8 W8A8 and W4A8 only.</li><li>NVFP4 is the 2026 format; SharQ recovers 43–63% of the accuracy gap training-free, but does not close it entirely.</li><li>Quantization loss surfaces earlier in non-English text — benchmark on your own traffic, not on English suites.</li></ul></div>

<div class="faq"><details><summary>What is the difference between FP8 and NVFP4?</summary><p>FP8 is an 8-bit floating point format; NVFP4 is a block-scaled 4-bit one. NVFP4 saves more memory and runs faster — published measurements report 1.2–1.4× throughput over FP8 — at the cost of greater accuracy risk. That risk is why a significant share of 2026 quantization research is aimed specifically at closing NVFP4's accuracy gap.</p></details><details><summary>Should I use AWQ or GPTQ?</summary><p>Both are typically W4A16 and suit memory-constrained scenarios; which one wins varies by model. The vLLM documentation deliberately publishes no accuracy comparison, so the only correct answer is to measure on your own task set. Hardware often narrows the choice anyway — on AMD, for instance, GPTQ is supported while AWQ is not.</p></details><details><summary>Does quantization hurt non-English performance more?</summary><p>Yes, and it degrades earlier than in English. Languages like Turkish split into more tokens per word, so generation chains are longer and quantization noise accumulates over more steps; their sub-word pieces also appear less frequently in training data, making them more fragile under low-bit rounding. A loss that looks negligible on English benchmarks can appear as suffix errors and malformed JSON in Turkish.</p></details></div>

---

Quantization is how you serve the same model on less hardware — but it is not the only way to get smaller. For teaching the same job to a smaller model see [knowledge distillation](/en/posts/knowledge-distillation/), for deciding what size you actually need see [small language models](/en/posts/small-language-models/), and for choosing what to run on your own servers see [open-source LLMs](/en/posts/open-source-llms/).
