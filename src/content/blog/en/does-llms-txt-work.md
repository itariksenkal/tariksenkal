---
title: "Does llms.txt Actually Work? What the Data Says, and What v2 Changed"
description: "A 137,210-domain server-log study says llms.txt is barely fetched and Google says it does not use it. So what did v2 change, and what actually moves AI citations?"
publishDate: "2026-08-13T23:50:00+03:00"
lang: en
category: "Product"
tags: ["Product", "AI"]
translation: "llms-txt-ise-yariyor-mu"
heroImage:
  src: "../../../assets/blog/bimg-13.jpg"
  alt: "Does llms.txt Actually Work? What the Data Says, and What v2 Changed"
---

You put an `llms.txt` at the root of your site. It was supposed to help AI engines understand you better. Do they actually read it? That question now has a data-backed answer, and the answer is uncomfortable. This article covers both the evidence and what the v2 release of August 2026 changed — and ends with the measured finding about what actually earns citations. Full disclosure: this site publishes an `llms.txt` too. This piece questions my own practice as much as anyone else's.

## What llms.txt is

`llms.txt` is a file at the root of a site that presents its most important pages to language models in markdown. Jeremy Howard proposed it in September 2024 and the reasoning is sound: HTML is noisy, and a clean table of contents is more useful to a model.

> The idea is sound; the problem is that no crawler asks for it.

## What the server logs say

This debate was settled by server logs rather than opinion. Ahrefs' study published 15 June 2026 (May 2026 data, **137,210 domains**) found:

-   **28%** of domains publish an `llms.txt` — adoption is genuinely broad.
-   But **97% of those files received zero traffic.**
-   Among the 3% that were fetched, **96% of requests were bots**, and only **19.5%** came from named AI tools.
-   The most striking finding: **zero requests arrived for `llms.txt` files that do not exist.** Nothing is proactively looking for the file.

That last point ends the argument. If nothing asks for a file, improving its contents cannot have an effect.

## What Google says on the record

Google's position is documented. John Mueller, reported on 6 July 2026, was unambiguous: Google does not use `llms.txt` or `llms-author.txt`, and he knew of no other crawler or LLM confirming that they use these.

Google's AI-features documentation supports that: it never mentions `llms.txt`. The only controls it names are `robots.txt`, `nosnippet` / `data-nosnippet` / `max-snippet` and `noindex`. The same document also answers the broader "GEO" expectation directly: there are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary.

<div class="callout"><strong>Tip:</strong> If you want to manage AI crawlers, the file that does the work is <code>robots.txt</code>, not <code>llms.txt</code> — because the first is read and the second is not. Put your access policy where it is actually enforced.</div>

## And yet v2 shipped: what changed

Here is the interesting part: with the evidence pointing that way, **llms.txt v2 shipped in August 2026** — two years after v1, again authored by Jeremy Howard. And what v2 adds targets precisely the "nothing is looking" problem:

-   **Link relations for discoverability.** You can now point at the file from the page: `rel="alternate" type="text/markdown"` and `rel="describedby"`, deliverable as `<link>` elements or HTTP headers. You announce the file rather than hoping it is guessed.
-   **Flexible markdown URL forms:** publish by appending the extension (`/page.md`) or by replacing it (`/page.html` → `/page.md`).
-   **Path-based coverage:** a file covers pages beneath its path and the most specific file wins, so publishers covering only part of a site can participate.
-   **The `llms_txt2ctx` expansion tool was removed** — and with it the mechanical semantics of the `Optional` section.

So v2 diagnosed the standard's main weakness correctly. Whether the fix works will again be answered by server logs, not blog posts.

## So what actually lifts citations?

This is the more useful question, and it has been measured. The "What Gets Cited" study (arXiv:2605.25517, 25 May 2026) ran **252,000 trials across 6 LLMs**, varying 18 content factors pairwise with brand anonymisation and counterbalanced ordering. The findings:

-   **Topical relevance and list position dominate.** Everything else is small beside them.
-   **Explicit pricing data and recent timestamps consistently lift citation odds.** Actionable and cheap.
-   **Formatting-only edits have minimal impact.**

Two independent correlation findings sit alongside it. Ahrefs, 26 May 2025, across 75,000 brands: the strongest association with AI visibility was **branded web mentions** (r=0.664) and the weakest was backlinks (0.218). And the same team's 11 August 2025 study (15,000 prompts) found only **12%** of AI-cited URLs rank in Google's top ten for the same prompt. Both are **2025** data; label them that way.

The click-through picture is a separate reality: Ahrefs' 300,000-keyword study (updated 4 February 2026) found AI Overview presence correlating with a **58%** lower click-through rate for the top-ranking page, up from 34.5% in their April 2025 measurement. Pew's March 2025 data points the same direction: users clicked a traditional result on **8%** of visits where an AI summary appeared, versus **15%** without one.

## A balanced conclusion

1.  **Publish `llms.txt`, but set expectations correctly.** The cost is near zero, there is no risk, and v2's link relations may improve discoverability. Treat it as an insurance policy, not a traffic source.
2.  **Add v2's `<link>` declaration.** That is the one genuine improvement available: announce the file from the page.
3.  **Put your access policy in `robots.txt`.** That is where it is actually enforced.
4.  **Spend your budget on content structure.** The measured finding is clear: explicit pricing data, current dates and topical focus raise citation odds; formatting touch-ups do not.
5.  **Chase brand mentions.** Branded mentions, not backlinks, show the strongest association with AI visibility.

And a warning: a significant share of the numbers circulating in this field trace to no verifiable source. When you hear a GEO claim, one question suffices — what date, how many samples, collected by whom? A claim without an answer is an opinion.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Across 137,210 domains, 97% of published llms.txt files received zero traffic, and zero requests arrived for files that do not exist.</li><li>Google stated on the record that it does not use llms.txt, and that no special optimization is required for AI Overviews.</li><li>v2 targets exactly the discoverability problem: link relations, flexible markdown URLs and path-based coverage.</li><li>Measured: explicit pricing data and recent timestamps lift citation odds; formatting-only edits do almost nothing.</li></ul></div>

<div class="faq"><details><summary>What is llms.txt and do I need one?</summary><p>A file at the root of a site presenting its important pages to language models in markdown. You do not need one: server-log studies show the vast majority are never requested. Publishing costs almost nothing so it does no harm, but do not plan for it as a traffic source.</p></details><details><summary>Does Google use llms.txt?</summary><p>No. A Google spokesperson stated that Google does not use llms.txt or llms-author.txt and knew of no other crawler or LLM confirming they do. Google's AI-features documentation names only robots.txt, nosnippet, max-snippet and noindex as controls.</p></details><details><summary>What should I do for visibility in AI answers?</summary><p>Based on measured findings: write topically focused, substantive content, include explicit pricing data and current timestamps, and grow brand mentions — mentions rather than backlinks show the strongest association with AI visibility. Formatting-only changes showed no measurable effect.</p></details></div>

---

The most valuable thing in this field is not a new tactic but knowing which tactics have actually been measured. For the wider framing see [generative engine optimization](/en/posts/generative-engine-optimization/), for content and interface decisions in AI products see [AI product UX](/en/posts/ai-product-ux/), and for how models process text in the first place see [how LLMs work](/en/posts/how-llms-work/).
