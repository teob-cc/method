---
title: Transmitted
number: "07"
kind: chapter
part: II
description: Transmitted, chapter 07 of Systems, from the outside in — the first split as a phase change, the six forces that buy a runtime unit, the eight channel properties and the inherited latency budget, one broker and one database taken apart into their primitives, and the second arithmetic pass.
summary: The phase change that creates channels at all, the eight properties every channel owes, the schema that is an API whether or not you meant it, and the second arithmetic pass
---

::: standfirst
**Channels are the only one of the four types you can avoid buying entirely.** Inside one runnable unit there are none at all — the edges between modules are plain function calls, and they promise nothing because nothing needs promising. But the moment you split, every edge that crosses the cut turns into a channel, with eight properties you now owe — two of which are the failure mode that was not there in the morning.
:::

::: lead
So I start this chapter with the decision that creates transmission in the first place, and only then get to what a channel owes. Do it the other way round — and I have, more than once — and you wake up with eight channels nobody chose.
:::

## The first split is a phase change

“Monolith or microservices?” is the wrong question, and asking it in that form is exactly how the real decision gets skipped. Granularity is a *range*. One runnable unit is a perfectly legitimate point on it — the leftmost one — and so is forty. The moment you name the two endpoints as if they were rival philosophies, you have swapped a derivation for a team preference, and a team preference is not something you can put in a document and defend.

What you actually decide is three separate things, and the one word hides all three: how many **runtime units** the graph runs as, where the **module seams** sit inside a unit, and how the **repositories** are laid out. They are independent — splitting a repository does not split a runtime, and splitting a runtime does not need a second repository. This chapter is about the first of the three. Chapter 03 already said when the seams go in, and the repository waits for chapter 10.

And what changes across the first split is not a matter of degree at all:

| Property | Inside one runnable unit | Across a runtime boundary |
|---|---|---|
| **Latency** | No network hop for a direct call; execution, contention and queues still cost time | A distribution with a tail and a deadline |
| **Consistency** | Synchronization and transaction scope declared explicitly | Coordination protocol; sagas and outboxes do not themselves make all effects atomic |
| **Ordering** | Program order within sequential execution; concurrent handlers need coordination | An explicit scoped ordering contract |
| **Failure** | Shared process failure domain; partial durable effects remain possible | Independent failures and uncertain remote outcomes |
| **Interface** | Checked by the compiler; changed in one commit | A versioned contract with a compatibility mode, changed across two release trains |
| **Debugging** | One stack trace | Correlated traces across hops — which is why distributed tracing becomes a deliverable rather than a nicety |

Table: Read it as a single trade: **you are exchanging guarantees for independence.** The guarantees on the left are free and invisible, which is exactly why they are undervalued until the afternoon they are gone. {cols="14% 41%"}

Because the change is a step and not a slope, the cost is **countable before you pay it**. Count the edges that would cross the proposed cut. Eight crossings is eight channels and sixty-four properties to specify, not one of which existed yesterday. That is a number — you can put it in a document and argue about it, which is rather more than can be said for an aesthetic preference about service size.

## What buys another runtime unit

Each split has to cite a force, exactly the way a component has to cite a constraint. There are six of them, and “it'll scale better” is not on the list, however often I hear it:

::: grid2
::: card
#### The six forces

**Independent delivery** — it has to ship on a different cadence to what it sits with. **Independent scaling** — it scales on a different axis, so co-locating it wastes the resource the other one needs. **Fault isolation** — its failure must not take the rest down, and that blast radius is worth paying for. **Trust zone** — regulated data, or a different adversary. **Ownership** — a different team's pager. **Runtime mismatch** — a latency floor, an accelerator, a forced language.
:::

::: card
#### What each one costs

A build pipeline, a deployment, a rollout and a rollback path, a monitoring surface, an on-call story, a versioned contract with a compatibility mode, and **a network hop that is now a channel with eight properties**. Every item on that list is real, recurring work — and that is why the default is one unit, and every additional one has to be argued for. The cheapest service is the one you never split out.
:::
:::

Two rules settle most proposed boundaries before the argument even starts:

