---
title: Processed
number: "06"
kind: chapter
part: II
description: Processed, chapter 06 of Systems, from the outside in — the book form of The Outside-In Method.
summary: "Stateless, stateful and batch; idempotence; event time against processing time; approximation with a stated error bound; the rebuild path"
---

::: standfirst
**A processor derives data from other data. It should hold nothing you could not rebuild.** Everything I am going to ask of a processor in this chapter falls out of that one sentence: if the output can be rebuilt, the processor has to be replayable, and if it is replayable, it has to be safe to run twice.
:::

::: lead
Processors are the kind of component people worry about least and specify worst. In most reviews I have sat in, the store got a schema review, the channel got a schema too — eventually — and the processor got a name, a box on the diagram, and the quiet assumption that running it again would do no harm. That assumption is what this chapter is about.
:::

## Three kinds, and what each one costs

| Kind | Holds | What it owes you |
|---|---|---|
| **Stateless** | Nothing between requests | Almost nothing, which is why it is the default. Scale it by adding copies; lose one and nothing is lost with it. **If a processor can be stateless, make it stateless** |
| **Stateful** | Accumulated state — counters, windows, joins, sessions | State size, and how long recovery takes after a crash. The recovery time is the figure people skip, and it is the one that turns a thirty-second failover into forty minutes of rebuilding from a log |
| **Batch** | Nothing between runs; everything within one | A schedule, a window definition, and an answer to what happens when a run overlaps the next one. Also the easiest place to be non-idempotent without noticing, because failures are rare and partial failures are rarer |

{cols="16% 30%"}

What actually matters here is not which product you run it on but the **state size and recovery time**. A stateful stream job holding a hundred megabytes of windowed counters comes back in seconds. One holding four hundred gigabytes of joined session state comes back in however long it takes to read four hundred gigabytes — and all of that time it is doing no work at all. Whether that is acceptable is a question for the tolerances of chapter 02 — not for whoever happens to be configuring the job.

Name a processor for the transformation it owns: *thumbnail generator* states more than *image manager*. Keep the request to perform that work separate from the fact that it happened. Illustrative labels such as *Generate thumbnails* and *Thumbnails generated* distinguish an instruction from an outcome; use the language's ordinary identifier conventions when implementing them. The latter may be emitted only after the defined output condition holds. A queue accepting an instruction establishes neither completed output nor eventual delivery by itself. These are applications of the scoped meanings from [chapter 01](01-the-boundary.html), not a prescribed naming syntax.

## Running it twice

In a real system, everything gets retried. The network drops an acknowledgement after the work was already done. A process crashes between the write and the commit. Delivery is at-least-once far more often than people believe it is. So the question is not whether your processor will see the same input twice — it will — but what happens when it does.

::: primer
#### Idempotence — and the three ways to earn it

An operation is **idempotent** when doing it twice leaves the system exactly where doing it once would have. I rate it the single most valuable property a processor can have, and for a simple reason: it turns a whole class of distributed-systems problems into a non-event.

There are three ways to get it, and I list them in the order I would try them:

1. **Make the operation naturally idempotent.** `SET balance = 100` is idempotent; `ADD 10 TO balance` is not. Wherever you can phrase the work as “put the system into this state” instead of “apply this delta”, the problem just goes away, and it costs you nothing. Try this first, every time — it works more often than you would expect.
2. **Use a conditional write.** Compare-and-set on a version number, or an insert that fails when the key is already there. The store does the enforcing, you keep no extra books, and the second attempt fails harmlessly instead of writing a duplicate.
3. **Couple deduplication to the effect.** Atomically claim the input identifier, apply the effect and persist the result, or use a destination whose idempotency contract provides that boundary. A separate “seen” lookup is insufficient: effect-then-key can duplicate after a crash; key-then-effect can lose work. Handle concurrent claims and conflicting payloads explicitly.

**And a trap specific to the third option, which is the one people reach for.** The deduplication store has a retention window, and that window must be *longer than the longest possible retry window*. Keep dedup keys for an hour, have a broker outage of ninety minutes, and the redelivered message sails straight through as a duplicate — with every dashboard green, because nothing failed. The two windows are set by different people, usually in different systems, and nobody ever puts them side by side. I say this as someone who has been that nobody. Put them side by side.

Deterministic overwrites also need an ordering argument. Replaying an old “set balance to 100” after a newer “set balance to 150” changes the result even though either operation is individually idempotent. Use a version guard or rebuild into a separate generation and cut over atomically.
:::

::: primer
#### Exactly-once is a property you build, not one you buy

There are three delivery guarantees, and the third one is not what its name makes you think.

- **At-most-once** — send, and do not retry. Nothing gets duplicated; things get lost. Perfectly legitimate for telemetry, where a gap costs less than a distortion.
- **At-least-once** — retry until acknowledged. Nothing gets lost; things get duplicated. This is what almost every real system does by default.
- **Effectively-once** — what you can observe looks as if it happened once.

