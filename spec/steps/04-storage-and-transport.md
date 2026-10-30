---
number: "04"
id: "s04"
title: "Storage & transport"
phase: "II"
---

::: def
Choose a store for every data class and a channel for every movement between them. This is the first step at which a technology may be named — and each one must cite a label from the previous step or a figure from the one before that.
:::

::: asks
ASKS · Which store serves this access pattern at this size, and what exactly does the path between stores guarantee?
:::

**Carry meanings into the published contract.** Name operations, payloads, results and component responsibilities from the scoped vocabulary. Distinguish requests from facts and observations from reservations; each result states what is known at its acknowledgement point. Attach primitive roles and implementation products separately. Check the names with representative consumers using concrete tasks before relying on shared understanding; record the evidence or the outstanding check beside the contract.

### Stores — match the family to the access pattern {style="color:var(--ink2);font-size:12px;margin:10px 0 2px"}

| Family | Fits | Breaks / costs |
|---|---|---|
| **Relational** | Transactions, joins, constraints, flexible query shapes — the default until something forces otherwise | Single-primary write ceiling; cross-shard transactions; sharding surrenders the features you chose it for |
| **Distributed SQL** | Serializable semantics with horizontal scale and geo-replication | Consensus per commit adds a round trip; operationally heavy; unjustified at modest write rates |
| **Key-value, in-memory** | Hot working set, sessions, counters, rate limits; sub-millisecond point reads | Bounded by RAM; durability is a configuration, not a given; never the source of truth |
| **Key-value, durable** | Predictable single-digit-millisecond reads at any size, keyed access only | Query shape is the key; item-size limits; cost scales with throughput provisioning |
| **Wide-column / LSM** | Very high write throughput, linear scale, per-query table design, native TTL | Ad-hoc queries; compaction and tombstone operations; secondary indexes disappoint |
| **Document** | Aggregate-shaped records read and written whole; evolving schemas | Cross-document transactions and joins; unbounded nested growth; schema debt deferred, not avoided |
| **Search index** | Text relevance, faceting, filtering over many attributes | Always a projection, never truth; near-real-time, not instant; the reindex path must be designed |
| **Columnar / analytical** | Large scans and aggregations, heavy compression, reporting | Point updates and high-rate point lookups; small frequent inserts |
| **Time-series** | Append-heavy metrics with retention and downsampling built in | High label cardinality; not a home for business entities |
| **Vector** | Nearest-neighbour search over embeddings; retrieval for a model, semantic and hybrid search | Always a projection, never truth — the embedding is derived from something, and a model change reindexes all of it. Recall is a tunable, so “correct” is a threshold not a fact; filtered search degrades sharply; memory scales with dimensions × items and the index is usually resident |
| **Log** | Ordered, replayable truth and fan-out to many consumers; compaction gives table semantics. Choosing it selects a store — the producer and consumer channels around it remain separate decisions | No random access; every consumer maintains its own view, its own offset and its own deduplication; retention × throughput is disk arithmetic you must do |
| **Object store** | Large immutable blobs, cheap and durable; archival tiers | First-byte latency in the tens of milliseconds; listing is not querying — a catalogue is required |
| **Embedded** | Per-process or per-shard local state, zero network hop | Sharing between processes; backup and replication become your responsibility |

{cols="20%"}

### Channels — eight properties you choose, one you inherit {style="color:var(--ink2);font-size:12px;margin:14px 0 2px"}

The eight below are questions every channel must answer; several are answered *by* the first. Block the caller and two thin out at once, though neither disappears: the message TTL gives way to the business expiry and the caller's deadline, and the delivery guarantee becomes accepted, refused or outcome unknown — and saying so explicitly is the point. **Backpressure is not one of the two**, however often it is written off as one: a synchronous channel multiplexed over a bounded pool has a queue in front of it, and the pool *is* that queue. The ninth line on every edge is not a decision at all: the **latency budget** is a slice of the caller's, granted outside the system and divided across the hops — which is why it is recorded as an annotation on the edge rather than a property of the channel, and why a timeout invented locally is always wrong.

