import { EmailLink } from "@/components/ui/email-link";
import { SectionLabel } from "@/components/ui/section-label";
import { SocialLinks } from "@/components/ui/social-links";
import { SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pathFor } from "@/i18n/routes";
import type { EventType } from "@/lib/contact";

import { ContactForm } from "./contact-form";

type Props = {
  locale: Locale;
  dict: Dictionary;
  index?: string;
  title?: string;
  text?: string;
  defaultEventType?: EventType;
};

export function ContactSection({ locale, dict, index, title, text, defaultEventType }: Props) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-ivory/10 bg-noir">
      <div className="mx-auto grid max-w-[1680px] gap-16 px-5 py-28 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-40">
        <div className="lg:col-span-12">
          <SectionLabel index={index}>{dict.contact.label}</SectionLabel>
          <h2 id="contact-title" data-split className="display mt-8 max-w-[14ch] text-[10vw] text-balance sm:text-6xl lg:text-[7.4vw] 2xl:text-[8.5rem]">
            {title ?? dict.contact.title}
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p data-reveal className="max-w-md leading-relaxed text-ivory/70">
            {text ?? dict.contact.text}
          </p>

          <div data-reveal className="mt-14 space-y-10">
            <div>
              <p className="eyebrow text-ivory/45">{dict.contact.direct}</p>
              <EmailLink
                user={SITE.email.user}
                domain={SITE.email.domain}
                className="link-underline mt-3 inline-block pb-1 text-xl text-ivory transition-colors hover:text-champagne sm:text-2xl"
              />
            </div>
            <div>
              <p className="eyebrow mb-4 text-ivory/45">{dict.contact.follow}</p>
              <SocialLinks newTabLabel={dict.a11y.newTab} />
            </div>
          </div>
        </div>

        <div data-reveal className="lg:col-span-6 lg:col-start-7">
          <ContactForm
            locale={locale}
            form={dict.form}
            privacyHref={pathFor("legal", locale, "privacy")}
            defaultEventType={defaultEventType}
          />
        </div>
      </div>
    </section>
  );
}
