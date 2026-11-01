import Image from "next/image";

import type { Dictionary } from "@/i18n/dictionaries";
import { photos } from "@/lib/media";

import { SectionHeading } from "./section-heading";

type Props = {
  artist: Dictionary["artist"];
  photoAlts: Dictionary["photos"];
};

export function Artist({ artist, photoAlts }: Props) {
  return (
    <section
      id="artist"
      aria-labelledby="artist-title"
      className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-44"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <figure className="reveal relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={photos[artist.portrait]}
              alt={photoAlts[artist.portrait]}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="mono-photo object-cover"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 -z-10 hidden h-full w-full border border-ivory/15 sm:block"
          />
          <figcaption className="label-mono mt-8 flex justify-between text-ivory/40">
            <span>ROLLA</span>
            <span>Lyon — FR</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <SectionHeading index={artist.index} label={artist.label} id="artist-title" className="reveal">
            {artist.titleA}
            <br />
            <em className="text-ivory/55">{artist.titleB}</em>
          </SectionHeading>

          <div className="reveal mt-12 space-y-6 text-base leading-[1.85] text-ivory/70 lg:text-[1.0625rem]">
            {artist.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="reveal mt-16 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {artist.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col border-t border-ivory/15 pt-5">
                <dt className="label-mono order-2 mt-3 text-ivory/45">{stat.label}</dt>
                <dd className="order-1 font-serif text-5xl leading-none">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
