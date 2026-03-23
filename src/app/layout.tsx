import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";

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
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await getLocale();
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
