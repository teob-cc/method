#!/usr/bin/env python3
"""One-off migration: the hand-authored HTML pages of teob.cc/method -> Markdown sources in this repository's dialect.

Run once, from the website/ directory of teob at the commit the corpus was moved from:

    python3 -I tools/migration/html2md.py <website-dir> <repo-dir>

It writes spec/, foreword/, worked-example/, derivations/, evidence/ sources and their figures. The landing is
converted separately (landing.py). The result is checked by tools/migration/compare.py against the original pages.
Kept in the repository as the record of how the sources were produced; it is not part of the build.
"""
import re, sys, json, pathlib
from bs4 import BeautifulSoup, NavigableString, Comment, Tag

W = pathlib.Path(sys.argv[1]).resolve()
R = pathlib.Path(sys.argv[2]).resolve()
PM = W / 'public' / 'method'

# ------------------------------------------------------------------------------------------------ dialect tables
# Classes whose element holds inline content only, and the element each renders as. The build has the same tables.
INLINE_P = {'lede', 'def', 'asks', 'prod', 'meta', 'prov', 'subtitle', 'standfirst', 'lead', 'bigline',
            'eyebrow', 'promise', 'signcap', 'xmcap', 'h1sub', 'foot', 'body'}
INLINE_DIV = {'tab', 'kick', 'fb', 'say', 'cell', 'warn', 'good', 'note', 'concede', 'own', 'verdict', 'stepnum', 'doccode',
              'plabel', 'qrow', 'cta', 'grid', 'heritage', 'prim', 'counter'}
INLINE_BY_KIND = {}
INLINE_TAGS = {'b', 'strong', 'i', 'em', 'span', 'a', 'br', 'sup', 'sub', 'code', 'cite', 'small', 'u', 's'}
BLOCK_TAGS = {'p', 'div', 'ul', 'ol', 'li', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'figure',
              'figcaption', 'header', 'footer', 'nav', 'pre', 'blockquote', 'tr', 'td', 'th', 'svg', 'hr'}

class Ctx:
    def __init__(self, kind, page, figdir, figprefix, figrel, fignames):
        self.kind, self.page, self.figdir, self.figprefix, self.figrel, self.fignames = kind, page, figdir, figprefix, figrel, fignames
        self.fig_n = 0
        self.raw = 0        # raw HTML blocks emitted
        self.notes = []
    def inline_tag(self, cls):
        k = INLINE_BY_KIND.get(self.kind, {})
        if cls in k: return k[cls]
        if cls in INLINE_P: return 'p'
        if cls in INLINE_DIV: return 'div'
        return None

# ------------------------------------------------------------------------------------------------ text helpers
def ws(s):
    return re.sub(r'\s+', ' ', s)

def esc(t):
    """Escape what markdown-it would otherwise read as markup inside running text."""
    t = t.replace('\\', '\\\\')
    t = t.replace('*', '\\*')
    t = re.sub(r'(?<![A-Za-z0-9])_|_(?![A-Za-z0-9])', r'\\_', t)   # an underscore at a word boundary opens emphasis
    t = t.replace('`', '\\`')
    if '[' in t and ']' in t:
        t = t.replace('[', '\\[').replace(']', '\\]')
    t = re.sub(r'<(?=[A-Za-z/!])', '&lt;', t)
    return t

def has_block(el):
    return any(isinstance(c, Tag) and (c.name in BLOCK_TAGS) for c in el.descendants)

def attrs_md(el, drop=()):
    """{#id .class key="value"} for the attributes of el beyond the first class."""
    parts = []
    if el.get('id'): parts.append('#' + el['id'])
    for c in el.get('class', [])[1:]: parts.append('.' + c)
    for k, v in el.attrs.items():
        if k in ('id', 'class') or k in drop: continue
        if isinstance(v, list): v = ' '.join(v)
        q = "'" if '"' in v else '"'
        parts.append(f'{k}={q}{v}{q}')
    return ' {' + ' '.join(parts) + '}' if parts else ''

# ------------------------------------------------------------------------------------------------ inline
def wrap_emph(mark, inner):
    m = re.match(r'^(\s*)(.*?)(\s*)$', inner, flags=re.S)
    lead, core, tail = m.groups()
    if not core: return inner
    return f'{lead}{mark}{core}{mark}{tail}'

