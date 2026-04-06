"use client";

import React, { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/useContent";
import { buildWhatsAppHref } from "@/lib/contact";

const PIXELS_PER_SECOND = 34;

type LocalizedReview = {
  name: string;
  text: string;
};

export default function Reviews() {
  const { locale, dictionary, dir } = useContent();
  const isArabic = dir === "rtl";
  const applyNowHref = buildWhatsAppHref(
    isArabic
      ? "السلام عليكم، أرغب في التواصل مع مؤسسة ركن النخوة للحفلات."
      : "Hello, I would like to contact Rukn Al-Nakhwa Events."
  );
  const reviewSource = Array.isArray(dictionary?.reviews?.list)
    ? dictionary.reviews.list
    : Array.isArray(dictionary?.reviews?.items)
      ? dictionary.reviews.items
      : [];

  const localizedReviews: LocalizedReview[] = reviewSource
    .map((review: any) => {
      const name = typeof review?.name === "string"
        ? review.name
        : typeof review?.name === "object"
          ? review.name?.[locale]
          : review?.author;

      const text = typeof review?.text === "string"
        ? review.text
        : typeof review?.text === "object"
          ? review.text?.[locale]
          : review?.quote;

      return {
        name: String(name ?? "").trim(),
        text: String(text ?? "").trim(),
      };
    })
    .filter((review: LocalizedReview) => review.name && review.text);

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
        trackRef.current.style.transform = "translate3d(0px, 0, 0)";
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

    window.addEventListener("resize", updateSetWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSetWidth);
    };
  }, [locale]);

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

      const direction = isArabic ? 1 : -1;
      offsetRef.current += ((PIXELS_PER_SECOND * elapsed) / 1000) * direction;
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
  }, [isPaused, isArabic]);

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
    <section id="results" className="section-white text-gray-900 w-full py-20 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[var(--elite-primary)]/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[var(--elite-secondary)]/12 blur-3xl" />
      </div>

      <div className="max-w-[1290px] mx-auto relative z-10" dir={dir}>
        <div className="text-center mb-14">
          <span className="text-gold font-bold text-xs sm:text-sm tracking-[0.2em] uppercase bg-gold/10 border border-gold/25 px-4 py-2 rounded-full">
            {isArabic ? "آراء العملاء" : "Testimonials"}
          </span>
          <h2 className="text-3xl lg:text-5xl font-black leading-[1.12] text-gray-900 mt-5 mb-4">
            {isArabic ? "قصص نجاح العملاء" : "Client Success Stories"}
          </h2>
        </div>

        <div
          dir="ltr"
          className="relative mb-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
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
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className={`flex w-max select-none gap-6 will-change-transform ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ transform: "translate3d(0px, 0, 0)" }}
          >
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                ref={setIndex === 0 ? firstSetRef : setIndex === 1 ? secondSetRef : undefined}
                className="flex flex-shrink-0 gap-6"
                aria-hidden={setIndex !== 0}
              >
                {localizedReviews.map((review, index) => (
                  <article
                    key={`${setIndex}-${review.name}-${index}`}
                    className={`w-[330px] min-h-[260px] shrink-0 rounded-3xl border border-[var(--elite-secondary)]/18 bg-white p-7 shadow-[0_18px_36px_rgba(42,64,18,0.12)] sm:w-[360px] lg:w-[390px] ${isArabic ? "text-right" : "text-left"}`}
                    lang={isArabic ? "ar" : "en"}
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <div>
                      <p className="text-gold text-5xl leading-none mb-4">“</p>
                      <p className={`text-gray-600 leading-relaxed ${isArabic ? "text-[1.02rem] font-semibold" : "text-base"}`}>
                        {review.text}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gold/20">
                      <span className="inline-flex items-center rounded-full border border-[var(--elite-primary)]/30 bg-[var(--elite-primary)]/10 px-4 py-1.5 text-gold font-extrabold tracking-wide">
                        {review.name}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div id="apply" className="rounded-3xl border border-[var(--elite-secondary)]/16 bg-white p-8 text-center shadow-[0_14px_28px_rgba(42,64,18,0.08)] lg:p-12">
          <h3 className="text-2xl lg:text-4xl font-black text-gray-900 mb-6">{dictionary.reviews.bottomCtaHeadline}</h3>
          <a
            href={applyNowHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gold hover:bg-[#ddb987] text-gray-900 px-8 py-4 rounded-full font-bold transition-colors"
          >
            {dictionary.reviews.bottomCtaButton}
          </a>
        </div>
      </div>
    </section>
  );
}
