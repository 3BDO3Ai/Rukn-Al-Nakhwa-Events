'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useContent } from '@/content/useContent';
import { CONTACT_NUMBER_DISPLAY, SOCIAL_LINKS, WHATSAPP_MESSAGES, buildWhatsAppHref } from '@/lib/contact';

export default function WhatsAppFloat() {
  const { dictionary, locale } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 850);

    return () => window.clearTimeout(timer);
  }, []);

  const isArabic = locale === 'ar';

  const whatsappHref = useMemo(() => {
    const fromContent = typeof dictionary?.navbar?.ctaMessage === 'string' ? dictionary.navbar.ctaMessage : '';
    const fallback = isArabic
      ? WHATSAPP_MESSAGES.hero
      : 'Hello, I would like to book an event with Rukn Al-Nakhwa Events.';

    return buildWhatsAppHref(fromContent || fallback);
  }, [dictionary?.navbar?.ctaMessage, isArabic]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed left-3 top-1/2 z-[70] flex -translate-y-1/2 flex-col gap-3 sm:left-auto sm:right-6 sm:top-auto sm:bottom-6 sm:translate-y-0">
      <a
        href={SOCIAL_LINKS.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        title={isArabic ? 'تابعنا على تيك توك' : 'Follow us on TikTok'}
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#0f1115] text-white shadow-[0_12px_28px_rgba(0,0,0,0.32)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a1d25]"
      >
        <FaTiktok className="h-6 w-6" />
        <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] hidden whitespace-nowrap rounded-lg bg-[#111723] px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:hidden sm:left-auto sm:right-[calc(100%+0.75rem)] sm:group-hover:block">
          {isArabic ? 'تابعنا على تيك توك' : 'Follow us on TikTok'}
        </span>
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title={isArabic ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#1e8b4f]/35 bg-[#21c064] text-white shadow-[0_12px_28px_rgba(17,102,53,0.35)] transition-all duration-300 hover:-translate-y-1 hover:brightness-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#21c064]/35" />
        <FaWhatsapp className="relative h-7 w-7" />
        <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] hidden whitespace-nowrap rounded-lg bg-[#111723] px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:hidden sm:left-auto sm:right-[calc(100%+0.75rem)] sm:group-hover:block">
          {isArabic ? `واتساب ${CONTACT_NUMBER_DISPLAY}` : `WhatsApp ${CONTACT_NUMBER_DISPLAY}`}
        </span>
      </a>
    </div>
  );
}
