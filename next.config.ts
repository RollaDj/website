import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // 404 globale pour les URLs hors /fr et /en (layout racine sous [lang]).
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  /** Anciennes adresses (site actuel / liens externes) → nouvelles pages. */
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.htm", destination: "/", permanent: true },
      { source: "/:path(mariage|mariages|dj-mariage|dj-mariage-lyon)", destination: "/fr/mariage", permanent: true },
      { source: "/:path(wedding|weddings|wedding-dj)", destination: "/en/weddings", permanent: true },
      { source: "/:path(contact|booking|reservation)", destination: "/#contact", permanent: true },
      { source: "/:path(mentions-legales|legal|legal-notice)", destination: "/fr/mentions-legales", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Médias (vidéos, images) : mis en cache une semaine.
        // Renommer le fichier lors d'un remplacement pour forcer la mise à jour.
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
