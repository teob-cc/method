---
title: The people and machines that call it
number: "02"
kind: chapter
part: I
description: Client classes, the five tolerances and the degradation ladder — chapter 02 of Systems, from the outside in, the book form of The Outside-In Method.
summary: Client classes, the five tolerances, percentiles, freshness per view, and what a client is handed when you cannot deliver
---

::: standfirst
**Nobody calls your system. Several distinct populations do, with different volumes, different deadlines and different ideas about what counts as a correct answer.** Squashing them into one imagined user is the cheapest mistake there is in system design — and the most expensive one to undo.
:::

::: lead
“Our users need it to be fast.” I have heard that sentence in nearly every kickoff I have sat in, and not once has it been a requirement. What follows is how you turn it into a table a design can be held to — and what the five quite different things are that people turn out to mean by [fast]{.term}, once you make them be specific.
:::

## Classes, not averages

The unit of demand is the **client class**: a group of callers that share an origin, a trust level, a traffic shape and a set of tolerances. Everything downstream is done per class — quotas, isolation, the order in which you shed load when things get tight, the service levels you eventually publish. I have never met the average client, and I am fairly sure you have not either. Design for one and you get a system that looks like it serves everyone and actually serves nobody's real requirements.

When do you split a class out? When any one of these differs enough to change a decision:

| Dimension | What you record, and why it changes something |
|---|---|
| **Identity and origin** | First-party app, partner system, internal service, machine, scheduled job. Human-driven and machine-driven traffic have different shapes: humans arrive in a diurnal wave and give up; machines arrive in a step function and retry |
| **Trust zone** | Public internet, partner extranet, internal network, regulated enclave. This decides where authentication happens and how much you are obliged to distrust the payload. Delegated authority — a service acting on a user's behalf — is its own case, and retrofitting it is painful |
| **Volume and shape** | Read/write mix, average and peak rates, and the burst profile: diurnal, nightly batch, event-driven spike, or the retry storm that follows an outage. A predictable burst is a design input. An unpredictable one is a capacity risk, and naming it as such is the honest move |
| **Tolerances** | The five below. One line each, each a number, each with the conditions it holds under |
| **Shed order** | When you cannot serve everyone, who loses first. This is a business decision and it must be made before the incident, because during the incident it will be made by whichever queue fills up first |

{cols="22%"}

## The five tolerances

“Fast” is not a requirement. Press on it a little and it falls apart into as many as five separate promises, which get traded against each other, and which every class weighs differently.

::: primer
#### 1 · Latency — and why it is always a percentile

An average latency tells you almost nothing, and the reason is that request latency is not symmetric. There is a floor, set by physics, and there is no ceiling at all, so the distribution is skewed — a long right tail of slow requests pulls the mean away from anything a real user ever experiences.

**Sort your requests by how long they took and look at the far end.** That is all a percentile is. “p99 = 210 ms” means that one request in a hundred took longer than 210 ms.
:::

::: figure
![A chart of requests sorted by latency. The curve is nearly flat across the first ninety percent of requests and then rises sharply. The fiftieth percentile is marked at forty milliseconds and the ninety-ninth at two hundred and ten milliseconds, with the last ten percent of requests shaded.](../figures/02-demand.svg)

The curve is flat where most of your requests live and steep where your complaints come from. That is why a latency requirement is a percentile, and why an average is not a requirement at all.
:::

::: primer
#### Two consequences of percentiles that catch people out

**Tails compound across calls.** Take a page that makes twenty independent backend calls: about [18%]{.num} of the time — one minus [0.99²⁰]{.num} — at least one of those calls comes in slower than p99 for the service it hit. So the p99 of a single service is not the p99 of a page built out of twenty of them, and a service-level p99 that looks perfectly comfortable can still mean that nearly one page load in five feels slow.

