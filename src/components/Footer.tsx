"use client";

import React from "react";
import { useContent } from "@/content/useContent";

export default function Footer() {
  const { dictionary, dir } = useContent();

  return (
    <footer className="bg-[#080B10] border-t border-white/10 py-14 px-6">
      <div className="max-w-[1290px] mx-auto" dir={dir}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-2">{dictionary.common.brandName}</h3>
            <p className="text-white/65 max-w-xl">{dictionary.footer.description}</p>
          </div>

          <nav className="flex flex-wrap gap-3">
            {dictionary.footer.quickLinks.map((link: { label: string; href: string }) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-full border border-white/14 text-white/80 hover:text-gold hover:border-gold/40 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-white/50 text-sm">{dictionary.footer.copyright}</div>
      </div>
    </footer>
  );
}
