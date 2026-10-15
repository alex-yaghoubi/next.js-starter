import Link from "next/link";
import { useTranslations } from "next-intl";

/** Only link to routes that are included with the starter. */
export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <header className="border-b border-white/10">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-screen-xl items-center justify-between gap-6 px-6 py-5"
      >
        <Link href="/" className="text-lg font-semibold">
          {t("brand")}
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:underline">
            {t("links.home")}
          </Link>
          <Link href="/auth/phone" className="hover:underline">
            {t("links.signIn")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
