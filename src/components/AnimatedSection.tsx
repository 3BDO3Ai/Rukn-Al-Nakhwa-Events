'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

export default function AnimatedSection({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px 0px' },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: `${Math.max(delay, 0) * 1000}ms` }}
    >
      {children}
    </div>
  );
}