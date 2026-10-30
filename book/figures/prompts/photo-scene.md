# The photo system: the fixed scene

The twelve frames show one model that gains one decision per chapter. This sheet fixes where everything stands,
so a frame only has to say what it adds. Paste it between the style bible and a `photo-NN.md` block.

Where the model accepts a reference image, attach the previous accepted frame and add the line at the end.

```text
THE SCENE (the same in all twelve figures of this set; nothing moves between figures)
The system is a photo-sharing feature. Positions are given by the platform's four edges.

Outside, on the bare paper:
- Off the near-left edge, toward the front: the placard of the uploader.
- Off the near-left edge, behind the uploader: the placard of moderation.
- Off the far-right edge: the placard of the CDN. Directly behind it, further from the platform, the placard of
  the viewer, joined to the CDN placard by a hairline, because the viewer reaches the system only through it.
- Off the near-right edge: one wide placard for the organisation.

On the platform:
- On the near-left edge, facing the uploader: one surface, the upload endpoint.
- Near the centre, toward the back: a large truth store, the originals.
- Near the centre, toward the front: a smaller truth store, the catalogue.
- Near the far-right edge, facing the CDN: a row of four small derived stores, the thumbnails.
- Between the originals and the thumbnails: one processor, the thumbnailer.
- Plain hairlines join the upload endpoint to the originals and to the catalogue, the originals to the
  thumbnailer, and the thumbnailer to the thumbnails.

Anything this figure's block does not mention as present is absent from the figure, and its place stays empty.
Whatever the block marks as added in this figure stands on a green base ring and its label is green. Everything
that was there before stays in ink.
```

Line to add when a reference image is attached:

```text
The attached image is the previous figure of this set. Keep every object, placard, cord and label in it exactly
where it is, at the same size and angle. Change only what this block adds.
```

## What each frame adds

Taken from the chapters' own closing blocks; the titles are their headings.

| Frame | Title | Present for the first time |
|---|---|---|
| 01 | The boundary, chosen | the platform; the upload endpoint and the originals on it; the uploader, the CDN and the viewer off it |
| 02 | Three classes, and the one number that decides the design | moderation; each class's tolerance on its placard; the viewer's 60 s |
| 03 | The envelope, and why the CDN was outside the boundary | the organisation's placard; the CDN contract; the lifecycle trigger |
| 04 | The four figures, divided — and a factor of twenty nobody had written down | the figures: uploads, storage, views at the edge and at the origin, the assumed hit rate |
| 05 | What is truth here, and what is merely expensive to lose | the catalogue; the four thumbnails; the cords for read-your-writes and for 60 s |
| 06 | The thumbnailer, and why it needs no deduplication store | the thumbnailer; the pending state on the catalogue |
| 07 | The first split, and the eight properties it costs | two unit tiles and the gap; the brokered edge in its three parts, and its eight tags |
| 08 | What the photo system owes when the pieces are gone | the two accepted rungs, priced; the CDN degraded |
| 09 | What the photo system watches, and what it deliberately does not | two objectives, one lag alarm, one zero-tolerance count, one outcome figure |
| 10 | What the photo system is allowed to buy | what delivery bought and, as outlines, what it did not |
| 11 | The photo system's map, and what the count finds | the map's rows as cords, counted |
| 12 | The photo system, amended twice | the hit rate measured; the trigger from frame 03 fired |

## One thing the scene had to settle

The chapters never name the surface the CDN reads through, and thumbnails are written to keys in the object
store. The scene therefore draws the thumbnails as their own derived stores at the edge facing the CDN, and
draws no second doorway. If the text gains a read surface, it goes on the far-right edge in front of the
thumbnails.
