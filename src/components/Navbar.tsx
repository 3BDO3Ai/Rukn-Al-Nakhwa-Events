'use client';
import React, { useState, useEffect } from 'react';
import { useContent } from '@/content/useContent';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { dictionary, dir, toggleLocale } = useContent();
  const isArabic = dir === 'rtl';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: { label: string; href: string }[] = dictionary.navbar.links;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 pt-4" dir={dir}>
        <div
          className={`flex justify-between items-center rounded-[18px] px-4 sm:px-6 py-3.5 transition-all duration-300 ${
            scrolled
              ? 'bg-[#0D1118]/95 backdrop-blur-xl border border-gold/40 shadow-[0_20px_45px_rgba(0,0,0,0.35)]'
              : 'bg-[#0B0F16]/65 backdrop-blur-lg border border-white/10'
          }`}
        >
          <a href="#hero" className="flex items-center group cursor-pointer shrink-0">
            <div className="flex flex-col">
              <span className="text-[1.05rem] sm:text-xl font-extrabold text-white tracking-[0.04em] leading-tight">
                {dictionary.common.brandName}
              </span>
              <span className="text-[10px] sm:text-xs text-gold/90 uppercase tracking-[0.28em]">
                {dictionary.common.brandSubtext ?? 'Growth Marketing'}
              </span>
            </div>
          </a>

          <div
            className={`hidden lg:flex items-center gap-1 xl:gap-2 rounded-full px-2 py-2 transition-all duration-300 ${
              scrolled ? 'bg-white/5' : 'bg-black/15'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 rounded-full font-semibold text-sm text-white/90 hover:text-white hover:bg-white/6 transition-all after:absolute after:bottom-[6px] after:left-4 after:w-0 after:h-px after:bg-gold after:transition-all hover:after:w-[calc(100%-2rem)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#apply"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full font-bold text-sm bg-gold text-[#121212] hover:bg-[#ddb987] transition-all"
            >
              {dictionary.common.ctaApply}
            </a>

          <button
            type="button"
            onClick={toggleLocale}
            className="hidden sm:flex items-center px-3.5 py-2 rounded-full font-bold text-xs border border-gold/40 text-gold hover:bg-gold/10 transition-all"
          >
            {dictionary.common.languageButton}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
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

      {menuOpen && (
        <div className="lg:hidden max-w-[1290px] mx-auto px-4 sm:px-6 mt-3" dir={dir}>
          <div className="bg-[#10151F] border border-gold/30 rounded-[18px] px-6 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/85 font-semibold hover:text-gold transition-all py-2 border-b border-white/10"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#apply"
              className="flex items-center justify-center bg-gold text-[#101010] px-5 py-3 rounded-full font-bold mt-2"
            >
              {dictionary.common.ctaApply}
            </a>
            <button
              type="button"
              onClick={toggleLocale}
              className="w-full border border-gold/35 text-gold rounded-full px-5 py-3 font-bold"
            >
              {dictionary.common.languageButton}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