**A percentile without a population is not a number.** p99 of what, and measured where? Per endpoint, or across all of them? At the edge, where the client's network is part of the figure, or at the service, where it is not? Each of those choices moves the number by an order of magnitude, and a target that does not name them will be quoted back at you against whichever population makes it look met.

So a latency tolerance you can actually use has four parts: **the operation, the percentile, the number, and the measurement point.** “p99 under 200 ms for the feed read, measured at the edge” can be tested. “Fast” cannot be violated — and a thing that cannot be violated cannot justify a single mechanism in the design.
:::

::: primer
#### 2 · Freshness — and why it is recorded per view, not per client

How old may an answer be before it stops being useful? Of the five, this is the one that decides more of your architecture than any other, and the reason is simple: a loose bound means the read can be served from something cheap and rebuildable instead of the expensive authoritative store.

**Record one bound per view, not one per client.** The same shopper is perfectly happy with a five-minute-old product recommendation and will not put up with a two-second-old shopping basket. Collapse those two into “this client needs fresh data” and you have just sent every read in the system to the strict store — and that is exactly how the strict store becomes the bottleneck nobody can remove later.

The bound is the client's to set, because only the client knows what a stale answer costs them. What the bound *implies* — a projection, a cache, a replica, a stream job — is a decision for later, and that later decision is not allowed to reach back and revise the bound.
:::

::: primer
#### 3 · Ordering — always scoped to a key

“Events must be processed in order” is never true globally in a system of any size, and if you promise it globally you pay for it later, in the form of a throughput ceiling. What people nearly always mean is: **in order with respect to some key** — per account, per conversation, per device, per booking.

So name the key. It is the very same key that later turns into your parallelism ceiling and your hot-spot risk, and writing it down now saves you an argument in chapter 07, where the channel gets its ordering key.
:::

::: primer
#### 4 · Durability — what may be lost, and in what window

This is not a yes/no question. Durability is a statement about what survives which failure: a process crash, a lost machine, a rack, a datacentre, a region, an operator typing the wrong command. For each class you ask what may be lost, and how much of it.

The answer is usually narrower than your gut says, and the narrowness is worth real money. A payment authorisation may lose nothing. A behavioural analytics event may lose a few seconds' worth when a machine dies, and saying so out loud is what buys you buffering, batching and an asynchronous write path — three things you cannot have if every event gets treated like a payment.
:::

::: primer
#### 5 · Accuracy — how wrong an answer may be and still be an answer

This is the tolerance most often left unsaid, and the one that most often changes the whole design. A rate limiter that tolerates [±20%]{.num} of counter drift and a ledger that tolerates none are two different systems, and that difference is worth more than any technology choice you make afterwards.

Once a class has said it accepts an error bound, whole families of mechanism open up: approximate counting, sampling, sketches, a cached aggregate recomputed hourly. Every one of them is cheaper than being exactly right, and not one of them is permitted until somebody outside the system has agreed to the bound. That is why accuracy gets asked about here, and is not decided later by an engineer who just needed the query to be faster.
:::

## Every tolerance names the conditions it holds under

“p99 200 ms” and “p99 200 ms *during the nightly partner window*” are two different requirements, and only the second one can be tested. Say which environment each number holds in — normal load, peak, a degraded dependency, a failover in progress — or the figure will be quoted back at you in the one condition you did not mean.

This is not pedantry. A latency target that says nothing about degraded operation is, read literally, a promise to meet it while a dependency is down — usually impossible, always expensive. Spelling the condition out is how you find out, cheaply and early, that two of your promises cannot both be kept.

## What a client is handed when you cannot deliver

Every system fails to serve some of its requests. The design question is not whether that happens but **what the client gets when it does** — and that is a promise, made here, by the only party entitled to make it. Only the client knows what a stale answer, a partial answer or no answer at all costs them.

There are six outcomes a client can see, in rising order of severity. A class says which of them it accepts, how often, and at what cost.

