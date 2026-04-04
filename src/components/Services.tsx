"use client";

import React from "react";
import { useContent } from "@/content/useContent";

interface ServiceItem {
  title: string;
  description: string;
}

export default function Services() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === "rtl";
  const services: ServiceItem[] = Array.isArray(dictionary?.services?.items)
    ? dictionary.services.items
    : [];

  return (
    <section id="system" className="bg-[#0E1219] w-full py-20 lg:py-28 px-6">
      <div className="max-w-[1290px] mx-auto" dir={dir}>
        <div className="text-center mb-14">
          <span className="text-gold font-bold text-xs sm:text-sm tracking-[0.2em] uppercase bg-gold/10 border border-gold/25 px-4 py-2 rounded-full">
            {dictionary.services.badge}
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mt-5 mb-4">
            {dictionary.services.title}
          </h2>
          <p className="text-white/65 max-w-3xl mx-auto text-base lg:text-lg">
            {dictionary.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <article
              key={service.title}
              className={`rounded-3xl border border-gold/20 bg-[#121722] p-8 lg:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.25)] ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-gold text-white font-extrabold flex items-center justify-center">
                  {idx + 1}
                </div>
                <span className="text-gold/90 text-sm uppercase tracking-[0.18em]">{dictionary.services.trackLabel ?? 'Track'}</span>
              </div>

              <h3 className="text-white text-2xl font-extrabold leading-tight mb-4">{service.title}</h3>
              <p className="text-white/72 text-base leading-relaxed">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
