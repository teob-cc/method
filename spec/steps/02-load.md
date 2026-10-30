---
number: "02"
id: "s02"
title: "Load"
phase: "I"
---

::: def
Convert client behaviour into demand arithmetic — what the outside world generates, before anything internal exists. Order of magnitude only, rounding narrated aloud.
:::

::: asks
ASKS · How much work arrives, how much data accumulates, and what may it cost to serve?
:::

Four figures describe demand: **peak request rate** per client class · **data volume and growth rate** · **working-set size** (the hot fraction that wants to live in memory) · **cost envelope**, carried in from the operating envelope at step 01 rather than invented here. Amplification, node counts, and replication overhead are deliberately absent — they are properties of a design that does not exist yet, and they are computed in the sizing pass once it does.

::: grid2
<table>
<tr><th colspan="2">Arithmetic anchors</th></tr>
<tr><td>a day</td><td><span class="num">≈ 10⁵ s</span> (86 400)</td></tr>
<tr><td>1M/day</td><td><span class="num">≈ 12 rps</span> average</td></tr>
<tr><td>100M/day</td><td><span class="num">≈ 1 200 rps</span> average</td></tr>
<tr><td>peak factor</td><td><span class="num">2–5×</span> average, more for events</td></tr>
<tr><td>1B × 1 KB</td><td><span class="num">= 1 TB</span></td></tr>
<tr><td>1 Gbps</td><td><span class="num">≈ 125 MB/s</span></td></tr>
</table>

<table>
<tr><th colspan="2">Feasibility anchors (per node, conservative)</th></tr>
<tr><td>in-memory KV</td><td><span class="num">~100k</span> ops/s</td></tr>
<tr><td>relational, simple txns</td><td><span class="num">~5–20k</span> tps</td></tr>
<tr><td>LSM store, writes</td><td><span class="num">~10–15k</span>/s</td></tr>
<tr><td>log broker</td><td><span class="num">100s MB/s</span>; plan <span class="num">1–10 MB/s</span> per partition</td></tr>
<tr><td>stateless service pod</td><td><span class="num">~1–5k</span> rps</td></tr>
<tr><td>one key, conditional write</td><td><span class="num">~70–200</span>/s for one unbatched, non-pipelined writer; measure the actual protocol</td></tr>
<tr><td>NVMe SSD</td><td><span class="num">100k–1M</span> IOPS</td></tr>
<tr><td>LLM inference, one accelerator</td><td>order <span class="num">10¹–10³</span> output tok/s — batching moves it more than the chip does</td></tr>
<tr><td>embedding / small encoder</td><td>order <span class="num">10³–10⁴</span> items/s per accelerator</td></tr>
</table>
:::

::: prod
→ PRODUCES: four demand figures, written down, each later cited by at least one component.
:::

::: p {style="margin-top:8px"}
**Every figure elicited at step 01 is either divided here or explicitly carried to a named later step.** One still unconsumed at step 10 is a finding against step 01, not against this step — the defect was asking for it, not failing to use it.
:::

- **Divide in both directions.** Not only “how many nodes does this need” but “does one node already do this?” If one node does, say so out loud and stop — the cheapest distributed system is the one you didn't build.
- **And in the third direction: per key.** Divide the hottest unit’s peak demand by measured throughput for the protocol that guards it. For an unbatched writer that waits for each commit before starting the next, [1 ÷ commit latency]{.num} is a useful estimate: [5 ms → 200/s]{.num}. Batching, pipelining, contention and the invariant’s semantics change the result. A saturated serialization point is not cured merely by adding unrelated nodes; measure candidate protocols before ruling out serial enforcement or choosing escrow. Record skew and burst duration as assumptions until measured.
- **Growth has two drivers.** Event data grows with traffic; reference data — tenants, catalogues, configuration — grows with the customer list and barely notices traffic at all. Size them separately, because a system with modest request rates can still carry a large, slowly accreting body of tenant-owned data that never expires on its own.
- **These figures do not depend on your design.** A hundred thousand users at ten requests a day is twelve per second whatever you build. That independence is precisely what lets them *constrain* the choice of stores rather than merely describe it afterwards.
- **Anchors here are for feasibility, not sizing.** They answer one question — does this need to be distributed at all? A workload of twelve writes per second against a store that handles thousands is a single node with room to spare, and saying so out loud saves the next four steps from designing a cluster nobody needs.
- **Latency arithmetic beats latency intuition**: memory reference [~100 ns]{.num}, SSD read [~50 µs]{.num}, same-datacentre round trip [~0.5 ms]{.num}, cross-region round trip [~80–150 ms]{.num}. A budget of [100 ms]{.num} permits one cross-region hop, not three. And a fan-out does not add to the tail, it multiplies it — the arithmetic is at step [07]{.num}.
- **Model workloads are counted in tokens, not requests**, and the two figures behave differently. One request is *prompt tokens in* plus *completion tokens out*, priced differently, generated at different speeds, and growing at different rates — context that creeps from two thousand to twenty thousand tokens multiplies cost and latency without changing the request rate at all. Record tokens per second in each direction, the context-length distribution, and the batch size the latency tolerance permits, because **batching is the single largest lever on accelerator throughput and it is paid for in latency**. Training is a separate demand figure with a separate shape: accelerator-hours to a checkpoint, and how often that is repeated.
- **Cost is a design input, not an outcome.** A design that arrives here without a stated cost per request has not finished step 01. Where a model is in the path this usually *is* the cost per request — inference commonly dominates the bill by an order of magnitude, so an ML design whose cost figure omits tokens has not been costed. Compute the sourcing crossover here, against the duty cycle from the operating envelope.
- **Every figure carries a provenance label** — measured, contractual, or assumed. Assumed is not shameful; unlabelled is. Anything assumed is copied into the risk register at the trace step, because traceability built on fabricated numbers is laundering, not derivation — and one that a one-way decision will rest on is measured before that decision, by the order rule at step [04]{.num}. A figure also has a state beside its provenance: *unconsumed*, when nothing ever divides by it, and *missing*, when the arithmetic needed it and nobody supplied it.
- **Never invent a number to fill a gap.** If the arithmetic needs an input that does not exist, the missing input is the finding: name it, show how far the conclusion moves across its plausible range, and carry on. A derivation may then propose a value, labelled assumed. A review may not — it marks the input missing and leaves the assuming to whoever owns the design.

::: warn
Collecting numbers and never dividing them. The most common failure in the entire method: requirements are recorded diligently, then the architecture proceeds from habit. If a component's justification cites a figure, the arithmetic must actually have been done.
:::
