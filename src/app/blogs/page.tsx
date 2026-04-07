"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useContent } from "@/content/useContent";
import { formatBlogDate, getBlogSection, stripBlogHtml } from "@/lib/blogs";

function toExcerpt(excerpt: string, contentHtml: string): string {
  if (excerpt.trim()) {
    return excerpt.trim();
  }

  const plain = stripBlogHtml(contentHtml);
  if (plain.length <= 180) {
    return plain;
  }

  return `${plain.slice(0, 177).trim()}...`;
}

export default function BlogsPage() {
  const { dictionary, locale, dir } = useContent();
  const section = getBlogSection(dictionary as Record<string, unknown>, locale);

  const posts = [...section.posts]
    .filter((post) => post.slug.trim().length > 0)
    .sort((a, b) => {
    const aTime = Date.parse(a.publishedAt || "");
    const bTime = Date.parse(b.publishedAt || "");

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
      return 0;
    }

    if (Number.isNaN(aTime)) {
      return 1;
    }

    if (Number.isNaN(bTime)) {
      return -1;
    }

    return bTime - aTime;
    });

  return (
    <>
      <Navbar />
      <main className="section-luxe-light min-h-screen overflow-x-hidden pb-16 pt-28" dir={dir}>
        <section className="section-shell">
          <div className="rounded-3xl border border-[#d8c38f]/60 bg-[linear-gradient(130deg,#fffef8_0%,#f6f0df_100%)] p-6 shadow-[0_18px_40px_rgba(46,35,9,0.12)] sm:p-8">
            <span className="section-badge-light">{section.badge}</span>
            <h1 className="section-heading-light mt-3">{section.title}</h1>
            <p className="section-subtext-light mt-3 max-w-3xl">{section.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#hero" className="btn-secondary-green text-sm">
                {section.backHomeLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell mt-8">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ccb06f]/70 bg-white/80 p-8 text-center text-slate-600">
              {section.emptyMessage}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-2xl border border-[#d6c28f]/70 bg-white shadow-[0_16px_34px_rgba(38,31,16,0.11)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(38,31,16,0.18)]"
                >
                  <div className="relative h-52 overflow-hidden bg-[linear-gradient(120deg,#d9c088_0%,#8ba46a_100%)]">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title || post.slug}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-bold text-white/95">
                        {post.title || post.slug}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a7f4a]">
                      {section.publishedLabel}: {formatBlogDate(post.publishedAt, locale)}
                    </p>
                    <h2 className="text-xl font-black text-[#24331c]">{post.title || post.slug}</h2>
                    <p className="text-sm leading-7 text-slate-600">{toExcerpt(post.excerpt, post.contentHtml)}</p>
                    <Link
                      href={`/blogs/${encodeURIComponent(post.slug)}`}
                      className="inline-flex items-center rounded-full border border-[#d0b071] bg-[#f6edd7] px-4 py-2 text-sm font-bold text-[#3a4d25] transition hover:bg-[#ecd7a2]"
                    >
                      {section.readMoreLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <WhatsAppFloat />
      </main>
      <Footer />
    </>
  );
}
