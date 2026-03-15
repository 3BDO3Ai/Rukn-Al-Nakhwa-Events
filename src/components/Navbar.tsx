'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PHONE_HREF } from '@/lib/contact';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'من نحن', href: '#about' },
    { label: 'خدماتنا', href: '#services' },
    { label: 'شركاؤنا', href: '#partners' },
    { label: 'تقييماتنا', href: '#reviews' },
    { label: 'موقعنا', href: '#location' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 pt-4" dir="rtl">
        <div
          className={`flex justify-between items-center rounded-[24px] px-4 sm:px-6 py-3 transition-all duration-300 ${
            scrolled
              ? 'bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] border border-slate-200/70'
              : 'bg-transparent border border-white/10'
          }`}
        >
        {/* Logo */}
        <a href="#hero" className="flex items-center group cursor-pointer shrink-0">
          <div className="relative h-10 w-[125px] sm:h-12 sm:w-[160px] transition-all duration-300">
            <Image
              src={scrolled ? '/Logo_2.svg' : '/Logo.svg'}
              alt="شعار مكتب المهمات الاحترافية للخدمات الالكترونية"
              fill
              priority
              className="object-contain object-right transition-all duration-300"
            />
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div
          className={`hidden lg:flex items-center gap-2 xl:gap-3 rounded-full px-3 py-2 transition-all duration-300 ${
            scrolled ? 'bg-slate-50 text-slate-700' : 'bg-white/8 backdrop-blur-md text-white'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative px-4 py-2 rounded-full font-semibold transition-all ${
                scrolled
                  ? 'hover:bg-white hover:text-darkGreen'
                  : 'hover:bg-white/12 hover:text-white'
              } after:absolute after:bottom-[6px] after:right-4 after:w-0 after:h-0.5 after:bg-gold after:transition-all hover:after:w-[calc(100%-2rem)]`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all text-sm ${
              scrolled
                ? 'bg-darkGreen hover:bg-darkGreen/90 text-white shadow-md hover:shadow-lg'
                : 'bg-white text-darkGreen hover:bg-gold hover:text-white shadow-[0_14px_35px_rgba(255,255,255,0.15)]'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            اتصل بنا
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2.5 rounded-full transition-colors ${
              scrolled
                ? 'text-darkGreen hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden max-w-[1290px] mx-auto px-4 sm:px-6 mt-3" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-[24px] px-6 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-semibold hover:text-darkGreen hover:pr-2 transition-all py-2 border-b border-gray-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href={PHONE_HREF}
              className="flex items-center justify-center gap-2 bg-darkGreen text-white px-5 py-3 rounded-full font-bold mt-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              اتصل بنا
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
