---
kind: "derivation"
title: "Eight derivations"
stamp: "DERIVATIONS · INDEX · V1.6 · 2026-10-30 · EIGHT DEVICES · APPLIES THE OUTSIDE-IN METHOD V4.14"
subtitle: "**Eight devices, each illustrated on the systems where it bites.** Organised by what the method does, not by whichever system it happens to be doing it to — the device is the transferable part, and the system is only the evidence."
html_title: "Eight derivations · Outside-In Derivations"
meta:
  - "og:type": "website"
  - "og:site_name": "TEOB · The Outside-In Method"
  - "og:title": "Eight derivations"
  - "og:description": "The Outside-In Method organised by what it does — the division, the stop rule, the invariant, the channel — each illustrated where it bites hardest."
  - "og:url": "https://teob.cc/method/derivations/"
  - "og:image": "https://teob.cc/method/og.png"
  - "og:image:width": "2400"
  - "og:image:height": "1260"
  - "og:image:alt": "The best system designs are signed twice — the three-part contract: the business supplies the operating envelope, both sign the tolerances, engineering owns the graph."
  - "twitter:card": "summary_large_image"
  - "twitter:title": "Eight derivations"
  - "twitter:description": "The Outside-In Method organised by what it does — the division, the stop rule, the invariant, the channel — each illustrated where it bites hardest."
  - "twitter:image": "https://teob.cc/method/og.png"
---

::: toc
[Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html)
:::

::: mod {tab="THE EIGHT"}
::: kick
Outside-In · derivations · applies the method V4.14 · each piece includes a scoped naming application
:::

## Eight derivations

::: lede
The problems here are the standard ones — a rate limiter, a feed, a booking system, a photo service — because everyone has already argued about them, which makes them useful evidence and rather poor structure. Sort them by *system* and you get a catalogue you read once. Sort them by **device** and you get something you can apply on Thursday, to a design that resembles none of them. Each piece below states one rule, proves it on one to three systems, and closes with the general form.
:::

::: scroll
| № | The device | Proved on | The rule, in one line |
|---|---|---|---|
| {.num} 01 | [**The division**](01-the-division.html) | a rate limiter, in two published treatments | Compute what one node serves before deciding you need many — and record the ratio between demanded and supplied |
| {.num} 02 | [**The stop rule**](02-the-stop-rule.html) | a classifieds marketplace · a social feed | If one node does it, say so out loud and stop. A cluster sized for a dozen writes a second is evidence the store was chosen wrongly |
| {.num} 03 | [**The missing root**](03-the-missing-root.html) | a key-value store · a friend-graph feed | Follow every chain of mechanisms to its root. If the root is an adjective, the chain is unanchored — and every figure you collect must name the step that consumes it |
| {.num} 04 | [**The invariant**](04-the-invariant.html)<br><span style="font-size:11.5px;color:var(--ink2)">and the organisation behind it</span> | a room-reservation system | An enforcement protocol over each invariant's whole contended scope; every zero-tolerance promise owes a counter; the people who clean up after it are design inputs |
| {.num} 05 | [**The acknowledgement**](05-the-acknowledgement.html)<br><span style="font-size:11.5px;color:var(--ink2)">and where the code runs</span> | a photo-sharing service | Receipt, reservation or completion — the weakest one the client can live with scopes strict coordination; authority is decided separately. Placement is an organisation question as often as a performance one |
| {.num} 06 | [**The projection**](06-the-projection.html)<br><span style="font-size:11.5px;color:var(--ink2)">and its contract</span> | prefix autocomplete · a CDN · a ranking board | Every derived store declares its source, its staleness bound and its rebuild path; every approximation owes an error bound; not every aggregate can be merged |
| {.num} 07 | [**The clients you did not name**](07-the-client-classes.html) | a notification service · <span style="font-size:11.5px">a batch auditor, as a sidebar</span> | Enumerate the callers with quotas, tolerances and a shed order. Adversaries are a class; your dependencies are client relationships reversed |
| {.num} 08 | [**The channel**](08-the-channel.html)<br><span style="font-size:11.5px;color:var(--ink2)">and what it may be trusted with</span> | a messaging app under end-to-end encryption | Eight properties per edge, and a ninth it inherits. Effectively-once is a consumer protocol — key, effect and saved result committed atomically, or an idempotent effect — not a broker feature; and a connection tier is a membership problem before it is a capacity one |

