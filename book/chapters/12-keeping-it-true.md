---
title: Keeping it true
number: "12"
kind: chapter
part: IV
description: "Keeping it true, chapter 12 of Systems, from the outside in — what to do when the constraints move: name the sufficiency claim that expired, amend where the decision lives, and keep the two halves' signatures separate."
summary: "The model was not wrong, a sufficiency claim expired. Amend rather than re-derive, and record what the change explicitly does *not* touch. Who signs which artifact, and why this is not rationale capture"
---

::: standfirst
**Constraints move. That is not a failure of the design — it is the condition the design was always operating under.** The only question is what a change in the world does to you: does it send you back to re-derive the whole thing, or do you amend one line — and know exactly what that line did not touch?
:::

::: lead
I know the look you get when you propose a document like the one this book has been building. Everybody has seen the design document that was true for six weeks and then just sat there, being wrong — I have written my share of them. So let me say up front why this one behaves differently. It is not discipline, and it is not a better wiki. It is [what is written in it]{.term}.
:::

## The model was not wrong. A sufficiency claim expired.

Back in chapter 01 I insisted that the four types describe roles, not products: a store is a **role with constraints**, and a product is just one thing that happens to be sufficient to play that role today. I could see it read as pedantry at the time. Now, behold — here is what the pedantry buys you.

::: figure
![A store described as a role with three constraints, unchanged across three successive implementations beneath it: PostgreSQL with one primary, then PostgreSQL with read replicas, then distributed SQL. Each implementation names the condition that would end its sufficiency.](../figures/12-keeping-it-true.svg)

And this is why the method never lets a product name stand in for a role. The separation is not tidiness for its own sake — it is the thing that lets the description outlive its own implementation.
:::

When constraints change, name the claim that expired and inspect its dependencies. Often the mechanism can change while its role survives; sometimes a new client, invariant or history requirement changes the model itself. Preserve claims only after checking that they still hold.

## Amend, do not re-derive — and the third column is the point

Write down what needs re-checking and why each preserved claim remains sufficient. The table is a starting point for dependency analysis, not an unconditional exemption for the final column.

| What changed | Re-check | Preserve after checking dependencies |
|---|---|---|
| **A new client class** | Its operations, tolerances, authorization and history needs; then affected surfaces, data and invariants | Only parts independent of the new promises; even a new reader can require history never retained |
| **A tolerance tightens** | The derivation producing that view; possibly the store beneath it; the completeness watermark, serving gate and alarm thresholds | Client classes, invariants, the cost envelope |
| **A volume moves 10×** | The demand arithmetic and everything citing it — node counts, partition counts, the recorded ratios, the hottest key's among them, since a tenfold there can change the rung an invariant is enforced on | Tolerances, invariants, acknowledgement semantics |
| **A term or its meaning changes** | Affected requirements, operations, schemas, diagrams, observations, retained history and consumers; classify spelling change versus behavioural change | Meanings and mechanisms whose equivalence is demonstrated; preserve old contracts for their supported lifetime |
| **An invariant is added** | Its enforcer, the isolation its scope needs, its rung on the enforcement ladder, the serialisation point for its contended unit, acknowledgement semantics on that write path | Everything not touching that invariant |
| **The envelope shrinks** | Store choices, placement, granularity, buy-versus-build; run the subtraction test for real — if the budget halved, what comes out and what breaks | **Client tolerances** — they do not move because you got poorer. That is a finding to escalate with numbers |

Table: The second column saves the time. The third is what stops a nervous team from reopening everything — without it, every amendment is a full re-derivation performed nervously. {cols="23% 39%"}

Stay on that last row for a moment, because it is where I see amendments go wrong most often. **A budget cut is not permission to quietly lower a promise.** The envelope and the tolerances both came in from outside, and when they genuinely cannot both be met, sorting that out is the job of whoever owns the money — and you hand it to them with the gap in numbers, not in adjectives. Absorb it inside the design instead, and the promise still gets broken — only later, by a client, instead of now, by a decision.

## Who signs which artifact