def inl(node, ctx):
    if isinstance(node, Comment): return ''
    if isinstance(node, NavigableString): return esc(ws(str(node)))
    n = node.name
    inner = ''.join(inl(c, ctx) for c in node.children)
    cls = node.get('class', [])
    if n in ('b', 'strong'):
        return wrap_emph('**', inner) if not node.attrs else raw_inline(node)
    if n in ('i', 'em'):
        return wrap_emph('*', inner) if not node.attrs else raw_inline(node)
    if n == 'span':
        if list(node.attrs.keys()) == ['class'] and len(cls) == 1:
            if cls[0] == 'code': return '`' + ws(node.get_text()).replace('`', '\\`') + '`' if '`' not in node.get_text() else raw_inline(node)
            return f'[{inner}]{{.{cls[0]}}}'
        return raw_inline(node)
    if n == 'a':
        if set(node.attrs.keys()) <= {'href'} and node.get('href'):
            href = node['href']
            if re.search(r'[()\s]', href): return raw_inline(node)
            return f'[{inner}]({href})'
        return raw_inline(node)
    if n == 'br': return '<br>'
    if n == 'code' and not node.attrs:
        return '`' + ws(node.get_text()) + '`'
    return raw_inline(node)

def raw_inline(node):
    """The element as HTML, with its text children left as HTML (not Markdown)."""
    s = str(node)
    return ws(s)

# ------------------------------------------------------------------------------------------------ blocks
def para_text(el, ctx):
    return ''.join(inl(c, ctx) for c in el.children).strip()

def line_escape(md):
    """Escape what would start a block at the beginning of a line."""
    out = []
    for line in md.split('\n'):
        s = line.lstrip()
        if re.match(r'^(#{1,6}\s|>|[-+*]\s|\d+[.)]\s|:::|\|)', s) or s.startswith('<'):
            # inline HTML at line start is legal markdown; only block starters are escaped
            if not s.startswith('<'):
                line = line[:len(line) - len(s)] + '\\' + s
        out.append(line)
    return '\n'.join(out)

def fence(name, attrs, body):
    body = body.strip('\n')
    return f'::: {name}{attrs}\n{body}\n:::\n'

def raw_block(el, ctx):
    ctx.raw += 1
    s = str(el)
    # one row per line for tables, no blank lines anywhere (a blank line ends an HTML block in markdown-it)
    if el.name == 'table':
        s = re.sub(r'\s*<tr', '\n<tr', s)
        s = re.sub(r'</tr>\s*', '</tr>\n', s)
        s = re.sub(r'\s*</table>', '\n</table>', s)
    s = re.sub(r'\n\s*\n+', '\n', s.strip())
    return s + '\n'

def table_md(t, ctx):
    rows = [tr for tr in t.find_all('tr') if tr.find_parent('table') is t]
    if not rows: return None
    cells = [[c for c in tr.find_all(['td', 'th'], recursive=False)] for tr in rows]
    n = len(cells[0])
    if any(len(r) != n for r in cells): return None
    if not all(c.name == 'th' for c in cells[0]): return None
    if any(c.name == 'th' for r in cells[1:] for c in r): return None
    widths = []
    def cell_prefix(c):
        extra = {k: v for k, v in c.attrs.items() if k != 'style' or c.name == 'td'}
        if set(extra) - {'class'}: return False
        cls = extra.get('class', [])
        return ('{' + ' '.join('.' + x for x in cls) + '} ') if cls else ''
    for c in cells[0]:
        if cell_prefix(c) is False: return None
        st = c.get('style', '')
        m = re.fullmatch(r'\s*width:\s*([^;]+);?\s*', st) if st else None
        if st and not m: return None
        widths.append(m.group(1).strip() if m else '*')
    for r in cells[1:]:
        for c in r:
            if cell_prefix(c) is False: return None
    for r in cells:
        for c in r:
            if any(isinstance(d, Tag) and d.name in BLOCK_TAGS for d in c.descendants): return None
    tattrs = ''
    if t.attrs:
        if set(t.attrs) - {'style', 'class'}: return None
        tattrs = ' '.join(['.' + x for x in t.get('class', [])] + ([f'style="{t["style"]}"'] if t.get('style') else []))
    def cell(c):
        return cell_prefix(c) + (''.join(inl(x, ctx) for x in c.children).strip().replace('|', '\\|').replace('\n', ' ') or ' ')
    lines = ['| ' + ' | '.join(cell(c) for c in cells[0]) + ' |', '|' + '---|' * n]
    for r in cells[1:]: lines.append('| ' + ' | '.join(cell(c) for c in r) + ' |')
    md = '\n'.join(lines) + '\n'
    while widths and widths[-1] == '*': widths.pop()
    attr_items = ([f'cols="{" ".join(widths)}"'] if widths else []) + ([tattrs] if tattrs else [])
    if attr_items: md += '\n{' + ' '.join(attr_items) + '}\n'
    return md

