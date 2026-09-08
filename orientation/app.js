const APP_KEY = "cap-avenir-pare-v2";

const DATA = {
  interests: [
    "Comprendre le monde",
    "Sciences & santé",
    "Numérique",
    "Économie & société",
    "Langues & international",
    "Écrire & argumenter",
    "Créer & imaginer",
    "Environnement",
    "Management & commerce",
    "Aider & accompagner",
    "Sport",
    "Organiser & entreprendre"
  ],
  specialities: [
    {id:"maths",code:"MATHS",name:"Mathématiques",symbol:"∑",description:"Raisonner, modéliser, démontrer et résoudre des problèmes.",areas:["Sciences","Économie","Informatique","Ingénierie","Data"],interests:["Sciences & santé","Numérique","Économie & société"]},
    {id:"pc",code:"PC",name:"Physique-chimie",symbol:"⚗",description:"Comprendre et modéliser des phénomènes physiques et chimiques.",areas:["Sciences","Santé","Ingénierie","Environnement"],interests:["Sciences & santé","Environnement"]},
    {id:"svt",code:"SVT",name:"Sciences de la vie et de la Terre",symbol:"⌘",description:"Étudier le vivant, le corps humain, la génétique, l’environnement et les géosciences.",areas:["Santé","Biologie","Environnement","Sciences"],interests:["Sciences & santé","Environnement"]},
    {id:"ses",code:"SES",name:"Sciences économiques et sociales",symbol:"↗",description:"Économie, sociologie et science politique pour comprendre la société.",areas:["Économie","Gestion","Sciences sociales","Droit"],interests:["Économie & société","Management & commerce","Comprendre le monde"]},
    {id:"hggsp",code:"HGGSP",name:"Histoire-géographie, géopolitique et sciences politiques",symbol:"◎",description:"Analyser les grands enjeux du monde contemporain dans le temps et l’espace.",areas:["Droit","Sciences politiques","Journalisme","International"],interests:["Comprendre le monde","Économie & société","Langues & international"]},
    {id:"hlp",code:"HLP",name:"Humanités, littérature et philosophie",symbol:"¶",description:"Lire, penser, écrire, argumenter et construire une culture humaniste.",areas:["Lettres","Droit","Sciences humaines","Communication"],interests:["Écrire & argumenter","Comprendre le monde"]},
    {id:"llcer",code:"LLCER",name:"LLCER Anglais",symbol:"A",description:"Approfondir la langue, la littérature, la culture et les sociétés du monde anglophone.",areas:["Langues","International","Lettres","Communication"],interests:["Langues & international","Écrire & argumenter"]},
    {id:"amc",code:"AMC",name:"Anglais monde contemporain",symbol:"◌",description:"Langue et enjeux contemporains : médias, société, géopolitique et économie.",areas:["International","Communication","Commerce","Sciences politiques"],interests:["Langues & international","Comprendre le monde","Management & commerce"]},
    {id:"musique",code:"MUS",name:"Arts · Musique",symbol:"♪",description:"Pratique, culture, analyse, création et projets artistiques.",areas:["Arts","Culture","Création","Médiation"],interests:["Créer & imaginer"]}
  ],
  formationFamilies: [
    {type:"Santé",title:"PASS / L.AS et accès santé",description:"Des parcours universitaires d’accès aux études de santé. Les modalités varient selon les universités et doivent être lues établissement par établissement.",tags:["Université","Santé","Sélectivité forte"],search:"PASS LAS santé"},
    {type:"Université",title:"Licences scientifiques",description:"Mathématiques, physique, chimie, sciences de la vie, informatique… Des parcours progressifs vers master, concours ou écoles.",tags:["3 ans","Autonomie","Poursuite d’études"],search:"licence sciences"},
    {type:"Université",title:"Droit · science politique",description:"Argumentation, institutions, raisonnement juridique, analyse de documents et enjeux publics.",tags:["3 ans","Écriture","Méthode"],search:"licence droit science politique"},
    {type:"Université",title:"Économie · gestion · AES",description:"Économie, gestion, administration, mathématiques appliquées et sciences sociales selon les mentions.",tags:["3 ans","Économie","Gestion"],search:"licence économie gestion AES"},
    {type:"Université",title:"Lettres · langues · sciences humaines",description:"Lettres, langues, histoire, géographie, philosophie, sociologie, psychologie et autres sciences humaines.",tags:["3 ans","Culture","Analyse"],search:"licence lettres langues sciences humaines"},
    {type:"BUT",title:"Bachelor universitaire de technologie",description:"Formation en IUT en trois ans articulant enseignements académiques, projets, mises en situation et professionnalisation.",tags:["3 ans","IUT","Projets"],search:"BUT"},
    {type:"BTS",title:"BTS · format professionnalisant",description:"Diplôme national en deux ans avec spécialisation rapide, stages et poursuites d’études possibles.",tags:["2 ans","Encadrement","Stages"],search:"BTS"},
    {type:"Prépa",title:"CPGE scientifiques",description:"MPSI, PCSI, BCPST et autres voies selon le profil. Travail soutenu et préparation aux concours des grandes écoles.",tags:["2 ans","Exigence","Concours"],search:"CPGE MPSI PCSI BCPST"},
    {type:"Prépa",title:"CPGE ECG / ECT",description:"ECG après bac général et ECT après bac technologique STMG pour préparer les concours des écoles de management.",tags:["2 ans","Management","Concours"],search:"CPGE ECG ECT"},
    {type:"École",title:"Écoles d’ingénieurs post-bac",description:"Cycles préparatoires intégrés, bachelors ou autres cursus selon les écoles. Lire attentivement le diplôme délivré et les critères.",tags:["Sciences","Projets","5 ans souvent"],search:"école ingénieur post bac"},
    {type:"École",title:"Écoles de commerce / management",description:"Bachelors, BBA et programmes divers. Vérifier systématiquement la reconnaissance du diplôme, le grade, le coût et l’insertion.",tags:["Management","3 à 5 ans","Coût à vérifier"],search:"école commerce management"},
    {type:"Université",title:"STAPS",description:"Sciences et techniques des activités physiques et sportives : sciences, pratique, méthodologie et projet professionnel.",tags:["3 ans","Sport","Sciences"],search:"licence STAPS"},
    {type:"BTS",title:"BTS CG · Ambroise Paré",description:"Comptabilité et gestion au lycée Ambroise Paré. Une formation locale professionnalisante ouverte à la poursuite d’études.",tags:["Laval","2 ans","Au lycée"],search:"BTS comptabilité gestion Laval"},
    {type:"BTS",title:"BTS GTLA · Ambroise Paré",description:"Gestion des transports et logistique associée au lycée Ambroise Paré.",tags:["Laval","2 ans","Au lycée"],search:"BTS GTLA Laval"},
    {type:"BTS",title:"BTS NDRC · Ambroise Paré",description:"Négociation et digitalisation de la relation client au lycée Ambroise Paré.",tags:["Laval","2 ans","Au lycée"],search:"BTS NDRC Laval"}
  ],
  resources: [
    {icon:"P",title:"Parcoursup",description:"Carte des formations, fiches détaillées, critères d’analyse, chiffres d’accès, favoris et comparateur.",url:"https://www.parcoursup.gouv.fr/"},
    {icon:"A",title:"Avenir(s) · Onisep",description:"Construire progressivement son projet, découvrir des métiers, secteurs et formations et garder une trace de ses recherches.",url:"https://avenirs.onisep.fr/"},
    {icon:"M",title:"MonProjetSup",description:"Explorer des pistes de formations du supérieur à partir de ses centres d’intérêt et de ses préférences.",url:"https://monprojetsup.fr/"},
    {icon:"O",title:"Onisep",description:"Fiches métiers, études, secteurs professionnels, quiz et informations détaillées sur les parcours.",url:"https://www.onisep.fr/"},
    {icon:"D",title:"Open data Parcoursup",description:"Jeux de données ministériels pour analyser les vœux, propositions et profils d’admission des sessions passées.",url:"https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-parcoursup/"},
    {icon:"€",title:"Mes services étudiant",description:"Bourses, logement CROUS et démarches de vie étudiante à anticiper dès la terminale.",url:"https://www.messervices.etudiant.gouv.fr/"},
    {icon:"?",title:"FAQ Parcoursup",description:"Réponses officielles sur les vœux, sous-vœux, dossiers, réponses, apprentissage et situations particulières.",url:"https://www.parcoursup.gouv.fr/faq"},
    {icon:"L",title:"Réussir au lycée",description:"Informations officielles sur le lycée général et technologique, les enseignements et le baccalauréat.",url:"https://www.education.gouv.fr/reussir-au-lycee"},
    {icon:"C",title:"CROUS Nantes Pays de la Loire",description:"Logement, restauration, bourses et vie étudiante dans l’académie de Nantes.",url:"https://www.crous-nantes.fr/"}
  ],
  journeys: {
    seconde: [
      {title:"Mieux me connaître",intro:"Commence par tes goûts, tes réussites, ta manière de travailler et ce que tu veux explorer.",cards:[["Question utile","Qu’est-ce qui me donne envie de comprendre davantage ?"],["À éviter","Choisir uniquement parce que mes amis font le même choix."],["À tester","Comparer les programmes et méthodes des spécialités."],["À noter","Mes hésitations sont aussi des informations."]],missions:["Renseigner mon profil dans Mon projet","Choisir au moins cinq centres d’intérêt","Parler de mes pistes avec un adulte du lycée"]},
      {title:"Explorer les voies",intro:"Voie générale et voie technologique ne correspondent pas à une hiérarchie. Elles proposent des manières différentes d’apprendre et de préparer le supérieur.",cards:[["Voie générale","Trois spécialités en première puis deux en terminale."],["STMG","Management, droit, économie et sciences de gestion."],["Repère","Regarder le contenu réel des formations visées."],["Plan B","Garder une alternative qui m’intéresse vraiment."]],missions:["Explorer les spécialités du lycée","Lire une fiche de formation post-bac","Comparer voie générale et STMG si j’hésite"]},
      {title:"Choisir trois spécialités",intro:"Choisis d’abord des matières que tu as envie d’approfondir et dans lesquelles tu peux progresser. Vérifie ensuite la cohérence avec plusieurs études possibles.",cards:[["Règle officielle","Aucune formation supérieure ne peut exiger une combinaison unique de spécialités."],["Bonne stratégie","Associer motivation, réussite possible et ouverture."],["Attention","Utile ne veut pas dire juridiquement obligatoire."],["Action","Tester plusieurs trios dans l’outil Spécialités."]],missions:["Tester un trio de spécialités","Identifier trois familles d’études possibles","Noter pourquoi ce trio me correspond"]},
      {title:"Valider sans m’enfermer",intro:"Avant le choix final, confronte ton idée à des sources officielles et à des personnes qui connaissent ton travail.",cards:[["À consulter","Fiches Parcoursup, Avenir(s) et Onisep."],["À rencontrer","Professeur principal, professeurs et PsyEN."],["À vérifier","Ce que l’on étudie vraiment dans chaque formation."],["À garder","Une alternative crédible et choisie."]],missions:["Faire relire mon projet","Mettre trois formations en favoris","Écrire mon choix et une alternative"]}
    ],
    premiere: [
      {title:"Faire le bilan de mes trois spécialités",intro:"Observe ton intérêt, tes résultats, ta progression et la charge de travail réelle.",cards:[["Intérêt","Ai-je envie d’aller plus loin ?"],["Progression","Mes difficultés sont-elles surmontables ?"],["Méthodes","Quelles compétences développe la matière ?"],["Équilibre","Quel duo me permet de réussir ?"]],missions:["Faire un bilan des trois spécialités","Noter mes forces et fragilités","Demander un retour à mes professeurs"]},
      {title:"Comparer des formations réelles",intro:"Passe du domaine général à des formations précises, dans plusieurs établissements et plusieurs types de diplômes.",cards:[["Fiche formation","Programme, critères, capacité, coût et débouchés."],["Chiffres d’accès","Ils éclairent le passé, pas ton admission future."],["Diversifier","Licence, BUT, BTS, CPGE, école."],["Mobilité","Penser logement, transport et budget."]],missions:["Ajouter cinq formations au comparateur","Comparer au moins deux types de diplômes","Repérer une JPO ou une immersion"]},
      {title:"Choisir les deux spécialités de terminale",intro:"Le meilleur duo combine cohérence, motivation et capacité de réussite. Ce n’est pas toujours le duo réputé le plus prestigieux.",cards:[["Pas de combinaison obligatoire","Toutes les candidatures doivent être examinées."],["Mais des attendus","Certaines connaissances facilitent certaines études."],["Spécialité abandonnée","Elle reste prise en compte au baccalauréat selon les règles en vigueur."],["Décision","Écrire les raisons de mon choix."]],missions:["Choisir un duo provisoire","Vérifier cinq fiches Parcoursup","Écrire ce que j’abandonne et pourquoi"]},
      {title:"Préparer la terminale",intro:"Ton objectif n’est pas d’avoir tout décidé, mais d’avoir une méthode et des pistes concrètes.",cards:[["Favoris","Garder des formations repérées."],["Expériences","JPO, salons, échanges et immersions."],["Dossier","Comprendre ce que regardent les formations."],["Projet","Mettre mon carnet à jour avant l’été."]],missions:["Construire une liste de formations","Préparer trois questions pour une JPO","Exporter ma synthèse"]}
    ],
    terminale: [
      {title:"Construire ma liste longue",intro:"Commence assez large : plusieurs domaines, plusieurs types de formations et plusieurs zones géographiques si possible. Tu réduiras ensuite.",cards:[["Objectif","Pistes ambitieuses, réalistes et de sécurité."],["Comparer","Contenu, critères, coût, logement et débouchés."],["Favoris","Utiliser les favoris et le comparateur de Parcoursup."],["Session 2027","Dates et paramètres annuels à vérifier dès leur publication officielle."]],missions:["Repérer dix à quinze formations","Ajouter mes préférées au comparateur","Identifier les informations qui me manquent"]},
      {title:"Comprendre mon dossier",intro:"Chaque formation publie ses critères généraux d’examen des vœux. Lis-les comme une grille de compréhension, pas comme une recette magique.",cards:[["Résultats","Le poids varie selon la formation."],["Appréciations","Méthode, engagement et progression peuvent compter."],["Motivation","Certaines formations demandent des éléments spécifiques."],["Profil des admis","Une photographie du passé, jamais une garantie."]],missions:["Lire les critères de cinq formations","Comparer mon profil sans m’auto-censurer","Lister trois points à renforcer"]},
      {title:"Transformer mes pistes en stratégie",intro:"Une stratégie robuste combine des formations différentes que tu serais réellement prêt à accepter.",cards:[["Repère session 2026","La session 2026 permettait jusqu’à dix vœux hors apprentissage et dix supplémentaires en apprentissage. À revalider pour 2027."],["Sous-vœux","Le décompte dépend des catégories de formations."],["Diversifier","Éviter une liste composée uniquement de formations très sélectives."],["Apprentissage","Une voie à explorer avec recherche d’employeur."]],missions:["Classer mes pistes par intérêt personnel","Identifier au moins deux alternatives solides","Faire vérifier ma stratégie au lycée"]},
      {title:"Préparer mes décisions",intro:"La phase d’admission demande de prendre des décisions dans les délais affichés. Prépare tes critères avant de recevoir des propositions.",cards:[["Critères","Contenu, ville, coût, ambiance et poursuite d’études."],["Délai","Toujours respecter le délai affiché dans le dossier."],["Attente","Les listes évoluent au fil des réponses des candidats."],["Solutions","Phase complémentaire et CAES existent dans la procédure."]],missions:["Écrire mes critères de décision","Préparer les questions logement et budget","Savoir qui contacter au lycée"]}
    ],
    stmg: [
      {title:"Valoriser mon parcours STMG",intro:"STMG développe des compétences en management, droit, économie, gestion, numérique et communication. Le supérieur offre de nombreuses continuités.",cards:[["Voies fréquentes","BTS, BUT et licences selon le projet."],["Ambition","CPGE ECT et écoles de management sont possibles."],["Au lycée","BTS CG, GTLA et NDRC à Ambroise Paré."],["Méthode","Choisir par contenu et projet, pas par réputation."]],missions:["Identifier trois compétences acquises","Explorer trois types de diplômes","Ajouter cinq formations au comparateur"]},
      {title:"Comprendre les enseignements spécifiques",intro:"Gestion et finance, mercatique ou ressources humaines et communication permettent d’approfondir des domaines de gestion. L’offre exacte doit être vérifiée chaque année au lycée.",cards:[["Gestion & finance","Comptabilité, analyse financière et pilotage."],["Mercatique","Marchés, offre, relation client et stratégie."],["RH & communication","Organisation, relations humaines et communication."],["Conseil","Relier le contenu choisi à plusieurs poursuites d’études."]],missions:["Comparer les enseignements spécifiques","Relier mon choix à trois formations","Échanger avec les enseignants de STMG"]},
      {title:"Construire une poursuite ambitieuse",intro:"Compare le niveau d’encadrement, le rythme, le degré de spécialisation et les perspectives d’études longues.",cards:[["BTS","Encadré, spécialisé et professionnalisant."],["BUT","Trois ans en IUT avec projets et professionnalisation."],["Licence","Plus autonome et souvent plus théorique."],["ECT","Prépa dédiée aux bacheliers STMG vers les écoles de management."]],missions:["Comparer BTS, BUT, licence et ECT","Repérer une JPO","Vérifier les critères de sélection"]},
      {title:"Préparer Parcoursup",intro:"Ton dossier doit montrer ta progression et la cohérence de tes choix. Les résultats comptent, mais aussi le sérieux, les appréciations et le projet selon les formations.",cards:[["Diversification","Plusieurs types et niveaux de sélectivité."],["Alternance","À explorer selon le diplôme et le projet."],["Projet motivé","Montrer que j’ai compris la formation quand cela est demandé."],["Accompagnement","Professeur principal, PsyEN et ressources du lycée."]],missions:["Préparer une liste longue","Faire relire mon projet","Préparer un plan A, un plan B et un plan C choisis"]}
    ]
  },
  defaultTasks: [
    "Mettre à jour mon profil et mes centres d’intérêt",
    "Explorer au moins cinq formations réelles",
    "Lire les critères d’analyse de trois fiches Parcoursup",
    "Préparer trois questions pour une JPO ou un rendez-vous",
    "Présenter mon projet à un adulte et noter ce que j’en retiens"
  ]
};

