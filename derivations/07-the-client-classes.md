---
kind: "derivation"
title: "The clients you did not name"
stamp: "DERIVATION 07 · V1.4 · 2026-10-12 · THE OUTSIDE-IN METHOD V4.13"
short: "The client classes"
number: "07"
subtitle: "**A notification service.** Designed for one imagined caller, it melts. Designed for the four callers that actually exist — each with a quota, its tolerances, the views it reads, the outcomes it accepts and a position in the shed order — it becomes almost obvious. And the org chart turns up right inside the request path — which is not a smell."
html_title: "The clients you did not name · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="07 · THE CLIENTS"}
::: kick
The system · a shared notification and alerting service
:::

## The clients you did not name

::: lede
A client class is not a user persona. It is a group of callers sharing a quota, a set of tolerances and a position in the order you shed them in when there is not enough capacity for everyone. Classes are the unit of nearly everything downstream — isolation, degradation, the service levels you eventually publish — which is why designing for a single undifferentiated caller is the most expensive mistake available at step one. And the traffic that melts a system is almost always the batch integration nobody bothered to give a class to.
:::

::: rule
Enumerate the callers, and for each: peak volume · latency tolerance · the views it reads, each with its own freshness bound · durability · trust zone · the degraded outcomes it accepts · **position in the shed order**. Adversaries are a client class. Your own dependencies are client relationships reversed. And the shed order is decided now, in daylight, by whoever owns the promises — not at three in the morning by whoever is holding the pager.
:::

### Four classes where the treatment models one

::: sys
::: scroll
| Class | Volume | Tolerance | View it reads, and its bound | Outcome it accepts | Shed order |
|---|---|---|---|---|---|
| **Transactional senders** — a payment confirmation, a password reset | modest | seconds; must not be lost; ordering rarely matters | the status of its own send — read-your-writes, *assumed* | correct but slower, then pending with a deadline, *assumed*; never absent | **never** |
| **Bulk marketing senders** — a campaign to a hundred million recipients | enormous, bursty | hours; individually droppable | the progress of its campaign — minutes old is fine, *assumed* | correct but less: a partial send, flagged as partial — *assumed* | **first** |
| **Operational alerting** — the system telling its own operators something is wrong | tiny | seconds; must never be silently dropped | whether the alert reached anyone — seconds, *assumed* | absent but signalled, at the very worst — never absent in silence | never — and it must not queue behind marketing |
| **Recipients** — the reverse-direction class, who did not ask to be here | a billion | they own opt-out, frequency caps and the right not to be duplicated | their own notifications, and the missed ones on a pull — minutes, *assumed* | correct but slower — late rather than never, *assumed*; never a duplicate they can see | n/a — they are the reason the caps exist |
:::

**The single most important consequence:** a transactional notification must not queue behind a hundred-million-recipient marketing blast. That one sentence is what buys the separate topics per channel and priority — without it the separation is mere decoration. With it, the separation is derived, and so is the shed order, and so is the alarm that fires when the wrong queue grows deep.

::: kpi
- **~12k /s** · per-recipient delivery events at a billion a day
- **~50k /s** · peak. Sender *requests* are orders of magnitude fewer — bulk groups fan out inside
- **≤1 PB/day** · payload volume, held in the payload store and passed by reference — up to 7 PB at a week, but only if the stated maximum is also the average, which nobody measured
- **~7 TB** · log retention at a week — a billion events a day at an *assumed* kilobyte each. The retention setting is the confession that the log is a store
:::

**Ratio: fifty thousand events a second, at an assumed kilobyte an event with the payload held by reference, is fifty megabytes a second — and against partitions rated at a few megabytes a second each that gives tens of partitions, not hundreds.** Taken at the average — twelve thousand events, twelve megabytes a second — that is about 4× supplied over demanded, and the assumed peak is the whole of the factor: headroom with its one factor named, which is what a partition count should look like when it was derived rather than rounded up.
:::

### The org chart in the request path

::: sys
The treatment contains the single best piece of supply-half design in either guide — and presents it as an implementation note. Notification requests are gated by recipient count, and the gate is **management seniority**:

::: scroll
<table>
<tr><th>Recipients</th><th>Approval required</th><th>What it really encodes</th></tr>
<tr><td>~1 million</td><td>an operations staff member</td><td rowspan="4" style="vertical-align:middle">Blast radius mapped onto authority. The system cannot evaluate whether a message <i>should</i> be sent, so it escalates the decision to a human whose seniority is proportional to the damage. This is an organisational control implemented as a runtime one</td></tr>
<tr><td>~10 million</td><td>a manager</td></tr>
<tr><td>~100 million</td><td>a senior manager</td></tr>
<tr><td>the entire user base</td><td>a director</td></tr>
</table>
:::