- **An invariant that spans a boundary usually settles it.** Split across it and what used to be a row lock becomes a distributed transaction. Chapter 05 gave every invariant one enforcer; a boundary that puts the enforcer on one side and the thing it enforces on the other has answered the granularity question, and answered it wrongly. Where the invariant sits, the unit stays whole.
- **More runnable units than teams is a smell**, and the reason is the one chapter 03 already gave: each unit needs an owner, and the owner has to be awake.

And one caveat to everything in this section: **one deployable is not always one process.** A unit that runs as a cluster — Pekko cluster sharding, an in-memory data grid, anything that routes a message to whichever instance holds the entity — has taken the first split inside itself. The location of an entity is a store read through a projection, and a message to a shard on another node is a channel, eight properties and all. Count that cut as if you had made it, and name the force that bought the cluster, because the library will not.

## Eight properties you choose, one you inherit

Each transfer needs the applicable answers below. A process boundary makes communication failure explicit; an in-process asynchronous queue also needs capacity, ordering and failure behaviour. Direct calls can be shown compactly, but one process is not a transaction. Synchronous requests can wait, expire, commit after a lost response and be retried.

Earlier editions of this chapter said *three* went thin, and put backpressure in with the other two. That was wrong, and it is worth correcting out loud rather than quietly, because it is wrong in a way that costs money. A synchronous call almost never gets a connection of its own; it gets one from a pool, and **the pool is a queue**. Chapter 02's nightly job did not fill up a message broker. It filled up a pool.

| Property | The question |
|---|---|
| **Sync or async** | Does the caller block on the outcome — and what does it do when the answer never comes? And if it blocks: is the acknowledgement **commit-bearing** — is the far side's answer what makes your own promise true? |
| **Delivery guarantee** | At-most-once, at-least-once, or effectively-once, and what the receiver must do to earn it |
| **Ordering key** | The scope within which order is preserved |
| **Backpressure** | What happens when the far side cannot keep up — including when the channel is synchronous and the queue is the connection pool |
| **Message TTL** | How long *this payload* stays worth delivering |
| **Contract** | Payload schema, versioning, and compatibility mode — always answered. “None” requires that no old consumer, retained message or persisted schema can cross the change; deploying from one commit does not establish that |
| **Far side** | Who is actually there — and how this end finds out that it changed |
| **Departure** | What becomes of work in flight when an end goes away. Asked twice: the planned departure, and the other kind |

{cols="22%"}

The ninth line on every edge is not a decision at all. **The latency budget is a slice of the caller's**, granted from outside the system and divided up across the hops — and that is why it goes on the edge as an annotation rather than into the channel as a property, and why a timeout invented locally is always wrong. If the client's budget is 300 ms and the request crosses four hops, those four timeouts have to add up to less than 300 ms, retries included. Nobody who sets a timeout to “30 seconds, to be safe” has done that arithmetic. Safe from what, exactly?

::: primer
#### Ordering is always scoped to a key

Global ordering across a distributed channel means one serialisation point, and one serialisation point means a throughput ceiling of exactly one machine. Almost nobody needs that. Almost nobody says so out loud either, so it ends up in designs by default.

What people actually mean is ordering *with respect to a key*: per account, per conversation, per device, per booking. And that key does three jobs at once, which is why picking it deserves a minute of real thought and not a default:

- **It is the ordering scope.** Messages with the same key arrive in order; messages with different keys have no relationship to each other whatsoever.
- **It is the parallelism ceiling on the consumer side.** You cannot process one key's messages concurrently without throwing away the order you just paid for, so the number of distinct keys is the ceiling on how far the consumer can scale.
- **It is the hot-spot unit.** If one key carries a tenth of the traffic — a celebrity account, your largest tenant — then one consumer carries a tenth of the load while the rest sit idle.

The classic mistake, and a very common one, is keying by something with very low cardinality: a region, an event type. That preserves an order nobody asked for and caps the throughput at a handful of consumers.
:::

::: primer
#### Backpressure — or, what an unbounded queue actually is

Producers are sometimes faster than consumers; that is just physics, and no design can pretend otherwise. There are only three honest responses to it, and the design has to pick one per channel:

