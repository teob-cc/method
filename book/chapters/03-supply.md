---
title: The organisation that has to run it
number: "03"
kind: chapter
part: I
description: Chapter 03 of Systems, from the outside in — the organisation that has to build, pay for and be woken up by the system is an outsider too, and its operating envelope goes on paper before any store is chosen.
summary: "The second outside: money, people, hosting, contracts already held, lifecycle — and consumers you cannot rebuild for"
---

::: standfirst
**The system does not choose its own budget, its own staff, or its own datacentre.** All three arrive from outside, the same way a client's deadline does, and they squeeze the design just as hard. I want them written down here, next to the clients, rather than discovered at deployment — because that is the only way the cost conversation happens before the stores are chosen and not after.
:::

::: lead
Chapter 02 was about the outsiders who want something from the system. This chapter is about the other half of the outside: [the organisation that has to build it, pay for it and be woken up by it.]{.term}
:::

Most design documents I review leave this half out entirely, and that omission is exactly where the technically defensible, organisationally impossible designs come from. A three-person team gets handed an architecture that assumes a platform group. A regulated business gets handed a managed service it is not allowed to use. A budget of a few thousand a month gets handed a topology whose idle cost alone is more than that. In none of these cases was the design wrong about the clients. It just never asked who was going to run it.

## The operating envelope

Eight things, and none of them is a deployment detail. Every one of them constrains a decision you will make later in this book, so every row names what it will constrain — the same discipline as chapter 02's table, and for the same reason.

| Constraint | What you actually record | Constrains |
|---|---|---|
| **Operating capability** | What this team can run well at three in the morning — not what it can spell. Available skills, on-call depth, the existing fleet, operational maturity per candidate technology. **A store nobody can debug under load is a liability priced as an asset** | store family · runtime |
| **Hosting posture** | Cloud, on-premise, hybrid, or a sovereign region. A constraint, not a preference: it decides which managed services are even on the table, and a hybrid mandate means some stores cannot be the obvious one | stores · placement |
| **Contracts already held** | An existing CDN deal, a cold-storage tier already paid for, a committed-spend agreement, a licensed database. The sharpest input on this list and the most commonly ignored | stores · lifecycle tier |
| **Cost envelope** | A ceiling *and* a unit — per request, per tenant, or per month — plus which line it defends: infrastructure, egress, licence, or headcount. And beside the cost lines, **loss lines**: what one unit of violation costs the business | the fourth figure in ch 04 · the capacity pass in ch 07 · the ladder's price in ch 08 |
| **Team topology** | How many teams, owning what, on which release cadence. Boundaries get cut where ownership is cut, so this is the input that decides how many runnable units are defensible | boundaries in ch 07 |
| **Expected lifecycle** | Spike · one-off product · prototype becoming a platform · established platform. A different question from scale, and usually known on day one | seams · delivery machinery |
| **Published interfaces** | Who holds an artifact of this system that you cannot rebuild for them. One question, and it decides the compatibility promises | compatibility promise · version scheme · deprecation window |
| **Procurement reality** | What can be bought this quarter, what needs a review board, what data may leave the building — and which jurisdiction it has to stay in. A design that assumes frictionless procurement has an implementation date it will not meet | every technology choice |

Table: The operating envelope. Written once, cited repeatedly. A row with no named consumer is a question that should not have been asked. {cols="24% * 16%"}

::: figure
![Seven of the eight recorded parts of the operating envelope on the left — procurement is the note beneath them — each joined by a line to the later chapter that consumes it on the right: stores at chapter 05, the arithmetic at chapter 04, boundaries at chapter 07, and delivery at chapter 10. Expected lifecycle is joined to two of them.](../figures/03-supply.svg)

Simplified, deliberately: several of these constraints are consumed in more than one place, and only *expected lifecycle* is drawn with both of its lines, to make the point. Where the picture and the table disagree, the table above wins.
:::

::: primer
#### Cost is an input, not an outcome

Most reviews I sit in design the system first and find out what it costs afterwards. That order guarantees one thing: the cost conversation happens after every expensive decision has already been made and has grown hard to undo. So cost goes here, in with the other things that arrive from outside, and not at the end.

**State it as a ceiling and a unit.** “Cost-conscious” is not a constraint. “Under half a cent a request, infrastructure only, with egress as the watched line” is a constraint — you can divide it, you can violate it, and so it can justify a mechanism or delete one.

The unit matters just as much as the ceiling, because the unit decides what the number is allowed to do. A **per-request** ceiling squeezes the hot path: how many stores one write may touch, whether a request may cross a region, how much you may spend on an inference call. A **per-tenant** ceiling squeezes isolation — it is the number that tells you whether every customer can have a database of their own. A **monthly** ceiling squeezes the floor: what the system costs while nobody is using it, and that is the figure that quietly kills small products.

