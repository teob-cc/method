---
title: Checking the work
number: "11"
kind: chapter
part: IV
description: "Checking the work, chapter 11 of Systems, from the outside in — one table read three ways: forward for gaps, backward for furniture, and by column count for the mechanism carrying three promises at once. The book form of The Outside-In Method."
summary: One map, read three ways — forward finds gaps, backward finds furniture, counting finds the mechanism three promises depend on. Citation chains, provenance labels, and why a five-deep chain is one finding
---

::: standfirst
**Everything up to here produced decisions. This chapter checks them — and the check is mechanical, which is the entire point.** I have sat in plenty of design reviews that came down to whose judgement the room trusted more. Those reviews did not review anything — they just ranked the people at the table.
:::

::: lead
What makes the check mechanical is a single table. It is short, it is rather boring to write, and it is the one thing that outlives the meeting — because it is the only part of a design document that can be [wrong in a way anybody can demonstrate]{.term}.
:::

## One table, read three ways

The table has three columns: the requirement, the mechanism that satisfies it, and the evidence that it is still being satisfied. Every row is a claim, and every claim can be checked by anyone who can read — no seniority required.

::: figure
![A four-row traceability map with columns for requirement, mechanism and evidence required. Three arrows show the three readings: left to right checks that every requirement names a mechanism, right to left checks that every mechanism names a requirement, and a count down the mechanism column finds that three rows depend on the same replicated log — directly for durability, through a stream processor and its age gate for search, and through erasure markers beside key destruction for erasure.](../figures/11-checking-the-work.svg)

Reads 1 and 2 are the two sentences the contents page opened with — and the second has been with us since chapter 01, as the deletion test. Read 3 is just a column count on a table you already have — no new notation, no second document.
:::

## Read 1 — an empty cell is a gap

A filled cell establishes only **coverage**. Record the promise and its conditions, mechanism, assumptions, evidence and status: **declared, argued, tested or violated**. A named metric is a proposed observation. A passing test proves only the exercised case, and a safety argument remains conditional on its assumptions.

Start at the top of the requirement column and walk down it, asking of each row which mechanism satisfies it. A requirement with no mechanism is **a gap nobody designed for** — and of the two findings this is the cheaper one, because nothing has been built yet. You are discovering an obligation, not unpicking a commitment.

The same finding has a quieter form, and most reviews walk straight past it: **a figure that maps to nothing was never a requirement at all.** Somebody asked for a number back in chapter 02, wrote it down, and then no decision anywhere ever consumed it. You might think that is harmless surplus. It is not — on the page it looks exactly like a number that did some work, and it lends its weight to everything printed next to it. Drop it, or name the decision it should have informed.

## Read 2 — a mechanism that cannot name a requirement is furniture

Now walk back the other way. Remove a mechanism in the model and name the promises that lose support, including failover obligations. A shared component may remain necessary after either one of two requirements disappears. This reverse dependency test finds its citations without misclassifying sharing or redundancy as furniture.

When a mechanism cannot name a constraint from outside — a client's, or a row of the operating envelope — there are exactly three things you can do with it — and they are a **search order**, not a menu. Take the first one that applies.

1. **Surface a missing requirement.** You trace it and land on a constraint that was true all along and simply never got written down. **This is the common case and the valuable one** — and quite often it is a *different* constraint from the one that bought the parent: a fencing token traces to the invariant the leader protects, not to the availability figure that bought the leader in the first place.
2. **Declare it self-derived, naming the parent decision** — and the parent is now subject to this same test.
3. **Delete it** — but only when both searches have found nothing above it. Then it entered by habit, and habit is a recurring charge. On a running system even that verdict is worded differently, as the end of this chapter explains.

::: primer
#### Citations chain — and no, the recursion is not a loophole

The second disposition looks like an escape hatch, and I have seen it used as one. It is not — because **naming a parent moves the obligation up a level rather than discharging it.**

