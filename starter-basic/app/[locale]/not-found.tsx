import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Errors");
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">404</p>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("notFoundTitle")}</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">{t("notFoundDescription")}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="button-primary">{t("goHome")}</Link>
        <Link href="/workspace" className="button-secondary">{t("openWorkspace")}</Link>
      </div>
    </div>
  );
}
