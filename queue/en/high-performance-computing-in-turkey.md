---
title: "High-Performance Computing in Türkiye: TRUBA, EuroHPC and Access"
description: "What a supercomputer is, what TRUBA offers, where Türkiye stands in EuroHPC, and how researchers and startups can apply for compute time, with dates."
publishDate: "2026-11-22T09:17:00+03:00"
lang: en
category: "Infrastructure"
tags: ["Supercomputing", "Artificial Intelligence", "Research Infrastructure"]
translation: "turkiyede-yuksek-basarimli-hesaplama"
heroImage:
  src: "../../../assets/blog/covers/high-performance-computing-in-turkey.jpg"
  alt: "Rows of supercomputer cabinets in a data centre"
---

A climate simulation, a molecular screen for a new drug, the training of a Turkish language model: what these have in common is that a single computer would need years to finish them, so they rely on many processors working together. High-performance computing (HPC) exists for exactly this. As AI models have grown, the topic has moved beyond physicists and meteorologists and onto the agenda of founders and social scientists too. In this post I summarise what a supercomputer is, Türkiye's national infrastructure (TRUBA), the country's place in the European EuroHPC initiative, and how to apply for these resources, with a date attached to each claim.

## What is a supercomputer, really?

Think of a supercomputer as a "cluster": thousands of servers connected by a very fast network. Each server holds many processor cores and, increasingly for AI and scientific work, graphics processors (GPUs). A large job is split into pieces, the pieces run at the same time on different nodes, and the results are combined.

Raw power is usually measured in floating-point operations per second (FLOP/s), and the world's most powerful systems are ranked twice a year in the **TOP500** list. For users, though, what matters more than peak power is how, and on what terms, you can actually get access to it.

## TRUBA: Türkiye's national computing infrastructure

**TRUBA** (the Turkish National e-Science e-Infrastructure) is the national HPC service run by TÜBİTAK ULAKBİM since 2003. According to a TÜBİTAK article from January 2024, by the end of 2023 it served more than 6,000 researchers from 180 institutions, and its new ARF system had been delivered at the end of 2023.

Recent growth has been most visible on the GPU side:

-   **ARF-ACC**, the accelerated partition of ARF, was equipped with H100 GPUs in 2024, and 192 NVIDIA H200 GPUs were added in 2025.
-   According to TÜBİTAK's announcement of 28 November 2025, ARF-ACC climbed from 266th to 145th place in the TOP500 list published on 18 November 2025, and ranked 45th in the Green500 energy-efficiency list.
-   In a statement on 20 October 2025, Minister of Industry and Technology Mehmet Fatih Kacır said the TRUBA-ARF infrastructure has more than 80,000 processor cores, 504 GPUs and 14 petabytes of storage.

Most TRUBA users are at universities and research institutions. TÜBİTAK officials have said the system has long been available to private companies for a fee, with researchers given priority when capacity is tight.

<div class="callout"><strong>Tip:</strong> TRUBA and similar systems run on the Linux command line with a job scheduler. Learning basic Linux commands, how to connect to a remote server and how to write a simple script before you apply will make your first weeks far more productive.</div>

## Türkiye and EuroHPC

The **EuroHPC Joint Undertaking** (EuroHPC JU) pools funding to build supercomputing infrastructure in Europe and open it to researchers. According to TÜBİTAK, Türkiye joined EuroHPC in April 2019.

One concrete result is Türkiye's partnership in **MareNostrum 5** at the Barcelona Supercomputing Center (BSC). In his October 2025 statement, Minister Kacır put Türkiye's share of MareNostrum 5 at more than 70,000 cores and 446 GPUs.

On the AI side, EuroHPC has run the **AI Factories** initiative since 2024: hubs built around supercomputers that offer compute, technical support and data services to startups, researchers and the public sector. According to TÜBİTAK's announcement of 19 December 2024, Türkiye joined the Spanish-led **BSC AI Factory** consortium as a partner, alongside Portugal and Romania; that project was one of the seven AI Factories selected in the first round. Later rounds added factories in other countries and linked "antennas". Because the programme is expanding quickly, I would check the official EuroHPC and TÜBİTAK announcements for Türkiye's current role rather than rely on any summary.

## How can researchers and startups apply?

Access routes fall roughly into these groups:

| Resource | Who it is for | How |
|---|---|---|
| TRUBA | Researchers, faculty, students; private sector for a fee | Individual account application via portal.truba.gov.tr |
| EuroHPC general access calls | Academia, public sector and industry | Benchmark, development, regular and extreme-scale calls |
| EuroHPC AI Factories access | Mainly AI startups and SMEs | Playground, Fast Lane and Large Scale modes |