const freshState = () => ({
  route:"accueil",
  level:"",
  step:0,
  specialities:[],
  missions:{},
  project:{name:"",level:"",likes:"",strengths:"",progress:"",outside:"",learning:"",domains:"",jobs:"",duration:"",mobility:"",constraints:"",ambition:"",needs:"",interests:[]},
  formations:[],
  tasks:DATA.defaultTasks.map((text,index)=>({id:`default-${index}`,text,date:"",done:false}))
});

let state = loadState();
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function uid(){
  if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(APP_KEY) || "{}");
    return deepMerge(freshState(), saved);
  }catch(error){
    return freshState();
  }
}

function deepMerge(base, incoming){
  if(!incoming || typeof incoming !== "object") return base;
  const result = {...base};
  Object.keys(incoming).forEach(key => {
    if(Array.isArray(incoming[key])) result[key] = incoming[key];
    else if(incoming[key] && typeof incoming[key] === "object" && base[key] && typeof base[key] === "object") result[key] = deepMerge(base[key], incoming[key]);
    else result[key] = incoming[key];
  });
  return result;
}

function saveState(message="Enregistré sur cet appareil"){
  localStorage.setItem(APP_KEY, JSON.stringify(state));
  if($("#saveStatus")) $("#saveStatus").textContent = message;
  renderProgress();
}

