// The Markdown dialect every piece of the corpus is written in: markdown-it plus a few constructs.
// README.md ("What the Markdown can say") documents it for authors; this file is the definition.
import MarkdownIt from 'markdown-it'

export class BuildError extends Error {}
export const fail = (file, message) => {
  throw new BuildError(`${file}: ${message}`)
}

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// [text]{.class} — which element each class renders as (any other class renders as a span)
const SPANS = { num: 'span', term: 'em', rate: 'b' }

// ::: name — a container that is one element holding inline content, rather than a box around blocks.
// `p` renders a plain paragraph carrying only the attributes given, e.g. ::: p {style="margin-top:8px"}.
const INLINE_P = new Set(['standfirst', 'lead', 'bigline', 'lede', 'def', 'asks', 'prod', 'meta', 'prov', 'subtitle', 'p',
  'eyebrow', 'promise', 'signcap', 'xmcap', 'h1sub', 'foot', 'body'])
const INLINE_DIV = new Set(['tab', 'kick', 'fb', 'say', 'cell', 'warn', 'good', 'note', 'concede', 'own', 'verdict', 'stepnum', 'doccode',
  'plabel', 'qrow', 'cta', 'grid', 'heritage', 'prim', 'counter'])
// The book predates the inline containers: there, only its three opening paragraphs are inline, and a box such
// as ::: warn wraps its content in paragraphs, as its stylesheet expects.
const BOOK_P = new Set(['standfirst', 'lead', 'bigline'])
// ::: name whose element is not a div: the name is the tag and adds no class
const TAG_BLOCKS = { section: 'section' }

// ::: name {#id .other key="value"} — the attribute block after a container name, a heading, or on its own
// line under a list or a table
const ATTR_RE = /^\{([^}]*)\}$/
export function parseAttrs(text) {
  const attrs = { id: null, classes: [], other: [] }
  const re = /#([\w-]+)|\.([\w-]+)|([\w:-]+)=("([^"]*)"|'([^']*)')|([\w:-]+)/g
  let m
  while ((m = re.exec(text))) {
    if (m[1]) attrs.id = m[1]
    else if (m[2]) attrs.classes.push(m[2])
    else if (m[3]) attrs.other.push([m[3], m[5] ?? m[6]])
    else if (m[7]) attrs.other.push([m[7], ''])
  }
  return attrs
}
function attrString(classes, attrs) {
  const parts = []
  const cls = [...classes, ...(attrs?.classes ?? [])]
  if (cls.length) parts.push(`class="${cls.join(' ')}"`)
  if (attrs?.id) parts.push(`id="${attrs.id}"`)
  for (const [k, v] of attrs?.other ?? []) parts.push(`${k}="${esc(v)}"`)
  return parts.length ? ' ' + parts.join(' ') : ''
}

const OPEN_FENCE = /^:::\s*(?:([\w-]+)\s*)?(\{[^}]*\})?\s*$/
const CLOSE_FENCE = /^:::\s*$/

