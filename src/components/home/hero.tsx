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

export function Hero({ hero, tags, video }: Props) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pas de lecture automatique si le visiteur limite les animations.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    else v.play().catch(() => {});
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-hero-title]", { type: "words,chars", mask: "chars", charsClass: "char" });

        // Ouverture
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .fromTo("[data-hero-media]", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 2.6 }, 0)
          .fromTo("[data-hero-title]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.2)
          .from(split.chars, { yPercent: 125, duration: 1.6, stagger: 0.07 }, 0.2)
          .fromTo(
            "[data-hero-fade]",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1.4, stagger: 0.08 },
            0.9,
          );

        // Sortie au défilement : le titre et le texte s'élèvent, l'image s'approfondit.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
          .to("[data-hero-content]", { yPercent: -18, opacity: 0 }, 0)
          .to("[data-hero-media]", { scale: 1.12, opacity: 0.35 }, 0);
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
      {/* Vidéo de fond (sans son) */}
      <div data-hero-media data-intro className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/10 to-noir" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,11,11,0.75))]" />
      </div>

      <div data-hero-content className="flex h-full flex-col px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pb-10 lg:pt-28">
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
          className="display -ml-[0.04em] text-[calc((100vw-2.5rem)/4.1)] leading-[0.78] tracking-[-0.04em] text-ivory sm:text-[calc((100vw-4rem)/4.1)] lg:text-[calc((100vw-6rem)/4.1)]"
        >
          ROLLA
        </h1>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <p data-hero-fade data-intro className="display text-2xl leading-[0.95] sm:text-3xl lg:col-span-4 xl:text-4xl">
            {hero.subtitleA}
            <br />
            <span className="text-champagne">{hero.subtitleB}</span>
          </p>
          <p data-hero-fade data-intro className="max-w-xs text-base leading-relaxed text-ivory/70 lg:col-span-3">
            {hero.line}
          </p>
          <div data-hero-fade data-intro className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <ButtonLink href="#experience">
              {hero.discover}
              <Arrow />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              {hero.book}
            </ButtonLink>
          </div>
        </div>

        <div data-hero-fade data-intro aria-hidden="true" className="mt-10 hidden items-center gap-4 lg:flex">
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-champagne" />
          </span>
          <span className="eyebrow text-ivory/45">{hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