**And a capability you already own changes which store is cheapest, and therefore which store is correct.** This is the part that feels like cheating, and it is not. If the business already pays for a cold-archive tier, the archival decision two chapters from now is half-made before you get there — not because that technology is any better, but because its marginal cost here is close to zero and the alternative's is not. Ignoring that and picking the store you would pick on a blank sheet is not rigour. It is spending somebody else's money to avoid one awkward sentence in a design document.

**And beside every cost line, a loss line.** A ceiling says what the system may cost to *run*. It says nothing at all about what it costs the business when the system gets something wrong — and that is the other half of every price this book will ask you for. So the envelope records those as well, one per kind of violation: an over-delivered impression nobody can bill, a refunded booking, an SLA credit, an hour of a paying class sitting on rung 5. Each one is a figure with provenance like any other, and usually an assumed one, which puts it on the risk register. They get spent twice later on. Chapter 08 prices the degradation ladder both ways, what a rung costs to build and what each landing on it costs the business. And they make the economic citation possible: a mechanism's running cost set against the expected loss it prevents. Where the loss prevented is a small fraction of what the mechanism costs, the mechanism is correct and unjustified — the same verdict chapter 07 hands a ratio in the hundreds.
:::

::: primer
#### Expected lifecycle — four cases, and the asymmetry that makes it worth guessing

How long is this thing supposed to live, and what is it supposed to turn into? That is a different question from how big it will get — and it shapes the implementation stack and the delivery machinery more than scale does.

- **Spike.** It exists to answer one question, and then it dies. One deployable, no seams, no migration path, and only enough instrumentation to trust the answer. Any ceremony here is waste, pure and simple.
- **One-off product.** Bounded scope, real users, and no ambition to become a platform. Boring technology and the bare minimum of delivery machinery — but real operations, because real people depend on it. Do not build for an evolution you have decided will not happen.
- **Prototype becoming a platform.** The expensive case, and the one I see built wrong in both directions. The answer is **seams now, runtime splits later**: real module boundaries where you expect the future boundaries to fall, and not a single network hop until a force buys them. A seam is cheap to put in and cheap to keep. A premature distributed system is neither.
- **Established platform.** Several teams, independent release cadences, external consumers. Now the boundaries do earn their network hops, and delivery needs the whole machinery: progressive rollout, contract versioning, deprecation windows.

**The guess is asymmetric, so label it and say what would falsify it.** Build platform ceremony for a spike and you have wasted a few weeks. Build a spike with no seams and watch it turn into a platform, and you have bought yourself a rewrite. So record the answer with a provenance label, like any other figure, and write down the trigger that would change it — the second customer, the second team, the first external consumer. That trigger is what reopens the decision, and naming it in advance is what keeps the reopening from turning into a fight.
:::

## Consumers you cannot rebuild for

One question in the envelope I want to pull out on its own, because a surprising amount of machinery hangs off it — and because in my experience almost nobody asks it out loud:

**Who holds an artifact of this system that you cannot change and redeploy on their behalf?** A client library, an SDK, a schema, an image, a public API version — anyone at all?

That question is the line between an interface that is merely *public* and one that is **published**. A public interface you can change, and update every caller in the same commit. With a published one you cannot get at the calling code at all — somebody else decides when to move, or whether to move at all.

The answer determines the compatibility promise, supported versions and deprecation window. Repository topology is a separate decision about source access, ownership and coordination: a public SDK can live in a monorepo. Company ownership also does not update an old mobile build already on a device.

Answer it here, with names, and those three decisions stop being defaults you inherited from whichever template the repository happened to be created from.

## Teams, and the boundaries they buy

Team topology gets a paragraph of its own for the same reason: it is an input to a decision that people usually make on taste. Services get cut where ownership gets cut, because a runnable unit needs an owner who is awake when it falls over. There are two practical consequences, and they pull in opposite directions:

- **More runnable units than teams is a smell.** If you have more independently deployable things than teams that can carry a pager, then somebody owns a unit they have never operated. That is not an architecture — that is a rota problem waiting for its first incident.
- **A boundary that crosses no organisational line is usually a deployment unit pretending to be an architecture.** It carries every cost of a distributed system — a channel, a failure mode, a versioned contract — and none of the independence that was supposed to pay for them.

Repository topology needs its own justification. Team boundaries, access restrictions and coordination costs can matter; none automatically dictates the runtime or the versions deployed consumers can use.

::: example
#### Two organisations, identical demand, legitimately different designs

