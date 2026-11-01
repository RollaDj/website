export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

/** Langue par défaut : le français (artiste basé à Lyon). */
export const defaultLocale: Locale = "fr";

/** Cookie mémorisant le choix explicite de langue du visiteur. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const otherLocale = (locale: Locale): Locale =>
  locale === "fr" ? "en" : "fr";

/** Métadonnées utiles pour Open Graph / formats de date. */
export const localeMeta: Record<Locale, { og: string; intl: string; label: string }> = {
  fr: { og: "fr_FR", intl: "fr-FR", label: "Français" },
  en: { og: "en_GB", intl: "en-GB", label: "English" },
};
