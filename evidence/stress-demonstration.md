---
kind: "evidence"
html_title: "Stress-pass evidence · The Outside-In Method"
meta:
---

THE OUTSIDE-IN METHOD V4.14 · EVIDENCE NOTE V2 · 2026-10-30

# What the stress demonstration establishes

The stress pass was exercised by LLM analysts on a constructed ticket-booking design. It produced useful review findings. This was a small demonstration, without a comparison group or a measured production outcome.

## Protocol and results

The recorded protocol asked analysts to perturb the first-pass design with stressors, build an incidence matrix, and classify consequences as requirements, findings or options. The replication registered two targets: K1, abuse of holds by an adversary already authenticated; K2, the gap between viewing a seat and committing a reservation, even when the seat map meets its freshness bound.

| Run | Provenance limit | Recorded result |
|---|---|---|
| Initial runs A and B | LLM sessions working from the case; the first-pass text included a re-run trigger hinting at K2. These are exploratory reviews, not clean blind trials. | Both found missing reversal work and hold-abuse scenarios. A attributed its K2 diagnosis partly to the analyst’s reasoning rather than the matrix. |
| First replication attempt | Voided: inherited project instructions disclosed findings. Its output remains review material, with contaminated provenance. | Excluded from claims of blind reproduction. |
| Isolated replication | A fresh headless LLM session outside the project was given the recorded prompt and instructed not to use tools. Its declarations are recorded; they are not an independent audit of training exposure or model independence. | K1 reproduced. K2 did **not** reproduce as registered. Reversal gaps and an analogous price-lock problem were found. |

## Limits of the claim

The exercise shows that this procedure can elicit useful candidate failure scenarios from this case. It does not show that only stress analysis could find them, that independent human teams would reproduce them, or that the method outperforms ordinary review. The story’s “year later” is a narrative device, not measured discovery time. A zero-tolerance count or a completed matrix is not a correctness proof.

The negative K2 result matters: even the isolated review missed the registered read–commit diagnosis. The corrected design therefore states the reservation protocol directly: acquire the hold atomically when selecting the seat, then condition checkout on that hold’s owner, price, expiry and state. A linearizable display alone does not reserve anything.

## Audit trail

This summary is derived from the repository records `residuality-r8-dry-run.md`, `residuality-r8-replication.md`, and `residuality-r8-replication-run2-output.md`. Those internal records are not served with this site. This public note reports their protocol and outcomes; it is not a full transcript release or an independently replicated experiment.

[Corrected ticket contract](../worked-example.html#corrected-contract) · [Foreword](../foreword.html) · [Specification](../method.html)