Read as architecture, this looks like bureaucracy leaking into a service. Read correctly, it is the opposite: the system has a **zero-tolerance promise** — never spam the entire user base by accident — and no mechanism can possibly enforce it, because "should this message exist" is not a computable predicate. So the design does the honest thing: it puts a human in the path, indexed by consequence. Every design has promises it cannot mechanise. Most just pretend otherwise.

::: note {data-l="THE DEPENDENCIES ARE CLIENT RELATIONSHIPS REVERSED"}
Push, SMS and email all leave through third-party providers, and the treatment is admirably clear-eyed about it: unless your organisation happens to be a telecommunications company, you are renting these channels. Each one brings a rate limit you did not negotiate, an availability figure you inherit, a per-message price that makes the bulk class the dominant line on the bill, and a market where it may simply be unavailable. Those are contract terms, not engineering ones — and they belong in the operating envelope at step one, because they delete design options.
:::
:::

### Two promises the treatment makes and then withdraws

- **Duplicate suppression.** The service is to detect duplicate requests and not deliver twice — and then the treatment says it will not fully trust its own implementation, because a sender may define "duplicate" differently than the service does. That is an honest observation, and it is also the finding: the deduplication key is a **contract with the sender**, not an internal detail. Name the key, publish it, and the disagreement disappears. Leave it unnamed, and both parties keep deduplicating — differently, forever.
- **Availability stated as five nines.** Quoted, not derived, and never divided into anything — not an error budget, not a degradation rung, not a per-class figure. The transactional class probably does need something close to it. The bulk class most certainly does not — and paying for it across the whole service is how a notification system ends up costing more than the product it notifies about.

### Sidebar · the fifteen-minute version

::: sys
Not every system earns the full pass. An internal control plane — say, a scheduled job auditing databases on a timetable — has one client class, no adversary, a control-plane request rate of a fraction per second, and no invariant of its own. It earns exactly three steps: **the outside**, **the data classes**, and **the trace**. Everything else is ceremony.

Run even that short version, though, and two things fall out that a component-first sketch misses entirely. First, the **victim class**: the audited production databases are clients of this system, they never consented to be, and the binding capacity constraint is not the auditor's throughput but how many concurrent audit queries each victim tolerates — a figure that has to be measured per database and cannot be derived. Second, the **silent failure**: an audit that stops running looks exactly like an audit that keeps passing, so the zero-tolerance count here is not "audits failed" but "audits that did not run" — and it needs a heartbeat, not an alert threshold.

::: prov
taking a stop rule is the method working · a design that cannot be cut down was never decomposed
:::
:::

### Naming roles in their context

A TEOB naming application: `NotificationSender`, `NotificationRecipient` and `DeliveryProvider` identify different roles even when the same organisation occupies several of them. Scope the terms to the notification boundary and use the organisation's demonstrated language. An “admin” label is insufficient when campaign approval and incident response carry different powers; name those roles and define the authority behind each.

Within that boundary, a transactional sender is a kind of sender; a recipient is related to a sender through a notification, not a subtype of one. The vocabulary relationship does not create an identity model or grant permission. Give callers a representative campaign and ask them to identify who may approve it, whose quota is consumed and who may opt out. That is a proposed terminology check, not evidence that these labels have been tested with users.

### The general form

- **Find the class nobody mentioned.** The nightly partner job, the analytics exporter, the migration script, the internal system that treats you as infrastructure. It is usually the traffic that melts you, precisely because it was never given a quota.
- **Write the shed order down while nothing is on fire.** It is a business decision wearing engineering clothes, and the people who should make it are not on call.
- **Reverse the arrows on your dependencies.** Every outbound call makes you someone's client, subject to their quota, their availability and their pricing — all of which are inputs, not runtime surprises.
- **Some promises cannot be mechanised.** Put a human in the path, index the authority to the blast radius, and write down that you did it deliberately.
:::

::: footer
DERIVATION 07 · V1.4 · 2026-10-12 · APPLIES THE OUTSIDE-IN METHOD V4.13.
Source locator: Tan, *Acing the System Design Interview* (Manning, 2024), ch. 9, pp. 196–223. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§5.3.5, 6.2.1, 6.6.1, 8.3–8.4 and 11.2. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE).
:::
