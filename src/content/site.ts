/**
 * ROLLA — informations générales du site.
 * Tout ce qui ne dépend pas de la langue se modifie ici.
 */

export const SITE = {
  name: "ROLLA",
  city: "Lyon",
  country: "France",
  /** E-mail de booking, découpé pour limiter la collecte automatique. */
  email: { user: "booking", domain: "rolladj.com" },
} as const;

export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/rolla_dj/" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@rolladj7" },
  { id: "soundcloud", label: "SoundCloud", href: "https://soundcloud.com/rollamusic" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/p/Rolla-Dj-100057134003194/" },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];

/**
 * « Trusted by » — références reprises telles quelles du site actuel
 * (rolladj.com). N'ajouter que des collaborations réelles.
 */
export const TRUSTED_BY = [
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
