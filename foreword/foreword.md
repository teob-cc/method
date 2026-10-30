---
kind: "companion"
css: "foreword"
title: "Where this came from"
stamp: "FOREWORD · V11 · NAMES AND THEIR CONTRACTS · 2026-10-12 · WHERE THIS CAME FROM · 15 DEBTS · WHAT THE OBJECTIONS CHANGED"
subtitle: "**I did not get this method out of a book. I got it out of design reviews — and only then went and read the books.** Years of watching design documents being written backwards grew into a reflex: point at a box and ask what would delete it. The reading came afterwards, as a check — and most of what the reflex had arrived at was already there, some of it fifty years old. This page is the reconciliation: the company the method keeps, the combinations not found in the sources reviewed, and the six best arguments against the whole idea. One of them removed the paper's headline claim. The newest one I answered by adopting it."
html_title: "Where This Came From · Foreword to the Outside-In Method"
meta:
  - "og:type": "website"
  - "og:site_name": "TEOB · The Outside-In Method"
  - "og:title": "Where this came from — the foreword"
  - "og:description": "Fifteen debts, three devices with no owner found, and the six best arguments against the whole idea — one removed the paper's headline claim, and the newest was answered by adoption."
  - "og:url": "https://teob.cc/method/foreword.html"
  - "og:image": "https://teob.cc/method/og-foreword.png"
  - "og:image:width": "2400"
  - "og:image:height": "1260"
  - "og:image:alt": "Where this came from — the foreword: fifteen debts from Jackson 1995 to O'Reilly 2024, three devices with no owner found, and six arguments against — one of which won, and one of which was adopted."
  - "twitter:card": "summary_large_image"
  - "twitter:title": "Where this came from — the foreword"
  - "twitter:description": "Fifteen debts, three devices with no owner found, and the six best arguments against the whole idea — one removed the paper's headline claim, and the newest was answered by adoption."
  - "twitter:image": "https://teob.cc/method/og-foreword.png"
---

