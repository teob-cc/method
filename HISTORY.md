# History: the deliverables map, as it stood at the move

> The working index of the Outside-In corpus up to 2026-10-30, when the corpus moved from the teob repository
> (`website/public/method/`, `website/book/`, `website/docs/outside-in/`) into this one. It is kept as history:
> the versions it names are the ones the pieces carried at the move, and nothing here is maintained. From the
> move on, this repository's git log carries the history, and the Jira project CORE carries the plans.
> Converted from `docs/outside-in/deliverables.html` (V13 · 2026-10-11) without changing its words.

DELIVERABLES MAP · V13 · 2026-10-11 · WHERE EVERY SESSION INSIGHT LANDS

# Outside-In · what we are building

**Six deliverables, one method.** The method paper is the source of truth; everything else is a projection of it with a different audience, a different depth, and a different staleness tolerance. Which is, appropriately, the method applied to itself.

01 [The six](#map) · 02 [Insight inventory](#inventory) · 03 [Enhancements, all applied](#pending) · 04 [Decisions](#decisions) · 05 [Order of work](#order)

01 · THE SIX

## The deliverables

Each has one audience and one job. The failure mode to avoid is the same one the method warns about: an artifact that exists because it seemed useful, rather than because a reader needs it. Every one below names its reader.

The method paper is **truth**. The other five are **projections** — each rebuildable from it, each with a stated staleness bound. When the method changes, they lag; that lag is acceptable and should be visible, not denied.

1TRUTH

#### The method — principles, → book

The full derivation: four primitives, ten steps, four threads, the discipline. Reader: an engineer who wants to *use* it on real work, and eventually a book buyer.

[**public/method/method.html**](../../public/method/method.html) — V4.11, current [**public/method/worked-example.html**](../../public/method/worked-example.html) — the ticket-booking derivation, split out at V3.7, now V1.6

live principles complete through V3.9 · this session added the operating envelope, granularity, ML/GPU sourcing, outcome KPIs and zero-tolerance counts, plus P4–P6. The worked example is now its own file

**BOOK STARTED · 20 AUG** [**Systems, from the outside in**](../../public/method/book/index.html) — `method/book/`, draft V0.1, **Parts I–II written** (~17 700 words). **The shape changed**: the recorded arc was Part I claim & primitives · Part II the ten steps in depth. The book is instead organised by *the primitives*, which is the order a reader needs rather than the order the method executes — **01** where the system stops · **02** demand · **03** supply · **04** arithmetic before architecture · **05** stored · **06** processed · **07** transmitted. Parts III–V (keeping the promise · the discipline · worked in full) are mapped on the contents page and listed as unwritten, deliberately

**TEACH, THEN DERIVE** the inside chapters carry **primers** — replication, partitioning, quorums, the consistency menu, percentiles, idempotence, delivery guarantees, ordering keys, backpressure, event vs processing time. Each arrives *at the moment a constraint from outside makes it necessary*, and is followed by the rule for deciding whether you have actually bought it. Every chapter closes with one worked case and one rule

**THE PAPER IS NOW THE SPECIFICATION** two documents, two readers: the book is read, the paper is checked against. The book is a **projection** in the method's own sense — rebuildable from the paper, allowed to lag, and carrying a stated bound (currently V4.11) printed on its contents page. Ten per-step anchors (`#s01`–`#s10`) were added to the paper so each chapter can point at what it is the readable form of; no existing anchor changed

**V3.8 · 16 AUG** §01 rewritten around the shared model. The claim is no longer epistemic — it is that a system is governed by the description its engineering and business halves both hold, and that furniture is a recurring charge, not a philosophical failure

**V3.9 · READABILITY** every forward reference to a numbered step removed from §01 and §02 — eleven of them. Before the ten steps exist for the reader, “step 04” is a lookup token that signals unexplained apparatus; the step *names* teach instead. The adjacent-areas table now points at *Outside · Storage & transport · Operations*

**V3.8 · SCOPE** new §01 subsection *What counts as the design* — the derivation carries into observability, operations, delivery and codebase lifecycle, each derived from the same outside rather than bolted on. This is the sharpest available answer to *why another method* **GAP** §10 Lineage cites only software sources — largely absorbed once the foreword carries the non-software ancestry

**MOVED · 24 AUG** the site was insourced from `lambda-house/website` into `teob/website` — the corpus under `public/method/`, these notes under `docs/outside-in/`.

**19 SEP** the three public repositories — teob-ts, its workshop and teob-method, the skills — were transferred from lambda-house to the `teob-cc` organisation, and the install line names it

**V4.7 · 24 AUG** the voice edition: V4.6 revoiced, no rule changed. Worked example V1.3 and book V1.1 revoiced with it

**BOOK V1.2 · FOREWORD V8 · 18 SEP** both rewritten in the author's first-person voice; the specification untouched at V4.7

**V4.8 · 22 SEP** the channel, completed: its six properties become eight — *far side* and *departure* answer what “and a failure mode” had only gestured at — and a sync edge whose acknowledgement carries the caller's promise is **commit-bearing**, with no fallback legal on it. Worked example V1.4, derivation 08 at V4.8, skills mirrored at plugin 0.9.0.

**BOOK V1.3 · 23 SEP** carries the eight properties; the landing was re-headed *The end of [human-coded] backend* the same day

**V4.9 · 2 OCT** the corpus, reconciled: the specification, the book, the worked example, the foreword, the derivations, the landing pages and the skills read against each other. Book

**V1.4** (read against V4.9, ~39 000 words), foreword **V9**, worked example

**V1.5** — its first pass reshaped to carry the promises and the operating envelope at step 01 — derivation 08 and the derivations index V1.3, plugin 0.10.0 in the working tree

**V4.10 · 4 OCT** the store's inside: a store played by more than one process has channels inside it — replication, membership, rebalancing — each owing the eight properties, and the store's durability and consistency offered are those channels seen from outside; co-location is shared fate, so a replicated store carries a placement rule; a clustered runnable unit is a split already taken. Landed at steps 04, 05, 07, 08 and 09 and in §02. Book

**V1.5** (chapters 05, 07, 08), plugin 0.11.0.

**V4.11 · 11 OCT** the price of a guarantee: what a guarantee costs is now written down beside it. The consistency menu is a ladder with a fork, with age as a second axis beside it; an invariant's scope sets the isolation it needs; invariants get their own ladder — the **enforcement ladder**, E1 serialised to E4 detected — and the division gains a third direction, per key; the fan-out tail is done in numbers; loss lines stand beside cost lines; every decision from step 04 on declares its cost to reverse; the record at the moment of choice says what the mechanism introduces. P10–P17, from a principal-backend interview preparation read against V4.10. Book **V1.6**, worked example

**V1.6** (the per-key division at the on-sale, E1 per seat, the aggregate's key declared one-way), plugin 0.12.0; the /method landing's arguable-match table gains a sixth row, the invariant.

2APPLIED

#### Running it in an interview

The one-hour protocol, carried by the method's own worked example. The eleven walks are the *showcase* — evidence it survives contact with problems it did not choose. Reader: someone with an interview in two weeks — and, more usefully, someone running a design review on Thursday.

[**interview-walks/index.html**](interview-walks/index.html) V3.1, frozen at method V4.1 · [method §08 “Running the method in forty-five minutes”](../../public/method/method.html#run) walks V1.2 — [07](interview-walks/ch07-craigslist.html) · [08](interview-walks/ch08-rate-limiter.html) · [09](interview-walks/ch09-notifications.html) · [10](interview-walks/ch10-batch-audit.html) · [11](interview-walks/ch11-autocomplete.html) · [12](interview-walks/ch12-flickr.html) · [13](interview-walks/ch13-cdn.html) · [14](interview-walks/ch14-messaging.html) · [15](interview-walks/ch15-airbnb.html) · [16](interview-walks/ch16-news-feed.html) · [17](interview-walks/ch17-top10-dashboard.html)

protocol live in method §08 · the eleven walks were rebased on the English edition, quotes verified, seven bad claims corrected — and withdrawn on 16 Aug, below

**RESTRUCTURED · 16 AUG** the fourteen walks are re-indexed as **eight derivations** at `method/derivations/`, organised by *device* rather than by chapter — the division · the stop rule · the missing root · the invariant · the acknowledgement · the projection · the client classes · the channel. Pieces 04, 05 and 07 carry two dimensions each, absorbing the supply half. Chapter numbers, page ranges and verbatim requirement tables leave the spine; the books are referred to loosely, which is also the copyright posture. The walks are **superseded and withdrawn from publication** — moved to `docs/outside-in/interview-walks/`, which never enters the image, with a 301 from the old URLs. They quoted the sources heavily; keeping them live alongside the loose version defeated the restructure

**SAMPLE REASSESSMENT · 16 AUG** three chapters of the first book re-read from source under V4.2 and the new review steps. Two of three move. **Correction to an earlier claim:** the corpus does *not* under-cover the supply half because the books do — the original walks could not see it, because the supply table did not exist when they were written

**V4.1 PROPAGATED · 16 AUG** the figure-consumption rule and the proportionality ratio, originating in the skills repo and mirrored back into the method paper. All **fourteen** walks now carry a consumption map at step 02, a `RATIO ·` clause in the step-04 sizing caption, and an *Unconsumed figures* entry at step 10 — each in that chapter’s own figures. Method V4.0 → V4.2; nineteen files restamped

**P1 SETTLED · 16 AUG** the last backlog item that changed what the method *claims*. Resolution: the citation rule was always recursive and had not said so. A mechanism may cite a decision rather than a constraint; the decision it names is itself a mechanism and faces the same rule. Three dispositions as a **search order** — delete · surface a missing requirement · declare self-derived naming the parent. Not a loophole, because nothing partitions itself: a partitioned store was bought by a volume, a leader with elections by clients who tolerate no maintenance window. **A five-deep chain on an ungrounded adjective is one finding at the root, not five.** Method V4.1 → V4.2

**P2 + P8 SETTLED · 16 AUG** the last two structural items. **P2's second half** lands in §05 as *who signs which artifact* — three categories, not two: the business *supplies* the operating envelope, *both sign* the tolerances, the ladder, the shed order and the cost per request, and engineering *owns* the graph and the arithmetic. The traceability map is then read **joint column by column**: requirement signed, mechanism not, verified-by signed again. **P8** becomes a new §06, *amend, do not re-derive* — the model was not wrong, a sufficiency claim expired; the table's third column, **explicitly untouched**, is the half that saves the time. One change still buys a real re-derivation: a zero-tolerance count that keeps firing after two fixes. Method V4.2 → V4.3; sections 06–09 renumbered to 07–10

**DELIVERY THREAD · 18 AUG** the scope claim in §01 promised four adjacent areas and discharged three — **delivery was the method's own unmapped requirement**. Added as a **fourth thread** rather than an eleventh step: recorded at 01 (*who holds an artifact you cannot rebuild for them*), cut at 04 (repo topology · dependency direction · build system), packaged at 08 (the artifact, and environments that must say what they verify that production cannot), released at 09 (version scheme · rollout strategy · the four flag lifespans · desired state and drift · the five delivery metrics). Every mechanism carries a citation and a stop rule. **GitOps is decomposed into the four primitives** rather than adopted — desired state is a truth store, the pull is a channel with an ordering key, the running system is a projection owing a commit-to-live bound, and drift is a zero-tolerance count. **P7 lands with it**: the strangler fig is now named as step 10's incremental cutover. Working note at `docs/outside-in/delivery-and-patterns.html`. Method V4.3 →

**V4.4**

**FOWLER SORTED · 18 AUG** the corpus split four ways. **Parents already owed** — Published Interface (2003) is the parent of both the undeclared-API finding and the repo-topology rule; MonolithFirst (2015) supplies the evidence for step 04's default of one unit; CQRS (2011) and the four event-driven patterns (2017). **Adopted as named deliverables** — strangler fig, branch by abstraction, parallel change, canary, blue-green, and Hodgson's four-category flag taxonomy, whose *ops toggle* closes a real gap by giving the degradation ladder an actuator. **Below the floor, deliberately** — most of PoEAA implements a processor or store role, and §10 now says so. **One unpaid debt on the thesis**: Ralph Johnson's “the shared understanding that the expert developers have of the system design”, conceded at §01 with the two differences that are the actual contribution — shared across the *business* boundary, and quantitative. Three attributions on martinfowler.com corrected to **Robinson, Sato and Hodgson**

**SECOND BOOK · 16 AUG** [xu-corpus-review.html](xu-corpus-review.html) V1.0 — Alex Xu, *System Design Interview* 2nd ed., all sixteen chapters read, twelve design examples reviewed. **Three walks written from it** — Xu ch 04 rate limiter (the missing figure), ch 06 key-value store (the chain with no client), ch 11 news feed (the constraint nobody used); series index at V3.0, fourteen problems from two books. Xu and Tan share no chapters, so the corpora are additive. Three arithmetic errors found in Xu's own figures; six of twelve examples do no demand arithmetic, four of them after eliciting the numbers. **Two topics now appear in both books** — rate limiter and news feed — and fail differently, which is stronger evidence than fourteen unique problems would be; the paired files cross-link

**SEED** method §08 is already the protocol — two passes, checkpoint every ten minutes, close with the walk

**GAP · MOOT** the protocol and the walks never became one document — the walks demonstrated the *method*, not the *hour*, and were withdrawn first

**ROLE SETTLED 16 AUG** the corpus is an optional demo, so this deliverable must stand on the protocol and the ticket-booking derivation alone. If the walks were removed tomorrow, deliverable 2 should still be a deliverable

1aFOREWORD

#### The foreword — where this came from — reframed V4

Decades in the trenches, then reconciled with the established theories: a practical method for building holistic models of information systems. Reader: whoever opens the book — *not* the sceptic in the comments.

[**public/method/foreword.html**](../../public/method/foreword.html) — V9, fourteen debts, six arguments against

live · V9 concedes fourteen debts, grades the devices, answers the counter-case

**V3 · 16 AUG** §01 rewritten as *One idea, arrived at four times* — Jackson, structured analysis, Kessler & Sweitzer, Evans/Fowler — then *what none of the four supplies: a number.* This is the foreword posture, arrived at from the front rather than by rewriting the defence

**TWO DEBTS NAMED** Kessler & Sweitzer (debt 3) — the namesake, verified against the publisher listing; its ch. 2/3 are step 01’s two halves, nineteen years early. Evans & Fowler (debt 4) — Bounded Context, and the late-paid debt on *aggregate*

**REFRAMED · 21 AUG · V4** the posture inverted, and the content refreshed to V4.5 with it. Title *What Outside-In owes* → **Where this came from**; §02 *the debts, in order of size* → **the company it keeps**; §04 *the two things that appear to be new* → **three things I have not found anywhere else**, stated as *I looked and did not find it* rather than as novelty; §05 → **the five best arguments against all of this**. **§06 was the real defect** — it listed two repairs and marked both *pending*, when one had landed at V4.2 and the other had been superseded at V3.8. It is now *what those arguments actually changed*, in the past tense, and it records the wrong repair as a mistake rather than dropping it quietly. **Two debts added**: Johnson's definition by way of Fowler, conceded as the largest debt on the page because it is a debt on the thesis itself, and martinfowler.com for the whole delivery half with the three corrected attributions. The coupling read joins §03 and §04 with Suh cited for the concept and the instrument claimed

**NOT A SEPARATE DELIVERABLE** — front matter of 1. Your original list went 1, 2, 4, 5; the gap was real and I filled it with something that was never a fifth thing

4SKILL

#### Agentic skills — superseded by the published plugin below

The method compressed to instructions an agent can run. Reader: a machine, and through it an engineer who wants the review done rather than read.

written since — as a plugin in a repository of its own, not under `.claude/skills/`

superseded

**TWO SKILLS, NOT ONE** — **derive**: run the ten steps on a described system, producing the artifacts in order · **review**: take an existing design doc and run the deletion test, the trace, and the provenance audit against it

**THE REVIEW SKILL IS THE VALUABLE ONE** — it is what this whole session actually did to Tan, eleven times, and the output shape is already proven

5REACH

#### The Medium article — publicity

~2,650 words, seven figures, one question the reader can run on their own diagram by Friday. Reader: someone who has never heard of any of this and is scrolling.

[**article-draft.html**](article-draft.html) — V4, complete draft with production notes · `article-publish/` — the paste-ready package

V4 · package ready · not published

**UNBLOCKED · 21 AUG · V4** all three cleared. **Title settled** as *Twelve writes a second does not need a cluster* — drawn verbatim from beat 3, and the only candidate that survives what the corpus has since done: the old title argued the falsifiability thesis retired at V3.8, and the highest-ceiling alternative promised the eleven walks, which were withdrawn on 16 Aug. The subtitle was rewritten with it, because it opened *“That's the problem”* and answered the old headline. **Kleppmann and Kreps verified** from primary sources — Kleppmann, *Turning the database inside-out* (4 Mar 2015), on a materialised view as a cached subset of the log rebuildable at any time; Kreps, *Questioning the Lambda Architecture* (O'Reilly Radar, 2 Jul 2014), on reprocessing from the beginning of the retained log. **The placeholder is cut** rather than invented — only the author can make that sentence true, and the note says so, so it can be restored with a real anecdote. Follow-up #5 no longer promises the withdrawn walks

**SETS UP** #2 the degradation ladder · #3 a log is not one thing (now with the undeclared-API half) · #4 the four primitives

**DIFFERENTIATOR** added at V3.2 as beat 7, “The other three quarters” — hinges off FIG 5’s *Verified by* column, adds FIG 6 (the four areas derived), closes on the phase-change line. Novelty claim in the close widened from *order and discipline* to *order, discipline and scope*

6REACH

#### The landing — `teob.cc/method` — live

The publication vehicle and front door for the whole ecosystem. Reader: an engineer arriving from a link someone shared, deciding in eight seconds whether to keep reading.

`website/public/method/index.html` — live at teob.cc/method, dark, matching teob.cc's own tokens (#0a0b0d · #7fd8c4 · Inter + JetBrains Mono)

live reworked twice since draft V1 — on 21 Aug around the shared model, and re-headed *The end of [human-coded] backend* on 23 Sep

**THE HERO** *The end of [human-coded] backend*, over the three-part signing table — the business supplies, both sign, engineering owns. Draft V1's hook, the deletion test as an action the reader can take before agreeing to anything, survives further down as a count: *pick any box and count the promises it keeps*

**THE PROMISE** *one description of a stateful system that product and engineering can both hold, argue about, and build from* — and the agent section still gives the install command rather than a description

**NINE SECTIONS** the model · vocabulary · the two axes · horizontal · vertical · heritage · agent · read · start

**SERVES** the book · the specification · the worked example · the eight derivations · the foreword, all as static HTML under `/method/`; the interview walks were withdrawn on 16 Aug and their old URLs redirect to the derivations

4SKILL

#### Agentic skills — published, was unwritten

The method compressed to instructions an agent runs against a system the *user* chooses. Reader: a machine, and through it an engineer who wants the review done rather than read.

`teob-cc/teob-method` — public repository; the `outside-in` plugin, installed from its own marketplace

published · plugin 0.12.0 **outside-in:review** — recover the outside · type every component · deletion test · traceability map · provenance labels · check the arithmetic in both directions · adjacent areas. Carries the **brownfield clause** (P7): in a running system an uncited mechanism is Chesterton's fence, reported as *“no recorded reason — confirm before removing”* **outside-in:derive** — the ten steps forward, refusing to name a technology before the demand arithmetic binds. Carries the stop rules, the acknowledgement table and the phase-change rule

**BOTH REFUSE INVENTED NUMBERS** — a missing figure is a finding, not a blank to fill from a reference architecture

**EVALUATED · 16 AUG** `review` run twelve times over the Xu corpus; ten gaps recorded in [xu-corpus-review §10](xu-corpus-review.html#s10). The three that bit hardest: no *proportionality* test beside the deletion test (a mechanism can be cited and still be 400 000× its requirement); no output slot for *self-derived chains*, which is **P1** reaching the skill before the method has settled it; and no home in the output format for *supply* findings, despite step 01 mandating them. Two have mirrors on `derive`

**On the numbering.** Your list went 1, 2, 4, 5. I filled the gap with a lineage deliverable; it turned out not to be a deliverable at all but the front matter of 1, so it is numbered **1a** above and the gap at 3 stands open as you left it. That made four things, not five; the book (**1b**) and the landing (**6**) have joined since, which makes six — and the front matter of one.

02 · INVENTORY

## Every insight from this session, and where it lives

Applied means it is in a file. Placed means it has a destination but is not written. Nothing below is allowed to remain unplaced.

### Method devices added this session — all applied

| Insight | Where it landed | Status |

|---|---|---|

| **The log's schema is an API**, and the most-skipped decision — because async consumers are invisible at write time | Method §02, fourth bullet on the log decomposition + the properties figure, now red-highlighted | applied V2.3 |

| **The organisation is the second outside** — capability, hosting, contracts, cost, teams | Method step 01 split into demand/supply; new third thread on the map; consumed at 02/04/05/08/09 | applied V2.4 |

| **Observability is proportioned to consequence** — the rung is a metric; “never wrong” owes a continuous audit | Method step 09, new subsection + two table rows | applied V2.5 |

| **Lifecycle shapes stack and delivery** — spike / one-off / prototype→platform / platform | Method step 01 supply half; release row at 09 sized by it | applied V2.5 |

| **Granularity is a range, not two nouns** — three independent axes; each split cites a force | Method step 04, new subsection; new anti-pattern | applied V2.6 |

| **The first split is a phase change** — inside one process there are no channels | Method step 04 comparison table + §02 primitives scope note | applied V2.7 |

| **Seams vs services**, and what makes a seam real enough to cut later | Method step 04 bullets | applied V2.6 |

| **Boundaries are cut where ownership is cut** — Conway as a derivation rule | Method step 04; closes the decomposition gap from the review | applied V2.4 |

| **Dependencies are client relationships reversed** | Method step 01 demand half | applied V2.4 |

| **The shared model is the thesis** — a system is governed by the description engineering and business both hold; furniture is a recurring charge, not an epistemic failure | Method §01 lede, both tests re-motivated, new *Why this model can be shared* subsection carrying the role/implementation demarcation | applied V3.8 |

| **Design extends into the adjacent areas** — observability, operations, delivery, codebase lifecycle, each derived from the same outside | Method §01 new *What counts as the design* subsection + four-row derivation table pointing at steps 01, 04, 09 | applied V3.8 |

| **The living description** — a store is a role with constraints; when constraints change only the sufficiency claim expires | Method §01, closing the “rationale capture always fails” objection inside the claim rather than in the counter-case | applied V3.8 |

| **The four primitives are three renames, conceded up front** — with two twists: surface is the one composite type, and the types apply to *roles*, so one product occupies several nodes (Kafka = producer channel + retained store + one consumer channel per reader) | Method §02 now opens with the 1977 correspondence table ahead of the primitives themselves, discharging the concession the lineage draft demanded | applied V3.9 |

| **The boundary lineage** — Jackson, the context diagram, outside-in as a named discipline, Bounded Context | Foreword §01 as the opening thread; three new bullets in method §09 | applied V3.9 + foreword V3 |

### Verification work — provenance infrastructure

| Insight | Where it landed | Status |

|---|---|---|

| Eleven walks rebased on **Acing the System Design Interview** (Manning 2024); page ranges recomputed | All eleven walk files + series index | applied |

| **Seven false claims corrected** — the 808 GB non-contradiction, “builds 128 hosts”, five misquotes | Walk files; recorded in the article's production notes as the fact-check register | applied |

| **Nygard verified** — timeouts, breakers, bulkheads are his; “timeout budgets” and “degradation-as-design” are *not* | Article lineage claim corrected; note added | applied |

| **The degradation ladder has no established parent** — possibly the method's most original device | Said in the foreword, §03 and §04, and in method §10: Nygard supplies the mechanics, the ladder has no parent | applied |

| Kleppmann and Kreps attributions verified from primary sources | Article V4, 21 Aug | applied |

### Research findings — destined for the foreword (1a) and the article

| Finding | Consequence | Status |

|---|---|---|

| **NASA SE owns bidirectional traceability and the deletion rule** — unparented requirement is “gold plating … should be eliminated” | Cited in the foreword, debt 5, and in the method's own lineage section since V4.9. The novelty claim is narrowed there to *requirement→mechanism* and *mandatory* rather than diagnostic | applied · foreword debt 5 |

| **TRIZ owns the deletion test** — trimming Rule A; “the mechanism disappears, while the function is performed” | Foreword, debt 7. The surviving distinction is the anchor: external constraint vs. surviving function | applied · foreword debt 7 |

| **QFD owns the traceability matrix and artifact-chaining** (1972) | Foreword, debt 6 | applied · foreword debt 6 |

| **Suh's “solution-neutral environment” and “redundant design”** | Foreword, debt 6 — and the coupling instrument the method lacked landed as P3 at V4.5 (see 03) | applied · foreword debt 6 + V4.5 |

| **Design fixation is well-evidenced**; persists despite warnings; experts equally affected; **near+common examples are the harmful quadrant** | Backs the premise, and indicts *this specific genre* rather than examples in general | placed · written into neither article V4 nor the foreword's text |

| **“Unfalsifiable because underived” is not supported and partly refuted** (Rittel; Parnas & Clements) | Superseded rather than repaired — the thesis is now the shared model, which never enters the argument. Method §01 rewritten; article beat 2 rewritten | applied V3.8 |

| **The genre codes derivation as junior, recall as senior** — quoted, verbatim | The freshest attack available; belongs in the article's turn | placed → 5 · not in article V4 |

| **Estimation is being deleted from the genre** — Xu chapter → Tan absent → Hello Interview “skip it” | Makes the cold open a counter-trend, not just a criticism | placed → 5 · not in article V4 |

| **No HN story critiques the genre**; the critique exists only as comments | Confirms the article is a contribution, not a restatement | placed → 5 · not in article V4 |

| **The counter-case** — Parnas “fake it”, Brooks, co-evolution, worked-example evidence, Larson 2016 | Answered in the foreword: §05 states six arguments in their proponents' words, §06 records what each one changed | applied · foreword §05–§06 |

03 · APPLIED

## Method enhancements — identified, and all applied

All belong to deliverable 1. P1 settled 16 Aug, P2 and P8 the same day, P7 with the delivery thread on 18 Aug, P3 on 21 Aug — and the backlog was empty for one day. **P9 entered on 22 Aug through its own pre-registered gate**: proposed on the 21st, gated on a demonstration, and the demonstration ran twice independently the next day with the headline finding converging. Its method edits landed the same day. **The backlog is empty again.** **P10–P17 entered on 11 Oct** from outside the corpus: a principal-backend interview preparation (ad serving — budget pacing, hot campaigns, money-moving writes, tail latency, the cost of a choice, the irreversible decision last) read against V4.10. The method already covered most of it; eight refinements remained, and all eight landed as V4.11 the same day. **Empty once more.**

**P9 APPLIED · 22 AUG · V4.6.** The stress pass landed as a pass, not a step — recorded at 01 (stress the elicited list before leaving; recorded options beside the risk register), instrumented at 07 (stressor generation by the design's own nouns · the incidence matrix and its mechanical readings · three legal outputs · the unified guard: a matrix total is a measurement, not a target), fired again at 10 as the audit's reverse direction with the residual index reported beside the trace. §06's re-derivation trigger is named an **attractor report**. O'Reilly enters §10's lineage and the foreword as **debt 14** — owed and not-taken both stated — and §05 becomes *the six best arguments*, the sixth answered by adoption. **The worked example carries the amendment** (V1.1): reversal flows, the expiry's two fixes, price captured into the hold, two business-signed scope calls, five recorded options — framed as an expired sufficiency claim, with what the change explicitly does not touch stated. Book: ch 08 gains *Stressing it on purpose* with the mini-matrix figure; ch 09 and 12 name the attractor report. Skills mirrored; plugin **0.8.0**. The R1 figure landed in ch 08 rather than the method paper — the spec stays dense text, the book teaches; recorded as a deliberate resize.

**REPLICATED · 22 AUG.** The naive replication both dry-runs left open is closed — the hard way, which is the credible way. Run 1 (an in-project subagent) **voided itself** under the pre-registered rule: subagents inherit `CLAUDE.md`, which has carried the answer key since the V4.6 note, and the analyst said so. Run 2, a headless session outside the project — no CLAUDE.md, no memory, tools disallowed at the CLI — scored against criteria frozen before either run: **the squatter class and the reversal gap reproduced fully blind (3/3 across all runs)**; the read–commit interval did not reproduce on the map noun, surfacing instead as the same defect on price — which confirms Run A's own flag that the interval insight is the analyst's walk, not the matrix's. Four findings only the blind run produced, including that **the design's own first experiment has an unstated precondition** (no historical on-sale exists to replay). Foreword **V6** and worked example

**V1.2** each carry one evidence sentence. `residuality-r8-replication.md` + preserved run-2 output

| # | Enhancement | Why | Size |

|---|---|---|---|

| P1 | **Self-derived requirements** — the citation rule was always recursive | — | applied V4.2 |

| P2 | **Name the two readers** — three categories, and the map read joint column by column | — | applied V4.3 |

| P8 | **The living description** — §06, amend rather than re-derive | — | applied V4.3 |

| P7 | **Brownfield clause** — Chesterton's fence, and the strangler fig as the named cutover | — | applied V4.4 · already in the review skill |

| P3 | **Coupling read on the traceability map** | — | applied V4.5 |

| P9 | **The stress pass** — residuality's stressor analysis and incidence matrix as a pass landing at steps 01, 07 and 10 | The map verifies stated requirements; it cannot manufacture unstated ones. Both dry-runs found the same headline gap — **the reversal path** (refund, cancellation, revocation), invisible to all three readings because no requirement row existed to be empty. Working notes: `residuality-enhancement.md` V0.6, two executed runs (`residuality-r8-dry-run.md` Ri 0.6 · `residuality-dryrun-ticket-booking.md` Ri 0.33 strict). Edits R1–R7, R9 specified and sized | applied V4.6 · plugin 0.8.0 |

| P10 | **The consistency menu is a ladder with a fork** — a sequential row; the four session guarantees side by side under causal | The menu called its middle rows different promises rather than rungs — half right. A class that needs two guarantees neither above the other buys both, or causal above them, whichever is cheaper, and the record says which | applied V4.11 · plugin 0.12.0 |

| P11 | **An invariant's scope sets its isolation** — one key, one partition, across partitions; the store's default isolation written down | Each invariant named an enforcer and a scope, and nothing said what the scope asks of concurrent writers. Snapshot isolation permits write skew; PostgreSQL defaults to read committed | applied V4.11 · plugin 0.12.0 |

| P12 | **The enforcement ladder** — E1 serialised · E2 escrowed · E3 bounded · E4 detected; one enforcer per promise | The degradation ladder says what a client is handed; nothing said how strictly an invariant holds under contention. A rung-6 invariant takes E1 or E2 only, and escrow is the way past the per-key ceiling | applied V4.11 · plugin 0.12.0 |

| P13 | **Divide per key** — the third direction of the division, beside per node and per cluster | Step 03 recorded the hot-key profile and nothing divided it — an unconsumed figure, by the method's own rule. A ratio near one decides the enforcement rung before any store is named | applied V4.11 · plugin 0.12.0 |

| P14 | **The fan-out tail, in numbers** — 1 − pN; fewer leaves, hedged requests or partial results | Step 07 named tail-latency arithmetic without doing it. At p99 across 100 leaves, about 63% of requests wait on a slow one (Dean & Barroso) | applied V4.11 · plugin 0.12.0 |

| P15 | **Loss lines beside cost lines** — both ladders priced both ways; error bounds with a sign | The envelope recorded what running costs and never what a violation costs the business, so no mechanism could be set against the loss it prevents | applied V4.11 · plugin 0.12.0 |

| P16 | **Reversibility, declared** — one-way or two-way from step 04 on; the risk register ranked by three readings | The corpus weighed a client's irreversible choice and never the designer's. Before a one-way decision rests on an assumed figure, the measurement is bought | applied V4.11 · plugin 0.12.0 |

| P17 | **What a choice introduces** — a fourth field in the record at the moment of choice | A cache brings a stale window, a conditional write a per-key ceiling. An introduced cost nobody records is how mechanisms accrete whose citations nobody can see | applied V4.11 · plugin 0.12.0 |

| P4 | Accuracy as a step-01 tolerance · merge semantics + error bounds at step 06 | — | applied V2.8 |

| P5 | Environment qualifier on tolerances | — | applied V2.8 |

| P6 | Conflict policy · lease declarations · model-as-processor · resharding path | — | applied V2.8 |

### What left this list, and why

Recorded rather than deleted, because a backlog that silently drops items reads as “we covered everything” when it didn't.

| Item | Disposition |

|---|---|

| **P2 as originally written** — falsifiability reframed, discovery → justification | wrong repair. It answered Simon and Rittel by retreating further into philosophy of science, when the objection was that the claim was academic in the first place. Replaced by the shared-model claim, which is grounded and which the deletion test already serves. Applied to method §01 at

**V3.8** and to the article’s beat 2 |

| **Walk files re-verified at page level** against the English edition | demoted to optional. The corpus is a showcase of pragmatic value, not a foundation. Quotes and the seven bad claims are already fixed; page ranges are cosmetic and no deliverable waits on them |

| **“Store collides with DFD”**, previously flagged blocking | stale — already resolved. The collision was on *Sink*, which is DFD's external destination; renaming to **Store** was the fix, and §02 carries the concession explicitly |

| **Suh, *Design Engineering and Science*** — $12.99 purchase | not needed. P3 is computable without it; the citation would be a courtesy, and the free ADD/ATAM reports already carry the SEI lineage |

**P3 SETTLED · 21 AUG.** Raised from the landing page rather than the backlog: the old hero said *name the requirement whose removal deletes it*, and a box serving three requirements is deleted by none of them. The resolution is that the deletion test was always a **count**, and the count has three outcomes — **none** is furniture, **one** is derived, **more than one** is a coupling. The instrument is a column count on the map that already exists. **The demonstration is the method's own worked map**, which passes both invariants cleanly while its replicated log quietly carries three promises: durability, search freshness and erasure. Guarded by a new anti-pattern — the count is a measurement, not a target, and a store derived from a coupling number rather than a client constraint is uncited. Landed in §01, §05 and step 10; mirrored to both skills; plugin **0.7.0**. Method V4.4 → **V4.5**.

04 · DECIDE

## Decisions — none open

Three of the four forks were closed on 16 Aug, and the two that stayed open after them have closed since. They are kept here with the reasoning, because the closures are load-bearing for everything downstream.

### Closed

| Decision | Settled as | What it changes |

|---|---|---|

| **Tan's role** | An optional demo — a proof and showcase of pragmatic value, not a foundation | Deliverable 2 no longer rests on eleven re-derivations of another author's chapters. The **hour protocol** and the **ticket-booking derivation** are the deliverable; the walks are evidence that it survives contact with eleven unfamiliar problems. The book takes its own examples. Page-level re-verification stops blocking anything |

| **The thesis** | Not falsifiability. **A system is governed by the model its engineering and business halves share** — and the method's job is to make that model expressible in terms both can hold | “Unfalsifiable because no quantity was ever committed to” was too academic for a method whose whole point is getting down to the realities on the ground. Applied to method §01 at V3.8 **and carried into the article**: furniture is not a philosophical failure, it is a recurring charge against a budget somebody signed. The article was retitled with it on 21 Aug |

| **Where lineage lives** | A **foreword** to deliverable 1 — the author summarising decades in the trenches, then reconciling with the established theories | Stops being a defensive standalone doc. The frame flips from *here is why I am not a plagiarist and here are the five best attacks on me* to *here is where this came from, and here is what the literature had already got right.* Same research, better posture — and it restores your original numbering, which went 1, 2, 4, 5 |

| **What deliverable 4 targets** | A **Claude Code plugin** carrying two skills, review and derive — plain markdown, so the same files run in other agents | The fork was a Claude Code skill in `.claude/skills/`, a prompt library, or a spec others implement. The recommendation was to start with the review skill; both shipped, from a public repository of their own, `teob-cc/teob-method` |

| **Who the book addresses** — raised by the thesis | **The engineer**, with the joint artifacts named — the book says so on its contents page | The fork was whether a model that is a contract between engineering and business needs a book for both halves. A book written for two audiences satisfies neither; where an artifact is one the business signs as well, the book says so and names it |

### No longer in flight

**AGENT** software-architecture prior art — complete, all three in. Verdict on the book: **skip it**; ADD 3.0 slides and the SEI tech reports are free and were read directly **PDF** Kleppmann — verified from the primary source on 21 Aug, Kreps with it; it was the last unverified claim in the article

**TEXT** the article's placeholder — *“It cost me a message queue I had been rather proud of”* — cut on 21 Aug rather than invented

**FILE** superseded V1 eleven-step version — archived to [`archive/…V1-SUPERSEDED.html`](archive/outside-in-system-design-method-V1-SUPERSEDED.html)

05 · ORDER

## Order of work

Sequenced so that nothing is written twice and nothing ships unverified.

- Apply P4, P5, P6 to the method paper. DONE — V2.8

- Archive the superseded V1 file. DONE — archive/

- Split the worked example out of the method paper. DONE — V3.7

- Settle the thesis and rewrite method §01 around it. DONE — V3.8, 16 Aug

- Carry the thesis into the article, and add the adjacent-areas beat. DONE — beat 2 rewritten, beat 7 added, 16 Aug. Its working title, *“Your architecture diagram cannot be wrong”*, pointed at the superseded thesis, and was replaced on 21 Aug by *Twelve writes a second does not need a cluster*.

- P1 self-derived requirements. DONE — V4.2, 16 Aug. The citation rule was already recursive; it had not said so.

- P2's second half and P8, together. DONE — V4.3, 16 Aug. Written together, as planned; the framing is shared and would have been written twice otherwise.

- Discharge the delivery half of the §01 scope claim, and settle P7 with it. DONE — V4.4, 18 Aug. Fourth thread, not an eleventh step. Skills mirrored, plugin 0.6.0.

- P3, the coupling read. DONE — V4.5, 21 Aug. The last backlog item. Found from the landing copy, not the backlog.

- Rebuild the landing around the shared model. DONE — 21 Aug. Hero became *the best system designs are signed twice*, with the three-part signing table as the title-screen centrepiece; the horizontal method and the vertical curated stack are presented as one promise, with delivered and undelivered halves marked. Re-headed *The end of [human-coded] backend* on 23 Sep; the signing table stayed.

- Reframe the lineage draft as the foreword. DONE — V4, 21 Aug. Content survived; posture inverted; §06's stale pending-work section rewritten as history.

- Ready the article: thesis carried, Kleppmann verified, placeholder resolved or cut. DONE — 21 Aug, and the publish package followed on 22 Aug. The article itself has not been published.

- Deliverable 4, the review skill. DONE — as two skills, review and derive, published as the `outside-in` plugin.

- Start the book. STARTED — 20 Aug. Parts I–II written from scratch rather than assembled from the paper; the paper is re-cast as the specification and the landing now leads with the book.

- Parts III, IV and V. DONE — 21 Aug. Part III as written; **Part IV split into two** — checking a design is justified and keeping it true as constraints move are different jobs, and the mapped title *the two rules, checked both ways* had gone stale at V4.5. Part V is two new examples chosen to break unlike each other and unlike ticket booking, which stays where it is as example A rather than being folded in. **The book is complete at V1.0** — fourteen pieces, ~34 000 words, one figure each, and the photo-sharing thread running from 01 to 12.

- **Then —** the foreword becomes the book's front matter, which is what the reframe was always for.

The order changed shape when Tan became a showcase. Nothing now waits on the corpus, so the critical path runs entirely through deliverable 1 — thesis, then P1, then the two small consequences, then the foreword. The article can be cut loose at any point after the first item, and it should be: it is the only artifact with a deadline that matters, which is that someone else writes it.

## Six deliverables, and the front matter of one

**1 · METHOD** [the specification](../../public/method/method.html) V4.11 · live · backlog empty again

**1b · THE BOOK** systems, from the outside in V1.6 · complete · 14 pieces, ~40k words · tracks the specification at V4.11

**2 · INTERVIEW** [the hour · walks as showcase](interview-walks/index.html) protocol live in method §08 · walks withdrawn, superseded by the eight derivations

**1a · FOREWORD** [where this came from](../../public/method/foreword.html) V9 · 14 debts · six arguments, one adopted · rewritten in the author's voice

**4 · SKILL** two skills, executable plugin 0.12.0 public at teob-cc/teob-method

**5 · ARTICLE** [publicity, ~2 650 words](article-draft.html) V4 · title settled, sources verified · package ready, not published

**6 · LANDING** teob.cc/method live at teob.cc/method

DELIVERABLES MAP V13 · 2026-10-11 · derived from The Outside-In Method V4.11, the ticket-booking derivation, the eight derivations, and three completed prior-art research passes. Method: the method, applied to its own output. One source of truth, five rebuildable projections, every claim citing where it came from.
