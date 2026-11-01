import { lang } from "next/root-params";

import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const raw = await lang();
  const locale = hasLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="label-mono text-ivory/50">{dict.notFound.kicker}</p>
      <h1 className="mt-6 font-serif text-6xl italic sm:text-8xl">{dict.notFound.title}</h1>
      <p className="mt-6 text-ivory/65">{dict.notFound.text}</p>
      <a
        href={`/${locale}`}
        className="label-mono mt-12 border border-ivory/40 px-7 py-4 transition-colors duration-500 hover:bg-ivory hover:text-noir"
      >
        {dict.notFound.cta}
      </a>
    </main>
  );
}
