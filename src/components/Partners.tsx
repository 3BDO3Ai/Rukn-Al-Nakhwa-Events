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
    <div className="flex h-32 w-[240px] flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--elite-secondary)]/20 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf4_100%)] px-4 py-3 shadow-[0_10px_24px_rgba(20,30,14,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(20,30,14,0.14)]">
      <Image
        src={src}
        alt={alt}
        width={220}
        height={110}
        sizes="(max-width: 640px) 180px, 220px"
        loading="lazy"
        decoding="async"
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

  const sectionRef = useRef<HTMLElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const secondSetRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const previousTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

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
    if (!sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.15 });

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!trackRef.current || !setWidthRef.current) {
        return;
      }

      if (isPaused || !isInView) {
        previousTimestampRef.current = timestamp;
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

    if (isInView && !isPaused) {
      frameRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPaused, isInView]);

  return (
    <section ref={sectionRef} id="partners" className="section-luxe-dark overflow-hidden px-6 py-16 text-[#f3ead6] md:py-20">
      <div className="section-shell" dir={dir}>
        <div className="mb-12 text-center">
          <span className="section-badge-dark">
            {dictionary.partners.badge}
          </span>
          <h2 className="section-title-balance section-heading-dark mt-5 mb-4">{dictionary.partners.title}</h2>
          <p className="section-subtext-dark mx-auto text-base lg:text-lg">{dictionary.partners.description}</p>
        </div>

        <div
          dir="ltr"
          className="reveal-card relative overflow-hidden rounded-3xl border border-[#e4bc73]/26 bg-[rgba(15,18,14,0.55)] p-4 shadow-[0_24px_44px_rgba(0,0,0,0.35)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#10140f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#10140f] to-transparent" />

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
