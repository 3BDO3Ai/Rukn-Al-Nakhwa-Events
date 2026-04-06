import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { LanguageProvider } from "@/content/LanguageProvider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "مؤسسة ركن النخوة للحفلات | ضيافة راقية وتجهيز مناسبات",
  description:
    "مؤسسة ركن النخوة للحفلات تقدم ضيافة فاخرة، قهوجيين وصبابين محترفين، وديكورات ملكية لتجهيز مناسبات الرجال والنساء بأعلى جودة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased bg-background text-foreground`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}