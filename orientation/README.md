# Cap Avenir · Lycée Ambroise Paré

Application web statique d’aide à l’orientation pour les élèves du lycée Ambroise Paré de Laval.

## Objectif

Donner aux élèves un espace unique pour :

- avancer selon leur niveau : seconde, première, terminale générale ou STMG ;
- explorer les neuf spécialités actuellement documentées au lycée : Arts-Musique, HGGSP, HLP, Mathématiques, LLCER Anglais, AMC, Physique-chimie, SES et SVT ;
- explorer les grandes familles de formations du supérieur ;
- utiliser directement des ressources officielles : Parcoursup, Avenir(s), Onisep, MonProjetSup, open data Parcoursup, Mes services étudiant et CROUS ;
- enregistrer leurs pistes de formations ;
- construire et modifier un projet personnel ;
- tenir un plan d’action ;
- produire une synthèse pour un échange avec un professeur principal, un PsyEN ou la famille ;
- exporter et réimporter l’ensemble du projet en JSON ;
- imprimer ou enregistrer la synthèse en PDF depuis le navigateur.

## Choix de confidentialité

La version 2 ne comporte ni compte, ni base de données, ni outil d’analytics. Les informations sont enregistrées dans `localStorage` sur l’appareil de l’élève. Elles ne quittent l’appareil que si l’élève utilise volontairement la fonction d’export.

Ce choix permet une expérimentation pédagogique simple et limite la collecte de données personnelles. Une version institutionnelle avec authentification ne devrait être envisagée qu’après définition des finalités, des durées de conservation, des habilitations et du cadre RGPD.

## Charte graphique Ambroise Paré

Palette :

- Rouge Paré : `#9A1731` — accent identitaire ;
- Bleu horizon : `#245B78` — structure et numérique ;
- Vert confiance : `#486957` — accompagnement ;
- Graphite : `#20242A` — texte ;
- Pierre claire : `#F5F1E8` — respiration ;
- Gris manuscrit : `#A9ADA6` — décor uniquement.

Typographies : Marianne et Spectral lorsqu’elles sont disponibles dans un environnement institutionnel autorisé. La version web utilise les replis portables Arial et Georgia, conformément à la charte, sans distribuer de fichiers de police.

Le Rouge Paré est conservé comme accent. Les grandes surfaces sont blanches ou Pierre claire et le Bleu horizon structure la navigation.

### Logo

Le code n’essaie pas de reconstruire le logo historique. Il utilise dans l’en-tête une signature typographique et un repère textuel temporaire `AP`. Avant une diffusion institutionnelle définitive, remplacer ce repère par le fichier logo maître validé du lycée, sans déformation et avec sa zone de protection, puis créer les icônes PWA à partir d’un fichier autorisé.

## Parcoursup 2027

Au 8 septembre 2026, le calendrier officiel affiché sur Parcoursup est encore celui de la session 2026. L’application ne présente donc pas les dates 2026 comme calendrier actif pour les terminales 2026-2027.

La session 2026 est utilisée uniquement comme repère clairement identifié pour certaines règles annuelles. Les dates, plafonds de vœux et éventuelles évolutions de procédure doivent être revalidés lors de la publication de la session 2027.

## Déploiement

Aucune compilation n’est nécessaire. Les fichiers nécessaires sont :

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`

Le répertoire peut être servi tel quel par GitHub Pages ou tout serveur HTTPS statique. Le service worker ne s’enregistre pas en ouverture directe `file://` ; il nécessite un serveur web.

## Tests conseillés avant diffusion élèves

1. Tester Safari iOS, Chrome Android, Chrome/Edge sur ordinateur et Firefox.
2. Vérifier tous les liens externes et les mettre à jour à chaque rentrée.
3. Vérifier l’offre réelle des enseignements de spécialité et des enseignements spécifiques STMG de l’année.
4. Actualiser les informations Parcoursup dès publication du calendrier 2027.
5. Tester le fonctionnement du stockage local, de l’export et de l’import.
6. Tester l’impression en PDF sur ordinateur et smartphone.
7. Faire une revue d’accessibilité : navigation clavier, zoom 200 %, contrastes, lecture d’écran et intitulés de formulaires.
8. Faire tester l’ergonomie par un petit groupe d’élèves de seconde, première, terminale et STMG avant généralisation.

## Principe éditorial

L’application ne recommande pas automatiquement un « meilleur » parcours. Elle distingue :

- les règles officielles ;
- les constats issus des sessions précédentes ;
- les pistes de cohérence ;
- les décisions personnelles de l’élève.

Le principe directeur est de favoriser l’exploration et l’ambition sans créer d’autocensure à partir de statistiques passées.
