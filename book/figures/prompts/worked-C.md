# Worked C · an internal service

"Nine things not bought": an internal expense-approval tool, where the method's result is mostly what is absent.
Written against book V1.4. Paste after `00-style-bible.md`.

This is the densest image of the set: 37 labels, against 30 in each of the other two pilot blocks. It is in the
pilot to find out how much lettering the model carries before it starts to misspell.

```text
THIS FIGURE
An internal expense-approval tool: somebody submits a claim with receipts, somebody else approves it, and
finance exports the month. The platform is small and nearly empty. The row of things not bought behind it is
longer than the platform is wide, and that contrast is the point of the figure.

Outside, on the bare paper:
- Off the near-left edge, three client placards from front to back: the submitter, the approver, finance.
- Off the near-right edge, two placards: the organisation, and regulation.
- Off the far-right edge, one placard: the mail gateway.

On the platform:
- One runnable unit tile covering most of the platform.
- On the near-left edge, one surface with no label.
- One truth store near the centre, with two thin bands around its body.
- One smaller truth store beside it.
- One brokered edge, drawn as its three parts: a ribbon from the tile into a small derived store, and a second
  ribbon from that store to the far-right edge, stopping there and pointing at the mail gateway's placard. One
  name for the whole edge.
- One small tag standing between the two truth stores, joined to both by hairlines.

Cords:
- From the banded store to the submitter's placard, carrying a tag.
- From the smaller truth store to the submitter's placard, carrying a tag.
- From the two bands on the banded store to the finance placard. No tag.
- From the small tag between the stores to the regulation placard. No tag.
- From the brokered edge to the submitter's placard. No tag.

Not bought, off the far-left edge, in one straight row of nine evenly spaced red dashed outlines, each with its
name above it in red capitals and one red tag under it:
1. a doorway slab          2. three small prisms on three tiles     3. a ribbon into a large cylinder
4. a small cylinder        5. a cylinder with many thin bands       6. a second cylinder beside a first
7. a wide flat slab        8. a cylinder cut into four segments     9. a second, separate platform outline

LABELS (exactly these, nothing else)
Title block, small blue line:   WORKED C · AN INTERNAL SERVICE
Title block, title:             NINE THINGS NOT BOUGHT
Placard, submitter:             SUBMITTER · p99 2 s
Placard, approver:              APPROVER · notified within a day
Placard, finance:               FINANCE · exports the month
Placard, organisation:          THE ORGANISATION · two engineers, business hours
Placard, regulation:            REGULATION · seven years
Placard, mail gateway:          MAIL GATEWAY · external
Tile:                           ONE RUNNABLE UNIT
Tag on the tile:                the default
Banded store:                   ONE RELATIONAL STORE
Red number beside it:           2 500×
Under the number, small:        what one node does, against 2 requests a second
Cord tag, banded store:         two invariants and the acknowledgement
The two bands:                  TWO INDEXES
Smaller truth store:            ONE OBJECT STORE
Cord tag, smaller store:        receipts
Tag between the stores:         SEVEN-YEAR RETENTION
Brokered edge:                  ONE BROKERED EDGE
Not bought 1, name:             API GATEWAY
Not bought 1, tag:              nothing to route between
Not bought 2, name:             THREE MICROSERVICES
Not bought 2, tag:              no force buys a second unit
Not bought 3, name:             MESSAGE BROKER
Not bought 3, tag:              2 requests a second
Not bought 4, name:             CACHE
Not bought 4, tag:              2 a second against a store that does thousands
Not bought 5, name:             SEARCH INDEX
Not bought 5, tag:              two indexed columns answer every query
Not bought 6, name:             READ REPLICA
Not bought 6, tag:              reads are 0.02/s
Not bought 7, name:             CDN
Not bought 7, tag:              internal users, one office, one region
Not bought 8, name:             SHARDING
Not bought 8, tag:              3.4 GB after seven years
Not bought 9, name:             SECOND REPOSITORY
Not bought 9, tag:              no separate source-access or release constraint
Bottom-right figure id:         WORKED C
```

## Check after generating

- Exactly nine red outlines, each with a name and a tag; none of them stands on the platform or casts a shadow.
- On the platform: one tile, one doorway, two opaque cylinders, one small translucent one with a ribbon in and a
  ribbon out. Nothing else.
- Five cords, all ending at placards.
- `p99 2 s`, `2 500×`, `0.02/s` and `3.4 GB` are spelt exactly so.
- Nothing green: this figure belongs to no sequence.

## Not on the image

Book V1.7 exposes delivery and durability evidence still required. The earlier V1.4 review recorded: the coupling count is now four on the
relational store and two on the notification edge, the forces list names all six, and the chapter says outright
that this is not the single-class service the fifteen-minute pass is for.

Left off by choice, to keep the figure about what was not bought:

- **The coupling counts**, four and two. They would be two red numbers on the relational store and the edge.
- **The rungs each class accepts**, and the night on rung 5.
- **"Fifteen minutes."** The chapter keeps it; the title here is the section's own heading.
- **The edge's eight properties.** Frame 07 of the photo system is where a reader meets those drawn out.
