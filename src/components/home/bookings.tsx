import { Arrow } from "@/components/ui/button-link";
import { PrefillLink } from "@/components/ui/prefill-link";
import { SectionLabel } from "@/components/ui/section-label";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pathFor } from "@/i18n/routes";

type Props = { locale: Locale; copy: Dictionary["bookings"] };

/** EVENTS & BOOKINGS — trois contextes principaux, mariages en retrait. */
export function Bookings({ locale, copy }: Props) {
  return (
    <section id="bookings" aria-labelledby="bookings-title" className="relative border-t border-ivory/10 bg-noir">
      <div className="mx-auto max-w-[1680px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <SectionLabel index="06">{copy.label}</SectionLabel>
        <h2 id="bookings-title" data-split className="display mt-8 max-w-5xl text-[8.2vw] text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
          {copy.title}
        </h2>

        <ul className="mt-20 grid gap-px bg-ivory/10 lg:mt-24 lg:grid-cols-3">
          {copy.items.map((item, i) => (
            <li key={item.id} data-reveal data-reveal-delay={i * 0.08} className="bg-noir">
              <PrefillLink
                href="#contact"
                eventType={item.id}
                className="group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden p-8 transition-colors duration-700 hover:bg-anthracite lg:min-h-[440px] lg:p-10"
              >
                <span className="eyebrow text-champagne tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="display block text-3xl leading-[0.95] sm:text-4xl lg:text-[clamp(1.5rem,2.3vw,3rem)]">{item.name}</span>
                  <span className="mt-6 block max-w-sm leading-relaxed text-ivory/65">{item.text}</span>
                  <span className="eyebrow mt-10 inline-flex items-center gap-3 text-ivory transition-colors group-hover:text-champagne">
                    {copy.cta} <Arrow />
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
                />
              </PrefillLink>
            </li>
          ))}
        </ul>

        {/* Mariages : présent mais en retrait */}
        <div data-reveal className="mt-10 flex flex-col gap-4 border-b border-ivory/10 pb-10 sm:flex-row sm:items-baseline sm:gap-10">
          <p className="eyebrow shrink-0 text-ivory/50">{copy.weddings.label}</p>
          <p className="max-w-2xl text-sm leading-relaxed text-ivory/55">{copy.weddings.text}</p>
          <a
            href={pathFor("weddings", locale)}
            className="eyebrow group inline-flex shrink-0 items-center gap-3 text-ivory/80 transition-colors hover:text-champagne sm:ml-auto"
          >
            {copy.weddings.link} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
