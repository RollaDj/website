/**
 * Formulaire de contact : champs, règles de validation (partagées entre le
 * navigateur et le serveur) et format du message envoyé.
 */
export const EVENT_TYPES = ["club", "corporate", "private", "wedding", "other"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const CONTACT_FIELDS = ["name", "email", "eventType", "date", "location", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField, string>;

export type ContactErrorKey = "name" | "email" | "eventType" | "date" | "location" | "message" | "tooLong";
export type ContactErrors = Partial<Record<ContactField, ContactErrorKey>>;

export const LIMITS = { name: 100, email: 200, location: 160, message: 4000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function readContact(form: FormData): ContactValues {
  return Object.fromEntries(
    CONTACT_FIELDS.map((field) => [field, String(form.get(field) ?? "").trim()]),
  ) as ContactValues;
}

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (v.name.length < 2) errors.name = "name";
  else if (v.name.length > LIMITS.name) errors.name = "tooLong";

  if (!EMAIL.test(v.email)) errors.email = "email";
  else if (v.email.length > LIMITS.email) errors.email = "tooLong";

  if (!(EVENT_TYPES as readonly string[]).includes(v.eventType)) errors.eventType = "eventType";

  if (v.date) {
    const d = new Date(`${v.date}T00:00:00Z`);
    if (!ISO_DATE.test(v.date) || Number.isNaN(d.getTime())) errors.date = "date";
  }

  if (v.location.length > LIMITS.location) errors.location = "location";

  if (v.message.length < 10) errors.message = "message";
  else if (v.message.length > LIMITS.message) errors.message = "tooLong";

  return errors;
}

const EVENT_LABELS: Record<EventType, string> = {
  club: "Club / Festival",
  corporate: "Événement de marque / Luxe",
  private: "Événement privé",
  wedding: "Mariage",
  other: "Autre",
};

/** Contenu texte de l'e-mail reçu par ROLLA. */
export function formatContactEmail(v: ContactValues, locale: string) {
  const type = EVENT_LABELS[v.eventType as EventType] ?? v.eventType;
  return {
    subject: `[ROLLA] ${type} — ${v.name}${v.date ? ` — ${v.date}` : ""}`,
    text: [
      `Nom : ${v.name}`,
      `E-mail : ${v.email}`,
      `Type d’événement : ${type}`,
      `Date : ${v.date || "—"}`,
      `Lieu : ${v.location || "—"}`,
      `Langue du site : ${locale.toUpperCase()}`,
      "",
      v.message,
    ].join("\n"),
  };
}
