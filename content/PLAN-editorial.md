# Plan éditorial : trois sagas de dix chapitres

Rythme : un article par semaine, le lundi. Langue des articles : anglais. Auteur : Ivan Lilla.
Ossature de chaque chapitre : cas réel, ce qui marche, ce qui échoue, règle retenue, teaser du chapitre suivant.
Convention de fichier : `content/articles/<slug>.mdx` + couverture `public/articles/<slug>.svg`.

## Saga 1 : AI in Everyday Life (grand public)

| # | Date | Chapitre | Cas d'usage et règle visée |
|---|------|----------|----------------------------|
| 1 | 2026-11-19 (publié) | Searching Is Now a Conversation | Chercher en itérant. La première réponse est un brouillon. |
| 2 | 2026-11-23 (rédigé) | Writing Without Losing Your Voice | Emails et messages. Décider d'abord ce qu'on veut dire. |
| 3 | 2026-11-30 | Reading: Long Documents, Short Attention | Rapports, contrats, articles longs. Ce que l'IA résume ou rate, comment vérifier. |
| 4 | 2026-12-07 | Learning Something New in a Weekend | Tuteur, questions de test, exercices. Piège : l'illusion de comprendre. |
| 5 | 2026-12-14 | Deciding: Using AI as a Sparring Partner | Pré-mortem, avocat du diable. L'IA aide à peser, elle ne tranche pas. |
| 6 | 2026-12-21 | Planning the Week (and the Trip) | Organisation, voyages. Contraintes à donner, horaires et prix à revérifier. |
| 7 | 2026-12-28 | Numbers at Home: Budgets, Contracts, Taxes | Finances personnelles et paperasse, sans données sensibles. |
| 8 | 2027-01-04 | Health Questions: Informed, Not Diagnosed | Préparer un rendez-vous médical. Limites nettes et risques. |
| 9 | 2027-01-11 | Beyond Text: Photos, Voice and Screens | Photographier un problème, dicter, traduire en direct. |
| 10 | 2027-01-18 | What I Don't Delegate | Bilan, confidentialité, usages abandonnés, checklist des dix règles. |

Note : le chapitre 1 est sorti un jeudi ; le lundi commence au chapitre 2. Les chapitres 6 à 8 tombent pendant les fêtes et peuvent être décalés d'une semaine.

## Saga 2 : AI for Developers (technique, TypeScript en langage principal)

| # | Date | Chapitre | Contenu |
|---|------|----------|---------|
| 1 | 2027-01-25 | Anatomy of an LLM API Call | Tokens, contexte, température, streaming, latence, coût. Client minimal. |
| 2 | 2027-02-01 | Prompts as Code | Prompts versionnés et testables, sorties structurées (JSON Schema, Zod), retries. |
| 3 | 2027-02-08 | Tool Use: The Agent Loop by Hand | Appel de fonctions sans framework, gestion des erreurs d'outil. |
| 4 | 2027-02-15 | RAG, Revisited | Embeddings, chunking, recherche hybride, reranking. Suite de l'article RAG Python/Rust. |
| 5 | 2027-02-22 | Context Engineering | Quoi mettre dans le contexte. Cache de prompt, compaction, mémoire. |
| 6 | 2027-03-01 | Agents and MCP in Practice | Serveur MCP minimal, garde-fous, humain dans la boucle. |
| 7 | 2027-03-08 | Evals: Testing What You Can't Assert | Jeux de tests, régression, juge LLM et ses biais. |
| 8 | 2027-03-15 | Security: Injection, Secrets, Leaks | Injection de prompt, fuite de données, clés, bac à sable. |
| 9 | 2027-03-22 | Cost, Latency, Observability | Traces, budgets de tokens, limitation de débit, repli entre modèles. |
| 10 | 2027-03-29 | Capstone: Rebuilding the Site's Chat | Reconstruction de `app/api/chat/route.ts` avec les neuf chapitres. |

Réserves : vérifier noms de modèles, tarifs et limites dans la documentation officielle à chaque rédaction ; lire le code du chat avant d'annoncer le chapitre 10.

## Saga 3 : Security for Developers (cybersécurité, très technique)

| # | Date | Chapitre | Contenu |
|---|------|----------|---------|
| 1 | 2027-04-05 | Threat Modeling a Real App | DFD, STRIDE, arbres d'attaque, appliqués à une app Next.js. |
| 2 | 2027-04-12 | Web Vulnerabilities, Hands-On | OWASP Top 10 sur laboratoire local : exploitation puis correctif. |
| 3 | 2027-04-19 | Authentication Done Right | Argon2, sessions, OAuth 2.0 / OIDC, pièges JWT, passkeys. |
| 4 | 2027-04-26 | Cryptography for Engineers | TLS, AEAD, dérivation et rotation de clés, erreurs d'usage. |
| 5 | 2027-05-03 | Supply Chain Security | npm/pnpm, lockfiles, SBOM, SLSA, typosquatting, overrides pnpm du dépôt. |
| 6 | 2027-05-10 | Secrets and CI/CD Hardening | Secrets dans git, jetons OIDC, GitHub Actions, permissions minimales. |
| 7 | 2027-05-17 | Hardening a Linux Server and Its Containers | SSH, pare-feu, nginx, CSP, fail2ban, Docker non root. |
| 8 | 2027-05-24 | Memory Safety and Fuzzing | Failles mémoire, Rust, `cargo-fuzz`, lien avec le profileur Rust. |
| 9 | 2027-05-31 | Detection and Logging | Journalisation, corrélation, règles Sigma, détection sur son propre laboratoire. |
| 10 | 2027-06-07 | Incident Response, Attack and Defend | Playbook, preuves, post-mortem, laboratoire attaque et défense de bout en bout. |

Cadre : démonstrations offensives uniquement sur un laboratoire local appartenant à l'auteur (Juice Shop, DVWA dans Docker), jamais sur des cibles réelles ; chaque exploitation est accompagnée de sa détection et de son correctif ; pas de code d'attaque prêt à l'emploi ; divulgation responsable pour toute faille réelle ; chaque fait sur un incident public est vérifié dans une source citable. Renvois croisés avec les chapitres 8 et 9 de la saga 2 plutôt que répétition.
