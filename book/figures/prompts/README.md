# Figure prompts

Prompts for image models that draw the book's examples as isometric figures. One shared style, one block per
image. Model-agnostic: plain text, no model-specific switches.

## Making one image

1. Paste `00-style-bible.md` (the block inside it).
2. For a photo-system frame, paste `photo-scene.md` next.
3. Paste the image's own block.
4. Generate three or four, and run the block's "Check after generating" on each.

Then proofread every label against the block's LABELS list, character by character. The list is the only source
of text on the image; a word that is on the image and not in the list is an error, and so is the reverse.

## What was decided, and why the prompts look the way they do

| Question | Answer |
|---|---|
| Which examples | the photo system (twelve frames, one per chapter), worked A, B and C, the eight derivations: 23 images |
| Where they go | book and site pages, in the 920px column, 16:9 |
| Look | isometric scale model on the book's paper, in the book's colours and type |
| The one idea | every thing inside the boundary is tied by a cord to the outside fact that bought it; what was not bought stands outside as an empty red outline with its reason |
| Primitives | four fixed solids: doorway slab, ribbon, prism, cylinder; truth opaque, derived translucent |
| Text | drawn by the model from a verbatim list per image |
| Disputed figures | anything the cross-review flagged and the text has not yet settled stays off the image, listed under "Held back" in its block |

## Adapting to a model

- **Aspect ratio.** If the model takes the ratio or size as a setting, set 16:9 there as well. If it has no 16:9
  size, take its nearest landscape size and add: `Keep the whole composition inside a centred 16:9 area; the
  rest is plain paper.` Then crop.
- **Reference images.** Once one image is accepted, attach it to every later request and add: `Match the
  attached figure's projection, line weight, colours and lettering exactly.` For photo frames use the line in
  `photo-scene.md` instead, with the previous frame attached.
- **A wrong label on an otherwise good image.** Repair it by editing that region with the exact string, where
  the model can edit; regenerating the whole image moves everything else.
- **Too much lettering.** If labels come out misspelt, cut the block's list from the bottom of each group
  (tags before names) and move the cut labels into the page as text. Do not let the model abbreviate.

## The set

Three blocks are written as a pilot, one from each group: `photo-07.md`, `worked-C.md`, `derivation-08.md`.
They are written against book V1.4 and derivation 08 V1.3, and carry 30, 37 and 30 labels, so between them
they show how much lettering the model handles.

**The photo system**, frames 01 to 12: see the table in `photo-scene.md`.

**The worked systems**

| Image | Shows |
|---|---|
| Worked A · ticket booking | the first design; the interval that made a zero-tolerance count fire; the atomic reservation that closes the read–commit gap |
| Worked B · a read-heavy feed | fan-out on write and on read, split at a threshold derived from the freshness bound |
| Worked C · an internal service | nine things not bought, six that were, and the constraint behind each |

**The derivations**

| Image | Device | Proved on |
|---|---|---|
| 01 | the division | a rate limiter |
| 02 | the stop rule | a classifieds marketplace, a social feed |
| 03 | the missing root | a key-value store, a friend-graph feed |
| 04 | the invariant | a room-reservation system |
| 05 | the acknowledgement | a photo-sharing service |
| 06 | the projection | prefix autocomplete, a CDN, a ranking board |
| 07 | the client classes | a notification service |
| 08 | the channel | a messaging app under end-to-end encryption |

The derivations name their systems loosely and never name the books they argue with. The prompts keep to that.

## Placing an accepted image

`build.mjs` inlines SVG figures only. A raster figure needs a small addition there (an `<img>` and a copy into
`public/method/book/`); it is not written yet.
