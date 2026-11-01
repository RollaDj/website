"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import { LanguageSwitcher } from "./language-switcher";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
};

export function SiteHeader({ locale, nav, a11y }: Props) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#film", label: nav.film },
    { href: "#artist", label: nav.artist },
    { href: "#services", label: nav.services },
    { href: "#gallery", label: nav.gallery },
    { href: "#reviews", label: nav.reviews },
  ];

  // Menu mobile : verrouille le défilement et ferme avec Échap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="header-backdrop absolute inset-0 border-b border-ivory/10 bg-noir/80 backdrop-blur-md"
      />
      <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <a
          href={`/${locale}`}
          className="font-serif text-2xl tracking-[0.2em] text-ivory lg:text-[1.7rem]"
        >
          ROLLA
        </a>

        <nav aria-label={a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="label-mono link-line pb-1 text-ivory/60 transition-colors duration-300 hover:text-ivory"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5 sm:gap-7">
          <LanguageSwitcher locale={locale} label={a11y.languageSwitch} />
          <a
            href="#contact"
            className="label-mono hidden border border-ivory/40 px-5 py-2.5 text-ivory transition-colors duration-500 hover:bg-ivory hover:text-noir sm:inline-block"
          >
            {nav.book}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="group flex h-10 w-10 flex-col items-end justify-center gap-[7px] lg:hidden"
          >
            <span className="sr-only">{a11y.openMenu}</span>
            <span aria-hidden="true" className="block h-px w-7 bg-ivory" />
            <span aria-hidden="true" className="block h-px w-4 bg-ivory transition-all group-hover:w-7" />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={a11y.mainNav}
          className="fixed inset-0 z-50 flex flex-col bg-noir px-5 sm:px-8 lg:hidden"
        >
          <div className="flex h-16 items-center justify-between">
            <span className="font-serif text-2xl tracking-[0.2em]">ROLLA</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              className="label-mono flex h-10 items-center text-ivory/70 hover:text-ivory"
            >
              {a11y.closeMenu}
            </button>
          </div>
          <nav aria-label={a11y.mainNav} className="flex flex-1 flex-col justify-center">
            <ol className="space-y-3">
              {[...links, { href: "#contact", label: nav.contact }].map((link, i) => (
                <li key={link.href} className="flex items-baseline gap-5">
                  <span className="label-mono w-6 text-ivory/35 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-5xl leading-tight text-ivory sm:text-6xl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex items-center justify-between border-t border-ivory/10 py-6">
            <LanguageSwitcher locale={locale} label={a11y.languageSwitch} />
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="label-mono border border-ivory/40 px-5 py-2.5"
            >
              {nav.book}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
