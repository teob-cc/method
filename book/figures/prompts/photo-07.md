# Photo system · frame 07

Chapter 07, "The first split, and the eight properties it costs", aligned with book V1.7. Paste after
`00-style-bible.md` and `photo-scene.md`.

```text
THIS FIGURE
Everything in the scene is present: the uploader, moderation, the CDN and the viewer, the organisation, the
upload endpoint, the originals, the catalogue, the four thumbnails and the thumbnailer.

Added in this figure, in green:
- Two runnable unit tiles. The first lies under the upload endpoint. The second lies under the thumbnailer.
  The gap between them is clearly visible, and a small green tag sits in the gap.
- One brokered edge, drawn as its three parts: a ribbon from the first tile into a small derived store standing
  in the gap between the tiles, and a second ribbon from that store to the thumbnailer on the second tile.
  Chevrons point toward the thumbnailer. Each of the three parts has its own name beside it.
- A strip of eight small tags standing in a single straight row alongside the two ribbons, evenly spaced, each
  joined to them by a short hairline. The strip has a heading above it.
- One small amber tag on the first ribbon.

Cords:
- From the small store in the gap to the uploader's placard, carrying one tag.
- From the second ribbon and from the row of thumbnails, joined into one cord, to the viewer's placard, passing
  the CDN placard, carrying one tag that is a number in red.

LABELS (exactly these, nothing else)
Title block, small blue line:   THE PHOTO SYSTEM · CHAPTER 07
Title block, title:             THE FIRST SPLIT, AND THE EIGHT PROPERTIES IT COSTS
Placard, uploader:              UPLOADER · mobile app
Placard, moderation:            MODERATION · internal
Placard, viewer:                VIEWER · browser
Placard, CDN:                   CDN · contract held
Placard, organisation:          THE ORGANISATION · four engineers, one region
Surface:                        UPLOAD ENDPOINT
Large truth store:              ORIGINALS · truth
Smaller truth store:            CATALOGUE · truth
Row of four derived stores:     THUMBNAILS ×4 · derived
Processor:                      THUMBNAILER
First tile:                     UNIT 1
Second tile:                    UNIT 2
Green tag in the gap:           bought by independent scaling
First ribbon:                   PRODUCER CHANNEL
Small store in the gap:         QUEUE
Second ribbon:                  CONSUMER CHANNEL
Heading over the tag strip:     ONE BROKERED EDGE · EIGHT PROPERTIES
Tag 1:                          async
Tag 2:                          at-least-once, both sides
Tag 3:                          ordering key: photo id
Tag 4:                          bounded queue
Tag 5:                          TTL 24 h
Tag 6:                          schema owned by the upload endpoint, backward-compatible
Tag 7:                          far side: the broker
Tag 8:                          departure: finish and commit, or redeliver
Amber tag on the first ribbon:  inherited: a slice of the uploader’s 5 s
Cord tag, queue to uploader:    rung 4 · accepted, not yet processed
Cord tag, to the viewer:        60 s
Bottom-right figure id:         PHOTO 07
```

## Check after generating

Use the current chapter’s full contracts: process co-location is not atomicity; deduplication needs an effect protocol; replay must cover every retained schema version. The CDN revocation path remains an open obligation, not a demonstrated guarantee.


- Exactly two tiles, two ribbons with one small store between them, eight tags in the strip.
- Two opaque cylinders with dark lids (originals, catalogue); four translucent blue ones (thumbnails), and a
  fifth, smaller, in the gap (the queue).
- Only the tiles, the gap tag, the two ribbons, the queue and the tag strip are green. The inherited tag is
  amber.
- `×4`, `24 h`, `5 s` and `60 s` are spelt exactly so; `60 s` is red.
- No label appears that is not in the list.

## Not on the image

Nothing is held back as disputed: the V1.4 text settled the four points the review raised here (the
compatibility mode is backward; the edge is brokered and counted as three things; the amplification is restated
as four stores and eight writes; the async channel cites both the viewer's 60 s and the uploader's rung 4, and
the figure draws both cords).

Left off to keep the frame about the split: the capacity pass that closes the chapter's block — 10 catalogue
writes a second, 5 messages a second on two partitions, two workers of two cores, $0.021 against a ceiling of
$0.03 per stored gigabyte-month. It would carry a figure of its own.
