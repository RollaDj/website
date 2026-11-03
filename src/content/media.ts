import type { StaticImageData } from "next/image";

import evenementInvitesDanse from "@/assets/photos/evenement-invites-danse.jpg";
import evenementProjecteurs from "@/assets/photos/evenement-projecteurs.jpg";
import evenementSceneEcran from "@/assets/photos/evenement-scene-ecran.jpg";
import galerieAltitudePlatines from "@/assets/photos/galerie-altitude-platines.jpg";
import galerieAltitudeTrompette from "@/assets/photos/galerie-altitude-trompette.jpg";
import galerieCabineFenetres from "@/assets/photos/galerie-cabine-fenetres.jpg";
import galerieCoeurFete from "@/assets/photos/galerie-coeur-fete.jpg";
import galerieInvitesTrompette from "@/assets/photos/galerie-invites-trompette.jpg";
import galeriePiste from "@/assets/photos/galerie-piste.jpg";
import galerieSceneViolet from "@/assets/photos/galerie-scene-violet.jpg";
import mariageAmbiance from "@/assets/photos/mariage-ambiance.jpg";
import mariageInvitesTrompette from "@/assets/photos/mariage-invites-trompette.jpg";
import mariageSourire from "@/assets/photos/mariage-sourire.jpg";
import mariageTrompetteLive from "@/assets/photos/mariage-trompette-live.jpg";
import rollaDuoSaxophone from "@/assets/photos/rolla-duo-saxophone.jpg";
import rollaPlatinesFenetres from "@/assets/photos/rolla-platines-fenetres.jpg";
import rollaTapisRouge from "@/assets/photos/rolla-tapis-rouge.jpg";
import rollaTrompetteCabine from "@/assets/photos/rolla-trompette-cabine.jpg";

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
  /** Point d'intérêt pour le recadrage (CSS object-position), ex. "50% 30%". */
  focus?: string;
};

/** Photos fournies (dossier Drive « Photos ») : exportées en sRGB, sans métadonnées (GPS retiré), proportions d’origine. */
const DRIVE = "Photo du dossier Drive « Photos »";

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
  alt: {
    fr: "ROLLA s’avance, met ses lunettes de soleil puis joue de la trompette",
    en: "ROLLA walks in, puts on his sunglasses, then plays the trumpet",
  },
  status: "final",
  note: "Détourage (Robust Video Matting) et montage de 5.mp4 + 4.mp4 ; 1080×1920 (+ 720×1280 mobile).",
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
  image: rollaTapisRouge,
  alt: {
    fr: "ROLLA s’avance sur un tapis rouge, trompette à la main, souriant",
    en: "ROLLA walking down a red carpet, trumpet in hand, smiling",
  },
  status: "final",
  note: `${DRIVE} (8758_940429_131.jpg).`,
  focus: "50% 35%",
};

/** Section « Live formats » : un visuel par format. */
export const formatMedia: Record<"dj-set" | "dj-trumpet" | "dj-live", ImageMedia> = {
  "dj-set": {
    image: rollaPlatinesFenetres,
    alt: { fr: "ROLLA aux platines, souriant, devant de grandes fenêtres", en: "ROLLA at the decks, smiling, in front of tall windows" },
    status: "final",
    note: DRIVE,
    focus: "50% 40%",
  },
  "dj-trumpet": {
    image: rollaTrompetteCabine,
    alt: { fr: "ROLLA joue de la trompette derrière sa cabine DJ", en: "ROLLA playing the trumpet behind his DJ booth" },
    status: "final",
    note: DRIVE,
    focus: "45% 40%",
  },
  "dj-live": {
    image: rollaDuoSaxophone,
    alt: {
      fr: "ROLLA, trompette à la main, aux côtés d’une saxophoniste",
      en: "ROLLA with his trumpet, alongside a saxophonist",
    },
    status: "final",
    note: DRIVE,
    focus: "50% 30%",
  },
};

/**
 * « En images » : galerie horizontale (accueil). Légendes descriptives
 * uniquement (ce que montre la photo) : aucun lieu ni client n'est nommé.
 */
