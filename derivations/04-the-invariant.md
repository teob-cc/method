---
kind: "derivation"
title: "The invariant, and the organisation behind it"
stamp: "DERIVATION 04 · V1.5 · 2026-10-30 · THE OUTSIDE-IN METHOD V4.14"
short: "The invariant"
number: "04"
subtitle: "**A booking system.** One rule that may never break decides the whole shape — and the ten thousand people employed to clean up when it breaks anyway are part of the design, not an operational afterthought."
html_title: "The invariant, and the organisation behind it · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="04 · THE INVARIANT"}
::: kick
The system · short-stay room reservations
:::

## The invariant, and the organisation behind it

::: lede
Most requirements are tolerances — a percentile, a staleness bound, a durability class. A few are not. A few are counts that must be zero, and zeros behave differently: they cannot be traded against latency, they cannot be met by a percentile, and they need an enforcement protocol that preserves them across every concurrent writer and permitted failure. This system has two of them. It also has the most complete account of the *supply* half in either published guide — and the two facts turn out to be the same fact.
:::

::: rule
Give every invariant an enforcement protocol over its whole contended scope: an atomic check-and-change, a correctly coordinated transaction, or conserved escrow rights where the invariant permits them. Separately name the violation audit. A zero count is evidence about observed executions, not proof of the protocol.
:::

### The invariant half

::: sys
#### Two counts that must be zero

- **A room is never double-booked.** Stated plainly in the requirements.
- **A guest holds at most one room on any given date.** Stated just as plainly one line later — and considerably easier to miss, because it reads like a product rule rather than a constraint on the store.

The first is contended per room-night, the second per guest-night. Those are different serialisation units, and a design that serialises one does not serialise the other. The published treatment addresses the first thoroughly — and never returns to the second.

#### The shape the invariant forces

Listings are localised — a search runs against one city at a time — so the contended set partitions naturally by city. That gives one leader per city, a transaction that reads availability and writes it in the same breath, and a short-lived hold placed while a guest is deciding. The treatment states the consequences honestly, and they are the right ones: a search result may show a room that is already gone — the booking attempt then fails — and holds mean losing some bookings a more permissive system would have taken. Losing a booking is the price of never taking two. Hotels make the opposite trade for a reason that does not apply here: a hotel can upgrade an overbooked guest, a room host cannot.

