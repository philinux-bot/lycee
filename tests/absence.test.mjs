import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

// Unit tests use a small form double, not a browser. Browser QA is separate.
const sitesRoot = new URL('../public/application_absences/', import.meta.url);
const root = existsSync(new URL('app.js', sitesRoot)) ? sitesRoot : new URL('../', import.meta.url);
const source = readFileSync(new URL('app.js', root), 'utf8');
const html = readFileSync(new URL('index.html', root), 'utf8');
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));
function fixture(overrides = {}, courses = [], recoveries = []) {
  const defaults = { nom:'TEST', prenom:'Audit', personnel_type:'autre', fonction:'Test', employeur:'État', telephone:'', motif:'mariage', periode_type:'journee', date_debut:'2027-01-11', date_fin:'2027-01-11', heure_debut:'07:30', heure_fin:'17:30', duree:'', certifie:true, organisation:'', justificatifs:'', convenance_type:'', motif_personnel:'', enfant_nom:'', enfant_naissance:'', charge_seul:false, enfant_handicap:false, ...overrides };
  for(const id of ['reserve_statut','reserve_annee','reserve_demandes','reserve_accordes','reserve_jours'])if(!(id in defaults))defaults[id]='';
  const elements = new Map();
  const element = (value='') => ({value:typeof value==='boolean'?'':value,type:typeof value==='boolean'?'checkbox':'text',checked:value===true,textContent:'',classList:{remove(){},toggle(){}},focus(){},setAttribute(){},removeAttribute(){},querySelector(){return {textContent:''};}});
  for(const [id,value] of Object.entries(defaults))elements.set(id,{...element(value),id});
  const $ = id => {if(!elements.has(id))elements.set(id,element());return elements.get(id);};
  const rows = (data,prefix) => data.map(row=>({querySelector(selector){return element(row[selector.replace(`.${prefix}-`,'')]||'');}}));
  const form = {
    reportValidity(){return ['nom','prenom','fonction','employeur','motif','date_debut','date_fin'].every(id=>$(id).value)&&$('certifie').checked;},
    querySelectorAll(selector){return selector.startsWith('[aria-')?[]:[...Object.keys(defaults)].map($);}
  };
  const document = {createElement(){return {};},querySelectorAll(selector){return selector==='.course-row'?rows(courses,'course'):selector==='.recovery-row'?rows(recoveries,'recup'):[];}};
  const ctx=vm.createContext({$,form,document,updateSummary(){},Intl,Date,Blob,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,setTimeout,clearTimeout});
  vm.runInContext(section('const rules','const $='),ctx);
  vm.runInContext(section('const leaveMotifs','const summaryPanel'),ctx);
  vm.runInContext(section('function fail','form.addEventListener("submit"'),ctx);
  vm.runInContext(section('const esc=','document.querySelectorAll(".panel-button")'),ctx);
  vm.runInContext(section('function workingDays','function addRecoveryRow'),ctx);
  vm.runInContext(section('function values()','function recoveryRows'),ctx);
  vm.runInContext(section('function recoveryRows','function preparePreview'),ctx);
  return {ctx,$};
}
const course={niveau:'Première',classe:'TEST',date:'2027-01-11',activite:'TEST',debut:'08:00',fin:'09:00',duree:'1 h 00'};
test('normal weekdays and weekend exclusion',()=>{
  const {ctx,$}=fixture();assert.equal(ctx.validate(),true);assert.match($('duree').value,/1 journée/);
  assert.equal(ctx.workingDays('2027-01-08','2027-01-11'),2);
  assert.equal(ctx.workingDays('2027-01-09','2027-01-10'),0);
});
test('working-day arithmetic agrees with daily counting',()=>{
  const {ctx}=fixture();
  for(let offset=0;offset<7;offset++)for(let length=1;length<35;length++){
    const start=new Date(Date.UTC(2027,0,1+offset)),end=new Date(Date.UTC(2027,0,offset+length));let count=0;
    for(let d=new Date(start);d<=end;d.setUTCDate(d.getUTCDate()+1))if(![0,6].includes(d.getUTCDay()))count++;
    assert.equal(ctx.workingDays(start.toISOString().slice(0,10),end.toISOString().slice(0,10)),count);
  }
});
test('date order and weekends remain guarded; 2026 and cross-year requests are accepted',()=>{
  for(const overrides of [{date_fin:'2027-01-10'},{date_debut:'2027-01-09',date_fin:'2027-01-10'}])assert.equal(fixture(overrides).ctx.validate(),false);
  for(const motif of ['mariage','pacs'])for(const dates of [['2026-09-08','2026-09-08'],['2026-12-31','2027-01-04']])assert.equal(fixture({motif,date_debut:dates[0],date_fin:dates[1]}).ctx.validate(),true);
  assert.equal(fixture({date_debut:'2027-01-01',date_fin:'2027-01-01'}).ctx.validate(),true);
});
test('missing, reversed, and zero free hours are rejected',()=>{
  for(const [heure_debut,heure_fin] of [['',''],['09:00',''],['17:00','09:00'],['09:00','09:00']]){
    const {ctx,$}=fixture({periode_type:'libre',heure_debut,heure_fin});
    assert.equal(ctx.validate(),false);assert.equal($('duree').value,'');
  }
  const {ctx,$}=fixture({periode_type:'libre',heure_debut:'08:30',heure_fin:'10:00'});
  assert.equal(ctx.validate(),true);assert.match($('duree').value,/1 h 30 par jour/);
});
test('whitespace identity and unchecked declaration are rejected',()=>{
  assert.equal(fixture({nom:'   '}).ctx.validate(),false);
  assert.equal(fixture({certifie:false}).ctx.validate(),false);
});
test('hidden recovery cannot block or leak into exports',()=>{
  const {ctx}=fixture({},[],[{date:'2027-01-12'}]);
  assert.equal(ctx.validate(),true);assert.equal(ctx.values().recoveries.length,0);
});
test('hidden personal and child fields are omitted',()=>{
  const {ctx}=fixture({convenance_type:'Autre',motif_personnel:'OLD SECRET',enfant_nom:'OLD CHILD'});
  const value=ctx.values();assert.equal(value.motif_personnel,'');assert.equal(value.enfant_nom,'');
  assert.doesNotMatch(ctx.paperHtml(value),/OLD SECRET|OLD CHILD/);
});
test('latest Sites course exemption is preserved',()=>{
  const {ctx}=fixture({personnel_type:'enseignant'},[{classe:'unfinished'}]);
  assert.equal(ctx.validate(),true);assert.equal(ctx.values().courses.length,0);
});
test('courses must be complete and within absence dates and hours',()=>{
  const overrides={personnel_type:'enseignant',motif:'convenance',convenance_type:'Autre'};
  assert.equal(fixture(overrides,[course]).ctx.validate(),true);
  for(const row of [{...course,date:'2027-02-10'},{...course,fin:'07:00'},{...course,classe:''},{...course,debut:'06:30'}])assert.equal(fixture(overrides,[row]).ctx.validate(),false);
  assert.equal(fixture(overrides,[]).ctx.validate(),false);
});
test('visible recovery is optional but must be complete if started',()=>{
  assert.equal(fixture({motif:'pma'},[],[]).ctx.validate(),true);
  assert.equal(fixture({motif:'pma'},[],[{date:'2027-01-12'}]).ctx.validate(),false);
  assert.equal(fixture({motif:'pma'},[],[{date:'2027-01-12',debut:'08:00',fin:'09:00',duree:'1 h 00',modalites:'TEST'}]).ctx.validate(),true);
});
test('preview escapes user text',()=>{
  const {ctx}=fixture({nom:'<script>alert(1)</script>'});ctx.validate();
  const preview=ctx.paperHtml(ctx.values());assert.doesNotMatch(preview,/<script>/);assert.match(preview,/&lt;script&gt;/);
});
test('Word packing succeeds for simple, teacher, and 20-course requests',async()=>{
  for(const count of [0,1,20]){
    const {ctx}=fixture(count?{personnel_type:'enseignant',motif:'convenance',convenance_type:'Autre'}:{},Array.from({length:count},()=>({...course})));
    vm.runInContext(readFileSync(new URL('vendor/docx.iife.js',root),'utf8'),ctx);
    vm.runInContext(section('function textCell','async function downloadWord'),ctx);
    const result=await ctx.buildWordFile();assert.ok(result.blob.size>1000);
    assert.deepEqual([...new Uint8Array(await result.blob.arrayBuffer()).slice(0,4)],[80,75,3,4]);
  }
});
test('entrypoint assets exist and form IDs are unique',()=>{
  for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g))assert.ok(existsSync(new URL(match[1],root)),match[1]);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  assert.match(html,/width=device-width/);assert.match(html,/responsive\.css/);
});
const reserveCase={motif:'reserve_police',reserve_statut:'Fonctionnaire',reserve_demandes:'12',reserve_accordes:'10',reserve_jours:'1'};
test('reserve declares calendar year, previous requests and approvals without recovery',()=>{
  const {ctx}=fixture(reserveCase);assert.equal(ctx.validate(),true);
  const data=ctx.values();assert.equal(data.reserve_annee,'2027');
  const paper=ctx.paperHtml(data);assert.match(paper,/Jours déjà demandés/);assert.match(paper,/10/);assert.doesNotMatch(paper,/Proposition de récupération/);
  assert.equal(fixture({...reserveCase,date_debut:'2026-12-31',date_fin:'2027-01-04'}).ctx.validate(),false);
  for(const change of [{reserve_accordes:'13'},{reserve_demandes:'-1'},{reserve_jours:'0'},{reserve_jours:'2'},{reserve_demandes:''},{reserve_statut:''}])assert.equal(fixture({...reserveCase,...change}).ctx.validate(),false);
  const hidden=fixture({...reserveCase,motif:'mariage'});assert.equal(hidden.ctx.values().reserve_demandes,'');
});
test('teacher reserve requires affected courses and produces a Word document',async()=>{
  assert.equal(fixture({...reserveCase,personnel_type:'enseignant'}).ctx.validate(),false);
  const {ctx}=fixture({...reserveCase,personnel_type:'enseignant'},[course]);assert.equal(ctx.validate(),true);
  vm.runInContext(readFileSync(new URL('vendor/docx.iife.js',root),'utf8'),ctx);
  vm.runInContext(section('function textCell','async function downloadWord'),ctx);
  const result=await ctx.buildWordFile();assert.ok(result.blob.size>1000);
});
