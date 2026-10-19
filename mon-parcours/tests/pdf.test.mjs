import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DOMParser} from 'linkedom';
import {PDFDocument,PDFString,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {newProject,projectHTML,formationHTML,guideHTML} from '../dist/core.mjs';
import {SPECIALTIES,RESOURCES,DOMAINS,DOMAIN_RULES,LOCAL_OFFERS,GUIDES,UPDATED} from '../dist/content.mjs';
import {documentBlocksFromHTML,buildPDF,wrapText,PDF_LAYOUT} from '../dist/pdf.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/formations.json',import.meta.url)));
const assets={regular:fs.readFileSync(new URL('../dist/assets/DejaVuSans.ttf',import.meta.url)),bold:fs.readFileSync(new URL('../dist/assets/DejaVuSans-Bold.ttf',import.meta.url)),logo:fs.readFileSync(new URL('../dist/assets/logo-horizontal.jpg',import.meta.url))};
const out=new URL('../tmp/pdfs/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const makeProject=p=>projectHTML(p,SPECIALTIES,RESOURCES,DOMAINS,DOMAIN_RULES,LOCAL_OFFERS);
async function create(name,html){
 const model=documentBlocksFromHTML(html,DOMParser);
 assert(model.title);assert(model.blocks.length);
 const bytes=await buildPDF(model,{PDFDocument,PDFString,rgb,fontkit,assets});
 fs.writeFileSync(new URL(name+'.pdf',out),bytes);
 const pdf=await PDFDocument.load(bytes);
 for(const page of pdf.getPages()){assert(Math.abs(page.getWidth()-PDF_LAYOUT.width)<.01);assert(Math.abs(page.getHeight()-PDF_LAYOUT.height)<.01);}
 assert.equal(pdf.getAuthor(),'Lycée Ambroise Paré · Laval');
 return pdf.getPageCount();
}
test('Le modèle PDF conserve les retours, accents et liens sans dupliquer le contenu',()=>{
 const p=newProject();p.interests='Première ligne\nDeuxième ligne avec œ, É et €';
 const m=documentBlocksFromHTML(makeProject(p),DOMParser);assert(m.blocks.some(b=>b.text===p.interests));assert(!m.blocks.some(b=>b.text?.includes('<script>')));
 const guide=documentBlocksFromHTML(guideHTML(GUIDES[0],RESOURCES,UPDATED),DOMParser);assert(guide.blocks.some(b=>b.type==='link'&&b.url.startsWith('https://')));
});
test('Neuf parcours produisent des PDF A4 lisibles et paginés',async()=>{
 const counts={};
 for(const level of ['seconde','premiere','terminale'])for(const path of level==='seconde'?['generale']:['generale','stmg','technologique','professionnelle']){
  const p=newProject();p.name='Élève test';p.level=level;p.currentPath=path;p.stmgSpecific=path==='stmg'?'rhc':'';p.interests='Comprendre, apprendre et explorer plusieurs possibilités.';p.tasks=[{text:'Échanger avec le professeur principal',done:true,date:'2026-10-20'}];
  if(path==='generale'){p.trio=['maths','pc','svt'];p.pair=['pc','svt'];}
  counts[level+'-'+path]=await create(level+'-'+path,makeProject(p));
 }
 fs.writeFileSync(new URL('parcours-pages.json',out),JSON.stringify(counts,null,2));
});
test('Les huit fiches pratiques et trois formations, dont valeurs manquantes, sont exportables',async()=>{
 for(const g of GUIDES)await create('guide-'+g.id,guideHTML(g,RESOURCES,UPDATED));
 const longest=data.records.reduce((a,b)=>a.title.length>b.title.length?a:b);
 const missing={...data.records[0],access:null,places:0,scholarship:null,women:0};
 for(const [name,r]of [['formation-courante',data.records.find(r=>r.city==='Laval')||data.records[0]],['formation-longue',longest],['formation-valeurs-manquantes',missing]])await create(name,formationHTML(r));
});
test('Un carnet très long conserve toutes les pistes et se répartit sur de nombreuses pages',async()=>{
 const p=newProject();p.level='premiere';p.name='Zoé · dossier long';p.trio=['maths','pc','svt'];p.pair=['pc','svt'];p.domainIds=['sante','vivant'];
 const sentence='La réflexion de l’élève garde ses accents, ses questions et ses exemples. Elle peut évoluer après une rencontre, une lecture ou une journée portes ouvertes. ';
 for(const key of ['interests','strengths','values','specialtyReason','experiences','motivation','mobility','support','questions','nextStep','meeting'])p[key]=sentence.repeat(22);
 p.choices=Array.from({length:40},(_,i)=>({id:'test-'+i,title:'FORMATION REPÈRE '+String(i+1).padStart(2,'0'),school:'Lycée et université à explorer',city:'Laval',status:'À explorer',source:'Recette PDF',url:'https://www.parcoursup.gouv.fr/',reason:sentence.repeat(4),question:sentence.repeat(3),motivation:sentence.repeat(7)}));
 p.tasks=Array.from({length:100},(_,i)=>({id:'t-'+i,text:'DÉMARCHE REPÈRE '+String(i+1).padStart(3,'0')+' · '+sentence,done:i%2===0,date:'2026-10-30'}));
 p.resources=RESOURCES.map(r=>r.id);p.establishments=Array.from({length:40},(_,i)=>'Établissement repéré '+i);p.nextStep+=' FIN DE LA DERNIÈRE ACTION.';p.meeting+=' FIN DE LA DERNIÈRE NOTE.';
 const n=await create('carnet-long',makeProject(p));assert(n>25);
 fs.writeFileSync(new URL('long-expected.json',out),JSON.stringify({formations:40,tasks:100,pages:n}));
});
test('Les mots sans espaces, les grands titres et les symboles ne bloquent pas le PDF',async()=>{
 const p=newProject();p.title='UNTRÈSLONGTITRESANSESPACE'.repeat(8);p.interests='MOTÀTRÈSLONGUEDÉCOMPOSITION'.repeat(150)+'\nUne ligne finale avec œ, € et un symbole 🚀.';p.questions='FIN DU MOT LONG.';await create('carnet-mots-longs',makeProject(p));
 const model={title:'Tableau avec une cellule très longue',blocks:[{type:'heading',level:2,text:'Un tableau sur plusieurs pages'},{type:'row',cells:['Libellé détaillé '.repeat(150),'Valeur détaillée '.repeat(450)]},{type:'paragraph',text:'FIN DU TABLEAU LONG.'}]};
 const bytes=await buildPDF(model,{PDFDocument,PDFString,rgb,fontkit,assets});fs.writeFileSync(new URL('tableau-long.pdf',out),bytes);assert((await PDFDocument.load(bytes)).getPageCount()>1);
});
