import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();

  return locales.map((locale) => ({
    url: url(`/${locale}`),
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, url(`/${l}`)])),
    },
  }));
}
