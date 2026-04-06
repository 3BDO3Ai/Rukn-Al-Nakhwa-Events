'use client';

import { useContent } from '@/content/useContent';
import { ClockIcon, TrophyIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface StatItem {
  value?: string;
  label: string;
  target?: number;
  prefix?: string;
  suffix?: string;
}

export default function StatsSection() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const stats = dictionary.stats;
  const items: StatItem[] = Array.isArray(stats?.items) ? stats.items : [];
  const icons = [UserGroupIcon, TrophyIcon, ClockIcon, SparklesIcon];

  return (
    <section id="stats" className="section-numbers py-16 md:py-20">
      <div className="section-shell" dir={dir}>
        <div className="mb-10 text-center">
          <p className="section-badge-light">{stats?.badge}</p>
          <h2 className="section-title-balance section-heading-light">{stats?.title}</h2>
          <p className="section-subtext-light mx-auto text-center">{stats?.description}</p>
        </div>

        <div className="rounded-[1.7rem] border border-[#cab27f]/70 bg-[rgba(242,234,216,0.66)] p-2 shadow-[0_16px_34px_rgba(74,56,21,0.14)]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            (() => {
              const Icon = icons[index] ?? SparklesIcon;

              return (
                <article key={item.label} className={`reveal-card rounded-[1.05rem] border border-[#ccb587] bg-[#fbfaf6] p-5 shadow-[0_6px_15px_rgba(74,56,21,0.12)] ${isArabic ? 'text-right' : 'text-left'}`}>
                  <div className={`mb-3 flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Icon className="h-8 w-8 text-[#2f4a16]" />
                    <span className="h-1.5 w-12 rounded-full bg-[var(--elite-primary)]" />
                  </div>

                  <p className="bg-[linear-gradient(180deg,#173514,#2f521a)] bg-clip-text text-4xl font-black text-transparent">
                    {typeof item.target === 'number' ? `${item.prefix ?? ''}${item.target}${item.suffix ?? ''}` : item.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{item.label}</p>
                </article>
              );
            })()
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
