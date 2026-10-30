---
number: "10"
id: "s10"
title: "Trace"
phase: "IV"
---

::: def
Walk every constraint to its mechanism and every mechanism back to its constraint. This is the design's proof, and it is short.
:::

::: asks
ASKS · Can each requirement name the thing that satisfies it, and can each component name the requirement that demands it?
:::

- **The walk**: for each constraint from the first step, name the mechanism that satisfies it and the metric that verifies it. Unmapped constraint means a gap. **A figure collected at step 01 that nothing here consumes** means the question was wrong — drop the figure, or name the decision it should have informed.
- **The three dispositions, worked in order.** When a mechanism cites no constraint from outside — a client's, or a row of the operating envelope — these are a *search* and not a menu — take the first that applies:
  1. **Surface a missing requirement.** Tracing it lands on a constraint from outside that was always true and never written down. **This is the common case and the valuable one** — and note that it is frequently a *different* constraint from the one that bought the parent: a fencing token traces to the invariant the leader protects, not to the availability figure that bought the leader.
  2. **Declare it self-derived, naming the parent decision** — and the parent is now subject to this same test. Naming a parent is not a discharge; it moves the obligation up one level.
  3. **Delete** — nothing sits above it after both searches. It entered by habit, and habit is a recurring charge.
- **Read the chain, not the link.** Record its root, its depth, and the link at which it stops tracing. A chain is only as cited as its weakest link, and a chain whose first two links are properly derived and whose third introduces an unquantified premise is unanchored from the third onward. **The finding belongs at the break, and there is one of it.** A root is one of four things — demand, supply, self-derived, or *unrecorded* — and the last is not the same as uncited: the artifact does not say, and you cannot trace it. Record it as unrecorded, name who could answer, and never resolve it by inference; a guessed root reads on the page exactly like a recorded one, and it drifts toward demand. And a mechanism may carry a second citation, usually the unwritten one — ask what else now relies on it, and record both.
- **Trace meaning as well as references.** Follow the same concept from client promise through data, API or event schema, component label and observation. Resolve aliases within their declared scope; do not count two names for one mechanism as two independent mechanisms, or one shared label as proof of shared fate. Report conflicting meanings with their locations and consequences. A missing definition is unresolved, not permission to guess. Record the outcome of consumer vocabulary checks, or that they remain unperformed.
- **Count the column.** Shared mechanisms reveal dependencies worth investigating. For each failure mode, identify which promises fail, for whom and after how long. A count is a screening aid, sensitive to how requirements were divided; it is not a risk score or a reason to split a mechanism. See [§05](#disc).
- **Fire the stressors at the finished map.** The step-07 pass, run once more as the audit's reverse direction: the forward walk checks that every stated requirement holds; this checks the map under inputs nobody stated. Same three outputs — requirement · finding · recorded option — and the same guard. Where a held-out set exists, report the residual index beside the trace, with its denominator.
- **The risk register**: rank concrete failure scenarios by consequence, affected clients, exposure, duration and recoverability. Record uncertainty, cost to reverse and shared dependencies alongside that judgement. A severe confidentiality failure can outrank ten minor dashboard failures; no multiplication of row counts establishes that ordering. Each risk names the evidence or experiment that could resolve it.
- **The cutover, where something already exists.** In a running system an uncited mechanism is Chesterton's fence rather than a razor — report it as *no recorded reason, confirm before removing*, and produce an incremental path rather than a deletion. The named shape is the **strangler fig**: new behaviour built beside the old codebase, behaviour moved across a piece at a time, the old path removed only when nothing routes to it. Inside a single runnable unit the equivalent is **branch by abstraction** — an abstraction placed over the current supplier, a second implementation built behind it, callers moved, the old one deleted. Both keep the system releasable throughout, which is the property that makes them usable at all.
- **The first prototype**: what you would build first to retire the largest risk — the entry ranked first above, and before it any measurement the cost-to-reverse rule at step [04]{.num} still owes a one-way decision — usually a load test against the riskiest store or a replay of realistic traffic through the write path.
- **The subtraction test**: if the budget or the timeline halved, what comes out and what breaks? A design that cannot be cut down was never decomposed.
- **The re-run trigger.** Amend the earliest invalidated claim and re-check its dependency closure. New clients, changed scale, new invariants or repeated failures can reopen foundational decisions. There is no two-fix threshold and no unconditional list of unaffected artifacts; record why preserved claims still hold.

::: prod
→ PRODUCES: the traceability map with a coupling count beside each mechanism, a short risk register ranked by failure consequence and evidence, with uncertainty, reversibility and shared dependencies recorded, a list of any figures left unconsumed, the stressor sheet with each row's disposition, and a first experiment.
:::

::: say
“Nothing on this board is taste. Delete any component and I'll name the requirement that breaks. Show me one where nothing breaks, and it is the first thing we investigate for removal.”
:::