| &nbsp; | Outcome | What the client actually experiences |
|---|---|---|
| **1** | **Correct but slower** | The right answer, later than usual — a retry or a hedge, paid for out of the latency budget. Cheapest rung, and often invisible |
| **2** | **Correct but less** | Ten results instead of fifty; the summary without the detail. Everything returned is true |
| **3** | **Stale but complete** | A whole, coherent answer from a few minutes ago. Requires that something rebuildable exists to serve it from |
| **4** | **Pending but signalled** | “Accepted, not yet done.” Requires that the client can be told later, which makes it a design obligation rather than a message |
| **5** | **Absent but signalled** | An honest failure the client can act on. Far better than it sounds, and far better than rung 6 |
| **6** | [Wrong]{.rate} | A confident answer that is false. **Never permitted**, at any rung, under any load. If a mechanism can produce this, that is a finding rather than a trade-off |

Table: Called the **degradation ladder**. Later chapters work out what delivering each rung costs and whether it is reachable; they do not get to renegotiate which rungs were promised. {cols="6% 26%"}

Writing the ladder down this early does two things for you. It turns “graceful degradation” from a wish into a list of specific, testable behaviours — and it tells you which rungs need infrastructure you do not have yet. Rung 3 needs a rebuildable copy of the data. Rung 4 needs a way to reach the client after the fact. Both are decisions, both cost money, and both are a lot cheaper to discover now than during your first outage.

### Give outcomes scope notes

Use chapter 01's vocabulary record for the result words a client acts on. *Accepted* must say what was accepted and what persistence or delivery condition, if any, that establishes; *completed* must name the final state; *refused* must establish that the requested effect did not take place. Those meanings depend on the operation. An HTTP status code alone does not supply them.

**Unknown is the caller's knowledge, not another spelling of pending or failed.** After a timeout, the operation may already have completed. Keep the operation identity and status/reconciliation path in the contract. A known accepted operation awaiting completion is pending; a caller unable to establish acceptance has an unknown outcome. This is the software use of a scope note from ANSI/NISO Z39.19-2005 (R2010), §6.2.2: define the distinction before somebody has to branch on it.

## Stress the list before you leave it

Everything above was *elicited*: somebody was asked, and somebody answered. Some of what a class needs, nobody in the room can say out loud, because nobody has thought of it yet. So before you call the table finished, take the nouns you have just written down — every class, every view, every tolerance — and ask of each one, with no probability attached and with the ridiculous allowed: **what hits this?**

Whatever comes back is one of three things. A requirement nobody stated — a rung nobody declared is the commonest kind — which joins the table under the same signature as the ones that were. A finding: two things that turn out to fail together, a rung nothing can reach. Or a mechanism worth designing and not worth building yet, which you record as an option — with the trigger that would build it written next to it. This is the cheapest slice of a pass that gets its full instrument in chapter 08, and it is taken here for one reason only: the people who can sign the answer are still in the room.

## Push is a client relationship too

Webhooks, websockets and notification streams are the same relationship with the arrow pointing the other way, and they get left out of the demand inventory all the time, for a simple reason: none of them ever shows up in an access log as an incoming request. A partner waiting on a webhook is a client class like any other, with its own volume, its own tolerances and its own trust zone — and with three obligations that pull-based clients never have: **signing**, so they can tell the message really came from you; **redelivery**, because their endpoint will be down at some point, count on it; and **ordering**, because unless you have said otherwise they will get your messages in whatever order the network and your retries happen to produce.

## The deliverable

The chapter produces a client constraint table, with scope notes for outcome terms where ambiguity matters. The table is short, it is rather boring, and every decision that follows cites it.

| Class | Peak load | Latency | Freshness, per view | Accuracy | Accepts | Trust | Shed order |
|---|---|---|---|---|---|---|---|
| **Consumer app** | [8k]{.num} rps | p99 [200 ms]{.num} | own orders: own writes at once · listing: [60 s]{.num} | exact | rungs 1 and 3 | public + user token | last |
| **Partner batch** | [50×]{.num} nightly burst | minutes | export: hours | exact | rung 4, never 2 | extranet + mTLS | first |
| **Internal service** | [2k]{.num} rps | p99 [20 ms]{.num} | lookups: seconds | [±2%]{.num} on counts | rungs 1 and 5 | intranet | middle |

