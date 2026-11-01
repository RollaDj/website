"use client";

import { useRef, type ReactNode } from "react";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Animations d'apparition déclaratives, appliquées à tout le contenu enfant :
 *  - [data-split]        titre révélé ligne par ligne (masque)
 *  - [data-reveal]       bloc qui apparaît en fondu montant
 *  - [data-reveal-image] image révélée par ouverture + léger parallaxe
 * Rien n'est animé si le visiteur demande de réduire les animations.
 */
export function Reveals({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 125,
                duration: 1.4,
                stagger: 0.1,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          // Opacité seule (pas de visibility:hidden) : les liens restent
          // accessibles au clavier avant d'être révélés.
          gsap.from(el, {
            opacity: 0,
            y: 36,
            duration: 1.3,
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-image]").forEach((el) => {
          const inner = el.querySelector<HTMLElement>("[data-parallax]");
          gsap.fromTo(
            el,
            { clipPath: "inset(16% 10% 16% 10%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.8,
              ease: "expo.inOut",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
          if (inner) {
            gsap.fromTo(inner, { scale: 1.18 }, { scale: 1.06, duration: 2.2, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
            gsap.fromTo(
              inner,
              { yPercent: -4 },
              { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
            );
          }
        });
      });

      // Les images chargées après coup modifient la mise en page.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
