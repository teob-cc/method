---
kind: "derivation"
title: "The missing root"
stamp: "DERIVATION 03 · V1.4 · 2026-10-12 · THE OUTSIDE-IN METHOD V4.13"
number: "03"
subtitle: "**A key-value store and a social feed.** One derives eight mechanisms from an adjective. The other asks exactly the right two questions, writes the answers down — and then never divides by either. Both are failures of the same joint."
html_title: "The missing root · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="03 · THE MISSING ROOT"}
::: kick
The systems · a distributed key-value store · a friend-graph feed
:::

## The missing root

::: lede
Every mechanism must cite a requirement. The rule has an obvious hole, and most designs fall straight into it: a mechanism can cite another *mechanism*, and that one can cite a third, and if you follow the chain far enough it reaches either a sentence about a client or nothing at all. Chains that reach nothing are the commonest structural defect in system design writing — and they are invisible one link at a time, because each step looks perfectly reasonable, and each step *is* perfectly reasonable given the one before it.
:::

::: rule
A mechanism that cites no client constraint takes the first disposition that applies — a **search**, not a menu. ① **Delete**: nothing sits above it. ② **Surface a missing requirement**: tracing it lands on a client constraint that was always true and never written down. ③ **Declare it self-derived, naming the parent decision** — and the parent now faces the same test. Citations chain; the recursion ends at a client constraint, or the finding sits at the root. And at the other end of the same joint: every figure you elicit must name the step that will consume it.
:::

::: note {data-l="WHY THIS IS NOT A LOOPHOLE"}
At first sight disposition ③ is an escape hatch — justify anything by saying the thing above it needed it. It is not, because nothing partitions itself: a partitioned store was bought by a volume that did not fit one machine, a leader with elections was bought by clients who tolerate no maintenance window. Naming the parent does not discharge the obligation — it moves the obligation up one level, where it gets asked again. **The chain terminates at a sentence about a client, or the finding sits at the root — and it is one finding, not one per link.**
:::

### Evidence A · the store with no caller

::: sys
#### The chain

**Eight mechanisms, five levels deep — and one finding.** Every link is correctly derived from the one above it — which is exactly why reading them one at a time finds nothing wrong. High availability, stated with no figure and no owner, buys replication over N nodes, placed around a ring by consistent hashing. Replication makes replicas diverge, which buys quorum. Quorum blocks under failure, which buys gossip membership to see the failure, a relaxed quorum to write around it, and a hand-back protocol for what the relaxed quorum left in the wrong place. A replica that never returns cannot be handed anything, which buys an anti-entropy repair over hash trees. Concurrent writes conflict, which buys version vectors, which grow without bound and get truncated — and truncation breaks the very ancestry detection the vectors existed for. The chain terminates not in a requirement, but in the observation that a large operator has not hit the problem in production.

**Nowhere in twenty-three pages is anyone asked whether a stale read is acceptable.** The choice is made by taxonomy instead: the consistency-availability trade is presented, stores get sorted into categories, and the recommendation follows from what two well-known products chose for *their* callers. And meanwhile the same requirements list asks for tunable consistency — which is the correct answer, it just belongs to the caller, per key class.

#### Name a caller and most of it deletes itself

::: scroll
| Mechanism | Internal metadata store<br><span style="font-weight:400">read-your-writes; reject under partition</span> | Shopping cart<br><span style="font-weight:400">never reject a write; app merges siblings</span> | Fragment cache<br><span style="font-weight:400">loss acceptable</span> |
|---|---|---|---|
| Consistent hashing | {.ok} keep | {.ok} keep | {.ok} keep |
| Replication over N | {.ok} keep | {.ok} keep | {.num} delete |
| Quorum | {.ok} keep, strict | {.ok} keep, W=1 | {.num} delete |
| Version vectors | {.num} delete | {.ok} keep | {.num} delete |
| Relaxed quorum | {.num} delete | {.ok} keep | {.num} delete |
| Hand-back on recovery | {.num} delete | {.ok} keep | {.num} delete |
| Anti-entropy repair | {.ok} keep, smaller | {.ok} keep | {.num} delete |
| Gossip membership | {.ok} keep if large | {.ok} keep | {.num} delete |
:::

**Read the columns.** The metadata caller deletes three and shrinks a fourth. The cache deletes seven and leaves a hash ring — a completely reasonable thing to have designed. The cart keeps all eight, because the cart is the caller these mechanisms were originally built for. The treatment reproduces that answer faithfully without ever stating the question — and a reader who applies it to the first column ships three mechanisms they will operate forever and never need, and a fourth larger than it has to be.

