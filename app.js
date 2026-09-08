const rules = {
  reserve_police:{label:"Réserve opérationnelle de la Police nationale",type:"Congé pour activité dans la réserve — accord de l’employeur à vérifier",detail:"Fonctionnaire : jusqu’à 45 jours de congé avec traitement par année civile (CGFP, art. L. 644-1). Ce plafond ne vaut pas autorisation automatique d’absence. Statut, convocation, cumul annuel et accord de l’employeur doivent être vérifiés par le service gestionnaire. Contractuels et autres statuts : régime à confirmer."},
  mariage:{label:"Mariage ou PACS de l’agent",type:"ASA de droit",detail:"5 jours. L’absence doit commencer dans le mois suivant l’événement."},
  deces_conjoint:{label:"Décès du conjoint, partenaire de PACS ou concubin",type:"ASA de droit",detail:"5 jours. L’absence doit commencer dans le mois suivant le décès."},
  deces_parent:{label:"Décès d’un parent ou d’un proche visé par le décret",type:"ASA de droit",detail:"3 jours pour le père, la mère, leur conjoint/partenaire/concubin, un frère ou une sœur."},
  annonce_enfant:{label:"Annonce d’un handicap, cancer ou pathologie chronique chez l’enfant",type:"ASA de droit",detail:"5 jours."},
  deces_enfant:{label:"Décès d’un enfant",type:"ASA de droit",detail:"12 jours ouvrables, portés à 14 jours dans les situations prévues par la loi, avec éventuellement 8 jours complémentaires."},
  grossesse_exam:{label:"Examen médical obligatoire de grossesse",type:"ASA de droit",detail:"Temps nécessaire, selon les conditions de l’article L. 1225-16 du code du travail."},
  adoption:{label:"Entretien obligatoire du parcours d’agrément pour adoption",type:"ASA de droit",detail:"Temps nécessaire, dans la limite de 5 autorisations par procédure."},
  grossesse_heure:{label:"Grossesse à compter du troisième mois",type:"ASA soumise aux nécessités de service",detail:"Jusqu’à 1 heure par jour, du premier jour du troisième mois jusqu’au congé de maternité."},
  garde_enfant:{label:"Soins ou garde momentanée d’un enfant",type:"ASA soumise aux nécessités de service",detail:"6 jours par année civile à temps plein et complet, proratisés selon la quotité ; contingent doublé si l’agent assume seul la charge. Pas de limite d’âge pour un enfant en situation de handicap."},
  pma:{label:"Actes médicaux nécessaires d’un protocole de PMA",type:"ASA ou aménagement horaire — qualification à vérifier",detail:"Précisez si vous bénéficiez du protocole ou accompagnez votre conjoint, partenaire ou concubin. Une ASA peut relever de l’article L. 1225-16 ; le décret prévoit aussi des aménagements horaires. Aucune récupération ne doit être imposée au titre d’une ASA. Le report d’heures ne concerne que l’aménagement expressément retenu et autorisé."},
  preparation_naissance:{label:"Préparation à la naissance et à la parentalité",type:"Aménagement horaire avec récupération",detail:"Sous réserve des nécessités de service. Les heures sont récupérées selon les modalités autorisées."},
  parent_eleve:{label:"Réunion en qualité de représentant de parents d’élèves",type:"Aménagement horaire avec récupération",detail:"Pour les réunions énumérées par le décret, sous réserve des nécessités de service."},
  rentree:{label:"Rentrée scolaire d’un enfant en maternelle ou élémentaire",type:"Aménagement horaire avec récupération",detail:"Sous réserve des nécessités de service."},
  allaitement:{label:"Allaitement pendant l’année suivant la naissance",type:"Aménagement horaire sans récupération",detail:"Au plus 1 heure par jour pendant un an après la naissance, selon des modalités fixées d’un commun accord."},
  convenance:{label:"Absence pour convenance personnelle",type:"Demande discrétionnaire hors décret",detail:"Aucun droit à absence ni à récupération. L’autorisation et les modalités de récupération doivent être fixées avant l’absence."}
};
const $=id=>document.getElementById(id);
const form=$("absence-form"), motif=$("motif"), info=$("legal-info");
const release=window.APP_RELEASE;
if(release){
  const published=release.publishedOn?new Intl.DateTimeFormat("fr-FR",{dateStyle:"long"}).format(new Date(release.publishedOn+"T12:00:00")):"en attente de validation";
  $("release-info").textContent=`Version ${release.version} · Publication : ${published}`;
}
const leaveMotifs=new Set(["mariage","deces_conjoint","deces_parent","annonce_enfant","deces_enfant","grossesse_exam","adoption","grossesse_heure","garde_enfant","allaitement"]);
const requiresCourseDetails=v=>v.personnel_type==="enseignant"&&Boolean(v.motif)&&!leaveMotifs.has(v.motif);
const recoveryMotifs=new Set(["pma","preparation_naissance","parent_eleve","rentree","convenance"]);
const childMotifs=new Set(["garde_enfant","annonce_enfant","deces_enfant"]);
const summaryPanel=document.querySelector(".live-summary");
summaryPanel.open=!window.matchMedia("(max-width: 900px)").matches;
function fail(message,field){
  const error=$("error-message");
  error.classList.remove("success");
  error.textContent=message;
  if(field){field.setAttribute("aria-invalid","true");field.setAttribute("aria-describedby","error-message");field.focus();}
  else error.focus();
  return false;
}
form.addEventListener("submit",event=>event.preventDefault());
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const fmtDate=s=>s?new Intl.DateTimeFormat("fr-FR",{dateStyle:"long"}).format(new Date(s+"T12:00:00")):"Non renseignée";
const slots={journee:["07:30","17:30"],matin:["07:30","12:30"],apresmidi:["12:30","17:30"]};

