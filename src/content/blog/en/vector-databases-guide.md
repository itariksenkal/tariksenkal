---
title: "Vector Databases Guide: Similarity Search, HNSW, and FAISS / pgvector / Qdrant Compared"
description: "An intuitive guide to vector databases: similarity search, ANN and the HNSW algorithm, a FAISS vs pgvector vs Qdrant comparison, and when to choose each one."
publishDate: "2026-08-09T23:12:00+03:00"
lang: en
category: "Infrastructure"
tags: ["Infrastructure", "AI"]
translation: "vektor-veritabanlari"
heroImage:
  src: "../../../assets/blog/covers/vector-databases-guide.jpg"
  alt: "Vector Databases Guide: Similarity Search, HNSW, and FAISS / pgvector / Qdrant Compared"
---

When you walk into a library and say "I want something like this book," the librarian doesn't ask for the ISBN; they think about the topic, the tone, the feeling. That is exactly what vector databases do: they search not for exact word matches but for the _closeness of meaning_. In this guide I'll explain, intuitively, how similarity search works, what approximate-neighbor algorithms like HNSW do, and when to reach for FAISS, pgvector, or Qdrant.

## 1\. What is a vector, and why similarity search?

An embedding model turns a piece of text, an image, or a sound into a list of numbers — a **vector**. That vector is like the "meaning coordinates" of the content. Similar items land close to each other in a high-dimensional space. "Dog" sits near "cat," while "dog" is far from "accounting."

A traditional database query looks for exact matches: `WHERE title = 'dog'`. A vector search instead says "the 10 records closest in meaning." This is the heart of modern search, recommendation systems, and especially RAG (retrieval-augmented generation) architectures.

> Key idea: a vector database is a tool for finding nearest neighbors on a "map of meaning" — not a classic B-tree index.

## 2\. Distance metrics: how closeness is measured

We measure how "similar" two vectors are with a distance (or similarity) metric. The three most common are:

-   **Cosine similarity:** looks at the angle between two vectors — it cares about direction, not magnitude. It's the most common choice for text embeddings.
-   **Euclidean distance (L2):** the straight-line distance between two points. Intuitive; the most natural answer to "how far apart are they?"
-   **Dot product:** accounts for both direction and magnitude together; some recommendation models are trained for it.

By analogy: cosine asks "are they facing the same way?", while Euclidean asks "how physically close are they?" Which metric you use depends on how the embedding model was trained; matching the metric the model recommends is a good default rule.

## 3\. ANN and HNSW: the secret behind the speed

If you have a million vectors, finding the 10 closest to your query by computing the distance to every single one (brute force) is correct but slow. This is where **approximate nearest neighbor** (ANN) algorithms come in: in exchange for a tiny accuracy trade-off, they buy you enormous speed.

The most popular ANN method today is **HNSW** (Hierarchical Navigable Small World). Think of HNSW as a flight network: the top layer only has major hub airports (long, intercontinental hops); as you descend, more local flights appear. The search begins at the top, sparse layer, gets roughly close to the target, then drops to lower layers to fine-tune. You reach the destination fast, without visiting every point.

<div class="callout"><strong>Tip:</strong> two HNSW settings are critical: <code>M</code> (number of neighbors per node; affects memory and accuracy) and <code>ef</code> (the breadth of the walk at query time; the speed–accuracy trade-off). Raising <code>ef</code> improves accuracy but slows the query.</div>

A simplified flow looks like this:

```python
function ann_search(query_vector, k):
    entry = entry_node_in_top_layer
    # descend from the top layers, getting roughly close
    for layer in top_to_bottom:
        entry = find_closest_in_layer(entry, query_vector)
    # fine search in the bottom layer with breadth ef
    candidates = priority_queue(size = ef)
    expand(candidates, entry, query_vector)
    return candidates.top_k(k)   # the k nearest neighbors
```

Other families exist too: **IVF** (partitions the vector space into clusters and scans only the relevant ones) and **PQ** (Product Quantization — compresses vectors to shrink memory). In practice these are often combined (e.g., IVF+PQ).

## 4\. FAISS vs pgvector vs Qdrant

The difference between these three popular tools really hides in the question of "what they are":

-   **FAISS** is a _library_, not a database. Built by Meta, this C++/Python tool offers very high-performance ANN indexes with strong GPU support. But you add the "database" features yourself — persistence, filtering, a network API, authentication.
-   **pgvector** is an _extension_ for PostgreSQL. It lets you store vectors right next to your relational data, so you can filter and JOIN them with SQL. It supports HNSW and IVFFlat indexes. If you already run Postgres, the added infrastructure cost is nearly zero.
-   **Qdrant** is a _vector database_ designed for vectors end to end, written in Rust. It ships with an HNSW index, rich payload filtering, clustering/distributed operation, and REST/gRPC APIs. It's built for those targeting large scale and operational maturity.

A rough positioning:

| Feature | FAISS | pgvector | Qdrant |
| --- | --- | --- | --- |
| Type | Library | Postgres extension | Standalone DBMS |
| Index | HNSW, IVF, PQ… | HNSW, IVFFlat | HNSW |
| Metadata filtering | Limited | Full SQL | Rich payload |
| Network API | None (embedded) | Via SQL | REST + gRPC |
| GPU | Strong | None | Limited |

## 5\. When to use which?

-   **Choose pgvector** if you already use PostgreSQL, your data volume is moderate, and you want to keep vectors in one place alongside your relational data. This is the lowest operational overhead.
-   **Choose Qdrant** if you want a full-featured vector service with large scale, fast filtered searches, horizontal scaling, and a ready-made API.
-   **Choose FAISS** if you're willing to build your own layer for maximum performance and flexibility, want to leverage GPUs, or are working in a research/prototype setting.

<div class="callout"><strong>Tip:</strong> the "right" choice usually depends less on technical superiority and more on your team's operational capacity. The fastest index is no better than one you can't maintain.</div>

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Vector search looks for closeness of meaning, not exact matches.</li><li>The metric (cosine/Euclidean/dot product) depends on the embedding model.</li><li>HNSW is the dominant ANN method, trading a tiny bit of accuracy for big speed.</li><li>FAISS is a library, pgvector a Postgres extension, Qdrant a standalone vector DBMS.</li><li>The choice is shaped by your scale and operational capacity; the tool you can sustain wins, not the flashiest one.</li></ul></div>

<div class="faq"><details><summary>Does a vector database replace a normal database?</summary><p>No. Most systems use both: a relational/document database holds the source data, while the vector layer does semantic search. Solutions like pgvector merge the two into a single engine.</p></details><details><summary>Is HNSW always the best choice?</summary><p>It's an excellent default in most cases, but its memory consumption is high. In very large, memory-constrained scenarios, compressed methods like IVF+PQ can be more suitable.</p></details><details><summary>Doesn't approximate search return wrong results?</summary><p>"Approximate" means it may occasionally miss one of the best neighbors. In practice recall can be tuned to the 95–99% range; parameters like <code>ef</code> let you set the accuracy–speed balance yourself.</p></details></div>

---

Choosing a vector database is an architectural decision, not just a tool pick: weigh your scale, your team's operational capacity, and your existing stack together. If you're curious how we approach decisions like these when moving semantic search and RAG systems into production, take a look at [HatsonTech](/en/posts/what-is-hatsontech/)'s approach.
