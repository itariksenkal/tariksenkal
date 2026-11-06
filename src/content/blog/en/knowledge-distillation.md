---
title: "Knowledge Distillation and Small Models: Transferring Knowledge from a Large Teacher to a Small Student"
description: "Knowledge distillation transfers a large teacher model’s knowledge into a small, fast student model. We explain soft labels, temperature, and the distillation loss, and why, how, and when it works, with intuitive examples."
publishDate: "2026-08-09T23:23:00+03:00"
lang: en
category: "Efficiency"
tags: ["Efficiency", "AI"]
translation: "model-damitma"
heroImage:
  src: "../../../assets/blog/covers/knowledge-distillation.jpg"
  alt: "Knowledge Distillation and Small Models: Transferring Knowledge from a Large Teacher to a Small Student"
---

The most capable AI models are often the largest ones, but being large is not always practical. A massive model can be slow to respond, too big for your phone, and brutal on your server bill. Knowledge distillation is an elegant idea born to resolve this tension: transfer what a large, skilled “teacher” model knows into a small, fast “student” model. In this post we explain what distillation is using everyday analogies, why it works, and when you should reach for it.

## Distillation in one sentence

Knowledge distillation is a technique that trains a small model (the student) to imitate the rich outputs produced by a large model (the teacher). The goal is a model that preserves as much of the teacher’s accuracy as possible while being far smaller, faster, and cheaper to run.

At the heart of the idea is a simple but powerful observation: training a model not only on the “right answer” but also on “how confident it is and about what” is far more efficient. This idea was popularized in 2015 by the work of Geoffrey Hinton and colleagues.

> Rule of thumb: Distillation compresses knowledge from a large model into a small one; the magic is transferring not just the final answer, but the model’s “way of thinking.”

## The master-apprentice analogy

Picture an experienced chef (the teacher) and an apprentice learning at their side (the student). The apprentice could learn to cook just by reading the dry instructions in a recipe book; that resembles training a model on “correct labels” alone.

But the apprentice masters the craft far faster by standing next to the chef and watching. The chef doesn’t just say “add salt”; they say “this soup can take salt, but only a little, because the cheese is already salty.” That extra information (how close one option is to another, which pitfalls exist) is the teacher’s soft knowledge. Distillation teaches the apprentice not only the result, but these nuances too.

<div class="callout"><strong>Tip:</strong> Think of distillation as “mentorship,” not “copying.” The student doesn’t blindly imitate the teacher; it learns from the teacher’s uncertainties and priorities.</div>

## Why it works: soft labels

At the core of distillation lie **soft labels**. When an image classifier looks at a photo of a cat, it doesn’t just say “cat”; it produces a probability for every class. A hard label states only the single truth:

-   **Hard label:** cat = 1, dog = 0, lion = 0
-   **Soft label (the teacher’s output):** cat = 0.90, dog = 0.07, lion = 0.03

A soft label carries far more information. Beyond telling the model “this is a cat,” it also conveys “but it looks a little like a dog, and nothing like a lion.” This nuanced signal summarizes the hidden relationships (the similarities between classes) the teacher learned over its long training. Hinton calls this “dark knowledge”: the valuable signal that is invisible in the correct answer but hidden in the relative probabilities of the wrong answers.

> The student truly speeds up when it learns not why the teacher is confident, but why it hesitates.

## How it works: temperature and loss

Soft labels can sometimes be too sharp; if the teacher says “cat = 0.99,” the nuance carried by the other classes nearly vanishes. To bring out that nuance, we use a setting called **temperature**.

Temperature is a parameter added to the softmax function. A higher temperature “softens” the probability distribution: it flattens the sharp peak and makes the smaller probabilities more visible. This lets the student see the teacher’s fine distinctions more clearly.

During training the student balances two signals at once:

-   **Distillation loss:** How close is the student’s (softened) output to the teacher’s (softened) output?
-   **Student loss:** How close is the student’s output to the true/hard label?

These two losses are combined with a weighting. This way the student both aims for the correct answer and imitates the teacher’s rich “perspective.”

## A small example (pseudocode)

The pseudocode below shows the skeleton of a typical distillation training step:

