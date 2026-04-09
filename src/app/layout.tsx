import type { Metadata } from "next";
import Script from "next/script";
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
  verification: {
    google: "9M6DG4WwnzKB7g7xX8exa12b_7wzieomfxhVaTWxkf0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased bg-background text-foreground`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YWYTY1H9YN"
          strategy="afterInteractive"
        />
        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17042698221');
            gtag('config', 'G-YWYTY1H9YN');
          `}
        </Script>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}