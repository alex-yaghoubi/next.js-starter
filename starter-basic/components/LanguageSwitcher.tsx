"use client";

import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Controls");
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "fa" : "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, {locale: nextLocale})}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:border-indigo-400 dark:border-white/20"
      aria-label={nextLocale === "fa" ? t("switchToPersian") : t("switchToEnglish")}
    >
      {nextLocale === "fa" ? "فارسی" : "English"}
    </button>
  );
}
