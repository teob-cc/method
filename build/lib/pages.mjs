// The hand-authored pages: the specification (and its per-step pages), the foreword, the worked example, the
// derivations and the evidence note. The book is in book.mjs, the landing in landing.mjs.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createMarkdown, esc, fail } from './markdown.mjs'
import { ROOT, env, fill, fontsCss, metaTags, readSource, rel, yaml } from './util.mjs'

const theme = (name) => readFileSync(join(ROOT, 'theme', name), 'utf8')
const template = (name) => theme(`templates/${name}.html`)

/** The <head> of a page: title, meta, icon and the inlined stylesheet with the font faces. */
function head({ html_title, meta, icon, css, depth = 0, description }) {
  const metas = metaTags(meta) + (description ? `<meta name="description" content="${esc(description)}">\n` : '')
  return fill(
    template('head'),
    {
      html_title: esc(html_title),
      meta: metas,
      icon: icon ? `<link rel="icon" href="${icon}">\n` : '',
      fonts_css: fontsCss('../'.repeat(depth)),
      css: theme(css + '.css'),
    },
    'theme/templates/head.html',
  )
}

const noteParas = (md, env, notes) => (notes ?? []).map((n) => `  <p class="note">${md.renderInline(n, env)}</p>\n`).join('')

// ------------------------------------------------------------------------------------------ the specification
export function loadSpec() {
  const dir = join(ROOT, 'spec')
  const spec = yaml(join(dir, 'spec.yaml'))
  const sections = spec.sections.map((name) => readSource(join(dir, 'sections', `${name}.md`)))
  const tail = (spec.tail ?? []).map((name) => readSource(join(dir, 'sections', `${name}.md`)))
  const steps = []
  const phases = spec.phases.map((phase) => ({
    ...phase,
    steps: phase.steps.map((name) => {
      const step = readSource(join(dir, 'steps', `${name}.md`))
      for (const key of ['number', 'id', 'title']) if (step.meta[key] === undefined) fail(rel(step.file), `front matter has no "${key}"`)
      step.slug = name
      steps.push(step)
      return step
    }),
  }))
  const listed = new Set(steps.map((s) => `${s.slug}.md`))
  for (const name of readdirSync(join(dir, 'steps'))) if (name.endsWith('.md') && !listed.has(name)) fail(`spec/steps/${name}`, 'is not listed under any phase in spec.yaml')
  return { dir, spec, sections, tail, phases, steps }
}

function renderStepDiv(md, step, { rebase = false } = {}) {
  const e = env(step.file)
  let html = `<div class="step" id="${esc(step.meta.id)}"><div class="stepnum">${esc(step.meta.number)}</div><div>\n<h4>${md.renderInline(step.meta.title, e)}</h4>\n${md.render(step.body, e)}</div></div>\n`
  // on a step's own page, the specification's in-page anchors and sibling files are one directory up
  if (rebase) html = html.replace(/href="#([^"]+)"/g, 'href="../method.html#$1"').replace(/href="(?!https?:|\.\.\/|#)([^"]+)"/g, 'href="../$1"')
  return html
}
const phaseDiv = (md, phase) =>
  `<div class="phase"><span class="lbl">${md.renderInline(phase.label)}</span><span class="rule"></span><span class="hint">${md.renderInline(phase.hint)}</span></div>\n`

function renderSection(md, section, stepsHtml) {
  const e = env(section.file)
  let html = md.render(section.body, e)
  if (html.includes('<p>{{steps}}</p>')) {
    if (stepsHtml === undefined) fail(rel(section.file), '{{steps}} is only for the steps section')
    html = html.replace('<p>{{steps}}</p>\n', stepsHtml)
  } else if (section.body.includes('{{steps}}')) fail(rel(section.file), '{{steps}} must stand on a line of its own')
  if (section.meta.standalone) return html
  const tab = section.meta.tab ? `  <div class="tab">${md.renderInline(section.meta.tab, e)}</div>\n` : ''
  return `<section class="mod" id="${esc(section.meta.id)}">\n${tab}  <div class="body">\n${html}  </div>\n</section>\n`
}

export function renderSpec(loaded = loadSpec()) {
  const { spec, sections, tail, phases } = loaded
  const md = createMarkdown('spec')
  const e = env(join(loaded.dir, 'spec.yaml'))
  const stepsHtml = phases.map((p) => phaseDiv(md, p) + p.steps.map((s) => renderStepDiv(md, s)).join('\n')).join('\n')
  const body =
    `<nav class="toc" aria-label="Contents">${md.renderInline(spec.toc, e)}</nav>\n\n` +
    sections.map((s) => renderSection(md, s, stepsHtml)).join('\n') +
    '\n' +
    tail.map((s) => renderSection(md, s)).join('\n') +
    `\n<p style="${esc(spec.licence_line_style)}">${md.renderInline(spec.licence_line, e)}</p>\n`
  const html = fill(
    template('companion'),
    {
      head: head({ ...spec, css: 'spec' }),
      stamp: md.renderInline(spec.stamp, e),
      title: md.renderInline(spec.title, e),
      subtitle: md.renderInline(spec.subtitle, e),
      notes: noteParas(md, e, spec.notes),
      body,
    },
    'theme/templates/companion.html',
  )
  return { name: 'method.html', html }
}

