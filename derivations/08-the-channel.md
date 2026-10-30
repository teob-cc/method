---
kind: "derivation"
title: "The channel, and what it may be trusted with"
stamp: "DERIVATION 08 · V1.5 · 2026-10-12 · THE OUTSIDE-IN METHOD V4.13"
short: "The channel"
number: "08"
subtitle: "**A messaging app.** Every arrow on the diagram is a decision with eight properties, two of which are the failure mode. Draw one without answering them, and you have published an API by accident — and if the payload is end-to-end encrypted, you have also just decided that your own servers are couriers, not participants."
html_title: "The channel, and what it may be trusted with · Outside-In Derivations"
meta:
---

::: meta
Evidence status: worked argument from reported source inputs. Source criticisms await re-verification against the editions identified below; capacity figures are assumptions unless explicitly attributed. No implementation or production test is claimed.
:::

::: mod {tab="08 · THE CHANNEL"}
::: kick
The system · one-to-one and small-group text messaging
:::

## The channel, and what it may be trusted with

::: lede
Boxes get all the attention, arrows carry all the risk. A channel is a first-class primitive with eight properties, each of which must be answered, plus a ninth it inherits rather than chooses. The commonest defect in a distributed design is not a badly chosen store — it is an arrow drawn between two boxes with none of the eight stated, so the guarantee becomes whatever the first implementation happened to do. This system adds a constraint that makes the point unavoidable: once messages are encrypted end to end, the server cannot read what it is moving, and every mechanism that quietly assumed otherwise has to be redesigned or deleted.
:::

::: rule
Eight per edge: **sync or async** · **delivery guarantee** · **ordering key** · **backpressure** · **message time-to-live** · **payload contract and compatibility mode** · **far side** · **departure**. The ninth, the **latency budget**, is not chosen — it is a slice of the caller's, granted from outside and divided across the hops, which is why a timeout invented locally is always wrong. On an asynchronous channel the schema *is* the API, and it has consumers you have never met.
:::

### The arithmetic, which deletes the wrong worry

::: sys
::: kpi
- **~1.7k msg/s** · average — a hundred thousand concurrent users at one message a minute each
- **6.7 MB/s** · write bandwidth at four kilobytes a message. Trivial
- **×5 000** · the fan-out tail — a thousand recipients across five devices each
- **2–10 hosts** · the connection tier — those hundred thousand users at an *assumed* one live connection each and ten to fifty thousand per host. All five devices connected would make it 10–50
:::

Bandwidth is nothing here. Message rate is nothing either. **The sizing drivers are connection count and the fan-out tail** — and neither of those is the number a component-first sketch reaches for. One pathological group message generates about three seconds of average system load in a single burst, which means the tail — not the mean — is what sets the topic partitioning and the backpressure policy.

::: warn {data-l="RATIO: 100× TO 1000×"}
The published treatment asserts a connection tier of "thousands of hosts". A few pages earlier it cites connection-handling technology capable of millions of concurrent connections per machine. A hundred thousand users holding one connection each, at even a cautious ten to fifty thousand connections per host, need between two and ten hosts — ten to fifty if every one of them kept five devices connected. The gap between asserted and derived is two to three orders of magnitude, and more than one even at five devices each — and this time the rule is not catching an over-provision but a **contradiction**: two numbers from the same chapter that cannot both be true. Recording the ratio is what makes that visible, because neither number looks wrong on its own.
:::
:::

### The properties, made concrete