Table: The client constraint table. Each row is a class; each figure will later be divided by something or carried to a chapter that consumes it.

::: example
#### One read, three classes, and the job nobody mentioned

A retailer's order-history read. It looks like one feature, and that is how it was built: one path against the orders database.

Three populations use it. **Shoppers** look at their own recent orders — a few thousand requests a second at peak, and they must see the order they placed ten seconds ago. **The fraud service** reads the same history synchronously, inside checkout, so its deadline is much tighter — but it is quite happy with data a few seconds old. **A partner reconciliation job** exports the previous day's orders every night at two, and does not care in the least whether that takes a minute or twenty.

The nightly job never got a class, because it was not a feature and nobody had to sign off on it. At 02:00 it pulls the day's orders through the same read path, fills up the same connection pool, and the shoppers' p99 goes from 180 ms to four seconds for eleven minutes. The incident review, as you may have guessed, recommends more database capacity.

**Read the table instead and the answer changes completely.** The job's freshness tolerance is *hours* and its latency tolerance is *minutes* — the two loosest numbers in the whole system. It has no business being on the low-latency path at all. Give it a class and three mechanisms drop straight out of the row, each citing a specific figure in it: read from a rebuildable copy instead of the authoritative store, hold it to a quota so it cannot eat the whole pool, and put it **first** in the shed order, so that it is the thing that gets dropped rather than the thing doing the dropping.

None of that is extra capacity, and none of it could even be concluded until the job had a row of its own. That is the entire argument for classes.
:::

::: warn
**Designing for one imagined client.** The integration nobody mentioned — the nightly partner job, the analytics exporter, the migration script, the dashboard that polls every second — is usually the very traffic that melts the system, and it melts it exactly because nobody ever gave it a class. So when you inventory demand, go looking for the callers who never asked permission.
:::

::: thread
#### Three classes, and the one number that decides the design

- **Uploader** — the mobile app. Peak [5/s]{.num}, needs a definite answer within [5 s]{.num} at p99 — **assumed**, on a mobile link — and accepts **rung 4**: *accepted, not yet processed*, as long as it gets told when that changes.
- **Viewer** — a browser, coming in through the CDN. Peak [100/s]{.num} at the edge, [p99 200 ms]{.num}, and accepts **rung 3** — an older version of the album beats an error.
- **Moderation** — internal, reads every new upload once, tolerates minutes, and gets **shed first**.

Shedding pauses moderation during the agreed overload condition; it does not delete the promise to examine every accepted upload. Record the maximum pause and catch-up time. Until those are agreed, the minutes-of-freshness obligation remains unresolved.

**The most valuable figure elicited here is the viewer's freshness bound: 60 seconds.** Nobody is going to notice that a freshly uploaded photo takes up to a minute to show up at full quality. That one number is what will later let the thumbnails be a projection built off the write path, instead of work the uploader sits and waits for — and all it cost was asking.
:::

::: rule
A tolerance is a number, for a named operation, under stated conditions. Anything else is a preference, and a preference cannot justify a mechanism.

Write your constraints so they can be violated. If no measurement could ever show that you missed it, it was never a requirement — and the component you were about to build on the strength of it has nothing holding it up.
:::

::: owes
- Specification [step 01 · Outside](../method.html#s01), demand half — client classes; the five tolerances, with freshness recorded per view and not per class; the degradation ladder; conditions on every tolerance; push as a reversed surface
- The ladder is also priced at [step 07 · Failure](../method.html#s07) and audited at [step 09 · Operations](../method.html#s09); the stress pass, whose cheapest slice is taken here, gets its instrument at step 07
:::
