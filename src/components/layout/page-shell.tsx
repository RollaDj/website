import type { ReactNode } from "react";

import { Reveals } from "@/components/ui/reveals";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { alternatesFor, type PageKey } from "@/i18n/routes";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Année du copyright, figée au moment du rendu statique. */
async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

type Props = { locale: Locale; page: PageKey; dict: Dictionary; children: ReactNode };

/** Structure commune : lien d'évitement, en-tête, contenu, pied de page. */
export async function PageShell({ locale, page, dict, children }: Props) {
  const alternates = alternatesFor(page);
  const year = await getYear();

  return (
    <>
      <a
        href="#main"
        className="eyebrow sr-only z-[80] bg-ivory px-4 py-3 text-noir focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {dict.a11y.skipToContent}
      </a>
      <SiteHeader locale={locale} page={page} alternates={alternates} nav={dict.nav} a11y={dict.a11y} />
      <Reveals>
        <main id="main">{children}</main>
        <SiteFooter locale={locale} page={page} alternates={alternates} dict={dict} year={year} />
      </Reveals>
    </>
  );
}
