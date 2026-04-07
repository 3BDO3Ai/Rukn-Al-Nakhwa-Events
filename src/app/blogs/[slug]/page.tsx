"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useContent } from "@/content/useContent";
import { formatBlogDate, getBlogSection, sanitizeBlogHtml } from "@/lib/blogs";

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>();
  const { dictionary, locale, dir } = useContent();
  const section = getBlogSection(dictionary as Record<string, unknown>, locale);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const slug = useMemo(() => {
    const raw = params?.slug;
    if (!raw) {
      return "";
    }

    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [params?.slug]);

  const post = section.posts.find((item) => item.slug === slug);
  const hasGallerySlider = Boolean(post && post.gallery.length > 3);
  const previousImageLabel = locale === "ar" ? "الصورة السابقة" : "Previous image";
  const nextImageLabel = locale === "ar" ? "الصورة التالية" : "Next image";
  const selectImageLabel = locale === "ar" ? "عرض الصورة" : "Show image";

  useEffect(() => {
    setGalleryIndex(0);
  }, [post?.slug]);

  const handlePreviousImage = () => {
    setGalleryIndex((current) => Math.max(current - 1, 0));
  };

  const handleNextImage = () => {
    if (!post) {
      return;
    }

    setGalleryIndex((current) => Math.min(current + 1, post.gallery.length - 1));
  };

  return (
    <>
      <Navbar />
      <main className="section-luxe-light min-h-screen overflow-x-hidden pb-16 pt-28" dir={dir}>
        <section className="section-shell">
          <div className="mb-5 flex flex-wrap gap-3">
            <Link href="/blogs" className="rounded-full border border-[#d0b071] bg-white px-4 py-2 text-sm font-bold text-[#3a4d25] hover:bg-[#f8f0dc]">
              {section.backToBlogsLabel}
            </Link>
            <Link href="/#hero" className="rounded-full border border-[#b0c094] bg-[#f1f6e8] px-4 py-2 text-sm font-bold text-[#335028] hover:bg-[#e4eed5]">
              {section.backHomeLabel}
            </Link>
          </div>

          {!post ? (
            <div className="rounded-2xl border border-dashed border-[#ccb06f]/70 bg-white/80 p-8 text-center text-slate-600">
              {section.emptyMessage}
            </div>
          ) : (
            <article className="rounded-3xl border border-[#d8c38f]/70 bg-white shadow-[0_20px_44px_rgba(38,31,16,0.14)]">
              <div className="h-72 overflow-hidden rounded-t-3xl bg-[linear-gradient(120deg,#d9c088_0%,#8ba46a_100%)] sm:h-[22rem]">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title || post.slug} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-8 text-center text-xl font-black text-white">
                    {post.title || post.slug}
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a7f4a]">
                  {section.publishedLabel}: {formatBlogDate(post.publishedAt, locale)}
                </p>
                <h1 className="mt-3 text-3xl font-black leading-tight text-[#24331c] sm:text-4xl">{post.title || post.slug}</h1>
                {post.author && <p className="mt-2 text-sm text-slate-500">{post.author}</p>}

                <div
                  className="mt-7 overflow-x-hidden rounded-2xl border border-[#ebe0c4] bg-[#fffdf8] p-5 text-[15px] leading-8 text-slate-700 [overflow-wrap:anywhere] sm:p-7 [&_a]:break-words [&_a]:text-[#2f5b2b] [&_a]:underline [&_blockquote]:border-s-4 [&_blockquote]:border-[#d0b071] [&_blockquote]:ps-4 [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-black [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-bold [&_iframe]:max-w-full [&_img]:mx-auto [&_img]:h-auto [&_img]:max-w-full [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:break-words [&_p]:mb-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:whitespace-nowrap [&_ul]:list-disc [&_ul]:ps-5 [&_video]:h-auto [&_video]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.contentHtml) }}
                />

                {post.gallery.length > 0 && (
                  <section className="mt-8">
                    <h2 className="text-xl font-black text-[#2b3c1f]">{section.galleryLabel}</h2>

                    {hasGallerySlider ? (
                      <div className="mt-4">
                        <div className="relative overflow-hidden rounded-2xl border border-[#d7c79f] bg-[#f7f2e6]">
                          <img
                            src={post.gallery[galleryIndex]}
                            alt={`${post.title || post.slug} ${galleryIndex + 1}`}
                            className="h-72 w-full object-cover sm:h-[26rem]"
                          />

                          <button
                            type="button"
                            onClick={handlePreviousImage}
                            disabled={galleryIndex === 0}
                            aria-label={previousImageLabel}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[#d0b071] bg-white/95 px-3 py-2 text-sm font-black text-[#304424] shadow hover:bg-[#f5ead0] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {dir === "rtl" ? ">" : "<"}
                          </button>
                          <button
                            type="button"
                            onClick={handleNextImage}
                            disabled={galleryIndex >= post.gallery.length - 1}
                            aria-label={nextImageLabel}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#d0b071] bg-white/95 px-3 py-2 text-sm font-black text-[#304424] shadow hover:bg-[#f5ead0] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {dir === "rtl" ? "<" : ">"}
                          </button>
                        </div>

                        <div className="mt-3 text-sm font-semibold text-[#5a6f3e]">
                          {galleryIndex + 1} / {post.gallery.length}
                        </div>

                        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                          {post.gallery.map((image, index) => (
                            <button
                              key={`${post.slug}-gallery-thumb-${index}`}
                              type="button"
                              onClick={() => setGalleryIndex(index)}
                              aria-label={`${selectImageLabel} ${index + 1}`}
                              className={`overflow-hidden rounded-lg border transition ${
                                galleryIndex === index
                                  ? "border-[#b9934b] ring-2 ring-[#e5d3a6]"
                                  : "border-[#d7c79f] hover:border-[#c3a464]"
                              }`}
                            >
                              <img src={image} alt={`${post.title || post.slug} ${index + 1}`} className="h-16 w-full object-cover sm:h-20" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {post.gallery.map((image, index) => (
                          <div key={`${post.slug}-gallery-${index}`} className="overflow-hidden rounded-xl border border-[#d7c79f] bg-[#f7f2e6]">
                            <img src={image} alt={`${post.title || post.slug} ${index + 1}`} className="h-36 w-full object-cover sm:h-44" />
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>
            </article>
          )}
        </section>
        <WhatsAppFloat />
      </main>
      <Footer />
    </>
  );
}
