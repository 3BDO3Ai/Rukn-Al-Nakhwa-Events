'use client';

import { useContent } from '@/content/useContent';
import { ChatBubbleLeftRightIcon, CurrencyDollarIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface WhyItem {
  title: string;
  description: string;
}

export default function WhyChooseUs() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const section = dictionary.whyChooseUs;
  const reasons: WhyItem[] = Array.isArray(section?.items) ? section.items : [];
  const icons = [SparklesIcon, CurrencyDollarIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon];

  return (
    <section id="why-us" className="section-why-premium py-16 md:py-20">
      <div className="section-shell" dir={dir}>
        <div className="mb-12 text-center">
          <p className="section-badge-dark">{section?.badge}</p>
          <h2 className="section-title-balance section-heading-dark mx-auto max-w-4xl">{section?.title}</h2>
          {section?.description && <p className="section-subtext-dark mx-auto text-center">{section.description}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = icons[index] ?? SparklesIcon;

            return (
            <article key={reason.title} className={`reveal-card group rounded-2xl border border-[#d4b771]/28 bg-[linear-gradient(165deg,rgba(30,59,45,0.86)_0%,rgba(20,41,32,0.9)_100%)] p-6 shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#e3c67f]/45 ${isArabic ? 'text-right' : 'text-left'}`}>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4b771]/55 bg-[rgba(231,173,30,0.12)] text-[#e5be63]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#f0dfbf]">{reason.title}</h3>
              <p className="mt-3 text-base leading-8 text-[#d8c7a4]">{reason.description}</p>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
