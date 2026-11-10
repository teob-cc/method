# The Outside-In Method — sources

The sources of **<https://teob.cc/method>**: the specification, the book *Systems, from the outside in*, the foreword,
the worked example, the eight derivations, the evidence note and the landing, as Markdown and SVG, with the build that
turns them into the site. The companion agent skills live here too, in `plugins/outside-in/`.

Published by Lambda House under the [MIT licence](LICENSE).

## Layout

| Path | What |
|---|---|
| `spec/` | **The specification**, `method.html`: `spec.yaml` (title, stamp, order of sections, the four phases), `sections/*.md` one per numbered section, `steps/*.md` one per step, `figures/*.svg` |
| `book/` | **The book**: `book.yaml`, `index.md`, `chapters/*.md`, `figures/*.svg`, `figures/prompts/` (image-model prompts, working material) |
| `foreword/` | **The foreword**, `foreword.html` |
| `worked-example/` | **Worked example A**, ticket booking, `worked-example.html`, with its figure |
| `derivations/` | **The eight derivations** and their index, `derivations/*.html`; `derivations.yaml` gives the order |
| `evidence/` | The evidence note on the stress demonstration |
| `landing/` | **The landing**, `/method/`, in teob.cc's dark tokens |
| `theme/` | One stylesheet per page kind (`spec.css`, also the worked example; `derivation.css`; `foreword.css`; `book.css`; `landing.css`; `evidence.css`), the page templates, and the vendored fonts (IBM Plex, Inter, JetBrains Mono: latin subsets, SIL OFL) |
| `og/` | The social cards: HTML sources, the rendered PNGs, `render.sh` |
| `plugins/outside-in/` | **The agent skills** `derive` and `review`; `skills/derive/references/ten-steps.md` is generated from `spec/steps/` |
| `article/` | The Medium article package: `article.md`, its figures, the publish checklist, and the draft with its production notes |
| `build/` | The build (`build.mjs`), the dev server (`serve.mjs`), the checks (`check.mjs`), the skills generator (`skills.mjs`) |
| `tools/migration/` | How these sources were produced from the HTML pages of teob's `website/` on 2026-10-30, and the comparison that proved the move lossless. A record, not part of the build |
| `HISTORY.md` | The corpus's working index up to the move, as it stood |
| `dist/` | Build output, not in git |

## Working on it

```bash
npm ci
npm run dev        # http://localhost:5174/method/ — rebuilds on every save
npm run build      # dist/
npm run check      # links and anchors resolve, tags balance, SVG text fits (estimate)
npm run skills     # regenerate the skills' ten-steps.md from the specification
npm test           # build + check + the generated reference is up to date (what CI runs)
```

A mistake in a source stops the build with the file and what is wrong.

## Versions, stamps and releases