::: sys
::: scroll
| Property | On the send path here | What goes wrong if unstated |
|---|---|---|
| **Sync / async** | Client blocks for a receipt, and that acknowledgement is commit-bearing — "sent" is true only because the server answered, so a lost reply leaves an unknown outcome with a stable operation handle and a status/reconciliation path. Report pending acceptance only when durable acceptance is known, and refusal only when non-acceptance is known. Delivery to the recipient is async | The sender's spinner waits on the recipient's device being awake |
| **Delivery guarantee** | At-least-once, with deduplication at the consumer | Duplicate messages in a conversation, which users read as a bug in the product |
| **Ordering key** | The conversation. Order is preserved *within* a conversation and nowhere else | Global ordering promised, paid for, and not needed; or per-conversation ordering assumed and not delivered |
| **Backpressure** | Bounded per-recipient queue; shed the fan-out tail before the transactional path | Unbounded queueing — a failure mode with a delay fuse |
| **Message TTL** | A delivery still worth attempting after a week? The answer is a product decision | Retry storms delivering messages nobody wants any more |
| **Contract** | Envelope schema, versioned; ciphertext is opaque to it | The undeclared async API — consumers you cannot enumerate, on a schema nobody owns |
| **Far side** | Which connection host currently holds this recipient's socket — a session registry, read on every delivery, with a stated bound on how stale that answer may be | "Delivered" quietly comes to mean "handed to a host that may have died a second ago" |
| **Departure** | Drain: refuse new sockets, wait out the registry bound, close with a staggered reconnect hint. Crash: devices learn by keepalive expiry, and the registry is wrong for its full bound | A rolling deploy becomes the largest burst the system ever sees, and messages routed during the gap land nowhere |
:::

::: note {data-l="EFFECTIVELY-ONCE NEEDS AN EFFECT PROTOCOL"}
At-least-once delivery can support effectively-once effects only with a defined consumer protocol. Couple the deduplication record, effect and saved result atomically, or make the conditional effect naturally idempotent. State key scope, payload mismatch, concurrent retry and retention rules. The recipient’s acknowledgement and a broker guarantee alone do not establish those properties.
:::

Ordering has the same shape. The design settles on identifiers unique within a conversation — correct, and sufficient — and then a device-synchronisation mechanism compares a *single* high-water mark per device against them. But one scalar cannot order messages drawn from many independent identifier spaces. The sync mechanism quietly assumes the global ordering the identifier decision deliberately discarded — and the two sit four pages apart.
:::

### What the connection tier costs when a host leaves

::: sys
The connection tier is the one place in this system where the far side refuses to stay an abstraction. A device does not talk to *the service*; it holds a long-lived socket to one named host, and every fan-out has to know which host that is. That knowledge is a **store** — a session registry — read through a **projection** on every delivery, so it owes a staleness bound like any other projection. Here the bound is unusually concrete: it is how long a message can be routed to a host that no longer holds the recipient.

::: kpi
- **10–50%** · of live connections re-established when one host of the derived two-to-ten is replaced
- **2–10×** · per rolling deploy — once per host, which makes departure the normal weekly event rather than an incident
- **~10³/s** · reconnections, if one host's tens of thousands are spread over ten seconds — *assumed* window, and the assumption is the design decision
- **vs 1.7k msg/s** · so the reconnect burst rivals everything else the system does — from the tier whose steady-state job is to hold sockets open and do nothing
:::

**The far side resolves twice here, and the two failures are not alike.** A device resolving a host to connect *to* gets a stale answer occasionally, fails to connect, and retries — cheap, and self-correcting. The fan-out path resolving which host holds a recipient gets a stale answer and delivers a message to nobody — and whether that message then falls into the store-and-forward path or is simply lost is decided by a bound most designs never write down. State the bound and the offline path is entered on purpose. Leave it unstated and the system has a silent loss window whose length is whatever the registry's TTL happened to default to.

**Departure has two answers, and the graceful one is derived.** Refuse new sockets, wait out the registry bound so fan-out stops routing here, and only then close what is open — with a staggered reconnect hint, because tens of thousands of devices told to come back at the same instant are precisely the synchronised herd the retry discipline exists to prevent, pointed at the authentication path instead of at a dependency. The ungraceful answer costs more than it looks: a host that is killed is not *announced* to anyone, so each device learns by keepalive expiry and the detection interval is the keepalive interval — a number this design must choose and usually does not. For that whole interval the registry is confidently wrong.

::: warn {data-l="THE SAME RATIO, READ FORWARD"}
The asserted figure does not merely over-provision — it conceals this entire section. At the treatment's "thousands of hosts", replacing one moves a tenth of a per cent of connections and departure is beneath notice. At the two to ten the division gives, replacing one moves between a tenth and a half of them, and departure is the largest event in the tier's week. The number was wrong in the capacity column and it was wrong again in the operations column — and the second consequence is the expensive one, because an over-provisioned tier can be trimmed later, while a departure story nobody wrote is discovered during a deploy.
:::
:::

### What end-to-end encryption does to the design

