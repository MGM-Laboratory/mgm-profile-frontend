import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PatternGrid } from "@/components/pattern";

export const metadata: Metadata = { title: "Sign in" };

// Placeholder. Keycloak (Auth.js) sign-in lands in Phase 5; this keeps the
// /login route resolvable in the meantime.
export default function LoginPage() {
  const t = useTranslations("common");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <PatternGrid cols={3} rows={1} seed={7} tile={56} className="overflow-hidden rounded-lg" />
      <h1 className="text-display-lg font-display text-ink">{t("signIn")}</h1>
      <p className="text-body text-ink-3">{t("appName")}</p>
    </main>
  );
}
