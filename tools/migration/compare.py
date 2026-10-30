#!/usr/bin/env python3
"""The lossless gate of the move: every rebuilt page against the page it replaces.

    python3 -I tools/migration/compare.py <original public/method dir> <dist dir> [page ...]

Per page: visible text (whitespace-normalised), anchor ids, link targets, the SVG figures, <meta> tags, and the
multiset of (tag, class) pairs and of inline style attributes. Exit code 1 if any text, id, href, svg or meta differs.
"""
import re, sys, html, pathlib, collections, difflib
from bs4 import BeautifulSoup, Comment

O = pathlib.Path(sys.argv[1]); D = pathlib.Path(sys.argv[2])
only = set(sys.argv[3:])

def soup(p): return BeautifulSoup(p.read_text(encoding='utf-8'), 'html.parser')

def text_of(s):
    s = BeautifulSoup(str(s), 'html.parser')
    for t in s.find_all(['style', 'script']): t.decompose()
    for t in s.find_all('svg'): t.replace_with(' [SVG] ')
    for c in s.find_all(string=lambda x: isinstance(x, Comment)): c.extract()
    # block boundaries become spaces so "a</p><p>b" and "a</p>\n<p>b" compare equal, inline boundaries do not
    out = []
    for el in s.body.descendants if s.body else s.descendants:
        if isinstance(el, str) and not isinstance(el, Comment): out.append(str(el))
        elif getattr(el, 'name', None) in ('p','div','li','tr','td','th','h1','h2','h3','h4','h5','h6','section','table','br','figcaption','nav','footer','header','blockquote','ul','ol','figure','pre'):
            out.append(' ')
    t = html.unescape(''.join(out))
    return re.sub(r'\s+', ' ', t).strip()

def ids(s): return sorted(set(e['id'] for e in s.find_all(id=True)))
def hrefs(s): return collections.Counter(a.get('href') for a in s.find_all('a'))
def svgs(s): return [re.sub(r'\s+', ' ', str(x)).strip() for x in s.find_all('svg')]
def metas(s): return collections.Counter((m.get('property') or m.get('name'), m.get('content')) for m in s.head.find_all('meta') if (m.get('property') or m.get('name')) and m.get('name') != 'viewport')
def classes(s):
    c = collections.Counter()
    for e in s.body.find_all(True):
        if e.find_parent('svg') or e.name == 'svg': continue
        name = e.name if e.name not in ('i', 'em') else 'i/em'
        c[(name, ' '.join(e.get('class', [])))] += 1
    return c
def styles(s):
    return collections.Counter((e.name, e.get('style')) for e in s.body.find_all(style=True) if not e.find_parent('svg'))

def show_diff(a, b, label):
    aw, bw = a.split(' '), b.split(' ')
    sm = difflib.SequenceMatcher(None, aw, bw, autojunk=False)
    n = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal': continue
        n += 1
        if n > 6: print(f'    … more differences'); break
        print(f'    {label} {tag}: orig[{i1}:{i2}]="{" ".join(aw[max(0,i1-4):i2+4])}"')
        print(f'    {" "*len(label)} built: "{" ".join(bw[max(0,j1-4):j2+4])}"')

pairs = []
for p in sorted(O.rglob('*.html')):
    r = p.relative_to(O)
    if only and str(r) not in only: continue
    q = D / r
    pairs.append((r, p, q))
bad = 0
for r, p, q in pairs:
    if not q.exists(): print(f'{r}: MISSING in dist'); bad += 1; continue
    a, b = soup(p), soup(q)
    problems = []
    ta, tb = text_of(a), text_of(b)
    if ta != tb: problems.append('TEXT'); 
    if ids(a) != ids(b): problems.append(f'IDS -{sorted(set(ids(a))-set(ids(b)))} +{sorted(set(ids(b))-set(ids(a)))}')
    ha, hb = hrefs(a), hrefs(b)
    if ha != hb: problems.append(f'HREFS -{dict(ha-hb)} +{dict(hb-ha)}')
    sa, sb = svgs(a), svgs(b)
    if sa != sb: problems.append(f'SVG {len(sa)} vs {len(sb)}' + ('' if len(sa)!=len(sb) else ' content differs at ' + str([i for i,(x,y) in enumerate(zip(sa,sb)) if x!=y])))
    ma, mb = metas(a), metas(b)
    if ma != mb: problems.append(f'META -{dict(ma-mb)} +{dict(mb-ma)}')
    ca, cb = classes(a), classes(b)
    cdiff = (ca - cb, cb - ca)
    sta, stb = styles(a), styles(b)
    sdiff = (sta - stb, stb - sta)
    hard = [x for x in problems]
    if hard: bad += 1
    status = 'OK' if not hard and not any(cdiff) and not any(sdiff) else ('DIFF' if hard else 'ok (soft)')
    print(f'{str(r):45s} {status}  words={len(ta.split())}')
    for pr in problems: print('   ', pr)
    if ta != tb: show_diff(ta, tb, 'text')
    if any(cdiff): print(f'    CLASSES -{dict(cdiff[0])} +{dict(cdiff[1])}')
    if any(sdiff): print(f'    STYLES -{dict(sdiff[0])} +{dict(sdiff[1])}')
print(f'\n{len(pairs)} pages compared, {bad} with hard differences')
sys.exit(1 if bad else 0)