document.querySelectorAll(".panel-button").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".panel-button").forEach(x=>x.classList.toggle("active",x===button));
  document.querySelectorAll(".app-panel").forEach(panel=>panel.classList.toggle("hidden",panel.dataset.panel!==button.dataset.target));
}));
function updateSummary(){
  const required=[$("nom").value,$("prenom").value,$("personnel_type").value,$("fonction").value,$("employeur").value,$("motif").value,$("date_debut").value,$("date_fin").value,$("certifie").checked],done=required.filter(Boolean).length,percent=Math.round(done/required.length*100);
  $("progress-bar").style.width=`${percent}%`;$("progress-label").textContent=`${percent} % complété`;
  $("summary-agent").textContent=[$("prenom").value,$("nom").value].filter(Boolean).join(" ")||"À renseigner";
  $("summary-profile").textContent=$("personnel_type").value==="enseignant"?"Personnel enseignant":$("personnel_type").value==="autre"?"Autre personnel":"À sélectionner";
  $("summary-motif").textContent=rules[$("motif").value]?.label||"À sélectionner";
  $("summary-period").textContent=$("date_debut").value&&$("date_fin").value?`${fmtDate($("date_debut").value)} → ${fmtDate($("date_fin").value)}`:"À renseigner";
  $("summary-duration").textContent=$("duree").value||"—";
}
form.addEventListener("input",updateSummary);form.addEventListener("change",updateSummary);

