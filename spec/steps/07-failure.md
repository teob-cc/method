---
number: "07"
id: "s07"
title: "Failure"
phase: "III"
---

::: def
Deliver the degraded outcomes that were promised at step 01. The ladder is not written here — it was declared by the client, in client-visible terms, before anything internal existed. This step proves each rung is actually reachable and derives the mechanics per edge that reach it. Raise this before anyone asks; a design without it is a demo.
:::

::: asks
ASKS · For each rung promised at step 01 — what has to be true internally to reach it · is it reachable on purpose, and has it ever been exercised · and what does each edge do when the far side is gone?
:::

### 1 · The promises, restated — declared at step 01, priced here {style="color:var(--blue);font-size:12.5px;margin:14px 0 4px"}

A timeout value is not an internal preference; it is a slice of a budget somebody outside the system granted you. That is why the failure model does not begin by asking anyone anything: **the tolerances and the accepted degraded outcomes are already on the step-01 table.** Bring them forward unchanged and price them. Six client-visible outcomes exist, in rising severity, and the sixth is never allowed — the figure below is the vocabulary those promises were written in.

::: figure
![A severity spectrum of six degraded responses — correct but slower, correct but less, stale but complete, pending but signalled, absent but signalled, and wrong which is forbidden — followed by three client classes showing which responses each finds acceptable.](../figures/s07-degradation-ladder.svg)
:::

- **Two dimensions, both from the client.** How *often* may it fail — that is the frequency recorded beside the accepted outcomes at the client step, and it becomes the published objective. How *badly* may it fail — that is the ladder below. A design that answers only the first has an SLO and no plan.
- **Detectability is part of tolerance.** Silent degradation is the dangerous kind: a partial export looks exactly like a complete one, and the damage lands three systems downstream a week later. Every degraded response carries a marker — a partial flag, an as-of timestamp, a degraded header — so the caller can make its own decision.
- **Pending is often the best rung.** Accept the work, signal that the result follows — by callback, poll, or notification — and return a handle and a deadline. This is the rung the receipt acknowledgement from the data step already paid for.
- **An unknown outcome is knowledge to represent, not a failure to hide.** A write can commit while its reply is lost. Idempotency makes retry safe but cannot establish the result while the receiver is unreachable. Record operation state separately from the caller’s knowledge; return an operation identifier and an honest *outcome unknown* status, with a status/reconciliation path. *Accepted, pending* requires a known durable acceptance point; *refused* requires knowledge that the operation was not accepted. Bound retries and separate the request deadline from the lifetime of durable work.
- **Design for hostile retry behaviour.** Your callers' failure handling is not under your control. Assume some retry immediately, without backoff, forever. Jittered retry-after, per-class token buckets, and shedding at the edge exist because a client stampede after recovery is what turns an incident into an outage.
- **Classes disagree, so rank them once.** The shed order recorded at the client step is that ranking. Deciding it in advance is a design act; deciding it at three in the morning is an incident.

{style="margin-top:8px"}

### 2 · The ladder — auditing what was promised {style="color:var(--blue);font-size:12.5px;margin:14px 0 4px"}

The rungs came from step 01, and they are stated in terms of the **client-visible outcome** rather than the internal action. “Recommendations fall back to popularity” is a rung; “circuit breaker opens” is a mechanism that implements one. The last rung must still be a correct, if diminished, answer — for a commerce page, that means it renders and can take money with no personalisation at all.

**Model paths have a ladder of their own, and it is unusually well-populated** — which is fortunate, because accelerators cannot scale out fast enough to absorb a spike. Downward: the full model · a smaller or quantised model, cheaper and measurably less accurate · a cached or precomputed answer · the non-model path that existed before, which for ranking is popularity and for search is keyword · then pending-with-a-handle, then absent-and-signalled. Two rules the ladder inherits: every rung that changes the model **changes the accuracy**, so it must be checked against the accuracy tolerance from step 01 rather than assumed acceptable, and a degraded answer from a smaller model is still **marked**, because a confidently wrong answer at the same latency is indistinguishable from a good one. Where a hybrid falls back from owned capacity to a vendor API, that rung also crosses a trust boundary and a price list — say both.

