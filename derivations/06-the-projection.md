---
kind: "derivation"
title: "The projection and its contract"
stamp: "DERIVATION 06 · V1.4 · 2026-10-12 · THE OUTSIDE-IN METHOD V4.13"
short: "The projection"
number: "06"
subtitle: "**An autocomplete service, a content delivery network, a ranking dashboard.** Three systems at wildly different scales, and all three are the same system: something derived from something else, owing a staleness bound, an invalidation contract and — if it approximates — an error bound."
html_title: "The projection and its contract · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="06 · THE PROJECTION"}
::: kick
The systems · prefix suggestions · edge content distribution · a top-ranked-products board
:::

## The projection and its contract

::: lede
Most of what a large system stores is not true. It is derived — an index, a cache, a rollup, an edge copy, a materialised view — derived from something smaller that is true. The method's word for the derived thing is a projection, and a projection is not a lesser store with looser standards — it is a store with **three extra obligations**: what it is derived from, how stale it may be, and how it is rebuilt. Skip those three and you cannot answer the only question that matters during an incident — is the thing on the screen wrong, or merely late?
:::

::: rule
Every derived store declares: **what it is a projection of** · **its staleness bound** · **its invalidation or rebuild path**. Every processor that approximates declares its **error bound**. And every processor that combines partial results declares its **merge semantics** — because not every function can be computed from summaries of its inputs.
:::

### Evidence A · the whole system is one projection

::: sys
Prefix suggestions are the cleanest case in the guides, simply because there is nothing else in the system. A log of queries is the truth. Everything a user ever touches is derived from it by a batch job — so the design *is* the contract on that derivation.

::: kpi
- **~2.3 MB/s** · log ingest — a couple of hundred gigabytes a day of raw queries
- **~5 MB** · the entire serving structure. It fits in one host's memory with room to spare
- **~350k rps** · peak reads, an *assumed* ×5 over a 70k average, served from memory on stateless hosts
- **~140 hosts** · read tier at five thousand per host, half utilised. Ratio 10× the average, both factors named — the ×5 peak and the half utilisation
:::

The state ratio runs the other way here: five megabytes of serving state in a machine with gigabytes of memory. That is why replication is effectively free, why the hosts are stateless *by constraint* rather than by fashion, and why the read tier scales horizontally without any of the coordination ceremony that usually comes along with the phrase.

**The design is the staleness bound.** Rebuild the structure daily and the suggestions are up to a day old; rebuild hourly and you pay for it in pipeline cost. Neither answer is wrong. What is wrong is not stating which one you chose — because then nobody can tell whether a missing suggestion is a bug or a schedule. One well-known treatment of this problem states its rebuild cadence explicitly, and then honestly admits that the cadence cannot serve a breaking-news query — which is exactly the right way to be limited.

::: prov
deleted by the arithmetic: a streaming variant · a client-side download of the structure · a sketch for cardinality the working set does not need · a sampling stage whose rate is never given and whose effect on ranking is never bounded
:::
:::

### Evidence B · the same shape at a billion times the size

::: sys
A content delivery network is the method's definition of a cache, blown up to petabyte scale: **metadata is truth, blobs are projections, and the replication factor is the durability knob.** State it that way and the design falls out by itself. The metadata service is small, strongly consistent, and the only thing that must not be lost. The blobs are large, immutable, and replaceable from origin. All the interesting engineering lives in the contract between them — how an eviction is recorded, how an invalidation propagates, what a client sees during the window when metadata says one thing and an edge still holds another.

::: warn {data-l="THE FIGURE THAT SIZES EVERYTHING IS ABSENT"}
Host count binds on stored bytes divided by disk per host, or on read bandwidth divided by network per host, whichever is larger. Upload bandwidth is modest, and stated. **Download bandwidth — the term that decides the entire system — is never given.** So the ratio cannot be computed on the read path at all. That is not an omission of this derivation — it is the finding, and the top entry in the risk register, because every capacity decision downstream is waiting on one number nobody asked for.
:::