If the model is the description both halves of the room hold, then part of what this book has produced is a **contract** and the rest is engineering's working notes. Hand the whole thing across the table as one pile and you get the failure I have watched in both directions: the business half arguing about topology, which it cannot evaluate, and the engineering half quietly moving a promise, which it has no business doing.

There are three categories. And their boundaries are not the chapter boundaries — which is exactly why I have to state them here rather than let you infer them.

| Category | Artifacts | Why it sits there |
|---|---|---|
| **The business supplies** | The operating envelope from chapter 03 — capability, hosting posture, contracts held, cost envelope, team topology, expected lifecycle, published interfaces, procurement reality | Engineering cannot invent these and should not guess them. Late arrival is what makes them expensive |
| **Both sign** | Client classes and quotas · every tolerance with the conditions it holds under · the accepted degraded outcomes · the zero-tolerance counts · **the shed order** · cost per request · retention and erasure commitments · the SLOs that get published | Each one is a commitment or a bill. Every item is expressible without naming a technology, which is exactly what makes it checkable by someone who does not build the thing |
| **Engineering owns** | Primitive typing and the annotated graph · store families · the eight channel properties · capacity arithmetic, node counts, ratios, headroom · derivation and merge semantics · runtime and placement | The business half can neither evaluate these nor usefully be asked to. Sending them across the table is how a review becomes theatre |

{cols="22% 45%"}

**And the map from chapter 11 is joint column by column**, which is the neatest proof I have that the split is real and not just a way of talking. *Requirement* is signed by both. *Mechanism* is engineering's alone. *Verified by* is signed by both again — it is the evidence that the promise holds, and a promise nobody can check was never a promise to begin with.

**And the categories decide how an amendment is processed.** Amend something engineering owns and nobody has to counter-sign: swap the database, change the partition count, move the placement, and nobody outside engineering needs to be told. Amend anything both halves signed and the amendment is **void until it is signed again**, because it is a promise and it has a price. Tightening a staleness bound from sixty seconds to five is not a technical adjustment. It is a new commitment with a new bill, and the person who pays should hear about it before it ships and not from the invoice.

::: warn
**Filing the shed order under engineering.** It looks like an implementation detail, and it is a commercial decision in a technical costume: *which customer do we drop first.* Whoever owns the revenue owns that answer, and they should give it in daylight rather than have it inferred at three in the morning by whoever is holding the pager.
:::

Vocabulary follows those same ownership boundaries. Changing an internal component label while preserving its responsibility is engineering work. Changing what the client understands by *accepted*, *available* or *erased* changes a promise and needs the promise's owners. Keep the small vocabulary record with the decisions it describes, and retain history for published changes as chapter 10 requires. Update dependent artifacts together; a new preferred term does not silently rewrite the meaning of an old event.

## When a genuine re-derivation is bought

Amendment covers nearly everything. **One thing does not amend**, and it sends you back into the chapters instead of into the table:

**Re-derive the affected part when its assumptions or proof no longer hold.** A repeated failure warrants diagnosis, but does not prove that truth was misplaced, and there is no two-fix prerequisite. A counterexample before production is enough. Follow dependencies to set the scope; preserve the parts whose claims still hold.

Two other changes look as though they belong next to it, and they do not. A figure from chapters 02 or 04 moving by a power of ten re-runs the arithmetic and everything that cited it — that is the third row of the table, and it leaves the tolerances and the invariants exactly where they were. A new client class gets its quota, its place in the shed order and its row on the ladder — the first row — and a new reader does not change what is true. Treat either of them as a re-derivation and you have found the reason teams end up never amending anything: redoing the lot is an afternoon, so nobody does it.

Everything else is an amendment too — and it goes where the original decision lives, with the date on it and the name of the claim that expired.

::: example
#### Forty years of evidence that this should not work

I want to put this objection at its strongest, because it has a better evidence base than most things in software.

Design rationale capture has been tried over and over since the 1980s, and it has failed over and over. The tools got built, adopted and abandoned. The reason people admit to is cognitive overhead — chopping your thinking into typed, labelled, linked nodes is expensive at exactly the moment you are trying to think. The structural reason is worse: **the person paying the capture cost is never the person reaping the retrieval benefit.** You pay today so that somebody else saves time in two years, and that trade never wins against a deadline.

