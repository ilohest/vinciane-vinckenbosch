# Vinciane Vinckenbosch

Site Astro + Vue de Vinciane Vinckenbosch, connecté a Sanity pour le contenu et deployé sur Vercel.

## Projet

- Site public : https://dev-vinciane.vercel.app
- Studio Sanity : https://dev-vinciane-studio.vercel.app
- Projet Vercel : `vincianevinckenbosch-6651s-projects/dev-vinciane`
- Projet Vercel Studio : `vincianevinckenbosch-6651s-projects/dev-vinciane-studio`
- Repo GitHub : `ilohest/vinciane-vinckenbosch`
- Code du studio : dossier `studio/`

## Installation locale

```sh
npm install
npm run dev
```

Le site local tourne sur http://localhost:4321.

Pour le studio Sanity :

```sh
cd studio
npm install
npm run dev
```

Le studio local tourne sur http://localhost:3333.

## Variables d'environnement

Les variables locales du site sont dans `.env`, a partir de `.env.example`.

Variables necessaires cote Vercel Production :

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `SANITY_PREVIEW_SECRET` si l'aperçu brouillon est active
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `OWNER_EMAIL`
- `SMTP_FROM`

Les secrets ne doivent jamais etre commités.

## Build local

Avant de déployer, vérifier que le build passe :

```sh
npm run build
```

Vercel utilise Node 24 pour ce projet.

## Deploiement manuel sur Vercel

Depuis la racine du projet :

```sh
npx vercel --prod --yes --scope vincianevinckenbosch-6651s-projects
```

Cette commande envoie le dossier courant vers Vercel et publie en production sur :

https://dev-vinciane.vercel.app

Si une variable d'environnement Vercel est ajoutée ou modifiée, relancer un déploiement production pour qu'elle soit prise en compte par le site deployé.

## Deploiement automatique avec Git

Le projet Vercel est connecté au repo GitHub :

```text
ilohest/vinciane-vinckenbosch
```

Comportement attendu :

- push sur `main` : deploiement Production automatique ;
- push sur une autre branche : deploiement Preview automatique ;
- pull request : Vercel ajoute une URL de preview.

Workflow recommande :

```sh
npm run build
git status
git add .
git commit -m "Description du changement"
git push origin main
```

Vercel construit ensuite le site automatiquement.

Le projet Vercel du studio, `dev-vinciane-studio`, est aussi connecte au meme repo GitHub. Dans Vercel, son `Root Directory` doit etre `studio` pour que les deploiements Git automatiques lancent le build depuis le bon dossier.

## Studio Sanity et aperçus brouillon

Le studio live est disponible ici :

```text
https://dev-vinciane-studio.vercel.app
```

La preview brouillon du site passe par une URL protegee :

```text
https://dev-vinciane.vercel.app/preview/fr?secret=...
```

Le `secret` n'est pas fourni par Sanity : c'est un mot de passe prive genere pour ce projet. Il est stocke dans Vercel, en valeur chiffree :

- site public : `SANITY_PREVIEW_SECRET`
- studio : `SANITY_STUDIO_PREVIEW_SECRET`

Le studio connait aussi l'URL du site public via :

```text
SANITY_STUDIO_PREVIEW_BASE_URL=https://dev-vinciane.vercel.app
```

En pratique, ne tape pas l'URL de preview a la main : ouvre un document dans le studio, puis utilise le bouton `Aperçu brouillon`.

Si le studio charge mais n'arrive pas a lire Sanity, verifier dans Sanity Manage que ces origines CORS sont autorisees :

- `https://dev-vinciane-studio.vercel.app`
- `https://dev-vinciane.vercel.app`

## Deploiement manuel du studio

Depuis le dossier `studio/` :

```sh
npm run build
npx vercel --prod --yes --scope vincianevinckenbosch-6651s-projects
```

Le studio utilise Node 22 pour eviter les incompatibilites avec Node 25.

## Verifier Vercel

Voir le projet :

```sh
npx vercel project inspect dev-vinciane --scope vincianevinckenbosch-6651s-projects
```

Lister les variables Production, sans afficher les valeurs :

```sh
npx vercel env ls production --scope vincianevinckenbosch-6651s-projects
```

Reconnecter Git si necessaire :

```sh
npx vercel git connect git@github.com:ilohest/vinciane-vinckenbosch.git --scope vincianevinckenbosch-6651s-projects
```
