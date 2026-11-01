"use client";

import type { MouseEvent } from "react";

import { locales, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember-locale";

type Props = {
  locale: Locale;
  /** Adresse de la page courante dans chaque langue. */
  alternates: Record<Locale, string>;
  label: string;
  className?: string;
};

/**
 * Sélecteur FR / EN : ouvre la même page dans l'autre langue (URL traduites),
 * conserve la section en cours et mémorise le choix.
 */
export function LanguageSwitcher({ locale, alternates, label, className = "" }: Props) {
  const onSwitch = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    rememberLocale(target);
    event.currentTarget.setAttribute("href", `${alternates[target]}${window.location.hash}`);
  };

  return (
    <div className={`eyebrow flex items-center gap-1.5 ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
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
              href={alternates[l]}
              hrefLang={l}
              lang={l}
              aria-label={label}
              onClick={(e) => onSwitch(e, l)}
              className="text-ivory/45 transition-colors duration-300 hover:text-champagne"
            >
              {l.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
