import { SOCIALS, type SocialId } from "@/content/site";

const icons: Record<SocialId, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  youtube: (
    <>
      <path d="M22 12s0-3.3-.4-4.8a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8C2 8.7 2 12 2 12s0 3.3.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.5.4-4.8.4-4.8Z" />
      <path d="m10 15 5-3-5-3v6Z" />
    </>
  ),
  soundcloud: <path d="M20 16H8a4 4 0 0 1 0-8 4.7 4.7 0 0 1 1 .1A6 6 0 0 1 20 11.5a2.3 2.3 0 0 1 0 4.5Z" />,
  facebook: <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />,
};

type Props = { newTabLabel: string; className?: string; withLabels?: boolean };

export function SocialLinks({ newTabLabel, className = "", withLabels = true }: Props) {
  return (
    <ul className={`flex flex-wrap gap-x-7 gap-y-3 ${className}`}>
      {SOCIALS.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={withLabels ? undefined : `${social.label} ${newTabLabel}`}
            className="eyebrow group inline-flex items-center gap-2.5 text-ivory/65 transition-colors duration-300 hover:text-champagne"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              {icons[social.id]}
            </svg>
            {withLabels && (
              <>
                <span>{social.label}</span>
                <span className="sr-only">{newTabLabel}</span>
              </>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
