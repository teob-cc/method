---
title: Where the system stops
number: "01"
kind: chapter
part: I
description: "Where the system stops — chapter 01 of Systems, from the outside in, the book form of The Outside-In Method: what a system is, why its boundary is your decision, and what moving that line costs you."
summary: What a system is, why its boundary is a decision, the four primitive roles, and naming domain concepts without losing their meaning
---

::: standfirst
**Before anything can be designed, something has to be decided: what is the system, and what is merely near it.** Nobody is going to hand you that line — it is not on the network diagram and it is not on the org chart. You draw it yourself, and where you put it decides what you are allowed to promise.
:::

::: lead
Ask an engineer what their system is and you get a list of parts: a service, a database, a queue, a cache. I have asked that question in a great many design reviews, and the list always comes out fast. Then ask what is [outside]{.term} it, and the room goes quiet for a moment — partly because nobody asks that, and partly because it is the harder question.
:::

Harder, because the inside you can just look at — open the repository and read it. The outside you have to piece together from what people expect, from contracts nobody has re-read since signing them, from invoices, and from the traffic that turns up at three in the morning out of a batch job you did not know existed. And yet every reason the system has the shape it has comes from out there. So that is where this book starts, and this chapter is about drawing the line in the first place.

## A system is the set of promises you are answerable for

The definition I use is not a structural one. It says nothing about processes, repositories or deployment units. **A system is the set of promises you are answerable for keeping.** Whatever you can change in order to keep those promises is inside. Whatever you cannot change — only characterise — is outside.

Out of that falls a test you can actually run — and note that it is a test about power, not about topology:

| Question | If yes | If no |
|---|---|---|
| **Can I change how this behaves?** | Inside. It is a mechanism, and it will have to cite a reason for existing | Outside. It is a constraint, and your job is to describe it accurately |
| **Am I answerable when it misbehaves?** | Inside — even if you did not build it, and even if it is somebody else's software | Outside. Record what it grants you and what it costs you |

{cols="32% 34%"}

The two questions do not always agree, and where they disagree you have just learned something — congratulations. A managed database you did not write and cannot patch, but do get paged for, is **inside**: you answer for it, so its failure modes are yours to design around. A payment provider you call, whose outage your customers blame on you, is **outside** — but the blame itself is a constraint on your design, not an excuse written into it. This is the first place where an honest answer costs you work.

::: aside
A word about the word. “System” in this book always means *this* system — the one you answer for. The bigger arrangement — it, plus its clients, plus its dependencies — gets no name of its own here, and that is on purpose: the moment you name a thing you want to design it, and you cannot design this one, because most of it belongs to somebody else.
:::

## The boundary is a decision, and it has consequences

Since the test is about answerability, the boundary is a choice — and two reasonable teams will choose differently for the very same software. That is not a hole in the method. Move the line and the work moves across it too; the whole point of drawing the line on purpose is to see exactly which work you have just signed up for.

None of this means much without a real system on the table, so let us put one there. **It closes every chapter from here to chapter 12**, and each time it picks up exactly one decision — so by chapter 07 you will have watched an entire design get derived, one constraint at a time, next to the worked cases rather than in place of them, and by chapter 12 you will have watched it being kept.

### A photo-sharing feature, described end to end

Somebody opens an app on their phone, picks a photo and uploads it. Somebody else, some time later, opens a page and looks at it. Between those two moments five things take part:

- **The mobile app.** It has the photo, and it runs on a phone on a mobile network — that is, on a connection which drops, comes back and retries without asking anybody.
- **An upload endpoint.** An HTTP service that takes the request. It checks that the caller is who they say they are, that the file is really an image and not something dressed up as one, and that it fits under a size limit. Then it passes the bytes on.
- **An object store.** A service made for holding large immutable files cheaply and durably, and for giving each one an address. It is excellent at *put this blob, get that blob* and hopeless at questions like *which photos did this user upload in March* — a distinction chapter 05 turns into a rule.
- **A CDN.** A network of caches sitting close to the readers. The first time somebody in a city asks for a photo, the CDN fetches a copy from the object store; every request after that from the same city is served from the copy. It exists because a photo is big and the speed of light is not up for negotiation.
- **The reader's browser.** It asks for the page, and the page tells it where the image lives.

