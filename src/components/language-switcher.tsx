"use client";

import type { MouseEvent } from "react";

import { locales, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember-locale";

type Props = {
  locale: Locale;
  /** Libellé accessible du lien vers l'autre langue. */
  label: string;
  className?: string;
};

/**
 * Bascule FR / EN. Mémorise le choix (cookie lu par src/proxy.ts) et
 * conserve l'ancre courante (#film, #contact…).
 */
export function LanguageSwitcher({ locale, label, className = "" }: Props) {
  const onSwitch = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    rememberLocale(target);
    // Navigation native, en conservant la section courante (#film, #contact…).
    event.currentTarget.setAttribute("href", `/${target}${window.location.hash}`);
  };

  return (
    <div className={`label-mono flex items-center gap-2 ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-ivory/25">
              /
            </span>
          )}
          {l === locale ? (
            <span aria-current="true" className="text-ivory">
              {l.toUpperCase()}
            </span>
          ) : (
            <a
              href={`/${l}`}
              hrefLang={l}
              lang={l}
              aria-label={label}
              onClick={(e) => onSwitch(e, l)}
              className="text-ivory/45 transition-colors duration-300 hover:text-ivory"
            >
              {l.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
