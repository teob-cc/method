# Twelve writes a second does not need a cluster

*A published book says it does. One question deletes half the boxes on most system diagrams — including several on mine. Here it is, run against a book of worked designs.*

[FIG 1 — lead image, directly under the title]
Caption: One division closes a range that spans two orders of magnitude · ch. 8, Design a rate-limiting service

Chapter eight of a system design book I like designs a rate limiter. Partway through, it sizes the storage: 808 GB, cut to about 8 GB by running one instance of the limiter per calling service. Eight gigabytes fits in a host's memory. Then comes the sizing decision, in full:

> "Due to our high request rate, we cannot use a single host for rate limiting. If we use 128 hosts, each host will store only 64 MB. **The final number we decide upon will likely be between 1 and 128.**"

Between one and one hundred and twenty-eight. That is the answer, and the chapter proceeds from it into several pages of counter synchronisation between those hosts — an all-to-all topology, rejected as quadratic; then gossip over UDP; then leader election through an external coordination service. Machinery that exists only to serve the top of a range nobody narrowed.

The sentence that narrows it is already in the chapter, four sections earlier: *"Our service should be scalable to billions of daily requests."*

A day is about 10⁵ seconds — 86,400, and you should round it out loud, on purpose. A billion requests a day is 12,000 per second. Take a peak factor of five: 60,000 per second. One in-memory key-value node serves somewhere around 100,000 operations per second. At the assumed 100,000 operations/s per node, 60,000/s is 60% utilisation. A 50% target needs two serving nodes, or three for N−1 capacity. Replication and counter coordination still need their own protocol and budget.

**"We cannot use a single host" is an assertion. The division is a derivation.** They disagree, and only one of them can be checked.

> You have designed or operated a distributed system, and you have read **Designing Data-Intensive Applications** — or learned the same material the expensive way, at three in the morning. Derived data and systems of record, read-your-writes, at-least-once, idempotency keys, partition keys, p99: all of it appears below without definition, because defining it would double the length and you would skim those paragraphs anyway. If more than one of those needs a gloss, Kleppmann is the better next click and this will still be here afterwards. **Nothing here is an introduction to system design.** It is an argument about the order the pieces have to arrive in.

## This is not a bad book failing

The book is Zhiyong Tan's *Acing the System Design Interview* (Manning, 2024). It is a good book, and its instincts are frequently right. *Design a news feed* separates an archive from a serving store, which is exactly the truth-versus-projection split you want. *Design Flickr* rejects on-demand thumbnail generation for the correct reason. *Design a dashboard of top 10 products* contains a genuinely lovely proof that merging per-host max-heaps produces the wrong answer.

Source status for this revision: the descriptions inherit earlier reading notes and have not been reverified against the full book. Locators: ch. 8, pp. 171–195; ch. 12, pp. 266–287; ch. 16, pp. 354–373; ch. 17, pp. 374–394. The arithmetic is conditional on the inputs reproduced here; the node capacity and peak factor are assumptions.

That is what makes it a fair test. A weak book would prove nothing. This is a good book doing the thing almost every design document does: assembling components first, and writing the requirements afterwards as justification.

Which is what my last design document did. Probably yours too.

The result is a document only one half of the organisation can read. Every information system is governed by the model its engineers and its business share; where the only artifact is a box diagram in engineering vocabulary, nobody on the funding side of the table can tell whether it is right, so nobody argues. Reviews become taste against taste, and taste arguments are settled by seniority.

And the boxes nobody could argue about are not free. Each one is a licence, a deploy pipeline, a line in the cloud bill and someone's on-call weekend — a recurring charge against a budget somebody signed, for a reason nobody in the room can name.

## The question

Take any finished design. Change the requirements — traffic a hundred times smaller, consistency valued over latency, internal batch jobs instead of mobile clients. Now look at the architecture.

**If it didn't change, ask why. Out loud.**

