---
title: "Using AI Safely at Work: Practical Rules for Everyday Users"
description: "What not to paste into AI tools, data protection basics under Türkiye's KVKK, enterprise vs personal accounts and why outputs need checking: a practical guide."
publishDate: "2026-11-16T09:17:00+03:00"
lang: en
category: "Security"
tags: ["Artificial Intelligence", "Data Protection", "Workplace", "Security"]
translation: "is-yerinde-yapay-zekayi-guvenli-kullanmak"
heroImage:
  src: "../../../assets/blog/covers/using-ai-safely-at-work.jpg"
  alt: "An office worker using an AI assistant on a laptop with a padlock icon"
---

AI assistants speed up everything from writing emails to summarising reports, and many employees started using them long before their company made any official decision. The risk is not the tools themselves but what we feed them. A customer list, a draft contract or a password pasted into a chat box no longer lives only on your computer. In this post I share practical rules an individual employee can follow to use AI safely at work, along with the basics of Türkiye’s data protection law (KVKK), which is the framework I work within. The point is not to scare anyone off; it is to show that a few simple habits let you be both productive and careful.

## Where does the text you paste go?

When you send text to a cloud-based AI tool, it is processed on the provider’s servers and is often stored for some time. Depending on the provider, your account type and your settings, conversations may be reviewed for abuse monitoring or used to improve models. Which of these applies varies between tools and changes over time, so “nobody will ever see it” is not a safe assumption.

This has had real consequences. In May 2023 Samsung restricted employees from using generative AI tools on company devices after discovering that engineers had uploaded sensitive source code to a chatbot. It did not start with malice but with a very ordinary reflex: “let me get this done faster.” Most data leaks begin exactly like that.

## Before you paste: the red lines

A practical rule: if you would not email a piece of information to someone outside the company, do not paste it into an unapproved AI tool. The table summarises the most common risky content.

| Content type | Examples | Why it is risky |
|---|---|---|
| Personal data | Names, national ID numbers, phone numbers, addresses, emails | Covered by data protection law; sharing needs a legal basis |
| Special categories of personal data | Health, biometric data, religion, union membership, criminal records | Protected more strictly; leaks cause serious harm |
| Secrets and credentials | Passwords, API keys, access tokens | Cannot be recalled once out; must be rotated immediately |
| Client and partner documents | Contracts, proposals, correspondence | May breach confidentiality agreements |
| Internal confidential information | Source code, unpublished financials, strategy documents | May qualify as trade secrets |

This does not mean you can never use AI for such work. Often you get the same benefit by **anonymising** the text: “Client A” instead of real names, round example figures instead of real amounts, “a logistics company” instead of the company name. A model does not need to know the parties’ names to improve the wording of a contract clause.

<div class="callout"><strong>Tip:</strong> If you accidentally paste a password or an API key, deleting the conversation is not enough. Revoke the key immediately, create a new one and tell your IT or security team.</div>

## Data protection basics: the KVKK example

In Türkiye, processing personal data is governed by Law No. 6698 on the Protection of Personal Data (KVKK). Sending text that contains personal data to an AI tool counts as processing. Many other jurisdictions, such as the EU under the GDPR, follow similar principles. A few basics worth knowing:

- **Personal data is a broad concept.** Any information that identifies a person directly or indirectly is included, not just ID numbers but also an email address or a unique customer number.
- **Special categories are protected more strictly.** Article 6 of the law sets apart data on health, biometrics and genetics, religion, political opinion, union membership and criminal convictions, among others.
- **Cross-border transfers have their own rules.** If your tool’s servers are abroad, sending personal data there triggers the transfer rules in Article 9. That article was amended by Law No. 7499, and the new regime took effect on 1 June 2024.
- **The authority has published guidance.** On 24 November 2025 the Turkish Personal Data Protection Authority published a guide titled “Generative AI and the Protection of Personal Data (in 15 Questions)”. It covers the impact of generative AI on personal data and points individuals should watch for; it is worth reading together with your compliance team.

This section is for general information only and is not legal advice. For a specific situation, consult your company’s legal or compliance team.

