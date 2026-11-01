# ROLLA — site officiel

Nouveau site de **ROLLA**, DJ & trompettiste basé à Lyon.
Esthétique cinématographique noir & ivoire, bilingue FR / EN, avec un « film »
vidéo qui avance au rythme du défilement de la page.

> Le site actuel **rolladj.com** n’est pas modifié. Ses fichiers (`index.html`,
> `og-image (2).jpg`) restent à la racine du dépôt à titre de référence : ils ne
> sont ni servis par l’application Next.js, ni envoyés sur Vercel
> (voir `.vercelignore`).

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Cache Components, Turbopack
- TypeScript
- Tailwind CSS v4 (thème déclaré dans `src/app/globals.css`)
- Polices via `next/font` : Instrument Serif (titres), Geist et Geist Mono
- Aucune librairie d’animation : scroll natif, CSS et `requestAnimationFrame`

## Démarrer

Prérequis : Node.js 22 (voir `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000 → redirige vers /fr ou /en
```

| Commande             | Rôle                                         |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | serveur de développement                     |
| `npm run build`      | build de production                          |
| `npm run start`      | sert le build de production                  |
| `npm run lint`       | ESLint                                       |
| `npm run typecheck`  | vérification TypeScript                      |
| `npm run encode-film -- a.mp4 b.mp4 c.mp4` | ré-encode le film (voir plus bas) |

## Structure

```
src/
├── app/
│   ├── [lang]/            # /fr et /en — layout racine, page d’accueil, 404
│   ├── global-not-found.tsx
│   ├── globals.css        # thème noir & ivoire, grain, animations
│   ├── icon.svg           # favicon
│   ├── robots.ts / sitemap.ts
├── components/            # sections de la page (hero, film, artiste…)
├── i18n/
│   ├── config.ts          # langues disponibles, langue par défaut
│   ├── dictionaries/      # fr.ts (référence) et en.ts
│   └── dictionaries.ts    # chargement du dictionnaire selon /[lang]
├── lib/
│   ├── site.ts            # réseaux sociaux, e-mail, références, réglages du film
│   ├── media.ts           # photos (imports statiques optimisés)
│   └── reviews.ts         # avis Mariages.net
├── assets/                # photos sources
└── proxy.ts               # redirection / → /fr ou /en
public/
├── media/film/            # vidéo du film + image d’attente (poster)
└── og-image.jpg           # image de partage réseaux sociaux
scripts/encode-film.sh     # encodage de la vidéo synchronisée au scroll
```

## Bilingue FR / EN

- Chaque langue a son URL : `/fr` et `/en` (bon pour le référencement, balises
  `hreflang` générées automatiquement).
- `/` redirige selon, dans l’ordre : le choix mémorisé du visiteur (cookie
  `NEXT_LOCALE`, posé par le sélecteur FR / EN), la langue du navigateur,
  puis le français par défaut.
- **Modifier un texte** : `src/i18n/dictionaries/fr.ts` et `en.ts`.
  `en.ts` est typé à partir de `fr.ts` : une clé oubliée fait échouer le build.
- La typographie française (espaces insécables avant `: ; ! ?`) est appliquée
  automatiquement.

## Le film synchronisé au défilement

Composant : `src/components/scroll-film.tsx`.

La section mesure plusieurs hauteurs d’écran ; son contenu reste fixe pendant
que la progression du scroll pilote `video.currentTime`. La vidéo est chargée
en mémoire pour un positionnement instantané, le temps est lissé pour un rendu
fluide, et la boucle ne tourne que lorsque la section est visible. Un timecode,
l’index des trois scènes et une barre de progression suivent la lecture.

La vidéo actuelle est un **montage provisoire** réalisé à partir des trois clips
du site actuel (DJ en club, trompette en soirée, scène en plein air).

### Remplacer la vidéo

1. Préparer 3 clips (une scène chacun), idéalement en format vertical 9:16.
2. Lancer (nécessite `ffmpeg`) :
   ```bash
   npm run encode-film -- scene1.mp4 scene2.mp4 scene3.mp4
   ```
   Le script assemble les clips avec des fondus au noir, applique l’étalonnage
   noir & ivoire et encode une vidéo optimisée pour le scrub (24 i/s,
   images-clés rapprochées, sans audio).
3. Reporter les débuts de scène affichés par le script dans
   `FILM.chapterStarts` (`src/lib/site.ts`).
4. Les textes des scènes sont dans les dictionnaires (`film.chapters`).

Astuce : les médias de `/media` sont mis en cache une semaine ; en cas de
remplacement, renommer le fichier (et mettre à jour `FILM.src`) force la mise
à jour chez les visiteurs.

## Déploiement sur Vercel

Le projet est prêt à être importé tel quel :

1. Sur [vercel.com/new](https://vercel.com/new), importer ce dépôt GitHub.
   Le framework Next.js est détecté automatiquement (`vercel.json`), aucun
   réglage de build n’est nécessaire.
2. Variables d’environnement (Project → Settings → Environment Variables),
   voir `.env.example` :
   - `NEXT_PUBLIC_SITE_URL` — URL définitive (facultatif au début).
   - `ALLOW_INDEXING` — laisser **`false`** tant que le nouveau site ne
     remplace pas rolladj.com : les pages sont alors en `noindex` et
     `robots.txt` bloque l’indexation, pour ne pas concurrencer le site actuel.
3. Chaque push crée un déploiement de prévisualisation ; la branche de
   production (par défaut `main`) alimente l’URL de production `*.vercel.app`.

### Le jour de la bascule

1. Dans Vercel → Settings → Domains, ajouter `rolladj.com` / `www.rolladj.com`
   et suivre les instructions DNS.
2. Passer `ALLOW_INDEXING=true` et `NEXT_PUBLIC_SITE_URL=https://www.rolladj.com`,
   puis redéployer.

## À compléter

- Vidéo définitive du film (la vidéo provisoire porte un filigrane Instagram
  d’origine).
- Photos en haute définition (les photos actuelles proviennent du site existant
  et sont en 600 px de haut).
- Relecture des textes FR / EN.
