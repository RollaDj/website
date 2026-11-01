# ROLLA — nouveau site officiel

Site de **ROLLA**, DJ & trompettiste basé à Lyon, en France et à l’international.
Direction artistique cinématographique et minimaliste : noir profond, blanc
cassé, anthracite, accent champagne. Le site est bilingue FR / EN et intègre
une expérience vidéo synchronisée au défilement.

> Le site actuel **rolladj.com** n’est pas modifié. Ses fichiers (`index.html`,
> `og-image (2).jpg`) restent à la racine du dépôt à titre de référence, ne
> sont pas servis par cette application et ne sont pas envoyés sur Vercel
> (`.vercelignore`).

## Démarrer

Prérequis : Node.js 22 (voir `.nvmrc`).

```bash
npm install
npm run dev            # http://localhost:3000 → /fr ou /en
```

| Commande | Rôle |
| --- | --- |
| `npm run dev` | développement |
| `npm run build` / `npm run start` | build et serveur de production |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `./scripts/prepare-media.sh …` | préparation des vidéos (voir plus bas) |

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack) + **TypeScript**
- **Tailwind CSS 4** — thème dans `src/app/globals.css`
- **GSAP 3.15 + ScrollTrigger + SplitText** (`@gsap/react`) — animations
- **Lenis** — défilement doux (désactivé si l’utilisateur réduit les animations)
- Police **Archivo** à largeur variable (étendue pour les titres, normale pour
  les textes), auto-hébergée via `next/font`
- Cible de déploiement : **Vercel**

## Pages

| Page | FR | EN |
| --- | --- | --- |
| Accueil | `/fr` | `/en` |
| Mariages | `/fr/mariage` | `/en/weddings` |
| Mentions légales & confidentialité | `/fr/mentions-legales` | `/en/legal-notice` |

Accueil, dans l’ordre : Hero → The Experience (scroll) → The Artist →
Live Formats → Selected Performances → Trusted By → Events & Bookings → Contact.

## Où modifier quoi (sans toucher aux composants)

| Quoi | Fichier |
| --- | --- |
| **Tous les textes** (menus, boutons, formulaires, métadonnées SEO) | `src/i18n/dictionaries/fr.ts` et `en.ts` |
| **Vidéos et photos** + statut de chaque média | `src/content/media.ts` |
| E-mail, réseaux sociaux, références « Trusted by » | `src/content/site.ts` |
| Avis (page Mariages) | `src/content/testimonials.ts` |
| Adresses des pages dans chaque langue | `src/i18n/routes.ts` |

`en.ts` est typé à partir de `fr.ts` : une traduction manquante fait échouer
`npm run typecheck`.

## Médias : ce qui est provisoire

Chaque média porte un statut dans `src/content/media.ts`. Tant que
`SHOW_MEDIA_TAGS = true`, une étiquette discrète le signale sur le site.

| Emplacement | État actuel | À fournir |
| --- | --- | --- |
| Hero (vidéo de fond) | **Provisoire** : visuel abstrait généré (faisceaux, brume), aucune image de prestation | Vidéo 16:9 de ROLLA, 8–15 s, boucle, sans son |
| The Experience (scroll) | **Provisoire** : séquence abstraite générée en 3 temps | Vidéo 16:9 (+ idéalement une version 9:16 pour mobile), 15–25 s |
| Portrait « The Artist » | Vraie photo du site actuel, 950 px | Portrait artistique HD (≥ 2000 px) |
| Visuels des 3 formats | Vraies photos du site actuel, 600 px de haut | Photos HD : DJ set, DJ × trompette, avec musiciens |
| Selected Performances | 3 vrais extraits du site actuel (720 px, filigrane Instagram sur l’un d’eux) + **3 emplacements réservés** | Extraits clubs/hôtels, événement de marque, musiciens invités |
| Page Mariages (en-tête) | Vraie photo du site actuel, 600 px de haut | Photo HD de mariage |
| Image de partage (`public/og-image.jpg`) | Générée à partir du hero provisoire | À régénérer avec les vrais visuels |

Aucune image ne représente ROLLA sans être une vraie photo de lui. Les visuels
abstraits ne figurent aucune prestation.

### Remplacer les vidéos

```bash
# Vidéo du hero
./scripts/prepare-media.sh hero ma-video-hero.mp4

# Séquence synchronisée au scroll (vidéo 16:9, version verticale facultative)
./scripts/prepare-media.sh experience ma-video-16x9.mp4 ma-video-9x16.mp4
```

Le script (ffmpeg) produit :

- une vidéo ordinateur optimisée pour le scrubbing (images-clés toutes les
  4 images, sans B-frames, sans son) ;
- une séquence d’images WebP pour mobile, plus fluide que la vidéo sur
  téléphone ;
