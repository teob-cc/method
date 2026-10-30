#!/bin/sh
# The hand edits applied after html2md.py: structure the converter cannot know. Re-run after re-converting.
set -e
cd "$(dirname "$0")/../.."
python3 - <<'PY'
import pathlib
p=pathlib.Path('spec/spec.yaml'); s=p.read_text()
s=s.replace('kind: "spec"\n','kind: "spec"\nversion: "V4.13"\ndate: "2026-10"\n')
s=s.replace('licence_line: ','licence_line_style: "margin-top:18px;font-family:var(--mono);font-size:11px;color:var(--ink2);line-height:1.9"\nlicence_line: ')
s=s.replace('sections: [01-claim','tail: [11-ten-lines]\nsections: [01-claim'); p.write_text(s)
p=pathlib.Path('foreword/foreword.md'); s=p.read_text(); p.write_text(s.replace('kind: "companion"\n','kind: "companion"\ncss: "foreword"\n',1))
for f,short in [('04-the-invariant','The invariant'),('05-the-acknowledgement','The acknowledgement'),('06-the-projection','The projection'),('07-the-client-classes','The client classes'),('08-the-channel','The channel')]:
    p=pathlib.Path(f'derivations/{f}.md'); s=p.read_text(); p.write_text(s.replace('\nnumber: ', f'\nshort: "{short}"\nnumber: ',1))
PY
