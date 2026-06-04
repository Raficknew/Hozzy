import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/atoms/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
}>) {
  const locale = await getLocale();
  return (
    <NextIntlClientProvider>
      <html
        lang={locale}
        className={cn(
          "h-full",
          figtree.variable,
          geistSans.variable,
          geistMono.variable,
        )}
        suppressHydrationWarning
      >
        <body className="antialiased bg-background text-foreground font-sans">
          <ThemeProvider>
            {children}
            <Toaster richColors duration={2000} position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