def list_md(el, ctx, indent='', bullet='-'):
    ordered = el.name == 'ol'
    out = []
    for i, li in enumerate([c for c in el.children if isinstance(c, Tag) and c.name == 'li']):
        marker = f'{i + 1}. ' if ordered else bullet + ' '
        pad = ' ' * len(marker)
        text_parts, sub = [], []
        for c in li.children:
            if isinstance(c, Tag) and c.name in ('ul', 'ol'): sub.append(c)
            elif isinstance(c, Tag) and c.name in BLOCK_TAGS: sub.append(c)
            else: text_parts.append(inl(c, ctx))
        text = ''.join(text_parts).strip()
        out.append(indent + marker + text)
        for s in sub:
            if s.name in ('ul', 'ol'): out.append(list_md(s, ctx, indent + pad).rstrip('\n'))
            else: out.append('\n'.join(indent + pad + l for l in blocks([s], ctx).rstrip('\n').split('\n')))
    return '\n'.join(out) + '\n'

def figure_md(fig, ctx):
    svg = fig.find('svg')
    label = fig.get('aria-label', '')
    name = ctx.fignames.get(ctx.fig_n) or f'{ctx.figprefix}-{ctx.fig_n + 1}'
    ctx.fig_n += 1
    path = ctx.figdir / f'{name}.svg'
    path.parent.mkdir(parents=True, exist_ok=True)
    svg_s = str(svg)
    path.write_text(svg_s.strip() + '\n', encoding='utf-8')
    cap = fig.find('figcaption')
    body = f'![{label}]({ctx.figrel}/{name}.svg)\n'
    if cap: body += '\n' + para_text(cap, ctx) + '\n'
    extra = {k: v for k, v in fig.attrs.items() if k not in ('role', 'aria-label')}
    if extra: ctx.notes.append(f'figure {name} had extra attrs {extra}')
    return fence('figure', '', body)

def kpi_md(el, ctx):
    items = []
    for d in el.find_all('div', recursive=False):
        n_ = d.find('div', class_='n'); l_ = d.find('div', class_='l')
        if not (n_ and l_) or d.attrs: return None
        items.append(f'- **{para_text(n_, ctx)}** · {para_text(l_, ctx)}')
    return fence('kpi', attrs_md(el), '\n'.join(items) + '\n')

def footer_md(el, ctx):
    # lines split at <br>
    parts, cur = [], []
    for c in el.children:
        if isinstance(c, Tag) and c.name == 'br':
            parts.append(''.join(cur).strip()); cur = []
        else: cur.append(inl(c, ctx))
    parts.append(''.join(cur).strip())
    return fence('footer', attrs_md(el), '\n'.join(p for p in parts if p) + '\n')

