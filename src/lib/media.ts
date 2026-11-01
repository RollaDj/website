import type { StaticImageData } from "next/image";

import heroCutout from "@/assets/rolla-trompette-detoure.png";
import djLounge from "@/assets/photos/dj-lounge.jpg";
import djMontagne from "@/assets/photos/dj-montagne.jpg";
import djNeon from "@/assets/photos/dj-neon.jpg";
import djPlatines from "@/assets/photos/dj-platines.jpg";
import djPleinAir from "@/assets/photos/dj-plein-air.jpg";
import duoSaxTrompette from "@/assets/photos/duo-sax-trompette.jpg";
import portraitApplique from "@/assets/photos/portrait-applique.jpg";
import sceneFestival from "@/assets/photos/scene-festival.jpg";
import trioCour from "@/assets/photos/trio-cour.jpg";
import trioPleinAir from "@/assets/photos/trio-plein-air.jpg";
import trompetteGala from "@/assets/photos/trompette-gala.jpg";
import trompetteScene from "@/assets/photos/trompette-scene.jpg";

export { heroCutout };

/**
 * Photos du site. Les textes alternatifs (FR/EN) sont dans les
 * dictionnaires, sous `photos`, avec les mêmes identifiants.
 */
export const photos = {
  trompetteScene,
  djPlatines,
  trompetteGala,
  sceneFestival,
  duoSaxTrompette,
  djLounge,
  trioPleinAir,
  djMontagne,
  trioCour,
  djNeon,
  portraitApplique,
  djPleinAir,
} satisfies Record<string, StaticImageData>;

export type PhotoId = keyof typeof photos;

/** Ordre de la pellicule (galerie). */
export const galleryOrder: PhotoId[] = [
  "djPlatines",
  "trompetteGala",
  "sceneFestival",
  "duoSaxTrompette",
  "djLounge",
  "trioPleinAir",
  "djMontagne",
  "trioCour",
  "djNeon",
  "portraitApplique",
  "djPleinAir",
  "trompetteScene",
];