function workingDays(start,end){
  if(!start||!end||end<start)return 0;
  const first=new Date(start+"T00:00:00Z"),last=new Date(end+"T00:00:00Z");
  const days=Math.round((last-first)/86400000)+1;
  if(!Number.isFinite(days)||days<1)return 0;
  let count=Math.floor(days/7)*5;
  for(let i=0;i<days%7;i++){const day=(first.getUTCDay()+i)%7;if(day!==0&&day!==6)count++;}
  return count;
}
function calculateDuration(){
  $("reserve_annee").value=$("motif").value==="reserve_police"?$("date_debut").value.slice(0,4):"";
  const type=$("periode_type").value,days=workingDays($("date_debut").value,$("date_fin").value);
  if(slots[type]){[$("heure_debut").value,$("heure_fin").value]=slots[type];$("heure_debut").readOnly=$("heure_fin").readOnly=true}else{$("heure_debut").readOnly=$("heure_fin").readOnly=false}
  $("heure_debut").required=$("heure_fin").required=type==="libre";
  $("hours-help").classList.toggle("hidden",type!=="libre");
  let result="";
  if(days){
    if(type==="journee")result=`${days} ${days>1?"journées":"journée"} complète${days>1?"s":""} (${days*2} demi-journées)`;
    else if(type==="matin"||type==="apresmidi")result=`${days} demi-journée${days>1?"s":""}`;
    else {
      const duration=timeDuration($("heure_debut").value,$("heure_fin").value);
      if(duration)result=`${days} jour${days>1?"s":""} concerné${days>1?"s":""} — ${duration} par jour`;
    }
  }
  $("duree").value=result;$("duration-result").querySelector("span").textContent=result||(days&&type==="libre"?"Renseignez une heure de fin postérieure au début.":"Renseignez les dates.");updateSummary();
}
function timeDuration(start,end){
  if(!start||!end)return "";const [sh,sm]=start.split(":").map(Number),[eh,em]=end.split(":").map(Number),mins=(eh*60+em)-(sh*60+sm);
  return mins>0?`${Math.floor(mins/60)} h ${String(mins%60).padStart(2,"0")}`:"";
}
function addRecoveryRow(data={}){
  const row=document.createElement("div");row.className="recovery-row";
  row.innerHTML=`<label>Jour exact<input type="date" class="recup-date" value="${esc(data.date)}"></label><label>Début<input type="time" class="recup-debut" value="${esc(data.debut)}"></label><label>Fin<input type="time" class="recup-fin" value="${esc(data.fin)}"></label><label>Durée<input class="recup-duree computed" readonly value="${esc(data.duree)}"></label><label class="wide">Tâches / cours récupéré<input class="recup-modalites" value="${esc(data.modalites)}"></label><button type="button" class="remove-row" aria-label="Supprimer cette ligne">×</button>`;
  const update=()=>row.querySelector(".recup-duree").value=timeDuration(row.querySelector(".recup-debut").value,row.querySelector(".recup-fin").value);
  [row.querySelector(".recup-debut"),row.querySelector(".recup-fin")].forEach(el=>{el.addEventListener("change",update);el.addEventListener("input",update)});update();
  row.querySelector(".remove-row").addEventListener("click",()=>{row.remove();if(!$("recovery-rows").children.length)addRecoveryRow()});
  $("recovery-rows").appendChild(row);
}
function addCourseRow(data={}){
  const row=document.createElement("div");row.className="course-row";
  row.innerHTML=`<label>Niveau<select class="course-niveau"><option value="">Choisir</option>${["Seconde","Première","Terminale","BTS 1re année","BTS 2e année","CPGE 1re année","CPGE 2e année","Autre"].map(x=>`<option${data.niveau===x?" selected":""}>${x}</option>`).join("")}</select></label><label>Classe / groupe<input class="course-classe" value="${esc(data.classe)}"></label><label>Date du cours<input type="date" class="course-date" value="${esc(data.date)}"></label><label>Discipline / activité<input class="course-activite" value="${esc(data.activite)}"></label><label>Début<input type="time" class="course-debut" value="${esc(data.debut)}"></label><label>Fin<input type="time" class="course-fin" value="${esc(data.fin)}"></label><label>Durée<input class="course-duree computed" readonly value="${esc(data.duree)}"></label><button type="button" class="remove-row" aria-label="Supprimer ce cours">×</button>`;
  const update=()=>row.querySelector(".course-duree").value=timeDuration(row.querySelector(".course-debut").value,row.querySelector(".course-fin").value);
  [row.querySelector(".course-debut"),row.querySelector(".course-fin")].forEach(el=>{el.addEventListener("change",update);el.addEventListener("input",update)});update();
  row.querySelector(".remove-row").addEventListener("click",()=>{row.remove();if(!$("course-rows").children.length)addCourseRow()});$("course-rows").appendChild(row);
}
$("add-recovery").addEventListener("click",()=>addRecoveryRow());addRecoveryRow();
$("add-course").addEventListener("click",()=>addCourseRow());addCourseRow();
function updateConditionalSections(){
  const current={personnel_type:$("personnel_type").value,motif:motif.value};
  const teacher=current.personnel_type==="enseignant";
  $("teacher-section").classList.toggle("hidden",!requiresCourseDetails(current));
  $("teacher-recovery-warning").classList.toggle("hidden",!teacher);
}
$("personnel_type").addEventListener("change",updateConditionalSections);
[$("periode_type"),$("date_debut"),$("date_fin"),$("heure_debut"),$("heure_fin")].forEach(el=>el.addEventListener("change",calculateDuration));calculateDuration();

motif.addEventListener("change",()=>{
  const reserve=motif.value==="reserve_police";
  $("reserve-fields").classList.toggle("hidden",!reserve);
  ["reserve_statut","reserve_demandes","reserve_accordes","reserve_jours"].forEach(id=>{$(id).required=reserve;$(id).disabled=!reserve;});
  calculateDuration();
  const r=rules[motif.value];
  info.classList.toggle("hidden",!r);
  if(r) info.innerHTML=`<strong>${esc(r.type)}</strong><p>${esc(r.detail)}</p>`;
  $("child-fields").classList.toggle("hidden",!["garde_enfant","annonce_enfant","deces_enfant"].includes(motif.value));
  $("personal-fields").classList.toggle("hidden",motif.value!=="convenance");
  $("convenance_type").required=motif.value==="convenance";
  const recovery=["pma","preparation_naissance","parent_eleve","rentree","convenance"].includes(motif.value);
  $("recovery-section").classList.toggle("hidden",!recovery);
  updateConditionalSections();
});

