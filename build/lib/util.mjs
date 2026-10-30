import { existsSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { load as loadYaml } from 'js-yaml'
import { esc, fail } from './markdown.mjs'

export const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../..')
export const rel = (file) => relative(ROOT, file)

/** A Markdown source: YAML front matter between two lines of "---", then the body. */
export function readSource(file) {
  if (!existsSync(file)) fail(rel(file), 'does not exist')
  const text = readFileSync(file, 'utf8')
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text)
  if (!m) fail(rel(file), 'the file must start with front matter between two lines of "---"')
  return { file, meta: loadYaml(m[1]) ?? {}, body: text.slice(m[0].length) }
}

export const yaml = (file) => loadYaml(readFileSync(file, 'utf8'))

/** {{key}} and {{a.b}} substitution; a key with nothing to put in it is an error. */
export const fill = (template, values, file) =>
  template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    const value = key.split('.').reduce((o, k) => o?.[k], values)
    if (value === undefined) fail(rel(file), `nothing to put in {{${key}}}`)
    return value
  })

/** The environment a piece is rendered in: errors name the file, figures resolve beside it. */
export function env(file, extra = {}) {
  return {
    file: rel(file),
    readFigure: (path) => {
      const svg = resolve(dirname(file), path)
      if (!existsSync(svg)) fail(rel(file), `figure ${path} does not exist`)
      return readFileSync(svg, 'utf8')
    },
    ...extra,
  }
}

/** <meta> tags from the front matter's `meta` list: og:* and article:* are properties, the rest are names. */
export function metaTags(meta) {
  return (meta ?? [])
    .map((item) => {
      const [[key, value]] = Object.entries(item)
      const attr = /^(og|article|fb):/.test(key) ? 'property' : 'name'
      return `<meta ${attr}="${esc(key)}" content="${esc(value)}">\n`
    })
    .join('')
}

// ---------------------------------------------------------------------------------------------------- fonts
// The fonts every page may use, vendored in theme/fonts (latin subsets, SIL OFL). `unicode-range` is the latin
// range Google Fonts serves, so glyphs outside it fall back to the next family in the stack exactly as before.
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
export const FONTS = [
  ['IBM Plex Sans', 'ibm-plex-sans', [400, 500, 600]],
  ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed', [600, 700]],
  ['IBM Plex Mono', 'ibm-plex-mono', [400, 500, 600]],
  ['IBM Plex Serif', 'ibm-plex-serif', [400, 600], [400]],
  ['Inter', 'inter', [400, 500, 600]],
  ['JetBrains Mono', 'jetbrains-mono', [300, 400, 500, 600]],
]
export function fontFiles() {
  return FONTS.flatMap(([, slug, normal, italic = []]) => [
    ...normal.map((w) => `${slug}-latin-${w}-normal.woff2`),
    ...italic.map((w) => `${slug}-latin-${w}-italic.woff2`),
  ])
}
/** The @font-face rules for a page whose path to the fonts directory is `prefix` ("" or "../"). */
export function fontsCss(prefix) {
  const face = (family, slug, weight, style) =>
    `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;` +
    `src:url(${prefix}fonts/${slug}-latin-${weight}-${style}.woff2) format('woff2');unicode-range:${LATIN}}`
  return FONTS.flatMap(([family, slug, normal, italic = []]) => [
    ...normal.map((w) => face(family, slug, w, 'normal')),
    ...italic.map((w) => face(family, slug, w, 'italic')),
  ]).join('\n')
}
