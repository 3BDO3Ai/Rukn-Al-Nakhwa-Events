'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useContent } from '@/content/useContent';

interface PartnerLogo {
  src: string;
  alt: string;
}

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
  const { dictionary, dir } = useContent();
  const dynamicLogos: PartnerLogo[] = Array.isArray(dictionary?.partners?.logos)
    ? (dictionary.partners.logos as PartnerLogo[])
    : [];

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
    <section id="partners" className="bg-[#0A0D13] py-20 px-6 border-y border-white/5 overflow-hidden">
      <div className="max-w-[1290px] mx-auto" dir={dir}>
        <div className="text-center mb-12">
          <span className="text-gold font-bold text-xs sm:text-sm tracking-[0.2em] uppercase bg-gold/10 border border-gold/25 px-4 py-2 rounded-full">
            {dictionary.partners.badge}
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mt-5 mb-4">{dictionary.partners.title}</h2>
          <p className="text-white/65 max-w-3xl mx-auto text-base lg:text-lg">{dictionary.partners.description}</p>
        </div>

        <div
          dir="ltr"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111722] p-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#111722] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#111722] to-transparent z-10" />

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
                {dynamicLogos.map((logo, logoIndex) => (
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
