"use client";

import {useEffect, useState} from "react";
import {useTheme} from "next-themes";

export default function ThemeToggle() {
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      disabled={!mounted}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm transition hover:border-indigo-400 disabled:opacity-50 dark:border-white/20"
      aria-label={mounted && resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme"
    >
      {mounted && resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
