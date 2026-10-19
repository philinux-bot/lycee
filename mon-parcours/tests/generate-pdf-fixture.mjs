import fs from 'node:fs';
import {newProject,projectHTML,formationHTML} from '../dist/core.mjs';
import {SPECIALTIES,RESOURCES,DOMAINS,DOMAIN_RULES,LOCAL_OFFERS} from '../dist/content.mjs';

const data=JSON.parse(fs.readFileSync(new URL('../dist/formations.json',import.meta.url)));
const css=fs.readFileSync(new URL('../dist/style.css',import.meta.url),'utf8');
const p=newProject();
const long='Cette note volontairement longue vérifie les accents français, les retours à la ligne et l’absence de texte tronqué. Elle décrit une réflexion personnelle qui peut évoluer après une rencontre, une lecture ou une journée portes ouvertes. ';
p.name='Élève test';
p.level='premiere';
p.trio=['maths','pc','svt'];
p.pair=['pc','svt'];
p.domainIds=['sante','vivant','humain'];
p.pathways=['generale','technologique'];
p.options=['math-comp'];
p.interests=long.repeat(18);
p.strengths=long.repeat(9);
p.values=long.repeat(8);
p.specialtyReason=long.repeat(14);
p.reorientation=long.repeat(6);
p.target='Santé, sciences du vivant et BUT Génie biologique';
p.scenarios=[
  {id:'a',title:'Scénario A · Santé',domainIds:['sante'],pair:['pc','svt'],techSeries:'',pathway:'generale',notes:long.repeat(4)},
  {id:'b',title:'Scénario B · Sciences du vivant',domainIds:['vivant'],pair:['maths','svt'],techSeries:'',pathway:'generale',notes:long.repeat(4)},
  {id:'c',title:'Scénario C · BUT Génie biologique',domainIds:['vivant'],pair:['maths','pc'],techSeries:'',pathway:'generale',notes:long.repeat(4)}
];
p.choices=Array.from({length:24},(_,i)=>({id:'f-'+i,title:`Formation favorite ${i+1} avec un intitulé volontairement très long pour éprouver les retours à la ligne`,school:`Établissement ${i+1}`,city:'Laval',url:'https://www.parcoursup.gouv.fr/',source:'Historique Parcoursup 2025',reason:long.repeat(3),question:long.repeat(2),motivation:long.repeat(4),status:i%2?'À explorer':'À approfondir'}));
p.establishments=Array.from({length:18},(_,i)=>`Établissement repéré ${i+1} · ville à vérifier`);
p.experiences=long.repeat(12);
p.motivation=long.repeat(15);
p.mobility=long.repeat(7);
p.support=long.repeat(7);
p.questions=long.repeat(10);
p.nextStep=long.repeat(5);
p.meeting=long.repeat(9);
p.tasks=Array.from({length:28},(_,i)=>({id:'t-'+i,text:`Action ${i+1} · ${long.repeat(2)}`,date:i%3===0?'2026-10-15':'',done:i%2===0}));
p.resources=RESOURCES.slice(0,18).map(r=>r.id);
const formation=data.records.sort((a,b)=>b.title.length-a.title.length)[0];
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css}</style></head><body><div id="print-root">${projectHTML(p,SPECIALTIES,RESOURCES,DOMAINS,DOMAIN_RULES,LOCAL_OFFERS)}<div style="break-before:page"></div>${formationHTML(formation)}</div></body></html>`;
fs.mkdirSync(new URL('../tmp/pdfs/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../tmp/pdfs/long-project.html',import.meta.url),html);
console.log(JSON.stringify({characters:html.length,formations:p.choices.length,tasks:p.tasks.length,title:formation.title}));
