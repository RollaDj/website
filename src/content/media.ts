import type { StaticImageData } from "next/image";

import artistPortrait from "@/assets/rolla-trompette-detoure.png";
import djPlatines from "@/assets/photos/dj-platines.jpg";
import trioCour from "@/assets/photos/trio-cour.jpg";
import trioPleinAir from "@/assets/photos/trio-plein-air.jpg";
import trompetteScene from "@/assets/photos/trompette-scene.jpg";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  MÉDIAS DU SITE — fichier unique à modifier pour remplacer vidéos et photos
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  status :
 *   - "placeholder" : média provisoire (visuel abstrait ou emplacement vide).
 *   - "temporary"   : vrai média de ROLLA repris du site actuel, mais en
 *                     basse définition → à remplacer par une version HD.
 *   - "final"       : média définitif.
 *
 *  Tant que SHOW_MEDIA_TAGS vaut true, une petite étiquette signale sur le
 *  site chaque média non définitif. Passer à false pour la mise en ligne.
 */
export const SHOW_MEDIA_TAGS = true;

export type MediaStatus = "placeholder" | "temporary" | "final";
type Localized = { fr: string; en: string };

export type ImageMedia = {
  image: StaticImageData;
  alt: Localized;
  status: MediaStatus;
  note: string;
};

export type VideoMedia = {
  src: string;
  /** Version allégée pour mobile (facultative). */
  mobileSrc?: string;
  /** Première image (affichée avant la lecture). */
  poster: string;
  /** Image fixe (dernière image, ou si les animations sont réduites). */
  still?: string;
  /** Proportions d'origine : une vidéo verticale n'est jamais recadrée sur ordinateur. */
  orientation?: "portrait" | "landscape";
  /** Lecture en boucle (sinon : lue une fois puis arrêtée sur la dernière image). */
  loop?: boolean;
  status: MediaStatus;
  note: string;
};

/**
 * Vidéo détourée (fond transparent) : fichier « côte à côte » — couleur à
 * gauche, transparence à droite — recomposé en WebGL (compatible tous
 * navigateurs, Safari compris). Voir src/components/ui/cutout-video.tsx.
 */
export type CutoutMedia = {
  src: string;
  mobileSrc?: string;
  /** Première image détourée (WebP transparent). */
  poster: string;
  /** Image fixe détourée (animations réduites). */
  still: string;
  /** Début de la boucle (s) : l'introduction n'est jouée qu'une fois. */
  loopStart: number;
  /** Image détourée du début de la boucle (affichée avant la lecture). */
  loopPoster: string;
  alt: Localized;
  status: MediaStatus;
  note: string;
};

/**
 * Hero : ROLLA détouré, en grand. Montage de deux vidéos du dossier Drive
 * « Vidéos Hero » : arrivée face caméra et lunettes (5.mp4), raccord fondu,
 * puis boucle à la trompette (4.mp4) dont la fin se fond dans le début.
 */
export const heroCutout: CutoutMedia = {
  src: "/media/hero/rolla-cutout.mp4",
  mobileSrc: "/media/hero/rolla-cutout-mobile.mp4",
  poster: "/media/hero/rolla-cutout-poster.webp",
  still: "/media/hero/rolla-cutout-still.webp",
  loopStart: 5.68,
  loopPoster: "/media/hero/rolla-cutout-loop.webp",
  alt: {
    fr: "ROLLA s’avance, met ses lunettes de soleil puis joue de la trompette",
    en: "ROLLA walks in, puts on his sunglasses, then plays the trumpet",
  },
  status: "final",
  note: "Détourage (Robust Video Matting) et montage de 5.mp4 + 4.mp4 ; 1080×1920 (+ 720×1280 mobile).",
};

/**
 * Hero, première image : ROLLA derrière ses platines (photo détourée).
 * Au défilement, elle se fond dans la vidéo détourée à la trompette
 * (`heroCutout`, début de la boucle), les deux têtes superposées.
 * Pour la remplacer : `python3 scripts/hero-decks.py photo.jpg --model …`
 * (détourage, export, calage), puis reporter `width`, `height` et `fit`
 * affichés (voir README, « Hero : platines → trompette »).
 */
export const heroDecks = {
  src: "/media/hero/rolla-decks.webp",
  width: 591,
  height: 600,
  /**
   * Calage sur l'image de début de boucle de la vidéo trompette, en fractions
   * du cadre vidéo (9:16) : largeur de la photo, position de son bord gauche
   * et de son bord haut. Têtes superposées à 90 % (IoU).
   */
  fit: { width: 1.34, left: -0.15, top: 0.1861 },
  alt: {
    fr: "ROLLA derrière ses platines, casque autour du cou",
    en: "ROLLA behind the decks, headphones around his neck",
  } satisfies Localized,
  status: "temporary" as MediaStatus,
  note: "Photo du site actuel (591 × 600 px), détourée. Remplacer par une photo HD derrière les platines (≥ 1600 px de haut, fond uni).",
};

/**
 * « The Experience » : séquence synchronisée au scroll — ROLLA à la trompette
 * (dossier Drive « Vidéos Hero », fichier 4.mp4).
 * Préparée avec : scripts/prepare-media.sh experience 4.mp4
 * - ordinateur : vidéo optimisée pour le scrubbing (image-clé toutes les 4 images) ;
 * - mobile : séquence de 120 images (plus fluide sur téléphone).
 * `cues` : début/fin de chaque mot (RHYTHM, TRUMPET, ENERGY) en fraction
 * (0 → 1) de la séquence.
 */
