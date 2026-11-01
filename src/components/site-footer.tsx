import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import { LanguageSwitcher } from "./language-switcher";

type Props = {
  locale: Locale;
  footer: Dictionary["footer"];
  languageSwitchLabel: string;
  year: number;
};

export function SiteFooter({ locale, footer, languageSwitchLabel, year }: Props) {
  return (
    <footer className="border-t border-ivory/10 px-5 pb-10 pt-24 sm:px-8 lg:px-12 lg:pt-32">
      <p
        aria-hidden="true"
        className="reveal text-center font-serif text-7xl italic leading-none text-ivory/90 sm:text-8xl lg:text-9xl"
      >
        — {footer.end} —
      </p>

      <div className="mx-auto mt-24 flex max-w-[1600px] flex-col gap-8 border-t border-ivory/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
          <span className="font-serif text-2xl tracking-[0.2em]">ROLLA</span>
          <span className="label-mono text-ivory/45">{footer.tagline}</span>
        </div>
        <div className="label-mono flex flex-wrap items-center gap-x-8 gap-y-4 text-ivory/45">
          <span>{footer.city}</span>
          <span>
            © {year} ROLLA — {footer.rights}
          </span>
          <LanguageSwitcher locale={locale} label={languageSwitchLabel} />
          <a href="#top" className="link-line pb-1 text-ivory/70 hover:text-ivory">
            {footer.backToTop} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
