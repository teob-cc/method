---
title: Watching it
number: "09"
kind: chapter
part: III
description: Watching it, chapter 09 of Systems, from the outside in — every metric names the promise that demanded it. The book form of The Outside-In Method.
summary: "Detection proportioned to consequence; what an SLO actually is and what an error budget buys; the rung as a metric; the counts that must be zero rather than small"
---

::: standfirst
**Instrumenting everything to the same depth is how a monitoring budget gets spent evenly and detection stays uniformly mediocre.** That is the plan I see come out of most monitoring reviews: a dashboard per service, the same panels on every one of them, and not a single panel that anybody ever promised a client. The question is not what you can measure — it is what you promised. Every promise made so far has a number that proves it, and everything else is just a dashboard.
:::

::: lead
Most observability work starts from the emitting side: here is a service, what can it tell us? You get a great deal of data that way, and one very specific blind spot, because [the things easiest to emit are rarely the things you committed to]{.term}.
:::

## Every number names the promise that demanded it

So run it the other way round. Take the promises — by now they are all written down, which was rather the point of the first eight chapters — and ask of each one what number would show it holding, and what number would show it breaking. Done honestly, the list comes out as plain questions: how long did this class wait, measured at the edge? (the SLO) how old was the view it has just been served? (staleness) which rung is it on, and since when? (the rung distribution) has something happened that must never happen? (the audit) how far behind is the channel, and how much has fallen off the end of it? (lag and dead letters) what did serving this class cost us? (attributed spend) and did the class get what it came for? (the outcome KPI). Every one of those is a row in the figure, and every row points back at a chapter.