function values(){
  const v=Object.fromEntries([...form.querySelectorAll("input[id],select[id],textarea[id]")].map(el=>[el.id,el.type==="checkbox"?el.checked:el.value.trim()]));
  const readRows=(selector,prefix,fields)=>[...document.querySelectorAll(selector)].map(row=>Object.fromEntries(fields.map(field=>[field,row.querySelector(`.${prefix}-${field}`).value.trim()]))).filter(row=>Object.values(row).some(Boolean));
  v.recoveries=recoveryMotifs.has(v.motif)?readRows(".recovery-row","recup",["date","debut","fin","duree","modalites"]):[];
  v.courses=requiresCourseDetails(v)?readRows(".course-row","course",["niveau","classe","date","activite","debut","fin","duree"]):[];
  if(v.motif!=="convenance"){v.convenance_type="";v.motif_personnel="";}
  if(v.motif!=="reserve_police"){v.reserve_statut="";v.reserve_annee="";v.reserve_demandes="";v.reserve_accordes="";v.reserve_jours="";}
  if(!childMotifs.has(v.motif)){v.enfant_nom="";v.enfant_naissance="";v.charge_seul=false;v.enfant_handicap=false;}
  return v;
}
function validate(){
  $("error-message").classList.remove("success");
  form.querySelectorAll('[aria-invalid="true"]').forEach(el=>{el.removeAttribute("aria-invalid");el.removeAttribute("aria-describedby");});
  calculateDuration();
  if(!form.reportValidity()){ $("error-message").textContent="Veuillez compléter les champs obligatoires."; return false; }
  for(const id of ["nom","prenom","fonction"]){if(!$(id).value.trim())return fail("Veuillez renseigner votre nom, votre prénom et votre fonction.",$(id));}
  if($("date_fin").value<$("date_debut").value)return fail("La date de fin ne peut pas précéder la date de début.",$("date_fin"));
  if($("periode_type").value==="libre"&&!timeDuration($("heure_debut").value,$("heure_fin").value))return fail("Renseignez les deux horaires : l’heure de fin doit être postérieure à l’heure de début.",$("heure_fin"));
  if(!$("duree").value)return fail("La période ne comporte aucun jour ouvré calculable.",$("date_debut"));
  const v=values();
  if(v.motif==="reserve_police"){
    if(!["Fonctionnaire","Contractuel de droit public","Autre statut"].includes(v.reserve_statut))return fail("Indiquez votre statut pour la demande de réserve.",$("reserve_statut"));
    if(v.date_debut.slice(0,4)!==v.date_fin.slice(0,4))return fail("Pour la réserve, établissez une demande distincte par année civile.",$("date_fin"));
    for(const id of ["reserve_demandes","reserve_accordes","reserve_jours"]){const n=Number(v[id]);if(v[id]==null||v[id]===""||!Number.isFinite(n)||n<(id==="reserve_jours"?0.5:0)||n>366||!Number.isInteger(n*2))return fail("Indiquez les jours de réserve par pas de 0,5 jour. Saisissez 0 pour les antécédents si aucun ; la demande actuelle doit être positive.",$(id));}
    const span=Math.round((new Date(v.date_fin+"T00:00:00Z")-new Date(v.date_debut+"T00:00:00Z"))/86400000)+1;
    if(Number(v.reserve_jours)>span)return fail("Les jours sollicités ne peuvent pas dépasser la durée de la période indiquée.",$("reserve_jours"));
    if(Number(v.reserve_accordes)>Number(v.reserve_demandes))return fail("Les jours accordés ne peuvent pas dépasser les jours déjà demandés.",$("reserve_accordes"));
  }
  if(requiresCourseDetails(v)&&(!v.courses.length||v.courses.some(x=>!x.niveau||!x.classe||!x.date||!x.activite||!timeDuration(x.debut,x.fin))))return fail("Chaque cours non assuré doit comporter le niveau, la classe ou le groupe, la date, l’activité et des horaires valides.");
  if(v.courses.some(x=>x.date<v.date_debut||x.date>v.date_fin))return fail("La date de chaque cours non assuré doit être comprise dans la période d’absence.");
  if(v.courses.some(x=>!workingDays(x.date,x.date)||x.debut<v.heure_debut||x.fin>v.heure_fin))return fail("Les cours doivent se situer dans les jours et horaires d’absence retenus. Pour un cours partiellement concerné, indiquez uniquement la plage non assurée.");
  if(v.recoveries.some(x=>!x.date||!timeDuration(x.debut,x.fin)||!x.modalites))return fail("Chaque récupération proposée doit comporter le jour exact, des horaires valides et les modalités.");
  $("error-message").textContent=""; return true;
}
function recoveryRows(v){return v.recoveries.length?`<table><tr><th>Jour exact</th><th>Heures précises</th><th>Durée</th><th>Modalités</th></tr>${v.recoveries.map(x=>`<tr><td>${esc(fmtDate(x.date))}</td><td>${esc(x.debut)}–${esc(x.fin)}</td><td>${esc(x.duree)}</td><td>${esc(x.modalites)}</td></tr>`).join("")}</table>`:"<p>Aucune proposition renseignée.</p>"}
function courseRows(v){return `<table><tr><th>Niveau</th><th>Classe / groupe</th><th>Date</th><th>Discipline / activité</th><th>Horaire</th><th>Durée</th></tr>${v.courses.map(x=>`<tr><td>${esc(x.niveau)}</td><td>${esc(x.classe)}</td><td>${esc(fmtDate(x.date))}</td><td>${esc(x.activite)}</td><td>${esc(x.debut)}–${esc(x.fin)}</td><td>${esc(x.duree)}</td></tr>`).join("")}</table>`}
function paperHtml(v){
  const r=rules[v.motif],lineCount=v.courses.length+v.recoveries.length,density=lineCount>14?" ultra-dense":lineCount>7?" dense-print":"";
  return `<article class="paper${density}"><p style="text-align:center;color:#687780;font-weight:bold">LYCÉE AMBROISE PARÉ DE LAVAL — 17 rue du Lycée — 53000 LAVAL</p><h1>DEMANDE D’AUTORISATION D’ABSENCE</h1>
  <h2>A — Demande de l’agent</h2><div class="meta"><p><b>Nom :</b> ${esc(v.nom)}</p><p><b>Prénom :</b> ${esc(v.prenom)}</p><p><b>Type de personnel :</b> ${v.personnel_type==="enseignant"?"Personnel enseignant":"Autre personnel"}</p><p><b>Fonction / service :</b> ${esc(v.fonction)}</p><p><b>Employeur :</b> ${esc(v.employeur)}</p><p><b>Téléphone :</b> ${esc(v.telephone)||"Non renseigné"}</p></div>
  ${v.motif==="reserve_police"?`<div class="box"><b>Réserve Police nationale — déclaration annuelle</b><br>Statut : ${esc(v.reserve_statut)}<br>Année civile : ${esc(v.reserve_annee)}<br>Jours déjà demandés, hors demande actuelle : ${esc(v.reserve_demandes)}<br>Dont jours déjà accordés : ${esc(v.reserve_accordes)}<br>Jours sollicités dans cette demande : ${esc(v.reserve_jours)}<br>Décompte déclaratif à vérifier par le service gestionnaire ; aucun solde de droits n’est certifié.</div>`:""}
  <div class="box"><b>Qualification :</b> ${esc(r.type)}<br><b>Motif :</b> ${esc(r.label)}${v.convenance_type?` — ${esc(v.convenance_type)}`:""}<br><b>Règle applicable :</b> ${esc(r.detail)}${v.motif_personnel?`<br><b>Précision :</b> ${esc(v.motif_personnel)}`:""}</div>
  <p><b>Période :</b> du ${esc(fmtDate(v.date_debut))}${v.heure_debut?` à ${esc(v.heure_debut)}`:""} au ${esc(fmtDate(v.date_fin))}${v.heure_fin?` à ${esc(v.heure_fin)}`:""}</p><p><b>Durée :</b> ${esc(v.duree)}</p><p><b>Organisation proposée :</b> ${esc(v.organisation)||"Néant"}</p><p><b>Justificatifs transmis séparément :</b> ${esc(v.justificatifs)||"Non précisés"}</p>
  ${["garde_enfant","annonce_enfant","deces_enfant"].includes(v.motif)?`<p><b>Enfant :</b> ${esc(v.enfant_nom)} — né(e) le ${esc(fmtDate(v.enfant_naissance))}<br>Charge assumée seul(e) : ${v.charge_seul?"Oui":"Non"} — Enfant en situation de handicap : ${v.enfant_handicap?"Oui":"Non"}</p>`:""}
  ${requiresCourseDetails(v)?`<h3>Cours qui ne seront pas assurés</h3>${courseRows(v)}`:""}
  ${recoveryMotifs.has(v.motif)&&!["mariage","deces_conjoint","deces_parent","annonce_enfant","deces_enfant","grossesse_exam","adoption","grossesse_heure","garde_enfant","allaitement"].includes(v.motif)?`<h3>Proposition de récupération</h3>${v.personnel_type==="enseignant"?`<p><b>Dispositif exceptionnel et dérogatoire :</b> toute récupération doit avoir fait l’objet d’un échange et d’un accord préalable du proviseur adjoint.</p>`:""}${recoveryRows(v)}<p><i>Cette proposition ne vaut pas autorisation.</i></p>`:""}
  <p>Je certifie l’exactitude des renseignements fournis et reconnais que je ne peux pas m’absenter avant notification de la décision, sauf urgence impossible à anticiper.</p><div class="signature"><p>Fait à : <span class="line"></span><br><br>Le : <span class="line"></span></p><p>Signature de l’agent :<br><br><br></p></div>
  <div class="approval-page print-page-break">
    <section class="approval-block service-block"><h2>B — Information et avis du chef de service</h2>
      <div class="approval-meta"><p><b>Nom et qualité :</b> <span class="line"></span></p><p><b>Informé le :</b> <span class="line short-line"></span></p></div>
      <p class="choice-row"><b>Incidence sur le service</b><br>☐ Aucune incidence particulière &nbsp;&nbsp; ☐ Réorganisation possible &nbsp;&nbsp; ☐ Remplacement nécessaire</p>
      <div class="writing-area service-notes"><b>Observations et mesures d’organisation envisagées</b></div>
      <p class="choice-row"><b>Avis organisationnel</b><br>☐ Favorable &nbsp;&nbsp; ☐ Favorable sous réserve &nbsp;&nbsp; ☐ Défavorable</p>
      <div class="signature approval-signature"><p><b>Date :</b> <span class="line short-line"></span></p><p><b>Signature du chef de service :</b></p></div>
    </section>
    <section class="approval-block decision-block"><h2>C — Décision du proviseur, chef d’établissement</h2>
      <div class="decision-choices">☐ AUTORISATION ACCORDÉE &nbsp;&nbsp; ☐ PARTIELLEMENT ACCORDÉE &nbsp;&nbsp; ☐ DEMANDE REFUSÉE</div>
      <div class="approval-meta"><p><b>Période autorisée :</b> <span class="line"></span></p><p><b>Durée autorisée :</b> <span class="line short-line"></span></p></div>
      <p class="choice-row"><b>Qualification retenue</b><br>☐ ASA de droit &nbsp;&nbsp; ☐ ASA sous réserve des nécessités de service<br>☐ Aménagement horaire avec récupération &nbsp;&nbsp; ☐ Allaitement sans récupération &nbsp;&nbsp; ☐ Convenance personnelle<br>☐ Congé pour activité dans la réserve</p>
      <div class="writing-area motivation-area"><b>Décision et motivation, lorsqu’elle est requise</b></div>
      <div class="writing-area recovery-area"><b>Modalités de récupération expressément autorisées</b></div>
      <div class="signature approval-signature"><p><b>Fait à Laval, le :</b> <span class="line short-line"></span></p><p><b>Nom et signature du proviseur :</b></p></div>
    </section>
  </div><p class="paper-footer">Document à transmettre au secrétariat de direction, auprès de Madame Moulin, au moins une semaine à l’avance, sauf urgence familiale ou médicale. Le téléchargement ne vaut ni transmission ni autorisation.</p></article>`;
}
function preparePreview(){
  $("preview-content").innerHTML=paperHtml(values());
  $("preview-content").querySelectorAll("table").forEach(table=>{
    const wrapper=document.createElement("div");wrapper.className="table-scroll";wrapper.tabIndex=0;wrapper.setAttribute("role","region");wrapper.setAttribute("aria-label","Tableau de la demande, défilement horizontal possible");
    table.before(wrapper);wrapper.appendChild(table);
  });
  $("preview-dialog").showModal();$("preview-dialog").scrollTop=0;
}
function showPreview(){if(!validate())return;preparePreview();}
$("preview-btn").addEventListener("click",showPreview);$("close-preview").addEventListener("click",()=>$("preview-dialog").close());
$("pdf-btn").addEventListener("click",()=>{if(!validate())return;preparePreview();setTimeout(()=>window.print(),150);});

