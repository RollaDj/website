"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import type { EventType } from "@/lib/contact";

export const PREFILL_EVENT = "rolla:prefill";
export type PrefillDetail = { eventType?: EventType; format?: string };

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & PrefillDetail & { children: ReactNode };

/** Lien vers le formulaire qui pré-remplit le type d'événement ou le format. */
export function PrefillLink({ eventType, format, onClick, children, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { eventType, format } }));
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
