---
title: "RLHF and Model Alignment: Helpful and Safe Models, the Reward Model, and DPO"
description: "Why and how do we make a model \"helpful and safe\"? We explain the three steps of RLHF, the reward model, and the simpler alternative DPO using everyday analogies."
publishDate: "2026-08-09T23:18:00+03:00"
lang: en
category: "Alignment"
tags: ["Alignment", "AI"]
translation: "rlhf-nedir"
heroImage:
  src: "../../../assets/blog/covers/rlhf-model-alignment.jpg"
  alt: "RLHF and Model Alignment: Helpful and Safe Models, the Reward Model, and DPO"
---

A raw language model is like a genius who has read the entire internet but never learned any manners: it knows a great deal, yet it doesn't know when to stay quiet, which request is dangerous, or how to actually _answer_ a question helpfully. The fine-tuning layer that makes a model "helpful and safe" is what we call **alignment**. In this article we'll explore alignment intuitively, explaining why and how RLHF (reinforcement learning from human feedback) works, the role of the reward model, and a newer, simpler alternative called DPO, using everyday analogies.

## Why alignment? Knowing vs. behaving

The pretraining of a language model rests on one simple objective: given a piece of text, predict the next word. This objective is surprisingly powerful; through it the model learns grammar, facts, style, and even a degree of reasoning. But the objective has a blind spot: the model learns to produce the _most likely_ continuation, not the _most helpful_ or _safest_ one.

As a result, a raw model tends to respond to a request like "Tell me how to build a bomb" by following the patterns it saw online — because to it, this is merely "completing the text." Likewise, instead of answering a question it might list five similar questions, because that's how forum threads look in its training data.

> Knowing and behaving are different things. A raw model _knows_ a lot; alignment teaches it how to _behave_.

The goal of alignment is often summed up in three words: **helpful, honest, and harmless**. Helpful means serving the user's real intent; honest means not making things up when it doesn't know; harmless means politely declining requests that would cause harm. RLHF is a way not of "telling" the model these three values, but of _showing_ them through examples.

## RLHF in three steps

We can liken RLHF to bringing an apprentice up to mastery. First you show them a few good examples, then you evaluate what they do and give feedback, and finally you help them internalize that feedback so they can do good work on their own. RLHF consists, roughly, of these three stages:

1.  **Supervised fine-tuning (SFT):** human-written example question–answer pairs show the model "this is what a good answer looks like." This is like showing the apprentice a few masterful examples.
2.  **Reward model training:** humans compare two answers to the same question and mark which is better. From these preferences, a separate model is learned that turns the sense of "a good answer" into a number.
3.  **Reinforcement learning:** the main model is nudged, little by little, toward producing answers that score high with the reward model.

The crucial point is this: in the second step, humans are not asked to _write answers from scratch_; they are only asked to _compare_. Saying which of two answers is better is far easier and more consistent than writing a perfect answer up front. Much of RLHF's practical genius lies in this simplification.

## The reward model: turning taste into a number

Suppose you had thousands of answer pairs rated by humans. But during training the model will produce hundreds of answers per second; asking a human about each one is impossible. This is where the **reward model** fills the gap: a model that learns human preferences and can give a "how good is this" score even to a new, unseen answer.

The reward model doesn't define "helpfulness" with a formula; instead, by looking at which answer humans chose, it arrives at an _implicit_ estimate of taste. Like a restaurant critic who develops a palate by tasting thousands of dishes, without knowing the rules by heart.

```text
# A reward model learns from human preference (conceptual)
# Data: two answers to the same request + the human's choice

example = {
  "request":  "Suggest ways to reduce stress.",
  "answer_A": "Regular sleep, short walks, breathing exercises...",
  "answer_B": "I don't know, look it up online.",
  "choice":   "A"   # the human preferred A
}

# Goal: the reward model R should score the preferred answer higher
#   R(request, answer_A) > R(request, answer_B)
# Training tries to satisfy this inequality across all pairs.
```

<div class="callout"><strong>Tip:</strong> A reward model is only as good as the human preferences that trained it. If the labeling guidelines are vague or the labelers hold different values, the model inherits that inconsistency exactly. The "garbage in, garbage out" rule applies here too.</div>

## Reinforcement: chasing the reward

We now have a reward model that can score any answer. In the final step we tune the main language model toward producing answers that raise that score. This is classic reinforcement learning: the model "tries" an answer, the reward model "gives" a score, and the model updates itself based on that score. The most widely used algorithm has been PPO (Proximal Policy Optimization).

But there's a hidden danger here: the model may find ways to _fool_ the reward model without actually being good. This is called **reward hacking**. For example, the model might notice that the reward model likes long, polite answers, and start producing empty-but-needlessly-long, overly courteous text.

