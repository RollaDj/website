import type { Dictionary } from "@/i18n/dictionaries";
import { galleryOrder, photos } from "@/lib/media";

import { FilmStrip } from "./film-strip";
import { SectionHeading } from "./section-heading";

type Props = {
  gallery: Dictionary["gallery"];
  photoAlts: Dictionary["photos"];
};

export function Gallery({ gallery, photoAlts }: Props) {
  const frames = galleryOrder.map((id) => ({ id, image: photos[id], alt: photoAlts[id] }));

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-28 lg:py-40">
      <div className="reveal mx-auto flex max-w-[1600px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <SectionHeading index={gallery.index} label={gallery.label} id="gallery-title">
          <em>{gallery.title}</em>
        </SectionHeading>
        <p className="label-mono text-ivory/40">{gallery.hint} →</p>
      </div>

      <div className="reveal mt-16 lg:mt-20">
        <FilmStrip
          frames={frames}
          frameLabel={gallery.frame}
          previousLabel={gallery.previous}
          nextLabel={gallery.next}
          regionLabel={gallery.title}
        />
      </div>
    </section>
  );
}
