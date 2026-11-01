"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type PointerEvent } from "react";

type Frame = { id: string; image: StaticImageData; alt: string };

type Props = {
  frames: Frame[];
  frameLabel: string;
  previousLabel: string;
  nextLabel: string;
  regionLabel: string;
};

/**
 * Galerie façon pellicule : défilement horizontal natif (tactile, trackpad,
 * clavier), boutons précédent/suivant et glisser-déposer à la souris.
 */
export function FilmStrip({ frames, frameLabel, previousLabel, nextLabel, regionLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: trackRef.current.scrollLeft };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const delta = e.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(delta) > 4) {
      drag.current.moved = true;
      track.setPointerCapture(e.pointerId);
      track.dataset.dragging = "true";
    }
    if (drag.current.moved) track.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = () => {
    drag.current.active = false;
    if (trackRef.current) delete trackRef.current.dataset.dragging;
  };

  return (
    <div>
      <div
        ref={trackRef}
        role="region"
        aria-label={regionLabel}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="no-scrollbar cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-5 px-5 select-none focus-visible:outline-offset-[-1px] data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none sm:scroll-px-8 sm:px-8 lg:scroll-px-12 lg:px-12"
      >
        <ul className="flex w-max bg-[#171612]">
          {frames.map((frame, i) => (
            <li key={frame.id} className="snap-start px-1.5 first:pl-3 last:pr-3">
              <div aria-hidden="true" className="sprockets" />
              <figure className="group overflow-hidden">
                <div className="overflow-hidden">
                  <Image
                    src={frame.image}
                    alt={frame.alt}
                    placeholder="blur"
                    draggable={false}
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="mono-photo h-[min(52svh,440px)] min-h-[260px] w-auto transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="flex justify-between gap-6 px-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9b98f]/60">
                  <span aria-hidden="true">ROLLA ▸ 24</span>
                  <span>
                    {frameLabel} {String(i + 1).padStart(2, "0")}A
                  </span>
                </figcaption>
              </figure>
              <div aria-hidden="true" className="sprockets" />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-end gap-3 px-5 sm:px-8 lg:px-12">
        {[
          { dir: -1 as const, label: previousLabel, glyph: "←" },
          { dir: 1 as const, label: nextLabel, glyph: "→" },
        ].map((button) => (
          <button
            key={button.dir}
            type="button"
            onClick={() => scrollByPage(button.dir)}
            className="grid h-12 w-12 place-items-center border border-ivory/25 text-lg text-ivory/80 transition-colors duration-500 hover:bg-ivory hover:text-noir"
          >
            <span aria-hidden="true">{button.glyph}</span>
            <span className="sr-only">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
