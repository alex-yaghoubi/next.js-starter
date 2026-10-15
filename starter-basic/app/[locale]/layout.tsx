import type {Metadata} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {routing} from "@/i18n/routing";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

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
              <SiteHeader
                brand={t("brand")}
                navigationLabel={t("navigationLabel")}
                skipToContent={t("skipToContent")}
                homeLabel={t("home")}
                workspaceLabel={t("workspace")}
                guideLabel={t("guide")}
              />
              <main id="main-content" className="flex-1">{children}</main>
              <SiteFooter copyright={t("footer")} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
