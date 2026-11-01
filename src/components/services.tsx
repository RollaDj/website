import Image from "next/image";

import type { Dictionary } from "@/i18n/dictionaries";
import { photos } from "@/lib/media";

import { SectionHeading } from "./section-heading";

type Props = {
  services: Dictionary["services"];
  photoAlts: Dictionary["photos"];
};

export function Services({ services, photoAlts }: Props) {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="border-t border-ivory/10 bg-ink"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index={services.index} label={services.label} id="services-title">
            {services.title}
          </SectionHeading>
          <p className="max-w-xs font-serif text-2xl italic leading-snug text-ivory/55 lg:text-right">
            {services.intro}
          </p>
        </div>

        <ol className="mt-20 grid gap-14 md:grid-cols-3 md:gap-6 lg:mt-24 lg:gap-10">
          {services.items.map((item, i) => (
            <li key={item.id} className="reveal group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={photos[item.photo]}
                  alt={photoAlts[item.photo]}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 32vw, 100vw"
                  className="mono-photo object-cover transition-transform duration-[1.6s] ease-[var(--ease-cine)] group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
                />
                <span className="label-mono absolute left-4 top-4 bg-noir/75 px-2.5 py-1.5 text-ivory tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-8 font-serif text-4xl leading-none">{item.title}</h3>
              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ivory/65">{item.text}</p>
              <p className="label-mono mt-6 text-ivory/40">{item.tags.join("  ·  ")}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
