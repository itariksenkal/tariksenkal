---
title: "AI and Copyright: Who Owns What, What's Allowed, What's Unsettled"
description: "A dated, plain-language overview of AI training data, ownership of AI outputs, Türkiye's human-author principle, the EU AI Act and US Copyright Office reports."
publishDate: "2026-11-19T09:17:00+03:00"
lang: en
category: "Society"
tags: ["Copyright", "Artificial Intelligence", "Law"]
translation: "yapay-zeka-ve-telif-hakki"
heroImage:
  src: "../../../assets/blog/covers/ai-and-copyright.jpg"
  alt: "A copyright symbol merged with an AI circuit pattern"
---

When you generate an image with AI, who owns it? Can a language model be trained on millions of books, articles and photos from the internet without permission? These questions no longer concern only lawyers; they matter to designers, writers, agencies and anyone using AI at work. In this post I organise the topic around two main questions, **training data** and **ownership of outputs**, and summarise the core principles of Türkiye’s Law on Intellectual and Artistic Works (FSEK) alongside the European Union and United States approaches, as far as I could verify them as of November 2026. I am an AI developer, not a lawyer, so my aim is not to deliver verdicts but to map the debate.

<div class="callout"><strong>Note:</strong> This post is general information and not legal advice. Rules and court decisions in this area are changing quickly; for a specific situation, consult a lawyer specialising in intellectual property.</div>

## Two separate questions: input and output

AI and copyright are often discussed under one heading, but there are really two different questions:

| Question | Who it concerns | The core issue |
|---|---|---|
| **Input:** Can copyrighted works be used to train a model? | Authors, artists, publishers, model developers | Does copying for training need permission, or does an exception apply? |
| **Output:** Who owns AI-generated content? | Anyone using AI | Is content produced without human creative input a protected work at all? |

There is also a third, more practical question: **what if an output closely resembles someone else’s work?** That is a classic infringement issue, independent of the two above, and it concerns the person who uses the output too.

## Türkiye: FSEK and the human-author principle

In Türkiye, copyright is governed by Law No. 5846 on Intellectual and Artistic Works, dating from 1951. Article 1/B defines a work as an intellectual or artistic product that “bears the characteristics of its owner” (in Turkish, *hususiyet*) and falls into one of the listed categories: science and literature, music, fine arts or cinema. The author is “the person who creates the work”.

Because the law was written long before AI, the debate runs through these existing concepts. The prevailing view in Turkish legal scholarship is roughly this:

- **Originality is tied to a human.** For a product to qualify as a work, it must reflect the creator’s personal characteristics and creative choices, a test linked to human creativity.
- **The author is a natural person.** “The person who creates the work” is interpreted in scholarship and settled practice as a natural person, so an AI system itself cannot be an author.
- **Human contribution is decisive.** If a person using AI as a tool makes creative contributions, such as selecting, arranging, combining and shaping content, that reflect their own characteristics, the result may count as their work. Typing a short prompt and taking the output as-is may not meet that threshold.

Exactly where that line falls is not yet settled and appears likely to be decided case by case.

## United States: the Copyright Office and the courts

In the US, the topic has been addressed in depth by the U.S. Copyright Office’s multi-part report, “Copyright and Artificial Intelligence”.

- **Copyrightability of outputs (Part 2, 29 January 2025):** According to the Office, outputs of generative AI can be protected only where a human author has determined sufficient expressive elements. **Prompts alone are not enough.** However, a human’s own work that is perceptible in an output, creative modifications or arrangements of outputs, and selection and arrangement can be protected. Using AI as an assisting tool does not by itself bar protection. The Office concluded that existing law is adequate and no legislative change is needed.
- **Training (Part 3, 9 May 2025):** The Office released its training report as a “pre-publication version”. It discusses how fair use applies to training on a case-by-case basis and examines licensing options. The Office’s website says a final version will follow.
- **Thaler v. Perlmutter:** Computer scientist Stephen Thaler sought registration for an image listing an AI system as its sole author. On 18 March 2025 the US Court of Appeals for the D.C. Circuit held that copyright requires a human author, and on 2 March 2026 the US Supreme Court declined to hear the case, leaving that ruling in place. The court did not decide how much human involvement is enough for AI-assisted works.

