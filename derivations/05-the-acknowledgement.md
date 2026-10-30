---
kind: "derivation"
title: "The acknowledgement, and where the code runs"
stamp: "DERIVATION 05 · V1.4 · 2026-10-12 · THE OUTSIDE-IN METHOD V4.13"
short: "The acknowledgement"
number: "05"
subtitle: "**A photo-sharing service.** Ask of every write: if this call returned \"probably\", would the next screen be a lie? That answer alone sizes the expensive store. And then comes a second question, one the arithmetic cannot answer at all — whether code belongs on the client — and it turns out to be about release cadence, not throughput."
html_title: "The acknowledgement, and where the code runs · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="05 · THE ACK"}
::: kick
The system · image upload, thumbnailing and distribution
:::

## The acknowledgement, and where the code runs

::: lede
Ingress systems are decided by bytes, not requests. Their arithmetic is bandwidth and storage growth, their request rate is a rounding error — and the interesting design question is what an upload's acknowledgement actually promises. This one carries a second question that no amount of arithmetic settles: thumbnail generation could run on the client or on the server, and the published treatment argues it — at length, and rather well — on grounds that are entirely about engineering organisation.
:::

::: rule
Every write returns one of three things. A **receipt**: recorded, will converge, you may leave. A **reservation**: held against a contended resource, and the hold has an expiry. A **completion**: the final state is reached at the moment of the response. Choosing the weakest one the client can live with is what decides whether you need the expensive store — and most designs promise a completion by accident, because nobody said which of the three the acknowledgement was.
:::

### The arithmetic, which the treatment gets an order of magnitude wrong

::: sys
::: kpi
- **1 PB/day** · uploads — ten million uploaders, ten images each, ten megabytes apiece
- **~12 GB/s** · average ingress. The treatment states "over 1 GB/second"
- **10 GB/s** · its stated spike-planning figure — **below its own corrected mean**
- **3.65 EB** · storage growth over ten years. This owns the cost envelope
:::

A petabyte a day divided by the 86 400 seconds in it is roughly twelve gigabytes a second — not one. The error is a single order of magnitude in a single division, and it propagates: the peak the design plans for sits below the average it will actually see — narrowly, 10 against 11.6 gigabytes a second — so the capacity figure is not conservative, it is inverted. And this is exactly what makes the recomputation step non-optional — the number was stated, it looked plausible, and it was wrong in the direction that hurts.

::: warn {data-l="THE FIGURE THAT DECIDES THE LATENCY PATH IS NEVER COMPUTED"}
Thumbnails are the only thing on the one-second path — full-resolution downloads are explicitly exempted from it. At roughly forty kilobytes each, ten million uploaders producing ten images a day generate about [4 TB/day]{.num} of thumbnails: four tenths of one percent of the bytes, and one hundred percent of the latency requirement. That figure sizes the edge tier, the cache and the hot path — and it appears nowhere. The arithmetic in this treatment chases the large quantity because it is large, not because it decides anything.
:::
:::

### The acknowledgement, restated

::: sys
The reported treatment frames upload as a distributed transaction. A receipt can simplify that workflow if the durable acceptance record contains the original bytes, ownership and operation metadata, and a recoverable obligation to derive the remaining views. Those are authoritative inputs. Thumbnailing and indexing may then be retried from them; external effects and abandoned uploads still need explicit lifecycle rules.

Under those conditions the receipt moves derivation off the response path. It does not by itself eliminate coordination between the blob and its acceptance record; identify how a crash between those writes is recovered before claiming the receipt is durable.

::: good {data-l="CONTENT IDENTITY IS ONE PART OF REPLAY SAFETY"}
A content hash can identify an immutable blob. It does not identify every upload intent, authorise access, record ownership or make metadata and notification effects atomic. Each such effect needs its own retry contract.
:::

An at-least-once delivery channel needs a consumer whose deduplication record, effect and saved result commit atomically, or a naturally idempotent conditional effect. State key scope, payload mismatch behaviour, concurrent retry handling and retention across delayed replay. External effects require a downstream idempotency contract or reconciliation. A stable key alone does not provide this guarantee.
:::

### Where the code runs, which arithmetic cannot decide

