type SiteFooterProps = {
  copyright: string;
};

export default function SiteFooter({copyright}: SiteFooterProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
      <span>{copyright}</span>
      <span>Next.js · TypeScript · Tailwind CSS</span>
    </footer>
  );
}
