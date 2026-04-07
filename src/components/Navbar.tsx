'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useContent } from '@/content/useContent';
import { buildWhatsAppHref } from '@/lib/contact';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#hero');
  const scrollFrameRef = useRef<number | null>(null);
  const pathname = usePathname();
  const { dictionary, dir, toggleLocale } = useContent();
  const navbar = dictionary.navbar;
  const brandName = dictionary.common?.brandName;
  const isHomePage = pathname === '/';
  const isBlogsPage = pathname.startsWith('/blogs');
  const blogLabel = dir === 'rtl' ? 'المدونة' : 'Blog';

  const resolveNavHref = (href: string) => {
    if (!href) {
      return '/';
    }

    if (href.startsWith('#')) {
      return isHomePage ? href : `/${href}`;
    }

    return href;
  };

  const isNavLinkActive = (href: string, index: number) => {
    if (href.startsWith('#')) {
      return isHomePage && (href === activeHash || (index === 0 && !activeHash));
    }

    return pathname === href;
  };

  useEffect(() => {
    const updateScrolledState = () => {
      setScrolled(window.scrollY > 14);
      scrollFrameRef.current = null;
    };

    const onScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(updateScrolledState);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setActiveHash(isHomePage ? window.location.hash || '#hero' : '');
      setMobileOpen(false);
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [isHomePage]);

  const whatsappHref = buildWhatsAppHref(navbar?.ctaMessage ?? '');

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={scrolled ? 'mx-auto max-w-7xl px-4 pt-3 md:px-6' : 'w-full'} dir={dir}>
        <div
          className={
            scrolled
              ? 'mx-auto flex items-center justify-between rounded-[1rem] border border-[#ccb06f]/65 bg-[linear-gradient(90deg,rgba(8,38,32,0.96)_0%,rgba(5,27,23,0.97)_45%,rgba(8,38,32,0.96)_100%)] px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur md:px-5'
              : isBlogsPage
                ? 'flex w-full items-center justify-between border-b border-[#ccb06f]/40 bg-[linear-gradient(90deg,rgba(8,38,32,0.96)_0%,rgba(5,27,23,0.97)_45%,rgba(8,38,32,0.96)_100%)] px-6 py-3 md:px-10'
                : 'flex w-full items-center justify-between bg-transparent px-6 py-3 md:px-10'
          }
        >
          <a href={isHomePage ? '#hero' : '/#hero'} className="group flex min-w-0 items-center gap-2 text-right md:gap-3">
            <Image
              src="/logo_2.svg"
              alt={dictionary.common?.brandShort ?? 'Logo'}
              width={40}
              height={40}
              priority
              sizes="40px"
              className="h-8 w-8 rounded-full border border-white/20 bg-white/10 p-1.5 md:h-10 md:w-10"
            />
            <span className="hidden text-xs font-black leading-tight text-white md:block lg:text-sm">
              {brandName}
              <span className="mt-0.5 block text-xs font-semibold tracking-wide text-white/80">Al-Nakhwah</span>
            </span>
            <span className="text-sm font-black text-white md:hidden">{dictionary.common?.brandShort}</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navbar?.links?.map((link: { label: string; href: string }, index: number) => (
              <a
                key={`${link.href}-${index}`}
                href={resolveNavHref(link.href)}
                className={
                  isNavLinkActive(link.href, index)
                    ? 'rounded-full bg-[var(--elite-primary)] px-4 py-1.5 text-sm font-black text-[#1a1f14] shadow-[0_4px_18px_rgba(231,173,30,0.24)]'
                    : 'rounded-full px-4 py-1.5 text-sm font-black text-white/95 transition hover:bg-white/12'
                }
              >
                {link.label}
              </a>
            ))}
            <a
              href="/blogs"
              className={
                isBlogsPage
                  ? 'rounded-full bg-[var(--elite-primary)] px-4 py-1.5 text-sm font-black text-[#1a1f14] shadow-[0_4px_18px_rgba(231,173,30,0.24)]'
                  : 'rounded-full px-4 py-1.5 text-sm font-black text-white/95 transition hover:bg-white/12'
              }
            >
              {blogLabel}
            </a>
          </nav>

          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hidden btn-primary-gold text-xs sm:inline-flex sm:text-sm">
              <span className="inline sm:hidden">احجز الآن</span>
              <span className="hidden sm:inline">{navbar?.ctaLabel}</span>
            </a>
            <button
              type="button"
              onClick={toggleLocale}
              className="rounded-full border border-[#d8c594]/65 bg-black/15 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-white/10 sm:px-3 sm:py-1.5 sm:text-[11px]"
            >
              {dictionary.common?.languageButton}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c594]/65 bg-black/20 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className={
              scrolled
                ? 'mx-auto mt-2 rounded-2xl border border-[#d8c594]/45 bg-[rgba(6,31,26,0.98)] p-3 shadow-2xl backdrop-blur md:hidden'
                : 'mx-auto max-w-7xl border-b border-[#ccb06f]/45 bg-[rgba(6,31,26,0.98)] p-3 shadow-2xl backdrop-blur md:hidden'
            }
          >
            <div className="grid gap-2">
              {navbar?.links?.map((link: { label: string; href: string }, index: number) => (
                <a
                  key={`${link.href}-${index}`}
                  href={resolveNavHref(link.href)}
                  className={
                    isNavLinkActive(link.href, index)
                      ? 'rounded-xl bg-[var(--elite-primary)] px-4 py-2 text-sm font-extrabold text-[#1a1f14]'
                      : 'rounded-xl bg-white/5 px-4 py-2 text-sm font-bold text-white'
                  }
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/blogs"
                className={
                  isBlogsPage
                    ? 'rounded-xl bg-[var(--elite-primary)] px-4 py-2 text-sm font-extrabold text-[#1a1f14]'
                    : 'rounded-xl bg-white/5 px-4 py-2 text-sm font-bold text-white'
                }
              >
                {blogLabel}
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary-gold mt-1 text-xs sm:text-sm">
                <span className="inline sm:hidden">احجز الآن</span>
                <span className="hidden sm:inline">{navbar?.ctaLabel}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