::: sys
Generating thumbnails on the client is obviously cheaper — it costs no server hardware (somebody else's CPU is doing the work), the output is tens of kilobytes against a multi-megabyte upload, and it scales for free. And yet the treatment argues at length for the server, and every argument it makes is a **supply** argument:

- The same logic must be implemented and maintained in three client languages.
- Bugs occur in environments you do not own and cannot reproduce — disk exhaustion, memory pressure, hostile software, network configuration.
- Client releases cannot use continuous delivery. They go through staged rollout, so each release batches many changes, and rollback is slow.
- A defect that affects one percent of clients is individually not worth fixing, and cumulatively is a large fraction of the user base.

None of that is throughput, latency or storage. It is team capability, release cadence and blast radius — the operating envelope deciding a placement question, which is exactly where such questions belong and almost never where they get asked. And the treatment lands on the correct answer for the correct reason: implement server-side first, because that works for every client, and add client-side later as an optimisation with the server as its fallback.

::: note {data-l="THE LIFECYCLE IS THE ARGUMENT"}
This is the clearest example in either guide of **codebase lifecycle** deciding an architecture. A spike would put the code on the client and never think of it again. A platform with three client teams and a two-week release train cannot afford to. Same system, same arithmetic, opposite answer — and the only thing that changed is the organisation building it.
:::
:::

### The promise that cannot be kept

::: warn {data-l="A ZERO-TOLERANCE BOUND UNDONE ON THE NEXT PAGE"}
The privacy requirement is precise and unusually well stated: a deleted photo need not be *erased* everywhere for some hours, but it must be **inaccessible to every user within minutes**. That is a bounded zero-tolerance promise, and it is exactly the right shape. Then, several pages later, the design caches full-resolution images **on the client**, taking advantage of their immutability so that a favourites grid costs no server resources. Each is sensible in isolation. Together, the second quietly makes the first unenforceable — you cannot revoke a copy on a device you do not control. Either the bound applies only to server-side copies and says so, or controlled clients need enforceable expiry and revocation; copies exported to uncontrolled devices cannot be revoked by a server. The design says neither.
:::

### Naming the observation behind the acknowledgement

A TEOB naming application: give each outcome a scope note at the API boundary. The following are proposed definitions for a photo-upload contract, not universal meanings of these words or claims about the source's API:

::: scroll
| Term | What this proposed contract establishes |
|---|---|
| **Accepted** | The service has durably recorded the upload work and issued a status identifier. Processing and publication remain pending under stated deadlines. |
| **Committed** | The defined authoritative upload record and its referenced bytes satisfy the declared persistence condition. This does not establish that every derived view is ready. |
| **Completed** | The promised upload workflow has reached its specified final state, including whichever publication and access checks the contract requires. |
| **Outcome unknown** | The caller cannot establish which state the operation reached. Reconcile by status identifier or the declared retry protocol; a timeout does not establish refusal or a safe fresh submission. |
:::

Some APIs need fewer states; preserve only distinctions that change behaviour. `OutcomeUnknown` describes caller knowledge, not another server-side stage after completion. Documentation search may connect “accepted” and “completed”, but retrieval equivalence must not make them interchangeable executable results. A planned reader check is to give a consumer a timeout and ask what they may safely do next; no such check is claimed here.

### The general form

- **Name the acknowledgement before choosing the store.** Receipt, reservation or completion — the weakest one the client can live with is usually a receipt, and a receipt does not need the expensive store.
- **Find the writes that make the receipt true.** Persist the irreducible inputs and recovery obligation before acknowledging acceptance; then state which later effects are safely retryable.
- **Compute the figure that decides the promise**, not the figure that is biggest. They are frequently different, and the biggest one is more fun to compute.
- **Placement is an organisation question as often as a performance one.** Ask who ships it, how fast they can roll it back, and how many platforms it must exist on, before asking how many cores it needs.
- **Check that a later convenience has not voided an earlier promise.** Caches, replicas and client storage all extend the blast radius of a deletion bound, and each one is added by someone who was not in the room when the bound was agreed.
:::

::: footer
DERIVATION 05 · V1.4 · 2026-10-12 · APPLIES THE OUTSIDE-IN METHOD V4.13.
Source locator: Tan, *Acing the System Design Interview* (Manning, 2024), ch. 12, pp. 266–287. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§6.2.2, 8.2.3–8.2.4 and 11.2. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE).
:::
