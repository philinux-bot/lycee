# Version 3.0.0 — préparation du 8 septembre 2026

Statut : version de travail, non publiée. La date de publication reste vide dans `release.js` jusqu’à validation et mise en ligne effective.

## Évolutions

- Reprise de la dernière version Sites (base `5662b642aedf26aeaa0d1a6f1fc74ce533757456`), dont les exemptions de déclaration des cours.
- Champs à 16 px, accueil compact, synthèse repliée sur mobile, cours et récupérations sur une colonne sous 540 px.
- Actions non flottantes pour éviter de masquer la saisie ; tableaux d’aperçu défilants et signatures adaptatives.
- Horaires vides/inversés refusés ; cours limités aux dates et horaires de l’absence ; données des rubriques inactives exclues de la validation et des exports.
- Message explicite sur la saisie temporaire, sans sauvegarde persistante de données personnelles.
- Documents Word longs maintenus lisibles ; gestion des erreurs de génération et lien de téléchargement ajouté au document avant activation.
- Numéro de version et champ de date de publication visibles. Aucun lien visible vers l’hébergement technique.

## Périmètre et réserves

- Les règles antérieures au 1er janvier 2027 ne sont pas implémentées. Cette version bloque les demandes dont le début précède cette date et invite à contacter le secrétariat. Ne pas publier pour un usage 2026 sans traiter explicitement ce besoin.
- Les jours fériés et calendriers individuels restent à vérifier manuellement.
- Les références juridiques existantes ne constituent pas un audit juridique validé.
- Les tests navigateur aux dimensions mobiles ne remplacent pas les essais physiques Safari/iOS et Chrome/Android, notamment pour l’impression et les téléchargements dans Google Sites.
- Les tests locaux ne modifient pas le site publié. Ne pas activer de déploiement automatique sur la branche de travail.

## Vérifications

- 13 tests automatisés : calculs, validation, confidentialité des champs masqués, génération Word (0, 1 et 20 cours), fichiers nécessaires.
- Construction de production réussie.
- Formulaire sans débordement horizontal aux dimensions 320, 360, 390, 430, 768, 844 et 1280 px dans Chrome, avec champs mesurés à 16 px.

## Publication ultérieure

Le dépôt GitHub conserve l’application statique à sa racine. Les tests s’exécutent avec `node --test tests/absence.test.mjs`. Le fichier `sites-adapter.patch` conserve les adaptations de développement du projet Sites, à appliquer à la base indiquée plus haut ; `tests/mobile-layout.html` est un banc d’essai local, non une page publique.

Après validation explicite, renseigner `publishedOn` dans `release.js` avec la date effective au format `YYYY-MM-DD`, vérifier la mention visible et publier via la procédure Sites existante. Google Sites reste le point d’entrée public. La branche `main` de GitHub n’est pas modifiée par cette préparation.
