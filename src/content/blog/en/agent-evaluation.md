---
title: "Agent Evaluation: How Do You Measure a Multi-Step System?"
description: "Evaluating an agent is not the same as scoring one answer. Task success, step quality, tool choice, cost and robustness testing in a practical agent evaluation framework."
publishDate: "2026-08-09T23:29:00+03:00"
lang: en
category: "Agents"
tags: ["Agents", "AI"]
translation: "ajan-degerlendirmesi"
heroImage:
  src: "../../../assets/blog/bimg-17.jpg"
  alt: "Agent Evaluation: How Do You Measure a Multi-Step System?"
---

Evaluating a single-turn model is comparatively easy: you compare the answer against a reference. An agent takes fifteen steps, calls three tools, hits an error, backtracks, and eventually produces something. Here "is it correct?" is not enough on its own — you also need to know **what happened at which step**.

## Four layers of measurement

-   **Task success:** did the user get what they asked for? This should be binary and uncontroversial.
-   **Trajectory quality:** was the result reached by a sensible route, or by luck?
-   **Efficiency:** how many steps, how many tokens, how long?
-   **Safety:** did it exceed its authority or do something irreversible?

## Outcome or trajectory

Looking only at the outcome is tempting and misleading. An agent that reaches the right answer by the wrong route collapses as soon as conditions shift slightly. The converse also holds: an agent whose route was sound and which erred on the final step is far easier to fix.

The practical approach records both: score the outcome as binary and log the trajectory so it can be inspected step by step.

<div class="callout"><strong>The golden rule:</strong> you cannot develop an agent without a reproducible task set. Trying a few examples by hand will never catch regressions.</div>

## Measuring tool choice

| Error type | Symptom |
| --- | --- |
| Wrong tool | Another tool is called when the right one exists |
| Missing call | The model invents instead of using a tool |
| Unnecessary call | An expensive tool is called when the answer is known |
| Bad parameters | Right tool, wrong arguments |

These four have different fixes: the first needs clearer tool definitions, the second a tighter instruction, the third routing, the fourth schema validation. You cannot improve what you have not separated.

## Robustness tests

In the real world tools fail, APIs time out and documents come back incomplete. A good evaluation set includes these deliberately: a malformed tool response, an empty result set, two contradictory sources. What the agent does in those situations tells you more than its performance under ideal conditions.

The single most valuable test is this: _what does it do when it does not know?_ An agent that invents is the most expensive agent in production.

## Cost and latency are metrics

Accuracy alone is meaningless in agent evaluation. A version that is two percent more accurate and three times more expensive counts as a regression for most products. Every evaluation run should report average tokens and duration per task.

## Frequently asked questions

<div class="faq"><details><summary>Does LLM-as-judge work for agents?</summary><p>For subjective dimensions such as trajectory quality, yes — but task success should be checked programmatically where possible. A vague judge produces a vague metric.</p></details><details><summary>How many tasks are enough?</summary><p>Fifty well-chosen tasks beat five hundred random ones. Diversify the coverage: easy, hard, adversarial, and tasks that should fail.</p></details><details><summary>Why do agent results differ between runs?</summary><p>Sampling is stochastic. Run each task several times and report a success rate; a single run is not a measurement.</p></details></div>

---

Agent evaluation is the infrastructure that sets your development speed: a system you cannot measure can only be improved by guesswork. For more, see [LLM evaluation](/en/posts/llm-evaluation/) and [observability](/en/posts/llm-observability/).