::: grid2
- **Sync or async** — does the caller block on the outcome, and what does it do when the answer never comes? And if it blocks, a second bit: **is the acknowledgement commit-bearing** — is the far side's answer what makes the caller's own promise true? The three kinds at step [03]{.num} decide it, and it governs which mechanics are legal at step [07]{.num}. On a latency-optimised edge a breaker dropping into a fallback is the right move; on a commit-bearing one there is nothing to fall into, because a fallback is either a lost write or a double one, and the response must distinguish known durable acceptance, known refusal and an outcome not yet known.
- **Delivery guarantee** — at-most-once, at-least-once, or effectively-once, and what the receiver must do to earn it.
- **Ordering key** — the scope within which order is preserved; also the unit of hot-spot risk.
- **Far side** — who is actually there, and how this end finds out. The far side of a channel is not a box; it is a set whose membership changes while the channel is open. Name the resolver — DNS, a registry, a mesh, a static list — and then type it in this vocabulary rather than leaving it as plumbing: it is a **store**, read through a **projection**, and a projection owes a staleness bound. That bound is the interval during which this end goes on sending work to somebody who has already left, which is what makes it the number the next property is derived from.

* **Backpressure** — bound active concurrency, waiting callers and waiting time separately, then name the overflow response per class. A connection pool limits active connections, not necessarily its waiting queue. These obligations apply to synchronous calls and in-process asynchronous transfers as well as brokers.
* **Message TTL** — how long this payload remains worth executing, independently of transport retention. A synchronous price offer can expire while waiting for a connection or being processed. State business expiry, caller deadline and execution cancellation separately, including who checks expiry and whose clock is authoritative. A client timing out does not roll back the server’s effects.
* **Contract** — payload schema, versioning, and compatibility mode; on an async channel the schema is the API. Always answered: *none* requires evidence that no old consumer, retained message or persisted schema can cross the change, including rollback; a shared deployment alone does not establish that. What a published interface adds, at step [01]{.num}, is a promise somebody outside can hold you to. **Replay compatibility** is part of it: a current reader must decode every writer schema retained in its replay window, or use tested migrations/upcasters. A last-version backward check does not prove all-history compatibility; choose transitive checking where that is the requirement.
* **Departure** — what becomes of work in flight when an end goes away, answered twice, because the planned departure and the other one have different answers. **Graceful is derived, not chosen**: stop advertising, wait out the far-side bound above, then finish what is in flight inside the budget this edge already inherits — drain for less than that and a planned departure is a crash with a changelog entry. **Ungraceful is paid for by properties already on this list**: an async consumer replays through its atomic effect/deduplication protocol; an async producer loses whatever was buffered and unacknowledged, which is the guarantee telling the truth; and a synchronous caller is left unable to say whether its write happened at all.
:::

::: p {style="margin-top:10px"}
**Far side and departure are the failure mode, named.** Every earlier version of this list trailed the phrase *and a failure mode* without saying which questions it stood for; these are they. Leave them unanswered and the design has assumed a topology that is only true between deployments — one where nothing scales in, nothing is replaced, and nothing is preempted.
:::

::: p {style="margin-top:10px"}
**A brokered channel is specified more than once.** Producing into a log and consuming from it are two channels around a store, and their properties genuinely differ — the producer's guarantee is not the consumer's, the producer's ordering key is the consumer's parallelism ceiling, and only the consumer can deduplicate. Write the eight properties once for the producer side and once for *each* consumer, because each reader chooses its own commit point, its own lag tolerance, and its own dedup key.
:::

::: p {style="margin-top:10px"}
**And a store is brokered too.** The rule above was written for a log and holds for anything with a process boundary in front of it, which is every store you did not embed: a channel exists wherever a process boundary does, so the edge from a processor to a relational database *is* a channel and owes the eight. It is specified more than once for the same reason — the write path is a producer channel, and each reader is a consumer channel of its own. Only the carrier of the asymmetry changes. On a log it is retention, which belongs to the store, against the deduplication key, which belongs to the consumer. On a database it is **consistency offered against consistency taken**: the store offers a menu — leader or replica, the isolation levels, a replication lag — and each reader takes one line off it, along with its own timeout, its own page size and its own staleness tolerance. Name the database once and every one of those is a default. The reliable tell is a design in which the nightly report and the checkout page read the same store, and the drawing shows one arrow.
:::