def blocks(nodes, ctx):
    out = []
    prev_list = False
    for el in nodes:
        if isinstance(el, NavigableString) and not el.strip(): continue
        was_list = prev_list
        prev_list = isinstance(el, Tag) and el.name in ('ul', 'ol')
        if isinstance(el, Comment): continue
        if isinstance(el, NavigableString):
            if el.strip(): out.append(line_escape(esc(ws(str(el)).strip())) + '\n')
            continue
        n = el.name
        cls = el.get('class', [])
        c0 = cls[0] if cls else None
        if n in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            if set(el.attrs.keys()) - {'id', 'style', 'class'}: out.append(raw_block(el, ctx)); continue
            a = attrs_md(el)
            if cls: a = (' {' + ' '.join('.' + c for c in cls) + (a[2:] if a else '}'))
            out.append('#' * int(n[1]) + ' ' + para_text(el, ctx) + a + '\n')
        elif n == 'p':
            if not el.attrs:
                out.append(line_escape(para_text(el, ctx)) + '\n')
            elif c0 and ctx.inline_tag(c0) == 'p' and set(el.attrs.keys()) <= {'class', 'style', 'id'} and not has_block(el):
                out.append(fence(c0, attrs_md(el), para_text(el, ctx) + '\n'))
            elif not c0 and set(el.attrs.keys()) <= {'style', 'id'} and not has_block(el):
                out.append(fence('p', attrs_md(el), para_text(el, ctx) + '\n'))
            else:
                out.append(raw_block(el, ctx))
        elif n in ('ul', 'ol'):
            ok = (n == 'ul' and cls == ['tight'] and set(el.attrs) <= {'class', 'style'}) or (n == 'ol' and set(el.attrs) <= {'style'})
            if ok:
                md = list_md(el, ctx, bullet='*' if was_list else '-')
                if el.get('style'): md += '\n{style="' + el['style'] + '"}\n'
                out.append(md)
            else: out.append(raw_block(el, ctx))
        elif n == 'table':
            md = table_md(el, ctx)
            out.append(md if md else raw_block(el, ctx))
        elif n == 'figure':
            out.append(figure_md(el, ctx))
        elif n == 'footer':
            out.append(footer_md(el, ctx))
        elif n == 'nav' and cls == ['toc']:
            if ctx.kind == 'derivation' and ctx.page != 'index.html': continue   # generated from derivations.yaml
            out.append(fence('toc', attrs_md(el, drop=('aria-label',)), para_text(el, ctx) + '\n'))
        elif n == 'section' and c0 == 'mod':
            tab = el.find('div', class_='tab', recursive=False)
            body = el.find('div', class_='body', recursive=False)
            if body is None or any(isinstance(c, Tag) and c not in (tab, body) for c in el.children):
                out.append(raw_block(el, ctx)); continue
            a = attrs_md(el)
            if tab is not None:
                t = para_text(tab, ctx).replace('"', '&quot;')
                a = (a[:-1] + f' tab="{t}"}}') if a else f' {{tab="{t}"}}'
            out.append(fence('mod', a, blocks(list(body.children), ctx)))
        elif n == 'section':
            a = attrs_md(el)
            if cls: a = (' {' + ' '.join('.' + c for c in cls) + a[2:]) if a else (' {' + ' '.join('.' + c for c in cls) + '}')
            out.append(fence('section', a, blocks(list(el.children), ctx)))
        elif n == 'div' and has_block(el) and any((isinstance(c, NavigableString) and c.strip()) or (isinstance(c, Tag) and c.name in INLINE_TAGS) for c in el.children):
            out.append(raw_block(el, ctx))
        elif n == 'div':
            if c0 == 'kpi':
                md = kpi_md(el, ctx)
                if md: out.append(md); continue
            if c0 is None:
                if el.attrs or not has_block(el): out.append(raw_block(el, ctx)); continue
                out.append(fence('', ' {}', blocks(list(el.children), ctx))); continue
            tag = ctx.inline_tag(c0)
            if tag == 'div' and not has_block(el):
                out.append(fence(c0, attrs_md(el), para_text(el, ctx) + '\n'))
            elif tag == 'div' and has_block(el):
                out.append(raw_block(el, ctx))
            elif tag is None and not has_block(el) and c0 not in ('wrap',):
                # an inline-only div of an unregistered class: render as a block (the build will add <p>)
                ctx.notes.append(f'{ctx.page}: inline div.{c0} not registered -> fenced block with paragraph')
                out.append(fence(c0, attrs_md(el), para_text(el, ctx) + '\n'))
            else:
                out.append(fence(c0, attrs_md(el), blocks(list(el.children), ctx)))
        elif n in ('blockquote', 'pre', 'header', 'hr'):
            out.append(raw_block(el, ctx))
        elif n in INLINE_TAGS or n == 'svg':
            # a stray inline element at block level: wrap in a paragraph
            out.append(line_escape(inl(el, ctx).strip()) + '\n')
        else:
            ctx.notes.append(f'{ctx.page}: unhandled block <{n} class={cls}> -> raw')
            out.append(raw_block(el, ctx))
    return '\n\n'.join(x.rstrip('\n') for x in out) + '\n' if out else ''

