---
kind: "derivation"
title: "The division"
stamp: "DERIVATION 01 · V1.5 · 2026-10-30 · THE OUTSIDE-IN METHOD V4.14"
number: "01"
subtitle: "**A rate limiter, twice.** Two published treatments of the same system. One asserts a range of host counts and never divides, the other states no volume at all — and neither reaches the one decision that actually matters."
html_title: "The division · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="01 · THE DIVISION"}
::: kick
The system · a shared rate-limiting service
:::

## The division

::: lede
A rate limiter is the cleanest test there is of whether a design was derived or assembled, because its entire purpose is a number: it admits *N* requests per window and rejects the rest. If a design cannot say what *N* is, how many of them there are, or how fast they arrive — every box drawn afterwards is furniture. Two well-known treatments of this system exist, they fail in opposite directions, and the contrast is the lesson.
:::

::: rule
Before deciding how many nodes you need, compute what **one** node serves. Then record the ratio: what the citing requirement demands, against what the chosen mechanism supplies. **Near 1** is sized to the job. **Tens** is headroom, and you must name the factor — growth, peak, or failover. **Hundreds** means the requirement cannot discriminate the choice, and the shape came from somewhere other than this derivation.
:::

### Evidence A · the range that was never closed

::: sys
#### What the treatment does

It states a volume — of the order of a billion decisions a day — then compares five algorithms, sizes the counter storage twice over, designs counter synchronisation across hosts, and concludes that the number of hosts will "likely be between 1 and 128." A range two orders of magnitude wide — and having offered it, the treatment designs for the top of it: all-to-all synchronisation, rejected as quadratic; gossip over UDP; leader election through an external coordination service.

#### What one division gives

::: kpi
- **12k rps** · average — 10⁹ decisions ÷ 86 400 seconds in a day
- **36–60k rps** · peak at ×3–5, the one figure nobody measured
- **1 node** · an in-memory counter store at ~100k ops/s covers the average outright
- **3 nodes** · covers the peak at half utilisation, with one to spare
:::

**Ratio: 3 nodes × 100k ops/s ÷ 12k rps average ≈ 25×.** Tens, with the factor named — the assumed peak multiplier plus N−1. The range collapses to its low end, and everything designed for its top goes with it. And note what leaves together with the synchronisation machinery: the treatment's own confession — a host failure returns an error and the request goes unlimited — was an undeclared degradation rung, and once there is no cluster, there is nothing left to confess.

::: prov
the storage arithmetic in the source is sound and is done twice · the request rate, which decides the host count, is never computed
:::
:::

### Evidence B · the figure that was never stated

::: sys
#### What the treatment does

It compares the same five algorithms, chooses an in-memory counter with an expiry, puts the rules in configuration files that workers pull into a cache, returns the right status code with the right three headers, and closes on race conditions and multi-datacentre replication. Asked for the scale, its interviewer answers that the system must handle a large number of requests — and that is the only scale statement in the whole chapter.

#### What the method does instead

It refuses to invent one. A missing figure is a finding in its own right, so the load step produces a **sensitivity band** and the question that collapses it:

::: scroll
| If the decision rate is… | Counter store at ~100k ops/s, half utilised | What the deep dive buys |
|---|---|---|
| {.num} 100 /s | **1 node** | nothing |
| {.num} 10 000 /s | **1 node**, a tenth loaded | nothing yet |
| {.num} 100 000 /s | **2 nodes** → 3 for N−1 | fault isolation, not throughput |
| {.num} 1 000 000 /s | **~20 nodes** | now the synchronisation section earns its pages |
:::

**Two of four plausible readings of "a large number" fit on one node, and a third fits on three.** The centralised conclusion the treatment reaches is right for most of its readers — and it is right by accident, because the section that follows designs for the fourth row without ever saying so.

#### The memory requirement, which is the only one with teeth

"Use as little memory as possible" carries no budget, so it can never be violated. Size it, and you see where it binds:

::: scroll
| Algorithm | Bytes per tracked client | 1 M clients | 100 M clients |
|---|---|---|---|
| Fixed window counter | ~16 B | 16 MB | 1.6 GB |
| Sliding window counter | ~32 B | 32 MB | 3.2 GB |
| Sliding window log, 10 per minute | ~80 B | 80 MB | 8 GB |
| Sliding window log, 10 000 per minute | {.num} ~80 KB | {.num} 80 GB | {.num} 8 TB |
:::

One cell in that table is a problem, and the rest are rounding. That one cell decides the algorithm — and the treatment states the cost qualitatively and never sizes it, so the algorithm comparison stays an open question the arithmetic had already closed.
:::

### What both of them miss

::: warn {data-l="THE DECISION NEITHER MAKES"}
Fail-open or fail-closed. One treatment lists "high fault tolerance — a problem with the rate limiter does not affect the entire system", which *is* fail-open — stated as a virtue, never as a choice. The other confesses the failure behaviour in passing and moves on. For a search endpoint fail-open is obviously right; for a signup form or a payment endpoint it is obviously wrong — and the same design supports either. That one line, per rule, decided by the client class and written down, is the actual design. Everything else in twenty pages is algorithm trivia by comparison.
:::

The accuracy claim has the same shape. "Accurately limit excessive requests" and "synchronise with an eventual consistency model" cannot both hold unbounded: with `K` datacentres each enforcing limit `L` locally before convergence, the worst case admitted is `K × L`. Two datacentres double the limit, five quintuple it. And neither `K` nor the convergence window is ever stated, so the accuracy requirement has no value attached and cannot be tested.

### Naming the unit before dividing

A TEOB naming application: `request` needs a scope note before it becomes a denominator. Distinguish an incoming HTTP attempt, a quota decision and an admitted business operation. One attempt may check several quotas, and a retry may produce another attempt without another business effect. The demand figure and the capacity figure must count the same operation under the same conditions. Write `quota decisions/s` when that is what was measured; keep the conversion from client attempts explicit.

Likewise, record whether a `client` is an account, device, tenant or credential, and what a `window` means for the chosen rule. These are proposed scope notes for this example, not additional findings about the cited books. A precise name exposes the question; it does not measure the rate or prove that enforcement works.

### The general form

- **Do the division in both directions.** Not just "how many nodes does this need" but "does one node already do this?" And if one does — say so out loud, and stop.
- **Record the ratio at the moment of choice**, not in review — a line now, against a re-derivation later.
- **A missing figure is a finding, not a blank.** Name the input, mark it assumed, show the sensitivity, move on. A band plus the question that collapses it is a far better artifact than a fabricated number.
- **Every figure you collect must be consumed.** Name the step that will divide, bound or decide with it. On the page, a volume elicited in the first five minutes and never divided reads exactly like a volume that did work.
- **For anything whose job is to say no**, the failure behaviour is the design. Decide it per rule, in the client table, before anyone starts comparing algorithms.
:::

::: footer
DERIVATION 01 · V1.5 · 2026-10-30 · APPLIES THE OUTSIDE-IN METHOD V4.14.
Source locator: Zhiyong Tan, *Acing the System Design Interview* (Manning, 2024), ch. 8, pp. 171–195; Alex Xu, *System Design Interview — An Insider’s Guide*, 2nd ed., ch. 4, pp. 50–69. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §6.2.2. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE) · source: [github.com/teob-cc/method](https://github.com/teob-cc/method).
:::
