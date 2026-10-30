---
id: "map"
tab: "03 · MAP"
---

## Ten steps, four phases, two structural loops

::: lede
The order is the argument. You cannot justify a store before the data model exists, nor a data model before the clients are characterised, nor a failure story before there is anything to fail. Two structural loops are legal and expected — discovering that a consistency label or a channel guarantee doesn't survive a partition, or that a residency rule splits a data class, sends you back across phases. And smaller reversals are just as legal: the sizing pass rejecting a store family, or the trace reopening any earlier step. That is the method working, not the method failing.
:::

::: figure
![Ten numbered steps arranged left to right in four phases: outside covering clients and numbers, shape covering data, storage and transport, trust and derivation, reality covering failure, runtime and placement and operations, and proof covering trace. Two red feedback arcs run backwards, one from trust to data and one from failure to data and storage.](../figures/03-ten-steps.svg)
:::

### Threads that cross every step

::: lede
Some concerns are not steps at all — they run through the whole sequence, and the method handles them by naming which step owns which part of the decision, so that a thread cannot be simultaneously everyone's job and nobody's. **Security and privacy is the clearest case** — it touches every step, and the odd steps own its written deliverables, because a threat model written before anything exists is policy, and one written after everything exists is regret. **Arithmetic is the second**: demand is computed before the stores are chosen, because it must constrain that choice — capacity is computed after, because amplification, node counts and replication overhead are properties of a graph that did not exist yet. Splitting the two runs is what stops numbers from being either decorative or impossible. **The operating context is the third**, and it has a different shape: it is recorded once, at the first step, and then spent — at load as a cost ceiling, at storage as a store constraint, at trust as a tenancy model, at placement as a hosting posture, and at operations as the number the spend is checked against. One origin, five consumers. **Delivery is the fourth**, and it is a thread for a reason worth stating: it is the only one whose decisions are all made *by default* if nobody makes them. A repository gets created, a pipeline gets copied, a version gets tagged, a fourth environment appears because somebody needed one on a Tuesday. None of it is proposed, so none of it is challenged — and each is a recurring charge. Naming which step owns which part is what turns those defaults back into decisions that have to cite something.
:::

::: figure
![Four threads shown across the ten steps. The security thread touches all ten steps, with written deliverables at outside, data, trust, failure and operations. The arithmetic thread touches load, storage and transport, and operations. The operating-context thread originates at step 01 and is consumed at load, storage, trust, placement and operations. The delivery thread originates at step 01 and is consumed at storage and transport, at runtime and placement, and at operations.](../figures/03-threads.svg)
:::

::: warn {style="margin-top:10px"}
Front-loading all of security. A threat model written before any surface, channel, or store exists produces a policy document rather than a design — the same requirements-as-decoration failure this method exists to prevent, wearing a different hat. Equally wrong: leaving all of it to the end, where classification and residency arrive too late to change the stores they should have chosen.
:::