Contracted growth is a requirement too, and margin against it is a legitimate answer — but only when the number is stated. A design that survives a change in its inputs silently is not robust. It is untethered.

The sharper version of the test is deletion. Pick any component on the board and ask what obligations its removal would leave unsupported. No recorded answer is a reason to investigate. A shared component can serve several obligations, including recovery; removing one requirement need not make it redundant.

Run this on your own last design document before you run it on anyone else's. It is a cheaper exercise on your own work, and a considerably less comfortable one.

[FIG 2]
Caption: The deletion test · uncited mechanism = speculation · unmapped requirement = gap

The difference the test detects is audible. Two people describing the same system:

**What component-first sounds like.** "We'll use a log for ingestion, a key-value store for reads, a cache in front, split into services." Technologies appear before any number exists. Nothing traces to a constraint that could settle an argument.

**What outside-in sounds like.** "Partner clients burst 50× nightly and tolerate minutes of staleness; end users need p99 100 ms and read-your-writes on their own orders. So: two client classes, two paths, one truth store, one derived view, and a queue that exists to absorb the burst — remove the burst and the queue goes with it."

> "The system is a consequence; the clients are the cause. A review should be able to walk any box on the board back to a sentence about a client — and delete any box that can't make the walk."

## Arithmetic runs twice, and the order is the whole trick

The deletion test is a razor, not a method. What makes it operable is doing the arithmetic in the right place — and the right place turns out to be two places.

**Demand is computed before the stores are chosen.** Peak request rate per client class, data volume and growth, working-set size, cost envelope. Four figures, order of magnitude only, rounding narrated aloud. Crucially, none of them depends on your design: a hundred thousand users at ten requests a day is twelve per second whatever you build. That independence is exactly what lets demand *constrain* the choice of stores instead of merely describing it afterwards.

**Capacity is computed after.** Write amplification, read amplification, node counts, replication overhead, partitions, cross-zone egress. Every one of those terms is a property of a graph that did not exist yet, which is why computing them early produces numbers that are either decorative or impossible.

Split that way, the anchors you need fit on one card.

[FIG 3]
Caption: These answer one question — does this need to be distributed at all?

### Divide in both directions

The habit everyone has is dividing one way: how many nodes does this need? The other direction is where the value is. **Does one node already do this?** If it does, say so out loud and stop. The cheapest distributed system is the one you didn't build.

And when the arithmetic comes out absurd, believe it in the other direction too. Forty nodes to serve twelve transactions per second is not a capacity plan; it is evidence the store was chosen wrongly. Go back to the family selection instead of accepting the cluster.

### The second example is worse, and it's the interesting one

Chapter sixteen designs a news feed. Its first non-functional requirement, verbatim: *"Scalable to support 100K daily active users each making an average of 10 requests daily, and one million news items/day."* That is 12 reads a second and 12 writes a second. Peak of five, and you are at sixty of each — served by a single node with three orders of magnitude of headroom.

The chapter builds two queues, an HDFS archive, a batch ETL pipeline, sharded SQL clusters with a hashed-user-ID partitioning scheme, and a Redis serving tier. Then, sizing a precomputed feed: *"we will need to store one billion user IDs… Total storage requirement is up to 800 TB, which may be beyond the capacity of a Redis cluster."*

One billion, against its own requirement of one hundred thousand. A factor of ten thousand, in the same chapter, on the same argument — and the paragraph that follows spends its energy partitioning users by region to get the imaginary number down to 16 TB.

That contradiction is not carelessness. It is what happens when a number has no provenance. So label every figure you write down: **measured, contractual, or assumed.** Assumed is not shameful; unlabelled is. And every figure labelled assumed goes straight into the risk register — because traceability built on fabricated numbers is laundering, not derivation.

> Twelve writes a second, whatever you build. The cluster it doesn't have is the interesting part.

