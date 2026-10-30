---
number: "08"
id: "s08"
title: "Runtime & placement"
phase: "III"
---

::: def
Choose implementation technology, the shipped artifact, and physical location — all for decisions already made. Deliberately small: this step allocates machines and machinery, not semantics.
:::

::: asks
ASKS · What can this team run well · what exactly do we ship · and where must it physically be?
:::

::: grid2
- **Runtime by organisational constraint**: the capability recorded at step 01, now spent — available skills, existing codebase alignment, operational maturity, and library support for the stores and channels already chosen. Not by preference, and not by novelty. If this step is the first time the organisation appears, the design was drawn for somebody else’s company.
- **Polyglot has a price**: every additional runtime multiplies build, deployment, security patching, and on-call knowledge. Justify each one by a genuine mismatch, such as a latency floor or an ecosystem gap.
- **The artifact is decided here, one per runnable unit.** Immutable, identified by content or commit rather than by a name that can be re-pointed, and **built once and promoted** rather than rebuilt per environment — separating build from run is what makes a release a thing you can roll back *to*. Delivery does not get to invent a runnable unit: if the pipeline emits a deployable the design never named, one of the two is wrong, and it is worth knowing which.

* **Placement executes the topology.** Active-active or active-passive follows the replication decision made earlier; regions and zones follow the residency rules; edge caching follows the read pattern and the static/dynamic split. And each replicated store's placement rule from step 04 becomes concrete: which member sits in which failure domain, and no two where one failure takes both. A scheduler left to its defaults packs for cost, and packs replicas together.
* **Sovereignty is enforced here**, but only for classes already labelled. If placement forces a change to what data may exist where, the change belongs upstream and is re-derived.
* **Environments are a placement decision, and each must name what it verifies that production cannot.** They are the most reliably uncited mechanism in the whole system: every one is a full copy of the cost, the configuration drift, the data problem and the access-control surface, and most exist because somebody needed one on a Tuesday. Parity is bought rather than free — put its price beside the answer, because a full-parity environment is frequently the second-largest line after production itself.
:::

::: prod
→ PRODUCES: one sentence on runtime · the artifact and how it is identified, one per runnable unit · the environment list, each naming what it verifies that production cannot · and a placement map of regions, zones, and edges annotated with which data classes may live in each and which members of each replicated store.
:::

::: warn
Spending design time on language and framework debate. It is the most visible and least consequential choice on the board, and every minute it takes is stolen from the failure step, which is where designs are actually won or lost.
:::
