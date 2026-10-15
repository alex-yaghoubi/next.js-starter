"use client";

import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";

export default function ErrorBoundary({reset}: {error: Error & {digest?: string}; reset: () => void}) {
  const t = useTranslations("Errors");
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl text-rose-600 dark:bg-rose-400/10" aria-hidden="true">!</div>
      <h1 className="mt-7 text-3xl font-bold tracking-tight">{t("unexpectedTitle")}</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">{t("unexpectedDescription")}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="button-primary">{t("retry")}</button>
        <Link href="/" className="button-secondary">{t("goHome")}</Link>
      </div>
    </div>
  );
}
