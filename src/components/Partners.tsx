'use client';

import React from 'react';
import { useContent } from '@/content/useContent';

interface PartnerLogo {
  src: string;
  alt: string;
}

export default function Partners() {
  const { dictionary, dir } = useContent();
  const names: string[] = Array.isArray(dictionary?.partners?.names) ? dictionary.partners.names : [];
  const logos: PartnerLogo[] = Array.isArray(dictionary?.partners?.logos) ? dictionary.partners.logos : [];
  const marqueeLogos = logos.length ? [...logos, ...logos] : [];

  return (
    <section id="partners" className="bg-[#0A0D13] py-20 px-6 border-y border-white/5">
      <div className="max-w-[1290px] mx-auto" dir={dir}>
        <div className="text-center mb-12">
          <span className="text-gold font-bold text-xs sm:text-sm tracking-[0.2em] uppercase bg-gold/10 border border-gold/25 px-4 py-2 rounded-full">
            {dictionary.partners.badge}
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mt-5 mb-4">{dictionary.partners.title}</h2>
          <p className="text-white/65 max-w-3xl mx-auto text-base lg:text-lg">{dictionary.partners.description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {names.map((name) => (
            <span
              key={name}
              className="px-4 py-2 rounded-full bg-[#151A24] border border-gold/25 text-white/90 text-sm font-semibold"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111722] p-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#111722] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#111722] to-transparent z-10" />

          <div className="flex w-max animate-scroll gap-4 mb-4">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="h-24 w-44 rounded-2xl border border-white/10 bg-white/95 flex items-center justify-center p-3"
              >
                <img src={logo.src} alt={logo.alt} className="max-h-full w-auto object-contain" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="flex w-max animate-scroll-reverse gap-4">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="h-24 w-44 rounded-2xl border border-white/10 bg-white/95 flex items-center justify-center p-3"
              >
                <img src={logo.src} alt={logo.alt} className="max-h-full w-auto object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
