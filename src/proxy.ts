import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { pageFromSlug, pathFor } from "@/i18n/routes";

/**
 * Routage des langues :
 *  - URL sans langue (/, /contact…) → /fr/… ou /en/… selon le choix mémorisé
 *    (cookie), puis la langue du navigateur, puis le français ;
 *  - page traduite dans la mauvaise langue (/fr/weddings) → bonne adresse ;
 *  - page inconnue (/fr/xyz) → vraie erreur 404.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [first, slug, ...rest] = pathname.split("/").filter(Boolean);

  if (!first || !hasLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  if (slug && rest.length === 0 && !pageFromSlug(slug, first)) {
    for (const other of locales) {
      const page = pageFromSlug(slug, other);
      if (page) return NextResponse.redirect(new URL(pathFor(page, first), request.url), 308);
    }
    // Aucune route ne correspond à ce chemin : 404 globale (statut 404).
    return NextResponse.rewrite(new URL("/_/page/introuvable", request.url));
  }
}

function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((entry) => entry.lang && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    if (hasLocale(lang)) return lang;
  }
  return defaultLocale;
}

export const config = {
  // Ignore les fichiers internes de Next.js, les API et les fichiers statiques
  // (tout chemin contenant un point : .mp4, .jpg, .txt, .xml…).
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