{cols="5% 24% 26%"}
:::

### How they cover the method

The ten steps run in four phases. The eight pieces are not spread evenly across them — and pretending otherwise would be exactly the thing this method tells you not to do:

::: scroll
| Phase | Steps | Covered by |
|---|---|---|
| **I · Outside** | outside · load | **Well.** Pieces 01, 02, 03 and 07 are all fundamentally about the two steps everyone skips — and 04, 05 and 07 carry the supply half that the first of them is supposed to bring in |
| **II · Shape** | data · storage & transport · trust · derivation | **Well.** Pieces 04, 05, 06 and 08 between them cover invariants, acknowledgements, derived state and channels |
| **III · Reality** | failure · runtime · operations | **Thinly.** Degradation appears inside 01 and 03, a host's departure inside 08, and operations mostly as the counter that a zero-tolerance promise owes. No piece takes failure as its primary device |
| **IV · Proof** | trace | **By one piece.** The rule in 03 is this step's three dispositions, and its chain read to the root. Everywhere else the trace is the closing move of a piece rather than a piece of its own |

{cols="22% 30%"}
:::

::: note {data-l="WHAT THIS TELLS YOU"}
Phase III is thin and Phase IV rests on one piece, and for the same reason: published design problems end at the diagram. They rarely say what the system still promises when a tier is gone, almost never say who gets woken up, and treat operations as a wrap-up talking point. That is a gap in the evidence base, not in the method — and it is the clearest argument for carrying the remaining phases on examples chosen for the purpose, rather than inherited from someone else's chapter list.
:::

### Names carried through the argument

Each piece now adds a small application of [the method's naming discipline](../method.html#naming): units and scope in 01; capability names in 02; root terms and relationships in 03; invariant states in 04; acknowledgements and caller knowledge in 05; authority and projections in 06; client roles in 07; channel names and semantic compatibility in 08. These are new TEOB examples, separate from the inherited readings of Tan and Xu. They do not add accusations about those books.

Choose terms from demonstrated usage, define nearby concepts and record aliases within the relevant scope. This is not a demand for one vocabulary across every domain, or for cosmetic renaming of published contracts. Retrieval may group near-synonyms or broader and narrower concepts; executable contracts must preserve distinctions that change outcomes, rights, retry behaviour or compatibility. A name exposes an obligation and never proves it. Proposed reader checks remain unperformed unless evidence is recorded.

Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*. TEOB adapts its guidance on usage (§§5.3.5, 6.6.1), scope and history (§§6.2.1–6.2.3), compounds (§§6.3.1, 7.4–7.5, 7.8), abbreviations (§6.6.3), equivalence and relationships (§§8.2–8.4), and evaluation and maintenance (§§11.2–11.3). The retrieval-specific near-equivalence in §§8.2.3–8.2.4 is explicitly limited here; this is not an API standard or a conformance claim.

### How to read them

- **Each piece is self-contained.** One file, one device, the evidence, the general form. Start anywhere — 01 and 02 are the cheapest way in.
- **The systems are evidence, not subjects.** If your problem is not a rate limiter, piece 01 still applies — the transferable part is the division and the ratio, and the rate limiter is just where the failure is easiest to see.
- **Numbers are recomputed, not quoted.** Where a published treatment states a figure, it was divided again before it appears here — and where the two disagree, the disagreement is the finding.
- **These eight supersede an earlier chapter-by-chapter series.** That series ran one system through all ten steps, in the order a published treatment presented it. It served its purpose — most of the evidence below was found there — and it stays as working material rather than published, because someone else’s chapter list is the wrong spine for this.
:::

::: footer
DERIVATIONS · INDEX · V1.6 · 2026-10-30 · APPLIES THE OUTSIDE-IN METHOD V4.14.
These are worked arguments, not empirical validation of the method. Each piece identifies its reported source and the limits of verification. A trace or a plausible calculation is an obligation to test, not evidence of a running system.
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE) · source: [github.com/teob-cc/method](https://github.com/teob-cc/method).
:::
