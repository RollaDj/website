import { EmailLink } from "@/components/ui/email-link";
import { SocialLinks } from "@/components/ui/social-links";
import { SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pathFor, type PageKey } from "@/i18n/routes";

import { LanguageSwitcher } from "./language-switcher";

type Props = {
  locale: Locale;
  page: PageKey;
  alternates: Record<Locale, string>;
  dict: Dictionary;
  year: number;
};

export function SiteFooter({ locale, page, alternates, dict, year }: Props) {
  const href = (id: string) => (page === "home" ? `#${id}` : pathFor("home", locale, id));
  const links = [
    { id: "experience", label: dict.nav.experience },
    { id: "artist", label: dict.nav.artist },
    { id: "formats", label: dict.nav.formats },
    { id: "performances", label: dict.nav.performances },
    { id: "bookings", label: dict.nav.bookings },
    { id: "contact", label: dict.nav.contact },
  ];

  return (
    <footer className="overflow-hidden border-t border-ivory/10 bg-noir px-5 pt-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1680px] gap-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="display text-2xl">ROLLA</p>
          <p className="eyebrow mt-4 text-ivory/50">{dict.footer.tagline}</p>
          <p className="mt-2 text-sm text-ivory/45">{dict.footer.basedIn}</p>
        </div>
        <nav aria-label={dict.footer.navigation} className="lg:col-span-3 lg:col-start-6">
          <p className="eyebrow mb-5 text-champagne">{dict.footer.navigation}</p>
          <ul className="space-y-2.5">
            {links.map((link) => (
              <li key={link.id}>
                <a href={href(link.id)} className="link-underline text-sm text-ivory/70 hover:text-ivory">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={pathFor("weddings", locale)} className="link-underline text-sm text-ivory/70 hover:text-ivory">
                {dict.bookings.weddings.label}
              </a>
            </li>
          </ul>
        </nav>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow mb-5 text-champagne">{dict.footer.contact}</p>
          <EmailLink user={SITE.email.user} domain={SITE.email.domain} className="link-underline text-sm text-ivory/80" />
          <p className="eyebrow mb-4 mt-10 text-champagne">{dict.footer.follow}</p>
          <SocialLinks newTabLabel={dict.a11y.newTab} />
        </div>
      </div>

      {/* Signature géante */}
      <p
        aria-hidden="true"
        className="display pointer-events-none mt-24 select-none text-center text-[calc((100vw-2.5rem)/4.3)] leading-[0.74] sm:text-[calc((100vw-4rem)/4.3)] lg:text-[calc((100vw-6rem)/4.3)] text-transparent [-webkit-text-stroke:1px_rgba(245,242,235,0.14)]"
      >
        ROLLA
      </p>

      <div className="mx-auto flex max-w-[1680px] flex-col gap-5 border-t border-ivory/10 py-7 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.name} — {dict.footer.rights}
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <a href={pathFor("legal", locale)} className="link-underline hover:text-ivory">
            {dict.footer.legal}
          </a>
          <LanguageSwitcher locale={locale} alternates={alternates} label={dict.a11y.languageSwitch} />
          <a href={page === "home" ? "#top" : "#main"} className="eyebrow link-underline hover:text-ivory">
            {dict.footer.backToTop} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
