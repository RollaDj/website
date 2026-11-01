import Image from "next/image";

import { MediaTag } from "@/components/ui/media-tag";
import { SectionLabel } from "@/components/ui/section-label";
import { artistPortraitMedia } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = { locale: Locale; dict: Dictionary };

export function Artist({ locale, dict }: Props) {
  const { artist } = dict;
  const media = artistPortraitMedia;

  return (
    <section id="artist" aria-labelledby="artist-title" className="relative bg-noir">
      {/* Ancien lien rolladj.com/#about */}
      <span id="about" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1680px] gap-16 px-5 py-28 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-44">
        <figure className="relative lg:col-span-6">
          <div data-reveal-image className="relative aspect-[4/5] overflow-hidden bg-anthracite lg:aspect-auto lg:h-[88vh] lg:max-h-[980px]">
            <div data-parallax className="absolute inset-0">
              <Image
                src={media.image}
                alt={media.alt[locale]}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="tone object-cover object-[60%_center]"
              />
            </div>
          </div>
          <MediaTag status={media.status} labels={dict.mediaTag} note={media.note} className="absolute left-4 top-4" />
        </figure>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <SectionLabel index="02">{artist.label}</SectionLabel>
          <h2 id="artist-title" data-split className="display mt-8 text-[8.2vw] text-balance sm:text-5xl lg:text-[clamp(2.5rem,3.9vw,4.5rem)]">
            {artist.titleA} <span className="text-champagne">{artist.titleB}</span>
          </h2>
          <div data-reveal className="mt-12 space-y-6 text-base leading-[1.8] text-ivory/70 lg:text-[1.0625rem]">
            {artist.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 20)}>{paragraph}</p>
            ))}
          </div>
          <dl data-reveal className="mt-14 grid grid-cols-3 gap-6 border-t border-ivory/15 pt-8">
            {artist.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className="eyebrow order-2 mt-3 text-[0.625rem] text-ivory/45">{fact.label}</dt>
                <dd className="display order-1 text-3xl sm:text-4xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
