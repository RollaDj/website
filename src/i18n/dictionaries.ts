import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import { frenchTypography } from "@/lib/typography";

import { hasLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/fr";

export type { Dictionary };

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("./dictionaries/fr").then((m) => frenchTypography(m.default)),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

/** Locale courante, lue depuis le segment racine `[lang]`. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}
