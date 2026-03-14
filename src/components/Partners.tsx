'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const allLogos = [
  { src: '/Partners/Absher.png', alt: 'أبشر' },
  { src: '/Partners/Najiz.png', alt: 'ناجز' },
  { src: '/Partners/Mudad-1.png', alt: 'مدد' },
  { src: '/Partners/GOSI-2.png', alt: 'التأمينات الاجتماعية' },
  { src: '/Partners/balady.png', alt: 'بلدي' },
  { src: '/Partners/Ministry-of-Commerce.png', alt: 'وزارة التجارة' },
  { src: '/Partners/QIWA-011.png', alt: 'قوى' },
  { src: '/Partners/Musaned-_011.png', alt: 'مساند' },
  { src: '/Partners/General_Directorate_of_Passports-1.png', alt: 'المديرية العامة للجوازات' },
  { src: '/Partners/Ministry-of-Foreign-Affairs-01.png', alt: 'وزارة الخارجية' },
  { src: '/Partners/Sadad-01.png', alt: 'سداد' },
  { src: '/Partners/zakat-rax-and-customs-authority-1.png', alt: 'هيئة الزكاة والضريبة والجمارك' },
  { src: '/Partners/Jeddah-Chamber-01.png', alt: 'الغرفة التجارية' },
];

const PIXELS_PER_SECOND = 42;

function LogoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 w-[240px] h-32 flex-shrink-0 transition-all shadow-sm hover:shadow-md">
      <Image
        src={src}
        alt={alt}
        width={220}
        height={110}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

export default function Partners() {
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const secondSetRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const previousTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateSetWidth = () => {
      if (!firstSetRef.current) {
        return;
      }

      if (secondSetRef.current) {
        const measured = secondSetRef.current.offsetLeft - firstSetRef.current.offsetLeft;
        setWidthRef.current = measured > 0 ? measured : firstSetRef.current.scrollWidth;
      } else {
        setWidthRef.current = firstSetRef.current.scrollWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = 'translateX(0px)';
      }

      offsetRef.current = 0;
      previousTimestampRef.current = null;
    };

    updateSetWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateSetWidth();
    });

    if (firstSetRef.current) {
      resizeObserver.observe(firstSetRef.current);
    }

    window.addEventListener('resize', updateSetWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSetWidth);
    };
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!trackRef.current || !setWidthRef.current) {
        frameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      if (isPaused) {
        previousTimestampRef.current = timestamp;
        frameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      if (previousTimestampRef.current === null) {
        previousTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - previousTimestampRef.current;
      previousTimestampRef.current = timestamp;

      offsetRef.current -= (PIXELS_PER_SECOND * elapsed) / 1000;

      while (offsetRef.current <= -setWidthRef.current) {
        offsetRef.current += setWidthRef.current;
      }

      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPaused]);

  return (
    <section id="partners" className="bg-gray-50/60 py-16 px-6 overflow-hidden">
      <div className="max-w-[1290px] mx-auto" dir="rtl">
        <div className="text-center mb-12">
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">
            شركاؤنا
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-darkGreen mt-4 mb-3">
            خدماتنا مع أهم الجهات في المملكة
          </h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4" />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg mt-6">
            نتعاون مع أبرز الجهات الحكومية والمنصات الإلكترونية لتقديم خدمات متكاملة وشاملة
          </p>
        </div>

        <div
          dir="ltr"
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-gray-50/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-gray-50/95 to-transparent" />

          <div
            ref={trackRef}
            className="flex gap-8 w-max will-change-transform"
            style={{ transform: 'translate3d(0px, 0, 0)' }}
          >
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                ref={setIndex === 0 ? firstSetRef : setIndex === 1 ? secondSetRef : undefined}
                className="flex gap-8 flex-shrink-0"
                aria-hidden={setIndex !== 0}
              >
                {allLogos.map((logo, logoIndex) => (
                  <LogoCard
                    key={`${setIndex}-${logo.alt}-${logoIndex}`}
                    src={logo.src}
                    alt={logo.alt}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
