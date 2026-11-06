---
title: "AI Coding Assistants: Productivity, Risks and Good Practice"
description: "What coding assistants and coding agents do, what studies really say about productivity, the security and licensing risks, and practices that keep teams safe."
publishDate: "2026-11-24T09:17:00+03:00"
lang: en
category: "Applications"
tags: ["Artificial Intelligence", "Software Development", "Security"]
translation: "kod-yazan-yapay-zeka-asistanlari"
heroImage:
  src: "../../../assets/blog/covers/ai-coding-assistants.jpg"
  alt: "A code editor on screen with AI suggestions alongside"
---

A few years ago, an editor that completed a line of code felt like magic. Now we can tell an AI assistant to "fix this bug, run the tests and summarise the change". These tools are reshaping developers' daily work quickly, yet the answers to "how much faster?" and "how safe?" are far less tidy than the marketing suggests. In this post I explain what coding assistants and coding agents do, what productivity research actually says, the main risks, and the practices I recommend for using them well, in language that non-developers can follow too.

## Assistants versus agents

Roughly speaking, AI coding tools fall into three groups:

| Type | What it does | Who is in control |
|---|---|---|
| Autocomplete | Suggests the rest of the line or function you are typing | Entirely the developer |
| Chat assistant | Explains code, helps debug, writes example code | The developer copies and adapts |
| Coding agent | Reads many files, makes changes, runs commands and tests | The agent takes steps itself; the developer approves and reviews |

Agents are the most powerful group and the one that needs the most care. To finish a task, an agent may touch dozens of files, which can mean a big time saving but also a big change that is easy to miss.

## Productivity: what do the studies say?

The short answer: the results are mixed and depend heavily on context.

-   **Studies showing speed-ups:** in a controlled experiment published in 2023 by researchers from GitHub and Microsoft, developers asked to write a simple HTTP server in JavaScript finished 55.8% faster with Copilot. The confidence interval was wide, though (about 21–89%), and the task was small, well defined and written from scratch.
-   **Studies showing slow-downs:** in a randomised controlled trial published by METR in July 2025, 16 experienced developers who had worked for years on large open-source projects tackled 246 real tasks. Tasks where AI was allowed took 19% longer on average. Strikingly, the developers expected a 24% speed-up beforehand and still believed they had been sped up by about 20% afterwards. METR stresses that the results concern early-2025 tools and should not be generalised to other settings; its page now notes that the findings are out of date and that it has published newer data on later tools.
-   **At team level:** Google's 2024 DORA report found that higher AI adoption was associated with higher self-reported individual productivity, but also with a small estimated drop in delivery throughput (1.5%) and a larger estimated drop in delivery stability (7.2%). These are estimated associations, not proof of cause.

Read together, the picture is this: coding assistants can save serious time on well-defined, repetitive or unfamiliar work. In a large, complex codebase you already know well, the time spent prompting, waiting and fixing generated code can eat the gains. And feeling fast is not the same as being fast.

<div class="callout"><strong>Tip:</strong> If you want to measure the effect of a coding assistant on your team, look at measurable signals rather than impressions: time from review to production, number of reverted changes, and the rate of bugs reaching production.</div>

## Risks: security, licensing and over-reliance

**Security:** in the 2021 study "Asleep at the Keyboard?" by Pearce and colleagues, about 40% of the 1,689 programs Copilot generated across 89 security-sensitive scenarios contained vulnerabilities. In a user study by Perry and colleagues at Stanford, participants with access to an AI assistant wrote insecure code more often in four of five tasks, and were more likely to believe their code was secure. These studies used older models, and today's tools may do better, but the core lesson stands: generated code is not exempt from security review.

**Packages that do not exist:** models sometimes suggest library names that are not real. If an attacker publishes a package under such a name, a developer who installs the suggestion blindly ends up running malicious code. Before adding a dependency, check that the package really exists, who publishes it and how widely it is used.

**Licensing and intellectual property:** generated code can resemble licensed code in the training data. For company use, find out the tool's licensing policy, whether it can filter matches to public code, and whether your code is used for training. Legal questions deserve legal advice.

**Over-reliance and skill loss:** accepting every suggestion without understanding it means speed in the short term and, in the long term, a codebase nobody fully understands. Especially for beginners, actually understanding the code the tool explains is worth more than copying it.

## Good practices

These principles are, in my view, a good starting point for using these tools productively and safely:

1.  **Tests first, code second:** write tests describing the expected behaviour before (or alongside) asking for code. If the tests do not pass, the code is not done.
2.  **Small steps:** give agents bounded, reviewable tasks instead of "rewrite the whole module".
3.  **Human review is non-negotiable:** AI-written code deserves at least as much scrutiny as code from a colleague, not less.
4.  **Automated security checks:** add static analysis, dependency scanning and secret scanning to your CI pipeline.
5.  **Keep secrets out:** API keys, customer data and confidential configuration do not belong in prompts.
6.  **Give context:** collect project rules, code style and architectural decisions in a short document and give it to the tool; results become more consistent.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Autocomplete, chat assistants and coding agents offer different levels of control; agents are the most powerful and need the most care.</li><li>Productivity evidence is mixed: large speed-ups on simple, well-defined tasks, slow-downs reported in large, familiar codebases.</li><li>Research shows that security flaws in AI-generated code and developer over-confidence are real risks.</li><li>Tests, small tasks, human review and automated security scanning are the foundation for using these tools safely.</li></ul></div>

<div class="faq"><details><summary>Will coding assistants replace developers?</summary><p>Current evidence suggests they transform the job but do not remove the need to understand requirements, design, review and take responsibility. The work shifts from typing code towards directing and verifying it.</p></details><details><summary>Should beginners use coding assistants?</summary><p>Yes, but for learning: to have code explained, to understand errors and to see alternatives. A good rule is never to accept code you do not understand.</p></details><details><summary>Is it safe to share company code with these tools?</summary><p>That depends on the tool's data policy and your contract. Do not share sensitive code until you know whether data is used for training, where it is stored and for how long.</p></details></div>

---

**Sources**

-   [Peng et al. (2023), The Impact of AI on Developer Productivity: Evidence from GitHub Copilot, arXiv](https://arxiv.org/abs/2302.06590)
-   [METR (July 2025), Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
-   [Pearce et al. (2021), Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions, arXiv](https://arxiv.org/abs/2108.09293)
-   [Perry et al., Do Users Write More Insecure Code with AI Assistants?, arXiv](https://arxiv.org/abs/2211.03622)
-   [Google Cloud, Announcing the 2024 DORA Report](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report)
