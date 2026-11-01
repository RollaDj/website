import type { Locale } from "./config";
import { locales } from "./config";

/**
 * Pages du site et leur adresse dans chaque langue.
 * Les URL sont traduites pour le référencement (/fr/mariage ↔ /en/weddings).
 */
export const pages = {
  home: { fr: "", en: "" },
  weddings: { fr: "mariage", en: "weddings" },
  legal: { fr: "mentions-legales", en: "legal-notice" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pages;

export function pathFor(page: PageKey, locale: Locale, hash?: string): string {
  const slug = pages[page][locale];
  return `/${locale}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Adresse de la même page dans chaque langue (sélecteur FR / EN, hreflang). */
export function alternatesFor(page: PageKey): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, pathFor(page, l)])) as Record<Locale, string>;
}

export function pageFromSlug(slug: string, locale: Locale): PageKey | undefined {
  return (Object.keys(pages) as PageKey[]).find((key) => key !== "home" && pages[key][locale] === slug);
}