::: warn {data-l="THE TELL"}
The relaxed quorum is the sharpest instance. It exists to make the cart's rung reachable — always accept a write — and it makes the metadata store's rung *un*reachable, because a store that always finds somewhere to write can never tell you it lacked quorum. It is recommended universally. That is not a defect in the mechanism — it is a mechanism installed without asking which rung the caller wanted.
:::
:::

### Evidence B · the feed that asked and did not listen

::: sys
#### Two questions, correctly asked

The treatment's opening dialogue does the right thing, twice. It asks for the traffic volume — ten million daily active users. It asks how many friends a user may have — five thousand. And then neither number appears again in eleven pages. What follows is a fan-out service, a graph database, a hybrid push-and-pull model for users with many followers, a hot-key remedy and a five-layer cache tier, with no arithmetic anywhere.

#### Divide, and the second answer deletes the deep dive

Fan-out cost is posts multiplied by *mean* friends — and the treatment elicited the **cap**. The cap is the tail; the mean is the bill:

::: scroll
| Posts per user per day [assumed]{.prov} | Posts/s | Mean friends [assumed]{.prov} | Fan-out writes/s |
|---|---|---|---|
| 0.2 | 23 | 150 | {.num} 3 500 |
| 0.5 | 58 | 500 | {.num} 28 900 |
| 2.0 | 231 | 500 | {.num} 115 700 |
:::

Reads, for comparison, are around [1 160/s]{.num} at ten feed loads per user per day — one percent of the write volume in the busiest row. This is a write system that occasionally serves reads, and the workload is a list append: no joins, no transactions, one ordered list per user. Even the busiest row is a handful of nodes.

::: warn {data-l="THE CONSTRAINT NOBODY USED"}
A five-thousand-friend cap is a statement that the tail is bounded. The hybrid push-and-pull apparatus exists to handle an *un*bounded tail — users with millions of followers. Under the treatment's own answer, the worst post in the system produces five thousand list appends — a few milliseconds, once, for the most connected user who exists. **There are no celebrities, there is no hot key, and there is nothing for the pull path to relieve.** And the threshold at which the design would switch modes is never given, so the mechanism could not even be implemented as written, were it needed.
:::

#### And two of five cache layers serve nothing

The requirements name two features: publish a post, and read friends' posts in reverse chronological order. The cache tier has five layers, and two of them hold likes, replies, follower counts and following counts — no requirement mentions any of these. The graph database is justified in the text by friend *recommendations*, which are also not in scope; the stated need is "given a user, return at most five thousand identifiers", and that is an indexed table.
:::

### A precise term still needs a root

A TEOB naming application: a root called `availability` needs a scope note identifying the operation, caller and conditions. An accepted cart update and a read returning the latest acknowledged metadata are different promises, even if a dashboard calls both requests successful. Choosing one preferred term in each contract keeps the trace from changing meaning between its root and its observation. It does not supply a missing target or owner.

Record aliases only where the concepts coincide. A friend relationship, a follower relationship and a recommendation may all help someone find people, but that association does not make them synonyms or establish the same fan-out work. Distinguish association, part–whole and kind-of relationships before reusing a term or a schema. The vocabulary records the distinction; the client's requirement still decides which concepts the system needs.

### The general form

- **Follow every chain to its root and write the root down.** If the root is an adjective, the chain is unanchored — not wrong, unanchored — and anchored again the moment somebody says a sentence about a caller. Report it once, at the root: filing eight findings against eight correctly-derived mechanisms is how a review gets itself ignored.
- **Disposition ② is the one to hope for.** Most self-derived requirements, traced far enough, land on a client constraint the design already had and never connected — and quite often a *different* one from the constraint that bought the parent. A fencing token traces to the invariant the leader protects, not to the availability figure that bought the leader — and finding that is worth more than deleting anything.
- **The weakest link governs.** A chain whose first two links are properly derived and whose third smuggles in an unquantified premise is an unanchored chain — everything after that link inherits the gap.
- **Ask for the mean, not only the maximum.** A cap tells you the tail is bounded — useful, and it often deletes an entire subsystem. The mean tells you the bill.
- **Consumption is sometimes subtractive.** A figure that deletes a mechanism has been consumed just as surely as one that sizes a component — and usually more cheaply.
:::

::: footer
DERIVATION 03 · V1.4 · 2026-10-12 · APPLIES THE OUTSIDE-IN METHOD V4.13.
Source locator: Xu, *System Design Interview — An Insider’s Guide*, 2nd ed., ch. 6, pp. 86–108, and ch. 11, pp. 165–176. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§6.2.2, 8.2 and 8.3–8.4. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE).
:::