```python
def distill_step(teacher, student, x, true_label, T, alpha):
    # The teacher is frozen; no gradients flow through it
    teacher_logits = teacher.predict(x).stop_gradient()
    student_logits = student.predict(x)

    # 1) Softened distributions (with temperature T)
    soft_teacher = softmax(teacher_logits / T)
    soft_student = softmax(student_logits / T)

    # 2) Distillation loss: imitate the teacher
    distill_loss = KL(soft_teacher, soft_student) * (T * T)

    # 3) Student loss: match the true label
    student_loss = cross_entropy(softmax(student_logits), true_label)

    # 4) Combine the two signals with a weight
    total = alpha * distill_loss + (1 - alpha) * student_loss
    return total
```

Here `T` is the temperature and `alpha` is the balance between the two losses. The `T * T` factor compensates for the gradients that shrink as the temperature rises.

## Types of distillation

Distillation isn’t a single method but a family. The three most common approaches are:

-   **Response-based:** The student imitates only the teacher’s final output (the soft labels). This is the most classic and simplest approach.
-   **Feature-based:** The student also imitates the representations in the teacher’s intermediate layers. It learns not just the result, but the “intermediate steps in the thinking process.”
-   **Relation-based:** The student tries to capture the relationships the teacher forms between examples or layers.

For generative language models, a common variant is to turn the high-quality text produced by the teacher directly into training data for the student; this is often called “sequence-level” or data distillation.

## When to use it, when to avoid it

Distillation is no cure-all. It shines in the right scenario:

-   **When latency is critical →** a small model is essential on mobile devices, in the browser, or in real-time applications.
-   **When cost matters →** a small model means less compute and a lower server bill.
-   **When on-device operation is required →** distillation may be the only way when the large model simply won’t fit.
-   **When you have a strong teacher and plenty of unlabeled data →** the teacher can “enrich” that data with soft labels.

There are also cases to avoid:

-   If your teacher model is already weak, the student can’t learn better than it. “Garbage in, garbage out.”
-   If the task is extremely simple, training a small model from scratch may be less trouble.
-   If maximum accuracy is your only priority and you have no hardware constraints, using the large model directly makes more sense.

<div class="callout"><strong>Tip:</strong> Usually think of distillation alongside other shrinking techniques like quantization and pruning; these are not rivals but overlapping layers.</div>

## Real-world examples

Distillation is not an academic curiosity but a widespread practice in the field. In the language-processing world, **DistilBERT** is known as a distilled version of BERT: noticeably smaller and faster, while retaining a large share of its performance. Similarly, work like **TinyBERT** targets more aggressive shrinking by also distilling intermediate-layer representations.

In today’s era of large language models, distillation has shone again: a strong model generates high-quality examples to train models far smaller than itself. This lets even resource-constrained teams carry a meaningful share of giant models’ capabilities into much smaller ones.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Distillation transfers a large teacher model’s knowledge to a small student model.</li><li>The magic is not in the hard labels but in the nuanced “dark knowledge” of the teacher’s soft labels.</li><li>The temperature parameter brings out nuance; training balances the distillation and student losses.</li><li>Distillation is highly valuable when latency, cost, and on-device operation are critical.</li><li>A weak teacher yields a weak student; the teacher’s quality sets the ceiling.</li></ul></div>

<div class="faq"><details><summary>Does distillation always cause an accuracy loss?</summary><p>There is usually a small loss, because the student is smaller than the teacher. But in a well-designed distillation, the student is noticeably better than a model of the same size trained from scratch; for most applications this small loss is acceptable next to the gains in speed and cost.</p></details><details><summary>Can the student be better than the teacher?</summary><p>In rare cases, yes. Soft labels can act as a form of regularization, and the student may surpass the teacher, especially on certain sub-tasks. Still, the typical expectation is to approach the teacher’s performance, not exceed it.</p></details><details><summary>Is distillation the same as fine-tuning?</summary><p>No. Fine-tuning means retraining a model on a new task or data. Distillation focuses on transferring one model’s knowledge into another (usually smaller) model. The two can also be combined: you might fine-tune the large model first and then use it as a teacher.</p></details></div>

---

Knowledge distillation is an elegant answer to the assumption that “bigger is always better”: done right, it carries most of a giant model’s intelligence into one small enough to fit in your pocket. If you’re curious how we balance speed and cost in practice while building Turkish-language AI products, take a look at the approach of [HatsonTech](/en/posts/what-is-hatsontech/).
