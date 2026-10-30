# Style bible

Paste this first, then one image block (for a photo-system frame, `photo-scene.md` goes between the two).
It fixes everything the images share: the projection, the paper, the colours, the notation and the lettering
rules. An image block only says what stands where and which words appear.

```text
SERIES
Figures for "Systems, from the outside in", a book on system design. Each figure shows one system as an
isometric scale model standing on a sheet of paper. The system itself stands on a raised platform. Everything
outside the system stands on the bare paper around the platform. Thin cords tie each thing on the platform to
the outside fact that bought it. A thing with no cord would not be there.

FORMAT
Landscape, 16:9, at 4K if available, otherwise the highest resolution there is. A flat technical illustration:
not a photograph, not a 3D render, not a user-interface mock-up. Keep a clear margin of about 4% of the width
on every side.

CAMERA AND LIGHT
True isometric projection: orthographic, no perspective, no vanishing points, no depth of field. The same
viewing angle in every figure. The platform therefore shows four edges: a near-left edge and a near-right edge
meeting at the corner closest to the viewer, and a far-left edge and a far-right edge behind them.
Soft, even light from the upper left. Short, pale contact shadows under objects and nothing more dramatic.
Matte surfaces, like painted card. No gloss, no glow, no reflections, no colour gradients.

GROUND AND COLOUR
Ground: flat cool off-white paper, edge to edge, with no texture stronger than a faint paper grain.
Near-black ink for outlines and main lettering. Mid grey for secondary lettering. Pale grey for hairlines.
Object faces are near-white card on top and one step darker on the sides.
Deep blue marks anything derived or rebuildable.
Red is for numbers and for things that were not bought.
Dark green marks what this figure adds to the system.
Amber-brown marks something inherited or assumed.
Use no other hues anywhere.
The exact values, for mixing the colours only. They are paint, not text: no colour code, hash sign or bracket
is ever written on the image.
paper EFF2F1, ink 101820, grey 4A5560, hairline C9D2D4, card FBFCFB, blue 1B4F8A, red C21F2C, green 2E6B4F,
amber 8C5410.

NOTATION (identical in every figure; the type names below describe shapes and are never written on the image)
- The boundary: one low rectangular platform, about a tenth as high as it is wide, with a crisp ink edge.
  Everything the system owns stands on it.
- A surface, where a client touches the system: a thin upright slab with a doorway cut through it, standing
  exactly on the edge of the platform.
- A channel, which moves data between two things: a flat pale-grey ribbon lying on the platform with small ink
  chevrons along it showing direction. A synchronous channel is one unbroken ribbon. A queue or a log between two things is
  drawn as the three things it is: a ribbon into a small store, and a ribbon out of it for each reader.
- A processor, which derives data: an upright triangular prism.
- A store, which holds data: an upright cylinder. A store that is the truth is opaque with an ink-dark lid.
  A derived store is translucent blue with a dashed outline.
- A runnable unit: a thin tile lying on the platform under the things that deploy together. Two units are two
  tiles with a visible gap between them.
- A plain hairline between two things on the platform shows that one reads or writes the other. It is not a
  channel and carries no chevrons.
- The outside: upright rectangular placards standing on the bare paper, never on the platform. Clients stand off
  the near-left edge. The organisation that runs and pays for the system stands off the near-right edge.
  Services the system depends on stand off the far-right edge.
- A cord: one straight thin ink line lying on the ground, from the foot of a thing on the platform to the foot of
  the placard that bought it, with a small round pin at each end. Straight, never curved, never rising into
  the air. Draw exactly the cords the figure lists and no others. A cord may carry one small tag.
- Not bought: the same solid drawn as an empty red dashed outline with no fill and no shadow, standing on the
  bare paper in a row off the far-left edge, each with one red tag giving the reason.
There are no people, no devices, no buildings and no pictograms. Only these shapes.

LETTERING
A placard carries its own name on its face. All other lettering lies flat on the picture: horizontal, upright,
never drawn along a ribbon, a band or the platform, never onto the tilted faces of objects, never curved, never
in perspective. Three styles and no others:
- names of things: a bold condensed sans-serif in capitals (IBM Plex Sans Condensed, or the closest match);
- sentences: a plain sans-serif (IBM Plex Sans);
- numbers and tags: a monospace (IBM Plex Mono), with numbers in red.
Each label sits beside its object, joined to it by a short hairline where the pairing would otherwise be
unclear. No lettering is smaller than one forty-fifth of the image height.
Write exactly the labels listed under LABELS, character for character, including punctuation and the signs
· × —, each of them once. In that list the words before the colon say where a label goes and are not written;
only the words after it are. A thing with no entry under LABELS carries no lettering at all: do not name it.
Write nothing else: no extra captions, no legend, no colour codes, no watermark, no signature, no page number,
no filler text. If a label will not fit at the minimum size, leave it out; never shorten, reword or invent one.

LAYOUT
The title block sits in the top-left corner: one small line in blue capitals, and under it the title in large
bold condensed capitals. The platform sits slightly right of centre and fills about half the width.
Bottom-left, small, in grey: The Outside-In Method · teob.cc/method
Bottom-right, small, in grey: the figure id given in the block.

AVOID
Perspective, photorealism, glossy 3D rendering, neon, dark backgrounds, gradients, drop shadows under
lettering, people, faces, hands, mascots, company logos, cloud-vendor icons, server racks, padlocks, gears,
clouds, speech bubbles, emoji, decorative arrows, screenshots, misspelt words, invented words.
```

## Why it is written this way

- **One notation, four shapes.** A reader who has seen one figure can read the next. It is the book's own
  rule that every component declares which of four types it is, drawn. A brokered edge is therefore two
  ribbons around a store, as chapter 07 takes it apart, and never one arrow.
- **Lettering flat on the picture.** Text laid onto isometric faces is where image models misspell most, and it
  is unreadable at the 920px column the book sets figures in. One forty-fifth of the height is about 11px there.
  Placards are the exception: their names are large, and a board with its name beside it reads as two things.
- **Colours named, values listed once.** The first pilot printed the hex codes as lettering in front of the
  title and eleven names. The values now sit in one line marked as paint.
- **Cords are straight and on the ground.** Asked to arc above the platform, the first pilot drew long loops
  to a pin in the corner of the sheet.
- **Colour carries meaning, not mood.** The six colours are the book's own tokens (`theme/book.css`), with the
  same jobs: blue for derived, red for figures, green for the photo system's additions, amber for assumptions.
- **Leave out, never reword.** A missing label is visible in proofreading. A reworded one is not.