Take one requirement and hand it to two organisations: a document-processing service. Around [200]{.num} requests a second at peak, roughly [5 TB]{.num} of documents and growing steadily, [p99 500 ms]{.num} on retrieval, customers in the EU. The client constraint table is the same in both cases, line for line.

**Organisation A** — three engineers, one cloud provider, a ceiling of [$3 000]{.num} a month, lifecycle recorded as *one-off product*, and on-call that stops at six in the evening — and good for them.

**Organisation B** — twenty-five engineers in three teams, an on-premise mandate because one of the customers is regulated, an enterprise database licence already paid for, a tape-archive contract already signed, lifecycle recorded as *prototype becoming a platform*, and a real 24/7 rota.

So A ends up with one runnable unit, a managed relational store, a managed object store, and an accepted overnight degradation to rung 5 — absent but signalled — because nobody is awake to do any better and the class agreed to it. B ends up with the licensed database (it is already paid for, so it is the cheapest option, so it is the correct one), on-premise object storage tiered into the archive contract, module seams cut now because the platform is on its way, and no accepted overnight degradation at all.

**Neither design is wrong, and neither could adopt the other's.** Had A copied B, it would have spent the whole budget on machinery for a lifecycle it does not have, and staffed a rota it has no people for. Had B copied A, it would have bought a cloud service it is not allowed to use, and left a paid-for licence and a paid-for archive tier sitting idle while paying a second time for their replacements.

Every one of those differences traces back to a row in the operating envelope, and not one of them traces back to anything a client asked for. That, in one example, is what the supply half is for.
:::

## Supply constrains — it does not excuse

There is one obvious way to abuse everything in this chapter, so let me name it before somebody else does. The envelope explains why a design has the shape it has. It never excuses a design that fails a client tolerance.

“We cannot meet p99 200 ms because we only have three engineers” is not a design decision. It is two facts that nobody has reconciled yet, and the reconciling is somebody else's job. When a demand constraint and a supply constraint really cannot both be met, what you have is **a finding to escalate with numbers attached** — this promise, that envelope, here is the gap, here are the three ways to close it and what each one costs. What you do not have is a compromise to swallow quietly inside the design, where a client will find it later instead of the person who holds the budget.

The numbers are what turn this from an argument into a conversation. A design that can say “meeting the 200 ms promise for this class needs a second read replica at roughly $900 a month, which is 30% of the stated ceiling” has moved the decision to the person who owns the ceiling — which is exactly where it belongs. That is the whole point of writing the envelope down.

::: warn
**Treating cost and capability as a deployment concern.** Both are inputs, and arriving late is exactly what makes them expensive. A store chosen in chapter 05 and priced at deployment has already been chosen — so the pricing conversation is no longer a decision, it is a re-litigation. The organisation is outside the boundary, and so it belongs in the part of the work that characterises the outside.
:::

::: thread
#### The envelope, and why the CDN was outside the boundary

Four engineers, one cloud region, on-call that stops in the evening. Lifecycle recorded as **one-off product**, with a single written trigger that would reopen it: the first customer who requires their own region.

And one contract already held — **a CDN deal, signed and paid for.** That is the row that explains chapter 01's boundary, the one we drew at the start. The CDN sat outside not because delivery is somebody else's problem, but because the deal is all we have of it: we cannot change how it behaves, only read off what the contract grants us. And a capability you already own changes which option is cheapest, and therefore which one is correct.

Cost is stated in two units, because this system has two: **per stored gigabyte-month** and **per thousand views**. One monthly ceiling would have hidden which of the two was doing the growing. The ceilings are [$0.03]{.num} per stored gigabyte-month and [$0.01]{.num} per thousand views — both **assumed**, which here means the person who owns the budget said them out loud and nobody has signed them yet.
:::

::: rule
The organisation is an outsider. Write down what it can run, what it already owns, what it can afford, and how long this is expected to live — before choosing anything it will have to operate.

Then hold both halves at once. A design that satisfies its clients and cannot be run is not a design, and a design that fits the envelope and misses a promise is a finding, not a compromise.
:::

With both halves of the outside on paper, the next chapter does the one thing that has to happen before anybody names a technology: it divides.

::: owes
- Specification [step 01 · Outside](../method.html#s01), supply half — operating capability, hosting posture, contracts held, cost envelope with its loss lines, team topology, the four lifecycles, consumers you cannot rebuild for, procurement
- Specification [§01 · Claim](../method.html#claim) — operations and delivery as areas derived from the same outside rather than bolted on
- The published-interface line is consumed at [step 04](../method.html#s04) for the version and deprecation contract, and at [step 09](../method.html#s09) for the version scheme
:::