Many lawsuits over whether training qualifies as fair use are still pending in the US and elsewhere, and their outcomes will shape the field significantly.

## European Union: a mining exception plus transparency

The EU approach combines two pieces of legislation.

**The Digital Single Market Directive (2019/790), Article 4:** This provides an exception for text and data mining (TDM). However, for content made publicly available online, rightsholders can **reserve their rights** against this use in an appropriate, machine-readable way, commonly called an “opt-out”. How far methods such as robots.txt files or metadata suffice for this purpose is still debated.

**The EU AI Act (Regulation 2024/1689), Article 53:** This places two key obligations on providers of general-purpose AI models:

1. Put in place a policy to comply with EU copyright law, in particular to identify and respect rights reservations made under Article 4.
2. Publish a **sufficiently detailed public summary** of the content used for training. The European Commission published a template for this summary on 24 July 2025.

These obligations have applied since 2 August 2025, with models placed on the market before that date given until 2 August 2027. Critics note that the summary does not require listing specific works, so individual rightsholders may find it hard to tell whether their content was used.

## What to do in practice as a user

While the legal uncertainty continues, a few cautious habits make sense for anyone using AI professionally:

- **Document your contribution.** If you used AI in a project, keep notes on your own selection, arrangement and editing steps. Showing human input may matter in a dispute.
- **Don’t ask for imitations of recognisable works.** Requesting a close copy of a specific artist, brand or character raises the risk of infringement.
- **Read the terms of use.** Tools differ in how they treat rights in outputs and commercial use.
- **Be open with clients.** If AI was used in work you deliver, agree in advance how the contract and its IP clauses handle that.
- **State your preference for your own content.** If you run a website and do not want your content used for AI training, consider machine-readable rights reservation methods.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>The debate has two legs: using copyrighted works for training, and ownership of AI outputs.</li><li>Under Türkiye’s FSEK a work must bear its owner’s characteristics; prevailing scholarship holds that the author must be a natural person.</li><li>The US Copyright Office says prompts alone are not enough for protection; human selection, arrangement and modification can be protected.</li><li>In the EU, rightsholders can opt out of text and data mining, and general-purpose model providers must have a copyright policy and publish a training-content summary.</li></ul></div>

<div class="faq"><details><summary>Can I use an AI-generated image commercially?</summary><p>Most tools allow commercial use, but that does not mean the image is protected by copyright or that it does not infringe someone else’s rights. Read the tool’s terms and make sure the image does not imitate a recognisable work or brand.</p></details><details><summary>Does writing a prompt make me the author?</summary><p>According to the US Copyright Office, prompts alone are not enough. Under Turkish law, too, what matters is whether the result contains a creative contribution reflecting your own characteristics, which is judged case by case.</p></details><details><summary>Can I stop my content from being used to train AI?</summary><p>In the EU, rightsholders can reserve their rights against text and data mining for content published online, using machine-readable means. How effective these methods are in every case is debated, and rules differ in other countries.</p></details><details><summary>Does Türkiye have a specific law on AI and copyright?</summary><p>FSEK was written long before AI, and the debate currently runs largely through its existing concepts. Since new rules or court decisions may emerge, it is best to follow the current position with the help of a specialist.</p></details></div>

---

**Sources**

- [Lexpera – Law No. 5846 on Intellectual and Artistic Works (Turkish)](https://www.lexpera.com.tr/mevzuat/kanunlar/fikir-ve-sanat-eserleri-kanunu-5846)
- [U.S. Copyright Office – Copyright and Artificial Intelligence](https://www.copyright.gov/ai/)
- [U.S. Copyright Office – Copyright Office Releases Part 2 of Artificial Intelligence Report](https://copyright.gov/newsnet/2025/1060.html)
- [Baker Donelson – Supreme Court Denies Certiorari in Thaler v. Perlmutter](https://www.bakerdonelson.com/supreme-court-denies-certiorari-in-thaler-v-perlmutter-ai-cannot-be-an-author-under-the-copyright-act)
- [EUR-Lex – EU Artificial Intelligence Act, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
