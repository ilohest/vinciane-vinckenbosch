# 📋 Checklist mise en ligne — Vinciane Vinckenbosch

> Le code est prêt et branché sur Sanity (bio, agenda, contact, crédits, presse,
> mentions légales, confidentialité). Cette liste ne couvre que les étapes
> d'infrastructure restantes au moment du déploiement.

---

## 1. Déploiement du site (Vercel)

- [ ] Connecter le repo Git à Vercel (root du projet = `dev-vinciane/`)
- [ ] Définir **Node 24** dans Vercel (le local est en 25, non supporté par les Vercel Functions)
- [ ] Renseigner les **variables d'environnement** dans Vercel (copiées depuis `.env`) :
  - `SANITY_PROJECT_ID=00t1p1z7`
  - `SANITY_DATASET=production`
  - `SANITY_API_VERSION=2024-01-01`
  - `SANITY_API_TOKEN` (token Sanity avec accès lecture, nécessaire pour l'aperçu brouillon)
  - `SANITY_PREVIEW_SECRET` (secret privé ajouté à l'URL `/preview/fr?secret=...`)
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `OWNER_EMAIL`
  - `SMTP_FROM`

## 2. Rebuild auto à chaque publication Sanity (boucle JSON-LD ↔ contenu)

- [ ] Vercel → **Settings → Git → Deploy Hooks** → créer un hook (ex. `sanity-publish`) → copier l'URL
- [ ] Sanity → [manage.sanity.io](https://manage.sanity.io) → **API → Webhooks** → coller l'URL,
      déclencheur **on publish**, dataset `production`
- [ ] Tester : publier une modif dans le studio → vérifier que Vercel rebuild automatiquement

## 3. Studio Sanity (interface de Vinciane)

> **Choix d'hébergement : auto-hébergé sur Vercel** (projet Vercel séparé
> `dev-vinciane-studio`, lié au même repo Git, dossier source = `studio/`).
> On NE PAS utiliser `sanity deploy` (hébergement natif Sanity) car il ne fournit
> que des URLs `*.sanity.studio` et ne supporte PAS les domaines personnalisés.
> Objectif : servir le studio sur **`studio.vincianevinckenbosch.com`**.

- [x] Projet Vercel `dev-vinciane-studio` créé et lié à `studio/`
- [x] Variables d'env du studio renseignées dans Vercel (projet `dev-vinciane-studio`) :
  - `SANITY_STUDIO_PROJECT_ID=00t1p1z7`
  - `SANITY_STUDIO_PREVIEW_BASE_URL=https://vincianevinckenbosch.com`
  - `SANITY_STUDIO_PREVIEW_SECRET` (même valeur que `SANITY_PREVIEW_SECRET`)
  - _(le dataset est codé en dur sur `production` dans `sanity.config.ts`, pas besoin d'env)_
- [ ] ⚠️ **Root Directory = `studio`** dans Vercel → projet `dev-vinciane-studio` →
      **Settings → Build and Deployment → Root Directory** → `studio` → Save.
      **Indispensable** : sinon Vercel build la racine (le site Astro) et l'URL du
      studio affiche le site. (Réglage PROJET, pas Team Settings ; non modifiable en CLI.)
- [ ] Brancher le domaine : projet `dev-vinciane-studio` → **Settings → Domains** →
      ajouter `studio.vincianevinckenbosch.com` → créer l'enregistrement DNS (CNAME) indiqué
- [ ] Sanity → **API → CORS origins** → ajouter `https://studio.vincianevinckenbosch.com`
      (avec credentials) **et** le domaine du site `https://vincianevinckenbosch.com`
- [ ] Sanity → **Members → Invite** → inviter Vinciane (rôle Editor)

> **Déploiement manuel en attendant** (déjà fait une fois) : `cd studio && nvm use && npx vercel --prod`.
> ⚠️ Tant que le Root Directory n'est pas réglé sur `studio`, un `git push` réécrasera
> le studio avec le site — d'où l'étape Root Directory ci-dessus.
> Le studio est actuellement en ligne sur https://dev-vinciane-studio.vercel.app

## 4. Contact / e-mail

- [ ] Remplacer le mot de passe d'application Gmail de test par celui du compte **définitif**
      (actuellement compte de test `vinciane.vinckenbosch@gmail.com` dans `.env`)
- [ ] Tester l'envoi du formulaire depuis le site déployé

## 5. Vérifications finales

- [ ] Tester l'agenda live (dates Sanity)
- [ ] Valider le JSON-LD sur [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Vérifier les pages **Mentions légales** et **Confidentialité** (contenu Sanity affiché)
- [ ] Configurer le domaine personnalisé + HTTPS dans Vercel
- [ ] Mettre à jour les URLs absolues `https://vincianevinckenbosch.com` si le domaine final diffère
      (sitemap, JSON-LD, images OG)

---

## ⚠️ Point connu, non bloquant

Les **images de la biographie** sont encore des fichiers locaux (non éditables via Sanity).
Les textes et concerts, eux, sont bien pilotés par Sanity.
À brancher avant ou après la mise en ligne selon le besoin.

---

## Rappels techniques

- **Studio en local** : `cd studio && npm run dev` → http://localhost:3333
- **Site en local** : `npm run dev` → http://localhost:4321
- **Node** : le projet épingle Node 22 via `.nvmrc` → `nvm use` à l'ouverture du terminal
- **Re-seed Sanity** (si besoin de réinitialiser le contenu) : `cd studio && node seed.mjs`
- **Client Sanity** : `useCdn: false` → le build récupère toujours le contenu le plus à jour
