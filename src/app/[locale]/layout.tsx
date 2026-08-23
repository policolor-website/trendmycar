import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Chef3DWrapper from "@/components/chef-3d-wrapper";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const nav = messages.Nav as any;
  const hero = messages.Hero as any;

  return {
    title: "TrendMyDrive | Premium Chauffeur Service & Airport Transfers",
    description: hero.subtitle,
    openGraph: {
      title: "TrendMyDrive | Premium Chauffeur Service & Airport Transfers",
      description: hero.subtitle,
      locale: locale === "en" ? "en_US" : locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Inter:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-cream font-body relative">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Chef3DWrapper />
          <Header />
          <div className="relative z-10 flex flex-col flex-1">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
