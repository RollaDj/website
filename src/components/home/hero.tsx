"use client";

import { useRef } from "react";

import { ButtonLink, Arrow } from "@/components/ui/button-link";
import { CutoutVideo } from "@/components/ui/cutout-video";
import { LogoDjRolla } from "@/components/ui/logo-dj-rolla";
import { MediaTag } from "@/components/ui/media-tag";
import type { CutoutMedia } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  locale: Locale;
  hero: Dictionary["hero"];
  tags: Dictionary["mediaTag"];
  cutout: CutoutMedia;
};

/**
 * HERO — ROLLA détouré, en grand, DEVANT le logo DJ ROLLA centré
 * (effet de profondeur, façon couverture de magazine).
 * Montage : arrivée face caméra (une fois), puis boucle à la trompette.
 */
export function Hero({ locale, hero, tags, cutout }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ouverture : projecteur, le « DJ » du logo, les lettres de ROLLA,
        // puis l'artiste qui entre en scène.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo("[data-hero-glow]", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 2.6 }, 0)
          .fromTo("[data-hero-title]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.1)
          .fromTo("[data-logo-dj]", { opacity: 0, scale: 1.06, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 2.2 }, 0.1)
          .fromTo("[data-logo-letter]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.09 }, 0.45)
          .fromTo("[data-hero-media]", { opacity: 0, yPercent: 4 }, { opacity: 1, yPercent: 0, duration: 2.2 }, 0.6)
          .fromTo("[data-hero-fade]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.08 }, 1);

        // Sortie au défilement : profondeur (le titre file plus vite que l'artiste).
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
          .to("[data-hero-title]", { yPercent: -30 }, 0)
          .to("[data-hero-media]", { yPercent: 8, scale: 1.04 }, 0)
          .to("[data-hero-content]", { yPercent: -16, opacity: 0 }, 0)
          .to("[data-hero-glow]", { opacity: 0 }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate h-svh min-h-[640px] overflow-hidden bg-noir"
    >
      {/* Projecteur */}
      <div
        data-hero-glow
        data-intro
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(198,173,134,0.22),rgba(198,173,134,0.06)_50%,transparent_78%)] lg:bg-[radial-gradient(ellipse_38%_55%_at_50%_48%,rgba(198,173,134,0.22),rgba(198,173,134,0.06)_50%,transparent_75%)]"
      />

      {/* Logo DJ ROLLA, centré, derrière l'artiste */}
      <h1
        id="hero-title"
        data-hero-title
        data-intro
        className="absolute left-1/2 top-[max(7.5rem,17svh)] -z-20 w-[min(84vw,27rem)] -translate-x-1/2 select-none text-[#F2E7D6] sm:w-[min(72vw,calc((100svh-26rem)*1.465))] lg:top-[max(9rem,16svh)] lg:w-[min(70vw,calc((100svh-26rem)*1.465))]"
      >
        <span className="sr-only">DJ ROLLA</span>
        <LogoDjRolla className="block h-auto w-full" />
      </h1>

      {/* ROLLA détouré */}
      <div
        data-hero-media
        data-intro
        className="absolute bottom-0 left-1/2 -z-10 aspect-[9/16] h-[104svh] -translate-x-1/2 sm:h-[112svh] lg:h-[122svh]"
      >
        <CutoutVideo
          src={cutout.src}
          mobileSrc={cutout.mobileSrc}
          poster={cutout.poster}
          still={cutout.still}
          loopStart={cutout.loopStart}
          alt={cutout.alt[locale]}
          className="h-full w-full"
        />
      </div>

      {/* Lisibilité du texte en bas d'écran */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-noir via-noir/80 to-transparent lg:h-[34%] lg:via-noir/70"
      />

      <div data-hero-content className="relative flex h-full flex-col px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pb-10 lg:pt-28">
        <div className="flex items-start justify-between gap-6">
          <p data-hero-fade data-intro className="eyebrow text-ivory/70">
            {hero.kicker}
          </p>
          <div data-hero-fade data-intro>
            <MediaTag status={cutout.status} labels={tags} note={cutout.note} />
          </div>
        </div>

        <div className="flex-1" />

        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p data-hero-fade data-intro className="display text-2xl leading-[0.95] sm:text-3xl">
              {hero.subtitleA}
              <br />
              <span className="text-champagne">{hero.subtitleB}</span>
            </p>
            <p data-hero-fade data-intro className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75 sm:text-base">
              {hero.line}
            </p>
          </div>
          <div data-hero-fade data-intro className="flex flex-wrap gap-3 lg:col-span-6 lg:justify-end">
            <ButtonLink href="#experience">
              {hero.discover}
              <Arrow />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost" className="bg-noir/40 backdrop-blur-sm">
              {hero.book}
            </ButtonLink>
          </div>
        </div>

        <div data-hero-fade data-intro aria-hidden="true" className="mt-8 hidden items-center gap-4 lg:flex [@media(max-height:780px)]:lg:hidden">
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-champagne" />
          </span>
          <span className="eyebrow text-ivory/45">{hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
