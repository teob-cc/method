---
number: "06"
id: "s06"
title: "Derivation"
phase: "II"
---

::: def
Decide where every projection is computed, how it recovers, and how it is rebuilt from scratch.
:::

::: asks
ASKS · For each derived data class, what computes it, from what input, with what state, and how is it reconstructed after loss or a bug?
:::

| Processor kind | Fits | Must declare |
|---|---|---|
| **Request-time** | Cheap transforms that need the live request context | Latency contribution; behaviour when a dependency is slow |
| **Stateful stream** | Continuous aggregation, joins, materialisation with seconds of lag | State size, recovery time, replay semantics, late-data policy |
| **Batch** | Large recomputation, expensive joins, historical corrections | Schedule, runtime, idempotent re-runs, backfill cost |
| **Model** | Ranking, recommendation, classification, scoring, moderation — anywhere the output is learned rather than computed | Training input and its lag, evaluation metric, drift bound as a monitored number, the fallback rung when it is unavailable or untrusted, and **whether its own output becomes tomorrow's training input** — a feedback loop is a derivation cycle, and an unstated one is how a system teaches itself its own mistakes |

{cols="20%"}

- **Every processor is idempotent under replay**, or it is not safe to operate. Reprocessing happens after bugs, after outages, and after schema changes — this is the normal case, not the exception.
- **Merge semantics, wherever partial results are combined.** A processor that aggregates across shards, hosts or windows must state how the parts compose — and the composition is frequently not the obvious one. Top-K of top-Ks is not top-K: sum the counts first, take the heap once. Averages of averages need weights. Distinct counts do not add. If a processor merges anything, the merge rule is part of its declaration, not an implementation detail.
- **Approximation is a stated tolerance, not a shortcut.** Sketches, sampling and probabilistic structures trade accuracy for memory, and that trade is legal only against the accuracy tolerance recorded at step 01. Name the structure, the error bound, and the monitored number that shows the bound holding — an approximation whose error is never measured is just a wrong answer with better performance. Where overshoot and undershoot have different loss lines at step 01, state the bound **per side** and choose which side the error falls on — toward the cheaper error. Escrow at step 03 is the example: it moves the whole error to the undershoot side.
- **A reconciler is a processor, declared like one.** An invariant held at E3 has two enforcers, and the second is here: the reconciliation that computes the exact figure and compensates for the overshoot. It owes an input, a state, a replay behaviour and a **deadline — the time to close**, after which the exact figure is promised. Where the figure is billed, it is the enforcer of record, and the check on the path enforces only the bound.
- **Keying and parallelism.** The partitioning key determines both ordering scope and skew. A key that concentrates traffic on one entity turns a horizontally scaled processor into a single-threaded one.
- **Event time versus arrival time.** If results depend on when things happened rather than when they arrived, define the lateness bound and the policy for what arrives after it: drop, side-channel, or correct.
- **Caches are processors' outputs.** Each cache states what invalidates it — a TTL, an event, or a version bump — and the resulting staleness must match the bound promised at step 01.
- **Configuration propagation is a derivation with a convergence requirement.** Quasi-static reference data is usually pushed to every instance and held in memory, which makes the interesting question completeness rather than latency: can you tell that every instance picked up the change, and what happens to the ones that did not? Stamp the data with a version, have each instance report the version it is serving, and alarm on divergence. Watch the cold start as well — a deploy or a scale-out has every new instance fetching the full set at once, a thundering herd aimed at the one store you can least afford to lose.
- **The rebuild path is a first-class feature.** How long does a full rebuild take, does it run alongside the live view or replace it, and can the system serve reads while it runs? A projection you cannot rebuild is a second source of truth you didn't mean to create.

{style="margin-top:8px"}

::: prod
→ PRODUCES: a processor list — kind, input, output, state, recovery time, replay behaviour, rebuild duration.
:::
