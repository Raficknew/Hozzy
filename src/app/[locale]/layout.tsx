import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hozzy",
  description: "App to manage your home budget",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <html lang={locale}>
        <body className={`${geistSans.variable} antialiased bg-background`}>
          {children}
          <Toaster
            theme="dark"
            richColors
            duration={2000}
            position="top-center"
          />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