/** The dialect for one kind of page. `env` per render carries file (for errors), kind, labels, figure reader. */
export function createMarkdown(kind) {
  const md = new MarkdownIt({ html: true, typographer: false, linkify: false })
  const inlineTag = (name) =>
    kind === 'book' ? (BOOK_P.has(name) ? 'p' : null) : INLINE_P.has(name) ? 'p' : INLINE_DIV.has(name) ? 'div' : null

  // ::: name {attrs} … :::  (nestable)
  md.block.ruler.before(
    'fence',
    'fenced_div',
    (state, startLine, endLine, silent) => {
      if (state.sCount[startLine] - state.blkIndent >= 4) return false
      const lineAt = (n) => state.src.slice(state.bMarks[n] + state.tShift[n], state.eMarks[n])
      const open = OPEN_FENCE.exec(lineAt(startLine))
      if (!open || (!open[1] && !open[2])) return false
      if (silent) return true
      let depth = 1
      let line = startLine
      while (++line < endLine) {
        const text = lineAt(line)
        if (OPEN_FENCE.test(text) && !CLOSE_FENCE.test(text)) depth++
        else if (CLOSE_FENCE.test(text) && --depth === 0) break
      }
      if (depth !== 0) fail(state.env.file, `"${lineAt(startLine)}" is never closed with a line of ":::"`)
      const name = open[1] ?? null
      const attrs = open[2] ? parseAttrs(open[2].slice(1, -1)) : null
      const inner = state.getLines(startLine + 1, line, state.blkIndent, false)
      const token = state.push('html_block', '', 0)
      token.content = renderDiv(md, name, attrs, inner, state.env)
      token.map = [startLine, line + 1]
      state.line = line + 1
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
  )

  // [text]{.class}
  md.inline.ruler.before('link', 'span', (state, silent) => {
    if (state.src.charCodeAt(state.pos) !== 0x5b /* [ */) return false
    const labelStart = state.pos + 1
    const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true)
    if (labelEnd < 0) return false
    const attr = /^\{\.([\w-]+)\}/.exec(state.src.slice(labelEnd + 1))
    if (!attr) return false
    if (!silent) {
      const tag = SPANS[attr[1]] ?? 'span'
      state.push('span_open', tag, 1).attrs = [['class', attr[1]]]
      const max = state.posMax
      state.pos = labelStart
      state.posMax = labelEnd
      state.md.inline.tokenize(state)
      state.posMax = max
      state.push('span_close', tag, -1)
    }
    state.pos = labelEnd + 1 + attr[0].length
    return true
  })

  // "## Heading {#id .class key="v"}" — attributes at the end of a heading line
  md.core.ruler.push('heading_attrs', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'heading_open') continue
      const inline = tokens[i + 1]
      const m = /\s*\{([^}]*)\}\s*$/.exec(inline.content)
      if (!m) continue
      inline.content = inline.content.slice(0, m.index)
      // the inline token was already tokenized: re-tokenize the shortened content
      inline.children = []
      state.md.inline.parse(inline.content, state.md, state.env, inline.children)
      applyAttrs(tokens[i], parseAttrs(m[1]))
    }
  })

  // A line of "{…}" (or "Table: caption {cols="26% *"}") right under a table or a list: attributes for it.
  md.core.ruler.push('block_attrs', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]
      if (!/^(table|bullet_list|ordered_list)_close$/.test(t.type) || tokens[i + 1]?.type !== 'paragraph_open') continue
      const text = tokens[i + 2].content
      const m = /^(?:Table:\s+(.*?))?\s*(?:\{([^}]*)\})?$/s.exec(text)
      if (!m || (m[1] === undefined && m[2] === undefined)) continue
      let open = i
      const openType = t.type.replace('_close', '_open')
      let depth = 0
      for (open = i - 1; open >= 0; open--) {
        if (tokens[open].type === t.type) depth++
        else if (tokens[open].type === openType && depth-- === 0) break
      }
      const attrs = m[2] ? parseAttrs(m[2]) : { id: null, classes: [], other: [] }
      if (t.type === 'table_close') {
        tokens[open].meta = { caption: m[1] ? md.renderInline(m[1], state.env) : null }
        const cols = attrs.other.find(([k]) => k === 'cols')
        if (cols) {
          attrs.other = attrs.other.filter(([k]) => k !== 'cols')
          const widths = cols[1].trim().split(/\s+/)
          const heads = tokens.slice(open, i).filter((x) => x.type === 'th_open')
          widths.forEach((w, n) => {
            if (w !== '*' && heads[n]) heads[n].attrSet('style', `width:${w}`)
          })
        }
      }
      applyAttrs(tokens[open], attrs)
      tokens.splice(i + 1, 3)
    }
  })

  // "| {.num} 100 /s | …" — a cell starting with an attribute block carries those attributes
  md.core.ruler.push('cell_attrs', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (!/^t[dh]_open$/.test(tokens[i].type)) continue
      const inline = tokens[i + 1]
      const m = /^\{([^}]*)\}\s*/.exec(inline.content)
      if (!m) continue
      inline.content = inline.content.slice(m[0].length)
      inline.children = []
      state.md.inline.parse(inline.content, state.md, state.env, inline.children)
      applyAttrs(tokens[i], parseAttrs(m[1]))
    }
  })

  const rules = md.renderer.rules
  if (kind !== 'plain') {
    // the corpus's pages style <b> and span.code; a plain page keeps markdown-it's own elements, and the
    // landing's stylesheet addresses <strong>
    if (kind !== 'landing') {
      rules.strong_open = () => '<b>'
      rules.strong_close = () => '</b>'
    }
    rules.code_inline = (tokens, idx) => `<span class="code">${esc(tokens[idx].content)}</span>`
    rules.thead_open = rules.thead_close = rules.tbody_open = rules.tbody_close = () => ''
  }
  rules.bullet_list_open = (tokens, idx) => `<ul${attrsOf(tokens[idx], kind === 'plain' ? [] : ['tight'])}>\n`
  rules.ordered_list_open = (tokens, idx) => `<ol${attrsOf(tokens[idx], kind === 'book' ? ['tight'] : [])}>\n`
  rules.table_open = (tokens, idx) => {
    const caption = tokens[idx].meta?.caption
    const wrap = kind === 'book' ? '<div class="tw">\n' : ''
    return `${wrap}<table${attrsOf(tokens[idx], [])}>\n` + (caption ? `<caption>${caption}</caption>\n` : '')
  }
  rules.table_close = () => (kind === 'book' ? '</table>\n</div>\n' : '</table>\n')
  md.inlineTag = inlineTag
  return md
}

