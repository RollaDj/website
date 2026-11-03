"use client";

import { useEffect, useRef } from "react";

export type CutoutVideoSource = {
  /** Vidéo « côte à côte » : couleur à gauche, transparence (alpha) à droite. */
  src: string;
  /** Version allégée pour les petits écrans. */
  mobileSrc?: string;
  /** Première image détourée (WebP transparent), affichée avant la lecture. */
  poster: string;
  /** Image fixe détourée (animations réduites / navigateur sans WebGL). */
  still: string;
  /** Début de la boucle, en secondes : l'introduction n'est jouée qu'une fois. */
  loopStart: number;
};

type Props = CutoutVideoSource & { className?: string; alt: string };

const VERTEX = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

// Couleur dans la moitié gauche, alpha dans la moitié droite ; sortie prémultipliée.
const FRAGMENT = `
precision mediump float;
uniform sampler2D frame;
varying vec2 uv;
void main() {
  vec3 color = texture2D(frame, vec2(uv.x * 0.5, uv.y)).rgb;
  float alpha = texture2D(frame, vec2(0.5 + uv.x * 0.5, uv.y)).r;
  alpha = clamp((alpha - 0.03) / 0.94, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

/**
 * Vidéo détourée (fond transparent), rendue en WebGL.
 * L'introduction est jouée une fois, puis la boucle repart de `loopStart`.
 * Lecture suspendue hors écran ; image fixe si les animations sont réduites.
 */
export function CutoutVideo({ src, mobileSrc, poster, still, loopStart, className = "", alt }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    const img = imgRef.current!;

    const showStill = () => {
      img.src = still;
      img.style.opacity = "1";
      canvas.style.opacity = "0";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showStill();
      return;
    }

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) {
      showStill();
      return;
    }

    // ── Programme WebGL ──
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let shown = false;
    const draw = () => {
      if (video.readyState < 2) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
        img.style.opacity = "0";
      }
    };

    // ── Boucle de rendu : une texture par image vidéo ──
    type FrameVideo = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
      cancelVideoFrameCallback?: (id: number) => void;
    };
    const v = video as FrameVideo;
    let handle = 0;
    let running = false;
    const tick = () => {
      if (!running) return;
      draw();
      // Fin de la boucle : retour au début de la boucle (avant l'arrêt, sans à-coup).
      if (video.duration && video.currentTime >= video.duration - 0.12) video.currentTime = loopStart;
      handle = v.requestVideoFrameCallback ? v.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      video.play().catch(() => {});
      tick();
    };
    const stop = () => {
      running = false;
      video.pause();
      if (v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
    const onEnded = () => {
      video.currentTime = loopStart;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);

    video.src = mobileSrc && window.matchMedia("(max-width: 767px)").matches ? mobileSrc : src;
    const onReady = () => draw();
    video.addEventListener("loadeddata", onReady);

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(wrap.current!);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      stop();
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("loadeddata", onReady);
      video.removeAttribute("src");
      video.load();
    };
  }, [src, mobileSrc, still, loopStart]);

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- image détourée (transparence) */}
      <img
        ref={imgRef}
        src={poster}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500" />
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
    </div>
  );
}
