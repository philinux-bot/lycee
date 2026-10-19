import {LEVELS} from './content.mjs';
export const LOCAL_SPECIALTY_IDS=['maths','pc','svt','ses','hggsp','hlp','musique','llcer-anglais','llcer-espagnol','amc'];
export const CURRENT_PATHS={generale:'Voie générale',stmg:'STMG',technologique:'Autre série technologique',professionnelle:'Voie professionnelle / réorientation'};
export const STMG_SPECIFICS=[
 {id:'gf',title:'Gestion et finance',text:'Comprendre les comptes, les choix financiers et la situation d’une organisation.'},
 {id:'mercatique',title:'Mercatique (marketing)',text:'Étudier les besoins, les offres, les relations avec les clients et les choix commerciaux.'},
 {id:'rhc',title:'Ressources humaines et communication',text:'Comprendre le travail collectif, la communication et la place des personnes dans les organisations.'}
];
export const VERIFIED_SOURCES=[
 ['L’offre du lycée','https://www.onisep.fr/ressources/structures-enseignement/pays-de-la-loire/mayenne/lycee-ambroise-pare'],
 ['Les spécialités générales du lycée','https://www.onisep.fr/ressources/structures-enseignement/pays-de-la-loire/mayenne/lycee-ambroise-pare/classe-de-1re-generale'],
 ['La STMG, de la première à la terminale','https://eduscol.education.gouv.fr/5691/horaires-de-la-serie-sciences-et-technologies-du-management-et-de-la-gestion-stmg'],
 ['Choisir ses spécialités','https://www.parcoursup.gouv.fr/construire-son-projet-d-orientation/comment-choisir-vos-specialites-en-seconde-et-premiere-1619'],
 ['L’épreuve anticipée de mathématiques','https://eduscol.education.gouv.fr/5688/epreuve-anticipee-de-mathematiques-aux-baccalaureats-general-et-technologique'],
 ['Études de santé : préparer la rentrée 2027','https://www.onisep.fr/formation/les-principaux-domaines-de-formation/les-etudes-de-sante/les-voies-d-acces-aux-etudes-de-maieutique-medecine-odontologie-pharmacie'],
 ['Calendrier Parcoursup de la session','https://www.parcoursup.gouv.fr/calendrier'],
 ['Une seule spécialité LLCER : repères académiques','https://bulacad.ac-aix-marseille.fr/uploads/BA/BA951/BA_951.pdf?ts=1745502340'],
 ['Bachibac et spécialité LLCER : cadre réglementaire','https://eduscol.education.gouv.fr/sites/default/files/document/2025-memento-cadrereglementaire-evaluationsbacpdf-113592.pdf']
];
export const HEALTH_UPDATE='Pour une entrée dans le supérieur en 2027, une réforme de l’accès aux études de santé est annoncée avec la licence portail santé (LPS). Vérifie les parcours, les filières accessibles et les modalités publiées pour ta rentrée sur Parcoursup et sur le site de l’université. Les fiches PASS et L.AS du catalogue 2025 décrivent une offre historique. Les études en IFSI ont un accès distinct.';
const stmgSteps=[
 ['Faire le bilan de ma première','Note une étude de cas que tu as aimée, un outil utilisé et une difficulté surmontée en sciences de gestion et numérique, management, droit ou économie.','J’ai noté des exemples de ce qui m’intéresse en STMG.'],
 ['Découvrir les enseignements spécifiques','En terminale, la spécialité management, sciences de gestion et numérique comprend un enseignement spécifique. À Ambroise Paré : gestion et finance, mercatique, ressources humaines et communication. Compare leurs contenus avec tes professeurs.','J’ai comparé les trois enseignements spécifiques proposés au lycée.'],
 ['Ouvrir plusieurs pistes après le bac','Compare BTS, BUT, prépa ECT, licences et écoles selon tes intérêts. Regarde la place du travail personnel, les projets, les stages, les langues et les conditions d’accès.','J’ai lu plusieurs fiches de poursuite d’études.'],
 ['Préparer les épreuves et mes questions','En première, les épreuves anticipées de français et de mathématiques concernent aussi la voie technologique. Pour l’orientation, prépare les questions à poser au professeur principal ou au Psy-EN.','J’ai fait le point sur mes apprentissages et préparé mes questions.'],
 ['Expliquer mon choix','Note ce qui te plaît dans l’enseignement spécifique envisagé, une autre possibilité et les points à vérifier. Le choix se confirme selon l’organisation et le calendrier du lycée.','J’ai expliqué mon hypothèse et prévu un échange.']
];
export function levelContent(project){
 const base=LEVELS[project.level]||LEVELS.seconde;
 if(project.level==='seconde')return base;
 if(project.currentPath==='stmg'){
  if(project.level==='premiere')return {...base,title:'En STMG, quel enseignement approfondir ?',intro:'Tu ne choisis pas deux spécialités parmi un trio général. Les spécialités de la série sont organisées nationalement. Ton choix porte notamment sur l’enseignement spécifique de terminale et les études que tu souhaites explorer.',steps:stmgSteps,prompt:'Quelle situation d’organisation aimerais-tu mieux comprendre ?'};
  return {...base,title:'Après la STMG, plusieurs chemins à comparer.',intro:'BTS, BUT, prépa ECT, licences ou écoles : explore les contenus et les conditions d’accès. Ton enseignement spécifique enrichit ta préparation sans imposer à lui seul une poursuite d’études.'};
 }
 if(project.currentPath==='technologique')return {...base,title:project.level==='premiere'?'Ma série, mes enseignements, mes projets.':'Après mon bac technologique, je prépare la suite.',intro:'Les spécialités sont organisées dans ta série. Vérifie les enseignements spécifiques et les poursuites d’études avec ton équipe. Le comparateur de trios concerne uniquement la voie générale.',steps:project.level==='premiere'?[
 ['Faire le bilan de ma série','Note les activités, les projets et les matières qui t’intéressent ainsi que ce qui te demande de l’aide.','J’ai noté mes intérêts et mes points à travailler.'],
 ['Comprendre la terminale','Compare les contenus et les enseignements spécifiques proposés dans ta série, avec tes professeurs.','J’ai vérifié les choix proposés dans ma série.'],
 ['Explorer après le bac','Compare plusieurs BTS, BUT, classes préparatoires adaptées ou autres formations selon ta série.','J’ai lu plusieurs fiches officielles de formations.'],
 ['Préparer mes épreuves et mes questions','Les épreuves anticipées de français et de mathématiques se préparent en première générale et technologique. Note aussi les questions à poser sur ton orientation.','J’ai préparé mes questions et mes prochaines démarches.'],
 ['Échanger avant de confirmer','Vérifie ton hypothèse avec le professeur principal ou le Psy-EN et note une autre possibilité.','J’ai prévu un échange et gardé plusieurs pistes.']]:base.steps,prompt:'Quels contenus veux-tu approfondir après ta série ?'};
 if(project.currentPath==='professionnelle')return {...base,title:'Un parcours professionnel qui se prépare.',intro:'Tu explores la voie professionnelle ou une réorientation. Les conditions dépendent du diplôme, de ton niveau, des places et du calendrier. Un échange avec l’équipe est nécessaire pour construire une passerelle.',steps:[
 ['Préciser ce que je recherche','Note ce que tu voudrais apprendre, pratiquer ou changer dans ta façon de travailler.','J’ai décrit ce que j’attends d’un autre parcours.'],
 ['Découvrir un diplôme et ses contenus','Compare les activités, les enseignements, les stages et les lieux de formation.','J’ai lu des fiches et comparé plusieurs formations.'],
 ['Vérifier les conditions d’accès','Demande comment ton niveau et tes acquis seront pris en compte. Une passerelle n’est pas automatique.','J’ai demandé les conditions à l’établissement envisagé.'],
 ['Prévoir l’organisation','Compare statut scolaire et apprentissage. En apprentissage, vérifie aussi l’employeur, le contrat et le CFA.','J’ai vérifié le statut, les déplacements et les démarches.'],
 ['Préparer un rendez-vous','Le professeur principal, le Psy-EN et l’établissement envisagé peuvent aider à construire la suite.','J’ai prévu un échange avant toute décision.']],prompt:'Quelle découverte concrète t’aiderait à décider ?'};
 return base;
}
export function selectionIssue(ids,options=[]){
 const languages=[...new Set(ids)].filter(id=>['llcer','llcer-anglais','llcer-espagnol','amc'].includes(id));
 if(new Set(ids.filter(id=>['musique','arts'].includes(id))).size>1)return 'La spécialité musique et une autre déclinaison de la spécialité arts ne se cumulent pas. Vérifie l’enseignement artistique que tu souhaites choisir.';
 if(languages.length>1)return 'Un seul enseignement de spécialité LLCER peut être choisi, y compris anglais monde contemporain. Choisis une langue ou AMC.';
 if(options.includes('bachibac')&&ids.includes('llcer-espagnol'))return 'En Bachibac espagnol, la spécialité LLCER espagnol ne peut pas être cumulée avec la section. Vérifie une autre combinaison avec l’équipe.';
 return '';
}