export const experienceMedia = {
  video: "/media/experience/experience.mp4",
  poster: "/media/experience/experience-poster.jpg",
  still: "/media/experience/experience-still.jpg",
  orientation: "portrait" as "portrait" | "landscape",
  frames: {
    path: (index: number) => `/media/experience/mobile/f${String(index).padStart(4, "0")}.webp`,
    count: 120,
    width: 720,
    height: 1280,
  },
  cues: [
    [0.1, 0.37],
    [0.4, 0.66],
    [0.69, 0.92],
  ] as [number, number][],
  status: "final" as MediaStatus,
  note: "Source : 4.mp4 (4K vertical 2160×3840, 25 i/s, 15,4 s) → 1080×1920 (ordinateur) et 120 images 720×1280 (mobile).",
};

/** Section « The Artist ». */
export const artistPortraitMedia: ImageMedia = {
  image: artistPortrait,
  alt: {
    fr: "ROLLA à la trompette, en manteau ivoire, sur fond noir",
    en: "ROLLA playing the trumpet in an ivory coat, on a black background",
  },
  status: "temporary",
  note: "Photo du site actuel (950 px). Remplacer par un portrait artistique HD (≥ 2000 px).",
};

/** Section « Live formats » : un visuel par format. */
export const formatMedia: Record<"dj-set" | "dj-trumpet" | "dj-live", ImageMedia> = {
  "dj-set": {
    image: djPlatines,
    alt: { fr: "ROLLA aux platines", en: "ROLLA at the decks" },
    status: "temporary",
    note: "Photo du site actuel (600 px de haut). Remplacer par une photo HD de DJ set.",
  },
  "dj-trumpet": {
    image: trompetteScene,
    alt: { fr: "ROLLA à la trompette sur scène", en: "ROLLA playing the trumpet on stage" },
    status: "temporary",
    note: "Photo du site actuel (600 px de haut). Remplacer par une photo HD DJ × trompette.",
  },
  "dj-live": {
    image: trioCour,
    alt: {
      fr: "Formation live avec saxophone et percussions",
      en: "Live line-up with saxophone and percussion",
    },
    status: "temporary",
    note: "Photo du site actuel (600 px de haut). Remplacer par une photo HD avec musiciens.",
  },
};

/** Page Mariages : visuel d'en-tête. */
export const weddingsHeroMedia: ImageMedia = {
  image: trioPleinAir,
  alt: {
    fr: "Formation live en blanc avec trompette et saxophone, en plein air",
    en: "Live line-up dressed in white with trumpet and saxophone, outdoors",
  },
  status: "temporary",
  note: "Photo du site actuel (600 px de haut). Remplacer par une photo HD de mariage.",
};

/**
 * « Selected performances » : galerie vidéo.
 * Les trois premières vidéos sont de vrais extraits du site actuel.
 * Les entrées sans `video` sont des emplacements réservés (rien n'est inventé).
 */
export type Performance = {
  id: string;
  category: Localized;
  title: Localized;
  video?: VideoMedia;
  /** Format de la vidéo (pour la fenêtre plein écran). */
  orientation?: "portrait" | "landscape";
};

export const performances: Performance[] = [
  {
    id: "club-dj-set",
    category: { fr: "DJ set", en: "DJ set" },
    title: { fr: "En club", en: "In the club" },
    orientation: "portrait",
    video: {
      src: "/media/performances/club-dj-set.mp4",
      poster: "/media/performances/club-dj-set-poster.jpg",
      status: "temporary",
      note: "Extrait du site actuel (720 px, filigrane Instagram).",
    },
  },
  {
    id: "live-trumpet-room",
    category: { fr: "DJ × Trompette", en: "DJ × Trumpet" },
    title: { fr: "Au cœur du public", en: "Among the guests" },
    orientation: "portrait",
    video: {
      src: "/media/performances/live-trumpet-room.mp4",
      poster: "/media/performances/live-trumpet-room-poster.jpg",
      status: "temporary",
      note: "Extrait du site actuel (720 px).",
    },
  },
  {
    id: "open-air-stage",
    category: { fr: "DJ × Trompette", en: "DJ × Trumpet" },
    title: { fr: "Scène en plein air", en: "Open-air stage" },
    orientation: "portrait",
    video: {
      src: "/media/performances/open-air-stage.mp4",
      poster: "/media/performances/open-air-stage-poster.jpg",
      status: "temporary",
      note: "Extrait du site actuel (720 px).",
    },
  },
  {
    id: "club-hotel",
    category: { fr: "Clubs & hôtels", en: "Clubs & hotels" },
    title: { fr: "Emplacement réservé", en: "Reserved slot" },
  },
  {
    id: "brand-event",
    category: { fr: "Événement de marque", en: "Brand event" },
    title: { fr: "Emplacement réservé", en: "Reserved slot" },
  },
  {
    id: "guest-musicians",
    category: { fr: "Musiciens invités", en: "Guest musicians" },
    title: { fr: "Emplacement réservé", en: "Reserved slot" },
  },
];
