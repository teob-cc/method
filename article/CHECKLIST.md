# Publish checklist — Medium

> ARTICLE PUBLISH PACKAGE · V6 · 2026-10-12 · method V4.13; source-verification limits remain in the article.
> Source of truth: `../article-draft.html` V6. This folder: `article.md` (paste-ready) + `fig1.png`–`fig7.png` (2×, paper background, labels stripped).

## Settings, decided

- **Title:** Twelve writes a second does not need a cluster
- **Subtitle** (add via ⋯ → "Add subtitle" or the field under the title): A published book says it does. One question deletes half the boxes on most system diagrams — including several on mine.
- **Tags (5):** System Design · Software Architecture · Distributed Systems · Software Engineering · Programming
  — *Programming* over *Interviewing*, per the title's engineer-to-engineer register. Swap only if reach matters more than fit.
- **No canonical URL setting needed** — this is an original, not an import. The method link in the close carries the SEO obligation.

## Assembly

1. medium.com → Write. Paste `article.md` section by section (Medium keeps **bold**/*italic* on paste from a rendered markdown view; pasting raw markdown loses them — open article.md in a renderer first, or use Medium's markdown import via a gist if preferred).
2. At each `[FIG n]` marker: delete the marker line, + → image → upload `fign.png`, paste the caption line into Medium's caption field. **Fig 1 goes directly under the title — it is the lead/social image.**
3. The two `[pull quote]` markers: select the quoted sentence, press the quote button **twice** (second press = large pull-quote style).
4. Blockquotes (the book quotes, the audience-gate paragraph, the two "say" lines): quote button **once**.
5. Preview in dark mode once — the figures render on their own light ground by design; fig 7 is the only dark one and reverses well.
6. Publish. Then check the story's social card picked up fig 1.

## Alt text per figure (accessibility — set via image ⋯ → Alt text)

- **fig1** — 128 red squares against 3 green ones. The book leaves "between 1 and 128 hosts" open; a division chain — a billion a day over 86,400 seconds, times peak five, over 100k ops per node — arrives at two nodes, three with failover.
- **fig2** — The reverse audit: name the obligations that need a component, including recovery. Investigate missing rationale before removal; a shared component can serve several requirements.
- **fig3** — Two reference cards: arithmetic anchors (a day is 10⁵ seconds; 1M/day is 12 rps; 1B×1KB is 1TB) and conservative per-node feasibility anchors (in-memory KV ~100k ops/s; relational ~5–20k tps).
- **fig4** — Three acknowledgement kinds side by side: receipt (one durable append), reservation (holds a contended resource, needs the strict store), completion (final state now — the expensive one, frequently unnecessary).
- **fig5** — A four-row traceability map: testable requirement, mechanism, verified-by. Latency, durability, partner burst and search staleness, each with the metric that would show it broken.
- **fig6** — Four adjacent areas — observability, operations, delivery, codebase lifecycle — each with what derives it and what skipping it looks like.
- **fig7** — Dark strip, "the method in nine lines": clients are the cause; three acknowledgements, three prices; uncited mechanism = investigate, unmapped requirement = gap.

## After publishing

- Drop the URL back here; `deliverables.html` deliverable 5 flips to *published* with the link.
- Follow-ups #2 (the ladder) · #3 (a log is not one thing) · #4 (the primitives) are promised in the close and sequenced in `../article-draft.html`'s production notes.
