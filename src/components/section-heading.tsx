import type { ReactNode } from "react";

type Props = {
  index: string;
  label: string;
  id?: string;
  children: ReactNode;
  className?: string;
};

/** Titre de section : numéro de bobine, libellé mono, grand titre serif. */
export function SectionHeading({ index, label, id, children, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="label-mono flex items-center gap-4 text-ivory/50">
        <span className="tabular-nums">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-ivory/30" />
        <span>{label}</span>
      </p>
      <h2
        id={id}
        className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-balance sm:text-6xl lg:text-7xl"
      >
        {children}
      </h2>
    </div>
  );
}