The one practice that did survive — decision records in the repository — survived by dropping the typed graph almost entirely.

**So why is this different?** Not because of better discipline — that would be a poor bet. Because this is not capturing rationale at all.

Those systems recorded *decisions and the arguments about them* — an append-only archive that grows with every meeting, goes stale the whole time, and gets searched by nobody at all. What this book produces is a **bounded description of the system in typed roles with attributes**. It does not grow with decisions. It changes when a constraint changes, and next year it is the same size it is today.

**And the capture cost is paid by the person who collects the benefit, in the same week.** The map is what you check a proposed change against before you touch any code. The envelope is what you quote when somebody asks for a promise you cannot fund. The ladder is what on-call reads at three in the morning. None of that is an archive waiting for somebody to dig it up — it is a working model of the system as it is now, and the reason it stays true is simply that *you are using it*.
:::

::: thread
#### The photo system, amended twice

**Amendment one: the CDN hit rate was wrong.** Chapter 04 assumed [95%]{.num} and, as it should, put that on the risk register next to the decision it supported. Measured, it is [88%]{.num} — so origin reads go from [5/s]{.num} to about [12/s]{.num}.

Re-check: the demand arithmetic, the origin capacity, and the cost per thousand views — the unit chapter 04 said would be the one to move. It does move, and nowhere near the ceiling: the misses go from five views in a hundred to twelve, each of them a [40 KB]{.num} fetch from the origin, and a thousand views still cost a small fraction of a cent. **Explicitly untouched:** every tolerance, the ladder, the truth-versus-derived split, the channel properties. And the conclusion does not move an inch — twelve a second against a store that handles thousands is still one node. **The figure was wrong and the design was not**, and that is exactly what a labelled assumption is for. The register entry closes, and the label goes from *assumed* to *measured*.

**Amendment two: a customer wants photos in their own region.** This is the largest amendment the table can hold, and it is still one. It lands on two rows at once — a new client class, and an envelope that has just gained a jurisdiction — and the second row's re-check column is the long one: store choices, placement, granularity. So chapter 05's question of where the truth may live is reopened for that class, and so is chapter 03, because this is precisely the trigger we wrote into the lifecycle row: *the first customer who requires their own region.* **Explicitly untouched:** every tolerance, the ladder, the permission invariant, the acknowledgement. A new region does not change what a photo's owner was promised.

We recorded that trigger in chapter 03 so that this moment would arrive as planned work and not as a surprise. **The lifecycle guess was labelled, and it named what would falsify it.** Nobody has to argue about whether this counts as a big enough change — the answer was written down a year earlier, by the very same people who would otherwise be having that argument now.
:::

::: rule
The description is alive. When the world changes, the model was not wrong — a sufficiency claim expired. Name the claim, amend where the decision lives, and write down what the change explicitly does not touch.

And keep the two halves' signatures separate. The business supplies the envelope, both sign the promises, engineering owns the graph — which is the same division the very first page of this book was arguing for.
:::

That closes the discipline, and with it the argument. What is left is to watch the whole thing run at once, on systems that were not picked to make the method look good — **Part V**, where it is worked end to end rather than one chapter at a time.

::: owes
- Specification [Naming concepts and contracts](../method.html#naming) — scoped terms, preserved behavioural distinctions and the ANSI/NISO Z39.19-2005 (R2010) adaptation
- Specification [§06 · Amendment](../method.html#amend) — the living description, the expired sufficiency claim, and the re-check table whose third column is preserved only after dependency checks
- Specification [§05 · Discipline](../method.html#disc) — who signs which artifact, three categories, and the map read joint column by column
- Specification [step 10 · Trace](../method.html#s10) — repeated violations trigger diagnosis and re-checking of the earliest affected decisions and their dependencies, without a fixed count of failed repairs
- The rationale-capture objection and what answers it are set out in full in the [foreword](../foreword.html#against)
:::