- **Block or slow the producer.** The pressure travels back up the chain to whoever is generating the work, which is usually exactly where it belongs. This is what a bounded buffer with demand signalling does.
- **Shed at the edge.** Refuse work out loud, at the surface, and let the shed order from chapter 02 decide who gets refused first. Refusing early is far cheaper than refusing once the work is half done.
- **Buffer, with a bound and a stated overflow behaviour.** Absorb a burst you have actually measured — and say what happens when the bound is hit, because that, not the buffer, is the real policy.

**An unbounded queue is not a fourth option.** It is a failure mode on a delay fuse: memory or disk fills up, latency climbs without limit while every component cheerfully reports itself healthy, and the messages at the front of the queue have gone worthless long before anyone delivers them. The system does not fail fast. It fails slowly, and then all at once — and the dashboards look fine the whole way down.

**Synchronous calls need independent limits too.** Pool size bounds active connections, not necessarily waiting callers. Set a maximum queue length, maximum wait and overflow response per class. Specify business expiration separately from the caller’s deadline; a timed-out client has not rolled back the server.
:::

::: primer
#### Message TTL is not store retention

Two different properties, on two different primitives, and they get mixed up all the time for no better reason than that both are durations.

**Retention** belongs to a store. It is a *disk* decision — throughput × window — and it answers one question: how far back can a reader go?

**Message TTL** belongs to a channel. It is a *meaning* decision, and it answers a different one: how long is this payload still worth delivering? A cache-refresh instruction that has sat in a queue for an hour has expired, even though the bytes are perfectly intact — and delivering it now would do more harm than dropping it.

A synchronous response deadline does not replace business expiry. A request can become invalid while queued or after a retry; state where its expiry is checked. Record “not applicable” only when no separate expiry rule exists.
:::

::: primer
#### The far side is a set, and it changes while you are talking to it

The last two properties are the ones this list spent years gesturing at. Every earlier version of it trailed off with the phrase *and a failure mode* — a whole category of questions left as an atmosphere. These are the questions.

**Who is on the far side.** Not *which service*; that is on the diagram. Which instances, right now. The far side of a channel is a set whose membership changes while the channel is open — replicas scale in, a rolling deploy replaces them one at a time, a spot instance is reclaimed, a scheduler moves one to another node. Something tells this end what that set currently is: DNS, a registry, a mesh, a broker's group assignment, a list in a config file. And whatever that something is, it is a **store**, read through a **projection** — so it owes a staleness bound, exactly like every other projection in this book. That bound is not paperwork. It is how long this end goes on cheerfully sending work to somebody who has already left.

**And what becomes of work in flight when they leave.** Two questions wearing one name, because leaving on purpose and leaving suddenly have nothing in common.

- **Gracefully** — and this one is *derived* rather than chosen. Stop advertising. Wait out the staleness bound above, because until it expires the routing layer is still handing you work. Then finish what is in flight, inside the latency budget this edge already inherits. Drain for less than that and you have not shut down gracefully at all — you have crashed, with a changelog entry. A drain timer picked without reference to the routing layer's refresh interval is a number with no owner: the same defect as a locally invented timeout, one step further out.
- **Ungracefully** — where the good news is that you have already paid for most of it, in the properties above. An async consumer replays from its commit point, and the atomic effect/deduplication protocol handles the repeat. An async producer loses whatever was buffered and unacknowledged, which is not a surprise either — it is the delivery guarantee telling the truth about itself. The one genuinely new case is the synchronous caller, left unable to say whether its write happened at all — which is where **idempotence**, from chapter 06, stops being good practice and becomes load-bearing. It is what keeps an ambiguous outcome from resolving into a duplicate, and a duplicate on a money path is the rung chapter 02 forbade.
:::

## The schema is the API, whether or not you meant it

On a synchronous interface the contract gets looked after: there is an endpoint, a schema, a version, and probably a review. On an asynchronous channel the payload schema is not *a* contract — it is **the** contract, because there is no other interface to be had. And yet, reliably, it gets a fraction of the ceremony.

The reason is structural, not carelessness. **An HTTP caller appears in your logs. A topic's consumers are invisible at write time.** You cannot see who is reading, so you cannot see who you are about to break, so the compatibility mode gets picked by default instead of by decision — and the readers it breaks are exactly the ones nobody could see: the indexer somebody adds next year, the backfill job replaying from the beginning.

