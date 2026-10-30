#!/bin/sh
# Renders the social cards from their HTML sources with headless Chrome, 2400×1260 (1200×630 at 2×).
# Usage: og/render.sh [og-method|og-foreword|og-book ...]   (all three when no name is given)
set -e
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
[ -n "$CHROME" ] || { echo "no Chrome found; set CHROME=/path/to/chrome" >&2; exit 1; }
for name in ${@:-og-method og-foreword og-book}; do
  "$CHROME" --headless=new --user-data-dir=/tmp/og-chrome --hide-scrollbars --window-size=1200,630 \
    --force-device-scale-factor=2 --virtual-time-budget=8000 --screenshot="$name.png" "file://$PWD/$name.html"
  echo "rendered $name.png"
done
