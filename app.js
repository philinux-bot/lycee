const rules = {
  mariage:{label:"Mariage ou PACS de l’agent",type:"ASA de droit",detail:"5 jours. L’absence doit commencer dans le mois suivant l’événement."},
  deces_conjoint:{label:"Décès du conjoint, partenaire de PACS ou concubin",type:"ASA de droit",detail:"5 jours. L’absence doit commencer dans le mois suivant le décès."},
  deces_parent:{label:"Décès d’un parent ou d’un proche visé par le décret",type:"ASA de droit",detail:"3 jours pour le père, la mère, leur conjoint/partenaire/concubin, un frère ou une sœur."},
  annonce_enfant:{label:"Annonce d’un handicap, cancer ou pathologie chronique chez l’enfant",type:"ASA de droit",detail:"5 jours."},
  deces_enfant:{label:"Décès d’un enfant",type:"ASA de droit",detail:"12 jours ouvrables, portés à 14 jours dans les situations prévues par la loi, avec éventuellement 8 jours complémentaires."},
  grossesse_exam:{label:"Examen médical obligatoire de grossesse",type:"ASA de droit",detail:"Temps nécessaire, selon les conditions de l’article L. 1225-16 du code du travail."},
  adoption:{label:"Entretien obligatoire du parcours d’agrément pour adoption",type:"ASA de droit",detail:"Temps nécessaire, dans la limite de 5 autorisations par procédure."},
  grossesse_heure:{label:"Grossesse à compter du troisième mois",type:"ASA soumise aux nécessités de service",detail:"Jusqu’à 1 heure par jour, du premier jour du troisième mois jusqu’au congé de maternité."},
  garde_enfant:{label:"Soins ou garde momentanée d’un enfant",type:"ASA soumise aux nécessités de service",detail:"6 jours par année civile à temps plein et complet, proratisés selon la quotité ; contingent doublé si l’agent assume seul la charge. Pas de limite d’âge pour un enfant en situation de handicap."},
  pma:{label:"Actes médicaux nécessaires d’un protocole de PMA",type:"Aménagement horaire avec récupération",detail:"Sous réserve des nécessités de service. Les heures sont récupérées selon les modalités autorisées."},
  preparation_naissance:{label:"Préparation à la naissance et à la parentalité",type:"Aménagement horaire avec récupération",detail:"Sous réserve des nécessités de service. Les heures sont récupérées selon les modalités autorisées."},
  parent_eleve:{label:"Réunion en qualité de représentant de parents d’élèves",type:"Aménagement horaire avec récupération",detail:"Pour les réunions énumérées par le décret, sous réserve des nécessités de service."},
  rentree:{label:"Rentrée scolaire d’un enfant en maternelle ou élémentaire",type:"Aménagement horaire avec récupération",detail:"Sous réserve des nécessités de service."},
  allaitement:{label:"Allaitement pendant l’année suivant la naissance",type:"Aménagement horaire sans récupération",detail:"Au plus 1 heure par jour pendant un an après la naissance, selon des modalités fixées d’un commun accord."},
  convenance:{label:"Absence pour convenance personnelle",type:"Demande discrétionnaire hors décret",detail:"Aucun droit à absence ni à récupération. L’autorisation et les modalités de récupération doivent être fixées avant l’absence."}
};
const $=id=>document.getElementById(id);
const form=$("absence-form"), motif=$("motif"), info=$("legal-info");
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
  let count=0,d=new Date(start+"T12:00:00"),last=new Date(end+"T12:00:00");
  while(d<=last){if(d.getDay()!==0&&d.getDay()!==6)count++;d.setDate(d.getDate()+1)}
  return count;
}
function calculateDuration(){
  const type=$("periode_type").value,days=workingDays($("date_debut").value,$("date_fin").value);
  if(slots[type]){[$("heure_debut").value,$("heure_fin").value]=slots[type];$("heure_debut").readOnly=$("heure_fin").readOnly=true}else{$("heure_debut").readOnly=$("heure_fin").readOnly=false}
  let result="";
  if(days){
    if(type==="journee")result=`${days} ${days>1?"journées":"journée"} complète${days>1?"s":""} (${days*2} demi-journées)`;
    else if(type==="matin"||type==="apresmidi")result=`${days} demi-journée${days>1?"s":""}`;
    else {
      const [sh,sm]=($("heure_debut").value||"00:00").split(":").map(Number),[eh,em]=($("heure_fin").value||"00:00").split(":").map(Number);
      const mins=Math.max(0,(eh*60+em)-(sh*60+sm));result=mins?`${days} jour${days>1?"s":""} concerné${days>1?"s":""} — ${Math.floor(mins/60)} h ${String(mins%60).padStart(2,"0")} par jour`: `${days} jour${days>1?"s":""} concerné${days>1?"s":""}`;
    }
  }
  $("duree").value=result;$("duration-result").querySelector("span").textContent=result||"Renseignez les dates.";updateSummary();
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
$("personnel_type").addEventListener("change",()=>{
  const teacher=$("personnel_type").value==="enseignant";$("teacher-section").classList.toggle("hidden",!teacher);$("teacher-recovery-warning").classList.toggle("hidden",!teacher);
});
[$("periode_type"),$("date_debut"),$("date_fin"),$("heure_debut"),$("heure_fin")].forEach(el=>el.addEventListener("change",calculateDuration));calculateDuration();

motif.addEventListener("change",()=>{
  const r=rules[motif.value];
  info.classList.toggle("hidden",!r);
  if(r) info.innerHTML=`<strong>${esc(r.type)}</strong><p>${esc(r.detail)}</p>`;
  $("child-fields").classList.toggle("hidden",!["garde_enfant","annonce_enfant","deces_enfant"].includes(motif.value));
  $("personal-fields").classList.toggle("hidden",motif.value!=="convenance");
  $("convenance_type").required=motif.value==="convenance";
  const recovery=["pma","preparation_naissance","parent_eleve","rentree","convenance"].includes(motif.value);
  $("recovery-section").classList.toggle("hidden",!recovery);
});

function values(){const v=Object.fromEntries([...form.querySelectorAll("input[id],select[id],textarea[id]")].map(el=>[el.id,el.type==="checkbox"?el.checked:el.value.trim()]));v.recoveries=[...document.querySelectorAll(".recovery-row")].map(row=>({date:row.querySelector(".recup-date").value,debut:row.querySelector(".recup-debut").value,fin:row.querySelector(".recup-fin").value,duree:row.querySelector(".recup-duree").value.trim(),modalites:row.querySelector(".recup-modalites").value.trim()})).filter(x=>Object.values(x).some(Boolean));v.courses=[...document.querySelectorAll(".course-row")].map(row=>({niveau:row.querySelector(".course-niveau").value,classe:row.querySelector(".course-classe").value.trim(),date:row.querySelector(".course-date").value,activite:row.querySelector(".course-activite").value.trim(),debut:row.querySelector(".course-debut").value,fin:row.querySelector(".course-fin").value,duree:row.querySelector(".course-duree").value.trim()})).filter(x=>Object.values(x).some(Boolean));return v;}
function validate(){
  $("error-message").classList.remove("success");
  if(!form.reportValidity()){ $("error-message").textContent="Veuillez compléter les champs obligatoires."; return false; }
  if($("date_fin").value<$("date_debut").value){ $("error-message").textContent="La date de fin ne peut pas précéder la date de début."; return false; }
  calculateDuration();
  if(!$("duree").value){ $("error-message").textContent="La période ne comporte aucun jour ouvré calculable."; return false; }
  const v=values();
  if(v.personnel_type==="enseignant"&&(!v.courses.length||v.courses.some(x=>!x.niveau||!x.classe||!x.date||!x.activite||!x.debut||!x.fin||!x.duree))){$("error-message").textContent="Chaque cours non assuré doit comporter le niveau, la classe ou le groupe, la date, l’activité et les horaires précis.";return false;}
  if(v.recoveries.some(x=>!x.date||!x.debut||!x.fin||!x.duree||!x.modalites)){ $("error-message").textContent="Chaque récupération proposée doit comporter le jour exact, les heures de début et de fin et les modalités."; return false; }
  $("error-message").textContent=""; return true;
}
function recoveryRows(v){return v.recoveries.length?`<table><tr><th>Jour exact</th><th>Heures précises</th><th>Durée</th><th>Modalités</th></tr>${v.recoveries.map(x=>`<tr><td>${esc(fmtDate(x.date))}</td><td>${esc(x.debut)}–${esc(x.fin)}</td><td>${esc(x.duree)}</td><td>${esc(x.modalites)}</td></tr>`).join("")}</table>`:"<p>Aucune proposition renseignée.</p>"}
function courseRows(v){return `<table><tr><th>Niveau</th><th>Classe / groupe</th><th>Date</th><th>Discipline / activité</th><th>Horaire</th><th>Durée</th></tr>${v.courses.map(x=>`<tr><td>${esc(x.niveau)}</td><td>${esc(x.classe)}</td><td>${esc(fmtDate(x.date))}</td><td>${esc(x.activite)}</td><td>${esc(x.debut)}–${esc(x.fin)}</td><td>${esc(x.duree)}</td></tr>`).join("")}</table>`}
function paperHtml(v){
  const r=rules[v.motif],lineCount=v.courses.length+v.recoveries.length,density=lineCount>14?" ultra-dense":lineCount>7?" dense-print":"";
  return `<article class="paper${density}"><p style="text-align:center;color:#687780;font-weight:bold">LYCÉE AMBROISE PARÉ DE LAVAL — 17 rue du Lycée — 53000 LAVAL</p><h1>DEMANDE D’AUTORISATION D’ABSENCE</h1>
  <h2>A — Demande de l’agent</h2><div class="meta"><p><b>Nom :</b> ${esc(v.nom)}</p><p><b>Prénom :</b> ${esc(v.prenom)}</p><p><b>Type de personnel :</b> ${v.personnel_type==="enseignant"?"Personnel enseignant":"Autre personnel"}</p><p><b>Fonction / service :</b> ${esc(v.fonction)}</p><p><b>Employeur :</b> ${esc(v.employeur)}</p><p><b>Téléphone :</b> ${esc(v.telephone)||"Non renseigné"}</p></div>
  <div class="box"><b>Qualification :</b> ${esc(r.type)}<br><b>Motif :</b> ${esc(r.label)}${v.convenance_type?` — ${esc(v.convenance_type)}`:""}<br><b>Règle applicable :</b> ${esc(r.detail)}${v.motif_personnel?`<br><b>Précision :</b> ${esc(v.motif_personnel)}`:""}</div>
  <p><b>Période :</b> du ${esc(fmtDate(v.date_debut))}${v.heure_debut?` à ${esc(v.heure_debut)}`:""} au ${esc(fmtDate(v.date_fin))}${v.heure_fin?` à ${esc(v.heure_fin)}`:""}</p><p><b>Durée :</b> ${esc(v.duree)}</p><p><b>Organisation proposée :</b> ${esc(v.organisation)||"Néant"}</p><p><b>Justificatifs transmis séparément :</b> ${esc(v.justificatifs)||"Non précisés"}</p>
  ${["garde_enfant","annonce_enfant","deces_enfant"].includes(v.motif)?`<p><b>Enfant :</b> ${esc(v.enfant_nom)} — né(e) le ${esc(fmtDate(v.enfant_naissance))}<br>Charge assumée seul(e) : ${v.charge_seul?"Oui":"Non"} — Enfant en situation de handicap : ${v.enfant_handicap?"Oui":"Non"}</p>`:""}
  ${v.personnel_type==="enseignant"?`<h3>Cours qui ne seront pas assurés</h3>${courseRows(v)}`:""}
  ${!["mariage","deces_conjoint","deces_parent","annonce_enfant","deces_enfant","grossesse_exam","adoption","grossesse_heure","garde_enfant","allaitement"].includes(v.motif)?`<h3>Proposition de récupération</h3>${v.personnel_type==="enseignant"?`<p><b>Dispositif exceptionnel et dérogatoire :</b> toute récupération doit avoir fait l’objet d’un échange et d’un accord préalable du proviseur adjoint.</p>`:""}${recoveryRows(v)}<p><i>Cette proposition ne vaut pas autorisation.</i></p>`:""}
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
      <p class="choice-row"><b>Qualification retenue</b><br>☐ ASA de droit &nbsp;&nbsp; ☐ ASA sous réserve des nécessités de service<br>☐ Aménagement horaire avec récupération &nbsp;&nbsp; ☐ Allaitement sans récupération &nbsp;&nbsp; ☐ Convenance personnelle</p>
      <div class="writing-area motivation-area"><b>Décision et motivation, lorsqu’elle est requise</b></div>
      <div class="writing-area recovery-area"><b>Modalités de récupération expressément autorisées</b></div>
      <div class="signature approval-signature"><p><b>Fait à Laval, le :</b> <span class="line short-line"></span></p><p><b>Nom et signature du proviseur :</b></p></div>
    </section>
  </div><p class="paper-footer">Décret n° 2026-604 du 6 juillet 2026 — Application au 1er janvier 2027</p></article>`;
}
function showPreview(){if(!validate())return;$("preview-content").innerHTML=paperHtml(values());$("preview-dialog").showModal();}
$("preview-btn").addEventListener("click",showPreview);$("close-preview").addEventListener("click",()=>$("preview-dialog").close());
$("pdf-btn").addEventListener("click",()=>{if(!validate())return;$("preview-content").innerHTML=paperHtml(values());$("preview-dialog").showModal();setTimeout(()=>window.print(),150);});

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
  if(["garde_enfant","annonce_enfant","deces_enfant"].includes(v.motif))rows.push(["Enfant",`${v.enfant_nom||"Non renseigné"} — né(e) le ${fmtDate(v.enfant_naissance)} — charge seul(e) : ${v.charge_seul?"oui":"non"} — handicap : ${v.enfant_handicap?"oui":"non"}`]);
  const detailedCount=v.courses.length+v.recoveries.length,compactSize=detailedCount>18?10:detailedCount>10?12:detailedCount>6?14:16;
  const children=[new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:35},children:[new TextRun({text:"LYCÉE AMBROISE PARÉ DE LAVAL — 17 rue du Lycée — 53000 LAVAL",bold:true,size:16,color:"666666",font:"Arial"})]}),new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"DEMANDE D’AUTORISATION D’ABSENCE",bold:true,size:28,color:"1F4E79",font:"Arial"})]}),heading("A — Demande de l’agent"),new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2700,6660],rows:rows.map(x=>new TableRow({children:[textCell(x[0],2700,"D9EAF7"),textCell(x[1],6660)]}))}),para("Je certifie l’exactitude des renseignements fournis et reconnais que je ne peux pas m’absenter avant notification de la décision, sauf urgence impossible à anticiper.",false,16),para("Fait à : ____________________  Le : ____ / ____ / ______  Signature : ____________________",false,16),new Paragraph({children:[new PageBreak()]}),approvalHeading("B — INFORMATION ET AVIS DU CHEF DE SERVICE"),approvalPara("Nom et qualité : ____________________________________     Informé le : ____ / ____ / ______",false,150),approvalPara("INCIDENCE SUR LE SERVICE\n☐ Aucune incidence particulière     ☐ Réorganisation possible     ☐ Remplacement nécessaire",true,160),approvalPara("OBSERVATIONS ET MESURES D’ORGANISATION ENVISAGÉES\n\n\n",true,170),approvalPara("AVIS ORGANISATIONNEL\n☐ Favorable     ☐ Favorable sous réserve     ☐ Défavorable",true,155),approvalPara("Date : __________________     Signature du chef de service : ______________________________",false,190),approvalHeading("C — DÉCISION DU PROVISEUR, CHEF D’ÉTABLISSEMENT"),approvalPara("☐ AUTORISATION ACCORDÉE     ☐ PARTIELLEMENT ACCORDÉE     ☐ DEMANDE REFUSÉE",true,165),approvalPara("Période autorisée : ______________________________     Durée autorisée : __________________",false,150),approvalPara("QUALIFICATION RETENUE\n☐ ASA de droit     ☐ ASA sous réserve des nécessités de service\n☐ Aménagement horaire avec récupération     ☐ Allaitement sans récupération     ☐ Convenance personnelle",true,155),approvalPara("DÉCISION ET MOTIVATION, LORSQU’ELLE EST REQUISE\n\n\n",true,175),approvalPara("MODALITÉS DE RÉCUPÉRATION EXPRESSÉMENT AUTORISÉES\n\n",true,165),approvalPara("Fait à Laval, le : ____ / ____ / ______\n\nNom et signature du proviseur : ______________________________________________",false,0)];
  let insertAt=6;
  if(v.personnel_type==="enseignant"){const courseDocRows=[new TableRow({children:[textCell("Niveau",1350,"D9EAF7",compactSize),textCell("Classe / groupe",1500,"D9EAF7",compactSize),textCell("Date",1550,"D9EAF7",compactSize),textCell("Activité",1900,"D9EAF7",compactSize),textCell("Horaire",1700,"D9EAF7",compactSize),textCell("Durée",1360,"D9EAF7",compactSize)]}),...v.courses.map(x=>new TableRow({children:[textCell(x.niveau,1350,null,compactSize),textCell(x.classe,1500,null,compactSize),textCell(fmtDate(x.date),1550,null,compactSize),textCell(x.activite,1900,null,compactSize),textCell(`${x.debut}-${x.fin}`,1700,null,compactSize),textCell(x.duree,1360,null,compactSize)]}))];children.splice(insertAt,0,heading("Cours qui ne seront pas assurés"),new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[1350,1500,1550,1900,1700,1360],rows:courseDocRows}));insertAt+=2;}
  if(["pma","preparation_naissance","parent_eleve","rentree","convenance"].includes(v.motif)){const recoveryDocRows=[new TableRow({children:[textCell("Jour exact",2000,"D9EAF7",compactSize),textCell("Heures précises",2200,"D9EAF7",compactSize),textCell("Durée",1600,"D9EAF7",compactSize),textCell("Modalités",3560,"D9EAF7",compactSize)]}),...(v.recoveries.length?v.recoveries:[{date:"",debut:"",fin:"",duree:"",modalites:""}]).map(x=>new TableRow({children:[textCell(x.date?fmtDate(x.date):"",2000,null,compactSize),textCell(x.debut&&x.fin?`${x.debut}-${x.fin}`:"",2200,null,compactSize),textCell(x.duree,1600,null,compactSize),textCell(x.modalites,3560,null,compactSize)]}))];children.splice(insertAt,0,heading("Proposition de récupération"),...(v.personnel_type==="enseignant"?[para("Dispositif exceptionnel et dérogatoire, soumis à un échange et à l’accord préalable du proviseur adjoint.",true,16)]:[]),new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2000,2200,1600,3560],rows:recoveryDocRows}),para("Cette proposition ne vaut pas autorisation.",false,16));}
  const wordDoc=new Document({styles:{default:{document:{run:{font:"Arial",size:18},paragraph:{spacing:{after:60,line:240}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:600,right:650,bottom:600,left:650}}},children}]});
  const blob=await Packer.toBlob(wordDoc),filename=`demande_absence_${v.nom}_${v.prenom}.docx`.replace(/\s+/g,"_");return {blob,filename};
}
async function downloadWord(){const file=await buildWordFile();if(!file)return;const a=window.document.createElement("a");a.href=URL.createObjectURL(file.blob);a.download=file.filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$("error-message").classList.add("success");$("error-message").textContent="Le document Word a été créé."}
$("word-btn").addEventListener("click",downloadWord);