- **You may only drop what a class tolerates.** The rungs are earned by the answers above; nothing is optional because it is convenient to make it optional.
- **Every rung is reachable on purpose** — a flag, a breaker, a shed rule — and testable. A ladder that has never been exercised is fiction; rehearse it deliberately rather than discovering it during an incident.
- **Name the rung's cost.** Dropping personalisation costs conversion; serving stale inventory costs oversells. Rungs are business decisions wearing engineering clothes, and the ordering belongs to the people who own the metric.
- **Price every rung both ways** — what reaching it costs to build, and what each occurrence costs the business, read off the loss lines at step 01. The enforcement ladder at step 03 is priced the same way. Then set a mechanism's running cost against the expected loss it prevents: where the loss prevented is a small fraction of the mechanism's cost, the mechanism is correct and unjustified — the same verdict as a ratio in the hundreds.

### 3 · Mechanics — per edge, derived from the two above {style="color:var(--blue);font-size:12.5px;margin:14px 0 4px"}

| Per edge, specify | Because |
|---|---|
| **Timeout**, sliced from the client's budget | A hop without a timeout inherits the patience of the slowest dependency and passes it to the user. The number comes from the budget, not from taste |
| **Retry budget** — bounded extra load, exponential backoff, jitter | Unbounded retries convert a slow dependency into an outage; jitter prevents synchronised herds |
| **Idempotency** on anything retried | Retry without idempotency is duplication with extra steps |
| **Circuit breaker + fallback** | Fail fast into a defined rung beats queueing until collapse — but only where a fallback is legal. On a **commit-bearing** edge there is no lesser answer to drop into, and the reachable rungs are pending-with-a-handle or a typed refusal |
| **Deadline propagation** | Work whose answer nobody is waiting for should stop being done |
| **Departure**, both kinds | The drain interval was derived at step [04]{.num} and is not renegotiated here. What this step owes is the other kind: who is left holding an ambiguous write, and which rung each client class is served while the far side's membership converges |

- **Blast radius.** Bulkheads per dependency so one slow downstream cannot exhaust a shared pool; isolation per client class so the batch partner cannot starve interactive users; cells so a failure takes a fraction of the users rather than all of them. The pool in that first clause is the **backpressure** property of a synchronous channel, declared at step [04]{.num} — this row and that property are one decision seen from two steps.
- **Recovery objectives, read off the earlier choices.** Asynchronous replication means a non-zero recovery point — data loss measured in seconds. If you cannot read the recovery point and recovery time directly off the storage decisions, those decisions are incomplete.
- **Failover is the replication channel's departure, paid.** Promoting a replica loses exactly the writes the old primary acknowledged and the replica never received — the window the channel's guarantee allowed, which is why the recovery point is read off it. Two primaries at once is a split brain, and the lease's four declarations at step 04 are what prevent one. Say who decides that a member is gone — a member declared dead too fast is a split brain, too slowly an outage — and which rung each client class is served for the length of the failover.
- **Tail latency arithmetic.** If calls are independent and each of [N]{.num} parallel calls exceeds its p-th percentile with probability 1 − p, a request that waits for all of them exceeds it with probability 1 − p<sup>N</sup>: at p99, [N = 10]{.num} gives about [10%]{.num} and [N = 100]{.num} about [63%]{.num}. Holding the request at p99 across a hundred leaves needs each leaf at about p99.99, since 0.99<sup>1/100</sup> ≈ [0.9999]{.num}. Three answers, picked deliberately: **fewer leaves** · **hedged requests** — a second request sent only after the first has been outstanding past about its p95 costs about [5%]{.num} more load, not double; immediate duplication is what doubles it · or **partial results**, which is rung 2 of the ladder and must have been promised at step 01, which is why the ladder comes first.
- **Check dependence and extra work.** Shared congestion makes leaf latencies correlated, so measure joint request tails rather than applying the independent formula as a guarantee. Hedging requires safe duplicate execution, a separate load budget and cancellation/cleanup semantics; a nominal p95 trigger does not cap extra load during an incident.
- **Overload behaviour.** Shed at the edge in class order, return a clear signal, protect the core. Predictable degradation under overload is worth more than being slightly faster when healthy.
- **Abuse and compromise are failure modes.** Credential theft, a leaked internal token, a malicious tenant, a scraper saturating a read path, key loss. For each: blast radius, what detects it, and the containment action — revoke, rotate, isolate the tenant, shed the class. Key loss deserves particular attention wherever erasure depends on keys, because it is indistinguishable from successful erasure.
- **Poison data and stuck work.** Dead-letter destinations, replay tooling, and a person who is expected to look — otherwise failures accumulate quietly until an audit finds them.

