import type { MetadataRoute } from "next";

import { getSiteUrl, isIndexingAllowed } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    // Site en préparation : on ne concurrence pas rolladj.com dans les moteurs.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
