import {Link} from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

type SiteHeaderProps = {
  brand: string;
  navigationLabel: string;
  skipToContent: string;
};

export default function SiteHeader({brand, navigationLabel, skipToContent}: SiteHeaderProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {skipToContent}
      </a>
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 py-5 dark:border-white/10">
        <Link href="/" className="text-lg font-extrabold tracking-tight">{brand}</Link>
        <nav className="flex items-center gap-2" aria-label={navigationLabel}>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </header>
    </>
  );
}
