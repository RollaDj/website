"use client";

import { useEffect, useRef } from "react";

import { MediaTag } from "@/components/ui/media-tag";
import { experienceMedia as media } from "@/content/media";
import { REDUCED_MOTION, useMediaQuery } from "@/hooks/use-media-query";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  copy: Dictionary["experience"];
  tags: Dictionary["mediaTag"];
};

/** Ordinateur (écran large + souris) : vidéo. Sinon : séquence d'images. */
const DESKTOP = "(min-width: 768px) and (pointer: fine)";
/** Longueur du défilement pendant lequel la section reste épinglée. */
const SCROLL_LENGTH = 4;

type Mode = "video" | "frames";

/**
 * THE EXPERIENCE — séquence synchronisée au défilement.
 * La progression du scroll pilote l'image affichée ; les mots RHYTHM /
 * TRUMPET / ENERGY apparaissent à des instants précis (experienceMedia.cues), puis
 * le cadre se referme pour laisser place à la section suivante.
 */
export function Experience(props: Props) {
  const reduced = useMediaQuery(REDUCED_MOTION);
  const desktop = useMediaQuery(DESKTOP, true);
  if (reduced) return <StaticExperience {...props} />;
  return <ScrollExperience {...props} mode={desktop ? "video" : "frames"} />;
}

