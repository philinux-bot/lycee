import fs from 'node:fs';
import assert from 'node:assert/strict';
const source = process.argv[2];
if (!source) throw new Error('Passer le chemin de l’export JSON national sélectionné.');
const raw = JSON.parse(fs.readFileSync(source,'utf8'));
assert(Array.isArray(raw));
assert(raw.every(r=>r.session==='2025'));
assert.equal(new Set(raw.map(r=>r.cod_aff_form)).size,raw.length);
const records=raw.map(r=>({
  id:String(r.cod_aff_form), school:r.g_ea_lib_vx,city:r.ville_etab,academy:r.acad_mies,department:r.dep_lib,
  status:r.contrat_etab,family:r.fili,title:r.lib_for_voe_ins || r.fil_lib_voe_acc,
  detail:r.detail_forma,selectivity:r.select_form,places:r.capa_fin,candidates:r.nb_voe_pp,
  proposals:r.prop_tot,accepted:r.acc_tot,newbac:r.acc_neobac,general:r.acc_bg,techno:r.acc_bt,
  pro:r.acc_bp,scholarship:r.pct_bours,women:r.pct_f,access:r.taux_acces_ens,url:r.lien_form_psup
})).sort((a,b)=>`${a.school} ${a.title}`.localeCompare(`${b.school} ${b.title}`,'fr'));
for(const r of records){
  assert(r.id && r.title && r.school);
  if(r.access!==null) assert(Number.isFinite(r.access)&&r.access>=0&&r.access<=100);
  if(r.url) assert(new URL(r.url).protocol==='https:');
}
const data={meta:{title:'Parcoursup 2025 · hors apprentissage',session:2025,downloaded:'2026-09-08',publishedUpdate:'2026-03-09',count:records.length,source:'https://data.enseignementsup-recherche.gouv.fr/explore/assets/fr-esr-parcoursup/',dataviz:'https://data.enseignementsup-recherche.gouv.fr/pages/parcoursupdata/',license:'Licence Ouverte 2.0',attribution:'Parcoursup — traitement SIES / Ministère chargé de l’enseignement supérieur',scope:'Formations hors apprentissage ; campagne 2025 ; données agrégées par formation et établissement d’accueil.'},records};
fs.writeFileSync(new URL('../dist/formations.json',import.meta.url),JSON.stringify(data));
console.log(JSON.stringify({records:records.length,nantes:records.filter(r=>r.academy==='Nantes').length,bytes:JSON.stringify(data).length,session:2025}));
