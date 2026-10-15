type FeatureCardProps = {
  symbol: string;
  title: string;
  detail: string;
};

export default function FeatureCard({symbol, title, detail}: FeatureCardProps) {
  return (
    <article className="surface group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl transition group-hover:bg-indigo-100 dark:bg-indigo-400/10 dark:group-hover:bg-indigo-400/20" aria-hidden="true">
        {symbol}
      </div>
      <h3 className="mt-6 text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{detail}</p>
    </article>
  );
}
