"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

type Props = {
  user: string;
  domain: string;
  subject?: string;
  className?: string;
  /** Contenu du lien ; par défaut, l'adresse e-mail. */
  children?: ReactNode;
};

/**
 * Lien e-mail assemblé uniquement dans le navigateur : l'adresse n'apparaît
 * pas en clair dans le HTML, ce qui limite la collecte par les robots.
 */
export function EmailLink({ user, domain, subject, className, children }: Props) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!hydrated) {
    return (
      <a href="#contact" className={className}>
        {children ?? `${user} [at] ${domain}`}
      </a>
    );
  }

  const address = `${user}@${domain}`;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return (
    <a href={`mailto:${address}${query}`} className={className}>
      {children ?? address}
    </a>
  );
}
