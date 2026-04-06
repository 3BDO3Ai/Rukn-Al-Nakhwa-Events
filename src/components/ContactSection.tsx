'use client';

import { ArrowTopRightOnSquareIcon, ClockIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useContent } from '@/content/useContent';
import { CONTACT_NUMBER_DISPLAY, PHONE_HREF, buildWhatsAppHref } from '@/lib/contact';

interface ContactCard {
  title: string;
  value: string;
  link?: string;
}

interface ContactButton {
  label: string;
  type: 'whatsapp' | 'map' | 'tel';
  whatsappMessage?: string;
  href?: string;
}

export default function ContactSection() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const section = dictionary.contact;
  const locationUrl = 'https://maps.app.goo.gl/prhk6UhjMMj6jKgu7';

  const cards: ContactCard[] = Array.isArray(section?.cards) ? section.cards : [];
  const buttons: ContactButton[] = Array.isArray(section?.buttons) ? section.buttons : [];
  const mapEmbedUrl = section?.mapEmbedUrl ?? 'https://www.google.com/maps?q=Jeddah&z=12&output=embed';
  const mapTitleText = section?.mapTitle ?? (isArabic ? 'الموقع' : 'Map');

  const resolveButtonHref = (button: ContactButton) => {
    if (button.type === 'tel') {
      return PHONE_HREF;
    }
    if (button.type === 'map') {
      return locationUrl;
    }
    return buildWhatsAppHref(button.whatsappMessage ?? '');
  };

  const resolveCardHref = (card: ContactCard) => {
    if (card.link) {
      return locationUrl;
    }
    return undefined;
  };

  return (
    <section id="contact" className="section-contact-heritage w-full px-6 py-20 lg:py-28">
      <div className="section-shell" dir={dir}>
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full border border-[#cab27f] bg-[rgba(231,173,30,0.14)] px-3 py-1 text-sm font-bold tracking-widest text-[#7a5b24]">
            {section?.badge}
          </span>
          <h2 className="section-title-balance section-heading-light mx-auto max-w-4xl text-3xl lg:text-5xl">
            {isArabic ? 'تجدنا هنا' : section?.title}
          </h2>
          <div className="mx-auto mt-3 mb-5 h-1 w-16 rounded-full bg-[var(--elite-primary)]" />
          <p className="section-subtext-light mx-auto text-center">{section?.description}</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="surface-card overflow-hidden min-h-[380px]">
            <iframe
              title={mapTitleText}
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              className="min-h-[380px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col justify-center gap-4 lg:gap-5">
            {cards.map((card, index) => {
              const Icon = index === 0 ? PhoneIcon : index === 1 ? ClockIcon : MapPinIcon;
              const href = resolveCardHref(card);

              return (
                <article key={card.title} className="flex items-start gap-4 rounded-2xl border border-[rgba(93,129,33,0.16)] bg-[rgba(244,247,239,0.72)] p-5 shadow-sm lg:gap-5 lg:p-6">
                  <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#2A4012] text-white shadow-sm lg:h-12 lg:w-12">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={isArabic ? 'text-right' : 'text-left'}>
                    <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400 lg:text-xs">{card.title}</p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[1.05rem] font-bold leading-snug text-[#2A4012] transition-colors hover:text-[var(--elite-primary)] lg:text-[1.15rem]"
                      >
                        {card.value}
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </a>
                    ) : (
                      <p className={`text-[1.05rem] font-bold leading-snug text-[#2A4012] lg:text-[1.15rem] ${index === 0 ? 'ltr inline-block' : ''}`}>
                        {card.value === '__PHONE__' ? CONTACT_NUMBER_DISPLAY : card.value}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}

            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex items-center justify-center gap-3 self-start rounded-xl bg-[#2A4012] px-7 py-3.5 text-sm font-black text-white transition-colors duration-300 hover:bg-[var(--elite-primary)] lg:px-8 lg:py-4 lg:text-base ${isArabic ? 'self-start' : 'self-start'}`}
            >
              {isArabic ? 'احصل على الاتجاهات' : 'Get Directions'}
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>

            <div className="flex flex-wrap gap-3 pt-1">
              {buttons
                .filter((button) => button.type !== 'map')
                .slice(0, 2)
                .map((button, index) => (
                  <a
                    key={`${button.label}-${index}`}
                    href={resolveButtonHref(button)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      index === 0
                        ? 'btn-primary-gold min-w-[13rem]'
                        : 'inline-flex min-w-[13rem] items-center justify-center rounded-[0.9rem] border border-[#5a8b68] bg-[rgba(18,79,59,0.85)] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(20,40,26,0.16)] transition hover:brightness-110'
                    }
                  >
                    {button.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
