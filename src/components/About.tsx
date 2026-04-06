'use client';

import { useContent } from '@/content/useContent';
import { BuildingLibraryIcon, SparklesIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface AboutCard {
  title: string;
  description: string;
}

export default function About() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const about = dictionary.about;
  const cards: AboutCard[] = Array.isArray(about?.cards) ? about.cards : [];
  const cardIcons = [BuildingLibraryIcon, UserGroupIcon, SparklesIcon];

  return (
    <section id="about" className="section-about-heritage w-full px-6 py-20 lg:py-28">
      <div className="mx-auto flex max-w-[1290px] flex-col items-center gap-12 lg:flex-row-reverse lg:gap-20" dir={dir}>
        <div className={`flex flex-1 flex-col ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="mb-10">
            <span className="inline-flex rounded-full border border-[#cab27f] bg-[rgba(231,173,30,0.14)] px-3 py-1 text-sm font-bold tracking-widest text-[#7a5b24]">
              {about?.badge}
            </span>
            <div className="mt-6 flex w-full items-center justify-center lg:hidden">
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-[linear-gradient(145deg,#1f3413_0%,#243f15_48%,#16250f_100%)] p-8 shadow-2xl">
                <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-white/5" />
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-tr-full bg-[rgba(30,145,120,0.16)]" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(42,64,18,0.2)]" />

                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-8">
                    <Image src="/logo_3.svg" alt={dictionary.common?.brandName ?? 'Brand'} width={240} height={120} sizes="240px" className="h-auto w-full max-w-[240px] object-contain" />
                  </div>
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-black leading-[1.12] text-[#294215] lg:text-5xl">{about?.title}</h2>
            <div className={`mt-3 mb-6 h-1 w-16 rounded-full bg-[var(--elite-primary)] ${isArabic ? 'ml-auto' : 'mr-auto'}`} />
            <p className={`max-w-2xl text-lg leading-9 text-[#5f634f] ${isArabic ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              {about?.description}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {cards.map((point, index) => {
              const Icon = cardIcons[index] ?? ShieldCheckIcon;

              return (
                <article key={point.title} className="group flex items-start gap-5">
                  <div className="flex-shrink-0 rounded-2xl bg-[rgba(42,64,18,0.12)] p-4 text-[#2A4012] shadow-sm transition-all duration-300 group-hover:bg-[#2A4012] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <h3 className="mb-2 text-lg font-bold text-[#2A4012]">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-[#61685b]">{point.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={`mt-10 ${isArabic ? 'text-right' : 'text-left'}`}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2A4012] px-7 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[rgba(42,64,18,0.92)] hover:shadow-xl"
            >
              {isArabic ? 'تواصل معنا الآن' : 'Contact Us Now'}
            </a>
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-md flex-1 items-center justify-center lg:mx-0 lg:flex">
          <div className="relative aspect-square w-full overflow-hidden rounded-[3rem] bg-[linear-gradient(145deg,#1f3413_0%,#243f15_48%,#16250f_100%)] p-10 shadow-2xl md:p-12">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-bl-full bg-white/5" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-tr-full bg-[rgba(30,145,120,0.16)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(42,64,18,0.2)]" />

            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 md:p-10">
                <Image src="/logo_3.svg" alt={dictionary.common?.brandName ?? 'Brand'} width={300} height={150} sizes="(max-width: 1024px) 240px, 300px" className="h-auto w-full max-w-[260px] object-contain md:max-w-[300px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
