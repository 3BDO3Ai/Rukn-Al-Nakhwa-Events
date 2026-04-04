"use client";

import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections } from 'react-icons/fa';
import { CONTACT_NUMBER_DISPLAY, PHONE_HREF } from '@/lib/contact';
import { useContent } from '@/content/useContent';

export default function Location() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const location = dictionary.location ?? {
    badge: isArabic ? 'تواصل معنا' : 'Contact',
    title: isArabic ? 'معلومات التواصل والموقع' : 'Contact & Location',
    description: isArabic
      ? 'يسعدنا تواصلكم معنا. يمكنكم زيارتنا أو الاتصال بنا خلال ساعات العمل.'
      : 'We are happy to hear from you. Visit us or call during working hours.',
    address: [isArabic ? 'جدة، حي الفلاح، شارع ياسر بن عامر الكناني' : 'Jeddah, Al Falah District, Yasser Bin Amer Al Kinani St.'],
    workingHours: [
      isArabic ? 'الأحد - الخميس: 9:00 ص - 6:00 م' : 'Sun - Thu: 9:00 AM - 6:00 PM',
      isArabic ? 'الجمعة - السبت: حسب الموعد' : 'Fri - Sat: By Appointment',
    ],
    directionsButton: isArabic ? 'الحصول على الاتجاهات' : 'Get Directions',
    mapTitle: isArabic ? 'خريطة الموقع' : 'Location Map',
  };

  const labels = {
    address: dictionary.common?.addressLabel ?? (isArabic ? 'العنوان' : 'Address'),
    phone: dictionary.common?.phoneLabel ?? (isArabic ? 'الهاتف' : 'Phone'),
    workingHours: dictionary.common?.workingHoursLabel ?? (isArabic ? 'ساعات العمل' : 'Working Hours'),
  };

  const details: {
    icon: React.ElementType;
    label: string;
    lines: string[];
    href?: string;
    ltr?: boolean;
  }[] = [
    {
      icon: FaMapMarkerAlt,
      label: labels.address,
      lines: location.address,
    },
    {
      icon: FaPhone,
      label: labels.phone,
      lines: [CONTACT_NUMBER_DISPLAY],
      href: PHONE_HREF,
      ltr: true,
    },
    {
      icon: FaClock,
      label: labels.workingHours,
      lines: location.workingHours,
    },
  ];

  return (
    <section id="location" className="bg-[#0B0F16] w-full py-20 lg:py-28 px-6 font-cairo">
      <div className="max-w-[1290px] mx-auto" dir={dir}>

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">
            {location.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white mt-4 mb-3">
            {location.title}
          </h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4 mb-6" />
          <p className="text-white/65 max-w-xl mx-auto text-lg leading-relaxed">
            {location.description}
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.35)] border border-white/10 min-h-[380px]">
            <iframe
              title={location.mapTitle}
              src="https://maps.google.com/maps?q=%D8%AC%D8%AF%D8%A9%20%D8%AD%D9%8A%20%D8%A7%D9%84%D9%81%D9%84%D8%A7%D8%AD3%20%D8%B4%D8%A7%D8%B1%D8%B9%20%D9%8A%D8%A7%D8%B3%D8%B1%20%D8%A8%D9%86%20%D8%B9%D8%A7%D9%85%D8%B1%20%D8%A7%D9%84%D9%83%D9%86%D8%A7%D9%86%D9%8A&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ minHeight: '380px', border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center gap-5">
            {details.map(({ icon: Icon, label, lines, href, ltr }) => (
              <div
                key={label}
                className="flex items-start gap-5 bg-[#121722] rounded-2xl p-6 border border-white/10"
              >
                <div className="w-12 h-12 bg-gold/15 rounded-xl flex items-center justify-center text-gold flex-shrink-0 mt-0.5 border border-gold/30">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/45 font-semibold uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      dir={ltr ? 'ltr' : undefined}
                      className="text-white font-bold text-base hover:text-gold transition-colors block"
                    >
                      {lines[0]}
                    </a>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {lines.map((line, i) => (
                        <p key={i} className="text-white/85 font-semibold text-base">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Directions button */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=%D8%AC%D8%AF%D8%A9%20%D8%AD%D9%8A%20%D8%A7%D9%84%D9%81%D9%84%D8%A7%D8%AD3%20%D8%B4%D8%A7%D8%B1%D8%B9%20%D9%8A%D8%A7%D8%B3%D8%B1%20%D8%A8%D9%86%20%D8%B9%D8%A7%D9%85%D8%B1%20%D8%A7%D9%84%D9%83%D9%86%D8%A7%D9%86%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-3 bg-gold hover:bg-[#ddb987] text-[#101010] font-black text-base rounded-xl px-8 py-4 transition-colors duration-300 self-start shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
            >
              <FaDirections className="w-5 h-5" />
              {location.directionsButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
