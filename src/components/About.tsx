"use client";

import React from 'react';
import Image from 'next/image';
import { PHONE_HREF } from '@/lib/contact';
import { useContent } from '@/content/useContent';

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'السرعة والدقة في إنجاز الخدمات',
    desc: 'نلتزم بتقديم خدماتنا في أسرع وقت ممكن مع الحفاظ على أعلى مستويات الجودة والدقة لضمان رضاكم التام وسرعة إنجاز معاملاتكم.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'ضمان السرية التامة للوثائق',
    desc: 'نؤمن بحق العميل في الخصوصية، ونضمن حفظ جميع معلوماتكم ووثائقكم الشخصية بأعلى درجات الأمان والسرية المطلقة.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'المصداقية وإرضاء العملاء',
    desc: 'رضا عملائنا هو أولويتنا الأولى. نحرص على بناء علاقات طويلة الأمد قائمة على الثقة والشفافية، مع التزام تام بتحقيق أفضل النتائج.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'الأمان في تنفيذ جميع الإجراءات',
    desc: 'نطبق أعلى معايير الأمان والحماية في كل مراحل تنفيذ خدماتنا لضمان سلامة حقوق عملائنا الكرام وحماية مصالحهم.',
  },
];

export default function About() {
  const { dictionary, dir } = useContent();
  const about = dictionary.about;
  const isArabic = dir === 'rtl';

  return (
    <section id="about" className="bg-surface w-full py-20 lg:py-28 px-6 font-cairo">
      <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center" dir="ltr">

        {/* Text Content */}
        <div className={`flex-1 flex flex-col ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="mb-10">
            <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">{about.badge}</span>
            <h2 className="text-3xl lg:text-4xl font-black text-darkGreen mt-4 mb-2 leading-[1.35]">
              {about.title}
            </h2>
            <div className={`w-16 h-1 bg-gold rounded-full mt-3 mb-6 ${isArabic ? 'ml-auto' : 'mr-auto'}`} />
            <p className={`text-gray-600 text-lg leading-9 max-w-2xl ${isArabic ? 'text-right ml-auto' : 'text-left mr-auto'}`}>
              {about.description}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {features.map((f, i) => {
              const localized = about.features?.[i] ?? f;
              return (
              <div key={i} className={`flex items-start gap-5 group ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="bg-darkGreen/10 p-4 rounded-2xl text-darkGreen flex-shrink-0 group-hover:bg-darkGreen group-hover:text-white transition-all duration-300 shadow-sm">
                  {f.icon}
                </div>
                <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <h3 className="font-bold text-darkGreen text-lg mb-2">{localized.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{localized.desc}</p>
                </div>
              </div>
              );
            })}
          </div>

          <div className="mt-10">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 bg-darkGreen hover:bg-darkGreen/90 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {dictionary.common.ctaContactNow}
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="flex-1 flex justify-center items-center w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-darkGreen w-full rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden aspect-square">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal/15 rounded-tr-full" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-teal/10" />

            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <div className="bg-white/10 border border-white/20 rounded-3xl p-6">
                <Image
                  src="/Logo.svg"
                  alt={dictionary.common.brandName}
                  width={280}
                  height={280}
                  priority
                  className="w-full h-auto max-w-[280px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
