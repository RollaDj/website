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
  poster: string;
  status: MediaStatus;
  note: string;
};

/** Hero : vidéo de fond en boucle, sans son (scripts/prepare-media.sh hero). */
export const heroVideo: VideoMedia = {
  src: "/media/hero/hero.mp4",
  poster: "/media/hero/hero-poster.jpg",
  status: "placeholder",
  note: "Visuel abstrait généré (faisceaux, brume). À remplacer par une vidéo 16:9 de ROLLA, 8–15 s, en boucle.",
};

/**
 * « The Experience » : séquence synchronisée au scroll
 * (scripts/prepare-media.sh experience).
 * - ordinateur : vidéo optimisée pour le scrubbing ;
 * - mobile : séquence d'images (plus fluide sur téléphone).
 * `cues` : début/fin de chaque mot (RHYTHM, TRUMPET, ENERGY) en fraction
 * (0 → 1) de la séquence. À ajuster selon les images de la vraie vidéo.
 */
export const experienceMedia = {
  video: "/media/experience/experience.mp4",
  poster: "/media/experience/experience-poster.jpg",
  still: "/media/experience/experience-still.jpg",
  frames: {
    path: (index: number) => `/media/experience/mobile/f${String(index).padStart(4, "0")}.webp`,
    count: 90,
    width: 540,
    height: 960,
  },
  cues: [
    [0.11, 0.38],
    [0.4, 0.67],
    [0.7, 0.92],
  ] as [number, number][],
  status: "placeholder" as MediaStatus,
  note: "Séquence abstraite générée en 3 temps (rythme, trompette, énergie). À remplacer par la vidéo de ROLLA.",
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