::: p {style="margin-top:10px"}
**And a store played by more than one process has channels inside it.** A replicated store is not one box. A Postgres primary is followed by its replicas; Cassandra is a ring of nodes; Kafka is a set of brokers under a controller quorum; a Pekko cluster is the application itself, spread over several processes that hold sharded state between them. Wherever two of those processes exchange data a process boundary is crossed, and the rule above applies without exception: the edge between them is a channel. Almost every such store has two. The **replication channel** carries each write from the process that took it to the ones that must hold it. The **membership channel** — gossip, a consensus quorum, a controller — tells each process who else is there. A store that moves data when its membership changes has a third: the **rebalancing channel** — streaming to a new node, a partition reassignment, a shard handoff — which carries no client write and runs exactly when the store is least able to afford it.
:::

::: p {style="margin-top:10px"}
Somebody else wrote these channels, and their eight properties are still owed, because each one is a configuration line with a default, and a default is a decision nobody made. Read on the replication channel, the eight become the questions a replicated store is usually adopted without:
:::

| Property | On the replication channel |
|---|---|
| **Sync or async** | Does a write acknowledge before the replicas hold it? Synchronous replication is **commit-bearing**: its round trip is spent out of the writer's latency budget, and writes stop once fewer replicas than the required acknowledgement set are reachable — Postgres's `synchronous_standby_names` with `synchronous_commit`, Kafka's `acks=all` against `min.insync.replicas`, a Cassandra consistency level |
| **Delivery guarantee** | What a replica that missed a write gets back: the log replayed, a repair that compares and converges, or nothing |
| **Ordering key** | The scope of order the replicas agree on: one log for the whole store, one per partition, or one per key decided by timestamps — which is a conflict policy, and step 03 asked for one |
| **Backpressure** | What happens to the writer when a replica falls behind: it waits, it drops the replica from the quorum and carries on, or it never knew |
| **Catch-up retention** | Transport retention, distinct from business expiry: how long the sender keeps what a lagging replica has not yet taken — the line between catching up and being rebuilt from scratch. A retention that never expires is not safe either: a replication slot nobody reads fills the primary's disk, unless `max_slot_wal_keep_size` caps it, which invalidates the slot instead |
| **Contract** | The format between versions, which is what a rolling upgrade runs on: for the length of the roll, old members and new ones replicate to each other, so the compatibility mode is answered here or the upgrade is a stop-the-world one |
| **Far side** | The membership channel's answer — which processes are members now, and how stale that list may be |
| **Departure** | What a member leaving does to the others: the rebalancing it sets off, and the writes that only it held. Gracefully, it hands its share over before it goes; ungracefully, those writes are as lost as the guarantee above allowed |

{cols="18%"}

::: p {style="margin-top:10px"}
**Read the store declaration against its actual protocol.** An authoritative primary can offer linearizable reads while copying asynchronously to backups, provided those backups neither serve stale reads under that promise nor take over with missing acknowledged writes. State fencing, failover and availability assumptions. Replication timing alone does not determine the consistency offered.
:::

::: p {style="margin-top:10px"}
**Co-location is shared fate.** Members that share a host, a rack or a zone fail together, and a replication channel between them buys nothing against the failure they share. So a store with replicas owes a placement rule written beside it: the failure domain no two members may share, and the quorum arithmetic per domain — three members over two zones lose their majority with the zone that holds two. The same holds across stores: a broker on the same node as the service it serves, or one host carrying the shards of several stores, is one failure under several names — a coupling no map shows, carried onto the ladder as one entry per promise it takes down. The rule is written here, with the store, and executed at step [08]{.num}.
:::

### Granularity — how many runnable units, and where the seams go {style="color:var(--ink2);font-size:12px;margin:14px 0 2px"}

**“Monolith or microservices” is not the question, and asking it is how the decision gets skipped.** Granularity is a range. One runnable unit is a legitimate point on that range — the leftmost one — and so is forty; naming the two endpoints as if they were opposing philosophies replaces a derivation with a team preference. What you actually decide is three separate things, and collapsing them into one word is the mistake:

