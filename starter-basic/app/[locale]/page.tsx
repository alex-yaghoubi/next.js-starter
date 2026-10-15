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
      <section className="relative isolate grid min-h-[590px] items-center gap-12 overflow-hidden py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="pointer-events-none absolute -top-24 end-0 -z-10 h-96 w-96 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/10" aria-hidden="true" />
        <div className="relative">
          <span className="eyebrow"><span className="h-2 w-2 rounded-full bg-emerald-500" />{t("heroNote")}</span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">{t("heroKicker")}</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            {t("headline")}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-9 text-slate-600 dark:text-slate-300">
            {t("description")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/workspace" className="button-primary">{t("workspaceCta")} <span aria-hidden="true">↗</span></Link>
            <Link href="/guide" className="button-secondary">{t("guideCta")} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-slate-200 px-3 py-1.5 dark:border-white/10">Next.js 15</span>
            <span className="rounded-full border border-slate-200 px-3 py-1.5 dark:border-white/10">TypeScript</span>
            <span className="rounded-full border border-slate-200 px-3 py-1.5 dark:border-white/10">Tailwind CSS</span>
            <span className="rounded-full border border-slate-200 px-3 py-1.5 dark:border-white/10">RTL / LTR</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-300/30 via-fuchsia-200/10 to-transparent blur-2xl dark:from-indigo-500/20" aria-hidden="true" />
          <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-2xl shadow-indigo-900/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/30">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{t("previewLabel")}</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">{t("previewProject")}</p>
                  <h2 className="mt-2 text-xl font-bold">{t("previewTitle")}</h2>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t("previewSubtitle")}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white" aria-hidden="true">✦</div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm font-bold">{t("previewToday")}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{t("previewProgress")}</span>
              </div>
              <div className="mt-4 space-y-3">
                {[t("previewTaskOne"), t("previewTaskTwo"), t("previewTaskThree")].map((task, index) => (
                  <div key={task} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-4 dark:border-white/10">
                    <span aria-hidden="true" className={index === 2
                      ? "flex h-5 w-5 shrink-0 rounded-md border-2 border-slate-300 dark:border-white/25"
                      : "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xs text-white"}>{index === 2 ? "" : "✓"}</span>
                    <span className={index === 2 ? "min-w-0 text-sm font-medium" : "min-w-0 text-sm text-slate-400 line-through"}>{task}</span>
                  </div>
                ))}
              </div>
              <Link href="/workspace" className="mt-6 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-400/10 dark:text-indigo-200 dark:hover:bg-indigo-400/15">
                <span>{t("previewPill")}</span><span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-label={t("featuresLabel")} className="py-12">
        <div className="mb-8 max-w-2xl">
          <span className="eyebrow">{t("nextStepLabel")}</span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{t("highlightsLabel")}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">{t("highlightsSubtitle")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      <section id="getting-started" className="relative mt-12 overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 text-white sm:px-12 sm:py-16 dark:bg-indigo-950/60">
        <div className="pointer-events-none absolute -end-20 -top-32 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">{t("bottomEyebrow")}</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("bottomTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">{t("bottomDescription")}</p>
          <Link href="/workspace" className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-100">{t("bottomCta")} ↗</Link>
        </div>
      </section>
    </div>
  );
}
