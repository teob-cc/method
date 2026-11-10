# CLAUDE.md

The sources of teob.cc/method — the Outside-In Method's specification, book, foreword, worked example, derivations,
evidence note and landing — and the agent skills. README.md explains the layout, the Markdown dialect and the build;
read it first.

## Rules

- **The specification governs.** `spec/` is the rule set; the book, the derivations, the worked example, the landing and
  the skills are projections of it. A change to the method lands in `spec/` first, then propagates; the skills' step
  reference is generated (`npm run skills`), never edited.
- **Every claim about a source is verified against the source before it is written.** Every figure carries its provenance:
  measured, contractual or assumed. Where a source could not be reached, the text says so (the derivations and the
  foreword already do).
- **Stamps.** Bump the version stamp of the piece you change (`spec/spec.yaml`, `book/book.yaml`, a piece's front
  matter) and the "applies V4.x" lines of what tracks it. A stamp asserts no release; a git tag `YYYY.MM.DD` does.
- **Edit sources, never `dist/`** (build output) and never `plugins/outside-in/skills/derive/references/ten-steps.md`
  (generated). `npm test` must pass before a commit: it builds, checks links, anchors and tag balance, and checks the
  generated reference.
- **Figures** are hand-authored SVG files. After changing one, look at it: text overflow shows only under zoom; the
  checker estimates width as characters × font-size × 0.6 against the viewBox and warns.
- **Anchors** `#claim #prim #naming #map #steps #s01…#s10 #disc #amend #anti #run #example #lineage` are cited by the
  book, the derivations and the skills. Do not rename them.
- **Voice.** The texts are written in the author's first-person voice. Do not re-voice; change what a change requires.
- **No plan files here.** Plans, status and design records are Jira issues in the project CORE
  (https://teob.atlassian.net, epic CORE-662 for the move and the amendments list); the notes of a session stay in its
  scratchpad. `HISTORY.md` is a record, not a plan.
- **Publisher** Lambda House, licence MIT. The repository is public: nothing private, no credentials, no quotations
  beyond what the derivations already carry (the interview books are referred to loosely on purpose).

## Serving

teob.cc/method is served by teob's showcase image. teob's `website/` build downloads the release named in
`website/method.lock.json` from this repository's GitHub releases and places it under `public/method/`; a new release
reaches the site when that lock file is bumped in teob. Tag a release only from a green `main`; the tag alone publishes nothing, the `Release` workflow is dispatched by hand with it.
