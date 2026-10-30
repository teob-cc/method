// The /method landing: landing/index.md in teob.cc's dark tokens, with its own template and stylesheet.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createMarkdown, esc } from './markdown.mjs'
import { ROOT, env, fill, fontsCss, metaTags, readSource } from './util.mjs'

export function renderLanding() {
  const file = join(ROOT, 'landing', 'index.md')
  const source = readSource(file)
  const md = createMarkdown('landing')
  const head = fill(
    readFileSync(join(ROOT, 'theme', 'templates', 'head.html'), 'utf8'),
    {
      html_title: esc(source.meta.html_title),
      meta: metaTags(source.meta.meta),
      icon: source.meta.icon ? `<link rel="icon" href="${source.meta.icon}">\n` : '',
      fonts_css: fontsCss(''),
      css: readFileSync(join(ROOT, 'theme', 'landing.css'), 'utf8'),
    },
    'theme/templates/head.html',
  )
  const html = fill(readFileSync(join(ROOT, 'theme', 'templates', 'landing.html'), 'utf8'), { head, body: md.render(source.body, env(file)) }, 'theme/templates/landing.html')
  return [{ name: 'index.html', html }]
}
