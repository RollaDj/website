"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;

/** Accès au défilement doux (pour le suspendre pendant une modale). */
export const getLenis = () => instance;

/**
 * Défilement doux (Lenis) synchronisé avec GSAP ScrollTrigger.
 * Désactivé si le visiteur demande de réduire les animations ; le défilement
 * tactile reste natif sur mobile.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      anchors: { offset: 0 },
      autoRaf: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