::: toc
01 [Where it came from](#claim) · 02 [The company it keeps](#owed) · 03 [Device by device](#graded) · 04 [What is mine](#own) · 05 [The best arguments against](#against) · 06 [What they changed](#answer) · 07 [Reading](#reading)
:::

::: mod {#claim tab="01 · ORIGIN"}
## One idea, arrived at four times

::: lede
The scene I kept walking into: a whiteboard with a load balancer, three services, a database and a cache — and nobody in the room able to say which client would notice if the cache went away. The document underneath had been written backwards, shape first and justification after. Out of enough of those reviews came a habit, and out of the habit came this method. Then I went reading, to check. As a check, I told myself — though “as a check” is what one says when one is rather hoping not to find anything. I found plenty. So here is the walk, in this order: where the idea came from, the fifteen debts, the devices graded honestly, the combinations not found in the sources reviewed, the six best arguments against all of it, what those arguments changed, and what to read.
:::

### The boundary comes first

Everything here follows from one move, and the move is old: **draw the boundary, name what stands outside it, and let the outside determine the inside.** Four traditions got there on their own, from four different directions — and you should see all four before this paper claims anything at all.

**Michael Jackson made it a thesis about where problems live.** The machine furnishes the solution, but the problem is in the world — and a developer who studies only the machine has carefully described the wrong thing. *The World and the Machine* (ICSE 1995) then walks through the ways we avoid looking at that world, and one of them is the reference-architecture reflex, thirty years early. Everything this method says about component-first design, Jackson said first, and said better. [→ debt 1]{.meta}

**Structured analysis made it a drawing procedure.** A context diagram is drawn literally outside-in: find the flows, find the **external entities** — the sources and recipients that sit outside the system — draw the system as a single box, and arrange those entities around it. Nothing inside the box gets drawn until the outside is done. Gane & Sarson had this worked out in 1977. [→ debt 2]{.meta}

**Kessler and Sweitzer made it a development discipline, and gave it this exact name.** *Outside-in Software Development* (IBM Press, 2007) says: find the stakeholders who determine what the project is really worth, and shape every decision around what they need. Its chapter 2 is *Understanding stakeholders*; its chapter 3 is *Understanding organizational context*. That is this method's first step — both halves of it, the two outsides — separated a full nineteen years before I treated the separation as a contribution. [→ debt 3]{.meta}

**Evans, and Fowler after him, made it a rule about models.** Once a domain grows large enough, one unified model stops working, because different parts of an organisation use subtly different vocabularies for the same words. So a model is only true *inside* a declared boundary, and integrating two of them means mapping, not merging. Bounded Context is the point where the entities around the system stop being scenery and become the thing that fixes what your words mean. [→ debt 4]{.meta}

::: verdict
**Naming the outside is not a warm-up before the design. It is the part that decides the rest** — and four independent traditions say so. Anyone presenting this as a discovery has not read enough. I know, because for a while that person was me.
:::

### What none of the four supplies

A number. Jackson is qualitative by design and stops before architecture. The context diagram carries no quantities. Kessler and Sweitzer stop at consumability and never reach a store. Bounded contexts bound meaning, not throughput — a context has no p99 and no bill.

So the claim of this paper is not the direction. The direction has been claimed four times over already, and this page exists partly to say so out loud. The claim is that **the direction is worth very little until the outside is made to produce quantities that bind before a technology is chosen** — a demand figure, a tolerance, a cost envelope — and that these have to arrive in a particular order, if each one is going to constrain the next.

### So what is left?

If four traditions got here first, what is left, then? Fair question, and it deserves the sharpest form I can give it. So here it is, the way the best-read person in the room would put it — not a hostile objection to bat away, but the shape of the answer:

::: concede
The composite version, which is the real one: *“This is Jackson's Problem Frames wearing a data-flow-diagram costume, with SEI quality-attribute scenarios for the requirements, DO-178C bidirectional traceability for the trace step, Helland's tentative operations for the acknowledgements, and Smith & Williams' SPE steps six and seven for the arithmetic. Every part has a twenty-five to fifty-year-old owner.”*
:::

Nearly all of that lands — and the parts that land are exactly the parts I would have liked to claim. The typing scheme is structured analysis. The traceability rule is regulated-industry practice. The two-pass arithmetic is performance engineering. The acknowledgement kinds are a transaction-protocol construct. Each one is checked and cited in §02, and the checking is rather the point: every source on this page was read before it was described here, and seven claims that turned out to be wrong were corrected, not softened.

What survives is narrower than a novelty claim — and better company to keep:

::: verdict
**Outside-In records a design as an ordered chain of constraints, arithmetic and decisions.** Its parts have substantial prior art. The combination is useful to compare with the selected sources below; the reading does not establish that nobody assembled it before. Discovery may iterate. The final record must make the dependencies inspectable.
:::

And one naming problem, best stated plainly because someone will raise it sooner or later: **“outside-in” is taken three times over** — Kessler & Sweitzer's *Outside-in Software Development* (IBM Press, 2007), outside-in TDD (Freeman & Pryce, 2009), and outside-in BDD. The TDD sense is a genuine near-collision with a different referent: there it names the direction *tests* are written, here the direction *decisions* are derived. **The IBM book is not a collision at all** — same idea, same domain, same name — and it is now debt 3 rather than a footnote.
:::

::: mod {#owed tab="02 · COMPANY"}
## The company it keeps

::: lede
Fifteen debts, roughly in order of size. They are not an apology. This is the neighbourhood the method lives in, and a method with no neighbours is a method nobody has checked. For each one: what the ancestor says, in its own words where the wording matters, and exactly where Outside-In differs. The original reading notes report primary-source checks; this revision has not independently reverified every quotation or absence claim. The named readings bound the comparison, and absence from them does not establish absence from the literature. **Two of these were conceded late; others were adopted explicitly.** The stress pass arrived at V4.6, and the vocabulary discipline at V4.13. And one thing I learned writing a page like this: the reading never stops finding parents.
:::

### 1 · Michael Jackson — the problem is in the world

The closest philosophical ancestor — and closer than is comfortable. *The World and the Machine* (ICSE 1995) opens on the thesis the whole method is built from: the machine furnishes the solution, but the problem is in the world. Its §3, *Kinds of Denial*, lists four ways developers avoid looking at that world — **and §3.1 is the reference-architecture critique, thirty years early**:

<blockquote>“…already well understood, and the knowledge and understanding are embodied in the standard design from which they will derive their solution by an almost imperceptibly small perturbation.”<cite>Jackson, <i>The World and the Machine</i>, ICSE 1995, §3.1 Denial by Prior Knowledge</cite></blockquote>

<blockquote>“We software developers have always offered our customers representations of the machine in place of the descriptions and analyses of their worlds and problems that they really needed… we still do it today when we offer object models and data flow diagrams and Z schemas.”<cite>ibid., §3.4</cite></blockquote>

**Differs:** Jackson is entirely qualitative. No arithmetic, no capacity, no storage or transport, no operations, no ordered pipeline — Problem Frames decomposes into recognised frames and stops before architecture, and Jackson himself calls subproblem recomposition unsolved. His domains are given in the world; they are not typed by data role. **But the critique Outside-In opens with is his, and citing him is not optional.**

### 2 · Structured analysis — the four primitives are three renames

Gane & Sarson (1977), DeMarco (1978). The canonical element types are **process**, **data flow**, **data store**, and **external entity**. The context diagram is drawn literally outside-in: find the flows, find the external entities as the sources and recipients that lie outside the system, draw the system as one box, arrange the entities around it.

Shostack's threat modelling then adds trust boundaries and lists threats **per element type** — an external entity gets spoofing and repudiation, a process gets all six, a data flow gets tampering, disclosure and denial. LINDDUN does the same for privacy. That is exactly Outside-In's move: **typing the node determines the questions asked of it.**

::: concede
Processor ≈ process. Channel ≈ data flow. Store ≈ data store. Three near-renames of a model from 1977, and the per-type question discipline generalises Shostack. [CONCEDED — method §02 now opens with this table, ahead of the primitives themselves, at V3.9.]{.s-done}
:::

**The substitution is the fourth type,** and that one I will defend: where a data-flow diagram's remaining type is the external entity — the outsider itself — Outside-In's is the **surface**, the door the system exposes. Outsiders are characterised at step 01 and never drawn inside the boundary; what goes on the graph is the touchpoint, with its contract, its quota and the invariants it enforces. For an API-shaped world that is the more useful cut.

::: meta
**NOTE · RESOLVED** the method's fourth primitive was called *Sink* until V2.9. In data-flow vocabulary “source and sink” means the external entity *outside* the boundary — the opposite end of the model from a data store — so a reader from that tradition saw an error at the exact moment the vocabulary was introduced. Renamed to **Store** throughout.
:::

### 3 · Kessler & Sweitzer — the name, and step 01 in outline

*Outside-in Software Development: A Practical Approach to Building Successful Stakeholder-based Products* — Carl Kessler and John Sweitzer, IBM Press, 24 September 2007. This is the namesake, and an earlier draft of this page waved it away as a naming collision. That was a dodge, plain and simple. The chapter list is why:

| Kessler & Sweitzer, 2007 | Outside-In |
|---|---|
| Ch. 2 · *Understanding stakeholders* | Step 01, demand half — client classes, and what each is promised |
| Ch. 3 · *Understanding organizational context* | Step 01, supply half — the operating envelope: capability, hosting posture, contracts already held, cost |
| Ch. 6 · *Defining success in stakeholders' terms* | Step 09 outcome KPIs — derived from clients rather than from whatever is easy to emit |

{cols="44%" style="margin-top:8px"}

The publisher's own summary — “identify the stakeholders who'll determine your project's real value, shape every decision around their real needs” — is this method's first step, stated as an entire discipline. Worse for me: the **two outsides**, the clients and the organisation that has to run and pay for the thing, are already separated there. I had treated that separation as a contribution. It turns out to be nineteen years old.

**Differs:** the book contains no number. No demand arithmetic, no capacity, no store, channel or topology, no traceability artifact. It is a book about development culture and consumability, and it stops exactly where architecture starts. **But it owns the name and it owns the framing, and the honest word for how I treated it earlier is evasion.**

### 4 · Evans and Fowler — the boundary is what makes a model true

Bounded Context opens Part IV, *Strategic Design*, of Eric Evans's *Domain-Driven Design* (2003). Fowler's [bliki entry](https://martinfowler.com/bliki/BoundedContext.html) is the version most engineers have actually read, and it credits Evans throughout — “a central pattern in Domain-Driven Design”. The argument: as a domain grows “it gets progressively harder to build a single unified model”, because different parts of one organisation use “subtly different vocabularies” for the same words. So a model is valid only *inside* a declared boundary, and integration means **mapping between models** rather than merging them.

That is this method's instinct, aimed at meaning rather than at volume. A **surface** is where such a boundary gets crossed, which is why the contract is declared there and nowhere else; and the insistence that a store is a *role with constraints* rather than a product is the same refusal to let one model span everything.

**Differs:** Evans bounds *meaning*. This method bounds *load, failure and cost*. A bounded context has no throughput, no tolerance and no bill. The two are orthogonal enough to compose — and that is worth saying plainly, because a reader arriving from DDD will quite reasonably ask which of the two boundaries the primitives draw. The second one.

::: meta
**DEBT PAID LATE** the worked example's “one aggregate per map, each seat in exactly one of free → held(expiry) → sold” uses **aggregate** in Evans's sense — the unit inside which an invariant holds and writes serialise. It carried no citation until the third draft of this page.
:::

### 5 · The regulated-industry traceability standards

Bidirectional traceability is fully established and much older than the method. CMMI REQM SP1.4 asks “whether all source requirements have been completely addressed *and whether all lower level requirements can be traced to a valid source*.” FDA's *General Principles of Software Validation* requires that code trace back to a design element. DO-178C mandates bidirectional traceability specifically so that “orphan source code and dead source code are not inadvertently produced.” And NASA's Systems Engineering Handbook has the deletion rule almost word for word:

<blockquote>“If there is no parent for a particular requirement and it is not an acceptable self-derived requirement, it should be assumed either that the traceability process is flawed … or that the requirement is <b>‘gold plating’ and should be eliminated</b>.”<cite>NASA/SP-2016-6105 Rev2, §6.2</cite></blockquote>

::: concede
The two-direction check is not new. What is unusual is the *severity* — and note that the safety community deliberately chose the softer form. DO-178C gives three dispositions, not one: **derived requirement** (document it, feed it to the safety assessment), **deactivated code**, **dead code**. FDA reads an untraced element as evidence that *requirements are insufficient*, and the default response is to add a requirement, not to delete the element.
:::

**That softer form turned out to be the fix for the method's own worst gap** — see [§06](#answer), Franke's pump.

::: meta
**CORRECTION** Gotel & Finkelstein (ICRE 1994) is frequently cited for the orphan rule and cannot be: it is an empirical study of pre-requirements traceability and contains no such rule. “Orphan requirement” is consultant vocabulary, absent from the CoEST glossary and the peer-reviewed literature.
:::

### 6 · Suh's Axiomatic Design, QFD, and the systematic-design tradition

Suh (1990) maps functional requirements to design parameters through a design matrix, requires FRs to be established in what he calls a **“solution-neutral environment”** — his own term — and has a name for a design parameter with no functional requirement: **redundant design**. QFD's House of Quality (Akao 1966; Kobe 1972) is a weighted requirement × characteristic matrix whose empty rows and columns are read exactly as gaps and unjustified mechanisms, and whose four-phase cascade is literally “each step consumes the output of the step before.” Pahl & Beitz and VDI 2221 standardised the ordered-artifact pipeline in Germany in the 1980s. Crawley has taught solution-neutral function and beneficiary-first derivation at MIT since 2007.

::: concede
QFD owns the traceability matrix. Suh owns the formal version and the solution-neutral requirement. VDI 2221 owns the ordered pipeline of written artifacts. All of them predate this method by decades, and none of them was cited in the method paper's lineage section until V4.9.
:::

### 7 · TRIZ — the deletion test, with a better slogan

Trimming Rule A: if the object of a function does not exist, you do not need the function carrier. The Ideal Final Result is its philosophical form — **“the mechanism disappears, while the function is performed.”** Value engineering's FAST diagrams put the higher-order function outside the scope line and read left-to-right as “how” and right-to-left as “why” — which is bidirectional traceability, drawn in 1964.

**The useful distinction is the obligation being preserved.** Ask what promises would become unsupported if a component were removed, including redundancy and failure recovery. Removing any single requirement need not delete a shared component. V4.12 corrects that earlier formulation; an unrecorded rationale calls for investigation before removal.

### 8 · SPE — the two-pass arithmetic

Smith & Williams (2001) separate step 6, *determine software resource requirements* in technology-neutral units, from step 7, *add computer resource requirements* mapped onto devices through an overhead matrix. Their justification is the method's: the separation makes it easier to explore different execution environments. Operational analysis already names the amplification factor — visits per request, service demand — and has since Buzen in 1976.

::: own
What is not precedented is the **normative gate**. SPE separates the passes for modelling convenience; Outside-In makes pass one a *precondition on technology selection*. That this is not standard practice is easy to show: Alex Xu's four-step framework puts back-of-the-envelope in step 2, *after* the box diagram, as a validator. ADD 3.0's index has one entry for back-of-the-envelope analysis. DDIA prescribes no order at all.
:::

### 9 · The SEI stack — limits of the selected comparison

ADD, ATAM and QAW supply the six-part quality-attribute scenario, the utility tree, and the practice of running quality workshops before architecture exists. ADD 3.0's headline change from 2.0 was itself an ordering inversion — 2.0's stated limitation was that “the element to decompose is chosen *before* the drivers to be addressed.”

Three negatives, checked by full-text search across ADD 2.0 (TR-2006-023), ATAM (TR-2000-004), QAW (TR-2003-016) and the ADD 3.0 deck — and worth stating, because they are the strongest support for the method's framing complaint:

- **SEI never says start from entities outside the boundary.** The availability general scenario's source-of-stimulus cell reads “Internal/External.” Do not attribute outside-in to SEI.
- **The selected SEI readings were not recorded as containing the same reverse component audit.** That is a bounded reading result, not a claim about the entire SEI corpus; source editions and locators must be checked before treating it as an exhaustive comparison.
- **No sizing arithmetic.** ATAM produces risks, non-risks, sensitivity points and tradeoff points — and never sweeps for approaches no scenario justifies.

::: meta
**CORRECTION** there is no standalone SEI technical report for ADD 1.0; the ancestor is Bachmann et al., CMU/SEI-2000-TR-001.
:::

### 10 · Rozanski & Woods — the cross-cutting threads

Their *perspectives* are the direct precedent for the method's threads: a collection of activities and tactics applied “across a number of the system's architectural views.” Ten of them, each chapter structured applicability → concerns → activities → tactics → pitfalls. The Context viewpoint, added in the second edition, is drawn as over-arching and “informs the scope and content of all the others.”

**Differs:** it is a catalog to pick from, not an ordered pipeline — the authors say themselves that they “did not write a book of prescriptive methods,” and that “not all of these viewpoints may apply.” No arithmetic, no deletion rule, and no requirement that a step consume the previous step's written output.

### 11 · Helland, and the ancestry of the acknowledgements

*Life beyond Distributed Transactions* (CIDR 2007) gives tentative operation, cancelling operation, confirming operation — later popularised as try-confirm/cancel. Outside-In's **reservation** is the tentative operation with an expiry; **completion** is the confirming operation; **receipt** is HTTP 202 with an idempotency key. The taxonomy is his.

What is done with it is not — see §04.

### 12 · Ralph Johnson, by way of Fowler — the definition the whole thesis rests on {#debt12}

**Conceded late, and it is the largest debt on this page**, because it is a debt on the central claim rather than on a device. Johnson's definition, which Fowler adopted and popularised — he quotes it whole in *Who Needs an Architect?* (IEEE Software, 2003) — runs: *“In most successful software projects, the expert developers working on that project have a shared understanding of the system design. This shared understanding is called ‘architecture.’”* That is this method's thesis — written down twenty-three years earlier, and in fewer words.

Two changes make it a method rather than an observation, and they are the whole of what is left. **Shared** is stretched across the engineering–business boundary rather than across the expert developers — the entire point being that one half of the room does not write code. And the understanding has to be **quantitative**: a shared understanding with no number in it is exactly the furniture the deletion test is trying to price. Johnson's other line — *“Architecture is about the important stuff. Whatever that is.”* — names precisely the gap the ten steps exist to fill.

::: concede
Found while sorting the pattern literature, long after §01 had been written and rewritten around the shared model. Finding its parent did not weaken the claim. It located it.
:::

### 13 · martinfowler.com — the delivery half, and three attributions corrected

The fourth thread, delivery, is almost entirely other people's work. **Published Interface** (2003) is the parent of two separate rules here: the finding that an async channel's schema is an API nobody declared, and the repo-topology test — a second repository is bought at the moment a caller exists whom your commit cannot reach. **MonolithFirst** (2015) supplies the evidence for defaulting to one runnable unit — the evidence, not the rule: the method reaches that default by its own stop rule and says outright that it is not a monolith-first preference. **CQRS** (2011) and the four event-driven patterns (2017) are owed alongside it, CQRS with Fowler's own caution attached. The method paper names none of the three; this page is where they are cited.

Adopted whole as named deliverables: the **strangler fig**, **branch by abstraction**, **parallel change**, **canary**, **blue-green**, and a four-category feature-flag taxonomy whose *ops toggle* closed a real gap — it is what gives the degradation ladder an actuator.

**Three attributions had to be corrected, and they are commonly got wrong.** Parallel change and canary release are **Danilo Sato's**; the flag taxonomy is **Pete Hodgson's**; consumer-driven contracts is **Ian Robinson's**. All three are hosted on martinfowler.com, and none of them was written by Fowler. Citing the domain rather than the author is exactly the kind of error this page exists to catch — and I had made it three times.

And one boundary worth stating: most of *Patterns of Enterprise Application Architecture* sits **below** this method's floor. Those patterns implement a processor or a store; they do not decide whether you need one.

### 14 · Barry O'Reilly — the stress pass, adopted in parts and said so

*Residues: Time, Change, and Uncertainty in Software Architecture* (Leanpub, 2024). A debt incurred deliberately by adoption: the method's step 07 now carries his stressor analysis and incidence matrix as **the stress pass**, landed at V4.6 after the limited LLM demonstration described in the evidence summary.

**Owed:** stress-first discovery — perturb the context and watch what survives, which can suggest requirements an earlier interview missed · residues that are business processes rather than software · **hyperliminal coupling** as a named, mechanical instrument for the failures that stay invisible until the stressor hits · the residue-as-option cost discipline, where exploration is never filtered by cost and implementation always is · the **attractor** vocabulary, which gives the degradation ladder's rungs their name from the other side — a rung is a designed attractor · and the held-out empirical check.

**Not taken, and said plainly:** the revolutionary posture — requirements engineering “must die” — where this method keeps elicitation primary and uses stress to discover what it missed · the claim that tolerances are discoverable *only* by simulation, which is §05's sixth argument · the probability ban outside stressor work — the demand arithmetic keeps its numbers · and statistics asserted but deferred to a future volume. The graded table's ladder row survives intact: no per-client-class, client-visible, ranked ladder appears in his book.

### 15 · NISO — names with a declared meaning {#niso}

[ANSI/NISO Z39.19-2005 (R2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*](https://www.niso.org/publications/ansiniso-z3919-2005-r2010). The method already asked which architectural role a component played. It did not ask systematically whether the client, the API and the diagram meant the same thing by its name.

**Owed:** terms selected from domain, user and organisational usage (§§5.3.5, 6.6.1); qualifiers and scope notes for ambiguous or overlapping meanings (§6.2); preferred forms and meaningful compounds (§§6.3, 6.6, 7.4–7.8); explicit kinds of relationships (§§8.2–8.4); and testing and change history (§§11.2–11.3). The supplied edition was checked directly for this addition. V4.13 carries those rules through client language, data, surface contracts and review in the [naming discipline](method.html#naming).

**The adaptation has a limit.** NISO concerns indexing and retrieval, where near-synonyms or broader terms can sometimes stand for other concepts (§§8.2.3–8.2.4). An API must preserve any distinction that changes its behaviour: *accepted* cannot silently become *completed*. Keeping responsibility, architectural role and product separate, and treating a changed public meaning as a compatibility question, are TEOB applications. The document supplies neither an API spelling convention nor proof that a name's implied guarantee holds.

### Also owed, briefly

::: meta
**KAOS** (van Lamsweerde) — the system boundary as an *output* of responsibility assignment; anti-models giving the attacker its own machine, which is the formal version of “adversaries are clients too”; and the split of assumptions from domain properties, which is the provenance idea<br> **ZAVE & JACKSON** — `S, K ⊨ R`, the formal ancestor of the trace step<br> **FIELDING** ch. 5 — REST derived from the null style one constraint at a time, each with its induced property *and* its cost. The best-known worked example of constraint-first derivation in the field<br> **IMPACT MAPPING** (Adzic 2012) — actors first, and a deletion rule in nearly the method's words: a deliverable that supports no impact “should be treated as a problem, enhanced or removed”<br> **TYREE & AKERMAN** (2005) — the ADR template's *related requirements* field, with the rule “if a decision doesn't contribute to meeting a requirement, don't make the decision”<br> **GSN** (Kelly & Weaver) — first-class Assumption and Justification nodes, and the line the trace step exists to prevent: “it is possible to possess a document called the Safety Case and for there to be no safety case”<br> **COCKBURN, C4, GLOBAL ANALYSIS, ISO 42010** — boundary-and-actors first, in four more traditions<br> **KLEPPMANN, KREPS** — the truth store with rebuildable derived views around it: *Designing Data-Intensive Applications*, “Turning the Database Inside Out”, and “The Log”. The method paper's lineage opens with them, and this page had never said so<br> **THE SRE WORKBOOK** — the service-level objective and its error budget, which turn reliability from an argument into arithmetic. What the method adds is where the objective comes from: a client's tolerance, promoted
:::
:::

::: mod {#graded tab="03 · GRADED"}
## Device by device, honestly graded

::: lede
Seven signature devices. Two are owned outright by prior art, three are refinements, and two seem to have no owner in this form. One of the refinements — the coupling read — has an owner for its concept and none that I could find for its instrument, which is why §04 counts three. I graded harshly on purpose — a reader who finds the grading generous will not trust the rest of the page, and would be quite right not to.
:::

| Device | Grade | Who owns it, and what is left |
|---|---|---|
| **Bidirectional traceability**<br>[uncited mechanism = investigate]{.meta} | <span class="grade g-owned">owned</span> | QFD (1972), Suh’s design matrix, CMMI, FDA, DO-178C and NASA all precede this method. Outside-In uses the trace to audit mechanism obligations and missing requirements. The comparison supports a practical formulation, not a novelty claim over architecture or safety practice. |
| **The deletion test**<br>[name the obligations its removal leaves unsupported]{.meta} | <span class="grade g-owned">owned</span> | TRIZ trimming, Ideal Final Result, value engineering, Suh's redundant design, Impact Mapping, Tyree & Akerman. **Left:** the counterfactual phrasing, and the anchor being an *external constraint* rather than a surviving function. A phrasing contribution. |
| **Two-pass arithmetic**<br>[demand before, capacity after]{.meta} | <span class="grade g-part">refinement</span> | SPE steps 6/7, operational analysis, NASA resource budgets and margins, LRFD demand-capacity, Manual J before Manual S. **Left, and it is real:** making pass one a *gate* on technology selection, plus the epistemic argument that capacity is uncomputable before the graph exists. |
| **Provenance labels**<br>[measured / contractual / assumed]{.meta} | <span class="grade g-part">refinement</span> | KAOS's domain property vs. hypothesis, GSN Assumption nodes, ATAM non-risks, NASA TBD/TBR-with-rationale, AACE estimate classification, AIAA mass-growth-allowance-by-maturity. **Left:** a three-label scheme cheap enough to actually use, with automatic promotion of *assumed* into the risk register. |
| **The coupling read**<br>[count the requirements naming one mechanism]{.meta} | <span class="grade g-part">refinement</span> | Suh’s design matrix precedes this use of shared dependencies. A trace-column count is a cheap prompt to inspect failure modes. It neither predicts which promises fail together nor ranks severity; one life-critical obligation can dominate many low-impact ones. |
| **Degradation ladder**<br>[six client-visible rungs, per class]{.meta} | <span class="grade g-new">largely new</span> | Google SRE has four criticality levels and names degraded responses; aviation has a five-level externally-defined severity ladder; Shelton & Koopman formalised graceful degradation as utility across configurations. **No six-rung, client-visible, per-client-class ladder found.** Two rules appear original: a rung is a client-visible *outcome*, not an internal action — “circuit breaker opens” is a mechanism, not a rung — and the last rung must still be a correct, diminished answer. [Note: Nygard supplies the mechanisms and no ladder; the method paper previously mis-credited him.]{.meta} |
| **Acknowledgement taxonomy**<br>[receipt / reservation / completion]{.meta} | <span class="grade g-new">the use is new</span> | The *taxonomy* is Helland's tentative/cancelling/confirming. **The use is not.** See §04 — this is the strongest thing in the method. |

{cols="22% 13%"}
:::

::: mod {#own tab="04 · MINE"}
## Three combinations compared with the sources reviewed

::: lede
None of them is the one you would expect, and the asymmetry is worth noticing. The deletion test is the memorable device, and it is the *most* owned — TRIZ had it, with a better slogan. The acknowledgement inference takes a definition, a figure and one paragraph of step 03, and it is the least owned. Absence of evidence is not proof, so each of these is stated as *I looked and did not find it* — a weaker claim than novelty, and a rather more honest one.
:::

#### 1 · The acknowledgement kind helps scope strict coordination

Helland's triad is a transaction-protocol construct: it describes how a distributed operation is staged. Outside-In uses it for something else entirely — as the **sizing rule for the strictly-consistent store**:

<blockquote>Retain every irreducible input needed to reconstruct the promised state. Choose consistency and coordination from the write acknowledgements, view contracts and invariants. Authority and strictness are separate properties.<cite>The Outside-In Method, step 03, V4.12</cite></blockquote>

The earlier formulation wrongly made authoritative storage depend only on acknowledgement kind. Follows, ownership and policy inputs remain truth even if their writes need only a receipt. The useful question is narrower: which operation actually needs strict coordination, over which scope?

::: own
Use this as a design question, with a complete input inventory and a protocol argument. The reviewed literature does not establish an exclusive origin or a measured time saving.
:::

#### 2 · The degradation ladder as a client property

The rungs themselves are folklore; the discipline around them is not. Two rules survived the search: that a rung must be stated as a **client-visible outcome** rather than an internal action, and that the **last rung must still be a correct, if diminished, answer**. Together with the per-class acceptable set — the observation that “partial” is fine for a feed and poison for a ledger export — they turn a list of resilience tactics into a derivation.

#### 3 · The coupling read — a column nobody counts

The coupling count prompts a failure-mode review of shared mechanisms. Three cited requirements do not mean three promises necessarily fail together: redundancy, fallback and the particular failure matter. Zero citations mean no recorded reason; establish whether the requirement or rationale is missing before deleting an existing component.

It costs nothing, because the artifact already exists. And it comes with a rule that matters more than the device: **the count is a measurement, not a target.** A store derived from a coupling number rather than from a constraint outside the system is an uncited mechanism, and the first rule deletes it — that would be the third reading used to break the first.

::: own
Worth recording how it was found, because it is not flattering — and it is instructive. It did not come out of the literature, or out of the backlog, where it had sat unresolved for weeks. It came from noticing that the sentence on the front page of this method was wrong — a sentence I had, of course, written myself.
:::

#### And the ordering, which is the method itself

The contribution proposed here is a compact working discipline: boundary-first enumeration, two arithmetic passes and a reverse audit of mechanism obligations in one inspectable record. Those elements have precedents. The sources reviewed support comparison, not the universal claim that nobody combined them before.
:::

::: mod {#against tab="05 · AGAINST"}
## The six best arguments against all of this

::: lede
Not the usual objections — the strong ones, each with a citation, collected because a method that cannot state them has not been reviewed, only admired. Three of them narrowed the claim. One removed it. One described what the method actually maintains better than the method did. And the sixth arrived in 2026 carrying a full method of its own, and I answered it by adoption rather than by defence. What each one *changed* is in §06; what each one *is* is here, in the proponent's own words wherever the wording matters.
:::

#### 1 · Nobody has ever derived a system, and the people who claim otherwise are faking it

<blockquote>“The picture of the software designer deriving his design in a rational, error-free way from a statement of requirements is quite unrealistic. <b>No system has ever been developed in that way, and probably none ever will.</b>”<cite>Parnas &amp; Clements, “A Rational Design Process: How and Why to Fake It,” 1986</cite></blockquote>

Their reason six is Outside-In's own premise, conceded and then dismissed: designers are burdened by preconceived ideas, “invented, acquired on related projects, or **heard about in a class**.” Their conclusion is not *so derive properly*. It is *so fake it* — produce the documentation as if the process had been rational, because the artifact is what matters.

::: verdict
**Agreement, not conflict.** Parnas is *in favour* of faking it; his complaint is that people fake it badly, or not at all. Outside-In says what the fake has to contain for the result to be attackable. It makes no claim about how the design was found.
:::

#### 2 · The requirements do not exist yet, so there is nothing to derive from

Brooks: clients do not know what they want, and it is impossible to specify requirements completely before having built and tried some versions. Dorst & Cross established empirically that problem and solution **co-evolve** — the problem is discovered *through* solution attempts. Guindon: top-down decomposition “appears to be a special case for well-structured problems when the designer already knows the correct decomposition.”

::: verdict
**Correct, and it is why the artifact is a model rather than a plan.** Nobody plans an information system upfront; the target moves and stays vague. What Outside-In maintains is a *current description* — surfaces, channels, processors, stores, failures, and the attributes each must satisfy. When a new surface appears or a tolerance moves, it is **analysed against that description** and the description evolves. Co-evolution is not a problem for a model; it is what a model is for.
:::

#### 3 · Solution-first is what expertise looks like, and it wins

Lawson's block study: scientists were problem-focused, architects solution-focused — and the architects performed better on the design task. Ball, Ormerod & Morley measured it: experts generate *more* analogies than novices and skew schema-driven. Cross: “designers tend to use solution conjectures as the means of developing their understanding of the problem.” On this evidence component-first is documented expert behaviour, not a pathology. And the pedagogy runs the same way — Kirschner, Sweller & Clark find half a century of evidence that minimally guided instruction loses.

::: verdict
**Conceded entirely, and it costs nothing.** Reach for the pattern — that is what expertise is for. Then walk it back to a constraint, and delete it if it cannot make the walk. The method governs the *record*, not the reach — which is also why it gets along with worked examples rather than opposing them.
:::

#### 4 · Simon refutes the falsifiability test as the method states it

The sharpest one, from the source the method is effectively named after. One page after the inner/outer-environment passage:

<blockquote>“In one way or another the designer insulates the inner system from the environment, so that an invariant relation is maintained between inner system and goal, independent of variations over a wide range in most parameters that characterize the outer environment… <b>It is an important property of most good designs.</b>”<cite>Simon, <i>The Sciences of the Artificial</i>, 3rd ed., ch. 1</cite></blockquote>

Simon also notes the outer environment *underdetermines* the inner — “airplanes and birds, dolphins and tuna fish, weight-driven clocks and battery-driven clocks.” A design that survives a change in its inputs may be **homeostatic rather than untethered**, which is precisely what the method's headline test forbade. Rittel & Webber go further: solutions to wicked problems “are not true-or-false, but good-or-bad.”

::: verdict
**Conceded — and this one did not change the method, it removed a claim from it.** The headline test was wrong as written, and the eventual answer was not to restate it but to retire it and replace the thesis underneath. Simon is the reason the strongest-sounding sentence in this paper is the one that had to go. See [§06](#answer).
:::

#### 5 · Design rationale capture always fails — and there is forty years of evidence

Conklin & Begeman confessed it in 1988: the cognitive overhead of segmenting thought into typed, labelled, linked nodes “is prohibitive.” MacLean et al. admitted their claims “serve as goals rather than objectives we have achieved.” Horner & Atwood enumerate the barriers, including the fatal one: **the person paying the capture cost is never the person reaping the retrieval benefit.** The arc gIBIS → QuestMap → Compendium → abandoned is the empirical record, and the one practice that survived — Markdown decision records in the repository — did so by abandoning the typed graph.

::: verdict
**The method would join that graveyard if it were capturing rationale. It is not.** Those systems recorded *decisions and the arguments about them* — an append-only archive that grows with every meeting, stales continuously, and is searched by nobody. Outside-In maintains a **bounded description of the system in typed roles with attributes**. It does not grow with decisions; it changes when a constraint changes. It is not an archive to be excavated, it is a model to be reasoned against.
:::

**And the payoff is a decoupling that survives the implementation.** “Postgres” is not architecture. *A store that must hold these invariants, serve these query shapes, at this size, with this consistency, under this lifecycle* is architecture — and Postgres is one thing that currently satisfies it. Everything has a rationale whether or not anyone wrote it down; what the method records is not why a decision was made but **what role the thing plays and what it must satisfy to keep playing it**.

Write it the first way and every change is a rewrite, because nothing states what the component was for. Write it the second way and the store can be split, migrated or replaced the moment the constraints move — and a proposed change can be checked against the description before anyone touches code. That is the difference between an archive of past reasoning and a working model of the present system, and it is why the capture cost is paid by the same person who collects the benefit.

#### 6 · The tolerances you elicit are the ones nobody needed to tell you — the real ones cannot be interviewed out

Residuality theory's claim, and the strongest form of an argument this page already carried: O'Reilly holds that non-functional requirements *“simply don't exist in a way that is discoverable by any other means than random simulation”*, and he cites Parnas 1986 approvingly — this is the Parnas objection grown into a full method, with an instrument attached. Taken whole, it deletes step 01's demand half: clients signing tolerances is exactly what he says cannot work.

::: verdict
**The stress pass supplements elicitation.** The recorded demonstration used LLM analysts on a constructed ticket-booking design. Several runs found reversal and hold-abuse gaps; earlier prompts exposed hints, one purportedly blind run was voided for inherited context, and the isolated run did not reproduce the registered seat-map read–commit diagnosis. This is evidence that the exercise can generate useful review findings. It does not establish superiority over other reviews, analyst independence in general, or a year of saved discovery. The [evidence summary](evidence/stress-demonstration.html) states those limits and the negative result.
:::
:::

::: mod {#answer tab="06 · CHANGED"}
## What those arguments actually changed

::: lede
This section used to list two repairs the objections forced, and mark them both *pending*. Both have since landed, and one of them did rather more than repair anything — it removed the paper's headline claim outright. It is written in the past tense now, because a foreword that keeps its own outstanding work in the present tense is one nobody has finished.
:::

### The falsifiability claim was not repaired. It was retired.

The original headline was *if the requirements change and the design doesn't, the design was decoration.* Simon refutes it directly — insulating the inner system from variation in the outer environment is “an important property of most good designs” — and Rittel undercuts the vocabulary beneath it.

My first attempt at a fix moved the claim from discovery to justification, and **that was the wrong repair.** I am recording it as a mistake rather than quietly dropping it: I answered a philosophical objection by retreating further into philosophy of science, when the actual problem was that the claim had been academic in the first place. A method whose whole point is getting down to what is true on the ground should never have had a thesis only a methodologist could evaluate.

What replaced it is not a repair but a different claim: **a system is governed by the model its engineering and business halves both hold**, and the method's job is to make that model expressible in terms both can hold. Furniture stops being an epistemic failure and becomes a recurring charge against a budget somebody signed — a sentence the funding side of the table can act on. Landed in method §01 at V3.8; the parent of the replacement turned up later and is [debt 12](#debt12).

::: verdict
**The strongest objection on this page killed the strongest sentence in the paper.** That is the most useful thing the counter-case did, and the reason this section is worth keeping now that nothing in it is pending.
:::

### The self-derived requirement was adopted — as a search order, not a menu

Franke's boiler-feed-pump cascade is the concrete problem: choosing a multi-stage centrifugal pump *creates* the subfunction “prevent axial thrust,” which creates “provide lubrication,” which creates “control the closed cooling cycle.” None of them traces to a client requirement; every one is induced by the solution. Gero states it formally — there is no direct transformation between function and structure. Suh concedes it: essential functional requirements can be solution-neutral, derived ones cannot.

The resolution, landed at V4.2, was not a new rule but an admission: **the citation rule had always been recursive and had never said so.** A mechanism may cite a decision rather than a constraint, and the decision it names is itself a mechanism facing the same test. Three dispositions, worked as a **search order** and not a menu — delete · surface a missing requirement · declare self-derived, naming the parent. It is not a loophole, because nothing partitions itself: naming a parent moves the obligation up a level rather than discharging it, and the recursion ends at a sentence about somebody outside the system — a client, or the organisation that has to run it — or it ends nowhere.

The consequence for reviews is the part worth keeping. **A five-deep chain standing on one ungrounded adjective is a single finding at the root** — not five findings against mechanisms that were each derived perfectly well from the one above them.

### The rationale-capture graveyard produced the amendment rule

Objection 5 needed designing around rather than answering, and the design is now in the paper. Because the record is a description of *roles and attributes* rather than an archive of decisions, a change in the world does not invalidate it — it expires a **sufficiency claim**. The store was never wrong. The claim that *this particular product* suffices to play it is what died.

Method §06 states the rule as *amend, do not re-derive*, and the table there has a third column that is the actual saving: what the change explicitly does **not** touch. Forty years of abandoned rationale-capture tools failed because the person paying the capture cost was never the person reaping the retrieval benefit. Here they are the same person, in the same week, because the artifact is what you reason against before you touch code.

::: own
V4.12 corrects the deletion test, separates authoritative inputs from strict consistency, and narrows the coupling and evidence claims. The readings here remain a lineage account with stated verification limits; they do not certify the method’s completeness.
:::
:::

::: mod {#reading tab="07 · READING"}
## Sources

::: lede
Verified against primary sources, except where marked. Free where noted — a surprising amount of the closest prior art costs nothing at all.
:::

### The closest ancestors

::: meta
Jackson, M. “The World and the Machine.” ICSE 1995 — **free PDF**, and the one to read first<br> Jackson, M. *Problem Frames.* Addison-Wesley, 2001<br> Zave, P. & Jackson, M. “Four Dark Corners of Requirements Engineering.” *ACM TOSEM* 6(1), 1997<br> DeMarco, T. *Structured Analysis and System Specification.* Yourdon Press, 1978 · Gane & Sarson, 1977<br> Shostack, A. “Experiences Threat Modeling at Microsoft.” MODELS 2008 — **free PDF**<br> Suh, N.P. *The Principles of Design.* Oxford UP, 1990 · purchasable substitute: *Design Engineering and Science*, Springer<br> Helland, P. “Life beyond Distributed Transactions.” CIDR 2007 — **free**<br> Smith, C. & Williams, L. *Performance Solutions.* Addison-Wesley, 2001 — ch. 2 free<br> NASA. *Systems Engineering Handbook*, NASA/SP-2016-6105 Rev2 — **free PDF**; §6.2 and Appendix C<br> van Lamsweerde, A. & Letier, E. “Handling Obstacles in Goal-Oriented RE.” *IEEE TSE* 26(10), 2000 — free<br> [ANSI/NISO Z39.19-2005 (R2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*](https://www.niso.org/publications/ansiniso-z3919-2005-r2010) — term scope, choice, relationships and maintenance; §§5.3.5, 6–8, 11.2–11.3<br> Fielding, R. Dissertation ch. 5, 2000 — **free**
:::

### The counter-case — read before publishing

::: meta
Parnas, D. & Clements, P. “A Rational Design Process: How and Why to Fake It.” 1986<br> Simon, H.A. *The Sciences of the Artificial*, 3rd ed., MIT Press, 1996 — ch. 1, pp. 5–9<br> Rittel, H. & Webber, M. “Dilemmas in a General Theory of Planning.” *Policy Sciences* 4(2), 1973<br> Dorst, K. & Cross, N. “Creativity in the design process: co-evolution.” *Design Studies* 22(5), 2001<br> Kirschner, Sweller & Clark. “Why Minimal Guidance During Instruction Does Not Work.” *Educational Psychologist* 41(2), 2006<br> Horner, J. & Atwood, M. “Effective Design Rationale: Understanding the Barriers.” Springer, 2006<br> Motte, D. “A Review of the Fundamentals of Systematic Engineering Design Process Models.” DESIGN 2008 — free; via it, Franke's pump cascade
:::

### Flagged — do not cite without checking

::: meta
**Gotel & Finkelstein** cannot be cited for the orphan rule — it is a pre-RS traceability study<br> **“ADD 1.0 tech report”** does not exist; the ancestor is CMU/SEI-2000-TR-001<br> **DO-178C** itself is paywalled; the objective wording above comes from NASA/Jacklin, not the standard<br> **Sio, Kotovsky & Cagan (2015)** effect sizes are paywalled and publisher-elided — direction only<br> **Pahl & Beitz §6.2** exact English wording unverified; the concept is attributable via Murphy et al., *ASME JMD* 136(10), 2014
:::
:::

::: memostrip
## The lineage in ten lines

::: grid3
::: cell
the primitives are Gane & Sarson, 1977<br>the traceability is QFD, 1972<br>**the arithmetic is SPE, 2001**
:::

::: cell
the deletion test is TRIZ<br>the acknowledgements are Helland<br>**the critique is Jackson, 1995**
:::

::: cell
the shared model is Johnson's<br>the delivery half is Fowler, Sato and Hodgson<br>**what is left is the order**<br><span style="color:#9BA4B2">— and three devices with no owner found</span>
:::
:::
:::

::: p {style="margin-top:22px;max-width:84ch"}
Many thanks to everyone in §02 — most of them will never know they are on this page — and to Simon and Parnas in particular, for the two objections that cost me the most and paid back the most. If you have read this far, you know what the method stands on and what it does not get to claim. [The method itself](method.html) is one link away, and the [book](book/index.html) is its readable form. Hope you've enjoyed the walk!
:::

::: meta {style="margin-top:22px"}
FOREWORD · V11 · NAMES AND THEIR CONTRACTS · 2026-10-12 · derived from three prior-art research passes (software architecture & RE · engineering design methodology · design-fixation evidence) and one adoption gate run twice, read against **The Outside-In Method V4.13**.<br> The NISO addition was checked against the supplied 2010-reaffirmed edition. Other source comparisons inherit the original reading notes. This revision narrows universal absence and novelty claims; it does not independently reverify the entire bibliography. The stress demonstration has the limits recorded in the linked evidence summary.<br> Published by Lambda House under the [MIT licence](LICENSE).
:::