The resharding path exists because the store is partitioned. Fine — so why is the store partitioned? Nothing partitions itself. Either a volume that did not fit on one machine bought it, or nobody bought it at all. The fencing token goes the same way: it exists because there is a leader, and a leader with elections was bought by clients who will not tolerate a maintenance window — or it was not bought either.

Follow the chain far enough and it terminates in a sentence about somebody outside the system — or it terminates nowhere. **Where it terminates nowhere is the finding.**

And here is the part that actually changes how you run a review: **a five-deep chain standing on one ungrounded adjective is a single finding at the root — not five findings against mechanisms that were each derived perfectly well from the one above them.** Report it at the break. A review that lists all five is not being thorough — it is being wrong four times over, and it burns through exactly the goodwill it will need to get the one real thing fixed.
:::

## Read 3 — count the column

The first two readings establish coverage; the third identifies shared dependencies. For each failure mode ask which promises fail, for whom and after what delay. Three citations do not prove three simultaneous failures, nor do they measure the severity of any of them.

The map keeps quiet about this, because a matrix has no column for it — and that is exactly why you have to go looking for it deliberately rather than hope to stumble on it. The instrument is already on the page, and you need no tooling at all — a finger down one column is quite enough: **read the middle column and count repeats.**

**A count above one is not automatically a defect.** Shared mechanisms are how a design stays small — a log serving three consumers is just a log doing its job. What the count buys you is three obligations, and all three are cheap:

- **Carry it onto the ladder as *n* entries, not one.** Chapter 08 priced each rung, and a mechanism holding three promises has three degraded outcomes — and they may well land on different rungs. And keep the failure modes apart: a log that loses committed data breaches durability, while a log that refuses appends or stalls delivery loses nothing already acknowledged — it stops new acceptance, or lets search go stale.
- **Check whether the signatories agree.** When the promises sharing one mechanism were signed off by different parts of the business, the strictest of them now sets the operating floor for all the others — so somebody is either paying for a guarantee they never asked for, or is about to lose one they did.
- **Use counts to find scenarios, then rank the scenarios.** Consequence, affected clients, time to harm and recoverability determine priority. Record uncertainty, reversibility and shared dependencies alongside that judgement; one severe access-control failure can outrank ten minor display failures.

::: warn
**Splitting a mechanism to bring its count down.** The count is a *measurement*, not a target. A second store that was derived from a coupling number rather than from a client constraint is an uncited mechanism, and read 2 catches it: search above it and all you find is the count, so it comes out — you have used the third reading to violate the second.
:::

::: primer
#### Provenance: three labels, and the one that is load-bearing

Every figure on the map carries one of the three labels chapter 04 put on it — **measured**, **contractual** or **assumed** — and I will not go through them a second time. What this chapter adds is where the label gets *used*.

The assumed ones are the load-bearing ones. Each goes on the risk register **paired with the decision it supports**, and that pairing is what you read on the day a number moves — because the question you will actually be asking is not *was it right* but **what did we build on it**.

**Record what reversing the decision actually requires.** A module seam can reduce code changes while leaving a difficult data migration. Name the rollback window, preserved formats, deployed consumers and destructive steps. Assumptions and expensive reversal increase the value of a probe; they do not replace consequence-based risk ranking.

And a gap stays a gap. If the walk needs an input nobody has, the missing input is the finding, and it goes on the page as one. What you must not do is quietly supply a plausible-looking figure — I have done it myself, early on, and the arithmetic looked wonderful right up to the moment somebody asked where the number came from.
:::

## Check that the map uses the same concepts

Walk a requirement through its diagram label, operation, schema, result and observation. Does the meaning survive each crossing? Report one name used for two concepts, competing names for one concept, an alias that changes behaviour, or a result whose name promises more than its acknowledgement proves. Identify the affected contract and the consequence. A casing preference alone is not a correctness finding. Before counting shared obligations, resolve scoped aliases to the actual mechanism they identify. Two names do not establish two independent mechanisms; one shared label does not establish shared failure either. Check identity, dependencies and the relevant failure modes.