function ScrollExperience({ copy, tags, mode }: Props & { mode: Mode }) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef(0);
  /** Dessine l'image correspondant à la progression p (0 → 1). */
  const drawRef = useRef<(p: number) => void>(() => {});

  // ── Chargement des médias (avec indicateur de progression) ──────────────
  useEffect(() => {
    const controller = new AbortController();
    const showProgress = (ratio: number) => {
      const el = loaderRef.current;
      if (!el) return;
      el.textContent = `${copy.loading} ${Math.round(ratio * 100)} %`;
      if (ratio >= 1) el.dataset.done = "true";
    };

    if (mode === "video") {
      const video = videoRef.current!;
      let objectUrl: string | null = null;
      let pending: number | null = null;

      const seek = (t: number) => {
        if (video.seeking) pending = t;
        else if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
      };
      const onSeeked = () => {
        if (pending !== null) {
          const t = pending;
          pending = null;
          seek(t);
        }
      };
      video.addEventListener("seeked", onSeeked);

      drawRef.current = (p) => {
        if (!Number.isFinite(video.duration) || video.duration === 0) return;
        seek(p * Math.max(0, video.duration - 0.04));
      };

      const onReady = () => {
        // iOS / Safari : une lecture initiale débloque l'affichage lors des seeks.
        video.play().then(() => video.pause()).catch(() => {}).finally(() => drawRef.current(progressRef.current));
      };
      video.addEventListener("loadeddata", onReady, { once: true });

      loadAsBlob(media.video, controller.signal, showProgress)
        .then((url) => {
          objectUrl = url;
          video.src = url;
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          video.src = media.video; // Repli : lecture progressive.
          showProgress(1);
        });

      return () => {
        controller.abort();
        video.removeEventListener("seeked", onSeeked);
        video.removeEventListener("loadeddata", onReady);
        video.removeAttribute("src");
        video.load();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }

    // Séquence d'images (mobile)
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { count, path } = media.frames;
    const images: (HTMLImageElement | null)[] = Array(count).fill(null);
    let lastDrawn = -1;
    let loaded = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawn = -1;
      drawRef.current(progressRef.current);
    };

    drawRef.current = (p) => {
      const target = Math.round(p * (count - 1));
      // Image chargée la plus proche de la cible.
      let index = -1;
      for (let d = 0; d < count && index < 0; d++) {
        if (images[target - d]) index = target - d;
        else if (images[target + d]) index = target + d;
      }
      if (index < 0 || index === lastDrawn) return;
      lastDrawn = index;
      const img = images[index]!;
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    // Chargement : d'abord une image sur 6 (aperçu rapide), puis le reste.
    const order = [...Array(count).keys()].sort((a, b) => (a % 6 === 0 ? 0 : 1) - (b % 6 === 0 ? 0 : 1) || a - b);
    let cursor = 0;
    const next = () => {
      if (controller.signal.aborted || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = path(i + 1);
      img
        .decode()
        .then(() => {
          images[i] = img;
          lastDrawn = -1;
          drawRef.current(progressRef.current);
        })
        .catch(() => {})
        .finally(() => {
          loaded += 1;
          showProgress(loaded / count);
          next();
        });
    };
    for (let k = 0; k < 6; k++) next();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      controller.abort();
      observer.disconnect();
    };
  }, [mode, copy.loading]);

  // ── Timeline synchronisée au scroll ────────────────────────────────────
  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const segments = gsap.utils.toArray<HTMLElement>("[data-segment]");
      const state = { p: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * SCROLL_LENGTH}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Progression de l'image (toute la durée de la timeline = 1)
      tl.to(
        state,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            progressRef.current = state.p;
            drawRef.current(state.p);
          },
        },
        0,
      );

      // Introduction : libellé et indication de défilement
      tl.to("[data-exp-intro]", { autoAlpha: 0, y: -40, duration: 0.07, ease: "power2.in" }, 0.03);

      // Les trois mots
      media.cues.forEach(([start, end], i) => {
        const chapter = chapters[i];
        if (!chapter) return;
        const word = chapter.querySelector<HTMLElement>("[data-word]")!;
        const text = chapter.querySelector<HTMLElement>("[data-text]")!;
        const split = SplitText.create(word, { type: "words,chars", mask: "chars", charsClass: "char" });

        tl.set(chapter, { autoAlpha: 1 }, start)
          .fromTo(split.chars, { yPercent: 125 }, { yPercent: 0, duration: 0.06, stagger: 0.004, ease: "power4.out" }, start)
          .fromTo(text, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, start + 0.035)
          .to(split.chars, { yPercent: -125, duration: 0.05, stagger: 0.003, ease: "power3.in" }, end - 0.055)
          .to(text, { autoAlpha: 0, y: -16, duration: 0.04, ease: "power2.in" }, end - 0.05)
          .set(chapter, { autoAlpha: 0 }, end);

        if (segments[i]) tl.fromTo(segments[i], { scaleX: 0 }, { scaleX: 1, duration: end - start }, start);
      });

      // Transition vers la section suivante : le cadre se referme
      tl.to("[data-exp-frame]", { clipPath: "inset(10% 8% 10% 8% round 2px)", duration: 0.06, ease: "power2.inOut" }, 0.935)
        .to("[data-exp-frame]", { autoAlpha: 0, duration: 0.03 }, 0.97)
        .to("[data-exp-ui]", { autoAlpha: 0, duration: 0.04 }, 0.94);

      ScrollTrigger.refresh();
    },
    // revertOnUpdate : la timeline et l'épinglage sont recréés proprement
    // lorsque le mode change (vidéo ↔ séquence d'images).
    { scope: root, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="experience"
      aria-labelledby="experience-title"
      className="relative h-svh overflow-hidden bg-noir"
    >
      {/* Média synchronisé */}
      <div data-exp-frame className="absolute inset-0 [clip-path:inset(0%_0%_0%_0%)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- image d'attente plein écran */}
        <img src={media.poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        {mode === "video" ? (
          <video
            ref={videoRef}
            poster={media.poster}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/50 via-transparent to-noir/70" />
      </div>

      {/* Libellé d'ouverture */}
      <div data-exp-intro className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <h2 id="experience-title" className="eyebrow text-champagne">
          {copy.label}
        </h2>
        <p className="display mt-6 max-w-4xl text-[8vw] text-balance sm:text-5xl lg:text-6xl xl:text-7xl">{copy.intro}</p>
        <p className="eyebrow mt-10 flex items-center gap-3 text-ivory/50" aria-hidden="true">
          <span className="relative block h-8 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-champagne" />
          </span>
          {copy.hint}
        </p>
      </div>

      {/* Les mots, superposés (aria-hidden : versions accessibles plus bas) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center px-5 sm:px-8 lg:px-12">
        <div className="grid w-full">
          {copy.chapters.map((chapter, i) => (
            <div key={chapter.word} data-chapter className="invisible [grid-area:1/1]">
              <p className="eyebrow mb-6 text-champagne">
                {String(i + 1).padStart(2, "0")} / {String(copy.chapters.length).padStart(2, "0")}
              </p>
              <p data-word className="display text-[10.6vw] leading-[0.84] tracking-[-0.03em]">
                {chapter.word}
              </p>
              <p data-text className="mt-8 max-w-md text-base leading-relaxed text-ivory/80 sm:text-lg lg:ml-[0.3vw]">
                {chapter.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interface : progression des trois temps + chargement */}
      <div data-exp-ui className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 lg:px-12 lg:pb-8">
        <div className="flex items-end justify-between gap-4">
          <p
            ref={loaderRef}
            aria-hidden="true"
            className="eyebrow text-ivory/50 transition-opacity duration-700 data-[done=true]:opacity-0"
          >
            {copy.loading}
          </p>
          <MediaTag status={media.status} labels={tags} note={media.note} />
        </div>
        <ol aria-hidden="true" className="mt-4 grid grid-cols-3 gap-3 sm:gap-6">
          {copy.chapters.map((chapter) => (
            <li key={chapter.word}>
              <span className="block h-px bg-ivory/15">
                <span data-segment className="block h-full origin-left scale-x-0 bg-champagne" />
              </span>
              <span className="eyebrow mt-3 block truncate text-[0.625rem] text-ivory/45">{chapter.word}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Version accessible des textes */}
      <div className="sr-only">
        <p>{copy.description}</p>
        <ol>
          {copy.chapters.map((chapter) => (
            <li key={chapter.word}>
              {chapter.word} {chapter.text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Variante fixe (animations réduites) : image + les trois temps lisibles. */
function StaticExperience({ copy, tags }: Props) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative overflow-hidden bg-noir">
      {/* eslint-disable-next-line @next/next/no-img-element -- image fixe décorative */}
      <img src={media.still} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <h2 id="experience-title" className="eyebrow text-champagne">
          {copy.label}
        </h2>
        <p className="display mt-6 max-w-4xl text-[8vw] sm:text-5xl lg:text-6xl">{copy.intro}</p>
        <ol className="mt-20 grid gap-14 lg:grid-cols-3">
          {copy.chapters.map((chapter) => (
            <li key={chapter.word}>
              <p className="display text-4xl lg:text-[3.1vw]">{chapter.word}</p>
              <p className="mt-5 max-w-sm leading-relaxed text-ivory/75">{chapter.text}</p>
            </li>
          ))}
        </ol>
        <MediaTag status={media.status} labels={tags} note={media.note} className="mt-16" />
      </div>
    </section>
  );
}

/** Télécharge un fichier en mémoire en suivant la progression. */
async function loadAsBlob(url: string, signal: AbortSignal, onProgress: (ratio: number) => void) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const total = Number(response.headers.get("content-length")) || 0;
  if (!response.body || !total) {
    const blob = await response.blob();
    onProgress(1);
    return URL.createObjectURL(blob);
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.min(received / total, 0.99));
  }
  onProgress(1);
  return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: response.headers.get("content-type") ?? "video/mp4" }));
}
