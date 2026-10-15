type FeatureCardProps = {
  symbol: string;
  title: string;
  detail: string;
};

export default function FeatureCard({symbol, title, detail}: FeatureCardProps) {
  return (
    <article className="surface p-6">
      <span className="text-3xl" aria-hidden="true">{symbol}</span>
      <h2 className="mt-5 text-lg font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {detail}
      </p>
    </article>
  );
}