| Axis | The decision | Set by |
|---|---|---|
| **Runtime units** | How many independently deployable processes the graph runs as | operational forces below — one unit until a force buys the next |
| **Module seams** | Where explicit internal interfaces sit *inside* a unit — no shared state across them, no reaching into internals | the domain, plus the lifecycle from step [01]{.num} |
| **Repo topology** | One repository or many, and which way dependencies are allowed to point | change atomicity vs. independent versioning — **not** the runtime |

{cols="26%"}

::: p {style="margin-top:8px"}
**These are independent, and all four corners exist in production.** Monorepo with one runnable, monorepo with forty, many repos with one runnable, many repos with forty. Splitting a repository does not split a runtime and splitting a runtime does not require splitting the repository — the two get conflated constantly, and the conflation costs whichever one you didn't actually need.
:::

::: p {style="margin-top:10px"}
**A process split adds independent failure and communication costs.** Count the edges it creates and specify each contract. Inside a process, concurrency, asynchronous queues, partial durable effects and slow work already exist. State execution model, transaction boundary and failure domain separately. One process can commit one update and crash before the next; only an actual transaction or equivalent protocol supplies atomicity.
:::

::: p {style="margin-top:10px"}
**A clustered runnable unit is a split already taken.** Even a single deployable may contain network channels. This is explicit when a unit runs as a cluster — Pekko cluster sharding, an in-memory data grid, any library that routes a message to whichever instance holds the entity. There the instances exchange messages, state and membership across process boundaries, and those edges are channels: the entity's location is a store read through a projection, a message to a remote shard is a channel with all eight properties, and a member leaving sets off the shard handoff above. One deployable is not one process. Count the cut the clustering library made exactly as if you had made it — and cite the force that bought the cluster, because the library will not.
:::

| Property | Inside one runnable unit | Across a runtime boundary |
|---|---|---|
| **Latency** | A direct call avoids network overhead; execution, contention and queues still consume the latency budget | A distribution with a tail, a timeout sliced from someone's budget, and a retry policy |
| **Consistency** | Synchronization and transaction scope must be stated; shared memory alone supplies neither | State the protocol. Distributed transactions can provide atomicity; outboxes and sagas provide different guarantees |
| **Ordering** | Program order within a sequential execution; concurrent handlers need coordination | A scoped property you must choose, and the unit of hot-spot risk |
| **Failure** | A shared process failure domain; partial durable state remains possible | Partial failure is the normal case: one side up, one side down, and a caller who must decide what to hand its client |
| **Interface** | Checked by the compiler; changed in one commit | A versioned contract with a compatibility mode, changed across two release trains |
| **Debugging** | One stack trace | Correlated traces across hops — which is precisely why tracing becomes a deliverable at step 09 |

{cols="12% 44%" style="margin-top:8px"}

::: p {style="margin-top:8px"}
A split buys independence at the price of additional coordination and failure modes. Local contracts are often cheaper to implement, but are not free guarantees. Name the force that justifies the split and record the protocols needed on both sides.
:::

::: grid2 {style="margin-top:10px"}
::: card
#### What buys another runtime unit

Each split must cite one of these, the same way a component must cite a constraint. **Independent delivery** — it must ship on a different cadence to something it sits with. **Independent scaling** — it scales on a different axis, so co-locating it wastes the resource the other one needs. **Fault isolation** — its failure must not take the rest down, and the blast radius is worth paying for. **Trust zone** — regulated data or a different adversary. **Ownership** — a different team's pager. **Runtime mismatch** — a latency floor, a GPU, a forced language.
:::

::: card
#### What each one costs

A build pipeline, a deployment, a rollout and rollback path, a monitoring surface, an on-call story, a versioned contract with a compatibility mode, and **a network hop that is now a channel with properties that must now hold across independent processes**. Every one of those is real recurring work. This is why the default is one unit and each additional one is argued for — the cheapest service is the one you didn't split out.
:::
:::

- **An invariant that spans a boundary usually settles it.** Split across it and a row lock becomes a distributed transaction — the invariant list from step 03 names its enforcers, and a proposed boundary that separates an enforcer from what it enforces is answering the granularity question wrongly. Where the invariant sits, the unit stays whole.
- **More runnable units than teams is a smell.** Each unit needs an owner who is awake; if the count exceeds the topology recorded at step 01, someone owns a unit they have never operated.
- **Repo topology answers a different question: can this change land atomically?** One repository makes a cross-cutting change one commit and one review; many repositories make versioning explicit and release trains independent. Decide the direction dependencies may point, and enforce it — an upstream that imports from a downstream is the same defect whatever the repo layout. What buys the second repository, and what follows from it, is the next subsection.