The third is not a stronger guarantee from the network. **It is at-least-once delivery, plus something that keeps the message long enough to deliver it again, plus an idempotent receiver** — and of the three it is the receiver that earns it. When a broker advertises “exactly-once”, it is talking about its own internal commit protocol, and that property ends at the broker's boundary — the moment your processor writes to a store outside it, you are building the guarantee again yourself, from scratch.

So the useful question is never “does this channel give me exactly-once?” The useful question is **“what makes this receiver safe to hit twice, and where is that written down?”**
:::

## Time, and the fact that there are two of them

Every event a processor handles carries two timestamps, and if you mix them up you get answers that are wrong in a way nobody notices for months.

- **Event time** — when the thing actually happened.
- **Processing time** — when your system finally got round to seeing it. (The specification calls this one *arrival time*; it is the same clock.)

And they drift apart all the time: a phone was offline in a lift, a broker was backed up, a partition was being rebalanced, somebody is replaying a backfill from three years ago. Window by processing time and what you are measuring is your own pipeline's punctuality, not the world.

::: figure
![Two parallel timelines, event time above and processing time below, with diagonal lines connecting when each event happened to when it was processed. Two events are processed almost immediately. A third, which happened at ten twelve, is not processed until ten forty-seven, long after the ten-to-ten-fifteen window closed at ten sixteen.](../figures/06-processed.svg)

The two clocks agree most of the time — and that is exactly why the disagreement costs so much: the pipeline looks correct right up to the day something gets delayed.
:::

Windowing by event time is almost always what you want, and it comes with one obligation: **you must decide when to stop waiting.** That decision is called a *watermark* — a claim that nothing older than some point is going to arrive any more. It is a heuristic, so now and then it is wrong, and whatever turns up after it is **late data**. There are exactly three honest things you can do with late data, and the design has to say which one:

- **Drop it**, and count what you dropped. Legitimate — but that count is a metric somebody actually watches, because a late-drop rate that keeps rising means your watermark is mis-tuned and your numbers are quietly drifting away from the truth.
- **Restate** — reopen the window and correct the figure you already published. Correct, and it obliges every consumer downstream to cope with a number that changes after publication. That is a contract, not an implementation detail.
- **Route it elsewhere** — a side channel for the late arrivals, reconciled on its own. You see this a lot in billing, where dropping is out of the question and restating upsets everybody.

## The rebuild path

Chapter 05 made a claim, and this chapter is where it gets paid for: a projection is cheap to get wrong *because it is rebuildable*. Rebuildable means there is a processor you can point at retained truth and run again, and out comes the projection. If that is not actually the case, what you had was never a projection in the first place.

Three things have to be true, and each one is a real design obligation, not a formality:

- **The truth is still there.** If the projection is built from a log that keeps seven days, you can rebuild seven days. To rebuild from the beginning of time, the beginning of time has to still exist somewhere — a compacted topic, an archive in an object store, a snapshot plus a tail.
- **The processor is replayable**, which is to say idempotent — which is what the first half of this chapter was about.
- **The rebuild finishes in an acceptable time**, and somebody has actually measured that rather than assumed it. A rebuild that takes eleven hours is not a recovery strategy for a view with a sixty-second freshness promise. It is a plan to break that promise for eleven hours.

When any of these fails to hold, the failure is quiet and it is severe: **a processor that cannot be replayed has turned its output into a source of truth by accident.** Nobody declared it, so nobody backs it up as one, and the day everyone finds out is the day of the first corruption.

::: primer
#### When a processor is allowed to be wrong

Some of the most useful processors I know do not compute the exact answer at all, and this is where the *accuracy* tolerance from chapter 02 finally gets spent. Counting distinct values exactly means holding on to every value you have seen; a probabilistic cardinality sketch does it in a few kilobytes, with a small and — this is the important part — *known* error. Exact quantiles over a stream mean keeping the stream; a sketch gives you p99 within a bound. Sampling gives you the shape of the traffic for a fraction of the cost.

Every one of these is far cheaper than being exactly right, and every one of them comes with the same obligation: **an approximating processor states its error bound, a client has already accepted it, and a number somebody watches shows the bound still holding.** An approximation whose error is never measured is just a wrong answer with better performance. The engineer who swaps an exact count for a sketch because the query was slow, and does not go back to the tolerance, has changed what the system promises — silently, and in the one direction the degradation ladder never allows.

**And where the two ways of being wrong have different prices, the bound gets a sign.** A hundred over and a hundred under are the same error to a sketch and two quite different invoices to the business — chapter 03's loss lines say how different. So an approximating processor states its error bound **per side**, and the design chooses which side the error falls on: towards the cheaper one. Chapter 05's escrow is the cleanest example I know — it moves the whole error onto the undershoot side and leaves nothing at all on the side nobody can bill.

And that is the whole reason we elicit accuracy from the outside instead of deciding it in here.
:::