Test important distinctions with representative consumers: give them a scenario, ask which operation they would choose, and ask what they believe its result establishes. Record disagreements and the scope note or contract that must resolve them. This is TEOB's API adaptation of ANSI/NISO Z39.19-2005 (R2010), §11.2, on vocabulary testing and evaluation. It produces evidence about understanding, not evidence that the implementation enforces the guarantee. No such consumer test is claimed for this book's constructed examples.

## Then fire the stressors at it

Chapter 08's stress pass has one more firing, and it belongs here, on the finished map. The forward read checks that every *stated* requirement holds. This one runs the other way: take the stressors — including a handful you held back and never used while designing — and ask what the map does under an input nobody stated. The outputs are the same three as before: a requirement nobody had written down, a finding, or an option recorded with its trigger. So is the guard: a stressor never becomes a row of the map. And where you did hold some back, report how many survived, with the denominator next to the number.

## The same map, on a system that already exists

Everything above reads like a razor, and on a design nobody has built yet, that is what it is. On a running system it turns into **Chesterton's fence** — and the difference is big enough to change the wording of the finding.

An uncited mechanism in production means one of two things, and the map cannot tell you which one: either the requirement exists and nobody wrote it down, or it existed once and has since expired. From where you stand, the two look exactly the same.

So the disposition softens. Report it as *“no recorded reason — confirm before removing”*, never as *“delete this”*. And once somebody has confirmed it can go, produce an incremental path rather than a deletion — the strangler fig or branch by abstraction from chapter 10, either of which keeps the system releasable the whole way through.

::: example
#### A map that passes both readings and still has a finding in it

Take the four rows in the figure above and run all three readings on them properly.

**Read 1 passes.** Every requirement names a mechanism. No gaps.

**Read 2 passes.** Every mechanism names a requirement, and each one is a real client constraint, not an internal preference. The derived view is there because of a latency promise to three regions, and the log is there because a write must never be lost.

A review that stopped here would sign the design off — and by the standards of almost every design review I have sat in, it would count as a competent one.

**Read 3 finds three rows that depend on the same replicated log.** Durability rests on it directly, search freshness on the stream processor that reads it, and erasure on the erasure markers it carries beside key destruction. The count names a shared dependency, not a shared failure — so each failure mode gets looked at on its own. Now the three obligations kick in:

- **Three ladder entries, not one — and two failure modes.** If the log is *unavailable*, no acknowledged write is lost: new writes cannot be accepted, and that is rung 5 for acceptance. Search freshness only degrades to rung 3, stale but complete, which the class already accepts. And erasure just quietly stops making progress, with nobody any the wiser, because a deletion job that does not run raises nothing at all. If the log *loses committed data*, that is another scenario altogether: acknowledged writes are gone, and that is rung 6, the durability breach. **Different severities behind one component, and a different set for each way it fails.**
- **The signatories differ.** Erasure within thirty days is a regulatory commitment, and search freshness is a product preference. Now the two are coupled to the same failure — so the regulatory clock is being kept by a mechanism whose operational priority was set by a product decision.
- **The outage rehearsal is a candidate experiment.** Rank it against other scenarios by consequence, exposure and recovery, rather than by its three citations alone.

**None of that is visible in a map read twice** — and all of it is visible in the same map read a third time, which takes about a minute.
:::

::: thread
#### The photo system's map, and what the count finds

Eleven chapters of decisions boil down to a table with eight rows in it.