So name the schema, the compatibility mode and an owner on every asynchronous edge. Otherwise the design has **published an API by accident and promised nothing about it**.

The schema also carries the vocabulary across the boundary. Give operations, payload fields, results and events the scoped meanings agreed with their consumers. If two domains use *account* differently, put the mapping and its limits at the edge instead of quietly treating them as synonyms. A readable payload field with a changed meaning is still a changed contract, even if the schema checker accepts it. Test the meaning against retained messages as well as current producers; chapter 10 carries that obligation into migrations.

**And one rule about writing to two places.** When two stores have to agree, write one and derive the other — a transactional outbox drained into the queue, or change capture from the truth store. Two independent writes in one request handler are a bug waiting for a network blip: the first lands, the process dies, and nothing ever tells the second.

## One technology, three primitives

Everything above comes together in the standard example, and I want to walk through it slowly, because the same shape turns up everywhere once you have seen it.

::: figure
![A producing service writes through a producer channel into a retained log store, which fans out through three independent consumer channels to a projection, a search index and a backfill reader. Beneath, the properties belonging to each of the three primitives are listed separately.](../figures/07-transmitted.svg)

A log is not a channel that happens to keep things on disk. It is a producer channel, a store with a retention window, and one consumer channel per reader — three primitives, three sets of properties, three different owners.
:::

**And the same knife goes through a database.** This is the decomposition almost nobody draws, and it is the one most systems actually need, because every system has a store and only some of them have a log. Put a process boundary in front of it and it is a store, a producer channel for the write path, and one consumer channel per reader — the reporting job, the checkout page, the admin console, the replication that feeds the search index. All that changes is which property carries the asymmetry. On a log it sits between **retention**, which belongs to the store, and the **deduplication key**, which belongs to each consumer. On a database it sits between the consistency the store **offers** — a leader, some replicas, a set of isolation levels, a replication lag — and the consistency each reader **takes** off that menu, along with its own timeout, its own page size and its own tolerance for being behind.

Which makes the tell easy to spot once you know it. A design in which the nightly report and the checkout page read the same store, and the drawing shows one arrow, has decided none of that. It has one label standing in for a dozen decisions, and the defaults it lands on — everybody reads the leader, everybody shares the pool, nobody said how stale is acceptable — are exactly the ones chapter 02's incident is made of.

**And the knife goes one level further in.** A database with replicas — or a Cassandra ring, a Kafka cluster, a Pekko cluster holding sharded entities — is not one process but several, and between them run channels of their own: a **replication channel** carrying each write to the copies that must hold it, a **membership channel** telling each member who else is there, and, wherever a member joining or leaving moves data around, a **rebalancing channel** that does its heaviest work at the worst possible moment. Nobody on your team wrote them, and they still owe the eight answers, because every one of them is a configuration line with a default:

- **Sync or async** — does the write wait for the copies? If it does, the edge is commit-bearing, and the replica's round trip comes out of the writer's latency budget.
- **Guarantee and TTL** — what a replica that fell behind gets back, and how long the sender keeps it. Too briefly, and the replica has to be rebuilt from scratch; forever, and a replication slot nobody reads fills the primary's disk while every dashboard stays green.
- **Ordering key** — one log for everything, one per partition, or one per key decided by timestamps. The last of those is a conflict policy, whether or not anybody wrote one.
- **Backpressure** — when a replica falls behind, does the writer wait, drop it from the quorum and carry on, or never find out?
- **Contract** — what old and new members say to each other during a rolling upgrade. That is the compatibility mode, and it is what makes an upgrade without downtime legal at all.
- **Far side and departure** — the membership list and how stale it may be, and what a member leaving costs the ones that stay.

The store’s guarantees depend on the protocol around these channels. A primary can provide linearizable reads while replicating asynchronously, but promotion must fence the old primary and preserve the acknowledged history or explicitly weaken the contract. Placement matters too: three members over two zones lose their majority with the zone holding two.

::: example
#### The reader who arrives three years late

The projection and the search index were built together with the topic, and both work fine. Three years later somebody adds a backfill reader, which replays from offset zero to fill a new analytics store.