# ------------------------------------------------------------------------------------------------ pages
def yaml_str(s):
    if isinstance(s, bool): return 'true' if s else 'false'
    s = ws(s).strip()
    return json.dumps(s, ensure_ascii=False)

def head_meta(soup):
    meta = []
    for m in soup.head.find_all('meta'):
        if m.get('charset') or m.get('name') == 'viewport': continue
        key = m.get('property') or m.get('name')
        if key: meta.append((key, m.get('content', '')))
    icon = soup.head.find('link', rel='icon')
    return meta, (icon['href'] if icon else None)

def header_front(header, ctx):
    fm = {}
    dc = header.find('div', class_='doccode'); h1 = header.find('h1'); sub = header.find('p', class_='subtitle')
    fm['title'] = para_text(h1, ctx)
    fm['stamp'] = para_text(dc, ctx)
    m = re.match(r'DERIVATION (\d\d) ·', fm['stamp'])
    if m: fm['number'] = m.group(1)
    if sub: fm['subtitle'] = para_text(sub, ctx)
    notes = [para_text(p, ctx) for p in header.find_all('p', class_='note')]
    if notes: fm['notes'] = notes
    # anything else in the header is unexpected
    seen = {dc, h1, sub, *header.find_all('p', class_='note')}
    for el in header.find_all(True):
        if el in seen or el.name == 'div' and not el.get('class') or el.find_parent(['p', 'h1', 'div']) not in (header, None) and el.find_parent(['p', 'h1']) is not None: continue
        if el.name in ('b', 'i', 'a', 'span', 'em', 'br'): continue
        if el not in seen and not (el.name == 'div' and not el.attrs): ctx.notes.append(f'{ctx.page}: header has unexpected <{el.name} {el.attrs}>')
    return fm

def front_matter(fm):
    lines = ['---']
    for k, v in fm.items():
        if isinstance(v, list):
            lines.append(f'{k}:')
            for item in v:
                if isinstance(item, tuple):
                    lines.append(f'  - {json.dumps(item[0])}: {yaml_str(item[1])}')
                else:
                    lines.append(f'  - {yaml_str(item)}')
        else:
            lines.append(f'{k}: {yaml_str(v)}')
    lines.append('---')
    return '\n'.join(lines) + '\n\n'

def convert_page(html_path, kind, out_md, figdir, figrel, figprefix, fignames=None, extra_fm=None):
    soup = BeautifulSoup(html_path.read_text(encoding='utf-8'), 'html.parser')
    ctx = Ctx(kind, html_path.name, figdir, figprefix, figrel, fignames or {})
    wrap = soup.body.find('div', class_='wrap', recursive=False) or soup.body
    header = wrap.find('header', class_='doc', recursive=False)
    fm = {'kind': kind}
    if extra_fm: fm.update(extra_fm)
    if header: fm.update(header_front(header, ctx))
    meta, icon = head_meta(soup)
    fm['html_title'] = soup.title.get_text()
    fm['meta'] = meta
    if icon: fm['icon'] = icon
    body_nodes = [c for c in wrap.children if c is not header]
    # the trailing licence line is the template's
    tail_lic = None
    for c in reversed([x for x in body_nodes if isinstance(x, Tag)]):
        if c.name == 'p' and 'published by Lambda House' in c.get_text():
            tail_lic = c; break
        break
    if tail_lic is not None:
        fm['licence_line'] = para_text(tail_lic, ctx); fm['licence_line_style'] = tail_lic.get('style', '')
        body_nodes = [x for x in body_nodes if x is not tail_lic]
    md = blocks(body_nodes, ctx)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_md.write_text(front_matter(fm) + md, encoding='utf-8')
    return ctx

