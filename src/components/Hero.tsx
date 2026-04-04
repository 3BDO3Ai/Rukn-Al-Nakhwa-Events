"use client";

import React from 'react';
import { useContent } from '@/content/useContent';

export default function Hero() {
  const { dictionary, dir } = useContent();
  const hero = dictionary.hero;
  const isArabic = dir === 'rtl';

  return (
    <section
      id="hero"
      className="w-full min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden relative flex items-center bg-[#090C11]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-16 w-[420px] h-[420px] bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 -left-10 w-[420px] h-[420px] bg-[#2E3646]/60 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(203,161,109,0.14),transparent_42%)]" />
      </div>

      <div
        className="max-w-[1290px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 relative z-10 w-full"
        dir={dir}
      >
        <div className={`flex flex-col flex-1 gap-6 w-full max-w-3xl ${isArabic ? 'text-right font-arabic' : 'text-left'}`}>
          <span className="inline-flex w-fit text-gold text-xs sm:text-sm tracking-[0.24em] uppercase border border-gold/35 rounded-full px-4 py-2">
            {hero.badge ?? dictionary.common.brandName}
          </span>

          <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05]">
            {hero.headline}
          </h1>

          <h2 className="text-white/82 text-lg lg:text-2xl font-semibold max-w-2xl leading-relaxed">
            {hero.subheadline}
          </h2>

          <p className="text-white/66 max-w-2xl text-base lg:text-lg leading-relaxed">
            {hero.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-4" id="apply">
            <a
              href="#results"
              className="inline-flex items-center justify-center bg-gold hover:bg-[#ddb987] text-[#101010] px-8 py-4 rounded-full font-bold tracking-wide transition-all"
            >
              {hero.cta}
            </a>
          </div>

          <div className="flex flex-wrap gap-3 pt-3">
            {hero.metrics.map((metric: string) => (
              <div
                key={metric}
                className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 text-sm"
              >
                {metric}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center w-full">
          <div className="relative w-full max-w-[520px]">
            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-gold/20 to-transparent blur-xl" />
            <div className={`relative rounded-[30px] border border-gold/40 bg-[#111723] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] ${isArabic ? 'font-arabic' : ''}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <p className="text-white text-lg sm:text-xl font-extrabold">{hero.engineTitle ?? 'Client Acquisition Engine'}</p>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full border border-gold/35 bg-gold/10 text-gold font-bold ${isArabic ? 'text-sm sm:text-base' : 'text-xs sm:text-sm tracking-wide'}`}>
                  {hero.engineStatus ?? 'System Active'}
                </span>
              </div>

              <div className="space-y-3">
                {hero.systemPoints.map((point: string) => (
                  <div
                    key={point}
                    className={`flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 ${isArabic ? 'text-right' : ''}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-gold mt-2" />
                    <p className={`text-white/90 leading-relaxed ${isArabic ? 'text-base lg:text-lg' : 'text-sm sm:text-base'}`}>{point}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-gold/25 bg-black/20 p-5 sm:p-6">
                <p className={`text-gold/90 mb-2 ${isArabic ? 'text-sm sm:text-base font-semibold' : 'text-xs uppercase tracking-[0.2em]'}`}>
                  {hero.positioningLabel ?? 'Positioning'}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{hero.bottomTagline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
