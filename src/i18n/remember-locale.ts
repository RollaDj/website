import { LOCALE_COOKIE, type Locale } from "./config";

/** Mémorise la langue choisie (cookie lu par src/proxy.ts). Côté navigateur uniquement. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