{style="margin-top:8px"}

::: p {style="margin-top:10px"}
**The mechanics exist to implement the ladder.** If a timeout, breaker, or fallback cannot be traced to a rung a client tolerates or an invariant that must hold, it is decoration — and it will be tuned by superstition for the rest of the system's life.
:::

::: prod
→ PRODUCES: a **reachability proof per promised rung** — the flag, breaker or shed rule that reaches it, and when it was last exercised · a failure spec per edge · stated recovery objectives · and, for every store with replicas, the failover it runs and the rung each class is served during it. The ladder itself is carried forward from step 01, not authored here.
:::

### 4 · The stress pass — perturb the outside, watch what survives {style="color:var(--blue);font-size:12.5px;margin:16px 0 4px"}

Everything above prices the failures somebody predicted. This pass hunts the ones nobody did — it is the method's own robustness move, *change the inputs and ask why the design didn't change*, made adversarial and given an instrument. Adopted from residuality theory (O'Reilly, 2024), decomposed rather than swallowed: his **stressor** is any fact about the context currently unknown to you, his **attractor** is the state a system re-enters under stress — and a ladder rung is a *designed* attractor, which is why the pass lands at this step.

- **Generate stressors by stressing your own nouns** — every client class, data class, payload schema and component name on the board, then the business context (regulation, competitors, contracts, acquisition). Three rules, his: **no probability** · **everything goes in the list, however ridiculous** · **no generic stressor lists** — generic stressors produce generic patterns, and the industry has already tried that.
- **Then the incidence matrix**: stressors × components, 1/0 cells, read mechanically. High row totals are dangerous attractors. High column totals are components absorbing capability classes they were never given. **Two 1s in one row is a hyperliminal coupling** — components that fail together and are invisible until the stressor hits, which is the finding the coupling count at §05 structurally cannot see: the count reads the map at rest, the matrix reads it in motion. A column whose row-set is a subset of another's can live inside it. A zero-total column is under-stressed, not safe.
- **A stressor run has exactly three legal outputs.** A newly **stated requirement** — signed and provenance-labelled like any elicited one, because the discovered client is still a client · a **finding** — a shared fate, an unreachable rung, a capability class with no mechanism · or a **recorded option** — designed, primed, unbuilt, trigger stated. A stressor is a probe, never a requirement: it does not enter the map's first column, and it never carries a number into the arithmetic.
- **Convergence is looping** — new stressors landing on residues already held — and the check is empirical: hold out a set never used in design, count what survives before and after, and report the residual index **with its denominator**. At workshop scale it is a direction signal, not a measurement.

::: warn
Buying a mechanism from a stressor. The matrix total is a measurement, not a target — the same rule as the coupling count, from the other side. A split or a store justified only by a stressor row, with no promise traced, is furniture with a scary story; and where cost filters anything, it filters *implementation*, never exploration. You never build for Godzilla — you record the cheap decoupling point and the trigger, and the option costs a paragraph.
:::

The pass has a second firing at step [10]{.num}, as the audit's reverse direction — and production is where stressors actually fire, which is why a zero-tolerance count that will not stay at zero is diagnosed at §06.

::: fb
FEEDBACK — this is the step that most often reopens earlier ones. A consistency promise that cannot be honoured during a partition, or a channel guarantee that evaporates on broker loss, must be corrected at the data and storage steps, not papered over here.
:::
