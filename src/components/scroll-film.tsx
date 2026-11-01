"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = { numeral: string; title: string; text: string };

type Props = {
  src: string;
  poster: string;
  fps: number;
  /** Début de chaque scène, en fraction (0 → 1) de la durée du film. */
  chapterStarts: readonly number[];
  chapters: Chapter[];
  label: string;
  hint: string;
  sceneLabel: string;
  description: string;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function formatTimecode(seconds: number, fps: number) {
  const frames = Math.max(0, Math.floor(seconds * fps));
  const parts = [
    Math.floor(frames / (fps * 3600)),
    Math.floor(frames / (fps * 60)) % 60,
    Math.floor(frames / fps) % 60,
    frames % fps,
  ];
  return parts.map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Film synchronisé au défilement.
 *
 * La section est haute de plusieurs écrans ; son contenu reste collé
 * (sticky) pendant que la progression du scroll pilote `video.currentTime`.
 * Le temps vidéo « glisse » vers la cible (lissage) pour un rendu fluide,
 * et la boucle d'animation ne tourne que lorsque la section est visible.
 */
export function ScrollFilm({
  src,
  poster,
  fps,
  chapterStarts,
  chapters,
  label,
  hint,
  sceneLabel,
  description,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const startsRef = useRef(chapterStarts);
  const [active, setActive] = useState(0);

  // 1. Chargement de la vidéo en mémoire (blob) : le positionnement
  //    dans la vidéo devient instantané, sans requêtes réseau en cours de scrub.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (connection?.saveData) return; // Économiseur de données : affiche (poster) seule.

    const controller = new AbortController();
    let objectUrl: string | null = null;

    const onLoaded = () => {
      // iOS Safari n'affiche les images lors d'un seek qu'après une lecture.
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };
    video.addEventListener("loadeddata", onLoaded, { once: true });

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
      })
      .catch(() => {
        if (!controller.signal.aborted) video.src = src; // Repli : lecture progressive.
      });

    return () => {
      controller.abort();
      video.removeEventListener("loadeddata", onLoaded);
      video.removeAttribute("src");
      video.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  // 2. Boucle scroll → temps vidéo + interface (timecode, progression, scènes).
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const starts = startsRef.current;
    let raf = 0;
    let running = false;
    let current = 0;
    let lastChapter = -1;
    let lastTimecode = "";
    let lastInset = -1;

    const render = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;

      // Temps vidéo
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration > 0) {
        const target = progress * Math.max(0, duration - 0.05);
        current = reducedMotion.matches ? target : current + (target - current) * 0.18;
        if (Math.abs(target - current) < 0.002) current = target;
        if (!video.seeking && Math.abs(video.currentTime - current) > 0.5 / fps) {
          video.currentTime = current;
        }
      }

      // Timecode
      const timecode = formatTimecode(current, fps);
      if (timecode !== lastTimecode && timecodeRef.current) {
        timecodeRef.current.textContent = timecode;
        lastTimecode = timecode;
      }

      // Barre de progression globale
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      // Ouverture « letterbox » du cadre au début du film
      const inset = reducedMotion.matches
        ? 0
        : Math.round((1 - easeOutCubic(clamp(progress / 0.1))) * 1400) / 100;
      if (inset !== lastInset && frameRef.current) {
        frameRef.current.style.clipPath = `inset(${inset}% 0 ${inset}% 0)`;
        lastInset = inset;
      }

      // Scène active + progression de chaque scène
      let chapter = 0;
      starts.forEach((start, i) => {
        const end = starts[i + 1] ?? 1;
        if (progress >= start) chapter = i;
        const bar = barsRef.current[i];
        if (bar) bar.style.transform = `scaleX(${clamp((progress - start) / (end - start))})`;
      });
      if (chapter !== lastChapter) {
        lastChapter = chapter;
        setActive(chapter);
      }
    };

    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
        render();
      }
    });
    observer.observe(section);
    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [fps]);

  return (
    <section
      ref={sectionRef}
      id="film"
      aria-labelledby="film-title"
      className="relative h-[420svh] bg-noir"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Barre supérieure : titre + timecode */}
        <div className="relative z-20 flex items-center justify-between gap-6 px-5 pt-20 sm:px-8 lg:px-12 lg:pt-24">
          <h2 id="film-title" className="label-mono text-ivory/70">
            {label}
            <span className="hidden text-ivory/35 sm:inline"> — {hint}</span>
          </h2>
          <p className="label-mono tabular-nums text-ivory/70" aria-hidden="true">
            <span className="mr-2 text-ivory/35">TC</span>
            <span ref={timecodeRef}>00:00:00:00</span>
          </p>
        </div>

        {/* Scène */}
        <div className="relative flex-1 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-14 lg:px-12 xl:gap-20">
          {/* Textes des scènes */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 sm:px-8 sm:pb-14 lg:static lg:max-w-md lg:justify-self-end lg:p-0">
            <div className="grid">
              {chapters.map((chapter, i) => (
                <article
                  key={chapter.numeral}
                  className={`[grid-area:1/1] transition-all duration-700 ease-[var(--ease-cine)] ${
                    i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
                  }`}
                >
                  <p className="label-mono text-ivory/55">
                    {sceneLabel} {chapter.numeral}
                  </p>
                  <h3 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-6xl xl:text-7xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ivory/70">
                    {chapter.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Cadre vidéo */}
          <div className="absolute inset-0 lg:relative lg:inset-auto">
            <div
              ref={frameRef}
              className="relative h-full w-full overflow-hidden [clip-path:inset(14%_0_14%_0)] lg:aspect-[9/16] lg:h-[min(70svh,860px)] lg:w-auto"
            >
              <video
                ref={videoRef}
                poster={poster}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden="true"
                tabIndex={-1}
                className="h-full w-full object-cover"
              />
              {/* Dégradés de lisibilité (mobile) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-noir/60 lg:hidden"
              />
            </div>
            {/* Repères d'angle du viseur (desktop) */}
            <span aria-hidden="true" className="pointer-events-none absolute -left-4 -top-4 hidden h-6 w-6 border-l border-t border-ivory/50 lg:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -right-4 -top-4 hidden h-6 w-6 border-r border-t border-ivory/50 lg:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 -left-4 hidden h-6 w-6 border-b border-l border-ivory/50 lg:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 -right-4 hidden h-6 w-6 border-b border-r border-ivory/50 lg:block" />
          </div>

          {/* Index des scènes (desktop) */}
          <ol aria-hidden="true" className="hidden flex-col gap-8 lg:flex">
            {chapters.map((chapter, i) => (
              <li
                key={chapter.numeral}
                className={`transition-colors duration-700 ${i === active ? "text-ivory" : "text-ivory/30"}`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="label-mono w-8">{chapter.numeral}</span>
                  <span className="font-serif text-2xl xl:text-3xl">{chapter.title}</span>
                </div>
                <div className="ml-12 mt-3 h-px w-36 bg-ivory/15">
                  <span
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    className="block h-full origin-left scale-x-0 bg-ivory"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Progression globale */}
        <div aria-hidden="true" className="relative z-20 mx-5 mb-5 h-px bg-ivory/10 sm:mx-8 lg:mx-12 lg:mb-8">
          <div ref={progressRef} className="h-full origin-left scale-x-0 bg-ivory" />
        </div>
      </div>

      <p className="sr-only">{description}</p>
    </section>
  );
}
