# Social cards

The `og:image` of the specification and the landing (`og-method.html` → `og-method.png`, served as `/method/og.png`),
of the foreword (`og-foreword.html` → `og-foreword.png`) and of the book (`og-book.html` → `og-book.png`, served as
`/method/book/og.png`). The PNGs are committed, so the build only copies them; after editing a source, re-render it with
`og/render.sh` (headless Chrome; the sources load their fonts from Google Fonts, so it needs network) and commit the PNG.
