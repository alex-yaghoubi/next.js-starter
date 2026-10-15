import {getTranslations, setRequestLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";

type Props = {params: Promise<{locale: string}>};

const steps = [
  {number: "01", title: "firstTitle", description: "firstDescription", path: "app/[locale]/page.tsx"},
  {number: "02", title: "secondTitle", description: "secondDescription", path: "messages/en.json · messages/fa.json"},
  {number: "03", title: "thirdTitle", description: "thirdDescription", path: "components/ · app/[locale]/workspace/"},
] as const;

export default async function GuidePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Guide"});

  return (
    <div className="pb-20 pt-12 sm:pt-16">
      <span className="eyebrow">{t("eyebrow")}</span>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
        {t("description")}
      </p>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.number} className="surface p-6 sm:p-7">
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{step.number}</div>
            <h2 className="mt-5 text-xl font-bold">{t(step.title)}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{t(step.description)}</p>
            <code dir="ltr" className="mt-6 block break-words rounded-xl bg-slate-100 px-3 py-3 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">
              {step.path}
            </code>
          </article>
        ))}
      </div>

      <div className="surface mt-8 grid gap-6 p-7 sm:p-9 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">{t("commandsTitle")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{t("commandsHint")}</p>
          <Link href="/workspace" className="button-primary mt-6">{t("workspaceLink")} →</Link>
        </div>
        <pre dir="ltr" className="overflow-x-auto rounded-2xl bg-slate-950 p-6 text-sm leading-8 text-indigo-100"><code>{"npm run dev\nnpm run typecheck\nnpm run build"}</code></pre>
      </div>
    </div>
  );
}
