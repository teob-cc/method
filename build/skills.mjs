#!/usr/bin/env node
// Generates plugins/outside-in/skills/derive/references/ten-steps.md from the specification's step sources, as
// plain Markdown an agent reads. The specification governs; this file is a projection of it.
//
//   node build/skills.mjs            write the file
//   node build/skills.mjs --check    exit 1 if the committed file is not what the sources produce
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadSpec } from './lib/pages.mjs'
import { ROOT, readSource } from './lib/util.mjs'
import { BuildError } from './lib/markdown.mjs'

const OUT = join(ROOT, 'plugins', 'outside-in', 'skills', 'derive', 'references', 'ten-steps.md')

// ---------------------------------------------------------------------------------------------- inline
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
/** Inline HTML and dialect spans to plain Markdown. */
function inlinePlain(s) {
  return unescape(
    s
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<(b|strong)>(.*?)<\/\1>/gs, '**$2**')
      .replace(/<(i|em)>(.*?)<\/\1>/gs, '*$2*')
      .replace(/<span class="code">(.*?)<\/span>/gs, '`$1`')
      .replace(/<a href="([^"]*)">(.*?)<\/a>/gs, '[$2]($1)')
      .replace(/<[^>]+>/g, '')
      .replace(/\[([^\]]*)\]\{\.[\w-]+\}/g, '$1')
      .replace(/\\([*_\[\]`])/g, '$1'),
  )
}
// ---------------------------------------------------------------------------------------------- raw HTML
function htmlTable(html) {
  const rows = [...html.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs)].map((m) =>
    [...m[1].matchAll(/<(t[dh])([^>]*)>(.*?)<\/\1>/gs)].map((c) => ({
      th: c[1] === 'th',
      span: Number(/colspan="(\d+)"/.exec(c[2])?.[1] ?? 1),
      text: inlinePlain(c[3]).replace(/\s*\n\s*/g, ' ').trim().replace(/\|/g, '\\|'),
    })),
  )
  const width = Math.max(...rows.map((r) => r.reduce((n, c) => n + c.span, 0)))
  const line = (r) => '| ' + r.flatMap((c) => [c.text, ...Array(c.span - 1).fill('')]).concat(Array(Math.max(0, width - r.reduce((n, c) => n + c.span, 0))).fill('')).join(' | ') + ' |'
  const header = rows[0].every((c) => c.th) ? rows.shift() : Array.from({ length: width }, () => ({ text: '', span: 1 }))
  return [line(header), '|' + '---|'.repeat(width), ...rows.map(line)].join('\n')
}
function rawBlockPlain(html) {
  if (/^<table/.test(html)) return htmlTable(html)
  if (/^<(ul|ol)/.test(html)) {
    const ordered = html.startsWith('<ol')
    return [...html.matchAll(/<li>(.*?)<\/li>/gs)].map((m, i) => `${ordered ? i + 1 + '.' : '-'} ${inlinePlain(m[1]).trim()}`).join('\n')
  }
  const h = /^<h([1-6])[^>]*>(.*?)<\/h\1>/s.exec(html)
  if (h) return '#'.repeat(Math.min(6, Number(h[1]) + 1)) + ' ' + inlinePlain(h[2]).trim()
  const p = /^<p[^>]*>(.*?)<\/p>$/s.exec(html.trim())
  if (p) return inlinePlain(p[1]).trim()
  const bq = /^<blockquote>(.*?)<\/blockquote>$/s.exec(html.trim())
  if (bq) return inlinePlain(bq[1]).trim().split('\n').map((l) => '> ' + l).join('\n')
  return inlinePlain(html).trim()
}

// ---------------------------------------------------------------------------------------------- the dialect
const QUOTE = { warn: '**Anti-pattern.** ', say: '', fb: '**Feedback.** ', note: '', good: '', concede: '', own: '', verdict: '' }
/** A piece of the dialect to plain Markdown: fences unwrapped or turned into quotes, attributes dropped. */
export function plain(md) {
  const out = []
  const stack = []
  const lines = md.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const open = /^:::\s*(?:([\w-]+)\s*)?(\{[^}]*\})?\s*$/.exec(line)
    if (open && (open[1] || open[2]) && !/^:::\s*$/.test(line)) {
      const name = open[1] ?? ''
      // an inline container: collect until its close
      if (['def', 'asks', 'prod', 'lede', 'meta', 'prov', 'cell', 'p', 'tab', 'kick', 'stepnum', 'doccode', 'toc', 'footer', ...Object.keys(QUOTE)].includes(name)) {
        const body = []
        i++
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) body.push(lines[i++])
        i++
        const text = inlinePlain(body.join('\n')).trim()
        if (name === 'asks') out.push('**Asks** ' + text.replace(/^ASKS · /, ''))
        else if (name === 'prod') out.push('**Deliverable** ' + text.replace(/^→ PRODUCES: /, ''))
        else if (name in QUOTE) out.push(text.split('\n').map((l, n) => '> ' + (n === 0 ? QUOTE[name] : '') + l).join('\n'))
        else if (name === 'toc') { /* navigation */ }
        else out.push(text)
        out.push('')
        continue
      }
      if (name === 'figure') {
        i++
        const body = []
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) body.push(lines[i++])
        i++
        const alt = /^!\[(.*?)\]\(/.exec(body[0])?.[1] ?? ''
        const caption = inlinePlain(body.slice(1).join('\n')).trim()
        out.push(`*Figure: ${alt}*` + (caption ? `\n\n${caption}` : ''), '')
        continue
      }
      stack.push(name)   // transparent containers: mod, body, grid2, grid3, card, section, {}
      i++
      continue
    }
    if (/^:::\s*$/.test(line)) { stack.pop(); i++; continue }
    if (/^\{[^}]*\}\s*$/.test(line)) { i++; continue }   // an attribute line under a table or list
    if (/^<(table|ul|ol|p|h[1-6]|blockquote|div)\b/.test(line)) {
      const block = [line]
      i++
      while (i < lines.length && lines[i].trim() !== '') block.push(lines[i++])
      out.push(rawBlockPlain(block.join('\n')), '')
      continue
    }
    let text = line
    const h = /^(#{1,6})\s+(.*?)(\s*\{[^}]*\})?\s*$/.exec(text)
    if (h) text = '#'.repeat(Math.min(6, h[1].length + 1)) + ' ' + inlinePlain(h[2])
    else {
      text = text.replace(/^(\|\s*)\{[^}]*\}\s*/g, '$1').replace(/(\|\s*)\{[^}]*\}\s*/g, '$1')   // cell attributes
      text = inlinePlain(text)
    }
    out.push(text)
    i++
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/** The h3 subsection of a section source, from its heading line to the next heading of the same or higher level. */
function subsection(body, heading) {
  const lines = body.split('\n')
  const quoted = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const start = lines.findIndex((l) => new RegExp(`^(### |<h3[^>]*>)${quoted}(\\s|\\{|<|$)`).test(l))
  if (start < 0) throw new BuildError(`no "### ${heading}" subsection found`)
  let end = lines.findIndex((l, n) => n > start && /^(#{1,3}\s|<h[1-3][\s>])/.test(l))
  if (end < 0) end = lines.length
  return lines.slice(start + 1, end).join('\n')
}

export function generate() {
  const { spec, phases, sections } = loadSpec()
  const section = (id) => sections.find((s) => s.meta.id === id) ?? (() => { throw new BuildError(`no section ${id}`) })()
  const out = [
    '# The ten steps — asks and deliverables',
    '',
    `> Generated from the specification's step sources (\`spec/steps/*.md\`, The Outside-In Method ${spec.version}) by \`npm run skills\`.`,
    '> Do not edit it here: edit the specification and regenerate. Where this file and the specification disagree, the',
    '> specification governs: https://teob.cc/method/method.html#steps',
    '',
    'Each step states what it asks and what it produces. The written artifact is what the next step consumes.',
    '',
    '---',
  ]
  for (const phase of phases) {
    out.push('', `## ${phase.label}`, `*${phase.hint}*`, '')
    for (const step of phase.steps) {
      out.push(`### ${step.meta.number} · ${step.meta.title}`, '', plain(step.body))
    }
  }
  out.push('---', '', '## Who signs which artifact', '', plain(subsection(section('disc').body, 'Who signs which artifact')))
  out.push('---', '', '## Amendment — the living description', '', plain(section('amend').body))
  out.push('---', '', '## Names and meaning', '', plain(subsection(section('prim').body, 'Names carry a scope and a contract')))
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

const args = process.argv.slice(2)
try {
  const text = generate()
  if (args.includes('--check')) {
    const current = readFileSync(OUT, 'utf8')
    if (current !== text) {
      console.error(`skills: ${OUT} is out of date; run "npm run skills"`)
      process.exit(1)
    }
    console.log('skills: ten-steps.md is up to date')
  } else {
    writeFileSync(OUT, text)
    console.log(`skills: wrote ${OUT} (${text.split(/\s+/).length} words)`)
  }
} catch (error) {
  if (!(error instanceof BuildError)) throw error
  console.error(`skills: ${error.message}`)
  process.exit(1)
}
