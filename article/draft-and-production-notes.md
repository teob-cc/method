# The article draft, with its production notes

> The source of truth of the Medium article `article.md` (see `CHECKLIST.md`), converted from
> `docs/outside-in/article-draft.html` (V6 · 2026-10-12) at the move, without changing its words. The figures
> it describes are `fig1.png` to `fig7.png`.

ARTICLE DRAFT · V6 · 2026-10-12 · ALIGNED WITH METHOD V4.13 · SOURCE VERIFICATION LIMITS STATED

# Twelve writes a second does not need a cluster

**A published book says it does.** One question deletes half the boxes on most system diagrams — including several on mine. Here it is, run against a book of worked designs.

01 [Open](#open) · 02 [The test](#test) · 03 [The arithmetic](#arith) · 04 [One device](#ack) · 05 [The map](#map) · 06 [Scope](#scope) · 07 [Close](#close) · [Production notes](#notes)

01 · OPEN

**BEAT 1 · COLD OPEN**~230 wordslead image: FIG 1

Chapter eight of a system design book I like designs a rate limiter. Partway through, it sizes the storage: 808 GB, cut to about 8 GB by running one instance of the limiter per calling service. Eight gigabytes fits in a host's memory. Then comes the sizing decision, in full:

“Due to our high request rate, we cannot use a single host for rate limiting. If we use 128 hosts, each host will store only 64 MB. **The final number we decide upon will likely be between 1 and 128.**”

Between one and one hundred and twenty-eight. That is the answer, and the chapter proceeds from it into several pages of counter synchronisation between those hosts — an all-to-all topology, rejected as quadratic; then gossip over UDP; then leader election through an external coordination service. Machinery that exists only to serve the top of a range nobody narrowed.

The sentence that narrows it is already in the chapter, four sections earlier: *“Our service should be scalable to billions of daily requests.”*

A day is about 10⁵ seconds — 86,400, and you should round it out loud, on purpose. A billion requests a day is 12,000 per second. Take a peak factor of five: 60,000 per second. One in-memory key-value node serves somewhere around 100,000 operations per second. At the assumed 100,000 operations/s per node, 60,000/s is 60% utilisation. A 50% target needs two serving nodes, or three for N−1 capacity. Replication and counter coordination still need their own protocol and budget.

**“We cannot use a single host” is an assertion. The division is a derivation.** They disagree, and only one of them can be checked.

*Figure: ONE DIVISION CLOSES A RANGE THAT SPANS TWO ORDERS OF MAGNITUDE · CH. 8, DESIGN A RATE-LIMITING SERVICE*

**BEAT 2 · THE TURN**~250 wordsno figure — this beat is the immune system + the audience gate

You have designed or operated a distributed system, and you have read **Designing Data-Intensive Applications** — or learned the same material the expensive way, at three in the morning. Derived data and systems of record, read-your-writes, at-least-once, idempotency keys, partition keys, p99: all of it appears below without definition, because defining it would double the length and you would skim those paragraphs anyway. If more than one of those needs a gloss, Kleppmann is the better next click and this will still be here afterwards. **Nothing here is an introduction to system design.** It is an argument about the order the pieces have to arrive in.

This is not a bad book failing

The book is Zhiyong Tan's *Acing the System Design Interview* (Manning, 2024). It is a good book, and its instincts are frequently right. *Design a news feed* separates an archive from a serving store, which is exactly the truth-versus-projection split you want. *Design Flickr* rejects on-demand thumbnail generation for the correct reason. *Design a dashboard of top 10 products* contains a genuinely lovely proof that merging per-host max-heaps produces the wrong answer.

**Source status for this revision:** descriptions inherit earlier reading notes and have not been reverified against the full book. Locators: ch. 8, pp. 171–195; ch. 12, pp. 266–287; ch. 16, pp. 354–373; ch. 17, pp. 374–394. Arithmetic is conditional on the reproduced inputs; node capacity and peak factor are assumptions.

That is what makes it a fair test. A weak book would prove nothing. This is a good book doing the thing almost every design document does: assembling components first, and writing the requirements afterwards as justification.

Which is what my last design document did. Probably yours too.

The result is a document only one half of the organisation can read. Every information system is governed by the model its engineers and its business share; where the only artifact is a box diagram in engineering vocabulary, nobody on the funding side of the table can tell whether it is right, so nobody argues. Reviews become taste against taste, and taste arguments are settled by seniority.

And the boxes nobody could argue about are not free. Each one is a licence, a deploy pipeline, a line in the cloud bill and someone's on-call weekend — a recurring charge against a budget somebody signed, for a reason nobody in the room can name.

02 · TEST

**BEAT 3 · THE TEST**~250 wordsFIG 2

## The question

Take any finished design. Change the requirements — traffic a hundred times smaller, consistency valued over latency, internal batch jobs instead of mobile clients. Now look at the architecture.

**If it didn't change, ask why. Out loud.**

Contracted growth is a requirement too, and margin against it is a legitimate answer — but only when the number is stated. A design that survives a change in its inputs silently is not robust. It is untethered.

The sharper version of the test is deletion. Pick any component on the board and ask what obligations its removal would leave unsupported. No recorded answer is a reason to investigate. A shared component can serve several obligations, including recovery; removing one requirement need not make it redundant.

Run this on your own last design document before you run it on anyone else's. It is a cheaper exercise on your own work, and a considerably less comfortable one.

*Figure: THE DELETION TEST · UNCITED MECHANISM = SPECULATION · UNMAPPED REQUIREMENT = GAP*

The difference the test detects is audible. Two people describing the same system:

#### What component-first sounds like

“We'll use a log for ingestion, a key-value store for reads, a cache in front, split into services.” Technologies appear before any number exists. Nothing traces to a constraint that could settle an argument.

#### What outside-in sounds like

“Partner clients burst 50× nightly and tolerate minutes of staleness; end users need p99 100 ms and read-your-writes on their own orders. So: two client classes, two paths, one truth store, one derived view, and a queue that exists to absorb the burst — remove the burst and the queue goes with it.”

“The system is a consequence; the clients are the cause. A review should be able to walk any box on the board back to a sentence about a client — and delete any box that can't make the walk.”

03 · ARITHMETIC

**BEAT 4 · THE MECHANISM**~400 wordsFIG 3

## Arithmetic runs twice, and the order is the whole trick

The deletion test is a razor, not a method. What makes it operable is doing the arithmetic in the right place — and the right place turns out to be two places.

**Demand is computed before the stores are chosen.** Peak request rate per client class, data volume and growth, working-set size, cost envelope. Four figures, order of magnitude only, rounding narrated aloud. Crucially, none of them depends on your design: a hundred thousand users at ten requests a day is twelve per second whatever you build. That independence is exactly what lets demand *constrain* the choice of stores instead of merely describing it afterwards.

**Capacity is computed after.** Write amplification, read amplification, node counts, replication overhead, partitions, cross-zone egress. Every one of those terms is a property of a graph that did not exist yet, which is why computing them early produces numbers that are either decorative or impossible.

Split that way, the anchors you need fit on one card.

*Figure: THESE ANSWER ONE QUESTION — DOES THIS NEED TO BE DISTRIBUTED AT ALL?*

Divide in both directions

The habit everyone has is dividing one way: how many nodes does this need? The other direction is where the value is. **Does one node already do this?** If it does, say so out loud and stop. The cheapest distributed system is the one you didn't build.

And when the arithmetic comes out absurd, believe it in the other direction too. Forty nodes to serve twelve transactions per second is not a capacity plan; it is evidence the store was chosen wrongly. Go back to the family selection instead of accepting the cluster.

The second example is worse, and it's the interesting one

Chapter sixteen designs a news feed. Its first non-functional requirement, verbatim: *“Scalable to support 100K daily active users each making an average of 10 requests daily, and one million news items/day.”* That is 12 reads a second and 12 writes a second. Peak of five, and you are at sixty of each — served by a single node with three orders of magnitude of headroom.

The chapter builds two queues, an HDFS archive, a batch ETL pipeline, sharded SQL clusters with a hashed-user-ID partitioning scheme, and a Redis serving tier. Then, sizing a precomputed feed: *“we will need to store one billion user IDs… Total storage requirement is up to 800 TB, which may be beyond the capacity of a Redis cluster.”*

One billion, against its own requirement of one hundred thousand. A factor of ten thousand, in the same chapter, on the same argument — and the paragraph that follows spends its energy partitioning users by region to get the imaginary number down to 16 TB.

That contradiction is not carelessness. It is what happens when a number has no provenance. So label every figure you write down: **measured, contractual, or assumed.** Assumed is not shameful; unlabelled is. And every figure labelled assumed goes straight into the risk register — because traceability built on fabricated numbers is laundering, not derivation.

Twelve writes a second, whatever you build. The cluster it doesn't have is the interesting part.

04 · DEVICE

**BEAT 5 · ONE DEVICE**~300 wordsFIG 4

## The question that keeps the expensive store small

Arithmetic deletes hardware. This next one deletes something more expensive: the assumption that a write has to be synchronous.

Design the read side first. List every view clients actually read, put a freshness tolerance in units of time beside each, and most of them will tolerate seconds or minutes. Those can use projections if their complete inputs are retained and the serving path enforces the promised freshness.

Then find the writes where the client genuinely cannot proceed on a maybe. The test is behavioural, not sentimental:

If this call returned “probably”, would the next screen be a lie?

Booking a seat, taking a payment, claiming a username — the user is about to be told that something happened. Everything else can be accepted and completed behind them. And once you're precise about what is being confirmed, their costs depend on the durability and coordination protocols behind them.

*Figure: THREE ACKNOWLEDGEMENTS · ACKNOWLEDGEMENTS CONSTRAIN COORDINATION; TRUTH RETAINS IRREDUCIBLE INPUTS*

The failure this prevents has a name and everybody has shipped it: **treating “must be reliable” as “must be synchronous.”** Reliability is durability. Synchrony is a user-experience decision. Conflating them is what drags an entire write path into the strict, expensive store, and with it every scaling problem that store has.

Keep strict coordination scoped to the promises that require it. Retain all irreducible inputs, including ownership and policy, even when their writes need only a receipt. A projection is rebuildable only from complete retained inputs; its freshness bound needs a serving-time gate and a defined response when the bound cannot be met.

05 · MAP

**BEAT 6 · WHAT FINISHED LOOKS LIKE**~230 wordsFIG 5

## The artifact that survives the meeting

All of this collapses into one table, and two rules checked in both directions.

**Every mechanism cites a requirement.** A mechanism without a recorded obligation needs investigation before removal. **Every requirement maps to at least one mechanism.** An unmapped requirement is a gap, and gaps get designed. Both checks are mechanical. Neither of them is a matter of taste.

*Figure: THE TRACEABILITY MAP · A DIAGRAM SHOWS WHAT EXISTS; THIS SHOWS WHY, AND HOW YOU'D KNOW IF IT STOPPED WORKING*

Reviews conducted against this map argue about constraints and evidence. Reviews conducted against a diagram argue about preferences, and end in seniority.

This is a declared trace. Its third column names evidence to obtain, not tests already passed. A freshness alarm detects lag; a serving gate and defined fallback enforce the bound.

A trace also depends on its names meaning the same thing all the way across. If the requirement says *payment completed* and the mechanism only reports *request accepted*, a filled row hides the gap. Keep a scoped vocabulary beside the contract, with preferred terms, aliases and the distinctions that affect behaviour. This adapts [ANSI/NISO Z39.19-2005 (R2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), especially §§6.2 and 8.2: useful equivalence for document retrieval is not enough to make two API outcomes interchangeable. The [full naming rules](https://teob.cc/method/method.html#naming) include consumer checks and change history.

It also kills three things in the same glance, which is exactly why it is uncomfortable to write: components that entered by habit, requirements everyone assumed somebody else had handled, and metrics that measure what was easy rather than what was promised.

06 · SCOPE

**BEAT 7 · THE OTHER THREE QUARTERS**~360 wordsFIG 6

## The runtime picture is a quarter of the model

Look at the third column of that table again. Nothing put it there except the first column. Each entry is a requirement restated as the thing that would tell you it had stopped being true — nobody *decided* to watch queue depth during the nightly window; the partner-burst requirement decided it.

That column is observability, and it arrived derived. Which is where the genre stops and this keeps going. A design interview ends at the runtime picture: boxes, arrows, a datastore, sometimes a cache. But the runtime picture is about a quarter of what governs a system. The other three quarters are **how it is watched, how it is changed, and who pays for it** — and those are precisely the parts the funding side of the table can read without a translator.

None of the four is a separate discipline bolted on at the end. Each falls out of the same outside, by the same rule, and each cites a constraint or gets deleted.

*Figure: FOUR AREAS THE DIAGRAM LEAVES OUT · EACH ONE DERIVED FROM THE SAME OUTSIDE, BY THE SAME RULE*

The one line worth carrying out of all four

**The first time you split a process in two, you do not add a service. You add a channel** — with remote failure and latency to account for. Local execution already needs concurrency, queue and retry rules. A process boundary does not create those concerns from nothing, and one process does not make multiple durable effects atomic.

So buy it deliberately, with a force you can name: independent deployment, fault isolation, a scaling axis that genuinely differs, or a team boundary that already exists and is not going away. *“It'll scale better”* is not a force. It's a diagram.

These four are also where the other half of the room can finally check your work. Nobody in product can evaluate your choice of message broker. They can evaluate *“this failure mode costs us a booking”*, *“this shape needs two engineers we don't have”*, and *“this is four repos, which is four pipelines and four rotations.”* That is the whole point of deriving them rather than assuming them.

07 · CLOSE

**BEAT 8 · CLOSE**~250 wordsFIG 7

## What survived

I ran all eleven design chapters of Part 2 through this, and the honest headline is not that the chapters are wrong. Most of the parts survive.

Object-store payload separation with hash dedup, receipt-style ingest, fail-open rate limiting, validation before serving, template versioning, dead-letter queues with retry counters, change-data-capture in preference to a saga, pre-generated thumbnails, single-leader serialisation for a contended set, one-host rollups — all kept. Redis survives in nearly every chapter. What changes is why it's there: it earns its place from a number and a tolerance, rather than from being the thing one draws in this kind of system.

That is the difference between a review that argues taste and one that argues evidence. The good parts don't need defending in prose, because the map defends them in one column.

None of the underlying ideas are mine. Truth store plus rebuildable derived views is Kleppmann and Kreps — a materialised view is a cached subset of the log and can be rebuilt from it at any time, and when you want to rebuild, you replay from the beginning of what you retained. SLOs promoted from client tolerances and error budgets as arithmetic is the Google SRE workbook. Timeouts, circuit breakers and bulkheads are Nygard's stability patterns. Context before containers is Simon Brown's C4. What I'm claiming is an order, a discipline, and a scope — the sequence in which those ideas have to arrive if each is going to constrain the next, and the insistence that the sequence doesn't stop at the runtime picture.

Nine lines is the whole of it.

*Figure: THE CLOSER · SHORT ENOUGH TO SCREENSHOT, QUOTABLE ENOUGH TO PASTE*

What this left out

Those nine lines are the discipline, not the whole method. What I skipped, because it doesn't survive contact with a ten-minute read: the four primitives that type every box on a board — surface, channel, processor, store — and the rule that requirements annotate the *edges* rather than living inside the boxes. The ten steps in the order that makes each one constrain the next. The six-rung ladder of what you can hand a client when a dependency is down, and why “wrong” is never a rung. It's written up in full — [the Outside-In Method](https://teob.cc/method/method.html), and it's an afternoon, not ten minutes.

Two things from it are worth stealing even if you never read the rest. **A cache is not a component; it's a derived store with an invalidation contract** — call it that and you're forced to answer the staleness question you were about to skip.

And **a log is not one thing**: it's a producer channel, a store with a retention window, and one consumer channel per reader — three primitives with three different owners. The retention window belongs to the store; effect, deduplication record and saved result must be coupled atomically by the consumer, with a defined retry and replay window. Most “exactly-once” claims die on that sentence, because the guarantee is earned in three places and named in one.

There is a fourth thing on that edge, and it is the one that gets skipped hardest: **the payload schema is an API**. On an async channel it is *the* API — there is no other interface. Yet the same team that would version a REST endpoint, write a deprecation policy and run a review will push a field change to a topic on a Tuesday. The reason is structural, not sloppy: an HTTP caller shows up in your logs, and a topic's consumers are invisible at write time. The ones you have to keep working are the ones you cannot see — the search indexer someone adds next year, the backfill reader replaying from offset zero, the finance job nobody told you about. Give the edge a schema, a compatibility mode, and an owner, or you have published an API by accident and promised nothing about it.

But none of that is where to start. Start here:

Open the last architecture diagram you drew. Pick any box. Name the obligations its removal would leave unsupported.

If you can't, you've just found the most interesting thing in the design.

“Nothing on this board is taste. Delete any component and I'll name the client requirement that breaks. Show me one where nothing breaks, and I'll delete it myself.”

· NOTES ·

## Production notes

Not part of the article. Decisions, open items, and the things to check before you press publish.

### Screenshot order

**FIG 1** the division — lead image, sits directly under the title on Medium **FIG 2** the deletion walk — after “run this on your own doc” **FIG 3** the two anchor cards — the one readers save; expect it to be the most-screenshotted **FIG 4** receipt / reservation / completion — after the “probably” line **FIG 5** the traceability map — under “two rules checked in both directions” **FIG 6** the adjacent areas — under “each cites a constraint or gets deleted” **FIG 7** the nine lines — final image, above the closing two paragraphs

### Source of record

**Zhiyong Tan, *Acing the System Design Interview*. Manning Publications, January 2024. ISBN 9781633439108, 472 pp.** Available from Manning (print includes the eBook; liveBook reads online), O'Reilly, Amazon and Apple Books. Every figure and every quotation below was taken from this edition directly.

### Quotations — all verbatim, all checked

**§8.4** “Rate limiting is not essential to a service's availability, so we can trade off high availability and fault-tolerance. Accuracy and consistency are fairly important but not stringent.” p. 175 **§8.4.1** “Our service should be scalable to billions of daily requests that query whether a particular requestor should be rate limited.” p. 175 **§8.8.1** “Due to our high request rate, we cannot use a single host for rate limiting. If we use 128 hosts, each host will store only 64 MB. The final number we decide upon will likely be between 1 and 128.” p. 182 **§16.1** “Scalable to support 100K daily active users each making an average of 10 requests daily, and one million news items/day.” p. 356 **§16.3** “…we will need to store one billion user IDs… Total storage requirement is up to 800 TB, which may be beyond the capacity of a Redis cluster.” p. 360

### Lineage claims — checked against the sources

**NYGARD** ✓ corrected · *Release It!* **Second Edition, Pragmatic Bookshelf, 2018** — not the 2007 first edition. Timeouts (p. 91), Circuit Breaker (p. 95) and Bulkheads (p. 98) are his, verbatim and central; the ship-compartment metaphor and “a principle of damage containment” are his words **NYGARD — WHAT HE DOES NOT OWN** ✕ claim withdrawn · the draft credited him with “timeout budgets” and “degradation-as-design”. He treats a timeout as a per-call setting that must exist, **not** as a slice of a caller's budget divided across hops — that framing is deadline propagation, and belongs to the SRE/tracing literature. And “graceful degradation” appears **once** in the whole book, about queueing latency. He has Fail Fast, Shed Load and a Circuit Breaker “fallback” strategy, but no ranked ladder of client-visible outcomes. **The ladder is not his.** **SRE · C4** both free online — settle these without a purchase (sre.google/books, c4model.com) **KLEPPMANN** still unverified — the “truth store plus rebuildable derived views” attribution remains the last open lineage claim in the piece

Unquoted but confirmed in the text: the 808 GB figure at §8.4.1 is 100 services × 64 bits × 101 timestamps × 10M users, and §8.8.1 divides it by ~100 service instances to reach 8.08 GB — that arithmetic is **sound, and the article does not dispute it**; the synchronisation sequence at §8.8.2 runs all-to-all (rejected as quadratic) → gossip over UDP → external coordination service; §16.1 asks for eventual consistency of “up to a few hours” while “a few seconds is desirable” one clause apart; §16.2 splits an HDFS archive from a Redis serving store; and §12.3 rejects on-demand thumbnail generation on latency and cost grounds, concluding that pre-generating at upload is “the only scalable approach.”

### Fact-check pass over the whole corpus

Every figure and quotation in the eleven walks was checked against this edition. Seven claims did not survive and were corrected in the source files; none of them appear in this article, and two are worth knowing because earlier drafts of the article inherited them.

**The 808 GB “contradiction” does not exist.** The ch. 8 walk and the series index both claimed the chapter “contradicts itself: 808 GB claimed from its own 8 GB arithmetic.” It does not — 808 ÷ ~100 service instances = 8.08 GB is correct. Removed from both files, and from this article's own notes. The real gap in ch. 8 is narrower and stronger, and it is the one the cold open uses: the *storage* arithmetic is done twice and done right; the *request rate* is never computed at all — and it is the rate, not the bytes, that decides the host count.

**The ch. 8 chapter does not “build 128 hosts.”** It states a range — “between 1 and 128” — and then designs synchronisation for the top of it. Earlier drafts of this article and of the walk asserted the larger number as the chapter's conclusion. The range is both accurate and the better criticism: a design that cannot distinguish 1 from 128 is a sharper example of the failure than one that simply picks a big number.

The other five were misquotes in the walks — paraphrases inside quotation marks (“five nines” for “Five 9s uptime”, “say, three” for “multiple (e.g., three) hosts”, and similar), plus one phrase attributed to ch. 14 that is not in the book at all, and one arithmetic error where the walk overstated the book's own mistake by 4×. All corrected at source. **None of them reached this draft.**

### Claims in this article, and where each is verified

**COLD OPEN** 808 GB → 8 GB per-service reduction · “between 1 and 128” · sync sequence · “billions of daily requests” · accuracy tolerance — all §8.4–8.8, verbatim **BEAT 2** news feed archive/serving split (§16.2) · Flickr thumbnail rejection (§12.3) · heap-merge counterexample, “{B: 10, C: 11}” (§17.6.2) — all confirmed **BEAT 4** 100K DAU × 10 req/day, 1M items/day (§16.1) · 800 TB from 1B user IDs, 16 TB regional fallback (§16.3) — verbatim **BEAT 8** the survived-parts list — each item traced to the chapter that contains it **ANCHORS (FIG 3)** — method paper, not the book; these are the method's own feasibility figures and carry no citation to Tan

### Nothing is open — all three blockers closed, 21 Aug

- **The placeholder is cut.** “It cost me a message queue I had been rather proud of” was the one sentence in the piece that could not be checked, because only the author could check it. It is replaced by a line that makes the same point without claiming an anecdote: *“It is a cheaper exercise on your own work, and a considerably less comfortable one.”* **If you have a real component you deleted this way, put it back** — a true anecdote there is worth more than the sentence that replaced it. Until then the piece claims nothing it cannot support.

- **Kleppmann and Kreps are verified**, from primary sources rather than from memory. Kleppmann, *Turning the database inside-out*, 4 March 2015: “A materialized view is just a cached subset of the log, and you could rebuild it from the log at any time.” Kreps, *Questioning the Lambda Architecture*, O'Reilly Radar, 2 July 2014: retain the full log, and to reprocess, “start a second instance of your stream processing job that starts processing from the beginning of the retained data.” The body now carries both ideas in one clause rather than two surnames.

- **The title is settled** — see below. The old one pointed at a thesis the method retired at V3.8.

**DONE ELSEWHERE** — all eleven walks and the series index have been rebased on this edition (chapter titles, page ranges, source lines), the seven bad claims corrected at source, the three stale series ordinals fixed, and one typo cleared. The corpus and this draft now agree.

### Deliberately left out

The ten steps as an enumeration, the four primitives table, both structural loops, the security and arithmetic threads, trust / runtime / operations, the sizing table, the consistency-class table, and the one-hour interview script. All of it belongs in the method paper and none of it survives contact with an eight-minute read.

**Ending rebuilt in V3.** The closing nine-lines strip previously carried the method paper's canonical middle column — “four primitives · requirements live on the edges · a cache is a derived store.” Three of the nine lines were therefore vocabulary this article never taught, which reads as an author forgetting to explain a term rather than as a teaser. The middle column now carries the acknowledgement taxonomy, which is the article's strongest device and previously appeared nowhere in the closer. The primitives, the log decomposition and the cache line survive as an explicit *what this left out* passage that names the method and links it — a deliberate cliffhanger instead of an accidental one. The article also did not name or link the method anywhere before this change; there was no conversion path at all.

The degradation ladder is also out, on purpose. It is the second-best screenshot in the corpus, and including it would halve the memorability of the acknowledgement taxonomy. Save it for post #2.

### Medium mechanics

**TAGS** System Design · Software Architecture · Distributed Systems · Software Engineering + one of {Programming, Interviewing} **NOTE** “Interviewing” multiplies reach and changes the audience to job-seekers. Architecture tags reach fewer, better readers. Pick per goal. **CANONICAL** Link the method paper explicitly — Medium takes the SEO otherwise **IMAGES** Medium does not invert images; these render on a light ground in dark mode. Acceptable, but check FIG 7 (dark strip) — it is the one that reverses well

### Alternative titles

**USED** **Twelve writes a second does not need a cluster** — drawn verbatim from beat 3, concrete, and it survives every change the corpus has made since. Narrow by design: engineer-to-engineer beats reach-maximising for a piece whose conversion target is a method paper **RETIRED** Your architecture diagram cannot be wrong — thesis-first and widest audience, but it pointed at the falsifiability claim the method **retired at V3.8** and replaced with the shared model. A title arguing a thesis the piece no longer holds is the one kind of headline that cannot be defended in the comments **UNUSABLE** I re-derived eleven designs from a system design book. Half the components didn't survive. — the highest-ceiling title in the set, and now a promise the corpus cannot keep: the eleven walks were withdrawn from publication on 16 Aug. It would be a bait-and-switch **SUBTITLE** **A published book says it does.** One question deletes half the boxes on most system diagrams — including several on mine. Rewritten with the title — the old subtitle opened *“That's the problem,”* which answered the retired headline and reads as a non-sequitur under this one

### Follow-ups — now explicitly promised in the text

The closing passage names three things it left out. Two of them are the next two posts, so the promise is cheap to keep and the sequence writes itself:

**#2** The degradation ladder — six things you can hand a client, and the sixth is never allowed. Named in the close. The second-best screenshot in the corpus; held back from #1 deliberately so it doesn't halve the ack taxonomy's impact **#3** A log is not one thing — three primitives, three owners, and where “exactly-once” actually gets earned. Named in the close. Strongest standalone piece in the method; needs no book at all **#4** The four primitives — the only remaining promise from the close, and the one that most needs the method paper behind it **#5—** one derivation, one device, ~6 min apiece — **not** the eleven walks, which were withdrawn from publication on 16 Aug and superseded by the eight derivations. Promising them would promise content that no longer exists

If the series stops after #1, the close still works: it points at a finished method paper rather than at posts that don't exist. That is the reason to link the paper rather than promise a part two — **a cliffhanger you can resolve today beats a serial you might not finish.**

ARTICLE DRAFT V6 · 2026-10-12 · derived from The Outside-In Method **V4.13**, the eight derivations, and the book *Systems, from the outside in*. Book of record: Zhiyong Tan, **Acing the System Design Interview** · Manning Publications, 2024 · ISBN 9781633439108. Source figures: ch. 8 Design a rate-limiting service · ch. 16 Design a news feed · method paper §02 load anchors, §03 acknowledgements, §05 traceability map.
