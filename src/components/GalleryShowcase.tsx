'use client';

import { useEffect, useMemo, useState } from 'react';
import { useContent } from '@/content/useContent';

type GalleryMediaType = 'image' | 'video';

interface GalleryItem {
  src: string;
  type?: GalleryMediaType;
  title?: string;
  description?: string;
  thumbnail?: string;
  fileName?: string;
}

function normalizeMediaType(item: GalleryItem): GalleryMediaType {
  if (item.type === 'video' || item.type === 'image') {
    return item.type;
  }

  const lowerSrc = item.src.toLowerCase();
  if (/(\.mp4|\.mov|\.webm|\.m4v|\.ogg)(\?|$)/.test(lowerSrc)) {
    return 'video';
  }

  return 'image';
}

export default function GalleryShowcase() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const gallery = dictionary.gallery as {
    badge?: string;
    title?: string;
    subtitle?: string;
    focusHint?: string;
    emptyMessage?: string;
    videoBadge?: string;
    items?: GalleryItem[];
  } | undefined;

  const items = useMemo(() => {
    if (!Array.isArray(gallery?.items)) {
      return [] as Array<GalleryItem & { type: GalleryMediaType }>;
    }

    return gallery.items
      .filter((item) => item && typeof item.src === 'string' && item.src.trim().length > 0)
      .map((item) => ({ ...item, type: normalizeMediaType(item) }));
  }, [gallery]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  const activeItem = items[activeIndex];

  const goToPrevious = () => {
    if (items.length <= 1) {
      return;
    }

    setActiveIndex((current) => {
      return (current - 1 + items.length) % items.length;
    });
  };

  const goToNext = () => {
    if (items.length <= 1) {
      return;
    }

    setActiveIndex((current) => {
      return (current + 1) % items.length;
    });
  };

  return (
    <section id="gallery" className="section-luxe-light py-16 md:py-20">
      <div className="section-shell" dir={dir}>
        <div className={isArabic ? 'mb-10 text-right' : 'mb-10 text-left'}>
          <p className="section-badge-light">{gallery?.badge}</p>
          <h2 className="section-title-balance section-heading-light">{gallery?.title}</h2>
          <p className="section-subtext-light">{gallery?.subtitle}</p>
        </div>

        {items.length === 0 ? (
          <div className="surface-card p-8 text-center text-sm text-slate-600">
            {gallery?.emptyMessage || (isArabic ? 'لا توجد وسائط للعرض حالياً.' : 'No media available yet.')}
          </div>
        ) : (
          <div className="reveal-card overflow-hidden rounded-[2rem] border border-[#bfa66a]/40 bg-[linear-gradient(180deg,#fffefb_0%,#f6f0e2_100%)] shadow-[0_22px_55px_rgba(46,35,11,0.16)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1a1a1a] sm:aspect-[21/9]">
              {activeItem?.type === 'video' ? (
                <video
                  key={activeItem.src}
                  src={activeItem.src}
                  poster={activeItem.thumbnail}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={activeItem?.src}
                  alt={activeItem?.title || (isArabic ? 'لقطة من أعمالنا' : 'A moment from our work')}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

              {activeItem?.type === 'video' && (
                <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-black/55 px-3 py-1 text-xs font-bold text-white">
                  {gallery?.videoBadge || (isArabic ? 'فيديو' : 'Video')}
                </span>
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 px-3 py-2 text-2xl font-black text-white transition hover:bg-black/70"
                    aria-label={isArabic ? 'السابق' : 'Previous'}
                  >
                    {isArabic ? '›' : '‹'}
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 px-3 py-2 text-2xl font-black text-white transition hover:bg-black/70"
                    aria-label={isArabic ? 'التالي' : 'Next'}
                  >
                    {isArabic ? '‹' : '›'}
                  </button>
                </>
              )}

              <div className={`absolute bottom-0 left-0 right-0 p-5 text-white ${isArabic ? 'text-right' : 'text-left'}`}>
                {activeItem?.description && (
                  <p className="mt-1 max-w-3xl text-sm text-white/90 md:text-base">{activeItem.description}</p>
                )}
                <p className="mt-2 text-xs font-semibold text-white/85">
                  {gallery?.focusHint || (isArabic ? 'استخدم الأسهم للتنقل بين الصور والفيديوهات' : 'Use arrows to browse the gallery slider')}
                </p>
              </div>
            </div>

            {items.length > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-[#d7c7a0]/45 bg-[#f8f1df] px-4 py-3 sm:px-6" dir={dir}>
                <span className="text-xs font-bold text-[#5d4a28] sm:text-sm">
                  {isArabic ? `عنصر ${activeIndex + 1} من ${items.length}` : `Item ${activeIndex + 1} of ${items.length}`}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {items.map((item, index) => (
                    <button
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={isArabic ? `الانتقال إلى العنصر ${index + 1}` : `Go to item ${index + 1}`}
                      className={`h-2.5 rounded-full transition ${
                        index === activeIndex
                          ? 'w-8 bg-[#9d7a33]'
                          : 'w-2.5 bg-[#c8b186] hover:bg-[#b59656]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
