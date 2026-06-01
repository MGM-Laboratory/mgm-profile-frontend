"use server";

// Server action to switch the UI locale. Persists the choice in a cookie and
// refreshes the affected routes so server components re-render in the new
// language.
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";

export async function setLocale(next: Locale) {
  const locale: Locale = isLocale(next) ? next : defaultLocale;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