## Enterprise and personal accounts are not the same

Many AI providers offer free or paid plans for individuals and separate enterprise plans for organisations. These can differ significantly on data use: whether conversations are used for model training, how long they are retained, what controls administrators have, and what data processing agreement exists with the provider.

Generalising is risky here, because defaults and terms differ between providers and change over time. Practical suggestions:

- For work information, use the account your company has approved and manages, not your personal one.
- If you use a personal account, find the setting along the lines of “use my data to improve the model” and read what it does.
- Skim the privacy policy and terms of use, at least the sections on data retention and training.
- An “enterprise” label does not settle everything by itself; your company’s contract with the provider and its internal rules are what really count.

## Verifying output is your responsibility

The second half of safe use is less about what you give the tool and more about what you take from it. Language models produce fluent but sometimes wrong answers, confidently citing a regulation that does not exist, a fabricated source or a faulty calculation. The US National Institute of Standards and Technology (NIST), in its generative AI risk profile published in July 2024, lists this as a core risk under the name “confabulation”. I covered it from a more technical angle in my post on [reducing LLM hallucinations](/en/posts/reducing-llm-hallucinations/).

At work, this means that when you send AI-written text, your name is on it. So:

- Check numbers, dates, names and quotes against the original source.
- Do not send legal, financial or technical claims outside without an expert checking them.
- Do not put AI-generated code into production without testing it.
- Where required, disclose AI assistance in line with your company’s rules.

There is also a lesser-known risk: a document or web page you ask an AI to summarise may contain hidden instructions designed to mislead the model. This is known as “prompt injection” and matters especially for assistants that can use tools. I explain it in more detail [here](/en/posts/prompt-injection-jailbreaks/).

## What if your company has no policy?

Many organisations have no written rules on AI use yet, or employees are unaware of them. In that case:

1. **Ask.** Ask IT, security or compliance which tools are approved. The question often prompts someone to write a policy.
2. **Default to caution.** Until rules are clear, work only with public or anonymised information.
3. **Write your own team rules.** Agree on a short list answering “which information can go into which tool”.
4. **Don’t hide mistakes.** If you shared something sensitive by accident, reporting it early is the best way to limit the damage.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>If you would not email it outside the company, do not paste it into an unapproved AI tool.</li><li>Personal data, special-category data, credentials and client documents are red lines; most tasks work fine with anonymised text.</li><li>Data protection law such as Türkiye’s KVKK also covers personal data sent to AI tools; servers abroad add cross-border transfer rules.</li><li>Enterprise and personal accounts may have different data-use terms; check settings and contracts instead of assuming.</li><li>You own the output: verify figures, sources and claims before sending.</li></ul></div>

<div class="faq"><details><summary>Can I freely share text once I have anonymised it?</summary><p>It greatly reduces the risk, but take care. Removing names alone may not be enough: a unique job title, a date and a city together can still identify someone. Remove details that could identify a person indirectly as well.</p></details><details><summary>Is a model running on my own computer safer?</summary><p>Since the data does not leave your device, it is usually more controllable from a privacy standpoint. But installing unapproved software on a work device is a security issue of its own; get your IT team’s approval first.</p></details><details><summary>Do I have to disclose that I used AI to write something?</summary><p>That depends on your company’s rules, your sector and where the text is going. A general legal obligation may not apply in every case, but transparency builds trust. When in doubt, ask your manager or compliance team.</p></details><details><summary>I accidentally shared client data. What now?</summary><p>Delete the conversation, change any related passwords or credentials immediately, and report it to your security or compliance team without delay. They will assess whether the incident requires notification under data protection law.</p></details></div>

---

**Sources**

- [KVKK – Generative AI and the Protection of Personal Data Guide (in 15 Questions, Turkish)](https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda)
- [Mevzuat Bilgi Sistemi – Law No. 6698 on the Protection of Personal Data (Turkish)](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
- [NIST AI 600-1 – Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [Bloomberg – Samsung Bans Staff’s AI Use After Spotting ChatGPT Data Leak (2 May 2023)](https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-and-other-generative-ai-use-by-staff-after-leak)
