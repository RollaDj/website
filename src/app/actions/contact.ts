"use server";

import { headers } from "next/headers";

import { hasLocale } from "@/i18n/config";
import {
  formatContactEmail,
  readContact,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";

export type ContactStatus = "idle" | "success" | "invalid" | "unavailable" | "error" | "rate-limited" | "spam";

export type ContactState = {
  status: ContactStatus;
  errors?: ContactErrors;
  /** Valeurs renvoyées pour ne rien perdre en cas d'erreur. */
  values?: Partial<ContactValues>;
};

/** Délai minimal de remplissage : en dessous, il s'agit d'un robot. */
const MIN_FILL_MS = 2500;
/** Limite par adresse IP (au sein d'une même instance serveur). */
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const attempts = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > RATE.max;
}

/**
 * Envoi du formulaire de contact.
 * - Validation serveur (mêmes règles que dans le navigateur).
 * - Antispam : champ piège invisible, délai minimal de remplissage, limite par IP.
 * - Envoi via l'API Resend (variables RESEND_API_KEY, CONTACT_TO_EMAIL,
 *   CONTACT_FROM_EMAIL). Sans configuration, le statut « unavailable » est
 *   renvoyé : aucune fausse confirmation n'est affichée.
 */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = readContact(form);
  const locale = String(form.get("locale") ?? "fr");

  // Antispam
  const honeypot = String(form.get("company") ?? "");
  // Durée de saisie mesurée dans le navigateur (indépendante des horloges).
  const elapsed = Number(form.get("elapsed") ?? 0);
  if (honeypot || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { status: "spam", values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return { status: "rate-limited", values };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return { status: "unavailable", values };

  const { subject, text } = formatContactEmail(values, hasLocale(locale) ? locale : "fr");

  try {
    const response = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: values.email, subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("[contact] Resend a répondu", response.status, await response.text());
      return { status: "error", values };
    }
  } catch (error) {
    console.error("[contact] envoi impossible", error);
    return { status: "error", values };
  }

  return { status: "success" };
}
