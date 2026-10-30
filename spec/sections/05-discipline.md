---
id: "disc"
tab: "05 · DISCIPLINE"
---

## Traceability — the one rule that makes the rest work

<p class="note"><b>Coverage is not verification.</b> Each row states the promise and its operating/failure conditions, mechanism, assumptions, evidence and status: <i>declared, argued, tested, or violated</i>. A metric name is a proposed observation, not a passing result. Tests establish only the cases they exercise; safety arguments still need their assumptions. A blank mechanism is a gap, and a filled cell can still contain an incorrect mechanism.</p>

::: lede
Two invariants and a third reading, all taken off one artifact. **Every mechanism cites a requirement** — an uncited mechanism is a finding to investigate, and it is removed only when no obligation is found. **Every requirement maps to at least one mechanism** — an unmapped requirement is a gap, and gaps get designed. The second rule has a quieter form worth naming: a *figure* that maps to no mechanism was never a requirement at all, only a number somebody asked for. **And citations chain.** A mechanism may cite a decision rather than a constraint — the resharding path cites the partitioning — which is not a loophole, because the decision it names is itself a mechanism and faces the same rule. The recursion terminates at a constraint from outside — a client's, or a row of the operating envelope — or the finding sits at the root. That is not an amendment to the two invariants — it is the first one being honest about what "cites" means when the citation points at another box. The map below is the artifact that survives the meeting — and in an interview, it is the closing statement.
:::

| Requirement (testable) | Mechanism | Evidence required |
|---|---|---|
| Consumer reads, [p99 ≤ 200 ms]{.num}, from three regions | Derived view replicated per region; edge caching for immutable assets | Per-region latency SLO with error budget |
| No acknowledged write is ever lost | Append to replicated log with quorum acknowledgement before responding; truth store rebuilt from it | Durability audit comparing acknowledgements to committed offsets |
| A user always sees their own edit immediately | Read-your-writes for that class only, via session pinning to the leader | Staleness probe on the read path for that class |
| Partner batch bursts [50×]{.num} nightly without affecting consumers | Async ingestion channel with bounded buffer; separate quota class; shed partner traffic first | Queue depth, rejection rate, and consumer p99 during the nightly window |
| Erasure completed within [30 days]{.num} of request | Key destruction for protected ciphertext; explicit deletion deadlines for plaintext copies, backups and exports; replay respects erasure markers | Deletion job SLO plus sampled verification against derived stores |
| Search results may lag, but by no more than [60 s]{.num} | Stream processor plus completeness watermark and serving-time age gate; authoritative fallback or agreed refusal above the bound | Lag measurement plus a stalled-processor test that exercises the age gate |

{cols="32% 38%"}

::: grid2 {style="margin-top:12px"}
::: card
#### Why the map, and not just the diagram

A diagram shows what exists. The map shows **why** it exists and **how you would know** if it stopped doing its job. Reviews conducted against the map argue about constraints and evidence; reviews conducted against a diagram argue about preferences and end in seniority.
:::

::: card
#### What it kills

Components that entered by habit. Requirements everyone assumed someone else had handled. Metrics that measure what is easy rather than what was promised. The map is where all three become visible in the same glance — which is exactly why it is uncomfortable to write and worth writing.
:::
:::

### The third reading — count the mechanism column {style="margin-top:20px"}

The first two readings establish coverage. The third counts shared dependencies and asks how each can fail. One failure mode can affect several promises, but it need not affect them equally or at the same time. A count finds questions; a failure scenario establishes consequences.

**The instrument is already on the page.** Read the middle column and count the repeats — no new artifact, no new notation. Run it on the map above — whose rows declare coverage but still owe evidence — and it still returns this:

| Mechanism | Promises | What fails together |
|---|---|---|
| **The replicated log** | [2+]{.num} | Loss of committed records threatens durability; stalled delivery can breach search freshness after its bound. Erasure-marker propagation may also depend on it. Inspect each failure mode and time to harm; do not infer simultaneous failure from a shared name. |

{cols="24% 12%"}

That coupling sat in this document's own worked map before this section existed, and neither invariant could see it. **That is the argument for the third reading**: it finds what the other two are structurally unable to find.

A count above one is *not* automatically a defect. Shared mechanisms are how a design stays small, and the log above is doing exactly what a log is for. What the count buys you is three obligations, and all three are cheap:

- **Carry it onto the ladder as *n* entries, not one.** A mechanism holding three promises has three degraded outcomes, and they may sit on different rungs — loss of committed log data threatens durability, while append or delivery unavailability can affect new acceptance or freshness without losing old data. Step 07 must price all three.
- **Check the signatories agree.** Where the promises on one mechanism are signed by different parts of the business, the strictest of them now sets the operating floor for all of them — and somebody is paying for a guarantee they never asked for, or is about to lose one they did.
- **Use the count to find scenarios, then rank those scenarios.** Severity, affected clients, time to harm and recovery matter more than the number of rows. Record uncertainty and reversibility; do not let a low count hide a severe failure.

::: warn
Splitting a mechanism to bring its count down. The count is a *measurement*, not a target. A second store derived from a coupling number rather than from a constraint outside the system is an uncited mechanism, and the first invariant reports it as uncited — which is the third reading being used to violate the first.
:::

### Who signs which artifact {style="margin-top:20px"}

If the model is the description both halves hold, then some of what the ten steps produce is a **contract** and the rest is engineering's working notes. A method that emits them as one undifferentiated pile invites the predictable failure in both directions: the business half arguing about topology, which it cannot evaluate, and the engineering half quietly moving a promise, which it should not. So: three categories — and the boundaries are not the step boundaries, which is why this has to be said out loud rather than inferred.

| Category | Artifacts | Why it sits there |
|---|---|---|
| **The business supplies** | The operating envelope — capability, hosting posture, contracts already held, cost envelope and the loss lines beside it, team topology, expected lifecycle, the consumers you cannot rebuild for, compliance and procurement reality — jurisdictions included — and the compute source where a model is in the graph | Engineering cannot invent these and should not guess them. Arriving late is what makes them expensive: a store chosen at step 04 and priced at step 08 has already been chosen |
| **Both sign** | Client classes and quotas · every tolerance, with the conditions it holds under · the accepted degraded outcomes · the zero-tolerance counts · **the shed order** · cost per request against the envelope · retention and erasure commitments · the SLOs that will be published | Each one is a commitment or a bill. Every item is expressible without naming a technology, which is precisely what makes it checkable by someone who does not build the thing |
| **Engineering owns** | Primitive typing and the annotated graph · store families · the eight channel properties · capacity arithmetic, node counts, ratios, headroom · derivation and merge semantics · runtime and placement | The business half can neither evaluate these nor be usefully asked to. Sending them across the table is how a review becomes theatre |

{cols="20% 44%"}

::: p {style="margin-top:8px"}
**The map itself is joint column by column** — which is the tidiest evidence that the split is real. *Requirement* is signed by both. *Mechanism* is engineering's alone. *Evidence required* is signed by both again, because it is the evidence the promise holds and a promise nobody can check was never a promise. That is a better argument for putting the map at the front of a design document than calling it the proof.
:::

::: warn
Filing the **shed order** under engineering. It reads like an implementation detail and it is a commercial decision in a technical costume — *which customer do we drop first.* Whoever owns the revenue owns that answer, and they should give it in daylight rather than have it inferred at three in the morning by whoever is holding the pager.
:::
