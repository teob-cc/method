# Derivation 08 · the channel

"Boxes get all the attention, arrows carry all the risk." A messaging app under end-to-end encryption, shown as
one arrow enlarged until its eight properties can be read off it. Written against derivation 08 V1.4. Paste
after `00-style-bible.md`.

```text
THIS FIGURE
One-to-one and small-group text messaging. The figure is about a single send path, so it is the largest thing
on the platform: it runs the whole length of the platform, from the near-left edge to the far-right edge, and
its ribbons are three times as wide as ribbons would normally be drawn.

Outside, on the bare paper:
- Off the near-left edge: the placard of the sender's device.
- Off the far-right edge: the placard of the recipient's device.
- Off the near-right edge: one placard stating the constraint of end-to-end encryption.

On the platform:
- On the near-left edge, where the path begins: one surface with no label.
- The path itself, in three parts: a wide ribbon from that surface into a small derived store at the middle of
  the platform, and a second wide ribbon from that store to the far-right edge.
- On the far-right edge, where the path ends: two surfaces side by side, the connection hosts, with one red
  number beside them. One of the two carries a small tag.
- Beside the far end of the path: one small store, the session registry, joined by a hairline to the two
  connection hosts.
- Riding on the first ribbon: one small sealed capsule, opaque, ink-dark, with no opening.
- Along the path, eight small numbered markers, 1 to 8, in that order from the near end to the far end, evenly
  spaced, all eight standing on the same side of the path: the side toward the viewer. Each marker has a
  two-line label beside it, flat and horizontal: a name in capitals and one line under it.
- Lying on the platform on the other side of the path, for its whole length: one thin amber band that begins at
  the near-left edge, numbered 9, with a two-line label like the others, flat and horizontal.

Cords, three and no more:
- From the near end of the amber band to the sender's placard.
- From marker 6 to the encryption placard.
- From marker 8 to the recipient's placard.

The two surfaces at the far end share one name, written once, flat, beside the pair. The small store in the
middle of the path has no name.

One line of lettering, alone, centred under the platform, in the sentence style.

LABELS (exactly these, nothing else)
Title block, small blue line:   DERIVATION 08 · THE CHANNEL
Title block, title:             BOXES GET ALL THE ATTENTION, ARROWS CARRY ALL THE RISK
Placard, sender:                SENDER’S DEVICE
Placard, recipient:             RECIPIENT’S DEVICE
Placard, encryption:            END-TO-END ENCRYPTION · the server cannot read what it moves
Label on the platform:          THE SERVER · a courier, not a participant
The two surfaces at the end:    CONNECTION HOSTS
Red number beside them:         2–10
Tag on one of them:             leaving
Small store by the far end:     SESSION REGISTRY
Capsule:                        ciphertext
Marker 1, name:                 SYNC OR ASYNC
Marker 1, line:                 a commit-bearing receipt to the sender; delivery is async
Marker 2, name:                 GUARANTEE
Marker 2, line:                 at-least-once; atomic deduplication and effect
Marker 3, name:                 ORDERING KEY
Marker 3, line:                 the conversation
Marker 4, name:                 BACKPRESSURE
Marker 4, line:                 bounded per-recipient queue
Marker 5, name:                 MESSAGE TTL
Marker 5, line:                 a product decision
Marker 6, name:                 CONTRACT
Marker 6, line:                 envelope schema, versioned; ciphertext is opaque to it
Marker 7, name:                 FAR SIDE
Marker 7, line:                 the session registry, with a stated bound
Marker 8, name:                 DEPARTURE
Marker 8, line:                 refuse new sockets, wait out the bound, then close
Band 9, name:                   INHERITED
Band 9, line:                   the latency budget, a slice of the caller’s
Line under the platform:        Answer eight questions per arrow, in writing.
Bottom-right figure id:         DERIVATION 08
```

## Check after generating

- Markers 1 to 8 in order along the path, and a separate band numbered 9. No tenth.
- Two wide ribbons with one small store between them; the store by the far end is a different, second store.
- The capsule has no window, lock, key or symbol on it.
- Three surfaces in all: one at the start, two at the end.
- The apostrophes in `SENDER’S`, `RECIPIENT’S` and `caller’s` are present, and the dash in `2–10` is an en dash.
- No other numbers anywhere except the nine marker numbers.

## Held back

V1.3 settled the connection tier: two to ten hosts now follows from a hundred thousand users at one connection
each, so the figure carries it. Two points are still as the review found them and stay off the image:

- **×5 000**, the fan-out tail: a thousand recipients across five devices, in a system introduced as
  small-group.
- **How long the registry is wrong after a crash**: its full bound in the table, the keepalive interval in the
  prose.

Not on the image and not disputed: ~1.7k msg/s and 6.7 MB/s, the arithmetic that "deletes the wrong worry", and
the reconnect figures that follow from the host count. They belong to a second figure if this derivation gets
one.