{style="margin-top:8px"}

::: say
“Co-location removes a network hop. It does not remove concurrency, partial effects or transaction boundaries. Name the independence a split buys, then price its contracts.”
:::

### Repo topology — and the delivery machinery it buys {style="color:var(--ink2);font-size:12px;margin:16px 0 2px"}

**Repository topology and compatibility are separate decisions.** A monorepo can publish an SDK whose users decline upgrades; an owned mobile app can remain on old devices after its source changes. Choose repositories for source access, ownership and coordination costs. Choose release units and compatibility windows for deployed consumers. One atomic source commit does not make deployment atomic. The published-interface question buys an explicit version and deprecation contract, not automatically a second repository.

Decide the following mechanisms independently, each against the constraint it actually serves:

| Mechanism | Cites | What it costs when nothing cites it |
|---|---|---|
| **A second repository** | Source-access, ownership or coordination requirements that justify separation | Cross-cutting changes require coordination; a published SDK can also live in a monorepo |
| **A version scheme somebody can decline** | A consumer who **chooses when to upgrade**. Semantic versioning states its own precondition: software using it must declare a public API, because the major number is a promise about that boundary | The major number never moves, because nobody was ever in a position to refuse, and the scheme is decoration on a build. Two neighbouring answers exist and are more often correct: **calendar versioning** where upgrades are driven by support windows, security horizons or regulatory dates — the consumer is asking *how old is this*, not *does this break me* — and, where a consumer cannot decline at all because both halves deploy together, a **content hash or commit identifier**, whose job is identity: which build, which trace, which rollback target |
| **A build system beyond the ecosystem default** | A repository where the correct incremental set can no longer be computed from the directory layout. The tools that answer this track changes to file content *and* to build commands, and run hermetically so that the answer is trustworthy; the scale they cite is six figures of source files | A second build language, a hermeticity discipline, an adapter per ecosystem and a cache to operate — often to take a four-minute build to three. **Record the ratio**, as with any other sizing claim: measured build time against the tolerance you wrote down. Near [1]{.num} and the tooling was never the binding constraint |

{cols="21% 37%"}

::: p {style="margin-top:8px"}
**A remote build cache is a store, and the method already types it.** It is a derived store with an invalidation contract — the same rule as any other cache — so a build that is not hermetic has broken that contract, and a cache with a broken invalidation contract serves confident wrong answers while every dashboard stays green. It also carries a retention policy and a cost line, and it is one of the few storage lines that grows with your own commit rate rather than with traffic.
:::

::: warn
A source commit cannot update every deployed caller. Record supported versions, forced-upgrade behaviour, offline clients and the deprecation window separately from repository ownership.
:::

::: say
“Keep repositories together while that serves access and coordination. Version the contracts independently wherever a deployed consumer can lag behind.”
:::

### The sizing pass — the arithmetic that only exists now {style="color:var(--ink2);font-size:12px;margin:14px 0 2px"}

Demand was computed before the design; **capacity can only be computed after it**, because every term below is a property of the graph you have just drawn. Run this immediately, while the choice is still cheap to reverse. Note that granularity feeds it: each split adds a hop to the read and write amplification, and cross-unit traffic becomes egress.

