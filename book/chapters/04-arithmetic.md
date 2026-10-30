---
title: Arithmetic before architecture
number: "04"
kind: chapter
part: I
description: "Arithmetic before architecture — chapter 04 of Systems, from the outside in, the book form of The Outside-In Method: divide the four demand figures before a single technology is named."
summary: "Rounding out loud, the anchors worth memorising, latency arithmetic, and the question that deletes most designs: does one machine already do this?"
---

::: standfirst
**The outside is on paper. Before a single technology is named, it gets divided.** An order of magnitude is enough — but the division has to actually happen, on paper and out loud, because that is what turns a list of requirements into a constraint with the power to delete a component.
:::

::: lead
This is the shortest step in the method, and the one I see skipped most often — which I find odd, because it is also the one that saves the most money, and does so most reliably. It takes about ten minutes, and in my experience half a design does not survive it.
:::

## Two passes, and the order is the whole trick

There are two quite different arithmetic exercises hiding inside any system design, and mixing them up is exactly why people come to believe this step is optional.

::: figure
![Two panels separated by a vertical barrier. The left panel, demand arithmetic, contains peak request rate, data volume and growth, working-set size and the cost envelope, and is computed before any technology is named. The right panel, capacity arithmetic, contains write amplification, read amplification, node counts, replica counts, headroom, egress and cost per request, and can only be computed after the design exists.](../figures/04-arithmetic.svg)

Pass 1 is this chapter. Pass 2 waits for chapter 07, when there is finally a graph whose amplification can be counted — and it has to be run then, while the choice is still cheap to reverse.
:::

Only the left panel belongs here, and the reason is a precise one: **those four figures do not depend on your design.** A hundred thousand users at ten requests a day is twelve per second whatever you build. That independence is the whole point — it is what lets the figures *constrain* the choice of stores, instead of just describing it after the fact.

::: primer
#### Round out loud

Precision is not what you are after here, and chasing it is how the step gets wasted. You want an order of magnitude, because the decisions this feeds — one machine or a cluster, one region or several — flip at powers of ten, not at percentages.

So round aggressively, say the rounding out loud, and keep moving. The single most useful approximation in the whole discipline:

::: bigline
A day is about 10<sup>5</sup> seconds.
:::

It is really 86 400, so you overstate the day by about 16% and understate every rate by nearly as much — the anchors below are the exact ones, 12 where the shortcut says 10 — and that is comfortably inside the error on every other input you have. And in exchange, every rate calculation becomes something you can do while talking (no spreadsheet needed!).

| Anchor | Value |
|---|---|
| a day | [≈ 10⁵ s]{.num} (86 400) |
| 1 million a day | [≈ 12 rps]{.num} average |
| 100 million a day | [≈ 1 200 rps]{.num} average |
| peak factor | [2–5×]{.num} average — more for scheduled events |
| 1 billion × 1 KB | [= 1 TB]{.num} |
| 1 Gbps | [≈ 125 MB/s]{.num} |

{cols="38%"}
:::

## Divide in three directions

Everyone remembers to ask “how many machines does this need?” Almost nobody asks the other question — and the other question is where the money is:

**Does one machine already do this?**

If it does, say so out loud and stop right there. The cheapest distributed system is the one you never built. To answer the question you need a rough feel for what a single node manages — not to size anything, just to settle whether you have to distribute at all.

| One node of | Handles, roughly |
|---|---|
| In-memory key-value | [~100k]{.num} operations/s |
| Relational, simple transactions | [~5–20k]{.num} transactions/s |
| LSM store, writes | [~10–15k]{.num}/s |
| Log broker | [100s of MB/s]{.num}; plan [1–10 MB/s]{.num} per partition |
| Stateless service process | [~1–5k]{.num} rps |
| NVMe SSD | [100k–1M]{.num} IOPS |

Table: Feasibility anchors, per node, deliberately conservative. These answer one question — does this need to be distributed? — and they are not sizing figures. {cols="40%"}

Take your peak figure, put it against the relevant row, and read off the headroom. Twelve writes a second against a store that manages thousands is a single node with two to three orders of magnitude to spare — and saying so out loud spares the next several chapters from designing a cluster nobody needs.

**And there is a third direction: the hot key.** Divide its peak demand by measured throughput for the protocol enforcing its invariant. An unbatched writer that waits for each commit has an approximate ceiling of one over commit latency: [5 ms → 200/s]{.num}. Pipelining, batching, contention and the operation itself change that estimate. Record skew and burst duration; a cluster-wide average conceals both.

A load ratio (demand ÷ capacity) near one says the candidate protocol needs measurement or a different design. More unrelated nodes do not remove its coordination bottleneck, but the estimate does not prove that every serial protocol is impossible. Chapter 05 compares enforcement choices only after their assumptions are stated.

::: primer
#### Latency arithmetic beats latency intuition