# ------------------------------------------------------------------------------------------------ the specification
SPEC_FIGS = {0: '02-primitives-and-graph', 1: '02-log-decomposed', 2: '02-boundaries', 3: '03-ten-steps', 4: '03-threads',
             5: 's03-data', 6: 's07-degradation-ladder', 7: 's09-operations-projection', 8: '08-forty-five-minutes'}
SECTION_FILES = {'claim': '01-claim', 'prim': '02-primitives', 'map': '03-map', 'steps': '04-steps', 'disc': '05-discipline',
                 'amend': '06-amendment', 'anti': '07-anti-patterns', 'run': '08-run-it', 'example': '09-example', 'lineage': '10-lineage'}
STEP_SLUGS = {'01': 'outside', '02': 'load', '03': 'data', '04': 'storage-and-transport', '05': 'trust', '06': 'derivation',
              '07': 'failure', '08': 'runtime-and-placement', '09': 'operations', '10': 'trace'}

def convert_spec():
    html = PM / 'method.html'
    soup = BeautifulSoup(html.read_text(encoding='utf-8'), 'html.parser')
    figdir = R / 'spec' / 'figures'
    ctx = Ctx('spec', 'method.html', figdir, 'fig', '../figures', SPEC_FIGS)
    wrap = soup.body.find('div', class_='wrap', recursive=False)
    header = wrap.find('header', class_='doc', recursive=False)
    fm = {'kind': 'spec'}
    fm.update(header_front(header, ctx))
    meta, icon = head_meta(soup)
    fm['html_title'] = soup.title.get_text()
    fm['meta'] = meta
    toc = wrap.find('nav', class_='toc', recursive=False)
    fm['toc'] = para_text(toc, ctx)
    spec_yaml = {'front': fm}
    sections, steps, phases = [], [], []
    for sec in wrap.find_all('section', class_='mod', recursive=False):
        sid = sec['id']
        tab = sec.find('div', class_='tab', recursive=False)
        body = sec.find('div', class_='body', recursive=False)
        fname = SECTION_FILES[sid]
        sfm = {'id': sid, 'tab': para_text(tab, ctx)}
        if sid != 'steps':
            md = blocks(list(body.children), ctx)
        else:
            before, after, cur_phase = [], [], None
            for c in body.children:
                if isinstance(c, Tag) and 'phase' in c.get('class', []):
                    cur_phase = {'label': para_text(c.find('span', class_='lbl'), ctx),
                                 'hint': para_text(c.find('span', class_='hint'), ctx), 'steps': []}
                    phases.append(cur_phase); continue
                if isinstance(c, Tag) and 'step' in c.get('class', []):
                    num = para_text(c.find('div', class_='stepnum'), ctx)
                    inner = [x for x in c.children if isinstance(x, Tag) and x.name == 'div' and not x.get('class')][0]
                    h4 = inner.find('h4', recursive=False)
                    title = para_text(h4, ctx)
                    rest = [x for x in inner.children if x is not h4]
                    stepfile = f'{num}-{STEP_SLUGS[num]}'
                    step_fm = {'number': num, 'id': c['id'], 'title': title, 'phase': cur_phase['label'].split()[1]}
                    md = blocks(rest, ctx)
                    (R / 'spec' / 'steps').mkdir(parents=True, exist_ok=True)
                    (R / 'spec' / 'steps' / f'{stepfile}.md').write_text(front_matter(step_fm) + md, encoding='utf-8')
                    cur_phase['steps'].append(stepfile); steps.append(stepfile); continue
                if cur_phase is None: before.append(c)
                else: after.append(c)
            md = blocks(before, ctx) + '\n{{steps}}\n' + (('\n' + blocks(after, ctx)) if any(isinstance(a, Tag) or a.strip() for a in after) else '')
        (R / 'spec' / 'sections').mkdir(parents=True, exist_ok=True)
        (R / 'spec' / 'sections' / f'{fname}.md').write_text(front_matter(sfm) + md, encoding='utf-8')
        sections.append(fname)
    # the memostrip and the licence line
    memo = wrap.find('div', class_='memostrip', recursive=False)
    memo_md = blocks([memo], ctx)
    (R / 'spec' / 'sections' / '11-ten-lines.md').write_text(front_matter({'id': 'memostrip', 'standalone': True}) + memo_md, encoding='utf-8')
    lic = [p for p in wrap.find_all('p', recursive=False) if 'published by Lambda House' in p.get_text()]
    fm['licence_line'] = para_text(lic[0], ctx) if lic else ''
    # spec.yaml
    y = ['# The specification: what the sections share, and their order. Prose lives in sections/*.md and steps/*.md.', '']
    for k, v in fm.items():
        if k == 'meta':
            y.append('meta:'); y += [f'  - {json.dumps(a)}: {yaml_str(b)}' for a, b in v]
        elif k == 'notes':
            y.append('notes:'); y += [f'  - {yaml_str(n)}' for n in v]
        else: y.append(f'{k}: {yaml_str(v)}')
    y.append(''); y.append('sections: [' + ', '.join(sections) + ']'); y.append('')
    y.append('phases:')
    for p in phases:
        y.append(f'  - label: {yaml_str(p["label"])}'); y.append(f'    hint: {yaml_str(p["hint"])}'); y.append('    steps: [' + ', '.join(p['steps']) + ']')
    (R / 'spec' / 'spec.yaml').write_text('\n'.join(y) + '\n', encoding='utf-8')
    return ctx

