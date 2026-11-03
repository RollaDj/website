import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "ghost";
  children: ReactNode;
};

const base =
  "eyebrow group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 transition-colors duration-500";

const variants = {
  solid: "bg-ivory text-noir",
  ghost: "border border-ivory/30 text-ivory hover:border-champagne hover:text-noir",
};

/** Bouton-lien avec remplissage champagne au survol. */
export function ButtonLink({ variant = "solid", className = "", children, ...props }: Props) {
  return (
    <a {...props} className={`${base} ${variants[variant]} ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full bg-champagne transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0"
      />
      <span className="relative flex items-center gap-3">{children}</span>
    </a>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1 ${className}`}
    >
      →
    </span>
  );
}
