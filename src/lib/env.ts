/**
 * URL publique du site (URL canoniques, sitemap, Open Graph).
 *  1. NEXT_PUBLIC_SITE_URL (domaine définitif)
 *  2. URL de production fournie par Vercel
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
 * Indexation désactivée par défaut, pour ne pas concurrencer rolladj.com tant
 * que le nouveau site n'est pas en ligne sur le domaine définitif.
 * Passer ALLOW_INDEXING=true sur Vercel le jour de la bascule.
 */
export const isIndexingAllowed = () => process.env.ALLOW_INDEXING === "true";
