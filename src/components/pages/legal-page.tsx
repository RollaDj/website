import { EmailLink } from "@/components/ui/email-link";
import { SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = { locale: Locale; dict: Dictionary };

/** Mentions légales et confidentialité. Les champs « À compléter » sont à renseigner. */
export function LegalPage({ dict }: Props) {
  const t = dict.legal;
  const s = t.sections;
  const todo = <span className="border border-dashed border-champagne/60 px-2 py-0.5 text-champagne">{t.todo}</span>;
  const email = <EmailLink user={SITE.email.user} domain={SITE.email.domain} className="text-champagne underline underline-offset-4" />;

  const block = "border-t border-ivory/10 py-10 lg:grid lg:grid-cols-12 lg:gap-8";
  const heading = "eyebrow text-champagne lg:col-span-3";
  const body = "mt-5 space-y-4 leading-relaxed text-ivory/70 lg:col-span-8 lg:col-start-5 lg:mt-0";

  return (
    <article className="mx-auto max-w-[1680px] px-5 pb-28 pt-36 sm:px-8 lg:px-12 lg:pt-44">
      <h1 data-split className="display text-[9vw] sm:text-6xl xl:text-8xl">
        {t.title}
      </h1>

      <div className="mt-20">
        <section className={block}>
          <h2 className={heading}>{s.publisher}</h2>
          <dl className={body}>
            {s.publisherFields.map((field) => (
              <div key={field} className="flex flex-wrap gap-x-4 gap-y-1">
                <dt className="text-ivory/45">{field} :</dt>
                <dd>{todo}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={block}>
          <h2 className={heading}>{s.contact}</h2>
          <div className={body}>
            <p>{email}</p>
          </div>
        </section>

        <section className={block}>
          <h2 className={heading}>{s.host}</h2>
          <div className={body}>
            <p>{s.hostText}</p>
          </div>
        </section>

        <section className={block}>
          <h2 className={heading}>{s.ip}</h2>
          <div className={body}>
            <p>{s.ipText}</p>
          </div>
        </section>

        <section id="privacy" className={`${block} scroll-mt-24`}>
          <h2 className={heading}>{s.privacy}</h2>
          <div className={body}>
            <p>{s.privacyText[0]}</p>
            <p>{s.privacyText[1]}</p>
            <p>
              {s.privacyText[2]} {email}.
            </p>
          </div>
        </section>

        <section className={block}>
          <h2 className={heading}>{s.cookies}</h2>
          <div className={body}>
            <p>{s.cookiesText}</p>
          </div>
        </section>
      </div>
    </article>
  );
}
