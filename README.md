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

Accueil, dans l’ordre : Hero → The Experience (scroll) → The Artist → En images →
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
| Hero | ✅ **Définitif** : ROLLA **détouré** (fond transparent), montage de `5.mp4` (arrivée, lunettes) + `4.mp4` (trompette, en boucle) | — |
| The Experience (scroll) | ✅ **Définitif** : `4.mp4` (dossier Drive « Vidéos Hero ») — ROLLA à la trompette. 4K vertical → 1080×1920 (scrub) + 120 images 720×1280 (mobile) | Plus tard, éventuellement : un plan DJ pour « THE RHYTHM » |
| Portrait « The Artist » | ✅ **Définitif** : photo HD du dossier Drive « Photos » (tapis rouge, trompette) | — |
| En images (galerie) | ✅ **Définitif** : 7 photos HD du dossier Drive (scène, invités, altitude, platines, piste) | — |
| Visuels des 3 formats | ✅ **Définitif** : photos HD du dossier Drive (platines, trompette en cabine, duo avec saxophone) | — |
| Selected Performances | 3 vrais extraits du site actuel (720 px, filigrane Instagram sur l’un d’eux) + **3 emplacements réservés** | Extraits clubs/hôtels, événement de marque, musiciens invités |
| Événements & réservations | ✅ **Définitif** : une photo HD par contexte (projecteurs, scène, invités) | — |
| Page Mariages | ✅ **Définitif** : en-tête et bandeau de 3 photos HD du dossier Drive | — |
| Image de partage (`public/og-image.jpg`) | Capture du hero avec la vraie vidéo | — |

Aucune vidéo fictive n’est utilisée : le hero et la séquence au scroll
utilisent les vraies vidéos de ROLLA.

### Logo

Le logo DJ ROLLA (fichier fourni : `src/assets/brand/logo-dj-rolla-source.png`)
a été vectorisé. Le SVG est identique à l’original à 99,5 %, et reste net à
toute taille.

- `public/brand/logo-dj-rolla.svg` : fichier autonome, ivoire `#F2E7D6`.
- `src/components/ui/logo-dj-rolla.tsx` : composant React en `currentColor`.
  Le « DJ » et chaque lettre de « ROLLA » sont des éléments séparés, ce qui
  permet de les animer.

### Hero détouré

ROLLA apparaît en grand, sans fond, **devant** le logo DJ ROLLA centré : sa
silhouette passe devant le cœur du logo, ce qui crée un effet de profondeur à
la manière d’une couverture de magazine. Le tout est posé sur un halo
champagne.

Le logo occupe **toute la largeur** de la page (aux marges près). Sur
ordinateur, il est plus haut que l’écran : le bas du D et du J passe sous le
texte, dans le dégradé sombre. Sa largeur n’est réduite que sur les écrans
peu hauts par rapport à leur largeur (par exemple un portable 1280 × 720 :
87 % de la largeur), pour que la ligne « ROLLA » ne touche jamais le texte
du bas.

