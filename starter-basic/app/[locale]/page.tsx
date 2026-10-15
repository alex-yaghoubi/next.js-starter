import {getTranslations, setRequestLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import FeatureCard from "@/components/FeatureCard";

type Props = {params: Promise<{locale: string}>};

export default async function Home({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Home"});

  const features = [
    {symbol: "⚡", title: t("featureSpeedTitle"), detail: t("featureSpeedText")},
    {symbol: "🌐", title: t("featureI18nTitle"), detail: t("featureI18nText")},
    {symbol: "◐", title: t("featureThemeTitle"), detail: t("featureThemeText")},
  ];

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-24 top-2 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-600/15" />
        <div className="relative max-w-3xl">
          <span className="pill">{t("eyebrow")}</span>
          <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {t("headline")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t("description")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#getting-started" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
              {t("startButton")} →
            </a>
            <a href="https://nextjs.org/docs/app" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:border-indigo-400 dark:border-white/20">
              {t("docsButton")} ↗
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label={t("featuresLabel")}>
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>

      <section id="getting-started" className="mt-16 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="pill">{t("nextStepLabel")}</span>
          <h2 className="mt-4 text-3xl font-bold">{t("nextStepTitle")}</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t("nextStepText")}</p>
          <Link href="/" className="mt-5 inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            {t("backHome")} ↗
          </Link>
        </div>
        <div className="surface lg:col-span-3">
          <div className="border-b border-slate-200 px-6 py-4 text-sm font-medium dark:border-white/10">
            {t("commandTitle")}
          </div>
          <pre className="overflow-auto p-6 text-sm leading-8 text-indigo-700 dark:text-indigo-200"><code>{'app/\n  [locale]/page.tsx\nmessages/\n  en.json\n  fa.json\ncomponents/'}</code></pre>
          <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500 dark:border-white/10">
            {t("tip")}
          </div>
        </div>
      </section>
    </div>
  );
}
