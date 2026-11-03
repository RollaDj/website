/**
 * Typographie française : espace insécable fine avant : ; ! ? et à
 * l'intérieur des guillemets « ». Évite d'écrire des caractères invisibles
 * dans les contenus.
 */
export function frenchTypography<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(/ ([:;!?»])/g, " $1")
      .replace(/« /g, "« ") as T;
  }
  if (Array.isArray(value)) return value.map(frenchTypography) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, frenchTypography(v)]),
    ) as T;
  }
  return value;
}
