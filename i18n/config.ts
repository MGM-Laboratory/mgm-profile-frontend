// Shared i18n constants. UI strings only — user-generated content is never
// translated. Locale is stored in a cookie (no routing segment), so the app's
// route tree stays clean across public/dashboard/admin areas.
export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "MGM_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
