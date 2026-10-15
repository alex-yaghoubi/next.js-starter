import {getTranslations, setRequestLocale} from "next-intl/server";
import TaskBoard from "@/components/workspace/TaskBoard";
import {Link} from "@/i18n/navigation";

type Props = {params: Promise<{locale: string}>};

export default async function WorkspacePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Workspace"});

  return (
    <div className="pb-20 pt-12 sm:pt-16">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            {t("description")}
          </p>
        </div>
        <Link href="/guide" className="button-secondary">{t("guideLink")} ↗</Link>
      </div>
      <TaskBoard />
      <p className="mx-auto mt-7 max-w-2xl text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
        {t("demoDisclaimer")}
      </p>
    </div>
  );
}
