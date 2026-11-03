"use client";

import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pathFor, type PageKey } from "@/i18n/routes";
import { gsap, useGSAP } from "@/lib/gsap";

import { LanguageSwitcher } from "./language-switcher";
import { getLenis } from "./smooth-scroll";

type Props = {
  locale: Locale;
  page: PageKey;
  alternates: Record<Locale, string>;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
};

export function SiteHeader({ locale, page, alternates, nav, a11y }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Liens d'ancre : relatifs sur l'accueil, absolus depuis les autres pages.
  const href = (id: string) => (page === "home" ? `#${id}` : pathFor("home", locale, id));
  const links = [
    { id: "experience", label: nav.experience },
    { id: "artist", label: nav.artist },
    { id: "formats", label: nav.formats },
    { id: "performances", label: nav.performances },
    { id: "bookings", label: nav.bookings },
  ];

  // Fond au défilement ; masquée en descendant, réapparaît en remontant.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const delta = y - last;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 160);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Menu plein écran : défilement suspendu, fermeture par Échap.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || !menuRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(menuRef.current.querySelectorAll("[data-menu-item]"), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.06,
        ease: "expo.out",
      });
    },
    { dependencies: [open], scope: menuRef },
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-expo)] ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-noir/75 backdrop-blur-md transition-opacity duration-700 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="relative flex h-16 items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <a
          href={page === "home" ? "#top" : pathFor("home", locale)}
          aria-label={a11y.home}
          className="display text-xl tracking-[0.08em] text-ivory transition-colors hover:text-champagne lg:text-2xl"
        >
          ROLLA
        </a>

        <nav aria-label={a11y.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-10">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={href(link.id)}
                  className="eyebrow link-underline pb-1 text-ivory/70 transition-colors duration-300 hover:text-ivory"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5 sm:gap-8">
          <LanguageSwitcher locale={locale} alternates={alternates} label={a11y.languageSwitch} />
          <a
            href={href("contact")}
            className="eyebrow hidden border border-ivory/30 px-5 py-2.5 text-ivory transition-colors duration-500 hover:border-champagne hover:bg-champagne hover:text-noir sm:inline-block"
          >
            {nav.book}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="eyebrow flex h-10 items-center gap-3 text-ivory xl:hidden"
          >
            {a11y.openMenu}
            <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
              <span className="h-px w-full bg-ivory" />
              <span className="h-px w-2/3 self-end bg-ivory" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={a11y.mainNav}
          className="fixed inset-0 z-50 flex flex-col bg-noir px-5 sm:px-8 xl:hidden"
        >
          <div className="flex h-16 items-center justify-between">
            <span className="display text-xl tracking-[0.08em]">ROLLA</span>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="eyebrow flex h-10 items-center text-ivory/70 hover:text-ivory"
            >
              {a11y.closeMenu}
            </button>
          </div>
          <nav aria-label={a11y.mainNav} className="flex flex-1 flex-col justify-center">
            <ol className="space-y-2">
              {[...links, { id: "contact", label: nav.contact }].map((link, i) => (
                <li key={link.id} className="overflow-hidden">
                  <a
                    data-menu-item
                    href={href(link.id)}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline gap-4 py-1 text-[7.2vw] text-ivory transition-colors hover:text-champagne sm:text-5xl"
                  >
                    <span className="eyebrow w-6 text-champagne tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex items-center justify-between border-t border-ivory/10 py-6">
            <LanguageSwitcher locale={locale} alternates={alternates} label={a11y.languageSwitch} />
            <a
              href={href("contact")}
              onClick={() => setOpen(false)}
              className="eyebrow bg-ivory px-5 py-3 text-noir"
            >
              {nav.book}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
