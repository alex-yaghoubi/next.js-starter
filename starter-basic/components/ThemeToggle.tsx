"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {useTheme} from "next-themes";

export default function ThemeToggle() {
  const t = useTranslations("Controls");
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("switchToLight") : t("switchToDark");

  return (
    <button
      type="button"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm transition hover:border-indigo-400 disabled:opacity-50 dark:border-white/20"
      aria-label={mounted ? label : t("themeLabel")}
      title={mounted ? label : t("themeLabel")}
    >
      {mounted && isDark ? "☀️" : "🌙"}
    </button>
  );
}