And everything that now goes wrong was decided — or, more often, not decided — on the day the topic was created.

- **The schema.** Test the current reader against every writer schema retained in the replay window, or provide tested migrations/upcasters. Last-version backward compatibility is not transitive. Choose an all-history check, such as BACKWARD_TRANSITIVE where applicable, when the requirement is to replay all retained history.
- **Retention.** If retention is seven days, there is no offset zero to replay from. The reader has not failed; the data is simply gone, and the “replayable truth” everybody believed in turns out to have been a projection with a week's memory.
- **Deduplication.** Rebalance and backfill can redeliver inputs long after the first processing attempt. Couple the effect, deduplication record and saved result atomically, retain them for the replay window, and reject stale versions or rebuild into a separate generation. A key alone does not prevent duplicates or stale overwrites.
- **Backpressure.** A reader replaying three years of history at full speed is a load test of every downstream store it writes to, and it arrives unannounced. The lag metric is the only signal there is, and only if somebody happens to be watching it.

**Not one of these is a bug in the broker.** Each one is a property of one of the three primitives, on an edge that got one label and one default. That is what the decomposition is for: it adds no work — it shows you the work you owed all along.
:::

## Now count what the design costs

Chapter 04 divided the demand figures and put the second arithmetic pass off until there was a graph to run it on. Now there is one. So this is the moment — while the choices are still cheap to undo, and before anyone has written a line of the implementation.

| Quantity | How it comes out |
|---|---|
| **Write amplification** | How many stores one client write ultimately touches: the truth store, the log, each projection, the search document, the cache invalidation. Chapter 05's example was [3×]{.num} and a real system reaching [5×]{.num} is unremarkable. **This number exists only because you chose that many derived stores** |
| **Read amplification** | Hops and fan-out per client read. Each runtime split you bought above adds to it, and each hop spends part of an inherited latency budget |
| **Per-store rate** | Client rate × amplification × peak factor — computed for each store, not for the system as a whole |
| **Node counts** | Per-store rate ÷ what one node of the store you actually chose manages, divided again by the utilisation you are willing to run at. Chapter 04's anchors only ever answered whether to distribute; they are not what you size with. Size for roughly half, never for full — a store at 90% has no room for a failover, a compaction, or a Monday |
| **Stored bytes** | Logical volume × replication factor × index overhead ÷ compression. Three replicas means three times the figure chapter 04 computed |
| **Replica counts** | From the durability and availability promises, not from a default. Two nodes for throughput and two for availability are the same picture and different designs |
| **Partitions** | At least throughput ÷ what one partition carries, and at least the number of consumers you mean to run in parallel — and say how the count changes later, because a partitioning you cannot change is a decision you only get to make once |
| **Egress** | Cross-unit and cross-region traffic. Frequently the line item that surprises people, and it grows with exactly the splits this chapter warned about |
| **Cost per request** | The whole thing divided by the traffic, compared against the ceiling recorded in chapter 03. If this cannot be computed, the operating envelope was never really filled in |

Table: Every term here is a property of the design you just drew, which is exactly why it could not be computed earlier. {cols="26%"}

Two rules ride on that table. **Size for N−1**: capacity that assumes every node and every zone is present is not capacity, it is a hope with a spreadsheet. **And let the result reverse the choice.** If the sizing comes out at forty nodes for twelve transactions a second, the store was chosen wrongly — go back to chapter 05's family table, do not accept the cluster. If it comes out at one node with headroom, delete the distribution and say why.

And one habit I would ask you to adopt, because it catches a failure the deletion test cannot. **Record the ratio beside each citation: demanded against supplied.** A mechanism can be cited perfectly well and still be wildly out of proportion to the thing that cites it.

- **Near 1** — the mechanism is sized to its requirement. Nothing more to say.
- **Tens** — that is headroom, which is legitimate, but the factor has to be named. Contracted growth is a requirement too, and margin against it is a choice, but only once the number is written down.
- **Hundreds or thousands** — the requirement cannot tell the choices apart. Something that handles a million writes a second, cited by a requirement for two hundred, was not chosen by that requirement. It was chosen for some other reason, and that other reason is the one that should have been written down.