| Requirement | Mechanism or open obligation | Evidence required |
|---|---|---|
| Viewer reads at p99 200 ms, at the edge | The four sizes as a projection, served through the CDN we already hold — a dependency we characterised in chapter 01, not a mechanism of ours | Edge latency SLO, with its error budget |
| The viewer is handed an older album rather than an error — rung 3 | Existing sizes with an as-of marker and a signed maximum age; refuse when that age cannot be met | Age-gate and failure tests; maximum degraded age still required |
| An upload is acknowledged within 5 s at p99 | One synchronous path that writes two things and resizes nothing; the thumbnailer split out behind the queue | The upload SLO, measured at the edge |
| A new photo has its sizes within 60 s | Thumbnailer, retained recovery obligation and an end-to-end completion deadline; gate serving when freshness is unknown | Load, delayed-message and crash-recovery tests; declared |
| *Your photo is safely stored* — never lost once acknowledged | The original in the object store and its **catalogue row**, both durable before the response | Acknowledged uploads reconciled against originals and rows, out of band; the same sweep removes originals that have no row |
| The uploader sees their own upload at once | Read-your-writes on the **catalogue row** | A synthetic upload that reads its own row straight back |
| *Pending, and you will be told* — rung 4 | The thumbnail state on the **catalogue row**, and the bounded queue that sheds to it | Uploads started against uploads that became viewable |
| A photo is seen only by the people its owner allowed | Permission state on the **catalogue row**, plus a CDN permission-version gate or acknowledged invalidation barrier; protocol unresolved | Revocation through every serving route, failure and cache tests; declared |

Table: The photo system's traceability map. Eight rows, and one mechanism in four of them. {cols="34% 34%"}

The trace covers the listed uploader and viewer promises, but coverage is not a passing result. Moderation also reads every accepted upload and tolerates minutes; its normal objective, overload pause and catch-up budget must remain in the trace. Permission revocation must be tested through the CDN as well as at the catalogue. Until those contracts and evidence are recorded, the design has open findings.

**Read 3 returns a count of four on the catalogue row.** It carries the acknowledgement — a photo nobody can find is a photo lost — the uploader's read-your-writes promise, the rung-4 handle chapter 08 hung on it, *and* the permission invariant, the zero-tolerance count from chapter 09. Four promises on one mechanism, and they are nowhere near the same severity: a stale row is a mild annoyance, a row that no longer says *pending* when it should breaks a rung, a lost row is a lost photo, and a wrong one is a photo shown to the wrong person.

The count prompts scenario analysis. Catalogue loss, a stale permission read and a CDN serving an old signed address have different consequences and recovery paths. A fail-closed permission gate can preserve confidentiality while reducing availability; a catalogue row alone does not provide it. Prioritise these scenarios by harm and exposure, rather than putting the highest count first.

**And one unconsumed figure.** Back in chapter 04 we asked for a working-set size for recent photos, and nothing in the design ever divided by it — the CDN made it irrelevant. By read 1's quieter form that is a finding: nothing consumed it. Drop it, or name the decision it should have informed — the CDN's cache sizing is the obvious candidate — rather than leave it on the page looking like evidence.

**The register starts with consequences.** Permission leakage and loss of an acknowledged original require explicit failure/recovery evidence. Assumed throughput and migration cost also justify probes, but neither a low coupling count nor a module seam discharges those correctness obligations.
:::

::: rule
Read the map for uncovered obligations, unexplained mechanisms and shared dependencies. Then assess each sufficiency claim against its assumptions and evidence. Coverage is not correctness.

And report a chain at its root. One ungrounded word beneath five correct derivations is one finding, not five — because the four correct ones are not the problem, and saying they are is how a review loses the room.
:::

::: owes
- Specification §02 · [Names carry a scope and a contract](../method.html#naming) — scoped terms, preserved behavioural distinctions and the ANSI/NISO Z39.19-2005 (R2010) adaptation
- Specification [§05 · Discipline](../method.html#disc) — the traceability map, both invariants, the third reading and its three obligations, and the anti-pattern of splitting to lower a count
- Specification [step 10 · Trace](../method.html#s10) — the three dispositions as a search order, reading the chain rather than the link, the unconsumed figure, the stressors fired at the finished map, the risk register ranked by failure consequence and exposure, with provenance, reversibility and shared dependencies recorded, and the brownfield cutover
- Specification [step 04](../method.html#s04) — the actual cost to reverse — rollback window, preserved data, deployed consumers, migration work — recorded beside each choice
- Specification [§01 · Claim](../method.html#claim) — the deletion test stated as a count, and the recursive citation rule
:::