# ------------------------------------------------------------------------------------------------ the landing
def convert_landing():
    html = PM / 'index.html'
    soup = BeautifulSoup(html.read_text(encoding='utf-8'), 'html.parser')
    ctx = Ctx('landing', 'index.html', R / 'landing' / 'figures', 'fig', './figures', {0: 'two-axes'})
    body = soup.body
    style = body.find('style', recursive=False)
    if style is not None: style.extract()     # the stylesheet is theme/landing.css
    header = body.find('header', recursive=False)
    footer = body.find('footer', recursive=False)
    meta, icon = head_meta(soup)
    fm = {'kind': 'landing', 'html_title': soup.title.get_text(), 'meta': meta}
    if icon: fm['icon'] = icon
    nodes = [c for c in body.children if c not in (header, footer)]
    md = blocks(nodes, ctx)
    (R / 'landing').mkdir(parents=True, exist_ok=True)
    (R / 'landing' / 'index.md').write_text(front_matter(fm) + md, encoding='utf-8')
    tpl = '{{head}}<body>\n' + str(header).strip() + '\n\n{{body}}\n' + str(footer).strip() + '\n</body>\n</html>\n'
    (R / 'theme' / 'templates' / 'landing.html').write_text(tpl, encoding='utf-8')
    return ctx

# ------------------------------------------------------------------------------------------------ run
def main():
    notes = []
    c = convert_spec(); notes += c.notes; print('spec: raw blocks', c.raw, 'figures', c.fig_n)
    c = convert_page(PM / 'foreword.html', 'companion', R / 'foreword' / 'foreword.md', R / 'foreword' / 'figures', './figures', 'fig')
    notes += c.notes; print('foreword: raw', c.raw)
    c = convert_page(PM / 'worked-example.html', 'companion', R / 'worked-example' / 'worked-example.md', R / 'worked-example' / 'figures', './figures', 'fig', {0: 'read-commit-interval'})
    notes += c.notes; print('worked: raw', c.raw, 'figs', c.fig_n)
    for f in sorted((PM / 'derivations').glob('*.html')):
        c = convert_page(f, 'derivation', R / 'derivations' / (f.stem + '.md'), R / 'derivations' / 'figures', './figures', f.stem)
        notes += c.notes; print(f.name, 'raw', c.raw)
    c = convert_landing(); notes += c.notes; print('landing: raw', c.raw, 'figs', c.fig_n)
    c = convert_page(PM / 'evidence' / 'stress-demonstration.html', 'evidence', R / 'evidence' / 'stress-demonstration.md', R / 'evidence' / 'figures', './figures', 'fig')
    notes += c.notes; print('evidence: raw', c.raw)
    print('\n'.join(sorted(set(notes))))

if __name__ == '__main__':
    main()