**And a fourth field, filled in at the same moment: what the mechanism introduces.** Demanded, supplied and the ratio between them say why a mechanism is there. They say nothing about what it brought along with it — and every choice brings something: a constraint, a failure mode, a debt. A cache introduces a stale window, and a stampede when an entry expires. A conditional write introduces a per-key ceiling. Hedging introduces extra load on the tier being hedged. Two sources of truth introduce a reconciliation that somebody has to run. Each of those goes one of three ways: a mechanism that answers it cites it — chapter 11's parent decision, only recorded now rather than reconstructed in a review — or it goes onto the degradation ladder or the risk register, or it is accepted in writing. An introduced cost that nobody records is how a design grows mechanisms whose citations nobody can see.

::: warn
**Splitting first and deriving afterwards.** The costs in the right-hand column of the phase-change table arrive whether or not anyone named a force. A split that collects all of them without citing one of the six is the granularity version of an uncited mechanism, and it gets deleted the same way — except that by then it has a pipeline, a dashboard, an on-call rota and a versioned contract, and somebody has to unpick every one of them.
:::

::: thread
#### The first split, and the eight properties it costs

So does the thumbnailer get its own runnable unit? It cites **independent scaling**, and the citation holds up: resizing is CPU-heavy and comes in bursts, so co-locating it with the upload endpoint means one person's upload waits behind somebody else's four resizes. That is one of the six forces, and so the split is bought, not assumed.

It costs one brokered edge — and by this chapter's own knife that is three things, not one: the upload endpoint's producer channel, a queue, which is a store with a per-message lifecycle, and the thumbnailer's consumer channel. The two ends belong to two units now, so where it matters the line below says whose it is. (The thumbnailer's own reads and writes against the object store and the catalogue are channels as well; they take the answers the upload endpoint already gave for those two stores, with a timeout of their own.) Here are the eight properties, written down once, now, instead of defaulted:

- **Sync or async** — async. The viewer's 60 seconds are what make it possible — nothing has to be resized while the uploader waits — and the rung 4 the uploader was promised is what makes it legal.
- **Guarantee** — at-least-once on both sides: the producer waits for the broker's acknowledgement, the consumer commits after the resize. The receiver’s conditional output writes and replay rules make duplicate delivery safe; they do not guarantee eventual delivery without retained inputs and retry/recovery obligations.
- **Ordering key** — the photo id, chosen by the producer. A photo's resize and its later deletion must not swap places; two different photos have nothing to do with each other.
- **Backpressure** — a bounded queue, and the bound is the producer's problem. On overflow, shed to *pending* and let the catalogue row say so, rather than buffer without limit.
- **Message TTL** — 24 hours. Anything older than that should be re-derived from the catalogue, not delivered from a stale instruction.
- **Contract** — the upload endpoint owns the payload schema. A current reader must support every writer schema that can remain within the one-day queue window; test that set, including overlapping deployments, rather than assuming one-step backward compatibility covers it.
- **Far side** — the broker answers it, for the consumer's end. A brokered asynchronous channel resolves its far side through the consumer group rather than through DNS, so the staleness bound here is the rebalance interval: that is how long a resize can sit assigned to a worker that has already gone.
- **Departure** — gracefully, the worker finishes the resize it is holding, commits, and leaves the group. Ungracefully, the resize is redelivered once the assignment expires, and costs nothing — because chapter 06 already made the receiver idempotent. That is the second line on this list one decision has paid for.

And the ninth line, inherited rather than chosen. The uploader's five seconds cover the original and the catalogue row — two stores that no transaction spans, so the rule above is kept by ordering: the blob first, the row second. A crash in between leaves a blob with no row, which was never acknowledged, harms nobody, and is what the reconciliation of originals against rows in chapter 11 finds and removes. It never leaves a row pointing at nothing. The enqueue is not a third write in the same handler: that would be the dual write this chapter has just warned about, so the instruction is drained from the row's *pending* state by an outbox, and the producer's timeout is a slice of those five seconds. (That is the fourth field at work: the split introduced a queue, the queue introduced a dual write, and the outbox is the mechanism that cites it.) The resize itself spends a different budget: the viewer's [60 s]{.num}, which is how long a new photo may go without its sizes.