function applyAttrs(token, attrs) {
  if (attrs.id) token.attrSet('id', attrs.id)
  if (attrs.classes.length) token.attrJoin('class', attrs.classes.join(' '))
  for (const [k, v] of attrs.other) token.attrSet(k, v)
}
function attrsOf(token, baseClasses) {
  const a = Object.fromEntries(token.attrs ?? [])
  const cls = [...baseClasses, ...(a.class ? a.class.split(' ') : [])]
  const parts = []
  if (cls.length) parts.push(`class="${cls.join(' ')}"`)
  for (const [k, v] of Object.entries(a)) if (k !== 'class') parts.push(`${k}="${esc(v)}"`)
  return parts.length ? ' ' + parts.join(' ') : ''
}

function renderDiv(md, name, attrs, inner, env) {
  if (name === 'figure') return renderFigure(md, inner, env)
  if (name === 'owes') return renderOwes(md, inner, env)
  if (name === 'kpi') return renderKpi(md, attrs, inner, env)
  if (name === 'mod') return renderMod(md, attrs, inner, env)
  if (name === 'footer') return renderLines('footer', attrs, inner, md, env)
  if (name === 'toc') return `<nav class="toc" aria-label="Contents"${attrString([], attrs).replace(/ class="[^"]*"/, '')}>${md.renderInline(inner.trim(), env)}</nav>\n`
  const tag = name ? md.inlineTag(name) : null
  if (tag) {
    const classes = name === 'p' ? [] : [name]
    return `<${tag}${attrString(classes, attrs)}>${md.renderInline(inner.trim(), env)}</${tag}>\n`
  }
  if (name && TAG_BLOCKS[name]) return `<${TAG_BLOCKS[name]}${attrString([], attrs)}>\n${md.render(inner, env)}</${TAG_BLOCKS[name]}>\n`
  return `<div${attrString(name ? [name] : [], attrs)}>\n${md.render(inner, env)}</div>\n`
}

// ::: footer — one line of the source per line of the footer, joined with <br>
function renderLines(tag, attrs, inner, md, env) {
  const lines = inner.trim().split('\n').filter((l) => l.trim()).map((l) => md.renderInline(l.trim(), env))
  return `<${tag}${attrString([], attrs)}>${lines.join('<br>\n')}</${tag}>\n`
}

// ::: kpi — "- **the number** · what it is", one item per cell
function renderKpi(md, attrs, inner, env) {
  const items = inner.trim().split('\n').filter((l) => l.trim())
  const cells = items.map((line) => {
    const m = /^- \*\*(.+?)\*\* · (.*)$/.exec(line.trim())
    if (!m) fail(env.file, `a kpi item is "- **number** · label"; found "${line.slice(0, 60)}"`)
    return `<div><div class="n">${md.renderInline(m[1], env)}</div><div class="l">${md.renderInline(m[2], env)}</div></div>`
  })
  return `<div${attrString(['kpi'], attrs)}>\n${cells.join('\n')}\n</div>\n`
}

// ::: mod {#id tab="01 · CLAIM"} — a numbered module: the tab down the side, the body beside it
function renderMod(md, attrs, inner, env) {
  const tab = attrs?.other.find(([k]) => k === 'tab')
  const rest = { ...attrs, other: (attrs?.other ?? []).filter(([k]) => k !== 'tab') }
  const tabHtml = tab ? `<div class="tab">${md.renderInline(tab[1], env)}</div>\n` : ''
  return `<section${attrString(['mod'], rest)}>\n${tabHtml}<div class="body">\n${md.render(inner, env)}</div>\n</section>\n`
}

// ::: figure
// ![what the figure shows, for a reader who cannot see it](../figures/name.svg)
//
// The caption.
// :::
function renderFigure(md, inner, env) {
  const [first, ...rest] = inner.trim().split('\n')
  const image = /^!\[((?:\\.|[^\]\\])*)\]\(([^)\s]+)\)\s*$/.exec(first)
  if (!image) fail(env.file, `a figure must start with ![description](path.svg); found "${first.slice(0, 60)}"`)
  const svg = env.readFigure(image[2])
  const label = image[1].replace(/\\(.)/g, '$1')
  const caption = rest.join('\n').trim()
  return (
    `<figure role="img" aria-label="${esc(label)}">\n${svg.trim()}\n` +
    (caption ? `<figcaption>${md.renderInline(caption, env)}</figcaption>\n` : '') +
    '</figure>\n'
  )
}

// ::: owes — the book's closing pointer into the specification: one list item per line of it
function renderOwes(md, inner, env) {
  const items = inner.trim().split('\n')
  if (!items.every((line) => line.startsWith('- '))) fail(env.file, 'the owes block is a list: every line starts with "- "')
  const lines = items.map((line) => md.renderInline(line.slice(2), env) + '<br>\n').join('')
  return `<div class="owes"><b>${esc(env.labels.owes)}</b><br>\n${lines}<b>${esc(env.owesFoot)}</b></div>\n`
}
