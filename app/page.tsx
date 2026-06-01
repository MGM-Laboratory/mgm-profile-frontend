import { useTranslations } from "next-intl";

import { PatternGrid } from "@/components/pattern";
import { SiteHeader } from "@/components/site-header";

// Public directory placeholder. The full infinite-scroll, division-grouped,
// Meilisearch-powered directory lands in Phase 6.
export default function Home() {
  const t = useTranslations("landing");

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <section className="flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:justify-between">
          <div className="flex max-w-xl flex-col items-start gap-6">
            <span className="text-eyebrow text-ink-3 uppercase">{t("eyebrow")}</span>
            <h1 className="text-display-xl font-display text-ink">
              {t("titleLead")} <span className="text-brand-blue">{t("titleHighlight")}</span>
            </h1>
            <p className="text-body-lg text-ink-2 prose-measure">{t("subtitle")}</p>
            <div className="flex items-center gap-3 pt-2">
              <span
                aria-disabled
                className="text-caption text-ink-3 bg-surface-muted border-line cursor-default rounded-md border px-4 py-2"
              >
                {t("comingSoon")}
              </span>
            </div>
          </div>

          {/* The pattern as signature, not wallpaper. */}
          <PatternGrid
            cols={3}
            rows={3}
            seed={42}
            tile={72}
            className="shadow-2 overflow-hidden rounded-lg"
          />
        </section>
      </main>
    </>
  );
}
