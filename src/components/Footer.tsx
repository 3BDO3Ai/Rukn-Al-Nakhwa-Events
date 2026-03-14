import React from 'react';
import Image from 'next/image';
import { FaSnapchatGhost, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
  CONTACT_NUMBER_DISPLAY,
  PHONE_HREF,
} from '@/lib/contact';

const quickLinks = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'من نحن', href: '#about' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'شركاؤنا', href: '#partners' },
];

const mainServices = [
  'الخدمات الحكومية الإلكترونية',
  'ناجز والبورصة العقارية',
  'منصة مدينتي والرخص البلدية',
  'وزارة التجارة وتأسيس المنشآت',
  'التأمينات الاجتماعية ومدد',
  'الكهرباء والمياه والتأمين',
];

const socialLinks = [
  { name: 'X', href: 'https://x.com/MaeedMed', icon: FaXTwitter },
  { name: 'TikTok', href: 'https://www.tiktok.com/@maeedmed2026', icon: FaTiktok },
  { name: 'Snapchat', href: 'https://www.snapchat.com/add/m_maeed24?share_id=PUv0Zh-xUPI&locale=ar-US', icon: FaSnapchatGhost },
  { name: 'WhatsApp', href: 'https://wa.me/message/OXA5SNQLCNUZA1', icon: FaWhatsapp },
];

export default function Footer() {
  return (
    <footer className="bg-footer text-white pt-16 pb-6">
      <div className="max-w-[1290px] mx-auto px-6" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">

          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/Logo_white.svg"
                alt="شعار مكتب المهمات الاحترافية للخدمات الالكترونية"
                width={220}
                height={64}
                className="object-contain"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
                مكتب المهمات الاحترافية للخدمات الالكترونية متخصص في إنجاز المعاملات الحكومية والتجارية عبر
                المنصات الرسمية في المملكة العربية السعودية. شريكك الموثوق للمتابعة الدقيقة، الإنجاز السريع،
                والحلول الرقمية المتكاملة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-gold mb-5 text-base border-b border-gold/30 pb-3">روابط سريعة</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Services */}
          <div>
            <h4 className="font-black text-gold mb-5 text-base border-b border-gold/30 pb-3">خدمات رئيسية</h4>
            <ul className="flex flex-col gap-3">
              {mainServices.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-white/70 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors flex-shrink-0" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-black text-gold mb-5 text-base border-b border-gold/30 pb-3">معلومات التواصل</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={PHONE_HREF}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors group"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <span
                    className="text-sm leading-relaxed"
                    dir="ltr"
                    style={{ unicodeBidi: 'plaintext' }}
                  >
                    {CONTACT_NUMBER_DISPLAY}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:almuhimaataliahtirafih@gmail.com"
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors group"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm leading-relaxed">almuhimaataliahtirafih@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/70">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-sm leading-relaxed">
                    <div>المملكة العربية السعودية</div>
                    <div className="text-white/50 text-xs mt-1">خدمات رقمية عن بُعد عبر المنصات الرسمية</div>
                  </div>
                </div>
              </li>
              <li>
                <div className="pt-1">
                  <div className="text-white/60 text-xs mb-2">تابعنا على</div>
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          title={social.name}
                          className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold/20 text-white/80 hover:text-gold transition-colors flex items-center justify-center"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-center pt-8 text-white/50 text-sm text-center" dir="rtl">
          <p>© 2026 جميع الحقوق محفوظة — مكتب المهمات الاحترافية للخدمات الالكترونية — المملكة العربية السعودية</p>
        </div>
      </div>
    </footer>
  );
}
