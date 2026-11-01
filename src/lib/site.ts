/**
 * Données globales du site ROLLA (indépendantes de la langue).
 */

export const SITE_NAME = "ROLLA";

/**
 * URL publique du site, utilisée pour les URLs canoniques, le sitemap
 * et les images Open Graph.
 *  1. NEXT_PUBLIC_SITE_URL (à définir sur Vercel une fois le domaine choisi)
 *  2. URL de production Vercel (fournie automatiquement par Vercel)
 *  3. localhost en développement
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}

/**
 * Indexation par les moteurs de recherche : désactivée par défaut pour ne pas
 * concurrencer le site actuel (rolladj.com) tant que le nouveau site n'est pas
 * en production sur le domaine définitif. Passer ALLOW_INDEXING=true sur Vercel
 * le jour de la bascule.
 */
export const isIndexingAllowed = () => process.env.ALLOW_INDEXING === "true";

/** E-mail de booking, découpé pour limiter la collecte automatique. */
export const BOOKING_EMAIL = { user: "booking", domain: "rolladj.com" } as const;

export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/rolla_dj/" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@rolladj7" },
  { id: "soundcloud", label: "SoundCloud", href: "https://soundcloud.com/rollamusic" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/p/Rolla-Dj-100057134003194/" },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];

/**
 * Le « film » synchronisé au défilement.
 * Pour remplacer la vidéo : voir scripts/encode-film.sh, puis reporter ici
 * les débuts de scène affichés par le script (fractions de la durée totale).
 */
export const FILM = {
  src: "/media/film/rolla-film.mp4",
  poster: "/media/film/rolla-film-poster.jpg",
  fps: 24,
  chapterStarts: [0, 0.345, 0.707],
} as const;

/** Références (affichées telles quelles, quelle que soit la langue). */
export const CLIENTS = [
  "Club Med",
  "Le Crillon Paris",
  "Marriott",
  "Novotel",
  "Courchevel",
  "Eurexpo Lyon",
  "Docks 40",
  "Le Petit Salon",
  "Hard Rock Café",
  "Delirium",
  "Circuit de Magny-Cours",
  "Mazda",
  "MGEN",
  "Amiens SC",
  "Del Arte",
  "Au Bureau",
  "Antonio e Marco",
  "F&K",
  "Flan",
  "Chamax",
] as const;