- l’image d’attente et une image fixe pour le mode « animations réduites ».

Ensuite, dans `src/content/media.ts` :

1. passer `status` à `"final"` ;
2. reporter le nombre d’images mobile ;
3. ajuster `cues`, c’est-à-dire les moments (de 0 à 1) où apparaissent
   RHYTHM / TRUMPET / ENERGY, pour les caler sur les images.

Pour les galeries, déposer les vidéos dans `public/media/performances/` et les
déclarer dans `performances` (même fichier).

## L’expérience synchronisée au scroll

Composant : `src/components/home/experience.tsx`.

- La section est épinglée pendant 4 hauteurs d’écran (GSAP ScrollTrigger,
  `scrub`). La progression du scroll pilote l’image affichée. À l’arrêt du
  scroll, l’image s’arrête ; en remontant, elle revient en arrière.
- **Ordinateur** : vidéo chargée en mémoire (avec indicateur de progression),
  puis positionnée image par image.
- **Mobile / tactile** : séquence d’images dessinée sur `<canvas>`. Une image
  sur six est chargée en priorité pour un aperçu immédiat.
- Les trois mots apparaissent à des instants précis. Le cadre se referme
  ensuite pour enchaîner sur la section suivante.
- **Animations réduites** : version fixe et lisible, sans épinglage.
- Aucun son automatique, nulle part.

## Formulaire de contact

- Champs : nom, e-mail, type d’événement, date, lieu, message. Validation dans
  le navigateur et sur le serveur, avec les mêmes règles (`src/lib/contact.ts`).
- Envoi par une Server Action (`src/app/actions/contact.ts`) via l’API
  [Resend](https://resend.com). La réponse part directement à l’adresse du
  visiteur (`reply_to`).
- Antispam : champ piège invisible, durée minimale de saisie mesurée dans le
  navigateur, limite de 5 envois par 10 minutes et par IP.
- **Sans configuration**, le formulaire n’affiche aucune fausse confirmation :
  il indique que l’envoi n’a pas eu lieu et propose l’e-mail direct.

Pour l’activer :

1. Créer un compte Resend.
2. Vérifier le domaine `rolladj.com`.
3. Définir `RESEND_API_KEY`, `CONTACT_TO_EMAIL` et `CONTACT_FROM_EMAIL`
   (voir `.env.example`).

## Bilingue & SEO

- URL distinctes `/fr` et `/en`, avec des adresses traduites, des balises
  `hreflang` et un `sitemap.xml` qui inclut les alternatives de langue.
- Sélecteur FR / EN en haut à droite : il ouvre **la même page** dans l’autre
  langue, garde la section en cours et mémorise le choix (cookie
  `NEXT_LOCALE`).
- `/` redirige selon, dans l’ordre : le choix mémorisé, la langue du
  navigateur, puis le français par défaut.
- Métadonnées et Open Graph propres à chaque page et à chaque langue. Données
  structurées : `MusicGroup` sur l’accueil, `Service` sur la page Mariages.
- Redirections depuis d’anciennes adresses : `/index.html`, `/mariage`,
  `/weddings`, `/contact`… (`next.config.ts`). Les ancres de l’ancien site
  (`#about`, `#services`, `#gallery`, `#testimonials`, `#contact`) mènent aux
  nouvelles sections.
- Une page dans la mauvaise langue (`/fr/weddings`) redirige vers la bonne
  adresse ; une adresse inconnue renvoie une vraie erreur 404 (`src/proxy.ts`).

## Déploiement sur Vercel

1. Sur [vercel.com/new](https://vercel.com/new), importer ce dépôt :
   Next.js est détecté automatiquement.
2. Définir les variables d’environnement de `.env.example`, en gardant
   `ALLOW_INDEXING=false`. Les pages sont alors en `noindex` et `robots.txt`
   bloque l’indexation, pour ne pas concurrencer rolladj.com.
3. Chaque push crée un déploiement de prévisualisation.

**Le domaine rolladj.com n’est pas touché.** Le jour de la bascule, et
seulement avec votre accord :

1. Ajouter le domaine dans Vercel → Domains.
2. Passer `ALLOW_INDEXING=true` et
   `NEXT_PUBLIC_SITE_URL=https://www.rolladj.com`, puis redéployer.

## À compléter avant la mise en ligne

- [ ] Médias définitifs (tableau ci-dessus), puis `SHOW_MEDIA_TAGS = false`
- [ ] Mentions légales : éditeur, SIRET, adresse, directeur de publication
- [ ] Configuration Resend (formulaire)
- [ ] Relecture des textes FR / EN
- [ ] Confirmation des chiffres repris du site actuel (300+ concerts, 5+ pays)