Every piece carries its own stamp in its front matter (the specification's `version` and `stamp` in `spec/spec.yaml`;
the book's in `book/book.yaml`; the foreword's, the worked example's and each derivation's in their `stamp`; the evidence note's in its first line). Bump the
stamp of what changed, and the "applies V4.x" lines of the pieces that track it.

A release is made by hand: push a git tag of the form `2026.10.30` (a date, no `v`), then dispatch the `Release`
workflow with that tag (`gh workflow run release.yml -f tag=2026.10.30`). It makes a GitHub release carrying the built site,
`method-dist-<tag>.tar.gz` with `SHA256SUMS`. teob's `website/` build fetches the release named in its lock file and
checks the digest, so teob.cc/method shows a release, never a working tree.

## What the Markdown can say

Plain Markdown (markdown-it, no typographer), with front matter and a few constructs. `**bold**` renders `<b>`,
`` `code` `` renders `<span class="code">`, a bullet list renders `<ul class="tight">`. Raw HTML is allowed wherever
Markdown runs out — a few tables with spanning cells and the landing's bespoke blocks use it.

**A marked span** — `[text]{.class}`: `[60 s]{.num}` a figure with its unit (red monospace), `[term]{.term}` a term at its
definition (the book), `[Wrong]{.rate}` the forbidden thing (the book); any other class renders as a span of that class.

**A block** — a line of `::: name`, the content, a line of `:::`. Blocks nest. A name may take an attribute block:
`::: mod {#claim tab="01 · CLAIM"}`, `::: p {style="margin-top:8px"}`, `::: {.wrap}` (no name: a plain div).

| Block | Renders as |
|---|---|
| `lede` `def` `asks` `prod` `meta` `prov` `subtitle` `standfirst` `lead` `bigline` `p` | one paragraph of that class (`p` adds no class) |
| `tab` `kick` `fb` `say` `warn` `note` `good` `concede` `own` `verdict` `cell` | one `div` of that class holding inline content |
| `mod {#id tab="…"}` | a numbered module: the tab down the side, the body beside it |
| `section {#id .class}` | a `<section>` (the landing) |
| `toc` | the contents line, `<nav class="toc">` |
| `footer` | a page footer, one source line per line |
| `kpi` | the big-number row: items of `- **the number** · what it is` |
| `figure` | a figure: `![description](../figures/name.svg)`, a blank line, the caption |
| `owes` | the book's closing pointer into the specification |
| `grid2` `grid3` `card` `sys` `scroll` `rule` `primer` `example` `thread` `aside`, or any other name | a `div` of that class around blocks |

In the book, boxes such as `warn` and `rule` wrap their content in paragraphs, as its stylesheet expects; everywhere else
the names above hold inline content.

**Attributes** — `{#id .class key="value"}`: after a block's name, at the end of a heading line
(`### Names carry a scope and a contract {#naming}`), or on a line of its own under a table or a list. Under a
table it may also carry `cols="26% *"` (column widths, `*` leaves one to the browser) and may be preceded by
`Table: the caption`. A table cell may start with one: `| {.num} 100 /s | …`.

**A figure** is an SVG file beside the piece, inlined into the page at build time. Hand-author it; keep its text inside
its `viewBox` (`npm run check` estimates each text's width as characters × font-size × 0.6 and warns).

## The specification's structure

`spec/spec.yaml` holds what the sections share: the title, the stamp, the update notes, the contents line, the licence
line, the order of `sections`, the `tail` (the closing ten lines), and the four `phases` with their steps. A section file
has `id` and `tab` in its front matter and its body is the module's content; the steps section carries `{{steps}}` on a
line of its own where the phases and steps go. A step file has `number`, `id` (`s01` … `s10`, the anchors the skills
and the derivations cite), `title` and `phase`. The build makes `method.html` and one page per step under `steps/`.

Every anchor in the specification is an id in a source: `#claim #prim #naming #map #steps #s01…#s10 #disc #amend #anti
#run #example #lineage`. Keep them: the book, the derivations and the skills point at them.

## The derivations

`derivations/derivations.yaml` lists the eight in order; each file's front matter carries `number`, `title`, a `short`
title for the previous/next navigation where the title is long, the `stamp` and the `subtitle`. The navigation of every
page is made from the list, so adding a derivation is a file and a line.

## The skills

```
/plugin marketplace add teob-cc/method
/plugin install outside-in@method
```

`plugins/outside-in/skills/derive/SKILL.md` and `skills/review/SKILL.md` are hand-written. `skills/derive/references/ten-steps.md`
is **generated** from `spec/steps/*.md` by `npm run skills` and committed; CI fails when it is out of date. Edit the
specification, regenerate, commit both. The former home of the skills, `teob-cc/teob-method`, points here.

## The move

The corpus lived in teob's `website/` as hand-authored HTML until 2026-10-30. `tools/migration/html2md.py` produced
these sources from those pages; `tools/migration/compare.py` checked every rebuilt page against its original: the same
visible text, anchors, links, figures and metadata. The record of what the corpus was, and where each idea landed, is
`HISTORY.md`. Plans and the amendments proposed at the move are in the Jira project CORE, epic CORE-662.
