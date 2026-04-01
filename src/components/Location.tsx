"use client";

import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections } from 'react-icons/fa';
import { CONTACT_NUMBER_DISPLAY, PHONE_HREF } from '@/lib/contact';
import { useContent } from '@/content/useContent';

export default function Location() {
  const { dictionary, dir } = useContent();
  const location = dictionary.location;

  const details: {
    icon: React.ElementType;
    label: string;
    lines: string[];
    href?: string;
    ltr?: boolean;
  }[] = [
    {
      icon: FaMapMarkerAlt,
      label: dictionary.common.addressLabel,
      lines: location.address,
    },
    {
      icon: FaPhone,
      label: dictionary.common.phoneLabel,
      lines: [CONTACT_NUMBER_DISPLAY],
      href: PHONE_HREF,
      ltr: true,
    },
    {
      icon: FaClock,
      label: dictionary.common.workingHoursLabel,
      lines: location.workingHours,
    },
  ];

  return (
    <section id="location" className="bg-white w-full py-20 lg:py-28 px-6 font-cairo">
      <div className="max-w-[1290px] mx-auto" dir={dir}>

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">
            {location.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-darkGreen mt-4 mb-3">
            {location.title}
          </h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4 mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            {location.description}
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 min-h-[380px]">
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
          <div className="flex flex-col justify-center gap-6">
            {details.map(({ icon: Icon, label, lines, href, ltr }) => (
              <div
                key={label}
                className="flex items-start gap-5 bg-light-section rounded-2xl p-6 border border-gray-100"
              >
                <div className="w-12 h-12 bg-darkGreen rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      dir={ltr ? 'ltr' : undefined}
                      className="text-darkGreen font-bold text-base hover:text-gold transition-colors block"
                    >
                      {lines[0]}
                    </a>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {lines.map((line, i) => (
                        <p key={i} className="text-darkGreen font-bold text-base">{line}</p>
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
              className="mt-2 inline-flex items-center justify-center gap-3 bg-darkGreen hover:bg-gold text-white font-black text-base rounded-xl px-8 py-4 transition-colors duration-300 self-start"
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
