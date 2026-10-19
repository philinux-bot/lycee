import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseHTML} from 'linkedom';
import * as core from '../dist/core.mjs';
import * as content from '../dist/content.mjs';
import * as student from '../dist/student-content.mjs';
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const source=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
const catalogue=JSON.parse(fs.readFileSync(new URL('../dist/formations.json',import.meta.url)));
function harness(initial,options={}){
 const {window,document}=parseHTML(html);let routeHash='#accueil';const downloads=[],pdfs=[],messages=[],storage=new Map(),timers=new Map(),created=[];let confirmValue=true,dataCalls=0;let timerId=0;
 const create=document.createElement.bind(document);document.createElement=(tag,...args)=>{const el=create(tag,...args);created.push(el);return el;};
 const location={get hash(){return routeHash;},set hash(v){routeHash=v.startsWith('#')?v:'#'+v;}};
 window.scrollTo=()=>{};window.print=()=>{};
 for(const el of document.querySelectorAll('*')){el.scrollIntoView=()=>{};el.focus=()=>{};}
 const proto=Object.getPrototypeOf(document.createElement('div'));
 proto.scrollIntoView=()=>{};
 const dlg=document.querySelector('dialog');dlg.showModal=()=>{dlg.open=true;};dlg.close=()=>{dlg.open=false;};
 const query=document.querySelector.bind(document);
 document.querySelector=(selector)=>selector==='[data-budget]:invalid'?Array.from(document.querySelectorAll('[data-budget]')).find(n=>n._invalid)||null:query(selector);
 const inputProto=Object.getPrototypeOf(document.createElement('input'));
 inputProto.setCustomValidity=function(msg){this._invalid=!!msg;};inputProto.reportValidity=function(){return !this._invalid;};
 const localStorage={getItem:k=>{if(options.storageFail)throw new Error('Storage blocked');return storage.get(k)||null;},setItem:(k,v)=>{if(options.storageFail)throw new Error('Storage blocked');storage.set(k,v);},removeItem:k=>storage.delete(k)};
 if(initial)storage.set('ambroise-pare:orientation:temporary-draft:v1',JSON.stringify({consent:true,project:initial}));
 class TestURL extends URL{static createObjectURL(blob){downloads.push(blob);return 'blob:test-'+downloads.length;}static revokeObjectURL(){}}
 class TestFormData{constructor(form){this.values=new Map(Array.from(form.querySelectorAll('[name]')).map(n=>[n.name,n.value]));}get(k){return this.values.get(k);}}
 const dependencies={...core,...content,...student,e:core.escapeHTML,num:core.formatNumber,pct:core.formatPct,exportPDF:async(h,f)=>{pdfs.push({html:h,filename:f});return 20000;}};
 const run=new Function(...Object.keys(dependencies),'document','window','location','localStorage','fetch','confirm','URL','Blob','FormData','setTimeout','clearTimeout','requestAnimationFrame',source+'\nreturn {snapshot:()=>JSON.parse(JSON.stringify(project)),setProject:p=>{project=cleanProject(p);specMode=project.level===\'terminale\'?\'pair\':\'trio\';render();},render:()=>render(),route:()=>route};');
 const api=run(...Object.values(dependencies),document,window,location,localStorage,async()=>{dataCalls++;if(options.failOnce&&dataCalls===1)throw new Error('Network unavailable');return {ok:true,json:async()=>structuredClone(catalogue)};},()=>confirmValue,TestURL,Blob,TestFormData,(f)=>{timers.set(++timerId,f);return timerId;},id=>timers.delete(id),fn=>fn());
 function click(selector){const el=query(selector);assert(el,'Missing control: '+selector);el.dispatchEvent(new window.Event('click',{bubbles:true}));return el;}
 function input(selector,value,type='input'){const el=query(selector);assert(el,'Missing input: '+selector);if(el.tagName==='SELECT'){for(const o of el.querySelectorAll('option')){if(o.value===value)o.setAttribute('selected','');else o.removeAttribute('selected');}}else el.value=value;el.dispatchEvent(new window.Event(type,{bubbles:true}));return el;}
 function change(selector,value){return input(selector,value,'change');}
 function navigate(route){location.hash=route;window.dispatchEvent(new window.Event('hashchange'));}
 function check(selector,value=true){const el=query(selector);assert(el,selector);el.checked=value;el.dispatchEvent(new window.Event('change',{bubbles:true}));el.dispatchEvent(new window.Event('input',{bubbles:true}));return el;}
 async function importFile(raw,size){click('[data-action="import"]');const el=created.filter(n=>n.type==='file').at(-1);assert(el);const value=typeof raw==='string'?raw:JSON.stringify(raw);el.files=[{size:size??Buffer.byteLength(value),text:async()=>value}];el.dispatchEvent(new window.Event('change',{bubbles:true}));await settle();}
 function flush(){for(const [id,fn]of [...timers]){timers.delete(id);fn();}}
 return {...api,window,document,location,storage,downloads,pdfs,messages,click,input,change,check,navigate,flush,importFile,setConfirm:v=>{confirmValue=v;}};
}
const action=(a,id)=>'[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'');
const settle=async()=>{for(let i=0;i<7;i++)await new Promise(r=>setImmediate(r));};
test('Les neuf écrans et tous les niveaux se rendent avec une propriété explicite',async()=>{
 const h=harness();
 for(const level of ['seconde','premiere','terminale']){
  h.navigate('niveau');h.click(action('level',level));
  for(const path of Object.keys(student.CURRENT_PATHS)){
   const p=h.snapshot();p.currentPath=path;h.setProject(p);
   for(const route of ['accueil','niveau','voies','domaines','specialites','formations','ressources','projet','aide']){
    h.navigate(route);await settle();assert(h.document.querySelector('#view h1'),level+' '+path+' '+route);assert(h.document.querySelector('#view').textContent.includes('Site propriété du Lycée Ambroise Paré'));assert(!h.document.querySelector('#view').textContent.includes('undefined'));
   }
  }
 }
});
test('Seconde : toutes les séries, voies et fiches de domaines sont accessibles',()=>{
 const h=harness();h.navigate('voies');
 for(const p of content.PATHWAYS){h.click(action('pathway',p.id));assert(h.snapshot().pathways.includes(p.id));}
 for(const s of content.TECH_SERIES){h.click(action('tech-detail',s.id));assert(h.document.querySelector('#dialog-content').textContent.includes(s.name));h.click(action('tech-save',s.id));assert.equal(h.snapshot().techSeries,s.id);h.document.querySelector('dialog').close();}
 h.navigate('domaines');for(const d of content.DOMAINS){h.click(action('domain',d.id));assert(h.document.querySelector('#dialog-content').textContent.includes(d.title));h.document.querySelector('dialog').close();h.click(action('domain-toggle',d.id));assert(h.snapshot().domainIds.includes(d.id));}
});
test('Première générale : limite du trio, trois paires, scénarios et restauration après changement de trio',()=>{
 const h=harness();h.navigate('niveau');h.click(action('level','premiere'));h.navigate('specialites');
 for(const id of ['maths','pc','svt'])h.click(action('specialty',id));
 assert.equal(h.document.querySelectorAll('.scenario-card').length,3);
 h.click(action('specialty','ses'));assert.equal(h.snapshot().trio.length,3);
 h.click(action('save-scenario'));const saved=h.snapshot().scenarios[0];assert.deepEqual(saved.trio,['maths','pc','svt']);
 h.click(action('save-scenario'));assert.equal(h.snapshot().scenarios.length,1);
 h.click(action('spec-clear'));h.navigate('projet');h.click(action('load-scenario'));assert.deepEqual(h.snapshot().trio,saved.trio);assert.deepEqual(h.snapshot().pair,saved.pair);
});
test('Terminale : saisie directe de deux spécialités, sans phrase d’abandon vide',()=>{
 const h=harness();h.navigate('niveau');h.click(action('level','terminale'));h.navigate('specialites');for(const id of ['maths','pc'])h.click(action('specialty',id));
 assert.deepEqual(h.snapshot().pair,['maths','pc']);const text=h.document.querySelector('.selection-summary').textContent;assert(!text.includes('arrêter'));assert(!text.includes(' et .'));
});
test('Offre locale par défaut ; cumul LLCER et Bachibac contrôlé',()=>{
 const h=harness();h.navigate('specialites');assert.equal(h.document.querySelectorAll('.specialty').length,10);assert(!h.document.querySelector(action('specialty','nsi')));
 h.click(action('specialty','amc'));h.click(action('specialty','llcer-anglais'));assert.deepEqual(h.snapshot().trio,['amc']);
 h.change('[data-specialty-scope]','national');assert(h.document.querySelector(action('specialty','nsi')));
 const p=h.snapshot();p.trio=[];p.options=['bachibac'];h.setProject(p);h.click(action('specialty','llcer-espagnol'));assert.equal(h.snapshot().trio.length,0);
});
test('STMG : les trois enseignements locaux et les hypothèses ne deviennent pas des trios généraux',()=>{
 const h=harness();h.navigate('niveau');h.click(action('level','premiere'));h.change('[data-current-path]','stmg');assert(h.document.querySelector('#view').textContent.includes('sciences de gestion et numérique'));h.navigate('specialites');assert.equal(h.document.querySelectorAll('.specialty').length,0);
 for(const v of student.STMG_SPECIFICS){h.click(action('stmg-specific',v.id));assert.equal(h.snapshot().stmgSpecific,v.id);h.click(action('save-track-scenario'));}
 assert.equal(h.snapshot().scenarios.length,3);h.navigate('projet');h.click(action('load-scenario'));assert.equal(h.snapshot().currentPath,'stmg');assert.equal(h.snapshot().stmgSpecific,'gf');assert.equal(h.snapshot().pair.length,0);
});
test('Catalogue : recherche, états vides, comparaison plafonnée et notes conservées',async()=>{
 const h=harness();h.navigate('formations');await settle();assert.equal(h.document.querySelectorAll('.formation').length,18);
 const ids=Array.from(h.document.querySelectorAll('[data-compare]')).slice(0,4).map(n=>n.dataset.compare);
 for(const id of ids)h.check('[data-compare="'+id+'"]');assert(h.document.querySelector('#compare-bar').textContent.includes('3 / 3'));
 h.click(action('compare-open'));assert.equal(h.document.querySelectorAll('#dialog-content thead th').length,4);h.document.querySelector('dialog').close();
 h.click(action('save-formation',ids[0]));assert.equal(h.snapshot().choices.length,1);
 h.input('[data-filter="q"]','xzyyxzyinexistant');h.flush();assert(h.document.querySelector('#formation-results').textContent.includes('Aucune fiche'));
 h.click(action('reset-filters'));await settle();assert.equal(h.document.querySelectorAll('.formation').length,18);
 h.navigate('projet');h.input('[data-choice="0"][data-key="reason"]','Ce qui me plaît : la formation.');h.click(action('project-export'));assert.equal(h.downloads.length,1);
});
test('Carnet : texte, budget invalide, tâches, consentement et effacement',()=>{
 const h=harness();h.navigate('projet');h.input('[data-field="interests"]','Lire, créer & comprendre');h.input('[data-budget="rent"]','-1');h.click(action('project-export'));assert.equal(h.downloads.length,0);
 h.input('[data-budget="rent"]','450');h.input('[data-budget="food"]','200');assert(h.document.querySelector('#budget-output').textContent.includes('650'));
 h.click(action('add-task'));h.input('[data-task="0"][data-key="text"]','Poser une question');h.check('[data-task="0"][data-key="done"]');assert(h.snapshot().tasks[0].done);
 h.check('#draft-consent');h.flush();assert(h.storage.size);h.check('#draft-consent',false);assert.equal(h.storage.size,0);assert(h.snapshot().interests);
 h.click(action('clear-project'));assert.equal(h.snapshot().interests,'');assert.equal(h.snapshot().tasks.length,0);
});
test('Ressources, huit fiches pratiques et aperçu PDF',async()=>{
 const h=harness();h.navigate('ressources');for(const g of content.GUIDES){h.click(action('guide',g.id));h.click(action('print-guide',g.id));await settle();assert.equal(h.pdfs.at(-1).filename,'Fiche_pratique_Ambroise_Pare.pdf');assert(h.pdfs.at(-1).html.includes(g.title));h.document.querySelector('dialog').close();}
 h.navigate('projet');h.input('[data-field="name"]','Élève');h.click(action('project-preview'));assert(h.document.querySelector('#dialog-content').textContent.includes('Élève'));h.click(action('project-print'));await settle();assert.equal(h.pdfs.at(-1).filename,'Mon_projet_Ambroise_Pare.pdf');
});
test('Les filtres de chaque famille et chaque statut répondent sans erreur',async()=>{
 const h=harness();h.navigate('formations');await settle();
 for(const [family]of Object.entries(content.FAMILY_LABELS)){h.change('[data-filter="family"]',family);h.flush();assert(h.document.querySelector('#formation-results'));}
 for(const status of new Set(catalogue.records.map(r=>r.status))){h.change('[data-filter="status"]',status);h.flush();assert(h.document.querySelector('#formation-results'));}
});
test('Les démarches de première STMG et générale sont indépendantes',()=>{
 const h=harness();h.navigate('niveau');h.click(action('level','premiere'));h.check('[data-check="premiere-generale-0"]');h.change('[data-current-path]','stmg');assert(!h.document.querySelector('[data-check="premiere-stmg-0"]').checked);h.check('[data-check="premiere-stmg-1"]');h.change('[data-current-path]','generale');assert(h.snapshot().checks['premiere-generale-0']);assert(h.snapshot().checks['premiere-stmg-1']);
});
test('Import réel : aller-retour du fichier, ancien format, fichier invalide et remplacement annulé',async()=>{
 const h=harness();h.navigate('projet');h.input('[data-field="interests"]','Réfléchir & créer');h.click(action('project-export'));const saved=JSON.parse(await h.downloads[0].text());assert.equal(saved.interests,'Réfléchir & créer');
 h.input('[data-field="interests"]','Un nouveau texte');await h.importFile(saved);assert.equal(h.snapshot().interests,'Réfléchir & créer');
 await h.importFile('{JSON incorrect');assert.equal(h.snapshot().interests,saved.interests);
 await h.importFile({...saved,schemaVersion:99});assert.equal(h.snapshot().interests,saved.interests);
 await h.importFile(saved,2*1024*1024+1);assert.equal(h.snapshot().interests,saved.interests);
 h.setConfirm(false);await h.importFile({...saved,interests:'À refuser'});assert.equal(h.snapshot().interests,saved.interests);
 h.setConfirm(true);await h.importFile({...saved,schemaVersion:1,interests:'Ancien carnet repris'});assert.equal(h.snapshot().schemaVersion,2);assert.equal(h.snapshot().interests,'Ancien carnet repris');
});
test('Piste personnelle : liens sûrs, ajout et limites du carnet',()=>{
 const h=harness();h.navigate('projet');h.click(action('manual-choice'));h.input('[name="title"]','BTS à découvrir');h.input('[name="url"]','javascript:alert(1)');h.document.querySelector('#manual-choice-form').dispatchEvent(new h.window.Event('submit',{bubbles:true,cancelable:true}));assert.equal(h.snapshot().choices.length,0);assert(h.document.querySelector('#manual-error').textContent);
 h.input('[name="url"]','https://www.parcoursup.gouv.fr/');h.input('[name="school"]','Lycée Ambroise Paré');h.document.querySelector('#manual-choice-form').dispatchEvent(new h.window.Event('submit',{bubbles:true,cancelable:true}));assert.equal(h.snapshot().choices.length,1);assert.equal(h.snapshot().choices[0].school,'Lycée Ambroise Paré');
 h.click(action('remove-choice'));assert.equal(h.snapshot().choices.length,0);
 const p=h.snapshot();p.choices=Array.from({length:40},(_,i)=>({id:'m'+i,title:'Piste '+i}));h.setProject(p);h.click(action('manual-choice'));h.input('[name="title"]','Une piste en trop');h.document.querySelector('#manual-choice-form').dispatchEvent(new h.window.Event('submit',{bubbles:true,cancelable:true}));assert.equal(h.snapshot().choices.length,40);
});
test('Échec de chargement du catalogue : message lisible, nouvelle tentative et navigation préservée',async()=>{
 const h=harness(undefined,{failOnce:true});h.navigate('formations');await settle();assert(h.document.querySelector('#formation-interface').textContent.includes('n’a pas pu être chargé'));h.click(action('retry-data'));await settle();assert.equal(h.document.querySelectorAll('.formation').length,18);
 const before=h.document.querySelector('.formation h3').textContent;h.click(action('page-next'));const after=h.document.querySelector('.formation h3').textContent;assert.notEqual(before,after);h.click(action('page-prev'));assert.equal(h.document.querySelector('.formation h3').textContent,before);
});
test('Stockage indisponible et conflit entre onglets : les notes restent dans la page',()=>{
 const h=harness(undefined,{storageFail:true});h.navigate('projet');h.input('[data-field="interests"]','Une note à conserver');h.check('#draft-consent');h.flush();assert(h.document.querySelector('#save-state').classList.contains('error'));assert.equal(h.snapshot().interests,'Une note à conserver');h.click(action('project-export'));assert.equal(h.downloads.length,1);
 const h2=harness();h2.navigate('projet');h2.input('[data-field="interests"]','Mon texte actuel');h2.check('#draft-consent');const event=new h2.window.Event('storage');event.key='ambroise-pare:orientation:temporary-draft:v1';h2.window.dispatchEvent(event);assert(h2.document.querySelector('#save-state').textContent.includes('autre onglet'));assert.equal(h2.snapshot().interests,'Mon texte actuel');
});
test('Dès la seconde, comparer une hypothèse STMG puis revenir aux spécialités générales',()=>{
 const h=harness();h.navigate('specialites');h.click(action('compare-path','stmg'));assert.equal(h.document.querySelectorAll('.specialty').length,0);h.click(action('stmg-specific','mercatique'));assert.equal(h.snapshot().stmgSpecific,'mercatique');assert.equal(h.snapshot().level,'seconde');h.click(action('compare-path','generale'));assert.equal(h.document.querySelectorAll('.specialty').length,10);assert.equal(h.snapshot().stmgSpecific,'mercatique');
});
