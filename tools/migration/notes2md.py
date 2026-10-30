#!/usr/bin/env python3
"""The working notes that move as plain Markdown (no dialect, no page): the deliverables map -> HISTORY.md,
the article draft with its production notes -> article/draft-and-production-notes.md."""
import re, sys, pathlib, html
from bs4 import BeautifulSoup, NavigableString, Tag, Comment
W = pathlib.Path(sys.argv[1]); R = pathlib.Path(sys.argv[2])
ws = lambda s: re.sub(r'\s+', ' ', s)
def inl(n):
    if isinstance(n, Comment): return ''
    if isinstance(n, NavigableString): return ws(str(n)).replace('*', '\\*')
    inner = ''.join(inl(c) for c in n.children)
    if n.name in ('b', 'strong'): return f'**{inner.strip()}**' if inner.strip() else ''
    if n.name in ('i', 'em'): return f'*{inner.strip()}*' if inner.strip() else ''
    if n.name == 'a' and n.get('href'): return f'[{inner}]({n["href"]})'
    if n.name == 'br': return ' '
    if n.name == 'code' or (n.name == 'span' and 'code' in n.get('class', [])): return '`' + ws(n.get_text()) + '`'
    return inner
def table(t):
    rows = [tr for tr in t.find_all('tr') if tr.find_parent('table') is t]
    cells = [[ws(''.join(inl(x) for x in c.children)).strip().replace('|', '\\|') for c in tr.find_all(['td', 'th'], recursive=False)] for tr in rows]
    n = max(len(r) for r in cells)
    cells = [r + [''] * (n - len(r)) for r in cells]
    out = ['| ' + ' | '.join(cells[0]) + ' |', '|' + '---|' * n] + ['| ' + ' | '.join(r) + ' |' for r in cells[1:]]
    return '\n'.join(out) + '\n'
def blocks(nodes, depth=0):
    out = []
    for el in nodes:
        if isinstance(el, Comment): continue
        if isinstance(el, NavigableString):
            if el.strip(): out.append(ws(str(el)).strip() + '\n')
            continue
        n = el.name
        if n in ('style', 'script', 'svg'): continue
        if n in ('h1', 'h2', 'h3', 'h4', 'h5'):
            out.append('#' * min(6, int(n[1])) + ' ' + ws(''.join(inl(c) for c in el.children)).strip() + '\n')
        elif n == 'p':
            t = ws(''.join(inl(c) for c in el.children)).strip()
            if t: out.append(t + '\n')
        elif n in ('ul', 'ol'):
            items = [c for c in el.children if isinstance(c, Tag) and c.name == 'li']
            out.append('\n'.join(('- ' if n == 'ul' else f'{i+1}. ') + ws(''.join(inl(x) for x in li.children)).strip() for i, li in enumerate(items)) + '\n')
        elif n == 'table':
            out.append(table(el))
        elif n == 'blockquote':
            out.append('\n'.join('> ' + l for l in ws(''.join(inl(c) for c in el.children)).strip().split('\n')) + '\n')
        elif n == 'pre':
            out.append('```\n' + el.get_text().strip('\n') + '\n```\n')
        elif n in ('figure', 'figcaption'):
            cap = el.find('figcaption') if n == 'figure' else el
            if cap and n == 'figure': out.append('*Figure: ' + ws(cap.get_text()).strip() + '*\n')
            elif n == 'figcaption': out.append('*' + ws(el.get_text()).strip() + '*\n')
        else:
            # a div/section/header/nav/footer: its children; a div holding only inline content is a paragraph
            if not any(isinstance(c, Tag) and c.name in ('p', 'div', 'ul', 'ol', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'section', 'figure', 'blockquote', 'pre', 'header', 'footer', 'nav') for c in el.children):
                t = ws(''.join(inl(c) for c in el.children)).strip()
                if t: out.append(t + '\n')
            else:
                out.append(blocks(list(el.children), depth + 1))
    return '\n'.join(x.rstrip('\n') for x in out if x.strip()) + '\n'
def convert(src, dst, preface):
    soup = BeautifulSoup(src.read_text(encoding='utf-8'), 'html.parser')
    body = soup.body
    md = blocks(list(body.children))
    md = re.sub(r'\n{3,}', '\n\n', md)
    dst.write_text(preface + md, encoding='utf-8')
    print(dst.name, len(md.split()), 'words')
convert(W / 'docs/outside-in/deliverables.html', R / 'HISTORY.md',
        '# History: the deliverables map, as it stood at the move\n\n'
        '> The working index of the Outside-In corpus up to 2026-10-30, when the corpus moved from the teob repository\n'
        '> (`website/public/method/`, `website/book/`, `website/docs/outside-in/`) into this one. It is kept as history:\n'
        '> the versions it names are the ones the pieces carried at the move, and nothing here is maintained. From the\n'
        '> move on, this repository\'s git log carries the history, and the Jira project CORE carries the plans.\n'
        '> Converted from `docs/outside-in/deliverables.html` (V13 · 2026-10-11) without changing its words.\n\n')
convert(W / 'docs/outside-in/article-draft.html', R / 'article/draft-and-production-notes.md',
        '# The article draft, with its production notes\n\n'
        '> The source of truth of the Medium article `article.md` (see `CHECKLIST.md`), converted from\n'
        '> `docs/outside-in/article-draft.html` (V6 · 2026-10-12) at the move, without changing its words. The figures\n'
        '> it describes are `fig1.png` to `fig7.png`.\n\n')