The second division worth doing here is against the clock. A latency budget gets spent on physics before your code even gets its turn, and the figures sit far enough apart that you can keep them in your head:

<div class="tw">
  <table>
    <tr><td style="width:40%">Memory reference</td><td><span class="num">~100 ns</span></td></tr>
    <tr><td>SSD read</td><td><span class="num">~50 µs</span></td></tr>
    <tr><td>Round trip, same datacentre</td><td><span class="num">~0.5 ms</span></td></tr>
    <tr><td>Round trip, cross-region</td><td><span class="num">~80–150 ms</span></td></tr>
  </table>
  </div>

The gaps are what matter. Memory to SSD is roughly [500×]{.num}; same datacentre to cross-region is roughly [200×]{.num}. So a budget of [100 ms]{.num} allows **at most one** cross-region hop, and on the longer routes not even that — not three, and certainly not three with a retry on top. A design with a p99 target of 100 ms and a synchronous call chain that crosses an ocean twice has failed already, and the arithmetic that shows it takes five seconds and no tooling at all.
:::

## Growth has two drivers, and they are sized separately

A miss I see quite often is treating all data as one growing pile. There are two piles, and they behave rather differently.

- **Event data** grows with traffic. Orders, messages, page views, sensor readings. Double the traffic and this doubles. It usually comes with a natural retention story, because a six-year-old page view is worth very little to anyone.
- **Reference data** grows with the customer list and barely notices traffic at all. Tenants, catalogues, configuration, user records. It is often small, and it almost never expires by itself — so a system with quite modest request rates can still be dragging along a large, slowly accreting body of tenant-owned data from which nobody has ever deleted a row.

Size them separately, or you will get both wrong: the event pile over-sized because you forgot about retention, the reference pile under-sized because you assumed low traffic meant little data.

## Every figure carries a label

Three labels, and they go on every number you have written down since chapter 02:

| Label | Means |
|---|---|
| **measured** | It came from production telemetry or a load test. Name the source |
| **contractual** | It came from an SLA, a contract, or a written commitment |
| **assumed** | Somebody made it up. Including you |

{cols="18%"}

**Assumed is not shameful. Unlabelled is.** An assumed figure is a perfectly legitimate input — it just comes with an obligation: it goes on a risk register, next to the decisions it supports. That pairing is the artifact worth keeping, because assumed figures turn out to be load-bearing far more often than anyone likes to admit, and the question you want to be able to answer in six months is not “was that number right?” but “what did we build on it?”

And the rule that follows from all three: **never invent a number to fill a gap.** If the arithmetic needs an input that does not exist, the missing input is a finding. Say so, mark it assumed, show how sensitive the conclusion is to it, and carry on — but do not quietly slip in a plausible figure. Traceability built on made-up numbers is laundering, not derivation.

::: example
#### The system that did not need to be distributed

A B2B product. Around [2 000]{.num} customer organisations, [50 000]{.num} daily active users between them, each making something like [40]{.num} requests a day. Roughly one in ten of those is a write, and a written record is about [2 KB]{.num}. Retrieval is promised at [p99 300 ms]{.num}. All figures **measured**, from the current version.

**Requests.** 50 000 × 40 is [2 million a day]{.num}. A day is 10⁵ seconds, so that is about [20 rps]{.num} on average. The users are office workers spread over two time zones, so effectively all of it lands inside about nine hours — that alone is a concentration of nearly [3×]{.num}, and with the bursts inside those hours call it [5×]{.num}. Order [100 rps]{.num} at peak.

**Data.** 200 000 writes a day at 2 KB is [400 MB/day]{.num}, so about [150 GB a year]{.num} of event data. Reference data — organisations, users, configuration — is a few hundred megabytes and is not what drives anything. Three years in, call it [half a terabyte]{.num}.

**Working set.** People look at recent things. The last thirty days is about [12 GB]{.num} — which fits in the memory of a quite ordinary machine, with room to spare.

**Now divide against one node.** A relational node handles somewhere between 5 000 and 20 000 simple transactions a second. The peak is 100. That is a utilisation of about [2%]{.num} at peak, at the conservative end of the anchor — [50×]{.num} headroom, and more if the anchor is generous. (Taken against the [20 rps]{.num} average, the way chapter 07 takes its proportionality ratio, it is [250×]{.num}.)

**And against the clock.** A 300 ms budget, with users and data in one region, spends about 0.5 ms per internal round trip. Physics is not the constraint here — nothing in this system comes anywhere near it.

**The conclusion is one machine, and it is not a close call.** A second machine does appear in this design, but for a completely different reason: the business will not accept the outage a single-node failure causes, so the replica is bought by an *availability* promise, not by a capacity figure. Writing down *which* constraint bought it is the point — two nodes for availability and two nodes for throughput look like the same picture and are entirely different designs, and only one of them tells you what to do when the numbers change.

