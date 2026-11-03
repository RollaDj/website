"use client";

import { useSyncExternalStore } from "react";

/**
 * Suit une media query CSS. `serverValue` est utilisé lors du rendu serveur
 * et de l'hydratation, puis la valeur réelle du navigateur prend le relais.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
