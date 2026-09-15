# LCG Building — site vitrine

Site statique : HTML / CSS / JS natifs, **zéro dépendance, zéro build**.
Un seul fichier de page, un fichier de style, un fichier de script.

```
index.html          la page complète
assets/style.css    styles (tokens CSS en haut du fichier)
assets/script.js    toutes les interactions
assets/img/         18 photos
CREDITS.md          auteur + licence de chaque photo
```

## Lancer en local

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Ce que contient la page

| Section | Contenu |
|---|---|
| Hero | Photo plein écran, 4 arguments chiffrés, double CTA |
| Bandeau | Marquee défilant des prestations |
| Chiffres | 4 compteurs animés à l'entrée dans l'écran |
| Services | 6 cartes photo + accordéon « détail des prestations » |
| Secteurs | Particuliers / copropriétés / professionnels |
| Réalisations | Mosaïque filtrable (5 catégories) + fiche détaillée en lightbox |
| Avant / Après | Comparateur d'images au curseur |
| Méthode | 5 étapes avec délais annoncés |
| Mon projet | Qualification du chantier (type, surface, finition, contraintes) : le récapitulatif se glisse dans le formulaire de contact |
| Entreprise | Présentation et engagements |
| Zone | Départements couverts + carte SVG |
| Avis | Carrousel de témoignages (3 → 2 → 1 colonne) |
| FAQ | 8 questions en accordéon natif `<details>` |
| Contact | Coordonnées + formulaire validé |

Détails d'implémentation : barre de progression de lecture, lien de nav actif
selon la section visible, menu burger, apparitions au scroll, `prefers-reduced-motion`
respecté partout, données structurées JSON-LD `GeneralContractor`.

## À personnaliser avant mise en ligne

1. **Coordonnées** — téléphone `07 43 69 66 12`, `ishaac.baccouche@lcgbuilding.com`, adresse,
   SIRET. Ils apparaissent dans le header, la section contact, le footer et le
   bloc JSON-LD en haut de `index.html`.
2. **Photos** — celles livrées sont des **images d'illustration** sous licence libre
   (voir `CREDITS.md`). Remplacez-les par vos chantiers en gardant les mêmes noms de
   fichiers dans `assets/img/`, rien d'autre à changer. L'avant/après utilise deux
   bâtiments différents : mettez-y une vraie paire dès que possible.
3. **Contenu chiffré** — les chiffres clés (`data-count` dans `index.html`), les
   fiches de réalisations (attributs `data-*` sur chaque `<article class="work">`)
   et les témoignages sont des exemples. À remplacer par vos vrais chantiers.
4. **Bloc « Mon projet »** — il ne donne volontairement aucun prix : il qualifie
   le chantier et transmet le récapitulatif au formulaire. Les types de projet
   sont les `<option>` de `#estType` dans `index.html`.
5. **Mentions légales / CGV / confidentialité** — les liens du footer sont vides.
6. **SIRET** — dans le pied de page.

## Réception des demandes de devis

Le formulaire envoie les demandes à **ishaac.baccouche@lcgbuilding.com** via
[FormSubmit](https://formsubmit.co) : pas de serveur à gérer, pas de compte à créer.

**Une seule action à faire, une seule fois :** à la première demande envoyée depuis
le site **mis en ligne**, FormSubmit envoie un e-mail d'activation à cette adresse.
Cliquez son lien, et toutes les demandes suivantes arrivent directement dans la boîte.
Tant que ce clic n'est pas fait, rien n'est transmis.

Faites donc ce premier envoi vous-même, avec vos vraies informations, juste après
la mise en ligne — c'est le test qui active le service.

Ce qui est déjà en place :
- envoi en arrière-plan : le visiteur reste sur la page et voit la confirmation
- champ piège anti-robots (`_honey`), invisible pour un humain
- `Répondre` sur l'e-mail reçu répond directement au client
- si l'envoi échoue (réseau, service indisponible), la messagerie du visiteur
  s'ouvre en secours avec la demande pré-remplie : aucune demande n'est perdue

Pour changer de service (Formspree, Web3Forms, votre propre back-end), il n'y a
qu'une ligne à modifier — `FORM_ENDPOINT`, en haut de `assets/script.js`.
L'adresse de destination est juste au-dessus, dans `CONTACT_EMAIL`.

> Note : sur la page en ligne, l'adresse figure en clair dans le code JavaScript.
> Après activation, FormSubmit fournit un identifiant anonyme à utiliser à la
> place de l'adresse dans `FORM_ENDPOINT` — utile contre les robots spammeurs.

> Les mentions « garantie décennale », « RC professionnelle » et le taux de
> chantiers livrés à l'heure doivent correspondre à votre situation réelle :
> ces affirmations vous engagent juridiquement.

## Couleurs

Tout est piloté par les variables en haut de `assets/style.css` :
`--accent` (jaune chantier), `--ink` (fond sombre), `--paper-alt` (fond clair).

## Mise en ligne

Déposez le dossier tel quel sur Netlify, Vercel, GitHub Pages ou un hébergement FTP.
Aucune étape de build.