One processor from chapter 05 deserves a paragraph here, because it is the easiest one to leave unspecified. An invariant held on the bounded or the detected rung of the enforcement ladder carries two promises — the bound, and the exact figure — and the exact figure is enforced by a **reconciler**: a processor that reads the truth after the fact, works out what really happened and compensates for the difference. It owes everything this chapter has asked so far — safe to run twice, rebuildable from retained truth — and one thing of its own: **a deadline**, the time to close, by which the exact figure is settled and stops moving. For anything that gets billed it is also the **enforcer of record**, which is to say the invoice comes from the reconciler, and never from the path that let the overshoot through.

::: example
#### The batch that must not double-count

Take a nightly billing rollup. It reads the day's usage events and produces invoice lines per customer. It runs at 03:00, takes twenty minutes, and has done its job without a single complaint for two years.

Tonight it dies at 03:11, with lines written for a little over half of the customers. The on-call engineer restarts it at 03:30.

**Design 1 — append.** The job appends one invoice line per customer per period. On restart it goes through everyone again, and the half that was already done is billed twice. Nothing exotic happened here, no distributed-systems subtlety — one `INSERT` and one retry. And nobody will see it until the customers complain, because every log line says success.

**Design 2 — deduplication key.** Every output line is keyed by `(customer, period)` and written insert-if-absent. A re-run skips whatever is already there. This is correct, and you pay for it: a uniqueness constraint or a dedup store, a lookup for every line, and a retention policy on the keys that has to outlive the longest plausible retry — including the manual re-run somebody kicks off four days later.

**Design 3 — idempotent by construction.** The job computes the whole period's lines for each customer from the retained usage events and *replaces* that customer's lines for that period, atomically. Run it again and you get exactly the same result, because the output is a pure function of the input window. No dedup store, no retention window to get wrong, no lookup per line.

**Design 3 is both the most correct and the cheapest** — and you only get to choose it because of a decision taken in the previous chapter. It works because the usage events are **retained truth** you can read again, and the invoice lines are a **projection** of them. Had the events been consumed and thrown away as they arrived, the output would be the only record there is, design 3 would be off the table, and you would be keeping design 2's books for the rest of the system's life.

That is the payoff of separating truth from projections, and it arrives one chapter later in a place nobody expects it: **it does not just make storage cheaper, it makes correctness cheaper.**
:::

::: warn
**Assuming the framework handles it.** Stream processors and job schedulers advertise guarantees that sound very strong, and they are real — inside the framework's own boundary. The moment your processor writes to a store, calls an API or sends an email, it has stepped outside that boundary, and the guarantee stays behind. The email is the clearest case of all: no framework on earth can un-send one.
:::

::: thread
#### The thumbnailer, and why it needs no deduplication store

It is a stateless processor: read one original, write out four sizes, hold nothing in between. It will be retried — whatever ends up carrying the work to it will deliver at least once, which is chapter 07's business, and sooner or later somebody will re-run it by hand after an incident.

**It is idempotent by construction, which is design 3 from the billing example arriving in a different costume.** Every size goes to a key derived deterministically from the photo's identifier and the size, so the second run overwrites instead of appending. No dedup key, no retention window to get wrong, no lookup on the hot path.

And that option exists only because chapter 05 made the original **retained truth**. Had the upload endpoint resized on the way in and kept nothing but the results, the thumbnails would be the only record, and every retry would be a correctness problem instead of a non-event.

One obligation from chapter 02 lands here too: while the sizes do not exist yet, the catalogue row has to say so, because **rung 4 is a promise the uploader accepted** — *pending, and you will be told.* A failed thumbnail that quietly leaves the row looking complete is rung 6, and rung 6 is never allowed.
:::

::: rule
Every processor must be safe to run twice, and its output must be rebuildable from something still retained.

A processor that cannot be replayed is a source of truth that nobody declared — and it will be discovered as one during the first corruption, which is the worst possible moment to find out.
:::

::: owes
- Specification [Naming concepts and contracts](../method.html#naming) — scoped terms, preserved behavioural distinctions and the ANSI/NISO Z39.19-2005 (R2010) adaptation
- Specification [§02 · Primitives](../method.html#prim) — the processor's declarations: its kind, state size and recovery time, idempotence under replay, late and out-of-order handling, the rebuild path
- Specification [step 06 · Derivation](../method.html#s06) — idempotence under replay, event time against arrival time, approximation as a stated tolerance with a monitored bound, signed per side where the two errors are priced differently, the reconciler as a processor with a deadline and the enforcer of record, and the rebuild path as a first-class feature
- Not carried here, and governed by the specification alone: keying and parallelism as a processor's declaration (the key itself is chapter 07's), merge semantics wherever partial results are combined, and the fourth processor kind — the model
- The accuracy tolerance being spent here was elicited at [step 01](../method.html#s01); delivery guarantees are specified on the channel at [step 04](../method.html#s04) and are the subject of chapter 07
:::
