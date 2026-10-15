"use client";

import {usePathname, Link} from "@/i18n/navigation";

type PrimaryNavProps = {
  home: string;
  workspace: string;
  guide: string;
  ariaLabel: string;
};

export default function PrimaryNav({home, workspace, guide, ariaLabel}: PrimaryNavProps) {
  const pathname = usePathname();
  const items = [
    {href: "/" as const, label: home},
    {href: "/workspace" as const, label: workspace},
    {href: "/guide" as const, label: guide},
  ];

  return (
    <nav aria-label={ariaLabel} className="flex min-w-0 flex-wrap items-center gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-white/5">
      {items.map(({href, label}) => {
        const selected = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={selected ? "page" : undefined}
            className={selected
              ? "rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm sm:px-4 sm:text-sm dark:bg-slate-700 dark:text-white"
              : "rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-white/80 hover:text-slate-900 sm:px-4 sm:text-sm dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