[pull quote — use Medium's large quote style]

## The question that keeps the expensive store small

Arithmetic deletes hardware. This next one deletes something more expensive: the assumption that a write has to be synchronous.

Design the read side first. List every view clients actually read, put a freshness tolerance in units of time beside each, and most of them will tolerate seconds or minutes. Those can use projections if their complete inputs are retained and the serving path enforces the promised freshness.

Then find the writes where the client genuinely cannot proceed on a maybe. The test is behavioural, not sentimental:

> If this call returned "probably", would the next screen be a lie?

[pull quote]

Booking a seat, taking a payment, claiming a username — the user is about to be told that something happened. Everything else can be accepted and completed behind them. And once you're precise about what is being confirmed, their costs depend on the durability and coordination protocols behind them.

[FIG 4]
Caption: Three acknowledgements · acknowledgements constrain coordination; truth retains all irreducible inputs

The failure this prevents has a name and everybody has shipped it: **treating "must be reliable" as "must be synchronous."** Reliability is durability. Synchrony is a user-experience decision. Conflating them is what drags an entire write path into the strict, expensive store, and with it every scaling problem that store has.

Keep strict coordination scoped to the promises that require it. Retain all irreducible inputs, including ownership and policy, even when their writes need only a receipt. A projection is rebuildable only from complete retained inputs; its freshness bound needs a serving-time gate and a defined response when the bound cannot be met.

## The artifact that survives the meeting

All of this collapses into one table, and two rules checked in both directions.

**Every mechanism cites a requirement.** A mechanism without a recorded obligation needs investigation before removal. **Every requirement maps to at least one mechanism.** An unmapped requirement is a gap, and gaps get designed. Both checks are mechanical. Neither of them is a matter of taste.

[FIG 5]
Caption: The traceability map · a diagram shows what exists; this shows why, and how you'd know if it stopped working

Reviews conducted against this map argue about constraints and evidence. Reviews conducted against a diagram argue about preferences, and end in seniority.

This is a declared trace. Its third column names evidence to obtain, not tests already passed. A freshness alarm detects lag; a serving gate and defined fallback enforce the bound.

A trace also depends on its names meaning the same thing all the way across. If the requirement says *payment completed* and the mechanism only reports *request accepted*, a filled row hides the gap. Keep a scoped vocabulary beside the contract, with preferred terms, aliases and the distinctions that affect behaviour. This adapts [ANSI/NISO Z39.19-2005 (R2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), especially §§6.2 and 8.2: useful equivalence for document retrieval is not enough to make two API outcomes interchangeable. The [full naming rules](https://teob.cc/method/method.html#naming) include consumer checks and change history.

It also kills three things in the same glance, which is exactly why it is uncomfortable to write: components that entered by habit, requirements everyone assumed somebody else had handled, and metrics that measure what was easy rather than what was promised.

## The runtime picture is a quarter of the model

Look at the third column of that table again. Nothing put it there except the first column. Each entry is a requirement restated as the thing that would tell you it had stopped being true — nobody *decided* to watch queue depth during the nightly window; the partner-burst requirement decided it.

That column is observability, and it arrived derived. Which is where the genre stops and this keeps going. A design interview ends at the runtime picture: boxes, arrows, a datastore, sometimes a cache. But the runtime picture is about a quarter of what governs a system. The other three quarters are **how it is watched, how it is changed, and who pays for it** — and those are precisely the parts the funding side of the table can read without a translator.

None of the four is a separate discipline bolted on at the end. Each falls out of the same outside, by the same rule, and each cites a constraint or gets deleted.

[FIG 6]
Caption: Four areas the diagram leaves out · each one derived from the same outside, by the same rule

### The one line worth carrying out of all four

**The first time you split a process in two, you do not add a service. You add a channel** — with remote failure and latency to account for. Local execution already needs concurrency, queue and retry rules. A process boundary does not create those concerns from nothing, and one process does not make multiple durable effects atomic.

So buy it deliberately, with a force you can name: independent deployment, fault isolation, a scaling axis that genuinely differs, or a team boundary that already exists and is not going away. *"It'll scale better"* is not a force. It's a diagram.

These four are also where the other half of the room can finally check your work. Nobody in product can evaluate your choice of message broker. They can evaluate *"this failure mode costs us a booking"*, *"this shape needs two engineers we don't have"*, and *"this is four repos, which is four pipelines and four rotations."* That is the whole point of deriving them rather than assuming them.

## What survived

I ran all eleven design chapters of Part 2 through this, and the honest headline is not that the chapters are wrong. Most of the parts survive.

Object-store payload separation with hash dedup, receipt-style ingest, fail-open rate limiting, validation before serving, template versioning, dead-letter queues with retry counters, change-data-capture in preference to a saga, pre-generated thumbnails, single-leader serialisation for a contended set, one-host rollups — all kept. Redis survives in nearly every chapter. What changes is why it's there: it earns its place from a number and a tolerance, rather than from being the thing one draws in this kind of system.

That is the difference between a review that argues taste and one that argues evidence. The good parts don't need defending in prose, because the map defends them in one column.

None of the underlying ideas are mine. Truth store plus rebuildable derived views is Kleppmann and Kreps — a materialised view is a cached subset of the log and can be rebuilt from it at any time, and when you want to rebuild, you replay from the beginning of what you retained. SLOs promoted from client tolerances and error budgets as arithmetic is the Google SRE workbook. Timeouts, circuit breakers and bulkheads are Nygard's stability patterns. Context before containers is Simon Brown's C4. What I'm claiming is an order, a discipline, and a scope — the sequence in which those ideas have to arrive if each is going to constrain the next, and the insistence that the sequence doesn't stop at the runtime picture.

Nine lines is the whole of it.

[FIG 7]
Caption: The closer · short enough to screenshot, quotable enough to paste

### What this left out

Those nine lines are the discipline, not the whole method. What I skipped, because it doesn't survive contact with a ten-minute read: the four primitives that type every box on a board — surface, channel, processor, store — and the rule that requirements annotate the *edges* rather than living inside the boxes. The ten steps in the order that makes each one constrain the next. The six-rung ladder of what you can hand a client when a dependency is down, and why "wrong" is never a rung. It's written up in full — [the Outside-In Method](https://teob.cc/method/method.html), and it's an afternoon, not ten minutes.

Two things from it are worth stealing even if you never read the rest. **A cache is not a component; it's a derived store with an invalidation contract** — call it that and you're forced to answer the staleness question you were about to skip.

And **a log is not one thing**: it's a producer channel, a store with a retention window, and one consumer channel per reader — three primitives with three different owners. The retention window belongs to the store; effect, deduplication record and saved result must be coupled atomically by the consumer, with a defined retry and replay window. Most "exactly-once" claims die on that sentence, because the guarantee is earned in three places and named in one.

There is a fourth thing on that edge, and it is the one that gets skipped hardest: **the payload schema is an API**. On an async channel it is *the* API — there is no other interface. Yet the same team that would version a REST endpoint, write a deprecation policy and run a review will push a field change to a topic on a Tuesday. The reason is structural, not sloppy: an HTTP caller shows up in your logs, and a topic's consumers are invisible at write time. The ones you have to keep working are the ones you cannot see — the search indexer someone adds next year, the backfill reader replaying from offset zero, the finance job nobody told you about. Give the edge a schema, a compatibility mode, and an owner, or you have published an API by accident and promised nothing about it.

But none of that is where to start. Start here:

Open the last architecture diagram you drew. Pick any box. Name the obligations its removal would leave unsupported.

If you can't, you've just found the most interesting thing in the design.

> "Nothing on this board is taste. Delete any component and I'll name the client requirement that breaks. Show me one where nothing breaks, and I'll delete it myself."
