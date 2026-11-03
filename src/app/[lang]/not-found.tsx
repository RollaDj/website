import { lang } from "next/root-params";

import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pathFor } from "@/i18n/routes";

export default async function NotFound() {
  const raw = await lang();
  const locale = hasLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-svh flex-col items-start justify-end px-5 pb-16 sm:px-8 lg:px-12">
      <p className="eyebrow text-champagne">{dict.notFound.kicker}</p>
      <h1 className="display mt-6 text-[9.4vw] leading-[0.85] lg:text-[8vw]">{dict.notFound.title}</h1>
      <p className="mt-6 text-ivory/65">{dict.notFound.text}</p>
      <a
        href={pathFor("home", locale)}
        className="eyebrow mt-12 bg-ivory px-7 py-4 text-noir transition-colors duration-500 hover:bg-champagne"
      >
        {dict.notFound.cta} →
      </a>
    </main>
  );
}
