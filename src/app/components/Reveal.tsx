'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from './ui/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  speed?: 'fast' | 'normal' | 'slow';
  once?: boolean;
  style?: React.CSSProperties;
}

const speedMap = {
  fast: 520,
  normal: 700,
  slow: 900,
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  speed = 'normal',
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const duration = speedMap[speed] ?? speedMap.normal;

  return (
    <div
      ref={ref}
      className={cn('reveal', isVisible && 'reveal-in', className)}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
        ['--reveal-duration' as never]: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