- **Détourage** : [Robust Video Matting](https://github.com/PeterL1n/RobustVideoMatting)
  (modèle ResNet-50), image par image, avec continuité temporelle (pas de
  scintillement). La trompette est conservée. À l’intérieur de la
  silhouette, ce sont les couleurs d’origine.
- **Montage** : arrivée face caméra et mise des lunettes (5.mp4, 5 s), raccord
  fondu où la silhouette de la trompette part de la même taille et de la même
  position, puis boucle à la trompette (4.mp4) dont la fin se fond dans le
  début. L’introduction n’est jouée qu’une fois.
- **Format** : vidéo H.264 « côte à côte » (couleur à gauche, transparence à
  droite) recomposée en WebGL par `src/components/ui/cutout-video.tsx`. Ce
  format fonctionne sur tous les navigateurs, Safari et iPhone compris, ce que
  ne permet pas une vidéo WebM transparente. Une image WebP transparente
  s’affiche avant la lecture, ou à la place de la vidéo si les animations sont
  réduites.

### Photos

Les photos viennent du dossier Drive « Photos ». Elles sont exportées dans
`src/assets/photos/` en sRGB, **sans métadonnées** (les coordonnées GPS des
photos d’iPhone sont retirées), aux proportions d’origine, côté le plus long
limité à 2 400 px (2 880 px pour l’en-tête Mariages). Next.js sert ensuite
des versions AVIF/WebP à la bonne taille. Les noms de fichiers sont neutres et
les légendes ne décrivent que ce que montre la photo : aucun lieu, client ou
invité n’est nommé. L’image générée du dossier (« ChatGPT Image… ») n’est pas
utilisée.

Direction artistique : photos en noir et blanc légèrement teinté (ivoire),
fidèle à la palette du site, et la couleur aux moments clés :

- **En images** (accueil, après « L’artiste ») : galerie horizontale. Sur
  ordinateur, la section reste en place et les photos défilent au rythme du
  défilement. Chaque photo passe en couleur en traversant le centre de
  l’écran, avec un léger parallaxe, et une ligne de progression suit le
  parcours. Sur mobile, tablette ou si les animations sont réduites : bande
  à faire glisser (ou flèches du clavier), photos en couleur.
- **Événements & réservations** : chaque carte porte une photo en noir et
  blanc, qui passe en couleur au survol ou au focus clavier.
- **Page Mariages** : en-tête en noir et blanc, puis trois photos en couleur.

Pour changer une photo : remplacer le fichier dans `src/assets/photos/` (ou
en ajouter un et l’importer), puis ajuster l’entrée correspondante dans
`src/content/media.ts` (texte alternatif FR/EN, `focus` pour le cadrage).

### Vidéos verticales

Les vidéos 9:16 gardent leurs proportions :

- **Écran large (paysage)** : vidéo entière dans un cadre 9:16 à droite, sans
  aucun recadrage. Le texte est à gauche, sur un fond d’ambiance flouté. Le
  hero et la séquence au scroll partagent le même cadre, d’où une continuité
  visuelle.
- **Écran en hauteur (mobile, tablette)** : vidéo en plein cadre. Seuls les
  bords latéraux sont légèrement rognés sur les téléphones plus allongés que
  9:16.
- Le script choisit la mise en page selon `orientation` dans
  `src/content/media.ts`. Une future vidéo horizontale s’affichera en plein
  écran sur ordinateur.

### Remplacer les vidéos

```bash
# Vidéo du hero (lue une fois, puis arrêtée sur la dernière image)
./scripts/prepare-media.sh hero 5.mp4

# Séquence synchronisée au scroll (version mobile séparée facultative)
./scripts/prepare-media.sh experience 4.mp4
```

Le script (ffmpeg) respecte les proportions et la cadence d’origine, ne
recadre pas, n’agrandit jamais et retire le son. Il produit :

- pour le hero : une version ordinateur (côté le plus long ≤ 1920 px), une
  version mobile (≤ 1280 px), la première et la dernière image ;
- pour le scroll : une vidéo optimisée pour le scrubbing (une image-clé
  toutes les 4 images, sans B-frames ; les vidéos de caméra n’en ont qu’une
  toutes les 2 s environ) ;
- pour le mobile : une séquence de 120 images WebP, plus fluide que la vidéo
  sur téléphone ;
- l’image fixe affichée en mode « animations réduites ».

Ensuite, dans `src/content/media.ts` :

1. passer `status` à `"final"` ;
2. reporter le nombre et la taille des images mobile ;
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

- [x] Vidéos du hero et de la séquence au scroll
- [ ] Vidéos HD de la galerie « Performances » (tableau ci-dessus), puis `SHOW_MEDIA_TAGS = false`
- [ ] Mentions légales : éditeur, SIRET, adresse, directeur de publication
- [ ] Configuration Resend (formulaire)
- [ ] Relecture des textes FR / EN
- [ ] Confirmation des chiffres repris du site actuel (300+ concerts, 5+ pays)
