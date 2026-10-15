import {Link} from "@/i18n/navigation";
import PrimaryNav from "./PrimaryNav";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

type SiteHeaderProps = {
  brand: string;
  navigationLabel: string;
  skipToContent: string;
  homeLabel: string;
  workspaceLabel: string;
  guideLabel: string;
};

export default function SiteHeader({
  brand, navigationLabel, skipToContent, homeLabel, workspaceLabel, guideLabel,
}: SiteHeaderProps) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white">
        {skipToContent}
      </a>
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 py-5 dark:border-white/10">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-base font-extrabold tracking-tight sm:text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-600/20" aria-hidden="true">✳</span>
          <span className="max-w-40 truncate sm:max-w-64">{brand}</span>
        </Link>
        <div className="order-3 flex w-full justify-center sm:order-none sm:w-auto">
          <PrimaryNav home={homeLabel} workspace={workspaceLabel} guide={guideLabel} ariaLabel={navigationLabel} />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
