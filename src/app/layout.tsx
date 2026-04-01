import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { LanguageProvider } from "@/content/LanguageProvider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "مكتب المهمات الاحترافية للخدمات الالكترونية | خدمات حكومية إلكترونية",
  description: "مكتب المهمات الاحترافية للخدمات الالكترونية يقدم خدمات حكومية إلكترونية للأفراد والمنشآت عبر أبشر وناجز وبلدي وقوى والزكاة والتأمينات مع متابعة دقيقة حتى الإنجاز.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased bg-background`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}