Note the difference from a *missing consumer*. An unconsumed figure was collected and then used for nothing; a missing figure was never collected, and it blocks an arithmetic step. This system has the second, the feed in derivation three had the first — and they need different fixes: one is deleted, the other is elicited.
:::

### Evidence C · the projection that cannot be merged

::: sys
A board of the top-ranked items by sales looks like a counting problem, and is mostly an aggregation-pipeline problem. Two legs — a fast approximate path and a slow exact one — each promise something different, and a design that does not say which leg answers which question ends up with two sources of truth and no reconciliation between them.

::: kpi
- **~116k /s** · average events; roughly half a million a second at peak
- **116 MB/s** · ingest bandwidth at a kilobyte an event — ten terabytes a day
- **10–20 hosts** · aggregation tier at an *assumed* fifty thousand events a second per host — ten for the peak, twenty at half utilisation. Ratio 4–9× the average, the peak and the half utilisation being the factors
- **32 GB** · all rollups, on one machine. Ratio in the hundreds, factor named: one host is the minimum unit
:::

Both ends of this pipeline are sized by their own figure — unusual, and worth noticing. But the reason this system is here is one single counterexample, which the treatment produces and then calmly walks past:

::: note {data-l="TOP-K OF TOP-KS IS NOT A MERGE"}
Take the ten best-selling items from each of a hundred machines and merge those hundred lists. The result is not the ten best-selling items. An item ranked eleventh on every machine — and therefore present on no list at all — can outsell an item that is first on one machine and absent everywhere else. The general rule the counterexample proves: **a processor that combines partial results must declare its merge semantics, and a function that is not decomposable over its partitions cannot be computed from summaries of them.** Sums merge. Maxima merge. Counts merge. Ranks do not — and neither do medians, distinct counts, or anything else whose answer depends on the tail you threw away.
:::

This is the same obligation as a staleness bound, just applied to a different axis. A projection owes you a statement of how far from the truth it may be — in time, and also in *accuracy*. An approximate structure that bounds its error is a perfectly legitimate engineering choice. One that does not is a rumour with a dashboard.
:::

### Naming the view without lending it authority

A TEOB naming application: distinguish **sales ledger**, **estimated sales ranking** and **reconciled sales ranking** where the design contains those responsibilities. The ledger owns the defined sales facts; the rankings answer derived questions under separate approximation and freshness contracts. “Exact” needs a scope too: exact through which input watermark, and for which definition of a sale? A full rebuild can be exact for its inputs while still behind current activity.

Record “derived from” as a lineage relation, not as equivalence or a kind-of relation. A name such as `SalesRankingView` helps expose that distinction, but neither “view” nor “cache” proves that all its inputs can be recovered. Keep the source, watermark, serving gate and tested rebuild evidence beside the name. Changing its spelling does not close any of those obligations.

### The general form

- **Account for every irreducible input.** Show which authoritative data can rebuild each projection, including ownership, permissions and lifecycle state. View freshness and write promises determine consistency; authority alone does not require a strict store. Discovery may iterate; the final record must expose the dependencies.
- **Three declarations per derived store** — source, staleness bound, rebuild path. If the rebuild path has never been run, it does not exist; schedule the drill before you need it.
- **An approximation owes an error bound**, measured and carried forward as an operational metric rather than quoted once from a vendor's blog.
- **Check that your aggregate is decomposable** before you distribute the aggregation. This is cheap to check and expensive to discover in production, because the answer is not obviously wrong — it is plausibly, quietly wrong.
- **Staleness is a client tolerance, not an implementation detail.** It is elicited at step one, and if nobody states it the push-versus-pull argument that follows has one axis and no scale on it.
:::

::: footer
DERIVATION 06 · V1.4 · 2026-10-12 · APPLIES THE OUTSIDE-IN METHOD V4.13.
Source locator: Tan, *Acing the System Design Interview* (Manning, 2024), ch. 11, pp. 245–265, and ch. 17, pp. 374–394. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§6.2.2 and 8.3–8.4. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE).
:::
