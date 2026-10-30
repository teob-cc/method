// "Systems, from the outside in": book.yaml, index.md, chapters/*.md and figures/*.svg into book/*.html.
// Ported from teob's website/book/build.mjs; the dialect is the shared one in markdown.mjs.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createMarkdown, esc, fail } from './markdown.mjs'
import { ROOT, env, fill, fontsCss, readSource, rel, yaml } from './util.mjs'

const HERE = join(ROOT, 'book')
const theme = (name) => readFileSync(join(ROOT, 'theme', name), 'utf8')

export function loadBook() {
  const bookFile = join(HERE, 'book.yaml')
  const book = yaml(bookFile)
  const pieces = []
  for (const part of book.parts) {
    part.label = `Part ${part.id} · ${part.name}`
    part.entries = part.chapters.map((entry) => {
      if (typeof entry !== 'string') return { ...entry.external, external: true }
      const file = join(HERE, 'chapters', `${entry}.md`)
      if (!existsSync(file)) fail(rel(bookFile), `part ${part.id} lists "${entry}", but chapters/${entry}.md does not exist`)
      const source = readSource(file)
      for (const key of ['title', 'number', 'kind', 'description', 'summary']) {
        if (source.meta[key] === undefined) fail(rel(file), `front matter has no "${key}"`)
      }
      if (typeof book.labels[source.meta.kind] !== 'object') {
        const kinds = Object.keys(book.labels).filter((k) => typeof book.labels[k] === 'object')
        fail(rel(file), `kind is "${source.meta.kind}"; book.yaml knows ${kinds.join(', ')}`)
      }
      if (source.meta.part !== undefined && String(source.meta.part) !== String(part.id)) {
        fail(rel(file), `front matter says part ${source.meta.part}, book.yaml lists it under part ${part.id}`)
      }
      const piece = { ...source, slug: entry, part, href: `${entry}.html`, number: String(source.meta.number) }
      pieces.push(piece)
      return piece
    })
  }
  const listed = new Set(pieces.map((p) => `${p.slug}.md`))
  for (const name of readdirSync(join(HERE, 'chapters'))) {
    if (name.endsWith('.md') && !listed.has(name)) fail(rel(bookFile), `chapters/${name} is not listed under any part`)
  }
  const templates = { chapter: theme('templates/book/chapter.html'), contents: theme('templates/book/contents.html'), stamp: theme('templates/book/stamp.html') }
  return { book, pieces, css: theme('book.css'), templates }
}

const label = (pattern, n) => pattern.replace('{n}', n)

function navLink(target, book, next) {
  const cls = next ? ' class="nx"' : ''
  if (!target) return `<a${cls} href="index.html"><span class="lbl">Back to</span>Contents</a>`
  const lbl = label(book.labels[target.meta.kind].nav, target.number)
  return `<a${cls} href="${target.href}"><span class="lbl">${esc(lbl)}</span>${esc(target.meta.title)}</a>`
}

function renderChapter(md, { book, pieces, css, templates }, piece, index) {
  const labels = book.labels[piece.meta.kind]
  const e = env(piece.file, { labels, owesFoot: book.labels.owes_foot })
  return fill(
    templates.chapter,
    {
      title: esc(piece.meta.title),
      tab_label: esc(label(labels.tab, piece.number)),
      opener_label: esc(label(labels.opener, piece.number)),
      description: esc(piece.meta.description),
      book_title: esc(book.title),
      part: esc(piece.part.label),
      css,
      fonts_css: fontsCss('../'),
      body: md.render(piece.body, e),
      prev: navLink(pieces[index - 1], book, false),
      next: navLink(pieces[index + 1], book, true),
    },
    piece.file,
  )
}

function renderContentsTable(md, book) {
  const state = `<b class="state">${esc(book.labels.state)}</b>`
  const rows = book.parts.flatMap((part) => [
    `  <tr><td colspan="4" class="part"><b>${esc(part.label.toUpperCase())}</b></td></tr>`,
    ...part.entries.map((e) => {
      const [number, title, href, summary] = e.external
        ? [e.number, e.title, e.href, e.summary]
        : [e.number, e.meta.title, e.href, e.meta.summary]
      return `  <tr><td><b>${esc(number)}</b></td><td><a href="${esc(href)}"><b>${esc(title)}</b></a></td><td>${md.renderInline(summary)}</td><td>${state}</td></tr>`
    }),
  ])
  return [
    '<div class="tw">',
    '<table>',
    `  <caption>${md.renderInline(book.contents_caption)}</caption>`,
    '  <tr><th style="width:8%">&nbsp;</th><th style="width:34%">Chapter</th><th>What it settles</th><th style="width:12%">State</th></tr>',
    ...rows,
    '</table>',
    '</div>',
  ].join('\n')
}

function renderContents(md, { book, css, templates }) {
  const source = readSource(join(HERE, 'index.md'))
  const e = env(source.file)
  const values = { ...book, title_upper: book.title.toUpperCase() }
  let html = md.render(fill(source.body.replace(/\{\{(contents|stamp)\}\}/g, '{{ $1 }}'), values, source.file), e)
  const standfirst = /<p class="standfirst">.*?<\/p>\n/s.exec(html)
  if (!standfirst) fail(rel(source.file), 'the contents page needs a ::: standfirst block')
  html = html.replace(standfirst[0], '')
  const blocks = { contents: renderContentsTable(md, book), stamp: fill(templates.stamp, values, source.file) }
  for (const [name, block] of Object.entries(blocks)) {
    const marker = `<p>{{ ${name} }}</p>\n`
    if (!html.includes(marker)) fail(rel(source.file), `{{${name}}} must stand on a line of its own`)
    html = html.replace(marker, block.trimEnd() + '\n')
  }
  return fill(
    templates.contents,
    {
      title: esc(source.meta.title ?? book.title),
      description: esc(source.meta.description),
      tagline: esc(book.tagline),
      social: Object.fromEntries(Object.entries(book.social).map(([k, v]) => [k, esc(v)])),
      css,
      fonts_css: fontsCss('../'),
      standfirst: standfirst[0].trimEnd(),
      body: html,
    },
    source.file,
  )
}

/** Every page of the book: [{ name, html }], names relative to the book directory. */
export function renderBook() {
  const loaded = loadBook()
  const md = createMarkdown('book')
  return [
    { name: 'book/index.html', html: renderContents(md, loaded) },
    ...loaded.pieces.map((piece, i) => ({ name: `book/${piece.href}`, html: renderChapter(md, loaded, piece, i) })),
  ]
}
