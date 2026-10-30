---
number: "01"
id: "s01"
title: "Outside"
phase: "I"
---

::: def
Characterise every entity outside the system boundary. There are two kinds and both are non-negotiable inputs: **demand** — who needs something from the system — and **supply** — the organisation that has to build, pay for and run it. Nothing inside is designed yet, and no technology is named.
:::

::: asks
ASKS · Who calls this, at what volume, and what can they tolerate · and what is this organisation actually able to operate, host and afford?
:::

**Capture the language of the outside.** Start the [scoped vocabulary table](#naming) for concepts whose ambiguity could change a client promise. Record the preferred terms, aliases, distinctions and sources beside the client table; mark unresolved meanings and their decision owner. Dependency terminology is mapped at the boundary, not silently treated as equivalent.

### 1 · Demand — who needs something from it {style="color:var(--blue);font-size:12.5px;margin:6px 0 4px"}

- **Identity and origin**: first-party apps, partner systems, internal services, machines, scheduled jobs. Human-driven and machine-driven traffic have different shapes and deserve different classes.
- **Trust zone**: public internet, partner extranet, internal network, regulated enclave. Delegated authority (a service acting on a user's behalf) is a distinct case — name it now or retrofit it painfully later.
- **Volume and shape**: read/write mix, average and peak rates, burst profile — diurnal, nightly batch, event-driven spikes, retry storms after an outage. Predictable bursts are a design input; unpredictable ones are a capacity risk.
- **Tolerances — five, one line each.** Four are recorded per class: latency per operation as a percentile, ordering scoped to a key, durability expectations, and **accuracy** — how wrong an answer may be before it stops being an answer. Accuracy is a first-class tolerance and the one most often left unstated: a rate limiter that tolerates ±20 % counter drift and a ledger that tolerates none are different systems, and the difference is worth more than any technology choice made later.
- **The views this class reads, each with its own freshness bound** — the fifth tolerance, and the one that is never recorded per class. Not one staleness figure per client — one per view. A buyer tolerates a five-minute-old recommendation and a two-second-old basket, and flattening those into “this client needs fresh data” is how every read ends up served from the strict store. The bound belongs to the client because only the client knows what a stale answer costs them; the data step decides what that bound *implies*, and cannot decide the bound itself.
- **What this class is still handed when a dependency is down.** There are six client-visible outcomes, in rising severity — `correct but slower` · `correct but less` · `stale but complete` · `pending but signalled` · `absent but signalled` · `wrong`, which is never permitted. Say which of the five this class accepts, how often, and at what cost to them. This is a promise, and it is made here for the same reason every other promise is: **the client is the only party who can make it.** The failure step works out what delivering it costs; it does not get to renegotiate it.
- **Stress the list before leaving the step.** The classes and tolerances above are elicited; some of what a class needs, nobody in the room can articulate. Take the nouns just written — each class, each view, each tolerance — and ask, without probability and with the ridiculous allowed, *what hits this?* A discovered rung joins the ladder under the same signing rules as a declared one, and a mechanism worth designing but not building yet is recorded as an **option** — designed, primed, unbuilt, with the trigger that would build it written beside it. The full pass, with its instrument, is at step [07]{.num}; this is its cheapest slice, taken while the people who can sign are still in the room.
- **Every tolerance names the conditions it holds under.** “p99 200 ms” and “p99 200 ms *during the nightly partner window*” are different requirements, and only the second can be tested. State the environment — normal load, peak, degraded dependency, ongoing failover — or the number will be quoted back at you in the one condition you did not mean.
- **Devices and networks**: lossy mobile links imply client retries, so the write path needs idempotency; offline-capable clients imply conflict resolution; server-to-server callers imply high concurrency and thin payloads.
- **Push is a client relationship too.** Webhooks, websockets, and notification streams are surfaces with the direction reversed — they carry their own signing, redelivery, and ordering story, and a partner awaiting a webhook is a client class like any other.
- **Geography and regime**: where requests originate, where the people are, where the data is legally allowed to live, and which regulatory framework applies to which class of them.
- **Adversaries are clients too.** They sit outside the boundary with intent and no quota agreement: scrapers, credential-stuffers, fraudulent counterparties, abusive tenants, and the insider with legitimate access. Give them classes alongside the honest ones — volume, entry surface, and what they want. A system characterised only by its well-behaved callers is designed for a world that doesn't exist.
- **Your dependencies are client relationships reversed.** The services you call — payment processors, identity providers, notification gateways, the object store — sit outside the boundary too, and they hand you a quota rather than accept one. Record what each grants you: rate limit, latency contract, cost per call, trust zone, and the availability figure it contributes. That last one is what makes an availability claim a multiplication instead of an adjective.

| Client class | Peak load | Latency | Views read · freshness bound | Accepts when degraded | Trust | Shed order |
|---|---|---|---|---|---|---|
| Consumer app | [8k]{.num} rps | p99 [200 ms]{.num} | own orders: own writes at once · listing: [60 s]{.num} | slower · stale, marked | public + user token | last |
| Partner batch | [50×]{.num} nightly burst | minutes | export: hours | pending · never partial | extranet + mTLS | first |
| Internal service | [2k]{.num} rps | p99 [20 ms]{.num} | lookups: seconds | slower · absent, signalled | intranet | middle |

### 2 · Supply — what this organisation can actually run {style="color:var(--blue);font-size:12.5px;margin:14px 0 4px"}

The system does not choose its own budget, its own staff, or its own datacentre. Those arrive from outside exactly as a client's p99 does, and they constrain the design just as hard. Recording them here — rather than discovering them at deployment — is what stops the cost conversation from happening after the stores are chosen.

- **Operating capability.** What this team can run well at 3 a.m., not what it can spell. Available skills, on-call depth, the existing fleet, and operational maturity for each candidate technology class. A store nobody can debug under load is a liability priced as an asset.
- **Hosting posture**: cloud, on-premise, hybrid, or sovereign-region. This is a constraint, not a preference, and it decides which managed services are even on the table. A hybrid mandate means some stores cannot be the obvious one.
- **Contracts and commitments already held.** An existing CDN deal, a cold-storage tier already paid for, a committed-spend agreement, a licensed database. These are the sharpest input on this list and the most commonly ignored: **a capability you already own changes which store is cheapest, and therefore which store is correct.** The archival tier is half-decided before step 04 opens.
- **Cost envelope**, stated as a ceiling and a unit — per request, per tenant, or per month. Say which line it defends: infrastructure, egress, licence, or headcount. A design that cannot state its cost per request has not finished this step, and one that discovers cost in production never started it. **Record loss lines beside the cost lines**: what one unit of violation costs the business — an over-delivered impression nobody can bill, a refunded booking, an SLA credit, an hour of a paying class on rung 5. Each is a figure with a provenance label, usually assumed and so a risk-register entry, and it is what the degradation ladder and the enforcement ladder are priced against at steps [03]{.num} and [07]{.num}.
- **Team topology.** How many teams, owning what, with which release cadence. This is the input the boundary decision consumes at step 04 — services are cut where ownership is cut, and a boundary that crosses no organisational line is usually a deployment unit pretending to be an architecture.
- **Expected lifecycle — how long this lives and what it becomes.** This is the input that shapes the implementation stack and the delivery machinery, and it is a different question from scale. Four cases, and the honest answer is usually known on day one: <br>· **Spike** — exists to answer a question, then dies. One deployable, no seams, no migration path, and only enough instrumentation to trust the answer. Ceremony here is pure waste. <br>· **One-off product** — bounded scope, real users, no ambition to become a platform. Boring technology, minimal delivery machinery, but genuine operations, because people depend on it. Do not build for an evolution you have decided will not happen. <br>· **Prototype becoming a platform** — the expensive case, and the one that is wrong in both directions. Its answer is **seams now, runtime splits later**: module boundaries with real interfaces where the future boundaries will fall, and no network hops until a force buys them. A seam is cheap to insert and cheap to keep; a premature distributed system is neither. <br>· **Established platform** — several teams, independent release cadence, external consumers. Now boundaries earn their network hops and delivery needs the full machinery: progressive rollout, contract versioning, deprecation windows.
- **The lifecycle guess is asymmetric, so label it.** Building platform ceremony for a spike wastes weeks; building a spike that becomes a platform with no seams costs a rewrite. Record the answer with a provenance label like any other figure, and write down what would falsify it — the second customer, the second team, the first external consumer. That trigger is what reopens step 04.
- **Consumers and retained versions.** Name who can defer an upgrade, including owned mobile apps on old devices. Published interfaces need a version and deprecation contract; rolling deployments and retained messages need compatibility windows too. Repository topology is a separate access, ownership and tooling decision. A source commit does not upgrade all consumers at once.
- **Compliance and procurement reality**: what can be bought this quarter, what needs a review board, what data may leave the building. A design that assumes frictionless procurement has an implementation date it will not meet.
- **Accelerated compute, where the system uses any.** If there is a model anywhere in the graph, **how you source the compute is an envelope decision, not an implementation detail** — it fixes the cost shape, the elasticity ceiling, the data posture and the capability required, and all four constrain step 04 rather than step 08. The three sources differ in what you are actually buying, and the table below is the deliverable.

| Operating constraint | Stated as | Constrains |
|---|---|---|
| Team can run relational + one KV well; no stream expertise | capability | store family at [04]{.num}, runtime at [08]{.num} |
| Hybrid: regulated data on-prem, rest in one cloud region | posture | stores and placement, [04]{.num} and [08]{.num} |
| CDN and cold-archive contracts already held | commitment | derived stores and lifecycle tier at [04]{.num} |
| ≤ [$0.002]{.num}/request infra, egress the watched line | envelope | sizing pass at [04]{.num}, attribution at [09]{.num} |
| One oversold seat costs its refund and the handling; an hour of the partner class on rung 5 costs an SLA credit | loss line [assumed]{.prov} | enforcement rung at [03]{.num}, ladder pricing at [07]{.num}, beside spend at [09]{.num} |
| Three teams, fortnightly release train | topology | boundaries at [04]{.num}, ownership at [09]{.num} |
| Prototype expected to become a platform within a year | lifecycle [assumed]{.prov} | seams at [04]{.num}, stack and delivery at [08]{.num}–[09]{.num} |
| Two customer-held SDKs; upgrades cannot be forced | published interface | repo topology at [04]{.num}, version scheme and deprecation at [09]{.num} |
| Regulated records may not leave the building; a new vendor takes a quarter to approve | compliance & procurement | store candidates at [04]{.num}, enforcement at [05]{.num} |
| Inference via vendor API; no GPU fleet, no MLOps depth | compute source | model choice and data posture at [04]{.num}–[05]{.num}, cost at [02]{.num} |

### Sourcing accelerated compute — three options and one honest answer {style="color:var(--blue);font-size:12.5px;margin:14px 0 4px"}

|   | API keys | Rented pods | Owned hardware |
|---|---|---|---|
| **You buy** | a capability | capacity | an asset |
| **Cost shape** | per token · purely marginal · **zero floor** | per GPU-hour · steppy · floor = what you keep running | capex plus power and people · **high floor, low margin** |
| **Elasticity** | instant, and somebody else's problem | minutes to hours, subject to their inventory | none beyond what is racked |
| **Ceiling** | their rate limit — a quota you did not negotiate | their inventory, which evaporates in a market-wide crunch | your rack, and the lead time to add to it |
| **Data posture** | **your data leaves the boundary** — a step-05 question before it is a step-04 one | your data on someone else's metal, under their operator access | never leaves |
| **Capability needed** | an HTTP client and a budget alarm | container ops, scheduling, driver and image discipline | datacentre, power, cooling, the whole driver stack, real MLOps depth |
| **Breaks when** | they deprecate the model, reprice, or rate-limit you mid-incident | a capacity crunch prices you out or empties the region | demand moves an order of magnitude in *either* direction |

{cols="15% 28% 28%"}

- **The number that decides it is utilisation, not price per token.** Marginal pricing wins below some duty cycle and loses above it; owned hardware is the reverse, and rented pods sit between with a shorter commitment. Compute the crossover at step 02 with the real duty cycle — a GPU idling at 15 % is the most expensive way to serve anything — and record which side of it you are on. If nobody has computed the crossover, the sourcing decision was made by whoever had an account already.
- **The honest answer is usually hybrid, and the split is by workload shape rather than by preference.** **Bursty, experimental or low-volume** inference goes to an API, because its floor is zero and its elasticity is free. **Steady, high-volume** inference goes to reserved or owned capacity, because that is where marginal pricing loses. **Training and fine-tuning** are the archetypal rental: you need a hundred accelerators for three days, not three for a hundred days, and owning that shape is how idle capacity is bought. **Anything on regulated or sensitive data** stays in-house regardless of the arithmetic — that is step 05 overruling step 02, which is legitimate and should be written down as such.
- **A hybrid is two sources and therefore two failure stories.** If the design falls back from owned capacity to an API under load, that path is a channel with eight properties, a different cost per request, a different data posture, and possibly a different model — which means a different accuracy. Say so at step 07, or the fallback is an unpriced promise.
- **Vendor models are outbound dependencies**, already covered in the demand half: rate limit, latency contract, cost per call, trust zone, and the availability figure they contribute. Add two that are specific to them — **the deprecation window** for the model version you build against, and whether your prompts and outputs are retained or trained on. Both are contract terms, not engineering ones, and both have ended designs.

{style="margin-top:8px"}

::: prod
→ PRODUCES: the client constraint table — classes with quotas, tolerances, **the views they read with a freshness bound each**, **the degraded outcomes they accept**, and a shed order · a dependency list with the quotas and availability figures they grant you · and the operating envelope above, each row naming the later step it constrains · the scoped vocabulary table with unresolved meanings marked · and any **recorded options** — residues designed and primed but not built, each with a stated trigger.
:::

::: p {style="margin-top:8px"}
**Exit condition — no figure leaves this step unconsumed.** Beside each volume, name the later step that will divide, bound or decide with it. A figure with no named consumer is a question that should not have been asked: drop it, or find the decision it was standing in for. This is cheap here and expensive later — a number collected in the first five minutes and never used reads, on the page, exactly like a number that did work. Checked again at step [02]{.num}, reported at step [10]{.num}.
:::

- **Write constraints so they can be violated.** “Fast” cannot be tested; “p99 under 200 ms for the feed read, measured at the edge” can. An untestable requirement cannot justify a mechanism, which means it cannot survive the final walk. The same rule binds the supply side: “cost-conscious” is not a constraint, “under half a cent a request” is.
- **Interrogate the word “real-time.”** It means milliseconds to one person and not-tomorrow to another. The gap between those two readings is often the entire architecture.
- **Classes are the unit of everything downstream**: quotas, degradation order, isolation, and the SLOs you will eventually publish.
- **Supply constrains, it does not excuse.** The envelope explains why a design is shaped as it is; it never justifies a design that fails a client tolerance. When the two genuinely cannot both be met, that is a finding to escalate with numbers attached — not a compromise to absorb quietly.

::: warn
Designing for one imagined client. The batch integration nobody mentioned — the nightly partner job, the analytics exporter, the migration script — is usually the traffic that melts the system, precisely because it was never given a class.
:::

::: warn {style="margin-top:6px"}
Treating cost and capability as a deployment concern. Both are inputs, and late arrival is what makes them expensive: a store chosen at step 04 and priced at step 08 has already been chosen. The organisation is outside the boundary, so it belongs in the step that characterises the outside.
:::