::: sys
Once the payload is opaque to the server, the trust boundary moves — and takes several mechanisms with it. **The server becomes a courier**: it routes, it retains, it fans out — and it cannot read, search, moderate or reconstruct. Everything that assumed server-side plaintext has to move to the client, or go.

- **Search moves to the device**, which means the index is per-device, rebuilt on a new device from history the device can decrypt — and the history it cannot decrypt is simply not searchable — a product decision to be stated, not a bug to be discovered.
- **Server-side moderation is gone.** What remains is reporting: a recipient voluntarily surrendering plaintext they already hold. Any design promising proactive moderation over an end-to-end channel is promising to break it.
- **Metadata is what leaks**, and it is not protected by the encryption. Who talks to whom, how often, how large, and when — a real trust finding that the encryption's presence tends to suppress rather than surface.
- **Retention depends on the key lifecycle.** A server archive of ciphertext supports history and device recovery while authorised clients retain or recover the keys. It becomes unreadable when all usable keys are gone. State key backup, device transfer, membership changes and erasure semantics before judging its capability or cost.

::: good {data-l="DESIGNED, NOT BOLTED ON"}
The right posture is to treat the server as deliberately untrusted from step one and let the constraint propagate — not to design a plaintext system and encrypt it afterwards, which produces a system with encryption and none of its guarantees.
:::
:::

### Naming the edge and preserving its meaning

A TEOB naming application: label the responsibility **recipient delivery channel**, declare its transport and retention role, and record the broker separately. A product name alone does not say whether the edge carries delivery requests, stored messages or device receipts. Define `MessageStored`, `DeviceReceived` and `UserRead` separately if the contract exposes those observations. The last one needs its own observable definition; a device receipt cannot establish that a human read anything.

If a published `Delivered` event previously meant broker acceptance, changing it to mean device receipt changes the contract even with identical JSON fields. Record the previous scope, replacement and effective version; review retained events, replay, old mobile clients and rolling deployments before migration. Preserve compatible aliases only when their meaning is unchanged. Avoid private abbreviations whose expansion consumers cannot determine. The names make the protocol reviewable; they do not establish its delivery guarantee.

### The general form

- **Answer eight questions per arrow, in writing.** An arrow with unstated properties is a promise nobody made and everybody will assume.
- **A brokered channel is specified more than once** — once for the producer, and once for *each* consumer. Their guarantees genuinely differ, and only the consumer can deduplicate. A store is brokered too: the session registry has a write path and a reader, each of them a channel owing the eight — and the staleness tolerance is the reader's to take.
- **Timeouts come from the caller's budget**, sliced across the hops. A locally invented timeout is a number with no owner.
- **Blocking answers two of the eight for you.** Nothing is queued to expire, so there is no TTL, and the delivery guarantee collapses to "it returned or it did not". Saying so explicitly is the point — and note that backpressure is *not* the third, however often it is counted as one: a blocking call waits in a connection pool, and the pool is a queue with a bound and an overflow policy.
- **The far side is a set, and it changes while you are talking to it.** Name what resolves it and the staleness bound of that answer — then derive the drain interval from the bound rather than choosing a round number. A drain shorter than the bound is a crash that files a ticket.
- **Decide the trust boundary before the mechanisms.** What the server may read determines what the server may do, and retrofitting that decision deletes work rather than adding it.
:::

::: footer
DERIVATION 08 · V1.5 · 2026-10-12 · APPLIES THE OUTSIDE-IN METHOD V4.13.
Source locator: Tan, *Acing the System Design Interview* (Manning, 2024), ch. 14, pp. 309–328. Locators and descriptions are inherited from the original reading notes; the full books were unavailable for independent re-verification in this revision. Treat claims about omissions or contradictions as provisional source readings. The conditional arithmetic and method arguments stand on the inputs reproduced here, not on a claim to have audited the complete books.
Naming reference: [ANSI/NISO Z39.19-2005 (R2010)](https://www.niso.org/publications/ansiniso-z3919-2005-r2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*, §§6.2.2–6.2.3, 6.6.3 and 11.3. The naming examples are TEOB adaptations for contracts, not further source-book findings or a claim of conformance to an API standard. See [the naming discipline](../method.html#naming).
Full method: [The Outside-In Method](../method.html) · [Worked example](../worked-example.html) · [Foreword](../foreword.html) · [MIT licence](../LICENSE).
:::
