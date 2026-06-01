import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";
import { PatternGrid } from "@/components/pattern";

export const metadata: Metadata = { title: "Sign in" };

// Sign-in via Keycloak (Auth Code + PKCE). Already-authenticated users are
// sent straight on; the post-login router (Phase 5B) decides dashboard vs
// onboarding.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.accessToken) {
    redirect(callbackUrl || "/dashboard");
  }

  const t = await getTranslations("auth");

  async function login() {
    "use server";
    await signIn("keycloak", { redirectTo: "/dashboard" });
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-24">
      <PatternGrid
        cols={6}
        rows={6}
        seed={11}
        tile={56}
        className="pointer-events-none absolute -top-10 -right-10 -z-10 opacity-[0.06]"
      />
      <div className="border-line bg-surface shadow-2 flex w-full max-w-md flex-col items-center gap-7 rounded-xl border p-10">
        <Logo size={44} />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-h1 text-ink">{t("title")}</h1>
          <p className="text-body-sm text-ink-3 prose-measure">{t("subtitle")}</p>
        </div>
        <form action={login} className="w-full">
          <button
            type="submit"
            className="bg-brand-blue text-bg ease-out-soft text-body w-full rounded-md px-4 py-3 text-center font-medium transition-opacity duration-200 hover:opacity-90"
          >
            {t("continueWithKeycloak")}
          </button>
        </form>
        <p className="text-caption text-ink-4 text-center">{t("ssoNote")}</p>
      </div>
    </main>
  );
}
