---
kind: "derivation"
title: "The stop rule"
stamp: "DERIVATION 02 · V1.4 · 2026-10-12 · THE OUTSIDE-IN METHOD V4.13"
number: "02"
subtitle: "**A classifieds marketplace and a social feed.** Two systems, two published treatments, one shared defect: a cluster designed for a workload that fits comfortably on a single machine. And in both cases the treatment itself supplies the sentence that would have stopped it."
html_title: "The stop rule · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="02 · THE STOP RULE"}
::: kick
The systems · a city-scoped classifieds site · a tag-based social feed
:::

## The stop rule

::: lede
The cheapest distributed system is the one you never built. That is not frugality, it is arithmetic: every additional runnable unit turns internal function calls into channels with eight properties each, and buys you a deployment, a rollback path, a monitoring surface and an on-call story. The two systems below arrive at multi-node architectures from average workloads of some thirteen hundred operations a second in one case and twenty-four in the other. Both treatments contain the sentence that should have ended the discussion — and both keep drawing.
:::

::: rule
Compute what one node serves **before** deciding you need many. If one node does it, say so out loud, write down why you are stopping, and stop. If the sizing produces forty nodes for a workload in the dozens, the conclusion is not "forty nodes" — it is that the **store family was chosen wrongly**, and you return to that decision rather than accepting the cluster.
:::

### Evidence A · the classifieds marketplace

::: sys
#### The demand, derived from the treatment's own figures

::: kpi
- **116 /s** · average writes — ten million posts a day in the largest city
- **~1.2k rps** · reads, at an assumed ten-to-one ratio · ~5k at peak
- **~70 GB** · live text at a seven-day retention, plus a search index of the same order
- **≤100 GB/day** · images — the treatment prices text only, and its own photo allowance gives ten times more
:::

**Ratio: a relational primary rated at five to twenty thousand transactions per second, against 116 writes. Between 40× and 170×.** Tens at the cautious end and hundreds at the other, with no factor to account for either — and deliberately so: the store here was discriminated by query shape and the expiry lifecycle, not by write rate. Saying that out loud is what keeps the headroom from being mistaken for the reason.

#### What the arithmetic deletes

A write buffer in front of the database, for 116 writes a second. A per-city sharded fleet with geographic routing, for a write load one primary absorbs forty to a hundred and seventy times over. Whole rendered pages in object storage. Images as blobs inside the relational store. Not one of them can name a client constraint whose removal would delete it.

::: good {data-l="THE TREATMENT'S OWN BEST SENTENCE"}
"Our SQL database can easily store months of posts." That is the stop rule, correctly reached — and then every page that follows contradicts it. The interesting design in this system was never the topology. It is the **lifecycle**: posts that must disappear on schedule — a retention contract with a deletion path and an audit — and it survives the walk intact.
:::
:::

### Evidence B · the social feed

::: sys
#### The demand

::: kpi
- **12 /s** · average writes — a million posts a day
- **12 rps** · average reads — a million a day
- **1–4 GB** · serving working set — a hundred tags by a thousand items
- **10–40 GB/day** · archive growth, everything retained. Four to fourteen terabytes a year. Cheap
:::

**Ratio: 24 requests per second on average — twelve writes, twelve reads — against a single relational node rated at five to twenty thousand simple transactions a second. Between 200× and 800×, and still 80× to 330× at the ~60 of the peak.** Hundreds — and this time that reading *is* the verdict. The requirement cannot discriminate the architecture that was drawn, so the node count is chosen for failover — and the honest design says exactly that, rather than dressing redundancy up as throughput.

#### What the arithmetic deletes

A second message queue between two stages that already have one. A consumer described as running "when idle", which is a scheduling policy with no trigger. A coordination-service-sharded relational fleet. An hourly batch pipeline, which survives only if the staleness bound is genuinely hours — and the treatment had stated its bound in seconds one page earlier. Per-user precomputed feeds, for a system whose read rate is twelve a second and whose merge is cheap at request time.

::: warn {data-l="THE REVERSAL RULE, VERBATIM"}
If the sizing produces forty nodes to serve twelve transactions per second, the choice was wrong — return to the family selection rather than accepting the cluster. If it produces one node with headroom, delete the distribution and say why.
:::
:::

### What survives, and why that matters

Neither treatment is wrong about the parts. Separating an append-only archive from a serving store is exactly truth-versus-projection, and it stays. Object storage for images stays. A search index stays — a projection with a stated rebuild path. What changes is the causality: every surviving box now names the obligations left unsupported if it is removed, and the boxes that could not name one are gone. The point was never a smaller diagram for its own sake — it is a diagram where every remaining element is an argument.

### Naming the capability that survives

A TEOB naming application: call the responsibility **listing expiry**, declare the executing logic as a processor and the retained listings as a store, then record whether the logic runs as a scheduled database operation or a separate worker. Call the searchable derived data a **listing search index**, with projection as its role and the selected engine recorded separately. Those names preserve the obligations after the topology shrinks. They do not require two services.

Keep a domain compound when both words matter: `ListingExpiry` narrows the responsibility; `ListingManager` needs a definition before it tells a reviewer anything. These are candidate labels for the worked argument, to be checked against the domain's actual usage. A clearer label is not a reason to rename a compatible published API or to introduce a component.

### The general form

- **A day is 86 400 seconds, about 10⁵.** A million a day is roughly twelve a second, a hundred million a day roughly twelve hundred. Most systems described as "high scale" live in the first row.
- **Feasibility anchors are not sizing.** They answer exactly one question — does this need to be distributed at all — and that question deserves asking before the topology is drawn, not after.
- **Besides throughput, more nodes buy three things:** failover, fault isolation, and a genuinely different scaling axis. If your reason is none of those, it is throughput — and throughput is a number you can check.
- **Say the stop out loud.** An unwritten stop rule reads, to the next reviewer, as an oversight — and the next reviewer will add the cluster back.
:::

::: footer
DERIVATION 02 · V1.4 · 2026-10-12 · APPLIES THE OUTSIDE-IN METHOD V4.13.
Source locator: Tan, *Acing the System Design Interview* (Manning, 2024), ch. 7, pp. 147–170, and ch. 16, pp. 354–373. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§5.3.5, 6.6.1, 7.4–7.5 and 7.8. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE).
:::
