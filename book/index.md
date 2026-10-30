---
title: Systems, from the outside in
description: A book on system design that starts outside the system boundary and works in — the readable form of The Outside-In Method.
---

::: standfirst
**A book about designing information systems that survive production.** I start it where the system stops — at the boundary, with everything that stands on the far side of it — and only then go in, to how data is stored, how it is processed, and how it moves.
:::

::: lead
Most system-design writing I have read opens with a diagram: a load balancer, three services, a database, a cache. I have seen that diagram on enough whiteboards to know what it skips, so this book opens one step earlier, with the question the diagram never got round to asking — [who is out there, and what did we promise them?]{.term}
:::

The order is not a matter of taste. Every choice inside a working system is the consequence of something outside it: a client who needs an answer within a hundred milliseconds, a regulator who says the data stays in the country, a budget that runs out at half a cent a request, a team of four who have to carry the pager. Name the database before you have named those, and you have not derived anything — you have remembered a shape, and now you are writing the justification backwards. I have written a few of those myself. The justification always reads well, and that is exactly the problem.

Names carry meaning across that boundary too. The book adapts [**ANSI/NISO Z39.19-2005 (R2010), Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies**](https://www.niso.org/publications/ansiniso-z3919-2005-r2010) to scoped domain terms, API outcomes and component responsibilities. Chapter 01 gives the source sections and limits of the adaptation; later chapters carry those meanings through schemas, observations, reviews and changes. These are software-contract rules derived by TEOB, not API rules asserted by the retrieval standard.

The photo thread and worked systems are constructed design cases. Numerical assumptions and proposed contracts illustrate decisions; they are not production measurements or passing implementation tests unless a concrete evidence source is named. The trace distinguishes declared obligations from arguments and exercised tests.

So I teach the fundamentals in the order a real design actually needs them. Replication and partitioning are all here, and quorums, delivery guarantees, idempotence, backpressure — **but each arrives at the moment a constraint from outside has made it necessary**, and each comes with the rule for deciding whether you need it at all. That is the whole difference between knowing what a quorum is and knowing when you have just bought one.

::: {.rule .thesis}
Every mechanism inside the system cites a constraint outside it. Every constraint outside it maps to a mechanism inside.

Those two sentences are the whole discipline. Everything else in this book is either a way of finding the constraints, a way of choosing the mechanisms, or a way of checking that the two still line up.
:::

## Who this is for

You can build things, and you want the production-grade fundamentals laid out in an order that holds together — and you have probably noticed that the usual material teaches the components without ever teaching the decision. You do not need to have designed a distributed system before. You do need to be willing to do your arithmetic in public, and there is a fair amount of it ahead.

**One system runs through all twelve chapters.** I introduce a photo-sharing feature in chapter 01, and every chapter from there to chapter 12 closes by adding one decision to it — a boundary, then client classes, then an envelope, then arithmetic, then stores, then a processor, then the one brokered edge it turns out to need, and after that how it fails, how it is watched, how it is changed and how it is checked. The worked cases inside the chapters are deliberately unlike each other, because no single system can honestly exercise every distinction; the running thread is there so you can watch the method accumulate, not just see it demonstrated once.

I wrote it for the engineer, quite deliberately, even though its central claim is about a model the business side shares. A book addressed to two audiences satisfies neither. Where an artifact is one the business has to sign as well, I say so and name it — but the reader I am teaching is the one who has to build the thing.

## The arc

{{contents}}

## How this relates to the specification

There are two documents here, and you are reading the friendlier one. [**The specification**](../method.html) is the one you check against — the same method as a dense, greppable rule set: four primitives, ten steps in four phases, four cross-cutting threads, and the traceability discipline. It is what the [agent skills](https://github.com/teob-cc/teob-method) mirror and what the [eight derivations](../derivations/index.html) cite.

The book is a **projection** of the specification, in exactly the sense chapter 05 gives the word: rebuildable from it, allowed to lag behind it, and carrying a stated bound on how far. Nothing in the book may contradict the specification; where the book says nothing, the specification governs. Each chapter closes by naming the parts of the specification it is the readable form of, so you can always jump across from one to the other.

Two parts of the specification have no chapter here, and I would rather name them than let the silence pass for coverage. **Trust** — step 05: who may see which data, enforced where, erasable how. And **model workloads**, which the specification threads through seven of its steps, from sourcing the compute to operating the model. For both, the specification is the only text.

::: grid2
::: card
#### Read the book if

You want the fundamentals in an order that builds, with the reasoning shown and a worked case at every turn. Start at chapter 01 and read forward; the chapters really do depend on each other.
:::

::: card
#### Read the specification if

You already work this way and want the rules without the teaching — the ten steps with their inputs, outputs and stop rules, in one file you can grep in the middle of a review.
:::
:::

::: {.aside .spaced}
**Staleness bound on this projection.** The book tracks the specification at **{{spec_version}}**. When the specification moves, the book lags behind it, and I would rather show that lag here than pretend it away. If the two disagree on a rule, the specification is right and the book has a bug.
:::

{{stamp}}
