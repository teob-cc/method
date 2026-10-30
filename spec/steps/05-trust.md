---
number: "05"
id: "s05"
title: "Trust"
phase: "II"
---

::: def
Enforcement. The trust context came from the client step and the classification from the data step; this step decides what actually stops the wrong person from reading the wrong thing, and how erasure is executed. It sits after storage on purpose: enforcement mechanisms — row-level scoping, per-region stores, crypto-shredding — are properties of stores and channels, so they are chosen against a graph that exists. The classification driving them was fixed at the data step, which is what keeps the feedback loop rare.
:::

::: asks
ASKS · Who may see which data, under what authority, enforced where, provable to whom, and erasable how?
:::

- **Identity propagation.** The caller's identity travels with the request across every hop, rather than dissolving into a trusted internal network at the first boundary. Decide whether downstream hops re-verify or trust an asserted context, and what stops that assertion from being forged.
- **Enforcement points.** For each data class, name the single surface that authorises access to it. Authorisation checked in many places drifts; checked in one place, it can be audited.
- **Sensitivity × access matrix.** Take the classification from the data step and map each level to who may read, who may write, and what is logged when they do. A small matrix beats prose, and its empty cells are the interesting part.
- **Tenancy and isolation.** Shared everything, shared store with row-level scoping, or store-per-tenant. The decision is driven by blast radius and noisy-neighbour risk as much as by compliance, and it changes the store choices made in the previous step.
- **Sending data to a model is an export, and the boundary moves.** Where inference runs outside your control, every prompt is a data-egress event and the classification from step 03 applies unchanged: if a class may not leave the building, it may not go in a prompt either — including inside a retrieved document the caller never saw. Name what may be sent, what must be redacted first, whether prompts and outputs are retained or trained on by the provider, and which enforcement point strips what. Retrieval is where this leaks: the surface authorises the user, then a retrieval step assembles context from documents the user was never entitled to, and the model faithfully reads it out. **The authorisation must run over the retrieved set, not only over the request.**
- **Prompt injection is not a model bug, it is a trust-zone error.** Any text reaching a model — user input, a fetched page, a document, a tool result — is untrusted input arriving on a path with no schema. Treat model output as untrusted too: it may not authorise, and it may not be executed or interpolated into a privileged action without a check that does not itself involve the model. Where a model can call tools, the tools carry the authorisation, not the prompt.
- **Encryption with a purpose.** In transit is table stakes; at rest protects the disposed disk; field-level protects against the operator and the leaked backup. Each layer defends a different adversary — name the adversary, or the encryption is decoration.
- **Erasure mechanism.** Crypto-shredding disposes of ciphertext only when every usable copy of its protecting keys is destroyed. Inventory plaintext derivatives, indexes, caches, exports, backups and key copies separately; give each a deletion or expiry deadline, an owner and a verification path. Rebuilding must respect erasure markers and must not resurrect deleted material. A rebuild that might happen someday is not an erasure deadline. Custodial retirement uses the same inventory on a different trigger.
- **Audit as a data class of its own**: append-only, separately retained, with its own access rules — including who may read the audit log.
- **A replica is a copy.** A replication channel into another region is an export like any other, and the residency check fails closed on it too; a replication link inside the private network is still a channel crossing between machines, and the classification decides whether it is encrypted, not the network's name.
- **Residency enforcement.** The constraint was recorded with the data classes; here it becomes a mechanism — routing, per-region stores, and a check that fails closed when a class would cross a border it may not cross.

::: prod
→ PRODUCES: a sensitivity × access matrix, a list of enforcement points, a tenancy model, and an erasure procedure.
:::

::: p {style="margin-top:8px"}
**How deep to go.** For an ordinary internal system this step is a few minutes of annotation. It becomes a subsystem of its own — with its own graph, its own failure analysis, and often its own team — when any of these hold: regulated personal or health data, money movement, multi-tenant isolation between competitors, user-supplied content or code, or an adversary with a funded motive. Escalate on those triggers, not by default.
:::

::: fb
FEEDBACK — residency or tenancy rules may split a data class in two, or force a store-per-tenant layout. Return to the data and storage steps and re-derive rather than patching over it.
:::
