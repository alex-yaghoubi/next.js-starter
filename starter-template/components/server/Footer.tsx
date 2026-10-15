import { useTranslations } from "next-intl";
import LanguageSwitcher from "../client/LanguageSwitcher";
import ThemeSwitcher from "../client/ThemeSwitcher";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="mx-auto mt-auto w-full max-w-screen-xl border-t border-white/10 px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm opacity-70">
          {t("copyright", { year: new Date().getFullYear() })}
        </span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
