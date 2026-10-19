# Mon parcours · Lycée Ambroise Paré

Version 3 · 16 octobre 2026. Site propriété du Lycée Ambroise Paré, Laval.

Outil destiné aux élèves. Il aide à explorer plusieurs possibilités, préparer un échange et conserver un carnet personnel. Il ne produit ni prédiction d’admission ni candidature officielle.

## Expérience

- Accueil par niveau, navigation adaptée au téléphone, sources et aide accessibles sur chaque page.
- Seconde : voies générale, technologique et professionnelle, huit séries, réorientation et apprentissage. Comparaison générale ou STMG.
- Première : trois spécialités générales et leurs trois paires ; étapes et enseignements spécifiques distincts en STMG ; repères adaptés aux autres séries ou à une réorientation.
- Terminale : saisie directe d’une paire de spécialités, recherche de formations, préparation des candidatures et de la vie étudiante.
- Dix spécialités locales identifiées ; exploration nationale séparée. Contrôles d’unicité de la LLCER et du cumul Bachibac espagnol / LLCER espagnol. La disponibilité des combinaisons d’emploi du temps reste à vérifier avec l’établissement.
- STMG : gestion et finance, mercatique, ressources humaines et communication. SIG est signalé comme offre nationale d’autres établissements.
- Carnet modifiable, trois scénarios conservant leurs propres enseignements, pistes personnelles, formations, démarches, ressources, estimations de budget et notes d’entretien.
- Fichier JSON pour reprendre le travail, PDF A4 directement téléchargeables et impression par le navigateur disponible pour le carnet.

## Informations vérifiées

Références consultées le 16 octobre 2026 : Onisep, Parcoursup, Éducation nationale / éduscol, MESR et CNED. Les références sont accessibles dans Aide et `dist/student-content.mjs`.

L’offre locale de spécialités, STMG, options et BTS est distinguée de l’exploration nationale. L’ouverture de l’option danse n’est pas annoncée comme acquise. Mathématiques complémentaires n’est pas réservée aux élèves ayant arrêté la spécialité en première. La santé signale la réforme annoncée pour la rentrée 2027 avec la licence portail santé ; PASS/LAS demeure un libellé historique du catalogue 2025. Aucune date 2026 n’est transposée à 2027 : le calendrier 2027 n’est pas encore publié à la date de vérification.

Catalogue inchangé : 14 252 enregistrements Parcoursup 2025 hors apprentissage. Source SIES, jeu actualisé le 9 mars 2026, extrait le 8 septembre 2026, Licence Ouverte 2.0. Académie = lieu d’accueil. Taux d’accès = indicateur historique publié, jamais une probabilité personnelle. Les profils ne contiennent ni spécialités individuelles ni moyennes. L’offre et les critères actuels sont à consulter sur la fiche officielle de la session.

## Confidentialité

Application statique. Le carnet et les textes ne sont envoyés ni au lycée, ni à Parcoursup, ni à une IA. Les PDF sont produits sur l’appareil, avec des bibliothèques et polices servies par ce même site. Les liens externes ont leurs propres règles et l’hébergement traite ses données techniques d’accès.

L’identité est facultative. Ne pas saisir d’INE, coordonnées, justificatifs, données médicales ou coordonnées bancaires. Le fichier JSON est la copie de travail à conserver. Le brouillon local est facultatif, après consentement, sans synchronisation ni garantie de pérennité. Les erreurs de stockage et conflits entre onglets sont signalés ; le texte courant reste dans la page.

## Fichiers et maintenance

Site statique sans étape de construction ; `.openai/hosting.json` conserve l’identité et le dossier `dist/`.

- `dist/app.mjs` : interface et interactions.
- `dist/core.mjs` : validation, recherche, scénarios et documents.
- `dist/content.mjs` : ressources et descriptions.
- `dist/student-content.mjs` : parcours adaptés, offre locale et sources vérifiées.
- `dist/pdf.mjs` : génération PDF, découpage des lignes et pagination.
- `dist/style.css` : charte, téléphone et impression de secours.
- `dist/assets/` : logos fournis, polices et licence.
- `dist/vendor/` : dépendances PDF locales.

Identité : bleu académique `#123354`, rouge patrimoine `#BD1237`, beige naturel `#F1E9DC`. Les fichiers de logos sont repris sans modification ni déformation. Aucune police distante.

Dépendances de développement : `pnpm install --frozen-lockfile`. Contrôles : `node --test tests/*.test.mjs`, puis le Python du runtime avec `tests/check_pdf_layout.py`. Les PDF de recette sont générés dans `tmp/pdfs/`, non publiés. Le contrôle ignore l’ancien fichier de recette `long-project.pdf` qui appartient à une version antérieure.

## Vérification et limites

43 tests automatisés : fonctions, contenu, toutes les combinaisons locales autorisées, DOM des neuf écrans et des parcours, série STMG, catalogue, filtres, comparaisons, budget, import/export réel de fichier, fichiers invalides, brouillon, conflits et erreurs réseau. Le DOM de test ne remplace pas un navigateur.

23 PDF de recette : neuf parcours, huit fiches pratiques, trois formations, un carnet très long, un carnet avec mots sans espaces et un tableau de plusieurs pages. Contrôle du format A4, des limites de 18 mm, du pied de page et de la présence des 40 formations et 100 démarches du carnet long ; inspection visuelle de pages rendues. Le moteur livré au navigateur est également testé. Les caractères absents de DejaVu Sans sont transcrits en code Unicode dans le PDF et conservés intégralement dans le JSON.

La prévisualisation Sites gérée a échoué avant lancement pour une limitation d’infrastructure (`bwrap: Can't mount proc`). La connexion au navigateur local était aussi indisponible. Il n’a donc pas été possible de certifier le rendu du site ou les gestes natifs dans un navigateur réel, ni l’impression de secours propre à chaque navigateur. Aucune infrastructure de prévisualisation parallèle n’a été créée.

43 liens ont été interrogés : 42 ont répondu avec succès ; le site de Nantes Université a refusé le contrôle HTTP automatisé (403), ce qui n’établit pas que son lien soit cassé. Les ressources sont datées et doivent être revérifiées avant chaque campagne.

## Dépendances et licences

PDF-lib 1.17.1 : MIT, licence fournie dans `dist/vendor/pdf-lib-LICENSE.md` ; https://github.com/Hopding/pdf-lib.

@pdf-lib/fontkit 1.1.1 : MIT, projet et mentions dans `dist/vendor/fontkit-README.md` ; https://github.com/Hopding/fontkit. Utilisé avec PDF-lib pour incorporer les polices.

DejaVu Sans : licence fournie dans `dist/assets/FONTS-LICENSE.txt` ; https://dejavu-fonts.github.io/.

Linkedom 0.18.13 : dépendance de test, non livrée au site. Les logos sont fournis par le lycée et restent sa propriété.
