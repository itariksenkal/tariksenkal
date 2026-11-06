---
title: "Tokens and Embeddings: How Does a Language Model \"See\" Text?"
description: "An intuitive guide to tokenization, word pieces, and embedding vectors: how the meaning of text turns into numbers and coordinates inside a language model."
publishDate: "2026-08-09T23:14:00+03:00"
lang: en
category: "Fundamentals"
tags: ["Fundamentals", "AI"]
translation: "token-ve-embedding"
heroImage:
  src: "../../../assets/blog/bimg-12.jpg"
  alt: "Tokens and Embeddings: How Does a Language Model \"See\" Text?"
---

A language model does not really "read" letters, words, or sentences. It works only with numbers. So how does a piece of text like "Hello world" turn into numbers inside an AI? This journey has two stops: **tokenization** and **embedding**. In this post we walk, end to end, through how the meaning of text gets translated into mathematics — using everyday analogies.

## Why can't a model read text directly?

A neural network is, at its core, a giant multiply-and-add machine. It accepts only numbers as input and produces only numbers as output. So you cannot hand the word "cat" to a model; you first have to turn it into numbers the model can understand.

Think of using a translation app on your phone in a foreign country: the other person speaks, and the app converts it into your language. A language model also needs a "translation layer" — one that converts text into numbers and numbers back into text. This post is about how that first conversion is done.

> "For a language model, everything is a number. The art of text is being able to turn it into numbers without losing the meaning."

## Tokenization: breaking text into pieces

The first step is **tokenization**: splitting text into small pieces called "tokens." A token can sometimes be a whole word, sometimes a fragment of a word, and sometimes just a punctuation mark. Each token is assigned a number (an identifier, or _ID_) that corresponds to its position in the model's vocabulary.

Picture it roughly like this: the model holds a giant dictionary containing tens of thousands of pieces. Tokenization maps your sentence onto those pieces and writes down each one's index number.

```text
Text:   "Embedding harika!"

Tokens:   ["Embed", "ding", " harika", "!"]
Token IDs:   [ 51234,  3210,    98765,   0 ]

# The model now "sees" the sentence "Embedding harika!"
# as the sequence [51234, 3210, 98765, 0].
```

The IDs above are illustrative; real values depend on the tokenizer in use. The key idea: text is reduced to a sequence of numbers. At this point the model still has no "meaning" — it only knows that "the first piece in the sentence is piece number 51234."

## Why "word pieces" and not whole words?

A natural question arises: why not assign a single number to every word? Because fitting every word in the world into one dictionary is impossible. New words, typos, names, other languages... the dictionary would grow forever. Worse, we would lose the link between related words like "book," "books," and "bookcase."

The solution is **subword** tokenization. The most frequent pieces stay in the vocabulary; rare words are split into smaller, known pieces. Methods like Byte Pair Encoding (BPE) are examples of this approach.

-   **Frequent words** usually become a single token: "home," "go," "and."
-   **Rare or long words** are split into pieces: "tokenization" → "token" + "ization," for example.
-   **Even a never-before-seen word** can be represented at the level of pieces or characters; so the model never simply gives up and says "I don't know this word."

<div class="callout"><strong>Tip:</strong> Morphologically rich languages such as Turkish tend to produce more tokens than English. A sentence with the same meaning may take more tokens in Turkish, which directly affects cost and your speed budget.</div>

## From token to vector: embedding

Token IDs on their own are meaningless. The number 51234 is not "related" to 51233 just because it is one greater. The real magic begins here: each token ID is converted into an **embedding vector**. A vector is simply a list of numbers — it might consist of 768 or 1024 numbers, for instance.

Think of it as a "coordinate of meaning." Just as we locate a city with two numbers, latitude and longitude, the model locates every token as a point in a space of hundreds of dimensions. These coordinates are not random; the model learns them during training by asking, "which words appear in similar contexts?"

```text
"king"   -> [ 0.21, -0.47,  0.88, ... ]   (768 numbers)
"queen"  -> [ 0.19, -0.51,  0.83, ... ]
"banana" -> [-0.62,  0.10, -0.05, ... ]

# The "king" and "queen" vectors sit close together;
# "banana" lives in a far-away region.
```

So the journey of text is: _text → tokens → token IDs → embedding vectors_. The place where the model truly starts to "think" begins from this last step onward.

## Why is meaning a "direction"?

The most beautiful property of the embedding space is that meanings turn into geometry. Words with similar meanings sit close together; those with different meanings drift apart. To measure how much two vectors "point in the same direction," **cosine similarity** is typically used.

The classic example: if you take the "king" vector, subtract the "male" direction, and add the "female" direction, the point you arrive at turns out to be surprisingly close to the "queen" vector. In other words, relationships of meaning correspond to directions in the space. This is the most concrete proof that embeddings are not about "memorizing words" but about "learning the relationships between words."

> "In the embedding space, closeness is closeness in meaning. Distance becomes the map that makes meaning visible."

There is an important subtlety here: in modern language models, a word's vector is not fixed; it changes **with context**. The word "bank" lands in a different place in "river bank" than in "savings bank." The model's layers reshape the initial embedding according to the rest of the sentence.

## What is this good for in practice?

These concepts are not merely theoretical; they are the foundation of many everyday AI applications:

-   **Semantic search:** turning your query and documents into embeddings and finding the nearest vectors is far smarter than keyword search.
-   **Recommendation and clustering:** similar content can be grouped by vector proximity.
-   **RAG (document-grounded answers):** the model finds the most relevant text passages to a question via embedding similarity and grounds its answer in them.

This is why tokenization and embedding are the two invisible yet indispensable gears of modern AI. Tokenizing Turkish text correctly and producing embeddings that capture its meaning well sit at the very heart of what we work on at [HatsonTech](/en/posts/what-is-hatsontech/).

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Language models process numbers, not text; text is converted into numbers first.</li><li>Tokenization splits text into "token" pieces and assigns an ID to each.</li><li>The subword approach solves the unlimited-vocabulary problem and can represent rare words too.</li><li>Embedding turns each token into a coordinate of meaning (a vector) in hundreds of dimensions.</li><li>Words close in meaning sit close together in the space; relationships correspond to directions.</li><li>These two steps are the foundation of applications like semantic search, recommendation, and RAG.</li></ul></div>

<div class="faq"><details><summary>Is a token the same thing as a word?</summary><p>No. A token can sometimes be a whole word, sometimes a fragment of a word, and sometimes just a punctuation mark. Frequent words usually become a single token, while rare or long words are split into several tokens.</p></details><details><summary>Why does an embedding vector consist of hundreds of numbers?</summary><p>Because meaning is multi-faceted. A single number could carry only one feature of a word. Hundreds of dimensions let the model encode many shades of meaning at once (topic, sentiment, grammar, association).</p></details><details><summary>Is the embedding of the same word always identical?</summary><p>The initial (vocabulary) embedding is identical, but in modern models the final representation changes with context. The word "bank" can land in a different vector depending on the sentence; the model's layers reshape the representation based on the rest of the sentence.</p></details></div>

---

In short: a language model does not "read" text — it converts it into numbers and locates its meaning in a space. Tokenization splits text into pieces, while embedding gives those pieces a coordinate of meaning. Without these two quiet steps, none of today's AI sentences would be possible.