::: figure
![Eight promises made in earlier chapters, each paired with the number that proves it: latency tolerances become SLOs with error budgets, freshness bounds become monitored staleness, the degradation ladder becomes a rung distribution, accuracy tolerances become the approximation's measured error, invariants become continuous audits, channels become lag and dead-letter counts, the cost envelope becomes attributed spend, and the reason a class calls at all becomes an outcome KPI.](../figures/09-watching-it.svg)

Read it left to right and you have the monitoring plan, written for you. Read it right to left and you have an audit: a dashboard with nothing in its left-hand column was built because it could be, not because anybody asked for it.
:::

Use the same scoped outcome names in observations as in the client contract. A counter labelled *completed* must name the completion condition it observes; counting acceptance while required work is still pending conceals the gap. Keep unknown outcomes visible until reconciliation establishes what happened, and say whether a count refers to requests, operations or delivery attempts. These are different populations even when they concern the same claim or payment. Vocabulary consistency makes the measurement interpretable; it does not prove the promise.

::: primer
#### What an SLO actually is

An SLO is **a client tolerance with a measurement attached**. That is the whole definition, and it explains why so many of the ones I get shown are useless: if the objective was not promoted from a tolerance that somebody outside the system actually stated, it is just a number an engineer picked — and when it is missed, nobody has the right to be upset.

The form that works has four parts: **the class**, **the operation**, **the target**, and **the window**. The first three come straight from chapter 02; the window is the one thing this chapter adds. “The consumer app's feed read succeeds within 200 ms for 99% of requests, measured at the edge, over 28 days.”

**The error budget is the part that changes behaviour.** If the target is 99%, then 1% of requests are allowed to miss it — and over 28 days that is a specific, countable amount of failure you are *permitted* to spend. Spending it on a risky migration is a perfectly good decision. Finding out you spent all of it in the first four days is a reason to stop shipping. Either way, reliability stops being an argument between two people with opinions and becomes arithmetic — which is the same move the method makes everywhere else.

One consequence I want to spell out: **an SLO of 100% is not ambition, it is a refusal to decide.** It leaves no budget at all, so every incident is exactly as unacceptable as every other one, and nothing can be prioritised. And if a promise really has no acceptable failure rate, then it is not an SLO — it is the next primer.
:::

::: primer
#### Zero-tolerance counts — the promises that are not rates

Most reliability figures are rates, and you optimise them: 99.9%, p99, an error percentage. A few are nothing of the kind. Some things must **never happen at all**, and the moment you mix the two, the second kind disappears inside the first.

The test is whether the system **made a promise and broke it at the moment of commitment.** A seat shown as available and then refused at checkout is not a slow request, and it is not a degraded one either — the user was told something false at exactly the point where they cared most. A conversion rate swallows that without a trace: one refused booking in ten thousand does not move any percentage anybody is watching.

So count them as events, target **zero**, and write down what each one costs. That last part matters more than it looks, because the cost is never just the one transaction. A user burned at the moment of payment does not retry — they leave, and then they tell people. What it does to your perceived reliability runs far past the one booking you lost.

And the sharpest consequence: **a sustained non-zero count here is a design finding, not an operational one.** Check the bound before you blame the implementation: if the projection was inside its promised staleness and users were hurt all the same, nothing is broken — the bound itself was wrong, and the choice is between renegotiating the tolerance from chapter 02 and no longer making the promise in the interface. And if it keeps happening after two fixes, the model is wrong — something an invariant needed to be truth is being treated as a projection. That is the re-run trigger, or in the vocabulary of the stress pass, an *attractor report*: the system keeps falling back into a state nobody designed, and production is running chapter 08's stress pass for you, minus the courtesy of a matrix. It sends you back to chapter 05, not to the on-call rota.
:::

## The rung is a metric

The health question everybody asks is *is it up?* — and it is nearly useless, because the interesting states are neither up nor down. The question this method asks instead is:

**Which rung is each client class being served right now, and for how long?**

And you can answer it for free, because chapter 08 already made every degraded response carry a marker. The rate of partial flags, the age distribution of the as-of timestamps, the count of degraded headers — **aggregated per class, those markers *are* the rung distribution.** The failure model mandated the instrumentation before anybody had given monitoring a thought.

It also tells you where to spend your detection, and that is the whole point of proportioning:

- **Detection sharpens as the fall lengthens.** A class that tolerates stale-complete needs a staleness number. A class whose *next rung down* is one it does not tolerate needs that one transition alarmed — fast, and by name — because that boundary is the reason the rungs were ranked in the first place.
- **Where the ladder is shallow, so is the instrumentation.** A class with one acceptable rung and a quick recovery has not earned a dashboard. Spending detection there is the same mistake as spending nodes on twelve transactions a second.
- **The forbidden rung needs detection that does not trust the system.** A system serving wrong answers looks perfectly healthy from the inside — the dashboards are green, because being wrong is not slow. Rung 6 gets caught by a **continuous audit**: an invariant reconciled out of band, a sample checked against truth, alarmed at any non-zero. Nothing that runs inside the thing being checked can find it.

## Alerting, and the one page that is allowed to be different

Two rules cover nearly all of it.

**Pages fire on user-visible symptoms and error-budget burn, never on a bare metric.** High CPU is not a symptom — it is a fact, and it may or may not be hurting anybody. If it is, then what it is doing to them is the page.

**Every page names the client class being hurt.** A page that cannot name one is a ticket. This filter is harsher than it sounds — apply it and most of a typical alert set is gone — and that is the intention. An on-call rota that keeps being woken by things that hurt nobody stops reading pages carefully, and then it misses the one that mattered. I have watched that happen on rotas I was on.

The exception is the last row of the figure, and it needs a channel of its own.

::: example
#### Every component healthy, and nobody could buy anything

A Tuesday deploy changes how the response from a payment provider gets parsed. The provider has added a field, the parsing was stricter than it had any need to be, and the checkout page now renders with the pay button disabled for about a fifth of the users.

**Watch what does not happen.** No service is down. No latency percentile moves — a disabled button is very fast. The error rate does not move either, because *nothing errors*: the page renders, returns 200, and is served comfortably inside its SLO. Every dashboard in the figure above is green, and every one of them is telling the truth.

The error budget is not being spent. The rung distribution is empty: no class is on any rung, because nothing is degraded and nothing is marked. The audits pass, because no invariant has been violated — no seat is double-booked, no balance is wrong. **The system is behaving exactly as specified. It is the composition that is broken**, and no component-level metric can see the composition.

What catches it is the last row of the figure: **checkouts started versus checkouts completed**, which drops [11%]{.num} between Tuesday and Wednesday.

**And it has to be alerted on change rather than on a threshold**, which is the part people push back on. Nobody knows the right absolute number of completed checkouts in an hour — it moves by day, by season, by whatever marketing has been up to this week. Any fixed threshold is either so loose it never fires or so tight it fires every Sunday. But everybody knows the number should not drop eleven per cent overnight. So the detector watches the *shape*, and when the shape moves it opens an investigation instead of waking somebody up.

That is why outcome KPIs get a channel of their own. They are slow, noisy and seasonal, so a threshold page on one is wrong nearly every time — and **paging on revenue teaches people to ignore pages**, which will cost you more than the thing you were trying to catch.
:::

::: warn
**The dashboard nobody can name a requirement for.** Run the deletion test on your monitoring: pick any panel and name the promise whose breach it would show you. If nobody has an answer, it is furniture — and monitoring furniture is not free either. It costs retention, it costs query load, it is one more screen somebody scans past, and — worst of all — it takes a slice of the attention that should have gone to the panel that mattered.
:::

## Diagnosis is a different job from detection

Everything above answers *is it healthy?* None of it answers the question on-call actually has at two in the morning, which is *why was **this** request slow?* Aggregates cannot tell you that. Only a trace can.

So: request-scoped tracing across every hop that carries a deadline — and that is every hop, because chapter 08 mandated deadline propagation. Tracing is not even a new decision at this point. **It is the failure model's deadline propagation made visible** — and if the deadlines are already threaded through, the trace comes very close to free.

::: thread
#### What the photo system watches, and what it deliberately does not

- **Client objectives stay attached to their promises.** Viewer reads target p99 200 ms and upload acceptance p99 5 s. Moderation must still examine every accepted upload within its agreed window outside the stated shedding condition. Record pause and catch-up budgets, backlog age and completeness; “shed first” does not remove that objective.
- **One staleness number:** thumbnail lag against the [60 s]{.num} bound, alarmed at [30 s]{.num}. We have carried that bound since chapter 02, it permitted the projection in chapter 05, and it justified the async channel in chapter 07. Here it finally turns into a monitored number — and you can see the whole chain in one line.
- **One zero-tolerance count:** a photo served to somebody its owner never allowed to see it. Not a rate. Not a percentage of requests. An event count, targeted at zero, found by a continuous audit that compares served requests against the catalogue's permissions out of band — because a serving path that believes itself correct is exactly the failure mode.
- **One outcome KPI:** uploads started versus uploads that became viewable. That is the number that catches the composition breaking — say the thumbnailer quietly failing for one image format, which produces no errors and no change in latency, and would otherwise be found by a user. And users are remarkably good at finding these things — better than any dashboard, and considerably less polite about it.
- **One cost line per unit**, because chapter 03 recorded two of them: gigabyte-months stored, and cost per thousand views. The second is the one that moves if the CDN hit rate assumed in chapter 04 turns out to be wrong — and that is exactly why it went on the risk register. And **one loss line** beside them, for the one violation that costs more than an apology: a photo shown to somebody its owner never allowed. Nobody on a team of four can put a figure on that, so it is recorded as a gap — not as a zero — and carried on the register, which is also why the count above targets zero and is not a rate.

**And what it does not watch.** No dashboard for the object store's internal metrics. It is managed for us, and chapter 01 put it inside the boundary all the same — we answer for it — but what we answer for is what a class is handed when it fails, and that is a rung transition we already count. No per-instance CPU page. Four engineers cannot carry more than a handful of pages, and chapter 03 said as much.
:::

::: rule
Detection is proportioned to consequence, not to what was convenient to emit. Every number names the promise that demanded it.

And the promises that have no acceptable failure rate are not SLOs. They are counts, targeted at zero, found by something that does not trust the system to report on itself.
:::

::: owes
- Specification [step 09 · Operations](../method.html#s09) — detection proportioned to consequence, the rung as a metric, outcome KPIs alerted on change, zero-tolerance counts, SLOs promoted from client tolerances, staleness and channel metrics, alerting that names a class, tracing, and audits that do not trust the system
- Not carried here, and governed by the specification alone: the telemetry budget, the ownership map, security operations and model operations
- Every tolerance measured here was elicited at [step 01](../method.html#s01); the markers that make the rung distribution free were mandated at [step 07](../method.html#s07); a sustained non-zero count is the re-run trigger at [step 10](../method.html#s10)
:::
