import type { Dictionary } from "@/i18n/dictionaries";
import { BOOKING_EMAIL, SOCIALS } from "@/lib/site";

import { EmailLink } from "./email-link";
import { SectionHeading } from "./section-heading";
import { SocialIcon } from "./social-icon";

type Props = {
  contact: Dictionary["contact"];
  newTab: string;
};

export function Contact({ contact, newTab }: Props) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden border-t border-ivory/10"
    >
      {/* Titre fantôme en arrière-plan */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -z-10 -translate-x-1/2 select-none font-serif text-[38vw] leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(239,233,221,0.09)]"
      >
        ROLLA
      </p>

      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
        <div className="reveal grid gap-14 lg:grid-cols-12">
          <SectionHeading
            index={contact.index}
            label={contact.label}
            id="contact-title"
            className="lg:col-span-7 [&_h2]:text-6xl [&_h2]:sm:text-7xl [&_h2]:lg:text-8xl [&_h2]:xl:text-9xl"
          >
            {contact.titleA}
            <br />
            <em className="text-ivory/55">{contact.titleB}</em>
          </SectionHeading>

          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="text-base leading-relaxed text-ivory/70">{contact.text}</p>

            <EmailLink
              user={BOOKING_EMAIL.user}
              domain={BOOKING_EMAIL.domain}
              subject={contact.mailSubject}
              className="label-mono group mt-10 inline-flex items-center justify-between gap-4 bg-ivory px-7 py-5 text-noir transition-colors duration-500 hover:bg-ivory/85"
            >
              {contact.cta}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </EmailLink>

            <p className="label-mono mt-8 text-ivory/40">{contact.emailLabel}</p>
            <EmailLink
              user={BOOKING_EMAIL.user}
              domain={BOOKING_EMAIL.domain}
              subject={contact.mailSubject}
              className="link-line mt-2 self-start pb-1 font-serif text-3xl text-ivory sm:text-4xl"
            />
          </div>
        </div>

        <div className="reveal mt-24 flex flex-col gap-6 border-t border-ivory/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-ivory/40">{contact.follow}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono group inline-flex items-center gap-3 text-ivory/70 transition-colors duration-300 hover:text-ivory"
                >
                  <SocialIcon id={social.id} />
                  <span className="link-line pb-1">{social.label}</span>
                  <span className="sr-only">{newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
