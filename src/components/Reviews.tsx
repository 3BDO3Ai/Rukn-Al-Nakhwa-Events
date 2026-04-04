"use client";

import React from "react";
import { useContent } from "@/content/useContent";

interface ReviewItem {
  quote: string;
  author: string;
  company: string;
}

export default function Reviews() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === "rtl";
  const reviews: ReviewItem[] = Array.isArray(dictionary?.reviews?.items) ? dictionary.reviews.items : [];

  return (
    <section id="results" className="bg-[#0D121B] w-full py-20 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2A3040]/70 blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1290px] mx-auto relative z-10" dir={dir}>
        <div className="text-center mb-14">
          <span className="text-gold font-bold text-xs sm:text-sm tracking-[0.2em] uppercase bg-gold/10 border border-gold/25 px-4 py-2 rounded-full">
            {dictionary.reviews.badge}
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mt-5 mb-4">{dictionary.reviews.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((review) => (
            <article
              key={`${review.author}-${review.company}`}
              className={`rounded-3xl border border-white/10 bg-[#141B27] p-7 shadow-[0_16px_32px_rgba(0,0,0,0.22)] ${isArabic ? "text-right" : "text-left"}`}
            >
              <p className="text-gold text-4xl leading-none mb-3">“</p>
              <p className="text-white/90 text-lg font-semibold leading-relaxed mb-7">{review.quote}</p>
              <p className="text-gold font-extrabold tracking-wide">{review.author}</p>
              <p className="text-white/70 text-sm mt-1">{review.company}</p>
            </article>
          ))}
        </div>

        <div id="apply" className="rounded-3xl border border-gold/35 bg-[#111722] p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-4xl font-black text-white mb-6">{dictionary.reviews.bottomCtaHeadline}</h3>
          <a
            href="#hero"
            className="inline-flex items-center justify-center bg-gold hover:bg-[#ddb987] text-[#111] px-8 py-4 rounded-full font-bold transition-colors"
          >
            {dictionary.reviews.bottomCtaButton}
          </a>
        </div>
      </div>
    </section>
  );
}
