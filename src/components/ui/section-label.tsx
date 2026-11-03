type Props = { index?: string; children: React.ReactNode; className?: string };

/** Libellé de section : numéro + filet + titre court. */
export function SectionLabel({ index, children, className = "" }: Props) {
  return (
    <p className={`eyebrow flex items-center gap-4 text-ivory/55 ${className}`}>
      {index && <span className="tabular-nums text-champagne">{index}</span>}
      <span aria-hidden="true" className="h-px w-10 bg-ivory/25" />
      <span>{children}</span>
    </p>
  );
}
