from pathlib import Path
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import zipfile, hashlib, json, io, xml.etree.ElementTree as ET
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
out = root / 'private' / 'research'
out.mkdir(parents=True, exist_ok=True)
entries, known = [], {}
with zipfile.ZipFile(root / 'ACCENTURE-20261028T172758Z-1-001.zip') as archive:
    for item in archive.infolist():
        if item.is_dir(): continue
        data = archive.read(item)
        digest = hashlib.sha256(data).hexdigest()
        record = {'name': item.filename, 'bytes': len(data), 'sha256': digest}
        if digest in known:
            record['duplicateOf'] = known[digest]
        else:
            known[digest] = item.filename
            text, pages = '', 0
            try:
                if item.filename.lower().endswith('.pdf'):
                    pdf = PdfReader(io.BytesIO(data))
                    pages = len(pdf.pages)
                    text = '\n\n'.join(f'[Page {i+1}]\n{p.extract_text() or ""}' for i,p in enumerate(pdf.pages))
                elif item.filename.lower().endswith('.docx'):
                    with zipfile.ZipFile(io.BytesIO(data)) as doc:
                        tree = ET.fromstring(doc.read('word/document.xml'))
                        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                        text = '\n'.join(''.join(p.itertext()) for p in tree.findall('.//w:p', ns))
                record.update({'pages': pages, 'characters': len(text), 'textFile': digest[:12]+'.txt', 'needsVisualReview': len(text.strip()) < 80})
                (out / record['textFile']).write_text(text, encoding='utf-8')
            except Exception as exc:
                record['error'] = str(exc)
        entries.append(record)
(out / 'manifest.json').write_text(json.dumps(entries, indent=2), encoding='utf-8')
print(json.dumps({'files': len(entries), 'unique': len(known), 'pages': sum(e.get('pages',0) for e in entries), 'unreadable': [e['name'] for e in entries if e.get('error') or e.get('needsVisualReview')]}))
for e in entries:
    if 'textFile' in e:
        text = (out/e['textFile']).read_text(encoding='utf-8')
        print(e['textFile'], e['name'], 'PAGES', e['pages'], 'CHARS', e['characters'], 'EXCERPT', text[:700].replace('\n',' '))
