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

- [ ] Déployer le studio : dans `studio/` → `npx sanity deploy` → choisir une URL (ex. `vinciane.sanity.studio`)
- [ ] Sanity → **API → CORS origins** → ajouter le domaine final du site (ex. `https://vincianevinckenbosch.com`)
- [ ] Sanity → **Members → Invite** → inviter Vinciane (rôle Editor)

## 4. Contact / e-mail

- [ ] Remplacer le mot de passe d'application Gmail de test par celui du compte **définitif**
      (actuellement compte de test `isaure.lohest@gmail.com` dans `.env`)
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
