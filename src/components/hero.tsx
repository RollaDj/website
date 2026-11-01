import Image from "next/image";

import type { Dictionary } from "@/i18n/dictionaries";
import { heroCutout } from "@/lib/media";

type Props = { hero: Dictionary["hero"] };

export function Hero({ hero }: Props) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col bg-noir overflow-hidden px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pb-10 lg:pt-28"
    >
      {/* Faisceau de projecteur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[58%] top-0 -z-10 h-[92svh] w-[min(1100px,120vw)] origin-top -translate-x-1/2 animate-beam bg-[radial-gradient(ellipse_50%_90%_at_50%_0%,rgba(239,233,221,0.17),rgba(239,233,221,0.05)_55%,transparent_80%)] [clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)]"
      />

      {/* Artiste (fond noir effacé par le mode de fusion « screen ») */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square h-[74svh] -translate-x-[38%] animate-fade mix-blend-screen [animation-delay:500ms] sm:h-[84svh] lg:left-[57%] lg:h-[94svh] lg:-translate-x-1/2">
        <Image
          src={heroCutout}
          alt={hero.imageAlt}
          priority
          fill
          sizes="(min-width: 1024px) 94vh, 84vh"
          className="mono-photo object-contain object-bottom opacity-60 sm:opacity-100"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45%] bg-gradient-to-t from-noir via-noir/70 to-transparent"
      />

      {/* En-tête du hero */}
      <div className="flex items-start justify-between gap-6">
        <p className="label-mono animate-fade text-ivory/70 [animation-delay:300ms]">
          {hero.kicker}
        </p>
        <p className="label-mono hidden animate-fade text-right text-ivory/45 [animation-delay:300ms] sm:block">
          {hero.location}
          <br />
          {hero.availability}
        </p>
      </div>

      <div className="flex-1" />

      {/* Titre : se « découpe » sur l'artiste grâce au mode de fusion */}
      <h1 className="relative -mx-1 select-none font-serif leading-[0.78] tracking-[-0.035em] text-ivory mix-blend-difference">
        <span className="sr-only">ROLLA — {hero.kicker}</span>
        <span aria-hidden="true" className="flex overflow-hidden pb-[0.06em] text-[30.5vw] lg:text-[27.5vw]">
          {"ROLLA".split("").map((letter, i) => (
            <span
              key={i}
              className="block animate-rise"
              style={{ animationDelay: `${150 + i * 90}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </h1>

      {/* Bas du hero */}
      <div className="mt-6 grid animate-fade gap-8 [animation-delay:900ms] lg:mt-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <p className="font-serif text-3xl leading-[1.05] sm:text-4xl">
            {hero.taglineA}
            <br />
            <em className="text-ivory/60">{hero.taglineB}</em>
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/65 sm:text-base">
            {hero.lede}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:col-start-7">
          <a
            href="#contact"
            className="label-mono group inline-flex items-center gap-4 bg-ivory px-7 py-4 text-noir transition-colors duration-500 hover:bg-ivory/85"
          >
            {hero.ctaPrimary}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#film"
            className="label-mono group inline-flex items-center gap-3 text-ivory/80 hover:text-ivory"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full border border-ivory/40 text-[9px] transition-colors duration-500 group-hover:bg-ivory group-hover:text-noir"
            >
              ▶
            </span>
            <span className="link-line pb-1">{hero.ctaSecondary}</span>
          </a>
        </div>

        <div className="hidden justify-end lg:col-span-1 lg:flex" aria-hidden="true">
          <span className="label-mono flex flex-col items-center gap-3 text-ivory/40">
            {hero.scroll}
            <span className="relative block h-12 w-px overflow-hidden bg-ivory/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_var(--ease-cine)_infinite] bg-ivory" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