export type GalleryPhoto = ImageMedia & {
  id: string;
  caption: Localized;
  /** Taille dans la galerie : portrait haut, carré, paysage. */
  shape: "portrait" | "square" | "landscape";
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "scene",
    image: galerieSceneViolet,
    shape: "portrait",
    caption: { fr: "Sur scène", en: "On stage" },
    alt: { fr: "ROLLA joue de la trompette sur scène, sous une lumière violette", en: "ROLLA playing the trumpet on stage, under purple light" },
    status: "final",
    note: DRIVE,
  },
  {
    id: "invites",
    image: galerieInvitesTrompette,
    shape: "landscape",
    caption: { fr: "Au milieu des invités", en: "Among the guests" },
    alt: { fr: "ROLLA joue de la trompette au milieu des invités", en: "ROLLA playing the trumpet among the guests" },
    status: "final",
    note: DRIVE,
    focus: "60% 40%",
  },
  {
    id: "altitude-platines",
    image: galerieAltitudePlatines,
    shape: "square",
    caption: { fr: "En altitude", en: "At altitude" },
    alt: {
      fr: "ROLLA aux platines en plein air, face aux montagnes enneigées",
      en: "ROLLA at the decks outdoors, facing snowy mountains",
    },
    status: "final",
    note: DRIVE,
  },
  {
    id: "coeur-fete",
    image: galerieCoeurFete,
    shape: "portrait",
    caption: { fr: "Au cœur de la fête", en: "In the thick of it" },
    alt: { fr: "ROLLA, trompette levée, entouré d’invités", en: "ROLLA, trumpet raised, surrounded by guests" },
    status: "final",
    note: DRIVE,
    focus: "60% 30%",
  },
  {
    id: "cabine",
    image: galerieCabineFenetres,
    shape: "landscape",
    caption: { fr: "Aux platines", en: "At the decks" },
    alt: { fr: "ROLLA derrière sa cabine DJ, devant de grandes fenêtres", en: "ROLLA behind his DJ booth, in front of tall windows" },
    status: "final",
    note: DRIVE,
  },
  {
    id: "altitude-trompette",
    image: galerieAltitudeTrompette,
    shape: "square",
    caption: { fr: "En plein air", en: "Open air" },
    alt: { fr: "ROLLA joue de la trompette face aux sommets enneigés", en: "ROLLA playing the trumpet facing snowy peaks" },
    status: "final",
    note: DRIVE,
  },
  {
    id: "piste",
    image: galeriePiste,
    shape: "portrait",
    caption: { fr: "Sur la piste", en: "On the dance floor" },
    alt: { fr: "ROLLA traverse la piste, trompette à la main, au milieu des danseurs", en: "ROLLA crossing the dance floor, trumpet in hand, among dancers" },
    status: "final",
    note: DRIVE,
    focus: "50% 30%",
  },
];

/** « Événements & réservations » : un visuel par contexte. */
export const bookingsMedia: Record<"club" | "corporate" | "private", ImageMedia> = {
  club: {
    image: evenementProjecteurs,
    alt: { fr: "ROLLA à la trompette sous les projecteurs", en: "ROLLA playing the trumpet under spotlights" },
    status: "final",
    note: DRIVE,
    focus: "60% 35%",
  },
  corporate: {
    image: evenementSceneEcran,
    alt: {
      fr: "ROLLA sur scène, trompette à la main, devant un écran lumineux",
      en: "ROLLA on stage, trumpet in hand, in front of a bright screen",
    },
    status: "final",
    note: DRIVE,
    focus: "45% 30%",
  },
  private: {
    image: evenementInvitesDanse,
    alt: { fr: "ROLLA joue de la trompette au milieu des invités qui dansent", en: "ROLLA playing the trumpet among dancing guests" },
    status: "final",
    note: DRIVE,
    focus: "50% 30%",
  },
};

/** Page Mariages : visuel d'en-tête. */
export const weddingsHeroMedia: ImageMedia = {
  image: mariageInvitesTrompette,
  alt: {
    fr: "ROLLA joue de la trompette au milieu des invités d’un mariage",
    en: "ROLLA playing the trumpet among wedding guests",
  },
  status: "final",
  note: DRIVE,
  focus: "55% 35%",
};

/** Page Mariages : bandeau de trois photos. */
export const weddingsPhotos: ImageMedia[] = [
  {
    image: mariageSourire,
    alt: { fr: "ROLLA sourit, trompette à la main, entouré d’invités", en: "ROLLA smiling, trumpet in hand, surrounded by guests" },
    status: "final",
    note: DRIVE,
    focus: "50% 30%",
  },
  {
    image: mariageAmbiance,
    alt: { fr: "ROLLA au milieu des invités, trompette à la main", en: "ROLLA among the guests, trumpet in hand" },
    status: "final",
    note: DRIVE,
  },
  {
    image: mariageTrompetteLive,
    alt: { fr: "ROLLA joue de la trompette, au cœur de la soirée", en: "ROLLA playing the trumpet, in the middle of the party" },
    status: "final",
    note: DRIVE,
    focus: "60% 30%",
  },
];

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