/** One page per step, beside the specification: steps/NN-name.html. */
export function renderStepPages(loaded = loadSpec()) {
  const { spec, phases, steps } = loaded
  const md = createMarkdown('spec')
  return steps.map((step, i) => {
    const phase = phases.find((p) => p.steps.includes(step))
    const link = (s, arrow) =>
      s ? `<a href="${s.slug}.html">${arrow === '←' ? '← ' : ''}${esc(s.meta.number)} · ${md.renderInline(s.meta.title)}${arrow === '→' ? ' →' : ''}</a>` : `<span style="opacity:.4">${arrow}</span>`
    const nav = `${link(steps[i - 1], '←')} · <a href="../method.html#steps">The ten steps</a> · ${link(steps[i + 1], '→')} · <a href="../method.html#${esc(step.meta.id)}">In the specification</a>`
    const def = /^::: def\n([\s\S]*?)\n:::/m.exec(step.body)?.[1] ?? ''
    const e = env(step.file)
    const html = fill(
      template('step'),
      {
        head: head({
          html_title: `Step ${step.meta.number} · ${step.meta.title} · The Outside-In Method`,
          meta: spec.meta.filter((m) => !('og:url' in m) && !('og:title' in m) && !('twitter:title' in m)),
          css: 'spec',
          depth: 1,
          description: def.replace(/\*\*|`/g, ''),
        }),
        stamp: `${esc(spec.version)} · STEP ${esc(step.meta.number)} OF TEN · ${md.renderInline(phase.label.toUpperCase(), e)}`,
        number: esc(step.meta.number),
        title: md.renderInline(step.meta.title, e),
        nav,
        phase_label: md.renderInline(phase.label, e),
        phase_hint: md.renderInline(phase.hint, e),
        step: renderStepDiv(md, step, { rebase: true }),
        licence_line: md.renderInline(spec.licence_line.replace('](LICENSE)', '](../LICENSE)'), e),
      },
      'theme/templates/step.html',
    )
    return { name: `steps/${step.slug}.html`, html }
  })
}

// ------------------------------------------------------------------------------------------ companions
/** The foreword and the worked example: header with notes, then the body. */
export function renderCompanion(file, name) {
  const source = readSource(file)
  const md = createMarkdown('companion')
  const e = env(file)
  const html = fill(
    template('companion'),
    {
      head: head({ ...source.meta, css: source.meta.css ?? 'spec' }),
      stamp: md.renderInline(source.meta.stamp, e),
      title: md.renderInline(source.meta.title, e),
      subtitle: md.renderInline(source.meta.subtitle ?? '', e),
      notes: noteParas(md, e, source.meta.notes),
      body: md.render(source.body, e),
    },
    'theme/templates/companion.html',
  )
  return { name, html }
}

// ------------------------------------------------------------------------------------------ derivations
export function renderDerivations() {
  const dir = join(ROOT, 'derivations')
  const list = yaml(join(dir, 'derivations.yaml'))
  const md = createMarkdown('derivation')
  const pieces = list.pieces.map((slug) => ({ slug, ...readSource(join(dir, `${slug}.md`)) }))
  const index = { slug: list.index, ...readSource(join(dir, `${list.index}.md`)) }
  const link = (p) => `<a href="${p.slug}.html">${esc(p.meta.number)} · ${md.renderInline(p.meta.short ?? p.meta.title)}</a>`
  const page = (p, nav) =>
    fill(
      template('derivation'),
      {
        head: head({ ...p.meta, css: 'derivation', depth: 1 }),
        stamp: md.renderInline(p.meta.stamp, env(p.file)),
        title: md.renderInline(p.meta.title, env(p.file)),
        subtitle: md.renderInline(p.meta.subtitle ?? '', env(p.file)),
        nav,
        body: md.render(p.body, env(p.file)),
      },
      'theme/templates/derivation.html',
    )
  return [
    { name: `derivations/${index.slug}.html`, html: page(index, '') },
    ...pieces.map((p, i) => {
      const prev = pieces[i - 1] ? `← ${link(pieces[i - 1])}` : '<span style="opacity:.4">←</span>'
      const next = pieces[i + 1] ? `${link(pieces[i + 1])} →` : '<span style="opacity:.4">→</span>'
      const nav = `<nav class="toc" aria-label="Contents">${prev} · <a href="index.html">The eight</a> · ${next} · <a href="../method.html">Method</a></nav>\n`
      return { name: `derivations/${p.slug}.html`, html: page(p, nav) }
    }),
  ]
}

// ------------------------------------------------------------------------------------------ evidence
export function renderEvidence() {
  const file = join(ROOT, 'evidence', 'stress-demonstration.md')
  const source = readSource(file)
  const md = createMarkdown('plain')
  const html = fill(
    template('evidence'),
    { head: head({ ...source.meta, css: 'evidence', depth: 1 }), body: md.render(source.body, env(file)) },
    'theme/templates/evidence.html',
  )
  return { name: 'evidence/stress-demonstration.html', html }
}
