---
title: "Function Calling and Structured Output: Turning the Model into a Reliable Component"
description: "Function calling and structured output turn a language model from a free-text chatter into a component you can wire into your systems with confidence. We explain JSON generation, schema enforcement, and robust integration practices with intuitive examples."
publishDate: "2026-08-09T23:20:00+03:00"
lang: en
category: "Integration"
tags: ["Integration", "AI"]
translation: "fonksiyon-cagirma"
heroImage:
  src: "../../../assets/blog/bimg-06.jpg"
  alt: "Function Calling and Structured Output: Turning the Model into a Reliable Component"
---

When you used to ask a language model "What's the weather in Istanbul?", it would answer with a paragraph of prose, even though all you wanted were the two pieces of information needed to call a weather API: city and unit. Function calling (tool calling) and structured output turn the model from a chatty conversationalist into a component that plugs cleanly into your software. In this post we explain, intuitively, how the model produces JSON, how we enforce a schema, and how to make the integration reliable.

## The problem: free text doesn't talk to machines

Humans love ambiguity; software doesn't. The sentence "Set up a meeting around three tomorrow" is clear to a person but meaningless to a calendar API. What the API needs is concrete: a start time, a duration, attendees. So a free-form sentence has to be turned into a data structure the machine can consume directly.

This is exactly where function calling steps in. You steer the model: "understand this sentence and fill in this template." The model no longer writes prose; it produces a _call intent_: which function, with which arguments.

> Function calling isn't about the model reading data from your code; it's about your code reading data from the model. The direction reverses.

## How function calling works

Think of the flow as a restaurant. You (the application) hand the menu (the list of available tools) to the waiter (the model). The customer (the user) orders in natural language: "Something spicy, cooked rare." The waiter translates that wish into a ticket the kitchen understands: `{dish: "meatballs", spicy: true, doneness: "rare"}`. The kitchen (your code) reads the ticket, prepares the food, and the waiter brings the result back to the table.

Technically, the steps are:

1.  The application sends the model the user message plus **tool definitions** (name, description, parameter schema).
2.  Instead of replying directly, the model returns a **tool call**: a function name and JSON arguments.
3.  The application **actually executes** that call (hits the API, queries the database).
4.  The result is fed back to the model, which summarizes it in natural language or proceeds to the next step.

The crucial point: the model itself does not execute the function. It merely says "I want to call this function with these arguments." Execution stays entirely under your control, which matters for security and auditability.

## The schema: a form you hand the model

A schema is a blank form you give the model. A well-designed form dramatically raises the odds it gets filled in correctly. Most providers use **JSON Schema** to describe parameters. Below is a simple definition of a weather tool:

```json
{
  "name": "get_weather",
  "description": "Returns the current weather for a given city.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city":  { "type": "string", "description": "e.g. Istanbul" },
      "unit":  { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["city"]
  }
}
```

Every detail here sends a signal to the model. The `description` fields help the model understand when and how to use the tool; don't skip them. With `enum` you constrain valid values, so the model can't invent free text like "centigrade." And `required` declares which fields are mandatory.

<div class="callout"><strong>Tip:</strong> Write description fields like documentation, not like keywords. Instead of "city name," writing "the city to query weather for; if the country is ambiguous, default to Turkey" makes it far easier for the model to decide correctly.<p></p></div>

## Enforcing the schema: asking nicely vs. imposing the rule

There are two distinct levels of guarantee when handing a schema to a model, and conflating them is the source of most bugs.

### 1\. A verbal request (via the prompt)

You can tell the model "please respond in this JSON format." This often works, but it is not a guarantee. The model sometimes adds explanatory text, forgets a comma, or drops a field. This approach is fine for quick prototypes; for production it is fragile.

### 2\. Structural enforcement (constrained decoding)

Many modern providers _constrain_ the output against the schema at generation time. That is, as the model picks each token, options that would break the schema are eliminated up front. The result: JSON that conforms to the schema grammatically. This is usually called "structured output," "JSON mode," or, for tool calls, "tool use."

An important distinction: structural enforcement guarantees the _form_, not the _meaning_. The model can hand you valid JSON whose city name is still wrong. The schema blocks an invalid date format; it does not block February 30th. Keep formal validity and logical correctness separate.

> A schema answers "what may be written in this box," not "is what's written correct." The second question is still your job.

## Practices for reliable integration

When moving function calling into production, a few principles keep the system from being fragile:

-   **Always validate the output.** Even when the model produces JSON, re-validate it against the schema in your own code (e.g. Pydantic, Zod). Trust the model, but verify.
-   **Treat arguments as if they came from a user.** A file path, SQL fragment, or command the model generates must be sanitized before it is run. The model can be steered by indirect instructions from a malicious user.
-   **Feed errors back to the model.** If a call fails (missing field, API error), pass the error message back and ask it to retry. It often corrects itself on the second attempt.
-   **Keep the number of tools manageable.** Offer dozens of tools and the model gets confused about which to pick. If needed, filter tools by context and present a subset.
-   **Idempotency and confirmation.** For irreversible actions like money transfers, ask for user confirmation rather than executing the model's call directly.

```text
# Pseudocode: a safe execution loop
call = model.respond(message, tools)
if call.type == "tool_call":
    data = schema.validate(call.arguments)   # format + type check
    if not data.valid:
        model.feedback(data.error)           # tell the model to retry
    else:
        result = safe_execute(call.name, data)
        model.continue(result)
```

<div class="callout"><strong>Tip:</strong> Log tool calls and their results. When something goes wrong, you can only answer "why did the model pick that argument?" by looking at the raw call record.<p></p></div>

## Common mistakes

The traps you see most often in the field: leaving tool descriptions blank (the model can't tell when to use it); mistaking formal validity for correctness; executing the model's call without question; and defining a single, gigantic "do-everything" tool. Instead, design narrowly scoped, well-described, validated tools.

This discipline is also the foundation of agent-based systems. Every interaction an LLM agent has with the outside world is, in fact, a tool call. If you'd like to look at this topic from a broader angle, see the [HatsonTech](/en/posts/what-is-hatsontech/) team's writing on AI integration.

<div class="takeaways"><h4>Key takeaways</h4><ul><li>Function calling moves the model from free text to machine-readable data; the direction shifts from user to code.</li><li>The model does not execute the function; it only produces a call intent. Execution stays under your control.</li><li>Well-written schema descriptions (<code>description</code>, <code>enum</code>, <code>required</code>) directly affect output quality.</li><li>Structural enforcement guarantees form, not meaning; always validate the output on your side.</li><li>Treat model arguments like untrusted user input; sanitize, confirm, and log.</li></ul></div>

<div class="faq"><details><summary>Are structured output and function calling the same thing?</summary><p>Close relatives, but not identical. Structured output is making the model's response conform to a specific JSON schema. Function calling is the model expressing an intent to call a tool with specific arguments; those arguments are themselves a special case of structured output. So function calling combines structured output with an action.</p></details><details><summary>If schema enforcement exists, why is validation still needed?</summary><p>Because enforcement only guarantees the form. Values that fit the schema but are logically wrong (a nonexistent product code, a birth date in the future) can still be produced. Also, behavior can differ when the provider or model changes; your own validation is insurance against that uncertainty.</p></details><details><summary>Does offering many tools tire the model out?</summary><p>Yes. As the number of tools grows, the model struggles to pick the right one and the context window swells. The practical fix is to pre-filter tools by user intent, group them logically, and give each a clear, distinctive description.</p></details></div>

---
