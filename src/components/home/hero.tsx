"use client";

import { useRef } from "react";

import { ButtonLink, Arrow } from "@/components/ui/button-link";
import { CutoutVideo } from "@/components/ui/cutout-video";
import { MediaTag } from "@/components/ui/media-tag";
import type { CutoutMedia } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  locale: Locale;
  hero: Dictionary["hero"];
  tags: Dictionary["mediaTag"];
  cutout: CutoutMedia;
};

/**
 * HERO — ROLLA détouré, en grand, devant le titre géant (effet de profondeur).
 * Montage : arrivée face caméra (une fois), puis boucle à la trompette.
 */
export function Hero({ locale, hero, tags, cutout }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-hero-title]", { type: "words,chars", mask: "chars", charsClass: "char" });

        // Ouverture : projecteur, titre, puis l'artiste qui entre en scène.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo("[data-hero-glow]", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 2.6 }, 0)
          .fromTo("[data-hero-title]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.15)
          .from(split.chars, { yPercent: 125, duration: 1.6, stagger: 0.07 }, 0.15)
          .fromTo("[data-hero-media]", { opacity: 0, yPercent: 4 }, { opacity: 1, yPercent: 0, duration: 2.2 }, 0.35)
          .fromTo("[data-hero-fade]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.08 }, 1);

        // Sortie au défilement : profondeur (le titre file plus vite que l'artiste).
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
          .to("[data-hero-title]", { yPercent: -45 }, 0)
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
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_38%_55%_at_50%_48%,rgba(198,173,134,0.24),rgba(198,173,134,0.06)_50%,transparent_75%)] max-sm:bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(198,173,134,0.24),rgba(198,173,134,0.06)_50%,transparent_78%)]"
      />

      {/* Titre géant, derrière l'artiste */}
      <h1
        id="hero-title"
        data-hero-title
        data-intro
        className="display absolute inset-x-0 top-[31%] -z-20 select-none text-center text-[calc((100vw-2.5rem)/4.1)] leading-[0.78] tracking-[-0.04em] text-ivory sm:text-[calc((100vw-4rem)/4.1)] lg:top-[29%] lg:text-[calc((100vw-6rem)/4.1)]"
      >
        ROLLA
      </h1>

      {/* ROLLA détouré */}
      <div
        data-hero-media
        data-intro
        className="absolute bottom-0 left-1/2 -z-10 aspect-[9/16] h-[106svh] -translate-x-1/2 sm:h-[112svh] lg:h-[122svh]"
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
          <div className="lg:col-span-4">
            <p data-hero-fade data-intro className="display text-2xl leading-[0.95] sm:text-3xl xl:text-4xl">
              {hero.subtitleA}
              <br />
              <span className="text-champagne">{hero.subtitleB}</span>
            </p>
            <p data-hero-fade data-intro className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75 sm:text-base">
              {hero.line}
            </p>
          </div>
          <div data-hero-fade data-intro className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <ButtonLink href="#experience">
              {hero.discover}
              <Arrow />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost" className="bg-noir/40 backdrop-blur-sm">
              {hero.book}
            </ButtonLink>
          </div>
        </div>

        <div data-hero-fade data-intro aria-hidden="true" className="mt-8 hidden items-center gap-4 lg:flex">
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-champagne" />
          </span>
          <span className="eyebrow text-ivory/45">{hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
