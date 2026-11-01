import type { Dictionary } from "@/i18n/dictionaries";
import { CLIENTS } from "@/lib/site";

type Props = { credits: Dictionary["credits"] };

/** « Ils m'ont fait confiance », mis en page comme un générique de fin. */
export function Credits({ credits }: Props) {
  return (
    <section
      id="credits"
      aria-labelledby="credits-title"
      className="border-y border-ivory/10 bg-ink px-5 py-28 text-center sm:px-8 lg:px-12 lg:py-40"
    >
      <div className="reveal">
        <p className="label-mono text-ivory/50">
          <span className="tabular-nums">{credits.index}</span>
          <span aria-hidden="true" className="mx-4 inline-block h-px w-10 bg-ivory/30 align-middle" />
          {credits.label}
        </p>
        <h2
          id="credits-title"
          className="mx-auto mt-6 max-w-4xl font-serif text-5xl leading-[0.95] text-balance sm:text-6xl lg:text-7xl"
        >
          {credits.title}
        </h2>
        <p className="label-mono mt-16 text-ivory/40">{credits.lead}</p>
      </div>

      <ul className="reveal mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-y-7">
        {CLIENTS.map((client) => (
          <li key={client} className="font-serif text-xl leading-tight text-ivory/80 sm:text-2xl lg:text-[1.75rem]">
            {client}
          </li>
        ))}
      </ul>
    </section>
  );
}
