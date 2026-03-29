# ivanlilla.com

Portfolio personnel d’Ivan Lilla, construit avec Next.js (App Router), React, TypeScript et Tailwind CSS.

Ce README explique de façon complète comment installer, configurer, lancer et maintenir le site.

## Sommaire

- [1) Stack et fonctionnalités](#1-stack-et-fonctionnalités)
- [2) Prérequis](#2-prérequis)
- [3) Installation locale](#3-installation-locale)
- [4) Variables d’environnement](#4-variables-denvironnement)
- [5) Lancement (dev / prod)](#5-lancement-dev--prod)
- [6) Utilisation du site](#6-utilisation-du-site)
- [7) Modifier le contenu](#7-modifier-le-contenu)
- [8) Scripts disponibles](#8-scripts-disponibles)
- [9) Déploiement](#9-déploiement)
- [10) Dépannage](#10-dépannage)

## 1) Stack et fonctionnalités

### Stack technique

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- `pnpm` (workspace root)

### Fonctionnalités principales

- Interface portfolio “OS/terminal” responsive.
- Chat IA (route API `POST /api/chat`) branché sur ChatGPT (OpenAI).
- Pages principales:
  - `/terminal`
  - `/projects`
  - `/articles`
  - `/stack`
  - `/cv` (route existante mais section désactivée en prod)
- Articles chargés depuis `content/articles/*.mdx` avec frontmatter.
- Guestbook en mode local (localStorage, sans backend).

## 2) Prérequis

- Node.js 20+ (LTS recommandé)
- `pnpm` 10+

Option recommandée pour garantir la bonne version de `pnpm`:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

## 3) Installation locale

Depuis la racine du projet:

```bash
pnpm install
```

Ensuite, configure les variables d’environnement (section suivante), puis lance le serveur.

## 4) Variables d’environnement

Le chat IA a besoin d’une clé API OpenAI.

Crée un fichier `.env.local` à la racine:

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

Notes importantes:

- `OPENAI_API_KEY` est obligatoire.
- `OPENAI_MODEL` est optionnel (valeur par défaut: `gpt-4o-mini`).
- Après modification des variables d’environnement, redémarre le serveur Next.js.

## 5) Lancement (dev / prod)

### Mode développement

```bash
pnpm dev
```

Le site sera accessible sur `http://localhost:3000`.

### Build production

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## 6) Utilisation du site

### Navigation

- La racine `/` redirige vers `/terminal`.
- Le menu principal (sidebar) permet d’aller sur:
  - Terminal
  - Projects
  - Articles
  - Tech Stack

### Terminal (`/terminal`)

- Envoie une question pour parler à l’assistant COZ.
- La commande `clear` efface l’historique local de la session.
- Limitation anti-abus:
  - côté client: 10 requêtes/jour par navigateur (localStorage),
  - côté API: 10 requêtes/24h par IP (mémoire serveur).

### Projects (`/projects`)

- Présentation des projets live.
- Les repos source sont indiqués comme privés.

### Articles (`/articles`)

- Liste triable/filtrable (recherche, tags, tri par date/temps de lecture).
- Détail accessible via `/articles/[slug]`.

### Tech Stack (`/stack`)

- Inventaire visuel des technologies utilisées (frontend, backend, outils).

### CV (`/cv`)

- La route existe, mais l’affichage du CV est actuellement désactivé (`RESUME_ENABLED = false`).
- Le lien n’est pas affiché dans la sidebar en production.

### Guestbook

- Fonctionne en mode local uniquement (pas de persistance serveur).
- 1 message maximum par navigateur.
- Les messages sont stockés dans le localStorage du navigateur.

## 7) Modifier le contenu

### Mettre à jour le profil (nom, rôle, contact, etc.)

Édite:

`app/utils/config.ts`

### Mettre à jour la liste des projets

Édite:

`app/projects/page.tsx`

La constante `PROJECTS` contient les cartes (nom, URL, description, tags, highlights...).

### Ajouter un article

1. Crée un fichier `.mdx` dans:

`content/articles/`

2. Ajoute un frontmatter compatible:

```md
---
title: "Titre de l'article"
description: "Résumé court"
date: "2026-03-28"
author: "Ivan Lilla"
readingTime: "8 min read"
tags: [Next.js, TypeScript, Architecture]
---

## Contenu

Ton contenu Markdown/MDX ici.
```

3. Le slug est automatiquement dérivé du nom de fichier.

Exemple:

- `content/articles/mon-super-article.mdx`
- URL: `/articles/mon-super-article`

### Assets statiques (images, PDF)

Place les fichiers dans:

`public/`

Puis référence-les avec un chemin absolu web, par exemple:

- `/articles/mon-image.png`
- `/CV.pdf`

## 8) Scripts disponibles

Dans `package.json`:

- `pnpm dev` lance Next.js en développement.
- `pnpm build` génère le build de production.
- `pnpm start` sert le build de production.
- `pnpm lint` lance ESLint.

## 9) Déploiement

Déploiement conseillé: Vercel (natif Next.js).

Checklist minimum:

1. Connecter le repo sur Vercel.
2. Définir les variables d’environnement (`OPENAI_API_KEY`, éventuellement `OPENAI_MODEL`).
3. Build command: `pnpm build` (par défaut généralement détecté).
4. Start command: `pnpm start` (géré automatiquement sur Vercel pour Next.js).

## 10) Dépannage

### `Missing API key. Configure OPENAI_API_KEY...`

- Vérifie `.env.local`.
- Redémarre `pnpm dev`.

### `AI provider error. Check key/model configuration.`

- Clé invalide ou expirée.
- Modèle OpenAI invalide dans `OPENAI_MODEL`.

### Le terminal dit “Daily request limit reached”

- Limite atteinte côté client ou API.
- Attendre le reset (journée suivante côté navigateur, 24h côté API mémoire).

### Le guestbook n’affiche pas les messages d’autres utilisateurs

- Comportement normal: stockage local navigateur uniquement.

---

Si tu veux, je peux aussi te préparer une version “onboarding équipe” (plus orientée contribution: conventions, checklists PR, versioning et qualité).
