#!/usr/bin/env node
// Checks the built site in dist/: every local link and anchor resolves, every page's tags balance, and no SVG
// text is wider than the room its viewBox gives it (an estimate: characters × font-size × 0.6).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { ROOT } from './lib/util.mjs'

const OUT = resolve(process.argv.includes('--dir') ? process.argv[process.argv.indexOf('--dir') + 1] : join(ROOT, 'dist'))
const pages = []
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.html')) pages.push(p)
  }
})(OUT)

const ids = new Map(pages.map((p) => [p, new Set([...readFileSync(p, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]))
const problems = []
const warnings = []
const decode = (t) => t.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&(amp|lt|gt|nbsp);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', nbsp: ' ' })[e])
const VOID = new Set(['meta', 'link', 'br', 'img', 'hr', 'input', 'col', 'wbr', 'source', 'path', 'rect', 'line', 'circle', 'polyline', 'polygon', 'use', 'stop', 'ellipse'])

for (const page of pages) {
  const html = readFileSync(page, 'utf8')
  const rel = relative(OUT, page)
  // links
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1]
    if (/^(https?:|mailto:|data:|\/|#$)/.test(href)) continue   // absolute paths point at teob.cc, outside this site
    const [path, anchor] = href.split('#')
    let target = page
    if (path) {
      target = resolve(dirname(page), path)
      if (!target.startsWith(OUT)) { problems.push(`${rel}: link leaves the site: ${href}`); continue }
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html')
      if (!existsSync(target) && existsSync(target + '.html')) target += '.html'
      if (!existsSync(target)) { problems.push(`${rel}: broken link ${href}`); continue }
    }
    if (anchor && target.endsWith('.html') && !ids.get(target)?.has(anchor)) problems.push(`${rel}: no anchor #${anchor} in ${relative(OUT, target)}`)
  }
  // tag balance, outside svg
  const body = html.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<!--[\s\S]*?-->/g, '')
  const stack = []
  for (const m of body.matchAll(/<(\/?)([a-zA-Z][\w-]*)[^>]*?(\/?)>/g)) {
    const [, close, tag, self] = m
    if (VOID.has(tag.toLowerCase()) || self) continue
    if (!close) stack.push(tag)
    else if (stack.length && stack[stack.length - 1] === tag) stack.pop()
    else problems.push(`${rel}: unbalanced </${tag}> (open: ${stack.slice(-3).join(' > ')})`)
  }
  if (stack.length) problems.push(`${rel}: unclosed <${stack.join('>, <')}>`)
  // svg text width
  for (const svg of html.matchAll(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/g)) {
    const width = Number(svg[1].split(/\s+/)[2])
    const base = Number(/font-size="([\d.]+)"/.exec(svg[0].slice(0, svg[0].indexOf('>')))?.[1] ?? 11)
    for (const t of svg[2].matchAll(/<text([^>]*)>([^<]*)</g)) {
      const x = Number(/\bx="([\d.-]+)"/.exec(t[1])?.[1] ?? 0)
      const size = Number(/font-size="([\d.]+)"/.exec(t[1])?.[1] ?? base)
      const anchor = (/text-anchor="(middle|end)"/.exec(t[1]) ?? /text-anchor:\s*(middle|end)/.exec(t[1]))?.[1]
      const text = decode(t[2])
      const est = text.length * size * 0.6
      const right = anchor === 'middle' ? x + est / 2 : anchor === 'end' ? x : x + est
      if (right > width + 2) warnings.push(`${rel}: svg text may overflow (${Math.round(right)} > ${width}, estimated): "${text.slice(0, 40)}"`)
    }
  }
}
if (warnings.length) console.warn(warnings.join('\n'))
if (problems.length) {
  console.error(problems.join('\n'))
  console.error(`check: ${problems.length} problems in ${pages.length} pages`)
  process.exit(1)
}
console.log(`check: ${pages.length} pages, links and anchors resolve, tags balance`)
