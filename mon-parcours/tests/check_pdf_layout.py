from pathlib import Path
import re,json
import pdfplumber
from pypdf import PdfReader
M=18*72/25.4
files=sorted(p for p in Path('tmp/pdfs').glob('*.pdf') if p.name!='long-project.pdf')
errors=[];results=[]
for path in files:
    with pdfplumber.open(path) as pdf:
        text='\n'.join(page.extract_text() or '' for page in pdf.pages)
        for number,page in enumerate(pdf.pages,1):
            if abs(page.width-210*72/25.4)>.03 or abs(page.height-297*72/25.4)>.03:
                errors.append((path.name,number,'format A4'))
            for c in page.chars:
                if c['text'].isspace(): continue
                if c['x0']<M-.25 or c['x1']>page.width-M+.25 or c['top']<M-.25 or c['bottom']>page.height-M+.25:
                    errors.append((path.name,number,'marge',c['text'],round(c['x0'],2),round(c['x1'],2),round(c['top'],2),round(c['bottom'],2)))
                    break
            if 'Propriété du Lycée Ambroise Paré' not in (page.extract_text() or ''):
                errors.append((path.name,number,'pied de page absent'))
        if path.stem=='carnet-long':
            for i in range(1,41):
                if f'FORMATION REPÈRE {i:02}' not in text:errors.append((path.name,'formation absente',i))
            for i in range(1,101):
                if f'DÉMARCHE REPÈRE {i:03}' not in text:errors.append((path.name,'démarche absente',i))
            for marker in ['FIN DE LA DERNIÈRE ACTION.','FIN DE LA DERNIÈRE NOTE.']:
                if marker not in text:errors.append((path.name,'texte absent',marker))
        if path.stem=='carnet-mots-longs' and 'FIN DU MOT LONG.' not in text:errors.append((path.name,'fin de texte absente'))
        if path.stem=='tableau-long' and 'FIN DU TABLEAU LONG.' not in text:errors.append((path.name,'fin de tableau absente'))
        results.append({'file':path.name,'pages':len(pdf.pages),'characters':len(text)})
    reader=PdfReader(path)
    for page in reader.pages:
        for ref in page.get('/Annots',[]):
            uri=ref.get_object().get('/A',{}).get('/URI')
            if uri and not str(uri).startswith('https://'):errors.append((path.name,'lien invalide',str(uri)))
Path('tmp/pdfs/layout-report.json').write_text(json.dumps({'files':results,'errors':errors},ensure_ascii=False,indent=2))
print(json.dumps({'pdfs':len(files),'pages':sum(x['pages'] for x in results),'errors':errors,'samples':results[:5]},ensure_ascii=False))
if errors:raise SystemExit(1)
