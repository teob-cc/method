---
id: "claim"
tab: "01 · CLAIM"
---

## Why outside-in

::: lede
Every information system is governed by a model — the one the engineering side and the business side actually share. And where no shared model exists, each half quietly runs on its own: product commits to numbers engineering never sees, engineering picks mechanisms product cannot evaluate, and the architecture diagram — drawn in a vocabulary only one side speaks — governs nothing at all. It merely records a decision already taken.
:::

Component-first design guarantees that outcome. A database gets chosen, services get drawn, and the requirements are written afterwards, as justification. Outside-in inverts the direction of causality: start with the entities **outside** the system — clients, obligations, and the organisation that has to run and pay for it — because they are the reason it exists at all, and let each decision consume the output of the one before it. What comes out is a description both halves can hold at once: no box without a constraint that put it there, no promise without a number attached, no cost nobody agreed to.

### The test that separates the two

Take any finished design you like. Pick a component and ask **which promises would lose support if it were removed**, under normal operation and the failures the system promises to survive. Record every dependency. No recorded answer is a finding to investigate; no actual obligation after that investigation means the component is furniture, with a bill and an on-call cost. Shared and redundant components can support several promises: removing just one requirement need not remove the component.

**One is the ordinary, healthy answer.** **More than one is a third finding entirely** — the component is carrying several promises at once, so when it fails they fail together, and nothing in a traceability matrix says so. That count is taken in [§05](#disc), because it is the one reading the map cannot make on its own: a matrix asks whether a cell is filled and never how many things are in it.

**Sometimes the answer is another decision, not a constraint.** The resharding path exists because the store is partitioned; the fencing token exists because there is a leader. That is legitimate, and it is no escape hatch either — the question just moves up a level: *why is the store partitioned?* Nothing partitions itself. It was bought by a volume that did not fit one machine, or it was not bought at all — and a leader with elections is bought by clients who tolerate no maintenance window, or it is not bought either. Follow the chain and it ends at a sentence about somebody outside the system — a client, or the organisation that has to run it — or it ends nowhere. **Where it ends nowhere is the finding — and it is one finding, at the root, not one per link.** A tower of eight mechanisms standing on an ungrounded adjective is not eight problems. It is one word with no number attached.

The complementary test runs the other way. Change the inputs — traffic a hundred times smaller, consistency valued over latency, internal batch jobs instead of mobile clients — and watch what moves. **If nothing moves, ask why out loud.** Contracted growth is a requirement too, and margin against it is a perfectly legitimate choice — but only when the number is stated. A design that silently survives a change in its inputs is not robust — it is untethered. And run both tests on your own last design doc before you run them on anyone else's.

::: grid2 {style="margin-top:12px"}
::: card
#### What component-first sounds like

“We'll use a log for ingestion, a key-value store for reads, a cache in front, split into services.” Technologies appear before any number exists. Nobody on the funding side of the table can tell whether it is right, so nobody argues; the review becomes taste versus taste, settled by seniority rather than by a constraint.
:::

::: card
#### What outside-in sounds like

“Partner clients burst [50×]{.num} nightly and tolerate minutes of staleness; end users need [p99 100 ms]{.num} and read-your-writes on their own orders. So: two client classes, two paths, one truth store, one derived view, and a queue that exists to absorb the burst — remove the burst and the queue goes with it.”
:::
:::

::: say
“The system is a consequence; the clients are the cause. A review should be able to walk any box on the board back to a sentence about a client, or about the organisation that has to run it — and delete any box that can't make the walk.”
:::

### Why this model can be shared, and a component diagram cannot

“Postgres” is not a term the business side can evaluate — it is an answer to a question they never even saw asked. “A store that holds these entities, survives this failure, and is read this many times a second” is a term both sides can hold, and both can then judge whether Postgres satisfies it. The four primitives are, quite deliberately, the coarsest vocabulary in which a real technical structure can still be argued about by someone who does not write code.

**This is an old idea with one word changed.** Ralph Johnson's definition, which Fowler adopts, is that in most successful projects “the expert developers working on that project have a shared understanding of the system design. This shared understanding is called ‘architecture.’” Two changes turn it from an observation into a method. *Shared* is extended across the engineering–business boundary rather than across the expert developers — the whole point is that one half of the room does not write code. And the understanding is required to be **quantitative**: a shared understanding with no number in it is precisely the furniture the previous paragraph is trying to price. Johnson's other line, “Architecture is about the important stuff. Whatever that is.”, names the gap the ten steps exist to fill.

Separating the *role* from the *implementation* is also what lets the description outlive its own implementation. A store is a role with a set of constraints — Postgres is merely one thing sufficient to play it today. When the constraints change, the store can be split, replaced or migrated **without the model having been wrong** — only the sufficiency claim expires. This is why the model is a living description rather than an upfront specification: new surfaces and changed tolerances are analysed against the description that exists, and the description is amended. Amending it when something outside changes is the method's closing move — and re-deriving, in the one case an amendment cannot cover, which the [worked example](worked-example.html#rerun) shows firing.

### What counts as the design

The genre stops at the runtime picture: boxes, arrows, a datastore, sometimes a cache. This method carries the same derivation four steps further — into observability, operations, delivery and the codebase lifecycle — because those are where the business half of the organisation actually experiences the system. A design that specifies the topology and leaves the rest to “ops later” has specified the easy half and quietly handed over the expensive one.

None of the four is a separate discipline bolted on afterwards — each is **derived from the same outside**, by the same rule, and each cites a constraint or is deleted:

<table style="margin-top:8px">
<tr><th style="width:20%">Adjacent area</th><th>Derived from</th><th style="width:19%">Derived at</th></tr>
<tr><td><b>Observability</b></td><td>Consequence, not convention. What is watched — and how hard, and who is woken — is proportioned to how badly a client is hurt when this aspect breaks, and to where on the degradation ladder that lands. An SLO is a client tolerance with a measurement attached; a zero-tolerance count is a promise that has no acceptable rate at all</td><td>Operations</td></tr>
<tr><td><b>Operations</b></td><td>The organisation that has to run it: hosting posture, contracts already held, on-call reality, and the cost envelope. Cost is a first-class outside constraint that shapes the store as firmly as data volume does, and it is the one most often left out of the model entirely</td><td>Outside · Operations</td></tr>
<tr><td><b>Delivery</b></td><td>Source access, ownership and coordination determine repository layout. Deployed and retained versions determine compatibility, upgrade and deprecation contracts. Rollout, rollback and drift handling follow the actual failure and recovery obligations.</td></tr>
<tr><td><b>Codebase lifecycle</b></td><td>Expected evolution: spike · one-off product · prototype becoming platform · platform. The lifecycle shapes repo topology and runtime granularity <em>before</em> anything is written — a modular monolith with explicit internal contracts is the right answer to “platform, eventually” and the wrong answer to “spike”</td><td>Outside · Storage &amp; transport</td></tr>
</table>

::: say {style="margin-top:12px"}
“The runtime picture is a quarter of the model. The other three quarters are how it is watched, how it is changed, and who pays for it — and those are the parts the funding side can read without a translator.”
:::

::: p {style="margin-top:12px"}
**How much method to apply.** The full pass is an afternoon, and it earns that afternoon when there are several client classes, real scale questions, or regulated data. A single-class CRUD service on one database deserves the outside, the data classes and the trace — fifteen minutes — and the method's stop rules (one node suffices · shallow trust · no contended resource, so no reservation and no strict store · no pipeline stage that cannot fail the build) exist precisely to be taken: taking them is the method working, not the method skipped.
:::