**Booking is a reservation acknowledgement**, not a completion and not a receipt. The distinction is load-bearing for the guest, who needs to know now. It does not by itself decide enforcement: a booking accepted by receipt and serialised before anything is promised would still never double-book. What the invariant forbids is absorbing the write and reconciling it after the fact — rungs E3 and E4 of the [enforcement ladder](../method.html#s03).

::: kpi
- **~1.2k /s** · booking attempts at the headline figure
- **<3k QPS** · search peak per city — the treatment's own arithmetic, and it fits one host
- **7.2 GB** · availability rows per city at six months — a single machine
- **4–17×** · supplied over demanded if one leader took every city's attempts — a relational node at 5–20k simple transactions a second against the 1.2k/s average. Single digits to tens, and that is the floor
:::

**The per-city partition is not bought by that ratio.** A room-night constraint requires atomic enforcement at that scope; it does not require a leader dedicated to each city. Partitioning needs a measured capacity, placement or operational reason. A guest-night invariant spans cities and must be coordinated across that scope too.

::: warn {data-l="NEITHER PROMISE HAS A COUNTER"}
The monitoring section is thorough about funnels, anomaly rates and the completion of user journeys. It defines a metric for rejected booking attempts — which measures *lock contention*, a symptom of the mechanism working correctly. What it counts nowhere is double-bookings that actually occurred, or guests holding two rooms on one night. Both are zero-tolerance promises, both need a continuous audit against the store rather than an alert threshold — and neither has one.
:::
:::

### The organisation half

::: sys
Here the treatment is unusually good — and a reading organised around topology misses the point entirely.

#### The people are a sizing input

The design states a staff count — of the order of ten thousand operations people — and a per-person review rate, and derives a table growth figure from the two. That is the supply half showing up as arithmetic, which almost never happens in this genre. It also observes, correctly, that in a business of this kind the majority of employees are support and operations. The approval service exists because humans review listings — and the humans exist because the invariant and the marketplace both fail in ways only a human can adjudicate.

#### Team boundaries as a partitioning force

The regulations service is separated from the listing service with an explicit reason: two teams, each accumulating domain expertise the other does not need. That is ownership cutting a boundary — the legitimate form of the argument — not "it will scale better", which is not a force until it names the different axis it scales on.

#### Regulation as a first-class constraint

Occupancy caps, minimum stays, prohibited addresses, safety equipment, data residency — rules that differ by country, by city, sometimes by building. The treatment notes that designing for changing regulation is a blind spot that has cost companies repeated re-architecture. In method terms this is the **operating envelope**: contracts held, jurisdictions served, obligations no client will ever ask for — and that will delete a design if discovered late.

::: note {data-l="WHY THESE TWO HALVES ARE ONE PIECE"}
The invariant creates the ops department. A system that never double-books still has disputes, fraud, damage claims and regulatory takedowns — and every one of those is a human decision, with a queue, an assignment protocol, a race condition between a reviewer and an editing host, and an audit trail. The approval flow in this design is a small distributed system whose contended resource is *an operator's attention*. Design the invariant without the organisation, and you have specified half a system.
:::
:::

### What the arithmetic deletes, and one thing it adds

- **Distributed transactions** for keeping a search index in step with the store. Change capture from the truth store does the job — and the treatment reaches that conclusion itself.
- **Follower reads on the booking path.** A follower read cannot enforce an invariant — it can only observe one, late.
- **A manually maintained city-to-leader map.** Correct in spirit — the mapping is tiny and quasi-static — but it is reference data with a convergence requirement, not a configuration file, and it needs a version and a divergence alarm.
- **Added:** the second invariant needs its own enforcer. One guest, one room, one night is contended per guest, and that does not partition by city at all — a guest can book in two cities on the same night, and nothing in the per-city design will notice.

### Naming the states protected by the invariant

A TEOB naming application: define `RoomHold` as a temporary exclusive claim over a stated room and interval, with an expiry, and `ConfirmedBooking` as the confirmed allocation under the booking contract. These are proposed definitions for this example; validate them against the organisation's language. If the invariant excludes overlap across both states, say so. Calling only confirmed bookings “reservations” must not silently remove active holds from the protected set.

Use an operation name such as `RequestRoomHold` for a request that may be refused, and a fact such as `RoomHeld` only after the defined state is established. **Room allocation authority** names a responsibility whose role is to own the reservation decision; the transaction and concurrency protocol still have to establish the invariant. A vocabulary relation between hold and booking cannot decide that protocol or justify software inheritance.

### The general form

- **Separate tolerances from counts.** Percentiles are negotiable, zero is not. Sort the requirement list into those two piles before choosing any store.
- **Identify every contended scope and its enforcement protocol.** One transaction may enforce several invariants; a second invariant can cross the first one’s partition.
- **Every zero-tolerance promise owes a counter**, audited continuously. A metric that shows the mechanism working is not a metric that shows the promise holding.
- **The organisation is outside the boundary, so it belongs in the step that characterises the outside.** Headcount, approval authority, jurisdictions, existing contracts — all inputs at step one, not deployment concerns discovered at step eight, by which point the store has already been chosen.
:::

::: footer
DERIVATION 04 · V1.5 · 2026-10-30 · APPLIES THE OUTSIDE-IN METHOD V4.14.
Source locator: Tan, *Acing the System Design Interview* (Manning, 2024), ch. 15, pp. 329–353. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§6.2.2, 7.4–7.5 and 8.3. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE) · source: [github.com/teob-cc/method](https://github.com/teob-cc/method).
:::
