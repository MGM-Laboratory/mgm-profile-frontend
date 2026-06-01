import Link from "next/link";
import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/logo";

// Top bar shared across public surfaces. Calm, white, hairline divider.
export function SiteHeader() {
  const t = useTranslations("common");

  return (
    <header className="border-line bg-bg/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-display text-h4 text-ink">{t("appName")}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/login"
            className="text-caption text-ink bg-surface border-line hover:bg-surface-muted ease-out-soft rounded-md border px-3 py-1.5 transition-colors duration-200"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </header>
  );
}
