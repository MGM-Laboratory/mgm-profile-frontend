import Link from "next/link";
import { useTranslations } from "next-intl";

import { PatternGrid } from "@/components/pattern";

// 404 — a natural home for the geometric pattern (DESIGN_SYSTEM §1).
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <PatternGrid cols={4} rows={2} seed={404} tile={56} className="overflow-hidden rounded-lg" />
      <p className="text-eyebrow text-ink-3 uppercase">{t("code")}</p>
      <h1 className="text-display-lg font-display text-ink max-w-xl">{t("title")}</h1>
      <p className="text-body text-ink-2 prose-measure">{t("subtitle")}</p>
      <Link
        href="/"
        className="text-caption text-bg bg-brand-blue ease-out-soft rounded-md px-4 py-2 transition-opacity duration-200 hover:opacity-90"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
