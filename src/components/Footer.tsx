'use client';

import { CONTACT_NUMBER_DISPLAY, CONTACT_NUMBER_LINK, SOCIAL_LINKS } from '@/lib/contact';
import { useContent } from '@/content/useContent';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';

export default function Footer() {
  const { dictionary, dir } = useContent();
  const isArabic = dir === 'rtl';
  const footer = dictionary.footer;

  return (
    <footer className="section-luxe-dark pt-8 text-[#f1e6ca]">
      <div className="section-shell pb-4" dir={dir}>
        <div className="grid gap-6 border-b border-[#d7ac5f]/25 pb-6 md:grid-cols-3">
          <div className="text-right">
            <Image
              src="/logo_white.svg"
              alt={dictionary.common?.brandName ?? 'Rukn Al-Nakhwa Events'}
              width={90}
              height={45}
              sizes="90px"
              className="mr-0 h-auto w-full max-w-[90px]"
            />
            <p className="mt-3 text-sm leading-7 text-[#dacdb2]">
              {footer?.description}
            </p>
          </div>

          <div className="text-right">
            <h4 className="text-base font-extrabold text-[var(--elite-primary)]">{footer?.quickLinksTitle}</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#dacdb2]">
              {footer?.quickLinks?.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-[#f0c97f]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h4 className="text-base font-extrabold text-[var(--elite-primary)]">{footer?.contactTitle}</h4>
            <a
              href={`https://wa.me/${CONTACT_NUMBER_LINK}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-[#dacdb2] transition hover:text-[#f0c97f]"
            >
              {footer?.phoneLabel}: <span className="ltr">{CONTACT_NUMBER_DISPLAY}</span>
            </a>

            <p className="mt-3 text-sm text-[#cdbf9f]">{dictionary.common?.socialFollow}</p>
            <div className={`mt-3 flex items-center gap-3 ${isArabic ? 'justify-start' : 'justify-end'}`}>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg border border-[#d8ad60]/35 bg-[rgba(255,255,255,0.1)] p-2.5 text-base text-[#f1ddaf] transition hover:bg-[var(--elite-secondary)] hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="rounded-lg border border-[#d8ad60]/35 bg-[rgba(255,255,255,0.1)] p-2.5 text-base text-[#f1ddaf] transition hover:bg-[var(--elite-secondary)] hover:text-white"
              >
                <FaXTwitter />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="rounded-lg border border-[#d8ad60]/35 bg-[rgba(255,255,255,0.1)] p-2.5 text-base text-[#f1ddaf] transition hover:bg-[var(--elite-secondary)] hover:text-white"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        <div className="py-3 text-center text-sm text-[#c8b894]">
          {footer?.copyright}
        </div>
      </div>
    </footer>
  );
}
