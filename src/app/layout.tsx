import type { Metadata } from "next";
import { Manrope, Tajawal } from "next/font/google";
import { LanguageProvider } from "@/content/LanguageProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "Kafu Media | Elite Growth Marketing Systems",
  description:
    "Kafu Media builds elite growth systems that consistently generate qualified clients for ambitious brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${manrope.variable} ${tajawal.variable} antialiased bg-background text-foreground`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}