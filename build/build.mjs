#!/usr/bin/env node
// Builds the whole of teob.cc/method from the sources in this repository into dist/ (or --out DIR):
//   method.html and steps/        the specification, from spec/
//   foreword.html                 from foreword/
//   worked-example.html           from worked-example/
//   derivations/                  from derivations/
//   evidence/                     from evidence/
//   book/                         from book/
//   index.html                    the landing, from landing/
//   fonts/, og*.png, LICENSE      copied
// A mistake in a source stops the build and names the file.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BuildError } from './lib/markdown.mjs'
import { ROOT, fontFiles } from './lib/util.mjs'
import { renderBook } from './lib/book.mjs'
import { loadSpec, renderCompanion, renderDerivations, renderEvidence, renderSpec, renderStepPages } from './lib/pages.mjs'
import { renderLanding } from './lib/landing.mjs'

export function renderSite() {
  const spec = loadSpec()
  return [
    renderSpec(spec),
    ...renderStepPages(spec),
    renderCompanion(join(ROOT, 'foreword', 'foreword.md'), 'foreword.html'),
    renderCompanion(join(ROOT, 'worked-example', 'worked-example.md'), 'worked-example.html'),
    ...renderDerivations(),
    renderEvidence(),
    ...renderBook(),
    ...renderLanding(),
  ]
}

const STATIC = [
  ['LICENSE', 'LICENSE'],
  ['og/og-method.png', 'og.png'],
  ['og/og-foreword.png', 'og-foreword.png'],
  ['og/og-book.png', 'book/og.png'],
]

export function build(out) {
  const pages = renderSite()
  rmSync(out, { recursive: true, force: true })
  for (const { name, html } of pages) {
    const path = join(out, name)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, html)
  }
  mkdirSync(join(out, 'fonts'), { recursive: true })
  for (const f of fontFiles()) cpSync(join(ROOT, 'theme', 'fonts', f), join(out, 'fonts', f))
  for (const f of ['LICENSE-IBM-Plex.txt', 'LICENSE-Inter.txt', 'LICENSE-JetBrains-Mono.txt']) cpSync(join(ROOT, 'theme', 'fonts', f), join(out, 'fonts', f))
  for (const [from, to] of STATIC) {
    if (!existsSync(join(ROOT, from))) throw new BuildError(`${from} does not exist`)
    mkdirSync(dirname(join(out, to)), { recursive: true })
    cpSync(join(ROOT, from), join(out, to))
  }
  return pages.length
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const out = args.includes('--out') ? resolve(args[args.indexOf('--out') + 1]) : join(ROOT, 'dist')
  try {
    const n = build(out)
    console.log(`site: ${n} pages written to ${relative(process.cwd(), out) || '.'}`)
  } catch (error) {
    if (!(error instanceof BuildError)) throw error
    console.error(`build: ${error.message}`)
    process.exit(1)
  }
}
