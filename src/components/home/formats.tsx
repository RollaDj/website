"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Arrow } from "@/components/ui/button-link";
import { MediaTag } from "@/components/ui/media-tag";
import { PrefillLink } from "@/components/ui/prefill-link";
import { SectionLabel } from "@/components/ui/section-label";
import { formatMedia } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = { locale: Locale; formats: Dictionary["formats"]; tags: Dictionary["mediaTag"] };

/**
 * LIVE FORMATS — liste éditoriale. Sur ordinateur, le visuel du format
 * survolé suit le pointeur ; sur mobile, il est affiché dans la liste.
 */
export function Formats({ locale, formats, tags }: Props) {
  const root = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const move = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGSAP(
    () => {
      if (!previewRef.current) return;
      move.current = {
        x: gsap.quickTo(previewRef.current, "x", { duration: 0.7, ease: "power3.out" }),
        y: gsap.quickTo(previewRef.current, "y", { duration: 0.7, ease: "power3.out" }),
      };
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!previewRef.current) return;
      gsap.to(previewRef.current, {
        autoAlpha: active === null ? 0 : 1,
        scale: active === null ? 0.92 : 1,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { dependencies: [active], scope: root },
  );

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !root.current) return;
    const rect = root.current.getBoundingClientRect();
    move.current?.x(e.clientX - rect.left);
    move.current?.y(e.clientY - rect.top);
  };

  return (
    <section
      ref={root}
      id="formats"
      aria-labelledby="formats-title"
      onPointerMove={onPointerMove}
      className="relative border-t border-ivory/10 bg-noir"
    >
      {/* Ancien lien rolladj.com/#services */}
      <span id="services" aria-hidden="true" />
      <div className="mx-auto max-w-[1680px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="03">{formats.label}</SectionLabel>
            <h2 id="formats-title" data-split className="display mt-8 text-[8.2vw] text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              {formats.title}
            </h2>
          </div>
        </div>

        <ol className="mt-20 border-b border-ivory/15 lg:mt-28" onPointerLeave={() => setActive(null)}>
          {formats.items.map((item, i) => {
            const media = formatMedia[item.id];
            const signature = item.id === "dj-trumpet";
            return (
              <li key={item.id} data-reveal className="group border-t border-ivory/15" onPointerEnter={() => setActive(i)}>
                <PrefillLink
                  href="#contact"
                  format={item.name}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="grid gap-6 py-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-14"
                >
                  <span className="eyebrow text-champagne tabular-nums lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="lg:col-span-6">
                    <span className="display block text-[10.5vw] leading-[0.9] transition-[color,transform] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:text-champagne sm:text-6xl lg:text-[4.6vw] xl:text-[min(5vw,5.6rem)]">
                      {item.name}
                    </span>
                    {signature && (
                      <span className="eyebrow mt-4 inline-block border border-champagne/60 px-3 py-1.5 text-[0.625rem] text-champagne">
                        {formats.signature}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
                    <span className="max-w-sm leading-relaxed text-ivory/70">{item.text}</span>
                    <span className="eyebrow inline-flex items-center gap-3 text-ivory transition-colors group-hover:text-champagne">
                      {formats.cta} <Arrow />
                    </span>
                  </span>
                </PrefillLink>
                {/* Visuel mobile / tablette */}
                <div className="relative mb-10 aspect-[4/5] overflow-hidden bg-anthracite sm:aspect-[16/10] lg:hidden">
                  <Image src={media.image} alt={media.alt[locale]} fill sizes="100vw" className="tone object-cover" />
                  <MediaTag status={media.status} labels={tags} note={media.note} className="absolute left-3 top-3" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Visuel qui suit le pointeur (ordinateur) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden h-[26vw] max-h-[460px] w-[21vw] max-w-[370px] -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-0 lg:block"
      >
        {formats.items.map((item, i) => {
          const media = formatMedia[item.id];
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}
            >
              <Image src={media.image} alt="" fill sizes="22vw" className="tone object-cover" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