Then the capacity pass. Chapter 05 left us with three stores and six writes for every upload. The queue makes it four stores and eight writes: the enqueue is a write to a store too, and so is the change of state on the catalogue row when the sizes land. Read amplification at the origin is a single hop, because the CDN absorbs the rest.

**Per-store rates, at peak.** The catalogue takes one row per upload and one change of state when the sizes land — [10]{.num} writes a second — plus the [5]{.num} origin reads a second the CDN lets through. The relational store the team already runs is good for a few thousand simple transactions a second on one node — **assumed**, until somebody load-tests this schema on it — so that is one node at well under one per cent, and a second one beside it that the acknowledgement bought in chapter 05, not the load. That second node is a replica, and the channel between the two is synchronous — *safely stored* needs the row in two places — so its round trip comes out of the uploader's five seconds, and it sits in the region's other zone, or it shares the very failure it was bought to survive. The queue takes [5]{.num} messages a second: one partition's worth, and it gets two, one per worker. The thumbnailer does [20]{.num} resizes a second, four per upload, and at an **assumed** tenth of a CPU-second each that is two cores: so two workers of two cores, and losing one still leaves the peak covered. That is N−1, and it is also the entire fleet.

**Stored bytes.** Originals at [55 TB]{.num} a year. Four sizes of about [40 KB]{.num} add [160 KB]{.num} to every [3 MB]{.num} original — five per cent. Replication is the object store's own, and it is inside its price.

**Cost, in both of chapter 03's units.** A stored gigabyte-month is the provider's [$0.02]{.num} plus five per cent for the sizes — [$0.021]{.num} against a ceiling of [$0.03]{.num}, a ratio of 1.4, sized to the job. A thousand views of thumbnails is [40 MB]{.num} through the CDN, and at the [$0.02]{.num} a gigabyte the deal gives us that is under a tenth of a cent against a ceiling of one cent: a ratio of about twelve, and the headroom has a name — the misses, which are served from the origin and cost more. The CDN's price is **contractual** — it is in the deal we hold. The storage price is the provider's list price, **assumed** until the first invoice says otherwise. **Both sums can be done, and that is how you know the envelope was really filled in.**
:::

::: rule
Every edge that crosses a runtime boundary declares eight properties and inherits a ninth. An edge that does not is not simple — it is undesigned.

And before buying the boundary, count the edges that will cross it. That count, multiplied by eight, is the specification work you are about to take on, and it should be compared against the force you are buying.
:::

The specification’s **step 05, trust**, governs the access and erasure contracts. Authenticate the caller, then authorise the operation, object and tenant at every serving route. In the photo example a signed CDN address remains usable until expiry, so a catalogue check at issuance does not enforce immediate revocation. To promise that every server decision after revocation acknowledgement denies access, the CDN route must check a sufficiently current permission version and fail closed when it cannot, or acknowledgement must wait for a proved invalidation barrier. Exported client copies are outside that server-side promise. The example’s revocation mechanism remains an unresolved obligation until that protocol is chosen and exercised. Erasure separately inventories originals, thumbnails, caches, logs, backups and key copies, with deletion deadlines and replay/restore guards; destroying an original’s key does not erase plaintext thumbnails.

Everything so far, though, has quietly assumed that the parts work. Part III stops assuming.

::: owes
- Specification [Naming concepts and contracts](../method.html#naming) — scoped terms, preserved behavioural distinctions and the ANSI/NISO Z39.19-2005 (R2010) adaptation
- Specification [step 04 · Storage & transport](../method.html#s04) — the eight channel properties and the inherited latency budget, granularity as three independent axes, the phase change, the six forces, the channels inside a store that several processes play, the clustered runnable unit, and the sizing pass with its proportionality ratio and what each choice introduces
- Specification [§02 · Primitives](../method.html#prim) — decomposing a technology into primitives, and the schema as an accidental published API
- Repo topology, the third granularity axis, is deferred to Part III, where the published-interface line from chapter 03 is spent
- Not carried by the book: [step 05 · Trust](../method.html#s05) — identity propagation, enforcement points, the access matrix, tenancy, erasure, audit and residency. The specification governs
:::