> If a student learns the tricks of the exam instead of truly learning, the grade goes up but knowledge does not. Reward hacking is exactly that.

That's why a balancing force is added to training: the model is penalized for drifting too far from its initial (SFT) state. This way, while chasing the reward, the model also stays "itself," its language doesn't degrade, and it doesn't veer into strange shortcuts. In practice this is a careful balance between raising the reward and staying faithful to the original behavior.

## DPO: a shortcut without a reward model

RLHF is powerful but cumbersome: training a separate reward model and then running a reinforcement loop that can be unstable is expensive, both in time and in engineering. **DPO (Direct Preference Optimization)** is a newer method proposed to shorten much of this process.

DPO's core idea is surprisingly elegant: you use the human preference data (A is better than B) directly to train the model itself. Instead of training a separate reward model and then chasing it with reinforcement, you train the model in a single step to "raise the probability of the preferred answer and lower the probability of the non-preferred one."

```text
# The intuition behind DPO (conceptual)
# Each example: a request + preferred (winner) + non-preferred (loser) answer

for (request, winner, loser) in preference_data:
    # push the winner's probability up, the loser's down
    # but don't drift too far from the reference model (balance term)
    loss = -log_sigmoid(
        beta * ( logp(winner) - logp_ref(winner)
               - logp(loser)  + logp_ref(loser) )
    )
    update_model(loss)
```

The difference is this: in RLHF, preferences are first "distilled" into a reward model, which is then chased. DPO turns preferences directly into a training loss; the reward model disappears, and the instability of the reinforcement loop is largely reduced. Fewer moving parts means fewer points of failure.

This doesn't mean DPO is always better. Keeping the reward model separate offers some flexibility, and at very large scales and for complex objectives, classic RLHF may still be preferred. Think of DPO as a simple, robust alternative that is sufficient in most situations.

## Limits and things to watch for

Alignment is not a magic wand; it doesn't make a model flawless or neutral. It's worth keeping a few realities in mind:

-   **Human preferences are subjective:** "a good answer" varies by culture, context, and person. The model inherits the values of the labeler group that trained it; those values don't always represent everyone.
-   **Risk of over-caution:** a model that leans too hard into harmlessness may needlessly refuse requests that are actually harmless. A constant balance between helpfulness and safety is required.
-   **Alignment doesn't guarantee truth:** a model can learn to produce answers that "sound right," which isn't always the same as being _actually correct_. Hallucination decreases after alignment but doesn't disappear.
-   **Reward hacking is always lurking:** whatever method you use, the metric you optimize is a flawed proxy for the real goal; the model can find the gaps.

<div class="callout"><strong>Tip:</strong> When you put an aligned model into your own product, test the model's refusal and acceptance boundaries against your specific use case. General alignment is a good start, but domain-specific safety rules often call for an extra layer.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>A raw model knows a lot but doesn't know how to behave; alignment fills that gap with examples.</li><li>RLHF has three steps: supervised fine-tuning, reward model, reinforcement.</li><li>Humans are asked to compare two answers, not write one; this is both easier and more consistent.</li><li>Reward hacking is a real risk; the model can fool the score without truly being good.</li><li>DPO skips the reward model and the reinforcement loop, turning preferences directly into training; it's simpler and more stable.</li></ul></div>

<div class="faq"><details><summary>Are RLHF and fine-tuning the same thing?</summary><p>Not quite. Classic fine-tuning shows the model examples of "this is the right answer" (supervised learning). RLHF uses human <em>preferences</em>: it learns which answer is better than another. RLHF's first step is itself a fine-tuning; it then adds a preference-based layer on top.</p></details><details><summary>Does DPO completely replace RLHF?</summary><p>In many practical scenarios DPO is simpler and sufficient, which is why it caught on. But there are very large and complex alignment goals where the flexibility of a separate reward model is valuable. It's best to see the two not as rivals but as two roads to the same destination.</p></details><details><summary>Why does an aligned model still make mistakes?</summary><p>Because alignment shapes behavior; it doesn't perfect knowledge. The model learns to produce answers that "sound right," which sometimes doesn't match reality (hallucination). Also, the reward being optimized is a flawed proxy for the real goal, and the model can find those gaps.</p></details></div>

---

In short, alignment transforms a raw model from a being that "knows everything but doesn't know how to behave" into a genuinely helpful and safe assistant. RLHF does this with human preferences; DPO reaches the same goal by a simpler route. In both cases, one thing sits at the heart of the work: accurate, consistent human feedback that reflects your values. If you're considering designing a safe, fit-for-purpose AI layer for your own product, the [HatsonTech](/en/posts/what-is-hatsontech/) team would be glad to weigh these decisions with you.
