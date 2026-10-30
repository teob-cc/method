---
kind: "companion"
title: "Ticket booking, derived and re-derived"
stamp: "WORKED EXAMPLE · V1.8 · 2026-10 · COMPANION TO THE OUTSIDE-IN METHOD V4.13"
subtitle: "**A constructed case: an initial design, a failure diagnosis and an amended contract.** The historical first pass exposes a read–commit gap. The correction reserves atomically at selection. Later LLM stress reviews add findings, with the evidence limits stated below."
notes:
  - "**Update · V1.7, method V4.12.** The first pass below is a historical teaching snapshot with known gaps, not a validated implementation. The elapsed year is the example’s narrative, not a production experiment. The corrected contract and evidence obligations are stated after the re-run; a filled trace cell alone proves nothing."
html_title: "Ticket Booking, Derived and Re-Derived · Outside-In"
meta:
  - "og:type": "website"
  - "og:site_name": "TEOB · The Outside-In Method"
  - "og:title": "Ticket booking, derived and re-derived"
  - "og:description": "One system carried through all ten steps, run again when a failed promise makes the reservation protocol explicit — then stressed, twice, and amended once more."
  - "og:url": "https://teob.cc/method/worked-example.html"
  - "og:image": "https://teob.cc/method/og.png"
  - "og:image:width": "2400"
  - "og:image:height": "1260"
  - "og:image:alt": "The end of [human-coded] backend — the Outside-In Method: harmoniously melting AI, product and engineering together into a holistic, disciplined method. Below, the three-part contract: the business supplies the operating envelope, both sign the tolerances, engineering owns the graph."
  - "twitter:card": "summary_large_image"
  - "twitter:title": "Ticket booking, derived and re-derived"
  - "twitter:description": "One system carried through all ten steps, run again when a failed promise makes the reservation protocol explicit — then stressed, twice, and amended once more."
  - "twitter:image": "https://teob.cc/method/og.png"
---

