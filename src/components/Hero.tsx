import React from 'react';
import Image from 'next/image';
import { PHONE_HREF, WHATSAPP_MESSAGES, buildWhatsAppHref } from '@/lib/contact';

export default function Hero() {
  return (
    <section
      id="hero"
      className="bg-darkGreen w-full min-h-screen pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden relative flex items-center"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
      </div>

      <div
        className="max-w-[1290px] mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16 relative z-10 w-full"
        dir="rtl"
      >
        {/* RIGHT: Text Content */}
        <div className="flex flex-col flex-1 text-right gap-6 w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            خدمات حكومية إلكترونية موثوقة عبر المنصات الرسمية
          </div>

          <h1 className="text-white text-3xl lg:text-5xl font-extrabold leading-tight">
            مكتب المهمات الاحترافية
            <span className="block mt-3 text-gold">للخدمات الالكترونية</span>
          </h1>

          <h2 className="text-white/80 text-xl lg:text-2xl font-bold">
            إنجاز سريع ودقيق لمعاملات الأفراد والمنشآت
          </h2>

          <p className="text-white/70 max-w-xl text-base lg:text-lg leading-relaxed">
            نقدم خدمات حكومية إلكترونية متكاملة تشمل التراخيص، التأمينات، العقود، والطلبات العدلية عبر
            المنصات الرسمية في المملكة العربية السعودية. فريقنا يتابع معاملتك خطوة بخطوة حتى الإتمام.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              اتصل الآن
            </a>
            <a
              href={buildWhatsAppHref(WHATSAPP_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 rounded-xl font-bold transition-all text-base backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.113 1.522 5.851L0 24l6.293-1.489A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.783-.553-5.333-1.508L3.5 21.5l1.008-3.167A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
              واتساب
            </a>
          </div>

          {/* Key Info */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-3xl items-stretch">
            <div className="border border-white/20 px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all flex-1 text-right">
              <div className="text-gold text-sm font-bold mb-2">ساعات العمل</div>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed">
                السبت - الخميس: 9 ص - 2 م، 4 م - 11 م
                <br />
                الجمعة: 4 م - 11 م
              </p>
            </div>

            <div className="border border-white/20 px-5 py-4 rounded-2xl text-center bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group sm:w-40 sm:flex-none">
              <div className="text-3xl font-black text-gold mb-1 group-hover:scale-110 transition-transform">
                +5
              </div>
              <div className="text-white/80 text-sm font-medium">سنوات خبرة</div>
            </div>
          </div>
        </div>

        {/* LEFT: Logo / Visual */}
        <div className="flex-1 flex justify-center items-center w-full">
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl scale-110" />
            <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-white/35 via-white/10 to-gold/35 shadow-2xl shadow-black/30">
              <div className="relative rounded-[27px] bg-white/10 backdrop-blur-xl border border-white/15 px-8 py-10 lg:px-12 lg:py-14 overflow-hidden">
                <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-gold/20 blur-xl" />
                <div className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-teal/20 blur-xl" />

                <div className="relative z-10 flex flex-col items-center">
                  <Image
                    src="/Logo.svg"
                    alt="مكتب المهمات الاحترافية للخدمات الالكترونية"
                    width={380}
                    height={380}
                    priority
                    className="w-[230px] h-auto lg:w-[340px] object-contain drop-shadow-2xl"
                  />
                  <div className="mt-5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/85 text-xs lg:text-sm font-medium">
                    مكتب المهمات الاحترافية
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
