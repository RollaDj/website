"use client";

import { useRef } from "react";

import { SectionLabel } from "@/components/ui/section-label";
import { TRUSTED_BY } from "@/content/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = { copy: Dictionary["trusted"] };

/**
 * TRUSTED BY — références réelles, présentation typographique monochrome.
 * Deux lignes défilent en sens inverse, au rythme du scroll.
 */
export function TrustedBy({ copy }: Props) {
  const root = useRef<HTMLElement>(null);
  const half = Math.ceil(TRUSTED_BY.length / 2);
  const rows = [TRUSTED_BY.slice(0, half), TRUSTED_BY.slice(half)];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 };
        gsap.fromTo("[data-row='0']", { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: trigger });
        gsap.fromTo("[data-row='1']", { xPercent: -28 }, { xPercent: 0, ease: "none", scrollTrigger: trigger });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="trusted" aria-labelledby="trusted-title" className="relative overflow-hidden border-t border-ivory/10 bg-anthracite/30">
      {/* Ancien lien rolladj.com/#testimonials */}
      <span id="testimonials" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1680px] gap-8 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12 lg:pb-20 lg:pt-40">
        <div className="lg:col-span-7">
          <SectionLabel index="05">{copy.label}</SectionLabel>
          <h2 id="trusted-title" data-split className="display mt-8 text-[8.2vw] sm:text-5xl lg:text-6xl xl:text-7xl">
            {copy.title}
          </h2>
        </div>
        <p data-reveal className="max-w-sm leading-relaxed text-ivory/60 lg:col-span-4 lg:col-start-9">
          {copy.text}
        </p>
      </div>

      <ul className="sr-only">
        {TRUSTED_BY.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="space-y-2 pb-28 lg:pb-40">
        {rows.map((row, r) => (
          <div key={r} data-row={r} className="flex w-max items-center gap-[4vw] whitespace-nowrap will-change-transform">
            {[...row, ...row].map((name, i) => (
              <span key={`${name}-${i}`} className="flex items-center gap-[4vw]">
                <span
                  className={`display text-[9vw] leading-[1.05] transition-colors duration-500 hover:text-champagne lg:text-[6vw] ${
                    (i + r) % 2 === 0 ? "text-ivory" : "text-transparent [-webkit-text-stroke:1px_rgba(245,242,235,0.45)]"
                  }`}
                >
                  {name}
                </span>
                <span className="h-2 w-2 shrink-0 rounded-full bg-champagne/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