::: toc
[← The Outside-In Method](method.html) · [The first pass](#example) · [The re-run](#rerun) · [The stress pass](#stressed)
:::

::: mod {#example tab="WORKED EXAMPLE · HISTORICAL FIRST PASS AND CORRECTION"}
## The initial design — historical claims, with known failures

::: lede
A ticket-booking service, compressed to one line per step. The answers themselves are not the point — the point is that each line cites the ones before it, and that the whole design fits on a page.
:::

| Step | What it produces for a ticket-booking service |
|---|---|
| **01 · Outside** | **Demand.** Buyers: public, [p99 200 ms]{.num} browse, read-your-writes on their own bookings; they read event listings and seat maps, [60 s]{.num} stale ok on each; quota [10 rps]{.num} a session (*assumed*) → 07; when degraded they accept stale listings with an as-of timestamp on browse — up to an hour a month, at the cost of a refresh — a queue position, pending and signalled, at every on-sale, at the cost of minutes, and at checkout absent-and-signalled only, never wrong — one attempt in a thousand, at the cost of trying again (how often and at what cost: all *assumed*, each an SLO at 09) · venue partners: nightly settlement batch, minutes of staleness, quota the contracted volume, shed first — only while an on-sale runs, at the cost of a batch that lands late (*assumed*) · credential-stuffers on the login surface (adversary class: volume, entry point, intent). **Geography and regime**: one national market inside the EU, so buyer contact details are personal data under GDPR — erasable on request, and kept in the EU (*assumed*) → 05 and 08. **One dependency**, the payment processor, and what it grants: [50]{.num} authorisations/s → 07 · [p99 2 s]{.num} → 03 · [€0.10]{.num} a call → 04 · [99.9 %]{.num} available → 09 (all four *assumed*). **Supply.** The team's existing stack → 08, and the rest of the envelope, each line *assumed* and naming where it is spent: the cloud provider the team already runs in → 08 · a committed-spend agreement with that provider → 04 · no new vendor without a procurement review the timeline has no room for, so only what that agreement covers → 04 · at most [€0.20]{.num} a booking, all in → 02 and 04 · one team, one rota → 04 · a one-off product, not a platform, until a second market says otherwise → 08 · one published interface, the partner API → 09 |
| **02 · Load** | 40M page views/day ≈ [500 rps]{.num} average, [2.5k]{.num} peak, a 5× factor (*assumed*) · 8k bookings/day ≈ [0.1]{.num} writes/s · working set: this month's events, a few GB · cost, carried from 01: [€0.20]{.num} × 8k bookings ≈ [€1 600]{.num} a day to serve all of it. One node already serves the write rate — said out loud, on the record. Partner volume is *contractual*; on-sale spikes are *assumed*. So are the daily volumes and the working set — elicited, not measured — and the hold expiry at 03 and the rebuild time at 06; the tolerances signed at 01 are *contractual*. **Each figure names its consumer:** page views → the read tier at 04 · bookings → the serialisation point at 03 and 04 · working set → store sizing at 04 · on-sale spikes → the on-sale rung promised at 01, priced at 07 · the cost ceiling → the bill at 04. Nothing leaves this step without a named consumer |
| **03 · Data** | The step-01 views — listings and seat maps, [60 s]{.num} each — are looser than the write path, so both resolve to projections; own bookings, promised read-your-writes, are read from the booking store itself. Acks: seat hold = reservation with a 10-minute expiry; payment = receipt, completion async — the processor's [p99 2 s]{.num} is not ours to wait on. Invariant: no double-booking of a seat–show pair, enforced authoritatively in the booking store. Broken, it is rung 6 — wrong — so the enforcement ladder allows E1 or E2 only: **E1, serialised per seat–show pair**. Escrow splits a count among writers, which would fit a general-admission allocation, not a numbered seat. The scope is one key, so a conditional write on that key is all the isolation it needs |
| **04 · Storage & transport** | Relational primary, the provider's managed one under the commitment held at 01 (the write rate is trivial; transactions are the point) → outbox → log → search projection for listings, seat-availability projection for maps. One team, so no boundary is cut for ownership. Sizing: three nodes for failover, not throughput — demand fits one with room to spare. Ratio, supplied over demanded: a relational node's [~5k]{.num} simple transactions a second (the specification's anchor, *assumed*) over [0.1]{.num} writes/s is [50 000×]{.num} — the write rate cannot discriminate this choice and was never its citation; the invariant is. Written beside the choice: the isolation the store runs at by default — read committed, on PostgreSQL — which holds one seat's conditional write and would not hold a check across several seats; and what the choice introduces, a ceiling per key of about one over the commit latency, which no single seat comes near (*assumed*). In nodes it is 3 over 1, and the factor is failover. Cost per booking: about [€7 200]{.num} a month of infrastructure (*assumed*) ÷ 240k bookings a month = [€0.03]{.num}, plus the processor's [€0.10]{.num} = [€0.13]{.num} against the [€0.20]{.num} ceiling. Eight properties per edge, producer and each consumer written separately; the checkout write is **commit-bearing**, so no fallback is legal on it |
| **05 · Trust** | Buyer token verified at the edge, partner mTLS; the personal data named at 01 is buyer contact details, erased on request by destroying a per-subject key and checked on a sample of erased subjects; audit log of holds and releases, separately retained |
| **06 · Derivation** | Two stream processors off the log; both idempotent under replay; full rebuild [≈ 40 min]{.num}, runs alongside the live views |
| **07 · Failure** | The rungs promised at 01 come forward unchanged, each reachable on purpose: stale listings ← the projection keeps serving when its processor stops, stamped as-of · the queue position ← the token bucket at the edge holding each session to its [10 rps]{.num}, and checkout admitted no faster than the processor's [50/s]{.num} · absent-and-signalled ← a typed refusal on the commit-bearing edge · partners shed ← a shed rule on the batch surface. Last exercised: never yet — this is a first pass; all four get their first rehearsal beside the step-10 replay, and a rehearsal every quarter after that (*assumed*). The on-sale spike is the retry-storm scenario, and those two limits are what meet it. Scale-in after it is the **departure** case: drain longer than the routing bound, and an ambiguous checkout resolves on the idempotency key rather than by trying again |
| **08 · Runtime & placement** | The stack and the provider recorded at 01 — boring on purpose, which is what a one-off product is owed; a single region, inside the EU as the regime at 01 requires, with warm standby, because nothing promised to a client requires cross-region failover and no figure pays for it |
| **09 · Operations** | **Outcome KPI**: seat holds taken → checkouts completed, with the abandonment rate between them — investigated on change, sliced by deploy and event. **Zero-tolerance count**: *seats shown available and refused at checkout*, target zero — every one is a user who was told something false at the moment they tried to pay. Then SLO per client class, each built from what the class accepted at 01 — the buyers' with a read-after-write probe on their own bookings, checkout's no higher than the processor's [99.9 %]{.num}; projection lag alarmed at half the 60 s bound; pages name the client class being hurt; the booking store has the first on-call; the partner API, the one published interface, carries a version partners can decline and a deprecation window |
| **10 · Trace** | Every box names a constraint — the map under this table walks each promise to its mechanism and its metric, and counts. The risk register is ranked by that count and holds every figure labelled *assumed* above; the riskiest edge is seat-map lag during on-sale spikes (an *assumed* figure) → first experiment: replay a historical on-sale at [10×]{.num} through the write path. **No figure left unconsumed** — or so this pass recorded: each of the five from step 02 names its consumer above, and a figure that nothing here consumed would be a question that should not have been asked. One of the five turns out to be exactly that — see *the stress pass*. **Re-run trigger, written in advance**: if the refused-at-checkout count stays non-zero once the lag is inside its bound, the bound was the wrong promise. That trigger fires below — see *the re-run* |

{cols="16%"}

::: p {style="margin-top:12px"}
**The same design as a traceability map** — each promise above walked to the mechanism that keeps it and the metric that would show it broken. Nothing in it is new; it is the table read sideways.
:::

| Requirement (testable) | Mechanism | Verified by |
|---|---|---|
| Buyers browse at [p99 200 ms]{.num} | The two projections — search for listings, seat availability for maps | The buyers' SLO |
| Listings and seat maps are never more than [60 s]{.num} stale | The log and the two stream processors that feed both projections from it | Projection lag, alarmed at half the bound |
| A buyer sees their own booking at once | The booking store — own bookings are read where they were written | The read-after-write probe in the buyers' SLO |
| No seat–show pair is ever booked twice | The booking store, the invariant's one enforcer | The audit log of holds and releases |
| A hold is a reservation for 10 minutes; a payment is a receipt, completed behind the buyer | The booking store and its outbox; completion runs off the log | Holds taken → checkouts completed, and the abandonment between them |
| Checkout is never wrong — done, or absent and signalled | The commit-bearing write to the booking store, with a typed refusal and the idempotency key | The audit log again, and the 10× replay through the write path |
| A seat shown as available can be bought — zero tolerance | The seat-availability projection, inside its 60 s bound | The zero-tolerance count: shown available, refused at checkout |
| At an on-sale a buyer gets a queue position, not an error | The token bucket at the edge, and checkout admitted at the processor's 50/s | The 10× replay, and the quarterly rehearsal |
| The partners' nightly batch is shed first and never costs a buyer | The shed rule on the batch surface | Pages that name the client class being hurt |
| A buyer's contact details are erased on request | The per-subject key, destroyed | The check on a sample of erased subjects |

{cols="32% 38%" style="margin-top:6px"}

::: p {style="margin-top:8px"}
**Count the middle column.** The booking store is named four times — own bookings, the invariant, the hold and the checkout that is never wrong — the seat-availability projection three, the log and the search projection twice each, everything else once. Four promises on one store fail together, so it goes onto the ladder as four entries rather than one and heads the risk register — which is why the first experiment runs through the write path, and it is what the three nodes at 04 are protecting. The projection's three include the zero-tolerance one, resting on a 60 s bound: that is where the re-run trigger is pointed.
:::

::: say
“The whole design fits on one page because every line earned its place. And the interesting part is the scale-out it doesn't have: the arithmetic said one node carries the load, and we believed it — the three at step 04 are there for failover.”
:::

### The re-run — a business count refuses to go to zero {#rerun style="color:var(--ink2);font-size:12px;margin:18px 0 2px"}

In the case narrative, twelve months on, the design above is running and the arithmetic still holds. One number does not: **seats shown as available and refused at checkout** — the zero-tolerance count from step 09 — sits stubbornly non-zero through every on-sale, while the seat-map projection stays comfortably inside its promised 60-second bound the whole time. Nothing is broken. Every component is doing exactly what it was told — which is somehow worse. **That is the signature of a design that is wrong rather than a system that is failing**, and it is precisely the case the re-run trigger exists for.

The diagnosis sits at step 03: the seat map is a view clients *commit* against, and it was modelled as an ordinary projection. The error was never in the lag. It lives in **the interval between reading and committing** — and no staleness bound closes an interval, it only makes it shorter.

::: figure
![Two panels. Before: the seat map is a projection with a sixty-second bound, the user picks a seat, then a gap of seconds passes before checkout, and the booking is refused. After: the seat map is pushed sub-second from strict truth, the click is itself the hold attempt, the aggregate decides immediately, and the user is either holding the seat or told at once that it has just gone.](./figures/read-commit-interval.svg)

THE GUARANTEE BEGINS WHEN THE ATOMIC HOLD IS ACKNOWLEDGED
:::

<table>
<tr><th style="width:12%">Step</th><th style="width:46%">What the re-run changed</th><th>What it cost, said out loud</th></tr>
<tr><td><b>01 · Outside</b></td><td>A tolerance that did not exist before: buyers at an on-sale must see seat state <b>as it changes</b>, not within a minute — so the browse surface acquires a push direction for the duration of a sale. And a new adversary is named: <b>squatters</b>, holding seats they will not buy. Two accepted outcomes are promised with it: a map <b>marked as possibly stale</b> when push degrades, and a waiting room with a position and an estimate when the aggregate saturates</td><td>A poll became a push surface, with its own signing, redelivery and ordering story — and a marked-stale state the interface has to be designed for</td></tr>
<tr><td><b>02 · Load</b></td><td>The on-sale becomes the design point, not the daily average. The figure that now sizes everything is the <b>fan-out</b>: seat-state updates per second × concurrent viewers of that map. A few hundred updates against twenty thousand open maps — both figures <i>assumed</i> until the next on-sale is measured — is millions of messages a second before any coalescing</td><td>The old <span class="num">0.1</span> writes/s was never wrong — it was answering a question nobody was asking during the only ninety seconds that matter</td></tr>
<tr><td><b>03 · Data</b></td><td>The promise changes at selection: <b>the click attempts an atomic hold</b>, returning a hold identifier, pinned price and authoritative expiry. Browsing remains a projection and can show a seat that has just gone. Checkout may promise availability only after a hold was acknowledged and while it remains valid</td><td>Linearizable reads alone do not prevent two buyers seeing the same free seat. The correction is the reservation protocol and point of promise, not promoting a whole map to truth</td></tr>
<tr><td><b>04 · Storage</b></td><td>Choose the smallest atomic scope the booking invariant requires: one seat–show pair for independent seats. An all-or-nothing group hold requires a transaction or demonstrated protocol across that group. A whole-map aggregate is an option only if its wider invariant justifies it. Measure the hottest scope under the actual transaction protocol, including batching and contention</td><td>A stop-and-wait estimate of 1/commit latency is not a universal throughput ceiling. Partitioning must preserve the invariant; twenty sections do not by themselves prove capacity or correctness</td></tr>
<tr><td><b>05 · Trust</b></td><td>The squatter meets mechanisms: a cap on concurrent holds per buyer, a cooldown after a release, a rate limit on hold attempts, and a waiting room when the aggregate saturates</td><td>Friction for honest buyers at precisely the moment they are least patient — which is a product decision wearing an engineering hat, and belongs to whoever owns the conversion number</td></tr>
<tr><td><b>07 · Failure</b></td><td>A stale browse view may still be served within its agreed bound; every selection is rechecked by the atomic hold protocol. Saturation refuses new holds or admits them to a real waiting room with identity, position semantics and bounded wait. A lost response is pending/unknown with an operation handle and reconciliation. Push or polling does not change an acknowledged hold.</td></tr>
<tr><td><b>09 · Operations</b></td><td>The zero-tolerance count is now the acceptance test for the whole change. New alongside it: <b>hold-to-purchase ratio</b> — the squatting signal — and time from a seat changing to the last client seeing it</td><td>—</td></tr>
</table>

::: grid2 {style="margin-top:10px"}
::: card
#### What did not change

Browse and search stay projections with a minute of staleness. Payment stays a receipt plus asynchronous completion. The org's stack, the single region with its warm standby, the booking invariant and its one enforcer — all of them were right the first time, and the re-run leaves them alone. **A re-derivation is not a rewrite** — it is a diff, and most of the map comes through untouched.
:::

::: card
#### What drove it

Not a new feature, not a scaling milestone, not a technology somebody wanted to try. **A count of users who were told something false.** The KPI is the trigger, the model change is the response, and the implementation change falls out of the model. Try running the same sequence backwards — start from “we need websockets and an in-memory aggregate” — and not one line of the table above can be justified.
:::
:::

### The stress pass — fired at this design, twice {#stressed style="color:var(--ink2);font-size:12px;margin:18px 0 2px"}

The stress pass was demonstrated on this example in several analyst reviews. The first retained an advance re-run trigger that tipped the seat-map diagnosis. A contaminated replication was voided; a fresh headless LLM session outside the project reproduced the reversal gap and hold-abuse adversary, but **did not reproduce the registered seat-map read/commit diagnosis**. These are limited demonstrations of finding defects, not evidence of a year of production discovery saved or superiority over ordinary lifecycle review. The [protocol and result summary](evidence/stress-demonstration.html) records these limits.

**There is no reversal path.** Refund, cancellation, revocation, transfer — every step above models the purchase and its contention completely, and the *undoing* of a purchase not at all. An event cancelled thirty minutes before doors has nowhere to go in this design. And no amount of reading the traceability map could have said so, because no reversal requirement was ever stated: **there was no row to be empty.** The pass manufactures the missing row, and the map then adjudicates it.

| Amendment | What changes | Whose call |
|---|---|---|
| **Reversal flows** | Cancel, refund and revoke become commands through the same aggregate surface the re-run built, each with a stated clock and a seat policy — a chargeback releases or retains the seat *by decision, not by accident* | the clock and the policy: business · the commands: engineering |
| **The expiry, twice** | Both runs converged on the 10-minute hold expiry as the most under-specified noun, finding different undeclared dependencies. It now expires **on the aggregate's own clock** (a skewed timer was quietly a second writer), and it **consults payment-path health** — holds must not die unpaid at the exact moment buyers cannot pay | engineering |
| **Price is captured into the hold** | The re-run closed the read–commit interval for seat state and left it open for price. A hold now pins its price for its lifetime | both |
| **Two scope decisions, made in daylight** | Group orders: atomically up to a stated N, or explicitly declined via partners. Chargeback seat policy: retain until dispute closes. Both are lifecycle questions the stress pass helped surface; an ordinary requirements review can ask them too | business |
| **Five recorded options** | Seat-map versioning · partner allocation carve-outs · ticket transfer · a second inventory source · multi-currency — each designed, primed by the single command surface, unbuilt, with its trigger written beside it. **None may be built until its trigger fires** | the triggers: business |

{cols="16% 52%"}

::: p {style="margin-top:8px"}
**Re-check the changed obligations and their dependencies.** Reversals can change the state machine, audit retention, payment coordination and authoritative data; they are not automatically outside the model. Record the affected claims and preserve only those whose assumptions remain true. The working-set figure also needs a demonstrated sizing consumer rather than a citation that never uses it.
:::

::: say
“The stress pass found missing reversal flows. That is useful evidence about this example, not proof that interviews cannot discover cancellations. The amended trace must still show how each new promise is kept.”
:::

### The corrected contract · V4.13 {#corrected-contract}

The historical trace above contains proposed mechanisms that do not satisfy their rows. This is the current replacement contract; its tests are obligations, not reported passing results.

| Promise and conditions | Mechanism and assumptions | Evidence required · status |
|---|---|---|
| No seat–show pair is sold twice | Atomic conditional hold and hold-to-sale transition at the authoritative store; expiry and payment policy use the same authority | Concurrent claims, expiry/payment races and crash recovery · argued, not runtime-tested here |
| An acknowledged valid hold protects checkout availability | Hold identifier, pinned price, authoritative expiry; failed selection is distinguished from a lost hold. Group orders have an explicit atomic scope | Two buyers reading the same free seat; one wins the hold, the other is refused before ownership is promised · argued |
| A timed-out payment is never presented as known refusal | Stable operation identity and atomic effect/dedup handling at each owned boundary; processor idempotency/status contract at the external boundary; unknown outcomes remain visible until reconciled | Commit followed by lost reply and long partition · external processor contract still required |
| Normal browse data is at most 60 s stale | Completeness watermark and serving-time age check. Beyond the bound, the agreed degraded-age limit applies or the request is refused | Stop each processor and cross the bound · maximum degraded age remains a product decision |
| An admitted waiting-room session receives a meaningful position | Bounded queue with session identity, admission sequence, expiry/cancellation, reconnect behaviour and capacity-based admission. A token bucket supplies rate limiting only | Reconnect, duplicate admission, saturation and cancellation · queue contract to exercise |
| Personal data is erased within the agreed deadline | Subject-key destruction for protected ciphertext plus deletion/expiry of plaintext projections, exports and key backups; replay respects erasure markers | Inventory and restore/rebuild exercise after erasure · deadline and copy inventory required |
| Reversals have explicit money and seat outcomes | Idempotent cancel/refund commands, durable outbox, authoritative state transitions and a stated external settlement/reconciliation contract | Refund retries, partial settlement and disputed payments · policies and processor evidence required |

### Names in the corrected contract {#vocabulary}

**Update · V1.8, method V4.13.** This table proposes scoped terms for the corrected example. Its source is the promise and mechanism recorded above, not a new customer interview. The terms still need a task-based check with representative buyers and API consumers. The historical first pass retains its original wording so that the failed promise remains visible.

| Preferred term | Scope and meaning | Aliases and nearby distinctions |
|---|---|---|
| **Seat availability view** | Derived seat-availability observations for a show, with a freshness marker and serving bound | *Seat map* is the display of this view in the example. A displayed free seat is not an acquired hold |
| **Seat hold request** | A request to reserve a seat–show pair under the stated admission, price and expiry policy | It may be refused. Sending the request does not establish a hold |
| **Seat hold** | The established reservation with an identifier, pinned price and authoritative expiry, following the atomic hold decision | *Reservation* is an alias only in this seat-hold scope. A hold is not a completed booking or settled payment |
| **Confirmed booking** | The committed hold-to-sale transition under the corrected booking policy | Its payment prerequisite belongs to that policy; the booking label alone cannot establish external settlement |
| **Payment outcome unknown** | The caller cannot yet establish the result for the identified payment operation | No refusal or known-pending alias. Resolve through the processor's status or reconciliation contract |
| **Booking cancellation / payment refund** | Separate operations changing the booking obligation and returning money under the reversal policy | Related terms, not aliases. Neither implies the other's completion or an unstated seat-release policy |

{cols="22%"}

Illustrative API names follow these meanings: `RequestSeatHold` asks for a transition and `SeatHeld` reports a hold only after the specified transition succeeds. In the graph, *seat availability view* has a derived-store role; the hold decision has a processor role and its authoritative state a store role. One runnable component may implement both. Product names and deployment boundaries are separate decisions.

For a naming check, ask a consumer what they may do after each result, including a lost payment reply. Record disagreements and the revision; no such consumer test is claimed here. A terminology change must retain the old meaning for supported clients and historical events, or provide an explicit migration. A clearer label alone cannot repair the original read–commit gap.

::: meta
Naming source: [ANSI/NISO Z39.19-2005 (R2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), §§6.2, 8.2–8.4 and 11.2–11.3, adapted to these contracts through [the specification's naming discipline](method.html#naming). Retrieval equivalence is not imported as behavioural equivalence.
:::

A whole-map aggregate or push channel may still earn its place from a group invariant or a latency requirement. Neither follows automatically from “never double-book”, and neither turns an observation into a reservation.
:::

::: meta {style="margin-top:22px;font-family:var(--mono);font-size:11px;color:var(--ink2);line-height:1.9"}
Extracted from The Outside-In Method at V3.7 — from what was then §08 and is now §09, so the method paper stays readable in one sitting. Method: [The Outside-In Method](method.html). Published by Lambda House under the [MIT licence](LICENSE).
:::
