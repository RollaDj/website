"use client";

import { useEffect, useRef } from "react";

import { ButtonLink, Arrow } from "@/components/ui/button-link";
import { MediaTag } from "@/components/ui/media-tag";
import type { VideoMedia } from "@/content/media";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  hero: Dictionary["hero"];
  tags: Dictionary["mediaTag"];
  video: VideoMedia;
};

/**
 * HERO — vidéo de ROLLA, sans son.
 * Vidéo verticale : sur écran large, présentée entière dans un cadre 9:16
 * (aucun recadrage), sur fond d'ambiance flouté ; sur mobile, plein cadre.
 */
export function Hero({ hero, tags, video }: Props) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const portrait = video.orientation === "portrait";

  // Lecture lancée par le script (jamais si le visiteur limite les animations :
  // l'image finale est alors affichée).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (video.still) v.poster = video.still;
      return;
    }
    const start = window.setTimeout(() => v.play().catch(() => {}), 350);
    return () => window.clearTimeout(start);
  }, [video.still]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-hero-title]", { type: "words,chars", mask: "chars", charsClass: "char" });

        // Ouverture
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo("[data-hero-media]", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4 }, 0)
          .fromTo("[data-hero-ambient]", { opacity: 0 }, { opacity: 1, duration: 2.4 }, 0.2)
          .fromTo("[data-hero-title]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.2)
          .from(split.chars, { yPercent: 125, duration: 1.6, stagger: 0.07 }, 0.2)
          .fromTo("[data-hero-fade]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.08 }, 0.9);

        // Sortie au défilement : le texte s'élève, l'image s'éloigne.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
          .to("[data-hero-content]", { yPercent: -18, opacity: 0 }, 0)
          .to("[data-hero-media]", { yPercent: 8, opacity: 0.4 }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate h-svh min-h-[600px] overflow-hidden bg-noir"
    >
      {/* Ambiance (écran large) : la dernière image, très floutée */}
      {portrait && video.still && (
        <div data-hero-ambient data-intro aria-hidden="true" className="absolute inset-0 -z-20 hidden wide:block">
          {/* eslint-disable-next-line @next/next/no-img-element -- fond décoratif flouté */}
          <img src={video.still} alt="" className="h-full w-full scale-110 object-cover opacity-30 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/80 to-noir/40" />
        </div>
      )}

      {/* Vidéo (sans son) */}
      <div
        data-hero-media
        data-intro
        className={`absolute inset-0 -z-10 ${
          portrait
            ? "wide:inset-auto wide:bottom-10 wide:right-[var(--frame-right)] wide:top-24 wide:w-[var(--frame-w)] wide:overflow-hidden"
            : ""
        }`}
      >
        <video
          ref={videoRef}
          poster={video.poster}
          muted
          loop={video.loop ?? true}
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-full object-cover object-[center_30%]"
        >
          {video.mobileSrc && <source src={video.mobileSrc} type="video/mp4" media="(max-width: 767px)" />}
          <source src={video.src} type="video/mp4" />
        </video>
        {/* Lisibilité du texte en plein cadre (vidéo tournée en extérieur, très lumineuse) */}
        <div className={portrait ? "wide:hidden" : ""}>
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-noir/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-noir via-noir/75 to-transparent" />
        </div>
        {portrait && <div className="absolute inset-0 hidden ring-1 ring-inset ring-ivory/10 wide:block" />}
      </div>

      <div
        data-hero-content
        className={`flex h-full flex-col px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pb-10 lg:pt-28 ${
          portrait ? "wide:pr-[calc(var(--frame-right)+var(--frame-w)+3rem)]" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <p data-hero-fade data-intro className="eyebrow text-ivory/70">
            {hero.kicker}
          </p>
          <div data-hero-fade data-intro>
            <MediaTag status={video.status} labels={tags} note={video.note} />
          </div>
        </div>

        <div className="flex-1" />

        <h1
          id="hero-title"
          data-hero-title
          data-intro
          className={`display -ml-[0.04em] text-[calc((100vw-2.5rem)/4.1)] leading-[0.78] tracking-[-0.04em] text-ivory sm:text-[calc((100vw-4rem)/4.1)] lg:text-[calc((100vw-6rem)/4.1)] ${
            portrait ? "wide:text-[calc((100vw-var(--frame-w)-var(--frame-right)-6rem)/4.15)]" : ""
          }`}
        >
          ROLLA
        </h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:items-end lg:mt-10">
          <p data-hero-fade data-intro className="display text-2xl leading-[0.95] sm:text-3xl xl:text-4xl">
            {hero.subtitleA}
            <br />
            <span className="text-champagne">{hero.subtitleB}</span>
          </p>
          <p data-hero-fade data-intro className="max-w-xs text-base leading-relaxed text-ivory/75">
            {hero.line}
          </p>
          <div data-hero-fade data-intro className="flex flex-wrap gap-3 sm:col-span-2">
            <ButtonLink href="#experience">
              {hero.discover}
              <Arrow />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
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
