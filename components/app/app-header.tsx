import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { logout } from "@/app/actions/auth";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/logo";

// Header for the private app surface. Shows the signed-in member and a
// sign-out control (server action). Admins additionally get a console link.
export async function AppHeader({
  name,
  email,
  isAdmin = false,
}: {
  name: string | null;
  email: string | null;
  isAdmin?: boolean;
}) {
  const t = await getTranslations("common");
  const display = name || email || "";
  const initial = display.trim().charAt(0).toUpperCase() || "•";

  return (
    <header className="border-line bg-bg/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-display text-h4 text-ink">{t("appName")}</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/dashboard"
              className="text-caption text-ink-2 hover:bg-surface-muted rounded-md px-3 py-1.5 transition-colors duration-200"
            >
              {t("nav.profile")}
            </Link>
            <Link
              href="/"
              className="text-caption text-ink-2 hover:bg-surface-muted rounded-md px-3 py-1.5 transition-colors duration-200"
            >
              {t("nav.directory")}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-caption text-ink-2 hover:bg-surface-muted inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors duration-200"
              >
                <ShieldCheck size={14} strokeWidth={2.25} />
                {t("nav.admin")}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <span
            aria-hidden
            className="bg-brand-blue-50 text-brand-blue text-caption flex h-8 w-8 items-center justify-center rounded-full font-semibold"
            title={display}
          >
            {initial}
          </span>
          <form action={logout}>
            <button
              type="submit"
              aria-label={t("signOut")}
              className="text-ink-3 hover:bg-surface-muted hover:text-ink flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200"
            >
              <LogOut size={18} strokeWidth={2.25} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
