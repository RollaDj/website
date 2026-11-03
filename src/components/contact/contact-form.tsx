"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";

import { sendContact, type ContactState } from "@/app/actions/contact";
import { EmailLink } from "@/components/ui/email-link";
import { PREFILL_EVENT, type PrefillDetail } from "@/components/ui/prefill-link";
import { SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  EVENT_TYPES,
  LIMITS,
  readContact,
  validateContact,
  type ContactErrors,
  type ContactField,
  type EventType,
} from "@/lib/contact";

type Props = {
  locale: Locale;
  form: Dictionary["form"];
  privacyHref: string;
  defaultEventType?: EventType;
};

const initialState: ContactState = { status: "idle" };

const fieldBase =
  "w-full border-0 border-b border-ivory/20 bg-transparent px-0 py-3 text-base text-ivory placeholder:text-ivory/30 transition-colors duration-300 focus:border-champagne focus:outline-none focus:ring-0 aria-[invalid=true]:border-[#d8a28f]";

/** Le formulaire est recréé (état remis à zéro) après un envoi réussi. */
export function ContactForm(props: Props) {
  const [round, setRound] = useState(0);
  return <FormBody key={round} {...props} onReset={() => setRound((r) => r + 1)} />;
}

function FormBody({ locale, form: t, privacyHref, defaultEventType, onReset }: Props & { onReset: () => void }) {
  const [state, action, pending] = useActionState(sendContact, initialState);
  const [clientErrors, setClientErrors] = useState<ContactErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const elapsedRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  const errors = { ...(state.status === "invalid" ? state.errors : {}), ...clientErrors };
  const values = state.values ?? {};

  // Début de saisie (antispam), mesuré avec l'horloge locale du navigateur.
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  // Pré-remplissage depuis les liens « Réserver » / « Parler de ce format ».
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const { eventType, format } = (event as CustomEvent<PrefillDetail>).detail;
      const el = formRef.current;
      if (!el) return;
      if (eventType) (el.elements.namedItem("eventType") as HTMLSelectElement).value = eventType;
      if (format) {
        const message = el.elements.namedItem("message") as HTMLTextAreaElement;
        if (!message.value.trim()) message.value = `Format : ${format}\n\n`;
      }
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  // Annonce et met en vue le résultat de l'envoi.
  useEffect(() => {
    if (state.status !== "idle" && state.status !== "invalid") {
      statusRef.current?.focus();
    }
  }, [state]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (elapsedRef.current) {
      elapsedRef.current.value = String(Math.round(performance.now() - mountedAt.current));
    }
    const found = validateContact(readContact(new FormData(event.currentTarget)));
    setClientErrors(found);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      const first = Object.keys(found)[0] as ContactField;
      (event.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
    }
  };

  const clearError = (field: ContactField) =>
    setClientErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t border-champagne/60 pt-10 outline-none">
        <p className="display text-4xl text-ivory sm:text-5xl">{t.status.successTitle}</p>
        <p className="mt-6 max-w-md text-ivory/70">{t.status.successText}</p>
        <button
          type="button"
          onClick={onReset}
          className="eyebrow link-underline mt-10 pb-1 text-champagne"
        >
          {t.status.sendAnother}
        </button>
      </div>
    );
  }

  const error = (field: ContactField) => {
    const key = errors[field];
    if (!key) return null;
    return (
      <p id={`${field}-error`} className="mt-2 text-sm text-[#e4b3a2]">
        {t.errors[key]}
      </p>
    );
  };

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    onChange: () => clearError(field),
  });

  const label = (field: ContactField, text: string, optional = false) => (
    <label htmlFor={`contact-${field}`} className="eyebrow flex gap-2 text-ivory/55">
      {text}
      {optional ? <span className="normal-case tracking-normal text-ivory/35">({t.optional})</span> : <span aria-hidden="true" className="text-champagne">*</span>}
    </label>
  );

  const failure =
    state.status === "unavailable" || state.status === "error"
      ? state.status === "unavailable"
        ? t.status.unavailable
        : t.status.error
      : state.status === "rate-limited"
        ? t.status.rateLimited
        : state.status === "spam"
          ? t.status.spam
          : null;

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={onSubmit}
      noValidate
      className="relative grid gap-x-10 gap-y-9 sm:grid-cols-2"
    >
      <input type="hidden" name="locale" value={locale} />
      <input ref={elapsedRef} type="hidden" name="elapsed" defaultValue="" />
      {/* Champ piège : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div>
        {label("name", t.name)}
        <input
          {...fieldProps("name")}
          type="text"
          autoComplete="name"
          required
          maxLength={LIMITS.name}
          defaultValue={values.name}
          className={fieldBase}
        />
        {error("name")}
      </div>

      <div>
        {label("email", t.email)}
        <input
          {...fieldProps("email")}
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={LIMITS.email}
          defaultValue={values.email}
          className={fieldBase}
        />
        {error("email")}
      </div>

      <div>
        {label("eventType", t.eventType)}
        <select
          {...fieldProps("eventType")}
          required
          defaultValue={values.eventType ?? defaultEventType ?? ""}
          className={`${fieldBase} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23c6ad86'%3E%3Cpath d='m1 1.5 5 5 5-5'/%3E%3C/svg%3E")] bg-[length:12px_8px] bg-[right_2px_center] bg-no-repeat pr-8`}
        >
          <option value="" disabled className="bg-noir">
            {t.eventTypePlaceholder}
          </option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type} className="bg-noir">
              {t.eventTypes[type]}
            </option>
          ))}
        </select>
        {error("eventType")}
      </div>

      <div>
        {label("date", t.date, true)}
        <input {...fieldProps("date")} type="date" defaultValue={values.date} className={`${fieldBase} [color-scheme:dark]`} />
        {error("date")}
      </div>

      <div className="sm:col-span-2">
        {label("location", t.location, true)}
        <input
          {...fieldProps("location")}
          type="text"
          autoComplete="address-level2"
          maxLength={LIMITS.location}
          placeholder={t.locationPlaceholder}
          defaultValue={values.location}
          className={fieldBase}
        />
        {error("location")}
      </div>

      <div className="sm:col-span-2">
        {label("message", t.message)}
        <textarea
          {...fieldProps("message")}
          required
          rows={5}
          maxLength={LIMITS.message}
          placeholder={t.messagePlaceholder}
          defaultValue={values.message}
          className={`${fieldBase} resize-y`}
        />
        {error("message")}
      </div>

      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-ivory/45">
          {t.privacy}{" "}
          <a href={privacyHref} className="link-underline text-ivory/70">
            {t.privacyLink}
          </a>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="eyebrow group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-ivory px-8 py-5 text-noir transition-opacity disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-y-full bg-champagne transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0"
          />
          <span className="relative">{pending ? t.sending : t.submit}</span>
          <span aria-hidden="true" className="relative transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none sm:col-span-2">
        {state.status === "invalid" && Object.keys(clientErrors).length === 0 && (
          <p className="text-sm text-[#e4b3a2]">{t.status.invalid}</p>
        )}
        {failure && (
          <p role="alert" className="border-l border-[#d8a28f] pl-4 text-sm leading-relaxed text-ivory/80">
            {failure}
            {(state.status === "unavailable" || state.status === "error") && (
              <>
                {" "}
                <EmailLink
                  user={SITE.email.user}
                  domain={SITE.email.domain}
                  className="text-champagne underline underline-offset-4"
                />
                .
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
