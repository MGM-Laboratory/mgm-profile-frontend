"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";

import { setLocale } from "@/i18n/actions";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

// EN / ID toggle. UI strings only — never translates user content.
export function LocaleSwitcher() {
  const active = useLocale();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === active || pending) return;
    startTransition(() => {
      void setLocale(next);
    });
  }

  return (
    <div
      className="border-line inline-flex items-center gap-1 rounded-md border p-1"
      data-pending={pending ? "" : undefined}
    >
      <Languages aria-hidden size={16} strokeWidth={2.25} className="text-ink-3 mx-1" />
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => change(locale)}
          aria-pressed={locale === active}
          className={cn(
            "text-caption ease-out-soft cursor-pointer rounded-sm px-2 py-1 uppercase transition-colors duration-200",
            locale === active ? "bg-brand-blue-50 text-brand-blue" : "text-ink-3 hover:text-ink",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