function showToast(message){
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function levelName(level){
  return ({seconde:"Seconde",premiere:"Première",terminale:"Terminale",stmg:"STMG"})[level] || "Mon niveau";
}

function goTo(route, smooth=true){
  if(!$(`[data-view="${route}"]`)) route = "accueil";
  state.route = route;
  saveState();
  $$(".view").forEach(view => view.classList.toggle("is-active", view.dataset.view === route));
  $$('[data-route]').forEach(button => button.classList.toggle("is-active", button.dataset.route === route));
  history.replaceState(null, "", `#${route}`);
  if(smooth) window.scrollTo({top:0,behavior:"smooth"});
  if(route === "projet") renderProject();
  if(route === "formations") renderFormations();
}

function setLevel(level){
  state.level = level;
  state.step = 0;
  if(!state.project.level) state.project.level = level;
  saveState();
  $("#levelDialog")?.close();
  renderAll();
  showToast(`Parcours adapté : ${levelName(level)}`);
}

function renderHeader(){
  $("#levelLabel").textContent = levelName(state.level);
  $("#levelDot").style.background = state.level ? (state.level === "stmg" ? "var(--trust)" : "var(--pare-red)") : "var(--manuscript)";
  $$('[data-level]').forEach(button => button.classList.toggle("selected", button.dataset.level === state.level));
  $$("#levelSegment [data-level]").forEach(button => button.classList.toggle("is-active", button.dataset.level === state.level));
}

function projectProgress(){
  let done = 0;
  if(state.level) done++;
  if((state.project.interests || []).length >= 3) done++;
  if(state.project.domains || state.project.jobs) done++;
  if(state.specialities.length >= 2 || state.level === "stmg") done++;
  if(state.formations.length >= 3) done++;
  if(state.tasks.filter(task => task.done).length >= 2) done++;
  return Math.round(done / 6 * 100);
}

function renderProgress(){
  const percent = projectProgress();
  $("#progressNumber").textContent = `${percent} %`;
  $("#progressBar").style.width = `${percent}%`;
  const rows = [
    ["Niveau choisi", Boolean(state.level)],
    ["Centres d’intérêt", (state.project.interests || []).length >= 3],
    ["Objectif provisoire", Boolean(state.project.domains || state.project.jobs)],
    ["Choix de parcours", state.specialities.length >= 2 || state.level === "stmg"],
    ["Formations repérées", state.formations.length >= 3],
    ["Plan d’action", state.tasks.filter(task => task.done).length >= 2]
  ];
  $("#progressChecks").innerHTML = rows.map(([label,done]) => `<div class="check-item ${done ? "done" : ""}"><i>${done ? "✓" : ""}</i><span>${label}</span></div>`).join("");
  const next = ({
    seconde:["Explore tes spécialités","Commence par tes centres d’intérêt puis teste plusieurs trios."],
    premiere:["Compare tes trois spécialités","Fais le bilan et ouvre des fiches de formations réelles."],
    terminale:["Construis une liste longue","Repère assez de formations avant de transformer tes pistes en stratégie de vœux."],
    stmg:["Valorise ton parcours STMG","Compare BTS, BUT, licences, écoles et CPGE ECT."]
  })[state.level] || ["Choisis ton niveau","L’application adaptera les étapes à ta classe."];
  $("#nextTitle").textContent = next[0];
  $("#nextText").textContent = next[1];
}

function stepComplete(index){
  if(!state.level || !DATA.journeys[state.level]) return false;
  const missions = DATA.journeys[state.level][index].missions;
  return missions.every((_,missionIndex) => state.missions[`${state.level}-${index}-${missionIndex}`]);
}

function renderJourney(){
  const nav = $("#stepNav");
  const panel = $("#journeyPanel");
  if(!state.level){
    nav.innerHTML = '<div class="info-banner">Choisis ton niveau pour afficher ton parcours.</div>';
    panel.innerHTML = '<div class="journey-panel"><span class="kicker">DÉPART</span><h2>Commence par situer ton année.</h2><p class="intro">Tu pourras changer de niveau à tout moment. Tes notes dans « Mon projet » seront conservées.</p></div>';
    return;
  }
  const journey = DATA.journeys[state.level];
  state.step = Math.max(0, Math.min(state.step, journey.length - 1));
  nav.innerHTML = journey.map((item,index) => `<button type="button" class="${index === state.step ? "is-active" : ""} ${stepComplete(index) ? "done" : ""}" data-step="${index}"><span>${stepComplete(index) ? "✓" : index + 1}</span>${escapeHtml(item.title)}</button>`).join("");
  const current = journey[state.step];
  panel.innerHTML = `<article class="journey-panel">
    <span class="kicker">ÉTAPE ${state.step + 1} / ${journey.length}</span>
    <h2>${escapeHtml(current.title)}</h2>
    <p class="intro">${escapeHtml(current.intro)}</p>
    <div class="journey-mini-grid">${current.cards.map(([label,text]) => `<div><span class="kicker">${escapeHtml(label).toUpperCase()}</span><b>${escapeHtml(text)}</b></div>`).join("")}</div>
    <h3>Mes missions</h3>
    <div class="mission-list">${current.missions.map((mission,index) => {
      const key = `${state.level}-${state.step}-${index}`;
      return `<label class="mission"><input type="checkbox" data-mission="${key}" ${state.missions[key] ? "checked" : ""}><span><b>${escapeHtml(mission)}</b><small>Cette action contribue à ton avancement.</small></span></label>`;
    }).join("")}</div>
    <div class="button-row">
      ${state.step > 0 ? '<button class="button button-secondary" type="button" data-journey-prev>← Étape précédente</button>' : ""}
      ${state.step < journey.length - 1 ? '<button class="button button-primary" type="button" data-journey-next>Étape suivante →</button>' : '<button class="button button-primary" type="button" data-route="projet">Mettre à jour mon projet →</button>'}
    </div>
  </article>`;
  $$('[data-step]').forEach(button => button.addEventListener("click", () => {state.step = Number(button.dataset.step);saveState();renderJourney();}));
  $('[data-journey-prev]')?.addEventListener("click", () => {state.step--;saveState();renderJourney();});
  $('[data-journey-next]')?.addEventListener("click", () => {state.step++;saveState();renderJourney();});
  $$('[data-mission]').forEach(checkbox => checkbox.addEventListener("change", () => {state.missions[checkbox.dataset.mission] = checkbox.checked;saveState();renderJourney();}));
  $$('#journeyPanel [data-route]').forEach(button => button.addEventListener("click", () => goTo(button.dataset.route)));
}

function toggleSpeciality(id){
  if(state.specialities.includes(id)) state.specialities = state.specialities.filter(item => item !== id);
  else {
    if(state.specialities.length >= 3){showToast("Maximum trois spécialités pour cette simulation");return;}
    state.specialities.push(id);
  }
  saveState();
  renderSpecialities();
}

function renderSpecialities(){
  $("#specialityCount").textContent = state.specialities.length;
  $("#specialityGrid").innerHTML = DATA.specialities.map(item => `<button type="button" class="speciality-card ${state.specialities.includes(item.id) ? "selected" : ""}" data-speciality="${item.id}">
    <span class="tick">${state.specialities.includes(item.id) ? "✓" : ""}</span>
    <span class="symbol" aria-hidden="true">${item.symbol}</span>
    <h3>${escapeHtml(item.name)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <div class="chip-row">${item.areas.slice(0,2).map(area => `<span class="chip">${escapeHtml(area)}</span>`).join("")}</div>
  </button>`).join("");
  $$('[data-speciality]').forEach(button => button.addEventListener("click", () => toggleSpeciality(button.dataset.speciality)));
  renderSpecialityAnalysis();
}

function renderSpecialityAnalysis(){
  const chosen = DATA.specialities.filter(item => state.specialities.includes(item.id));
  const panel = $("#specialityAnalysis");
  if(!chosen.length){
    panel.innerHTML = '<span class="kicker">SIMULATEUR</span><h2>Commence par choisir une spécialité.</h2><p>Tu verras ici les domaines couverts par ton choix et les questions à te poser.</p>';
    return;
  }
  const counts = {};
  chosen.flatMap(item => item.areas).forEach(area => counts[area] = (counts[area] || 0) + 1);
  const areas = Object.entries(counts).sort((a,b) => b[1] - a[1]).map(([area]) => area);
  const matched = (state.project.interests || []).filter(interest => chosen.some(item => item.interests.includes(interest)));
  panel.innerHTML = `<span class="kicker">LECTURE DE TON CHOIX</span>
    <h2>${chosen.map(item => item.code).join(" · ")}</h2>
    <p>Ce choix fait apparaître plusieurs champs possibles. Ce n’est ni un classement ni une prédiction d’admission.</p>
    <div class="chip-row">${areas.map(area => `<span class="chip">${escapeHtml(area)}</span>`).join("")}</div>
    <div class="analysis-columns">
      <div class="analysis-box"><h3>Ce qui correspond déjà à tes intérêts</h3>${matched.length ? `<div class="chip-row">${matched.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div>` : "<p>Renseigne tes centres d’intérêt dans Mon projet pour croiser les deux lectures.</p>"}</div>
      <div class="analysis-box"><h3>Trois vérifications utiles</h3><ul><li>Ai-je envie d’approfondir ces matières ?</li><li>Puis-je raisonnablement y progresser ?</li><li>Ai-je vérifié les critères de plusieurs formations ?</li></ul></div>
    </div>`;
}

function renderFormationFamilies(){
  const search = ($("#formationSearch")?.value || "").toLowerCase().trim();
  const type = $("#formationType")?.value || "";
  const list = DATA.formationFamilies.filter(item => (!type || item.type === type) && (!search || `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(search)));
  $("#formationGrid").innerHTML = list.length ? list.map(item => `<article class="formation-card">
    <span class="type">${escapeHtml(item.type).toUpperCase()}</span>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <div class="chip-row">${item.tags.map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
    <footer><a class="text-link" href="https://dossier.parcoursup.fr/Candidat/carte" target="_blank" rel="noopener">Chercher sur Parcoursup ↗</a><button class="text-link" type="button" data-quick-add="${escapeHtml(item.title)}">+ Ajouter au projet</button></footer>
  </article>`).join("") : '<div class="empty-state">Aucune famille ne correspond. Essaie un mot plus large.</div>';
  $$('[data-quick-add]').forEach(button => button.addEventListener("click", () => quickAddFormation(button.dataset.quickAdd)));
}

function quickAddFormation(title){
  if(state.formations.some(item => item.title === title)){showToast("Cette piste est déjà dans ton projet");return;}
  state.formations.push({id:uid(),title,school:"",city:"",type:"Piste",interest:"3",status:"À explorer",url:"",notes:""});
  saveState();
  renderSavedFormations();
  renderProject();
  showToast("Formation ajoutée au projet");
}

function renderSavedFormations(){
  const target = $("#savedFormationList");
  if(!state.formations.length){
    target.innerHTML = '<div class="empty-state"><strong>Aucune formation enregistrée.</strong><br>Ajoute une piste pour la comparer et la retrouver dans Mon projet.</div>';
    return;
  }
  target.innerHTML = `<div class="saved-list">${state.formations.map(item => `<div class="saved-row">
    <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml([item.school,item.city].filter(Boolean).join(" · ") || "Établissement à préciser")}</small></div>
    <span class="pill">${escapeHtml(item.status || "À explorer")}</span>
    <span class="stars" aria-label="Intérêt ${Number(item.interest || 3)} sur 5">${"★".repeat(Number(item.interest || 3))}${"☆".repeat(5 - Number(item.interest || 3))}</span>
    <span class="optional-wide">${item.url ? `<a class="text-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Ouvrir ↗</a>` : "Lien à ajouter"}</span>
    <button class="delete-button" type="button" data-delete-formation="${item.id}" aria-label="Supprimer ${escapeHtml(item.title)}">×</button>
  </div>`).join("")}</div>`;
  $$('[data-delete-formation]').forEach(button => button.addEventListener("click", () => {
    state.formations = state.formations.filter(item => item.id !== button.dataset.deleteFormation);
    saveState();renderSavedFormations();renderProject();
  }));
}

function renderFormations(){
  renderFormationFamilies();
  renderSavedFormations();
}

function renderProject(){
  const form = $("#projectForm");
  Object.entries(state.project).forEach(([key,value]) => {
    if(Array.isArray(value)) return;
    if(form.elements[key]) form.elements[key].value = value || "";
  });
  $("#interestGrid").innerHTML = DATA.interests.map(interest => `<button type="button" class="interest-button ${(state.project.interests || []).includes(interest) ? "selected" : ""}" data-interest="${escapeHtml(interest)}">${escapeHtml(interest)}</button>`).join("");
  $$('[data-interest]').forEach(button => button.addEventListener("click", () => {
    const interest = button.dataset.interest;
    state.project.interests = (state.project.interests || []).includes(interest) ? state.project.interests.filter(item => item !== interest) : [...(state.project.interests || []),interest];
    saveState();renderProject();renderSpecialityAnalysis();
  }));
  renderProjectFormations();
  renderTasks();
  renderSummary();
}

function renderProjectFormations(){
  const target = $("#projectFormationMirror");
  target.innerHTML = state.formations.length ? `<div class="saved-list">${state.formations.map(item => `<div class="saved-row">
    <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml([item.school,item.city].filter(Boolean).join(" · ") || "À préciser")}</small></div>
    <span class="pill">${escapeHtml(item.status || "À explorer")}</span>
    <span class="stars">${"★".repeat(Number(item.interest || 3))}</span><span></span><span></span>
  </div>`).join("")}</div>` : '<div class="empty-state">Tu n’as pas encore ajouté de formation.</div>';
}

function renderTasks(){
  $("#taskList").innerHTML = state.tasks.map(task => `<div class="task ${task.done ? "done" : ""}">
    <input type="checkbox" data-task-check="${task.id}" ${task.done ? "checked" : ""} aria-label="Marquer l’action comme réalisée">
    <span class="task-text">${escapeHtml(task.text)}</span>
    <time>${task.date ? new Date(`${task.date}T12:00:00`).toLocaleDateString("fr-FR") : ""}</time>
    <button type="button" class="delete-button" data-task-delete="${task.id}" aria-label="Supprimer l’action">×</button>
  </div>`).join("");
  $$('[data-task-check]').forEach(checkbox => checkbox.addEventListener("change", () => {
    const task = state.tasks.find(item => item.id === checkbox.dataset.taskCheck);
    if(task) task.done = checkbox.checked;
    saveState();renderTasks();renderSummary();
  }));
  $$('[data-task-delete]').forEach(button => button.addEventListener("click", () => {
    state.tasks = state.tasks.filter(task => task.id !== button.dataset.taskDelete);
    saveState();renderTasks();renderSummary();
  }));
}

function renderSummary(){
  const p = state.project;
  const specialityText = DATA.specialities.filter(item => state.specialities.includes(item.id)).map(item => item.code).join(" · ");
  const favourites = state.formations.slice().sort((a,b) => Number(b.interest || 0) - Number(a.interest || 0)).slice(0,5).map(item => item.title).join("\n");
  const actions = state.tasks.filter(task => !task.done).slice(0,4).map(task => `• ${task.text}`).join("\n");
  $("#projectSummary").innerHTML = `<div class="summary-grid">
    <div class="summary-card"><h3>Profil</h3><p>${escapeHtml([p.name,levelName(p.level || state.level)].filter(Boolean).join(" · ") || "À compléter")}</p></div>
    <div class="summary-card"><h3>Centres d’intérêt</h3><p>${escapeHtml((p.interests || []).join(" · ") || "À compléter")}</p></div>
    <div class="summary-card"><h3>Domaines / métiers</h3><p>${escapeHtml([p.domains,p.jobs].filter(Boolean).join("\n") || "À compléter")}</p></div>
    <div class="summary-card"><h3>Parcours / spécialités</h3><p>${escapeHtml(specialityText || (state.level === "stmg" ? "Parcours STMG" : "À compléter"))}</p></div>
    <div class="summary-card"><h3>Formations favorites</h3><p>${escapeHtml(favourites || "À compléter")}</p></div>
    <div class="summary-card"><h3>Prochaines actions</h3><p>${escapeHtml(actions || "À compléter")}</p></div>
  </div>`;
}

function renderResources(){
  $("#resourceGrid").innerHTML = DATA.resources.map(item => `<a class="resource-card" href="${item.url}" target="_blank" rel="noopener">
    <span class="resource-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <small>Ouvrir le site ↗</small>
  </a>`).join("");
}

function exportProject(){
  const payload = {format:"cap-avenir-pare",version:2,exportedAt:new Date().toISOString(),data:state};
  downloadBlob(JSON.stringify(payload,null,2), "mon-projet-orientation-ambroise-pare.json", "application/json");
  showToast("Projet exporté");
}

function importProject(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const payload = JSON.parse(reader.result);
      const incoming = payload.data || payload;
      if(!incoming || typeof incoming !== "object" || !incoming.project || !Array.isArray(incoming.formations)) throw new Error("format");
      state = deepMerge(freshState(), incoming);
      saveState();renderAll();goTo("projet",false);showToast("Projet importé");
    }catch(error){
      showToast("Ce fichier n’est pas un export Cap Avenir valide");
    }
  };
  reader.readAsText(file);
}

function summaryText(){
  const p = state.project;
  const specs = DATA.specialities.filter(item => state.specialities.includes(item.id)).map(item => item.name).join(", ") || (state.level === "stmg" ? "Parcours STMG" : "À préciser");
  const formations = state.formations.slice().sort((a,b) => Number(b.interest || 0) - Number(a.interest || 0)).map((item,index) => `${index + 1}. ${item.title}${item.school ? ` — ${item.school}` : ""}${item.city ? ` — ${item.city}` : ""} — ${item.status || "À explorer"}`).join("\n") || "Aucune piste enregistrée";
  const todo = state.tasks.filter(task => !task.done).map(task => `- ${task.text}${task.date ? ` (${new Date(`${task.date}T12:00:00`).toLocaleDateString("fr-FR")})` : ""}`).join("\n") || "Aucune action en attente";
  return `CAP AVENIR — SYNTHÈSE DE MON PROJET\nLycée Ambroise Paré · Laval\n\nProfil\n${p.name || "Prénom / pseudo non renseigné"} — ${levelName(p.level || state.level)}\n\nCe que j’aime apprendre\n${p.likes || "À compléter"}\n\nMes forces\n${p.strengths || "À compléter"}\n\nMes centres d’intérêt\n${(p.interests || []).join(", ") || "À compléter"}\n\nDomaines qui m’attirent\n${p.domains || "À compléter"}\n\nMétiers / activités à explorer\n${p.jobs || "À compléter"}\n\nParcours / spécialités\n${specs}\n\nMes pistes de formation\n${formations}\n\nMes prochaines actions\n${todo}\n\nCe dont j’ai besoin pour avancer\n${p.needs || "À compléter"}\n\nDocument généré le ${new Date().toLocaleDateString("fr-FR")}.\nCe document est un support de réflexion et d’échange. Il ne remplace pas les informations officielles des formations et de Parcoursup.\n`;
}

function downloadSummary(){
  downloadBlob(summaryText(), "synthese-mon-projet-cap-avenir.txt", "text/plain;charset=utf-8");
  showToast("Synthèse téléchargée");
}

function downloadBlob(content, filename, type){
  const blob = new Blob([content],{type});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

function resetApp(){
  localStorage.removeItem(APP_KEY);
  state = freshState();
  $("#resetDialog").close();
  renderAll();
  goTo("accueil",false);
  showToast("Données locales effacées");
}

function renderAll(){
  renderHeader();
  renderProgress();
  renderJourney();
  renderSpecialities();
  renderFormations();
  renderProject();
  renderResources();
}

function bindEvents(){
  $$('[data-route]').forEach(button => button.addEventListener("click", event => {
    if(button.tagName === "BUTTON"){event.preventDefault();goTo(button.dataset.route);}
  }));
  $$('[data-level]').forEach(button => button.addEventListener("click", () => setLevel(button.dataset.level)));
  $("#levelButton").addEventListener("click", () => $("#levelDialog").showModal());
  $$('[data-dialog-level]').forEach(button => button.addEventListener("click", () => setLevel(button.dataset.dialogLevel)));
  $("#formationSearch").addEventListener("input", renderFormationFamilies);
  $("#formationType").addEventListener("change", renderFormationFamilies);
  $("#openFormationDialog").addEventListener("click", () => {$("#formationForm").reset();$("#formationDialog").showModal();});
  $("#saveFormationButton").addEventListener("click", () => {
    const form = $("#formationForm");
    if(!form.reportValidity()) return;
    const item = Object.fromEntries(new FormData(form).entries());
    item.id = uid();
    state.formations.push(item);
    saveState();$("#formationDialog").close();renderFormations();renderProject();showToast("Formation ajoutée");
  });
  $("#projectForm").addEventListener("input", event => {
    const name = event.target.name;
    if(name && name in state.project){
      state.project[name] = event.target.value;
      if(name === "level" && event.target.value) state.level = event.target.value;
      saveState("Enregistrement automatique…");
      renderHeader();renderSummary();renderProgress();
    }
  });
  $$('[data-project-tab]').forEach(button => button.addEventListener("click", () => {
    $$('[data-project-tab]').forEach(item => item.classList.toggle("is-active", item === button));
    $$('[data-project-panel]').forEach(panel => panel.classList.toggle("is-active", panel.dataset.projectPanel === button.dataset.projectTab));
    if(button.dataset.projectTab === "synthese") renderSummary();
  }));
  $("#addTaskButton").addEventListener("click", () => {
    const text = $("#taskText").value.trim();
    if(!text) return;
    state.tasks.push({id:uid(),text,date:$("#taskDate").value,done:false});
    $("#taskText").value = "";$("#taskDate").value = "";saveState();renderTasks();showToast("Action ajoutée");
  });
  $("#exportButton").addEventListener("click", exportProject);
  $("#importButton").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", event => {const file = event.target.files?.[0];if(file) importProject(file);event.target.value = "";});
  $("#printButton").addEventListener("click", () => {renderSummary();window.print();});
  $("#downloadSummaryButton").addEventListener("click", downloadSummary);
  $("#resetButton").addEventListener("click", () => $("#resetDialog").showModal());
  $("#confirmResetButton").addEventListener("click", resetApp);
  window.addEventListener("hashchange", () => {const route = location.hash.slice(1);if(route) goTo(route,false);});
}

bindEvents();
renderAll();
const initialRoute = location.hash.slice(1) || state.route || "accueil";
goTo(initialRoute,false);

if("serviceWorker" in navigator && location.protocol !== "file:"){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