Now read that list again and look for what is *not* in it: **a boundary.** Not a word above says which of the five is “the system.” The flow is just a fact about how a photo gets from one person to another, and it does not change whoever turns out to be answerable for which part.

**The boundary is a separate decision, taken on top of the flow, and it is yours to take.** Three teams could draw it in three different places on this very picture, and I could defend all three. The only thing that differs is what each team has just agreed to answer for.

::: figure
![The same photo-upload feature drawn with three different boundaries. In the first, only the upload endpoint is inside; the object store, the CDN, the mobile app and the reader's browser are outside. In the second, the object store moves inside. In the third, the CDN moves inside as well. Beneath each row, the consequence of that choice is stated.](../figures/01-the-boundary.svg)

Same software in all three rows. What changes is which failures are yours — and so which questions the design has to answer.
:::

Look at what row C actually bought you. Nothing got built — a line moved, and that is all. But the design now owes a stated staleness bound on cached images, a purge path, and an answer to what a reader sees while a purge is in progress: three obligations that did not exist one row up. Boundaries are not free, and drawing a wide one because it feels more thorough is exactly how a design picks up work nobody asked for.

The opposite mistake is both more common and more expensive: drawing the boundary tight, so that an awkward dependency lands outside it and stops being anybody's problem. The object store in row A is outside, and that is a perfectly legitimate choice — but only if somebody has actually written down what it grants you. A dependency outside the boundary that nobody characterised is not out of scope. It is just not designed.

::: warn
**Drawing the boundary to match the repository.** The repository is a delivery decision, and it gets derived much later, from a completely different force. A boundary that follows it was inherited from a directory layout, not from anything anybody answers for — and you can tell, because nobody can say what is outside without opening the code.
:::

## What is on the other side

Once the line is drawn, you go and take stock of what is on the far side of it. The outsiders come in two kinds, and neither of them is up for negotiation — everything that follows is built on both.

::: grid2
::: card
#### Demand — who needs something from it

Users, partner systems, internal services, scheduled jobs, machines. Everybody who wants the system to do something for them, at some volume and within some tolerance. **Chapter 02.**
:::

::: card
#### Supply — who has to run and pay for it

The organisation. Its budget, its people, its hosting, the contracts it already holds, and how long this thing is supposed to live. All of that comes from outside just as firmly as a client's deadline does. **Chapter 03.**
:::
:::

And there is a third group which people file in the wrong place with remarkable reliability, so I name it separately — even though it is not really a third kind at all.

::: primer
#### Your dependencies are client relationships, reversed

The services you call — a payment processor, an identity provider, an object store, a notification gateway — sit outside the boundary exactly as your callers do. What differs is which way the favour runs: **your clients accept a quota from you, and your dependencies hand you one.**

So describe them with the same fields, just read backwards. For each one write down the rate limit it grants you, the latency it contracts to, the cost per call, the trust zone it lives in, and — the field that is nearly always missing — **the availability figure it contributes.**

With independent outages, three required dependencies each available [99.9%]{.num} of the time give joint availability [0.999³ ≈ 99.7%]{.num}, before failures of your own code. Independence is an assumption, not a law: fully coincident outages give 99.9%, and shared infrastructure changes the joint failure pattern. Record that pattern and the operations that need every dependency; the multiplication is a model to check, not a universal ceiling.
:::

And then one group that gets left out of nearly every design document, for the obvious reason that nobody wants them there:

::: primer
#### Adversaries are clients too

Scrapers, credential-stuffers, fraudulent counterparties, abusive tenants, and the insider whose access is entirely legitimate. They sit outside the boundary with intent and with no quota agreement, and they are the one client class that answers your design by changing its own behaviour.

Give them classes next to the honest ones, with the same three fields: **volume, entry surface, and what they want.** A system characterised only by its well-behaved callers has been designed for a world that does not exist, and the mechanisms that would have stopped the others — quotas, per-class isolation, proof of work, an audit trail — get bolted on in a hurry, in the middle of the incident.
:::

## Four words for everything inside

The outside gets described in the language of the people out there: requests, deadlines, money, obligations. The inside needs words of its own, and this book gets by with exactly four types. Every component you draw is one of the four, and each type owes you a different set of answers.

| Type | What it is | The question it exists to force |
|---|---|---|
| **Surface** | Where a client touches the system — the door in the boundary | Who may come through, at what rate, and which rules are enforced right here rather than deeper in? |
| **Store** | Something that holds state | Is this the truth, or is it derived from the truth? **Chapter 05** |
| **Processor** | Something that derives data from other data | Can it be run twice without harm, and can its output be rebuilt? **Chapter 06** |
| **Channel** | A transfer between two nodes | What exactly does it guarantee, in what order, and what happens when it cannot deliver? **Chapter 07** |

Table: Introduced here so the rest of the book has words to use. Each gets a chapter of its own in Part II, except the surface, which is where the boundary is crossed and so belongs to this part of the argument. {cols="16% 30%"}

Two things about this vocabulary I want to say straight away, because both carry weight and both tend to surprise people.

**It is old.** Structured analysis settled on nearly this exact set in 1977 — process, data flow, data store, external entity — and drew its context diagram literally outside-in: name the flows, name the entities outside the system, draw the system as a single box and arrange those entities around it. Three of the four types here are that model with new labels. I am not claiming a new vocabulary — I am insisting on a discipline for using the old one, and putting numbers on it.

**The types describe roles, not products.** This is the part that does the real work. You do not ask “is Kafka a store?” — you ask which roles this particular Kafka deployment is playing, and the answer is three at once: a producer channel, a store with a retention window, and one consumer channel per reader. Three roles, three sets of properties, three different owners, one broker. A database with change data capture is a store *and* a producer channel. A cache is not a fifth type; it is a derived store with an invalidation contract, and once you call it that you have to answer the staleness question that the word “cache” lets you walk past.

::: example
#### The question that finds the missing decision

Pick any component on a diagram you already have and ask: **which roles does this play, and does each role carry its own properties?**

Run it on a message broker and here is what you usually get. The retention window belongs to the store, and somebody chose it — the default, most likely. The ordering key belongs to the producer channel, and somebody chose it — the default again, most likely. The deduplication key belongs to the consumer channel, and **nobody chose it at all**, because everyone assumed the broker takes care of that.

That third gap is nothing exotic. It is the single most common finding in the whole method, and it comes from one label folding three decisions into a single shrug.
:::

## Names carry the same meaning across the boundary

The four primitives tell us which questions to ask of a component. They do not tell us what the component does for the client. **Name the domain responsibility, declare its architectural role, and record its implementation separately.** A *photo catalogue* names the responsibility; *authoritative store* declares a role; PostgreSQL names an implementation. Replacing PostgreSQL should not require the client to learn a new word for their photos.

There is a useful source for this discipline: [**ANSI/NISO Z39.19-2005 (R2010), Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies**](https://www.niso.org/publications/ansiniso-z3919-2005-r2010). Its subject is indexing and retrieval. The following rules adapt its vocabulary guidance to software contracts; they are TEOB rules, not a claim that NISO specifies API design. The [specification's naming rules](../method.html#naming) carry the same distinction.

Start with the words clients use, the domain's documents and established organisational usage — the three kinds of warrant in §§5.3.5 and 6.6.1. For each concept that could be confused with another, choose **one preferred term within a declared scope** and retain genuine synonyms as aliases (§8.2). Two domains may use different words, or the same word differently. Record the mapping where they meet; a shared API does not require a company-wide dictionary.

Keep the record small. This is an illustrative entry for the photo thread, not evidence of a client interview:

| Preferred term | Scope and meaning | Aliases | Distinction from nearby concepts | Source |
|---|---|---|---|---|
| **Photo original** | Photo service: the uploaded image bytes retained as an input to resizing | Original image | A thumbnail is derived from it; the catalogue record describes it | Constructed photo case, chapters 01 and 05 |

Add rows where misunderstanding changes a decision. An agreed, unambiguous term needs no ceremony. Record an unresolved disagreement as an open question, with the affected contract beside it. Calling two things by one name does not resolve it.

Qualify names where their meanings meet (§6.2.1). An access token, a page cursor and an admission permit need distinguishable names on the same surface; a namespace can supply the qualification. Use a short scope note to say what a term includes and excludes (§6.2.2). Preserve useful compounds in natural order (§6.3.1 and §§7.4–7.5, 7.8): *seat hold* names a concept, while *manager* tells us little by itself. Prefer recognisable words and established abbreviations to private shorthand (§§6.6.2–6.6.4). These rules choose meanings; the implementation language still chooses identifier casing and syntax.

**Retrieval equivalence is too loose for an executable contract.** NISO permits near-synonyms and broader/narrower terms to be treated as equivalent in some retrieval contexts (§§8.2.3–8.2.4). A documentation search may connect *cancel* and *refund*. An API must keep them distinct when one ends an obligation and the other returns money. Aliases on an executable surface must preserve the same behaviour in the declared scope.

A good name helps a reader find the guarantee. It does not establish that the guarantee holds. The rest of the book still has to supply the mechanism and the evidence.

## Why this order, and not the other one

Everything above leads up to one claim about order: **the outside is characterised before anything inside is chosen.** I want to be explicit about why, because the opposite order is what nearly every design document does — and it does not feel wrong while you are doing it.

::: grid2
::: card
#### Component-first sounds like

“We'll use a log for ingestion, a key-value store for reads, a cache in front, split into services.” The technologies show up before a single number exists. Nobody on the paying side of the table can tell whether it is right, so nobody argues, and the review turns into taste against taste — settled by who is more senior.
:::

::: card
#### Outside-in sounds like

“Partner clients burst [50×]{.num} nightly and tolerate minutes of staleness; end users need [p99 100 ms]{.num} and must see their own orders immediately. So: two client classes, two paths, one truth store, one derived view, and a queue that exists to absorb the burst — remove the burst and the queue goes with it.”
:::
:::

And notice that the second version is not the cleverer one. It is shorter, and every noun in it is tied to a reason. That tie is the whole product of this method, and it gives you a test you can run on any finished design — including one you did not write:

**Pick a component and ask which promises would lose support if it were removed.** Include the failure conditions the system promises to survive. Several requirements can independently justify one database, and a failover node supports an obligation even when normal traffic fits elsewhere. No recorded answer calls for investigation; no real obligation after that investigation identifies furniture. Removing one requirement at a time is not the same test.

If the answer is **one**, the component is derived and doing its job. If it is **three**, you have found something different and rather rarer: a component carrying three promises at once, so that when it fails, all three fail together. That is a *coupling*. It is not a defect you fix by splitting, and the book comes back to it in Part IV — because it is the one reading a traceability map cannot make by itself.

Sometimes the honest answer is another decision rather than a constraint: the resharding path is there because the store is partitioned; the fencing token is there because there is a leader. That is fine, and it is not an escape hatch, because the question just moves one step up. Why is the store partitioned? Nothing partitions itself. Either a volume that did not fit on one machine bought it, or nothing did. Follow the chain and it either ends in a sentence about somebody outside the system, or it ends nowhere — and **where it ends nowhere, that is one finding at the root, not one per link.** A tower of eight mechanisms standing on an ungrounded adjective is not eight problems. It is one word with no number on it.

::: thread
#### The boundary, chosen

For the rest of the book we go with **row B**. The upload endpoint and the object store are *inside*; the mobile app, the CDN and the reader's browser are *outside*.

That choice has cost us something already. Retention, replication and the storage bill are now ours to decide — and ours to defend. In return, the CDN's cache behaviour is a dependency we *characterise* — a quota, a latency contract, an availability figure — and not a mechanism we design. Every chapter from here on adds one decision to this system, and not one of them adds a box that cannot name the constraint which bought it.
:::

::: rule
Draw the boundary by asking what you are answerable for. Then write down everything on the other side — before you draw anything on this side.

The inside is a consequence. If you cannot yet say who is out there and what they need, you are not ready to choose a database, and any database you choose now will be defended rather than derived.
:::

The next three chapters are that inventory, in full: who needs something from the system, what the organisation can actually run, and the arithmetic that turns the two into numbers a design can be held to.

::: owes
- Specification [Naming concepts and contracts](../method.html#naming) — scoped terms, preserved behavioural distinctions and the ANSI/NISO Z39.19-2005 (R2010) adaptation
- Specification [§01 · Claim](../method.html#claim) — the deletion test stated as a count, and the recursive citation rule
- Specification [§02 · Primitives](../method.html#prim) — the four types, the 1977 correspondence, and roles rather than products
- Specification [step 01 · Outside](../method.html#s01) — dependencies as reversed client relationships, adversaries as classes
:::