**TRUBA:** Applications are made individually. According to introductory documents published by universities, students need a confirmation email from the faculty member they work with. Acknowledging TRUBA in papers, conference talks and theses that use results obtained on it is one of the conditions of use. TRUBA's own documentation is the authority on current requirements.

**EuroHPC:** According to EuroHPC's own FAQ, compute time awarded through its access calls is free of charge, and Türkiye is on the list of eligible countries. The AI Factories offer three access modes:

-   **Playground:** quick, entry-level access for new and small-scale users, startups and SMEs.
-   **Fast Lane:** medium-sized requests of up to 50,000 GPU hours, open continuously with no cut-off dates.
-   **Large Scale:** requests above 50,000 GPU hours, reviewed by an expert panel.

Which systems are open in which mode changes over time, and some systems are temporarily closed to new requests. Always check EuroHPC's current call pages before applying.

## What to prepare before you apply

Whichever resource you target, reviewers tend to ask similar questions:

1.  **Why HPC?** Explain with numbers why the problem cannot be solved on a single server.
2.  **How much?** Estimate your GPU or core hours with a small pilot run; "the more the better" does not persuade anyone.
3.  **Is the code ready?** Show that your code scales across multiple GPUs or nodes.
4.  **Data and privacy:** if you use personal or sensitive data, explain the safeguards.

A good habit on shared systems like TRUBA is to run a small-scale test before launching the big job, and to enter the queue with a realistic resource request. On shared systems, asking for more than you need usually just means waiting longer in the queue.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>A supercomputer is a cluster of thousands of servers linked by a fast network; GPU capacity is increasingly decisive for AI.</li><li>TRUBA has been Türkiye's national HPC infrastructure under TÜBİTAK ULAKBİM since 2003; ARF-ACC reached 145th in the November 2025 TOP500.</li><li>Türkiye has been part of EuroHPC since 2019, is a MareNostrum 5 partner, and joined the BSC AI Factory consortium in December 2024.</li><li>EuroHPC access calls are free, and applicants based in Türkiye are eligible.</li><li>A strong application shows the need, a resource estimate and evidence that the code scales.</li></ul></div>

<div class="faq"><details><summary>I am an undergraduate. Can I use TRUBA?</summary><p>In general, students can open an account with the approval of a faculty member they work with. Check the TRUBA portal and documentation for the current, detailed conditions.</p></details><details><summary>Can a startup get free GPU time?</summary><p>EuroHPC's AI Factories access calls are free and specifically target startups and SMEs. TRUBA is open to the private sector for a fee. Either way, you will be expected to describe your project and resource needs clearly.</p></details><details><summary>Why bother with HPC when cloud providers exist?</summary><p>Cloud is flexible, but costs climb quickly for large, long training jobs. Publicly funded HPC can largely remove that cost for research and early-stage innovation; in return you work within application processes, queues and usage rules.</p></details></div>

---

**Sources**

-   [TÜBİTAK, New opportunities in supercomputing: MareNostrum 5 and TRUBA (January 2024, in Turkish)](https://tubitak.gov.tr/tr/haber/super-bilgisayar-odakli-cozumlerde-yeni-imkanlar-ve-firsatlar-marenostrum-5-ve-truba)
-   [TÜBİTAK, ARF-ACC supercomputer at TRUBA rises in world rankings (November 2025, in Turkish)](https://tubitak.gov.tr/tr/haber/trubadaki-arf-acc-super-bilgisayari-dunya-siralamasinda-buyuk-basari-elde-etti)
-   [TÜBİTAK, National Artificial Intelligence Factory Established (December 2024)](https://tubitak.gov.tr/en/news/national-artificial-intelligence-factory-established)
-   [EuroHPC JU, AI Factories FAQs](https://eurohpc-ju.europa.eu/ai-factories/faqs-ai-factories_en)
-   [EuroHPC JU, Fast Lane Access to AI Factories](https://eurohpc-ju.europa.eu/ai-factories/ai-factories-access-calls/fast-lane-access-ai-factories_en)
-   [DHA, Minister Kacır on supercomputing capacity (October 2025, in Turkish)](https://www.dha.com.tr/politika/bakan-kacir-super-bilgisayar-kapasitesiyle-bilim-ve-muhendislik-alaninda-yenilikci-projelere-ivme-kazandiriyoruz-2742278)
