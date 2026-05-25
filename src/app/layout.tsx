import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RscBoundaryProvider } from "@rsc-boundary/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";
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
    <RscBoundaryProvider>
      <NextIntlClientProvider>
        <html
          lang={locale}
          className={cn(
            "dark",
            "h-full",
            figtree.variable,
            geistSans.variable,
            geistMono.variable,
          )}
          style={{ colorScheme: "dark" }}
        >
          <body className="antialiased bg-background text-foreground font-sans">
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
    </RscBoundaryProvider>
  );
}
