---
id: "amend"
tab: "06 · AMENDMENT"
---

## The living description — amend, do not re-derive

::: lede
Constraints move. A tolerance tightens, a client class appears, a volume goes up an order of magnitude, the budget halves. The instinct is to declare the model wrong and redo it, and that instinct is exactly why models rot: re-deriving is an afternoon, so nobody ever does it, and the description on the wall drifts away from the system in the room until it governs nothing again.
:::

**Identify which claims changed.** Sometimes a new load invalidates only a capacity estimate. Sometimes a new reader needs history never retained, a new writer introduces an invariant, or a new jurisdiction changes the data model. Follow dependencies from the changed promise; preserve the parts whose assumptions still hold.

### What each change obliges you to re-check — and what it does not

The second column is the one that saves you time — the third is the one that stops a scared team from re-opening everything.

| What changed | Re-check | Preserve only after checking dependencies |
|---|---|---|
| **A new client class appears** | Its operations, tolerances, authorization, history needs, surfaces and failure contract; then all affected data classes and invariants | Only parts with no dependency on the new promises. A new reader may require previously unrecorded history |
| **A term or its meaning changes** | Its scope notes and aliases, every affected promise, schema, API result, diagram and observation; old consumers and retained history; the mapping, migration and compatibility window. A changed client-visible meaning needs agreement from the affected parties | A spelling-only correction need not reopen capacity or topology. Preserve those decisions only after establishing that their underlying meanings and assumptions are unchanged |
| **A tolerance tightens**<br><span style="font-size:11.5px">staleness <span class="num">60 s → 5 s</span></span> | The derivation that produces the affected view, and possibly the store family under it. The alarm threshold that was set at half the old bound | Client classes, invariants, the cost envelope — until the new bound is priced, at which point the envelope is consulted, not rewritten |
| **A volume moves an order of magnitude** | The demand arithmetic, and everything that cited it: node counts, partition counts, every recorded ratio — the per-key one included, which can move an invariant along the enforcement ladder. Partition counts are the trap — most designs cannot change them without a migration | Tolerances, invariants, acknowledgement semantics. Ten times the traffic does not change what a write promises |
| **An invariant is added** | The enforcer, the serialisation point for its contended unit, the isolation its scope needs and its enforcement rung, and the acknowledgement semantics on that write path — which may have to strengthen from receipt to reservation. If its scope key disagrees with the partition key, that is a one-way decision reopened, and it is priced as one | Everything that does not touch that invariant. Invariants are local until proven otherwise |
| **The operating envelope shrinks**<br><span style="font-size:11.5px">budget cut · team halved · new jurisdiction</span> | Store choices, placement, granularity, buy-versus-build. The subtraction test, run for real this time | **Client tolerances.** They do not move because you got poorer. When the envelope and the tolerances genuinely cannot both be met, that is a finding to escalate with numbers attached — not a promise to quietly lower |

{cols="24% 40%"}

::: note {data-l="WHAT AN AMENDMENT COSTS DEPENDS ON WHO SIGNED"}
Key the procedure to the three categories above. An amendment to an **engineering-owned** artifact needs no counter-signature — swap the database, change the partition count, move the placement, and nobody outside engineering needs to be told. An amendment to a **joint-signature** artifact is void until it is signed again, because it is a promise and it has a price. Tightening a staleness bound from sixty seconds to five is not a technical adjustment; it is a new commitment with a new bill, and the person who pays should hear about it before it ships rather than in the invoice.
:::

::: warn {data-l="WHEN TO RE-DERIVE"}
Re-derive the affected portion whenever its assumptions or proof no longer hold, including before deployment. Repeated zero-tolerance failures warrant a diagnosis; they do not prove that truth was misplaced, and there is no two-fix threshold. Expand the scope only as the dependency trace requires. Do not lower signed promises silently.
:::

::: p {style="margin-top:10px"}
**Write the amendment down where the original decision lives**, with the date and the claim that expired. A model whose history is a series of silent overwrites cannot be audited, and the question that gets asked in the incident review — *when did we decide that, and who agreed?* — has no answer. The amendment log stays short by construction: most changes touch one row.
:::
