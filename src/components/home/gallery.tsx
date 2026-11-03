"use client";

import Image from "next/image";
import { useRef } from "react";

import { getLenis } from "@/components/layout/smooth-scroll";
import { ButtonLink, Arrow } from "@/components/ui/button-link";
import { SectionLabel } from "@/components/ui/section-label";
import { galleryPhotos, type GalleryPhoto } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = { locale: Locale; copy: Dictionary["gallery"]; index: string };

/** Taille des photos, proportions d'origine conservées (aucun recadrage du cadre). */
const SHAPE: Record<GalleryPhoto["shape"], string> = {
  portrait: "w-[68vw] sm:w-[44vw] lg:w-auto lg:h-[min(64svh,44vw)]",
  square: "w-[78vw] sm:w-[52vw] lg:w-auto lg:h-[min(50svh,36vw)]",
  landscape: "w-[86vw] sm:w-[64vw] lg:w-auto lg:h-[min(46svh,34vw)]",
};

/**
 * EN IMAGES — galerie horizontale.
 * - Ordinateur : la section reste en place et les photos défilent à
 *   l'horizontale au rythme du défilement. Chaque photo passe du noir et
 *   blanc à la couleur en traversant le centre, avec un léger parallaxe.
 * - Mobile, tablette, animations réduites : défilement horizontal natif
 *   (glisser, ou flèches du clavier), photos en couleur.
 */
export function Gallery({ locale, copy, index }: Props) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // Bande pilotée par le défilement : la zone n'a plus à être focalisable.
        viewport.current!.tabIndex = -1;
        const distance = () => Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth);
        const scroll = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          "[data-gallery-progress]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-gallery-item]").forEach((item) => {
          const along = { containerAnimation: scroll, trigger: item, start: "left right", end: "right left", scrub: true };
          // Couleur au centre de l'écran, noir et blanc aux bords.
          gsap
            .timeline({ scrollTrigger: along, defaults: { ease: "none" } })
            .fromTo(item.querySelector("[data-gallery-color]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.12)
            .to(item.querySelector("[data-gallery-color]"), { opacity: 0, duration: 0.3 }, 0.58);
          // Parallaxe : l'image glisse moins vite que son cadre.
          gsap.fromTo(item.querySelector("[data-gallery-shift]"), { xPercent: -5 }, { xPercent: 5, ease: "none", scrollTrigger: along });
        });

        // Clavier : un élément qui reçoit le focus est amené à l'écran
        // (défilement de la page jusqu'à la position correspondante).
        const onFocus = (event: FocusEvent) => {
          const st = scroll.scrollTrigger;
          const el = event.target as HTMLElement;
          if (!st || !track.current) return;
          const left = el.getBoundingClientRect().left - track.current.getBoundingClientRect().left;
          const x = gsap.utils.clamp(0, distance(), left - (window.innerWidth - el.offsetWidth) / 2);
          const y = st.start + x;
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        };
        const trackEl = track.current!;
        trackEl.addEventListener("focusin", onFocus);

        return () => {
          trackEl.removeEventListener("focusin", onFocus);
          if (viewport.current) viewport.current.tabIndex = 0;
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="gallery"
      aria-labelledby="gallery-title"
      className="relative overflow-hidden border-t border-ivory/10 bg-noir lg:motion-safe:[.js_&]:h-svh lg:motion-safe:[.js_&]:min-h-[640px]"
    >
      <div
        ref={viewport}
        role="region"
        aria-label={copy.scrollerLabel}
        tabIndex={0}
        className="relative h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-24 outline-none [scrollbar-width:thin] focus-visible:ring-1 focus-visible:ring-champagne lg:py-28 lg:motion-safe:[.js_&]:snap-none lg:motion-safe:[.js_&]:overflow-x-visible lg:motion-safe:[.js_&]:py-0"
      >
        <div
          ref={track}
          className="flex h-full w-max items-center gap-5 px-5 sm:gap-8 sm:px-8 lg:gap-[5vw] lg:px-12 lg:motion-safe:[.js_&]:will-change-transform"
        >
          {/* Introduction (premier élément de la bande) */}
          <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-center sm:w-[56vw] lg:w-[min(34vw,560px)]">
            <SectionLabel index={index}>{copy.label}</SectionLabel>
            <h2 id="gallery-title" className="display mt-8 text-[9vw] text-balance sm:text-5xl lg:text-[clamp(2.5rem,4vw,4.25rem)]">
              {copy.title}
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-ivory/65">{copy.intro}</p>
            <p aria-hidden="true" className="eyebrow mt-10 inline-flex items-center gap-3 text-champagne">
              <span className="lg:hidden">{copy.hintSwipe}</span>
              <span className="hidden lg:inline">{copy.hintScroll}</span>
              <Arrow />
            </p>
          </div>

          {galleryPhotos.map((photo, i) => (
            <figure
              key={photo.id}
              data-gallery-item
              className={`shrink-0 snap-center ${i % 2 ? "lg:self-start lg:pt-[12svh]" : "lg:self-end lg:pb-[10svh]"}`}
            >
              <div
                className={`relative overflow-hidden bg-anthracite ${SHAPE[photo.shape]}`}
                style={{ aspectRatio: `${photo.image.width} / ${photo.image.height}` }}
              >
                <div data-gallery-shift className="absolute inset-y-0 -left-[6%] -right-[6%]">
                  {/* Noir et blanc (fond) + couleur (au-dessus, révélée au centre sur ordinateur) */}
                  <Image
                    src={photo.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 90vw"
                    className="tone hidden object-cover lg:motion-safe:[.js_&]:block"
                    style={{ objectPosition: photo.focus }}
                  />
                  <Image
                    src={photo.image}
                    alt={photo.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 50vw, 90vw"
                    data-gallery-color
                    className="object-cover"
                    style={{ objectPosition: photo.focus }}
                  />
                </div>
              </div>
              <figcaption className="mt-4 flex items-baseline gap-3">
                <span className="eyebrow text-champagne tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="eyebrow text-ivory/70">{photo.caption[locale]}</span>
              </figcaption>
            </figure>
          ))}

          {/* Fin de la bande : appel à réserver */}
          <div className="flex w-[78vw] shrink-0 snap-end flex-col justify-center sm:w-[50vw] lg:w-[min(30vw,480px)]">
            <p className="display text-3xl text-balance sm:text-4xl lg:text-[clamp(2rem,2.6vw,3rem)]">{copy.endTitle}</p>
            <div className="mt-10">
              <ButtonLink href="#contact">
                {copy.endCta} <Arrow />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Progression (ordinateur) */}
      <div aria-hidden="true" className="absolute inset-x-5 bottom-10 hidden h-px bg-ivory/15 sm:inset-x-8 lg:inset-x-12 lg:motion-safe:[.js_&]:block">
        <div data-gallery-progress className="h-full origin-left scale-x-0 bg-champagne" />
      </div>
    </section>
  );
}
