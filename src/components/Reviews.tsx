"use client";
import React, { useEffect, useRef, useState } from 'react';

const reviews = [
  {
    name: 'Salem Alidros',
    rating: 5,
    text: 'مكتب قمة في الاحترافية، شغلهم أكثر من رائع، إنجاز سريع جدًا، ودقة ونظافة في العمل تشرح الصدر. الطاقم لديهم معرفة كاملة بكل ما يخص الدوائر الحكومية.',
  },
  {
    name: 'FUTUN Q',
    rating: 5,
    text: 'تعامل راقٍ وأخلاق عالية، الخدمة تمت بكل احترافية وسلاسة، وكان هناك حرص على الدقة واحترام الوقت. تجربة ممتازة.',
  },
  {
    name: 'Yosry Hamza',
    rating: 5,
    text: 'التعامل مع المكتب جيد جداً، لديهم مثابرة في حل مشكلة العميل وتقديم خدمة ممتازة وسريعة.',
  },
  {
    name: 'فيصل الحربي',
    rating: 5,
    text: 'تعاون واحترافية وسرعة وإنجاز في كافة الخدمات الإلكترونية، أنصح بهم جداً ولو كان هناك أكثر من 5 نجوم لاستحقوها.',
  },
  {
    name: 'MAZAN Sber',
    rating: 5,
    text: 'أفضل مكتب خدمات عامة، إنجاز وسرعة وموثوقية، ولديهم جميع الخدمات المطلوبة.',
  },
  {
    name: 'z .a.assiri',
    rating: 5,
    text: 'شكراً لهم ويعطيهم العافية؛ سرعة، دقة، وإنجاز.',
  },
  {
    name: 'maryam sowar',
    rating: 5,
    text: 'من أفضل مكاتب الخدمات، خلصوا لي شغلي بسرعة ما شاء الله، وأهم شيء المصداقية والأمانة في التعامل. جداً سعيدة بتجربتي معهم.',
  },
];

const PIXELS_PER_SECOND = 36;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const secondSetRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragAreaRef = useRef<HTMLDivElement | null>(null);
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
  }, []);

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
    <section id="reviews" className="bg-darkGreen w-full py-20 lg:py-28 px-6 relative overflow-hidden">
      {/* Background decoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1290px] mx-auto relative z-10" dir="rtl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
            تقييماتنا
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white mt-4 mb-3">
            آراء عملائنا الكرام
          </h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4 mb-4" />
          <p className="text-white/60 max-w-xl mx-auto text-base">
            نفخر بثقة عملائنا وآرائهم الصادقة التي تعكس جودة خدماتنا والتزامنا بالتميز
          </p>
        </div>

        {/* Review Marquee */}
        <div
          dir="ltr"
          ref={dragAreaRef}
          className="relative overflow-hidden"
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
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-darkGreen to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-darkGreen to-transparent" />

          <div
            ref={trackRef}
            className={`flex w-max will-change-transform select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ transform: 'translate3d(0px, 0, 0)' }}
          >
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                ref={setIndex === 0 ? firstSetRef : setIndex === 1 ? secondSetRef : undefined}
                className="flex gap-6 flex-shrink-0"
                aria-hidden={setIndex !== 0}
              >
                {reviews.map((review, i) => (
                  <div
                    key={`${setIndex}-${review.name}-${i}`}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-7 flex flex-col gap-4 text-right w-[320px] sm:w-[360px] min-h-[260px]"
                    dir="rtl"
                  >
                    <div className="text-gold/40 text-6xl font-serif leading-none -mb-2 select-none">&ldquo;</div>

                    <StarRating count={review.rating} />

                    <p className="text-white/85 text-sm leading-relaxed flex-1">{review.text}</p>

                    <div className="border-t border-white/15 pt-4 flex flex-row-reverse items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{review.name}</div>
                        <div className="text-white/50 text-xs">عميل موثق</div>
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
