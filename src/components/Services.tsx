'use client';

import { useContent } from '@/content/useContent';
import { buildWhatsAppHref } from '@/lib/contact';

interface PackageItem {
  title: string;
  price: string;
  previous_price?: string;
  featured?: boolean;
  items: string[];
  whatsappMessage?: string;
}

export default function Services() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const services = dictionary.services;
  const packages: PackageItem[] = Array.isArray(services?.packages) ? services.packages : [];

  return (
    <section id="packages" className="section-luxe-dark py-16 md:py-20 text-[#f2e8d2]">
      <div className="section-shell" dir={dir}>
        <div className={isArabic ? 'mb-12 text-right' : 'mb-12 text-left'}>
          <p className="section-badge-dark">{services?.badge}</p>
          <h2 className="section-title-balance section-heading-dark">{services?.title}</h2>
          <p className="section-subtext-dark">
            {services?.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.title}
              className={
                pkg.featured
                  ? 'reveal-card relative overflow-hidden rounded-3xl border border-[var(--elite-primary)]/45 bg-[linear-gradient(140deg,#2c2317_0%,#1f2f10_100%)] p-7 pt-16 text-white shadow-[0_24px_50px_rgba(0,0,0,0.35)] md:col-span-2 md:pt-7 lg:col-span-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
                  : 'surface-card-dark reveal-card p-7 text-[#f4e6ca] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
              }
            >
              {pkg.featured && (
                <span className="absolute left-5 top-5 rounded-full bg-[var(--elite-primary)] px-3 py-1 text-xs font-bold text-[var(--elite-dark)]">
                  {services?.featuredBadge}
                </span>
              )}

              <div className={isArabic ? 'text-right' : 'text-left'}>
                <h3 className={pkg.featured ? 'text-2xl font-extrabold' : 'text-2xl font-extrabold text-[#f8f0de]'}>
                  {pkg.title}
                </h3>
                <p className={pkg.featured ? 'mt-2 text-4xl font-black text-[var(--elite-primary)]' : 'mt-2 text-4xl font-black text-[#8dd4ab]'}>
                  {pkg.price}
                  <span className="mx-2 text-lg font-bold">{services?.currency}</span>
                  {pkg.previous_price && (
                    <span className="mx-2 text-lg font-medium text-[#c4b699] line-through opacity-80">
                      {pkg.previous_price} {services?.currency}
                    </span>
                  )}
                </p>

                <ul className="mt-6 space-y-3 text-sm leading-7">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex w-full items-start gap-2">
                      <span
                        className={
                          pkg.featured
                            ? 'mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--elite-primary)]'
                            : 'mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[#83c49f]'
                        }
                      />
                      <span className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={buildWhatsAppHref(pkg.whatsappMessage ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    pkg.featured
                      ? 'mt-6 inline-flex rounded-xl bg-[var(--elite-primary)] px-5 py-3 text-sm font-bold text-[var(--elite-dark)] transition hover:brightness-95'
                      : 'mt-6 inline-flex rounded-xl border border-[#6cb88b] bg-[rgba(12,70,50,0.75)] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110'
                  }
                >
                  {services?.buttonLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