**What the reference architecture would have produced.** An API gateway, three services split by domain noun, a message broker between them, a cache, a search index and the relational store — I have seen this diagram so many times I could draw it with my eyes closed, and so, I suspect, could you. Count what it costs before you price a single instance: **five runnable units** — the gateway, the three services and the broker — with five deployment pipelines and five on-call surfaces; **five channels** that did not exist before, each owing the eight answers chapter 07 will ask of it, from a delivery guarantee and an ordering key to what happens to work in flight when one end goes away; and **four stores**, counting the broker's log, whose consistency relationship somebody now has to specify and monitor. And the channel count is conservative: by chapter 01's rule a broker is a producer channel, a store and one consumer channel per reader, so every producer and every consumer it gains adds a channel.

The monthly bill would be the smaller half of that cost, and I am not going to invent it here — computing it needs the provider's price list, which is exactly the kind of number the previous section forbids you to fabricate. The structural cost alone settles the question, and it was available after four divisions on the back of an envelope.
:::

::: warn
**Collecting numbers and never dividing them.** The most common failure in the whole method, and the hardest to spot afterwards, because the design document looks so diligent. The requirements were gathered carefully and written up neatly — and then the architecture proceeds from habit, with the figures sitting in a table above it that nothing below ever refers to. If a component's justification cites a figure, the division must actually have happened.
:::

::: aside
**A figure with no consumer is a question that should not have been asked.** Next to each number you elicited, name the decision that will divide, bound or settle something with it. Whatever is left over is either a missing decision or a wasted question — and it is worth catching now, because on the page a number that did no work looks exactly like one that did.
:::

::: thread
#### The four figures, divided — and a factor of twenty nobody had written down

**Storage.** [50 000]{.num} uploads a day at about [3 MB]{.num} is [150 GB/day]{.num} — call it [55 TB]{.num} a year of originals, growing with traffic and never expiring by itself.

**Reads.** [2 million]{.num} views a day is about [20/s]{.num} on average and perhaps [100/s]{.num} at peak. **But those arrive at the CDN, not at us.** At a [95%]{.num} hit rate the origin sees about [5/s]{.num}.

**Writes.** [50 000]{.num} uploads a day is about one every two seconds on average. Uploads bunch up far more than views do — an evening, a weekend, a wedding — so I take ten times that, [5/s]{.num} at peak, which is well above the usual [2–5×]{.num} and still lands against a store that handles thousands. One node, with three orders of magnitude to spare.

**Per key.** The expected write rate for one photo is low, but it is still an assumption. Test retries and concurrent metadata changes against the selected transaction protocol. The stop-and-wait estimate is a screening calculation, not a measured ceiling.

**Working set.** People look at recent photos, so I ask for the hot fraction as well: thirty days of uploads is about [4.5 TB]{.num} of originals. Hold on to that number — chapter 11 has something to say about it.

**Cost.** The fourth figure arrives from chapter 03 rather than from a division: [$0.03]{.num} per stored gigabyte-month, [$0.01]{.num} per thousand views. All this pass can do with it is see what it allows — [55 TB]{.num} a year at that ceiling is a storage bill that grows by about [$1 650]{.num} a month for every year of uploads kept — and carry it on. Whether the design fits underneath is chapter 07's sum, not this one's.

The number worth arguing about is that [20×]{.num} reduction. It is the whole reason the CDN contract we hold is load-bearing rather than merely convenient, and it is **assumed** until somebody measures a real hit rate. So it goes on the risk register together with the decision it supports: *if the hit rate is 60% rather than 95%, the origin serves [40/s]{.num} and not [5/s]{.num} — eight times the reads. One node still carries that; what moves is the cost per thousand views, which is the unit chapter 03 told us to watch.*
:::

::: rule
Divide before you decide. No technology is named until the four demand figures exist and have been divided by something.

And divide in three directions. “How many machines?” is the question everyone asks. “Does one already do it?” is the question that saves the project. “Can one key take it?” is the question that decides how an invariant gets held.
:::

And that completes the outside. Two kinds of outsider, five tolerances, an operating envelope, four figures and a set of provenance labels — and still not one component drawn. Now we go in, and we start where the state lives.

::: owes
- Specification [step 02 · Load](../method.html#s02) — the four demand figures, the arithmetic and feasibility anchors, the three directions of division — per cluster, per node and per key — the two growth drivers, provenance labels, and the check that every figure from step 01 is divided or carried
- The exit condition on unconsumed figures is [step 01](../method.html#s01)'s own; step 02 checks it a second time. The hot-key profile divided per key is recorded at [step 03](../method.html#s03), where its load ratio picks the enforcement rung
- The capacity pass named in the figure is [step 04](../method.html#s04)'s sizing pass, and arrives in chapter 07
:::
