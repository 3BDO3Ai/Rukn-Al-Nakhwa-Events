"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PHONE_HREF, buildWhatsAppHref } from '@/lib/contact';
import { useContent } from '@/content/useContent';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  items: string[];
}

const PIXELS_PER_SECOND = 54;

export default function Services() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const services = Array.isArray(dictionary?.services?.cards)
    ? (dictionary.services.cards as Service[])
    : [];

  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const secondSetRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const previousTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isPointerDownRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  const normalizeOffset = (value: number) => {
    if (!setWidthRef.current) {
      return value;
    }

    let normalized = value;
    while (normalized <= -setWidthRef.current) {
      normalized += setWidthRef.current;
    }
    while (normalized > 0) {
      normalized -= setWidthRef.current;
    }
    return normalized;
  };

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
        trackRef.current.style.transform = 'translate3d(0px, 0, 0)';
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
  }, [services.length]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!trackRef.current || !setWidthRef.current) {
        frameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      if (isPaused || isPointerDownRef.current) {
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
      offsetRef.current = normalizeOffset(offsetRef.current);

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

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!setWidthRef.current) {
      return;
    }

    isPointerDownRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    setIsDragging(true);
    previousTimestampRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isPointerDownRef.current || !trackRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    offsetRef.current = normalizeOffset(dragStartOffsetRef.current + deltaX);
    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      setIsDragging(false);
      previousTimestampRef.current = null;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section id="services" className="bg-white w-full py-20 lg:py-28 px-6 font-cairo">
      <div className="max-w-[1290px] mx-auto" dir="ltr">
        <div className="text-center mb-16" dir={dir}>
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">
            {dictionary.services.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-darkGreen mt-4 mb-3">
            {dictionary.services.title}
          </h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4 mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {dictionary.services.description}
          </p>
        </div>

        <div
          dir="ltr"
          className="relative overflow-hidden -mx-2 sm:-mx-3 lg:-mx-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            if (isPointerDownRef.current) {
              isPointerDownRef.current = false;
              setIsDragging(false);
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 sm:w-6 lg:w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 sm:w-6 lg:w-8 bg-gradient-to-l from-white to-transparent" />

          <div
            ref={trackRef}
            className={`flex gap-4 sm:gap-5 w-max will-change-transform select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ transform: 'translate3d(0px, 0, 0)' }}
          >
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                ref={setIndex === 0 ? firstSetRef : setIndex === 1 ? secondSetRef : undefined}
                className="flex gap-4 sm:gap-5 flex-shrink-0"
                aria-hidden={setIndex !== 0}
              >
                {services.map((service) => (
                  <div
                    key={`${setIndex}-${service.id}`}
                    className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group w-[300px] sm:w-[335px] min-h-[650px]"
                  >
                    <div className="bg-darkGreen/5 px-7 pt-8 pb-6 border-b border-gray-100 group-hover:bg-darkGreen/10 transition-colors">
                      <div className="flex flex-col items-center text-center gap-5">
                        <div className="w-28 h-28 bg-white rounded-[24px] shadow-sm flex items-center justify-center flex-shrink-0 p-0 border border-white/80 overflow-hidden">
                          <Image
                            src={service.logoUrl}
                            alt={service.logoAlt}
                            width={88}
                            height={88}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-black text-darkGreen text-lg leading-tight">{service.title}</h3>
                          <p className="text-teal text-sm font-medium mt-0.5">{service.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-7 py-6 flex flex-col flex-1" dir={dir}>
                      <p className={`text-gray-600 text-sm leading-relaxed mb-5 ${isArabic ? 'text-right' : 'text-left'}`}>{service.description}</p>

                      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                        {service.items.map((item, i) => (
                          <li key={i} className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
                            <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex gap-3 flex-wrap">
                        <a
                          href={PHONE_HREF}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-darkGreen hover:bg-darkGreen/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                          </svg>
                          {dictionary.common.ctaCall}
                        </a>
                        <a
                          href={buildWhatsAppHref(
                            dictionary.services.whatsappTemplate.replace('{{serviceTitle}}', service.title)
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.113 1.522 5.851L0 24l6.293-1.489A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.783-.553-5.333-1.508L3.5 21.5l1.008-3.167A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fillRule="evenodd" clipRule="evenodd"/>
                          </svg>
                          {dictionary.common.ctaWhatsapp}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