| Quantity | How it comes out |
|---|---|
| **Write amplification** | How many stores one client write ultimately touches: truth store, log, each projection, the search document, the cache invalidation. A single order can easily be [5×]{.num}. This number exists only because you chose that many derived stores |
| **Read amplification** | How many store reads one client read causes: entities fetched, shards queried, joins resolved. Fan-out across many shards also imports their slow tails |
| **Per-store rate** | client rate × amplification × peak factor — computed per store, not for the system as a whole |
| **Node count** | required rate ÷ per-node capacity, divided again by target utilisation. Size for roughly half, never for full: a store at [90%]{.num} has no room to absorb a failover, a compaction, or a Monday |
| **Stored bytes** | logical volume × replication factor × index and overhead ÷ compression. Replication factor [3]{.num} means the disk bill is three times the number computed at the load step |
| **Log retention** | write throughput × retention window = disk. Long retention is a storage decision disguised as a configuration line |
| **Partitions** | the key first: **the scope key of the invariant hardest to move**, so that its enforcer stays inside one partition. Where two invariants disagree about the key, one of them pays, and that is the finding — [the booking derivation](derivations/04-the-invariant.html)'s room-night against guest-night is the instance. Then the count: at least throughput ÷ per-partition ceiling, and at least the number of parallel consumers you intend to run — **and how the count changes later**. A partitioning you cannot change is a decision you only get to make once: state whether adding partitions preserves the ordering key's scope, how a tenant moves, how a hot key splits, and whether any of it can happen while serving. This is the same rule step 06 applies to projections, applied to the layout underneath them |
| **Accelerator count** | required tokens/s ÷ per-accelerator tokens/s at the batch size your latency tolerance permits, ÷ target utilisation. Two traps: the batch size that maximises throughput is rarely the one that meets p99, and memory usually binds before compute — weights plus the per-request KV cache times concurrency is what actually decides how many requests fit on a card |
| **Cold-start and scale-out** | time to load weights onto a fresh accelerator. Tens of seconds to minutes is normal, which means autoscaling cannot absorb a spike the way a stateless tier does — the burst is absorbed by queueing, by a smaller model, or by the API fallback, and that choice is a rung at step 07 |
| **Cross-zone traffic** | replication and cross-zone reads become egress volume, and egress is frequently the largest line on the bill — the replication channel's traffic is write volume × (members − 1), whichever zones the members sit in |
| **Cost per request** | the whole thing divided by demand, checked against the envelope recorded at step 01 |

{cols="26%"}

- **Size for N−1.** Capacity that assumes every node and every zone is present is not capacity; it is a hope with a spreadsheet. And N−1 is a moment of extra work, not of rest: the survivors carry the live load *and* the rebalancing channel's traffic, which rebuilds the missing member's share while the clients wait.
- **The reversal rule.** If the sizing produces forty nodes to serve twelve transactions per second, the choice was wrong — return to the family selection rather than accepting the cluster. If it produces one node with headroom, delete the distribution and say why.
- **Record the ratio beside the citation, at the moment you choose.** Citing a constraint is not enough: write what the citing requirement demands against what the mechanism supplies, and divide — supplied over demanded, with the demand taken at its average, so that the peak can be one of the factors you name. **Near 1** is sized to the job. **Tens** is headroom and must name the factor — growth, peak, or failover. **Hundreds** means the requirement cannot discriminate the choice, and the shape came from somewhere other than this derivation; the mechanism is not wrong so much as unjustified at that size. The ratio costs one line now and a re-derivation to recover later, which is why it belongs here rather than in review.
- **And a fourth field: what the mechanism introduces.** Demanded, supplied and the ratio say why a mechanism is there; they do not say what it adds — the constraint, failure mode or debt that arrives with it. A cache introduces a stale window and a stampede on expiry; a conditional write a per-key ceiling; hedging extra load on the hedged tier; two sources of truth a reconciliation to run. Each introduced item is then cited by the mechanism that answers it — the parent-decision rule of step [10]{.num}, fed at the moment of choice rather than reconstructed in review — or carried onto the degradation ladder or the risk register, or accepted in writing. An introduced cost nobody records is how a design accretes mechanisms whose citations nobody can see.
- **Record the actual cost to reverse.** Name the rollback window, preserved data, deployed consumers and migration work. A module seam can make replacement easier but does not make data migration free. Expand-and-contract preserves a way back only while the old representation and readers remain usable; destructive contraction can close it. Measure uncertain inputs before expensive irreversible commitments, or explicitly accept the uncertainty and its consequence.

{style="margin-top:8px"}

::: prod
→ PRODUCES: the first complete annotated graph — every surface enumerated (one per client class × operation group, each with a contract, a sync or async response mode, and idempotency on writes), every store chosen with a reason, every edge carrying its eight properties and the latency budget it inherits, the channels inside every store that more than one process plays, each with its placement rule — plus a sizing table per store and channel, a cost-per-request figure, and a stated headroom target — and beside each choice its ratio, what it introduces, and its cost to reverse.
:::

