"use client";

import { useEffect, useRef, useState } from "react";

import { getLenis } from "@/components/layout/smooth-scroll";
import { MediaTag } from "@/components/ui/media-tag";
import { SectionLabel } from "@/components/ui/section-label";
import { performances, type Performance } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = { locale: Locale; copy: Dictionary["performances"]; tags: Dictionary["mediaTag"] };

/**
 * SELECTED PERFORMANCES — grille vidéo.
 * Aperçu muet au survol ; un clic ouvre la vidéo en grand, toujours muette :
 * le son ne s'active que sur action volontaire du visiteur.
 */
export function Performances({ locale, copy, tags }: Props) {
  const [current, setCurrent] = useState<Performance | null>(null);

  return (
    <section id="performances" aria-labelledby="performances-title" className="relative border-t border-ivory/10 bg-noir">
      {/* Ancien lien rolladj.com/#gallery */}
      <span id="gallery" aria-hidden="true" />
      <div className="mx-auto max-w-[1680px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="04">{copy.label}</SectionLabel>
            <h2 id="performances-title" data-split className="display mt-8 text-[8.2vw] text-balance sm:text-5xl lg:text-[clamp(3rem,5vw,5.5rem)]">
              {copy.title}
            </h2>
          </div>
          <p data-reveal className="max-w-sm leading-relaxed text-ivory/60 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            {copy.intro}
          </p>
        </div>

        <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-6">
          {performances.map((item, i) => (
            <li key={item.id} data-reveal data-reveal-delay={(i % 3) * 0.08} className={i % 3 === 1 ? "lg:translate-y-16" : ""}>
              {item.video ? (
                <VideoTile item={item} locale={locale} copy={copy} tags={tags} onOpen={() => setCurrent(item)} />
              ) : (
                <PlaceholderTile item={item} locale={locale} copy={copy} />
              )}
            </li>
          ))}
        </ul>
      </div>

      <Lightbox item={current} locale={locale} copy={copy} onClose={() => setCurrent(null)} />
    </section>
  );
}

function VideoTile({
  item,
  locale,
  copy,
  tags,
  onOpen,
}: {
  item: Performance;
  locale: Locale;
  copy: Props["copy"];
  tags: Props["tags"];
  onOpen: () => void;
}) {
  const preview = useRef<HTMLVideoElement>(null);
  const video = item.video!;

  const play = () => {
    const v = preview.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!v.src) v.src = video.src;
    v.play().catch(() => {});
  };
  const stop = () => preview.current?.pause();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={play}
        onPointerLeave={stop}
        onFocus={play}
        onBlur={stop}
        className="group relative block aspect-[4/5] w-full overflow-hidden bg-anthracite text-left"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- image d'aperçu de la vidéo */}
        <img
          src={video.poster}
          alt=""
          loading="lazy"
          className="tone absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-105"
        />
        <video
          ref={preview}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="tone absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/10 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <span>
            <span className="eyebrow block text-champagne">{item.category[locale]}</span>
            <span className="display mt-3 block text-xl sm:text-2xl lg:text-3xl">{item.title[locale]}</span>
          </span>
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ivory/40 text-[10px] transition-colors duration-500 group-hover:border-champagne group-hover:bg-champagne group-hover:text-noir"
          >
            ▶
          </span>
        </span>
        <span className="sr-only">
          {copy.play} — {item.category[locale]}, {item.title[locale]}
        </span>
      </button>
      <MediaTag status={video.status} labels={tags} note={video.note} className="absolute left-3 top-3" />
    </div>
  );
}

function PlaceholderTile({ item, locale, copy }: { item: Performance; locale: Locale; copy: Props["copy"] }) {
  return (
    <div className="relative flex aspect-[4/5] flex-col justify-between border border-dashed border-ivory/15 bg-anthracite/40 p-6">
      <span className="eyebrow text-ivory/40">{copy.upcoming}</span>
      <span aria-hidden="true" className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-ivory/15 text-xs text-ivory/30">
        ▶
      </span>
      <span>
        <span className="eyebrow block text-champagne/80">{item.category[locale]}</span>
        <span className="display mt-3 block text-lg text-ivory/40 sm:text-xl lg:text-2xl">{item.title[locale]}</span>
      </span>
    </div>
  );
}

function Lightbox({
  item,
  locale,
  copy,
  onClose,
}: {
  item: Performance | null;
  locale: Locale;
  copy: Props["copy"];
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (item && !d.open) {
      d.showModal();
      getLenis()?.stop();
      video.current?.play().catch(() => {});
    }
    if (!item && d.open) d.close();
  }, [item]);

  const close = () => {
    video.current?.pause();
    setMuted(true);
    getLenis()?.start();
    onClose();
  };

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <dialog
      ref={dialog}
      onClose={close}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      aria-label={item ? `${item.category[locale]} — ${item.title[locale]}` : undefined}
      className="m-0 h-full max-h-none w-full max-w-none bg-noir/95 p-0 text-ivory backdrop:bg-noir/80"
    >
      {item?.video && (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-4 py-6">
          <div className="flex w-full max-w-5xl items-center justify-between gap-4">
            <p>
              <span className="eyebrow block text-champagne">{item.category[locale]}</span>
              <span className="display mt-2 block text-xl sm:text-2xl">{item.title[locale]}</span>
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={!muted}
                className="eyebrow border border-ivory/30 px-4 py-2.5 transition-colors hover:border-champagne hover:text-champagne"
              >
                {muted ? copy.soundOn : copy.soundOff}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => dialog.current?.close()}
                className="eyebrow bg-ivory px-4 py-2.5 text-noir transition-colors hover:bg-champagne"
              >
                {copy.close} ✕
              </button>
            </div>
          </div>
          <video
            ref={video}
            key={item.id}
            src={item.video.src}
            poster={item.video.poster}
            muted={muted}
            playsInline
            controls
            loop
            className={`min-h-0 flex-1 bg-black object-contain ${
              item.orientation === "landscape" ? "w-full max-w-5xl" : "max-h-full w-auto"
            }`}
          />
        </div>
      )}
    </dialog>
  );
}
