#!/usr/bin/env node
// Serves dist/ at http://localhost:5174/method/ and rebuilds on every change under the source directories.
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync, watch } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { build } from './build.mjs'
import { BuildError } from './lib/markdown.mjs'
import { ROOT } from './lib/util.mjs'

const OUT = join(ROOT, 'dist')
const PORT = Number(process.env.PORT ?? 5174)
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '': 'text/plain' }

function rebuild() {
  try {
    const n = build(OUT)
    console.log(`${new Date().toLocaleTimeString()} built ${n} pages`)
  } catch (error) {
    if (!(error instanceof BuildError)) throw error
    console.error(`build: ${error.message} (serving the last good pages)`)
  }
}
rebuild()
let timer
for (const dir of ['spec', 'book', 'foreword', 'worked-example', 'derivations', 'evidence', 'landing', 'theme', 'og', 'build']) {
  if (!existsSync(join(ROOT, dir))) continue
  watch(join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer)
    timer = setTimeout(rebuild, 150)
  })
}
createServer((req, res) => {
  let path = decodeURIComponent((req.url ?? '/').split('?')[0])
  if (path === '/' || path === '/method') { res.writeHead(302, { Location: '/method/' }); return res.end() }
  path = normalize(path.replace(/^\/method/, '')) || '/'
  let file = join(OUT, path)
  if (!file.startsWith(OUT)) { res.writeHead(403); return res.end() }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file) && existsSync(file + '.html')) file += '.html'
  if (!existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end(`not found: ${path}`) }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' })
  res.end(readFileSync(file))
}).listen(PORT, () => console.log(`http://localhost:${PORT}/method/  (rebuilding on change)`))