- **Surfaces are enumerated first.** One per client class × operation group, before any store is discussed. A surface nobody listed is a client touching the system through a door nobody designed — and it will be found in production, not in review.
- **The cheapest store is one you already operate.** A new technology needs a justification — a mismatch the existing fleet genuinely cannot meet — not a preference. Buy-versus-build is the same rule in a suit: a managed service that meets the tolerance table beats a self-hosted one that merely flatters the team.
- **Spend the operating envelope here.** The capability, hosting posture and existing contracts recorded at step 01 are consumed at this step, not at deployment. A cold-storage tier already under contract makes the archival decision before you open the lifecycle question; a CDN already paid for changes what the cheapest derived store is; a hybrid mandate removes candidates from the family table outright. This is the difference between a design that is cheap and one that is merely cheap to draw — and if a store that ignores the envelope is genuinely the right answer, that is a finding worth escalating with the cost difference attached.
- **Boundaries are cut where ownership is cut.** The primitives type the nodes; they do not count the services. A boundary earns its place when one of the six forces above differs across it — a release cadence, a scaling axis, a blast radius, a trust zone, an owning team from the step-01 topology, or a runtime that cannot be shared. Everything else is one deployable until something forces otherwise, which is the same stop rule the arithmetic uses. A boundary that crosses no organisational line is usually a deployment unit wearing an architecture's clothes; a team that owns half a boundary will discover that at three in the morning.
- **Lifecycle sets the starting granularity, not the final one.** Read it off step 01. A **spike** is one unit with no seams — it will be deleted, and seams are for futures it does not have. A **one-off product** takes seams only where the domain already divides. An **established platform** converts the seams that ownership and scaling have already made real. The interesting case is **prototype becoming a platform**, and it has a specific answer: **one runnable unit, seams everywhere the future boundaries will fall, one repository.** Draw the seam now, buy the runtime split when a force names itself.
- **A seam only counts if it would survive being cut.** The modular-first path fails when the modules were never real, so state what makes them real and check it: no shared database tables across a seam · no reaching into another module's internals, only its declared interface · no shared mutable in-process state · the interface versioned and reviewed as if it were remote, even while it is a function call · and the dependency direction enforced by tooling rather than by good intentions. Get those and later separation is a deployment change. Miss them and “we'll split it when we need to” is a rewrite with a reassuring name.
- **Effectively-once effects need an atomic boundary.** Redelivery plus a stable key is not enough: doing the effect before recording the key duplicates it after a crash; recording the key first can lose it. Atomically claim the key, perform the effect and retain the result, or use an idempotent destination with an explicit contract. State key scope, conflicting-payload handling, concurrent claims, and retention beyond every permitted retry and replay. Broker guarantees cover their stated boundary, not an arbitrary external effect. Version guards are also needed where an old replay could overwrite newer state.
- **Avoid dual writes.** When two stores must agree, write one and derive the other — a transactional outbox drained into the log, or change capture from the truth store. Two independent writes in one request handler is a bug waiting for a network blip.
- **Coordination is designed, not assumed.** Wherever the graph needs exactly one of something — one leader per shard, one scheduler firing a job, one holder of a lock — that is a lease, and a lease is a store plus a channel with four extra declarations: **what elects the holder**, **the lease duration measured against a named clock**, **the fencing token** that stops a paused-then-resumed holder from acting on stale authority, and **the rung handed to the client during a split brain**. Say those four and a coordination service earns its place; leave them unsaid and it is furniture that happens to be hard to remove. The commonest failure is the third: a holder that lost its lease but does not know it yet, writing anyway.
- **Geography is decided here**, not at deployment. Replication topology — single-region, active-passive, active-active, per-region partitioning — changes what consistency you can honestly promise. Deployment later chooses machines; this step chose semantics.

::: warn
Naming a technology without binding it to an access pattern in the same sentence. “We'll add a cache” is furniture. “A read-mostly hot set of roughly ten gigabytes, invalidated on write, so an in-memory KV in front of the primary” is a decision — and one that disappears cleanly if the hot set turns out to be the whole dataset.
:::
