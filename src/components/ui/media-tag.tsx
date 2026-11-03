import { SHOW_MEDIA_TAGS, type MediaStatus } from "@/content/media";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = {
  status: MediaStatus;
  labels: Dictionary["mediaTag"];
  /** Note interne (affichée au survol) : quoi fournir pour remplacer ce média. */
  note?: string;
  className?: string;
};

/**
 * Étiquette discrète signalant un média provisoire ou à remplacer.
 * Désactivable globalement via SHOW_MEDIA_TAGS (src/content/media.ts).
 */
export function MediaTag({ status, labels, note, className = "" }: Props) {
  if (!SHOW_MEDIA_TAGS || status === "final") return null;
  return (
    <span
      title={note}
      className={`eyebrow pointer-events-auto inline-flex items-center gap-2 border border-dashed border-champagne/50 bg-noir/70 px-2.5 py-1.5 text-[0.625rem] tracking-[0.2em] text-champagne backdrop-blur-sm ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-champagne" />
      {status === "placeholder" ? labels.placeholder : labels.temporary}
    </span>
  );
}
