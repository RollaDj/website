import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { alternatesFor, pathFor, type PageKey } from "@/i18n/routes";
import { getSiteUrl } from "@/lib/env";

const PRIORITY: Record<PageKey, number> = { home: 1, weddings: 0.8, legal: 0.2 };

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();

  return (Object.keys(PRIORITY) as PageKey[]).flatMap((page) =>
    locales.map((locale) => ({
      url: url(pathFor(page, locale)),
      changeFrequency: "monthly" as const,
      priority: PRIORITY[page],
      alternates: {
        languages: Object.fromEntries(Object.entries(alternatesFor(page)).map(([l, p]) => [l, url(p)])),
      },
    })),
  );
}
