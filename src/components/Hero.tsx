'use client';

import { buildWhatsAppHref } from '@/lib/contact';
import { useContent } from '@/content/useContent';
import { useEffect, useState } from 'react';

export default function Hero() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const alignClass = isArabic ? 'text-right' : 'text-left';
  const hero = dictionary.hero;
  const fullTitle = hero?.title ?? '';
  const fullSubtitle = hero?.subtitle ?? '';
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');

  useEffect(() => {
    if (!fullTitle && !fullSubtitle) {
      setTypedTitle('');
      setTypedSubtitle('');
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTypedTitle(fullTitle);
      setTypedSubtitle(fullSubtitle);
      return;
    }

    let timeoutId: number | undefined;
    let titleIndex = 0;
    let subtitleIndex = 0;

    setTypedTitle('');
    setTypedSubtitle('');

    const typeSubtitle = () => {
      if (subtitleIndex < fullSubtitle.length) {
        subtitleIndex += 1;
        setTypedSubtitle(fullSubtitle.slice(0, subtitleIndex));
        timeoutId = window.setTimeout(typeSubtitle, 35);
      }
    };

    const typeTitle = () => {
      if (titleIndex < fullTitle.length) {
        titleIndex += 1;
        setTypedTitle(fullTitle.slice(0, titleIndex));
        timeoutId = window.setTimeout(typeTitle, 45);
      } else {
        timeoutId = window.setTimeout(typeSubtitle, 120);
      }
    };

    timeoutId = window.setTimeout(typeTitle, 80);

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [fullTitle, fullSubtitle]);

  const primaryMessage =
    hero?.primaryButton?.whatsappMessage ??
    (dir === 'rtl'
      ? 'السلام عليكم، أرغب في حجز مناسبة لدى مؤسسة ركن النخوة للحفلات.'
      : 'Hello, I would like to book an event with Rukn Al-Nakhwa.');
  const primaryHref = buildWhatsAppHref(primaryMessage);

  return (
    <section id="hero" className="section-soft-gradient min-h-[100svh] py-28 text-white md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6" dir={dir}>
        <div className="grid items-center gap-10 lg:gap-14">
          <div className={`order-1 max-w-5xl space-y-8 ${alignClass}`}>
            <p className="hero-reveal hero-delay-1 inline-flex items-center rounded-full border border-[#d6aa54]/80 bg-[rgba(7,10,8,0.45)] px-4 py-2 text-xs font-bold tracking-[0.04em] text-[#f6d28a] shadow-[0_8px_20px_rgba(0,0,0,0.28)]">
              {hero?.badge}
            </p>

            <h1 className="hero-reveal hero-delay-2 text-4xl font-black leading-[1.16] text-[#f9f2de] drop-shadow-[0_10px_24px_rgba(0,0,0,0.4)] md:text-7xl md:leading-[1.05]">
              {typedTitle}
            </h1>

            <div className="hero-reveal hero-delay-3 flex justify-start">
              <h2 className="max-w-4xl border-s-4 border-[var(--elite-primary)] ps-4 text-2xl font-extrabold leading-[1.22] text-[var(--elite-primary)] drop-shadow-[0_8px_20px_rgba(122,84,25,0.35)] md:text-5xl md:leading-[1.12]">
                {typedSubtitle}
              </h2>
            </div>

            <p className="hero-reveal hero-delay-4 max-w-4xl text-base leading-8 text-[#ece1cc] md:text-xl md:leading-9">
              {hero?.description}
            </p>

            <div className="hero-reveal hero-delay-5 flex w-full flex-row gap-3 justify-start sm:w-auto sm:gap-4">
              <a
                href={hero?.secondaryButton?.href ?? '#packages'}
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-2xl border border-[#6bb484] bg-[rgba(8,56,41,0.65)] px-4 py-3 text-center text-sm font-extrabold leading-5 text-[#ecfff4] shadow-[0_8px_20px_rgba(1,20,15,0.35)] transition hover:brightness-110 sm:min-w-[160px] sm:flex-none sm:px-7 sm:text-lg"
              >
                {hero?.secondaryButton?.label}
              </a>
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-2xl border border-[#f3c571]/80 bg-[linear-gradient(180deg,#e7b347_0%,#bf8731_100%)] px-4 py-3 text-center text-sm font-extrabold leading-5 text-[#1a1e12] shadow-[0_10px_26px_rgba(122,84,25,0.35)] transition hover:brightness-105 sm:min-w-[190px] sm:flex-none sm:px-7 sm:text-lg"
              >
                {hero?.primaryButton?.label}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