function textCell(text,width,fill,size=16){const {TableCell,Paragraph,TextRun,WidthType,ShadingType,VerticalAlign}=docx;return new TableCell({width:{size:width,type:WidthType.DXA},shading:fill?{fill,type:ShadingType.CLEAR}:undefined,verticalAlign:VerticalAlign.CENTER,margins:{top:55,bottom:55,left:80,right:80},children:[new Paragraph({spacing:{after:0},children:[new TextRun({text:text||" ",size,bold:!!fill,font:"Arial"})]})]});}
function para(text,bold=false,size=18){return new docx.Paragraph({spacing:{after:65},children:[new docx.TextRun({text:text||" ",bold,size,font:"Arial"})]});}
function heading(text){return new docx.Paragraph({spacing:{before:120,after:70},keepNext:true,children:[new docx.TextRun({text,bold:true,size:23,color:"1F4E79",font:"Arial"})]});}
function approvalHeading(text){return new docx.Paragraph({spacing:{before:180,after:120},keepNext:true,children:[new docx.TextRun({text,bold:true,size:25,color:"1F4E79",font:"Arial"})]});}
function approvalPara(text,bold=false,after=135){return new docx.Paragraph({spacing:{before:30,after},children:[new docx.TextRun({text:text||" ",bold,size:18,font:"Arial"})]});}
async function buildWordFile(){
  if(!validate())return null; const v=values(),r=rules[v.motif];
  const {Document,Packer,Paragraph,TextRun,Table,TableRow,AlignmentType,WidthType,PageBreak}=docx;
  const rows=[["Nom et prénom",`${v.nom} ${v.prenom}`],["Type de personnel",v.personnel_type==="enseignant"?"Personnel enseignant":"Autre personnel"],["Fonction / service",v.fonction],["Employeur",v.employeur],["Téléphone",v.telephone||"Non renseigné"],["Qualification",r.type],["Motif",r.label+(v.convenance_type?` — ${v.convenance_type}`:"")],["Règle applicable",r.detail],["Période",`Du ${fmtDate(v.date_debut)}${v.heure_debut?` à ${v.heure_debut}`:""} au ${fmtDate(v.date_fin)}${v.heure_fin?` à ${v.heure_fin}`:""}`],["Durée calculée",v.duree],["Organisation proposée",v.organisation||"Néant"],["Justificatifs transmis séparément",v.justificatifs||"Non précisés"]];
  if(v.motif_personnel)rows.push(["Précision du motif",v.motif_personnel]);
  rows.push(["Transmission de la demande","Document signé à transmettre au secrétariat de direction, auprès de Madame Moulin, au moins une semaine à l’avance, sauf urgence familiale ou médicale. Le téléchargement ne vaut ni transmission ni autorisation."]);
  if(v.motif==="reserve_police")rows.push(["Statut pour la réserve",v.reserve_statut],["Année civile",v.reserve_annee],["Jours déjà demandés (hors demande actuelle)",v.reserve_demandes],["Dont jours déjà accordés",v.reserve_accordes],["Jours sollicités dans cette demande",v.reserve_jours],["Vérification du décompte","Déclaration de l’agent à vérifier par le service gestionnaire. Aucun solde de droits n’est certifié."]);
  if(["garde_enfant","annonce_enfant","deces_enfant"].includes(v.motif))rows.push(["Enfant",`${v.enfant_nom||"Non renseigné"} — né(e) le ${fmtDate(v.enfant_naissance)} — charge seul(e) : ${v.charge_seul?"oui":"non"} — handicap : ${v.enfant_handicap?"oui":"non"}`]);
  // Keep long documents readable; allow extra pages rather than shrinking to 5 pt.
  const compactSize=16;
  const children=[new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:35},children:[new TextRun({text:"LYCÉE AMBROISE PARÉ DE LAVAL — 17 rue du Lycée — 53000 LAVAL",bold:true,size:16,color:"666666",font:"Arial"})]}),new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"DEMANDE D’AUTORISATION D’ABSENCE",bold:true,size:28,color:"1F4E79",font:"Arial"})]}),heading("A — Demande de l’agent"),new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2700,6660],rows:rows.map(x=>new TableRow({children:[textCell(x[0],2700,"D9EAF7"),textCell(x[1],6660)]}))}),para("Je certifie l’exactitude des renseignements fournis et reconnais que je ne peux pas m’absenter avant notification de la décision, sauf urgence impossible à anticiper.",false,16),para("Fait à : ____________________  Le : ____ / ____ / ______  Signature : ____________________",false,16),new Paragraph({children:[new PageBreak()]}),approvalHeading("B — INFORMATION ET AVIS DU CHEF DE SERVICE"),approvalPara("Nom et qualité : ____________________________________     Informé le : ____ / ____ / ______",false,150),approvalPara("INCIDENCE SUR LE SERVICE\n☐ Aucune incidence particulière     ☐ Réorganisation possible     ☐ Remplacement nécessaire",true,160),approvalPara("OBSERVATIONS ET MESURES D’ORGANISATION ENVISAGÉES\n\n\n",true,170),approvalPara("AVIS ORGANISATIONNEL\n☐ Favorable     ☐ Favorable sous réserve     ☐ Défavorable",true,155),approvalPara("Date : __________________     Signature du chef de service : ______________________________",false,190),approvalHeading("C — DÉCISION DU PROVISEUR, CHEF D’ÉTABLISSEMENT"),approvalPara("☐ AUTORISATION ACCORDÉE     ☐ PARTIELLEMENT ACCORDÉE     ☐ DEMANDE REFUSÉE",true,165),approvalPara("Période autorisée : ______________________________     Durée autorisée : __________________",false,150),approvalPara("QUALIFICATION RETENUE\n☐ ASA de droit     ☐ ASA sous réserve des nécessités de service\n☐ Aménagement horaire avec récupération     ☐ Allaitement sans récupération     ☐ Convenance personnelle\n☐ Congé pour activité dans la réserve",true,155),approvalPara("DÉCISION ET MOTIVATION, LORSQU’ELLE EST REQUISE\n\n\n",true,175),approvalPara("MODALITÉS DE RÉCUPÉRATION EXPRESSÉMENT AUTORISÉES\n\n",true,165),approvalPara("Fait à Laval, le : ____ / ____ / ______\n\nNom et signature du proviseur : ______________________________________________",false,0)];
  let insertAt=6;
  if(requiresCourseDetails(v)){const courseDocRows=[new TableRow({children:[textCell("Niveau",1350,"D9EAF7",compactSize),textCell("Classe / groupe",1500,"D9EAF7",compactSize),textCell("Date",1550,"D9EAF7",compactSize),textCell("Activité",1900,"D9EAF7",compactSize),textCell("Horaire",1700,"D9EAF7",compactSize),textCell("Durée",1360,"D9EAF7",compactSize)]}),...v.courses.map(x=>new TableRow({children:[textCell(x.niveau,1350,null,compactSize),textCell(x.classe,1500,null,compactSize),textCell(fmtDate(x.date),1550,null,compactSize),textCell(x.activite,1900,null,compactSize),textCell(`${x.debut}-${x.fin}`,1700,null,compactSize),textCell(x.duree,1360,null,compactSize)]}))];children.splice(insertAt,0,heading("Cours qui ne seront pas assurés"),new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[1350,1500,1550,1900,1700,1360],rows:courseDocRows}));insertAt+=2;}
  if(["pma","preparation_naissance","parent_eleve","rentree","convenance"].includes(v.motif)){const recoveryDocRows=[new TableRow({children:[textCell("Jour exact",2000,"D9EAF7",compactSize),textCell("Heures précises",2200,"D9EAF7",compactSize),textCell("Durée",1600,"D9EAF7",compactSize),textCell("Modalités",3560,"D9EAF7",compactSize)]}),...(v.recoveries.length?v.recoveries:[{date:"",debut:"",fin:"",duree:"",modalites:""}]).map(x=>new TableRow({children:[textCell(x.date?fmtDate(x.date):"",2000,null,compactSize),textCell(x.debut&&x.fin?`${x.debut}-${x.fin}`:"",2200,null,compactSize),textCell(x.duree,1600,null,compactSize),textCell(x.modalites,3560,null,compactSize)]}))];children.splice(insertAt,0,heading("Proposition de récupération"),...(v.personnel_type==="enseignant"?[para("Dispositif exceptionnel et dérogatoire, soumis à un échange et à l’accord préalable du proviseur adjoint.",true,16)]:[]),new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2000,2200,1600,3560],rows:recoveryDocRows}),para("Cette proposition ne vaut pas autorisation.",false,16));}
  const wordDoc=new Document({styles:{default:{document:{run:{font:"Arial",size:18},paragraph:{spacing:{after:60,line:240}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:600,right:650,bottom:600,left:650}}},children}]});
  const blob=await Packer.toBlob(wordDoc),filename=`demande_absence_${v.nom}_${v.prenom}.docx`.replace(/\s+/g,"_");return {blob,filename};
}
async function downloadWord(){
  const button=$("word-btn");button.disabled=true;button.setAttribute("aria-busy","true");
  try{
    const file=await buildWordFile();if(!file)return;
    const a=window.document.createElement("a");a.href=URL.createObjectURL(file.blob);a.download=file.filename;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),60000);
    $("error-message").classList.add("success");$("error-message").textContent="Document Word créé. Retrouvez-le dans les téléchargements de votre navigateur.";
  }catch{fail("Le document Word n’a pas pu être créé. Réessayez ou utilisez Imprimer / PDF.");}
  finally{button.disabled=false;button.removeAttribute("aria-busy");}
}
$("word-btn").addEventListener("click",downloadWord);
