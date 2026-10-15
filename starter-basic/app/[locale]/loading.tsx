export default function Loading() {
  return (
    <div aria-busy="true" className="space-y-8 py-14 sm:py-20">
      <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="surface h-40 animate-pulse bg-slate-100 dark:bg-white/5" />
        ))}
      </div>
    </div>
  );
}
