"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

type Props = {
  user: string;
  domain: string;
  subject?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Lien e-mail assemblé uniquement dans le navigateur : l'adresse
 * n'apparaît pas en clair dans le HTML (limite la collecte par les robots).
 */
export function EmailLink({ user, domain, subject, className, children }: Props) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!hydrated) {
    return <span className={className}>{children ?? `${user} [at] ${domain}`}</span>;
  }

  const address = `${user}@${domain}`;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return (
    <a href={`mailto:${address}${query}`} className={className}>
      {children ?? address}
    </a>
  );
}
