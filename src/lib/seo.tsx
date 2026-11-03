import type { Metadata } from "next";

import { SOCIALS } from "@/content/site";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { alternatesFor, pathFor, type PageKey } from "@/i18n/routes";

import { getSiteUrl, isIndexingAllowed } from "./env";

/** Métadonnées complètes d'une page : titre, description, hreflang, Open Graph. */
export function buildMetadata(
  locale: Locale,
  page: Exclude<PageKey, never>,
  dict: Dictionary,
  options: { noindex?: boolean } = {},
): Metadata {
  const { title, description } = dict.meta[page];
  const alternates = alternatesFor(page);
  const indexable = isIndexingAllowed() && !options.noindex;

  return {
    metadataBase: getSiteUrl(),
    title,
    description,
    applicationName: "ROLLA",
    alternates: {
      canonical: pathFor(page, locale),
      languages: { ...alternates, "x-default": alternates.fr },
    },
    openGraph: {
      type: "website",
      siteName: "ROLLA",
      url: pathFor(page, locale),
      title,
      description,
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: !options.noindex && isIndexingAllowed() },
  };
}

/** Données structurées de l'artiste (schema.org). */
export function artistJsonLd(locale: Locale, dict: Dictionary) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": new URL("/#rolla", base).toString(),
    name: "ROLLA",
    alternateName: "Rolla DJ",
    url: new URL(pathFor("home", locale), base).toString(),
    image: new URL("/og-image.jpg", base).toString(),
    description: dict.meta.home.description,
    genre: ["House", "Electronic", "Live music"],
    foundingLocation: { "@type": "Place", name: "Lyon, France" },
    areaServed: ["FR", "Worldwide"],
    sameAs: SOCIALS.map((s) => s.href),
  };
}

export function weddingsJsonLd(locale: Locale, dict: Dictionary) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: dict.meta.weddings.title,
    description: dict.meta.weddings.description,
    serviceType: locale === "fr" ? "DJ de mariage avec trompette live" : "Wedding DJ with live trumpet",
    url: new URL(pathFor("weddings", locale), base).toString(),
    areaServed: [
      { "@type": "City", name: "Lyon" },
      { "@type": "Country", name: "France" },
    ],
    provider: { "@id": new URL("/#rolla", base).toString(), "@type": "MusicGroup", name: "ROLLA" },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
