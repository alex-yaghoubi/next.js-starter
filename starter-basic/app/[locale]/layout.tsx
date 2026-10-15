import type {Metadata} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import Providers from "@/components/Providers";
import {Link} from "@/i18n/navigation";
import "../globals.css";

type Props = {children: React.ReactNode; params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Omit<Props, "children">): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  return {title: t("title"), description: t("description")};
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({locale, namespace: "Navigation"});

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
              <header className="flex items-center justify-between gap-4 border-b border-slate-200 py-5 dark:border-white/10">
                <Link href="/" className="text-lg font-extrabold tracking-tight">{t("brand")}</Link>
                <nav className="flex items-center gap-2" aria-label="Main navigation">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </nav>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                <span>{t("footer")}</span>
                <span>Next.js · TypeScript · Tailwind CSS</span>
              </footer>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
