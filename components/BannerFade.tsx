'use client';

import { useEffect } from 'react';

export function BannerFade({ targetSelector }: { targetSelector: string }) {
  useEffect(() => {
    const banner = document.querySelector<HTMLElement>(targetSelector);
    const content = document.querySelector<HTMLElement>('.blog__content-wrapper');
    if (!banner || !content) return;

    let currentScale = 1;
    let currentOpacity = 1;
    let targetScale = 1;
    let targetOpacity = 1;
    let velocityScale = 0;
    let velocityOpacity = 0;
    let rafId: number;

    const stiffness = 0.08;
    const damping = 0.72;

    const onScroll = () => {
      const contentTop = content.getBoundingClientRect().top;
      const viewportH = window.innerHeight;

      // Target scale: 1→0.9 early
      const scrolled = window.scrollY;
      const scaleProgress = Math.max(0, Math.min(1, scrolled / 200));
      targetScale = 1 - scaleProgress * 0.1;

      // Target opacity: fade once content hits top of viewport
      if (contentTop >= 0) {
        targetOpacity = 1;
      } else {
        targetOpacity = Math.max(0, Math.min(1, 1 + contentTop / (viewportH * 0.5)));
      }
    };

    const animate = () => {
      // Spring physics for scale
      const forceScale = (targetScale - currentScale) * stiffness;
      velocityScale = (velocityScale + forceScale) * damping;
      currentScale += velocityScale;

      // Spring physics for opacity
      const forceOpacity = (targetOpacity - currentOpacity) * stiffness;
      velocityOpacity = (velocityOpacity + forceOpacity) * damping;
      currentOpacity += velocityOpacity;

      banner.style.transform = `scale(${currentScale})`;
      banner.style.opacity = String(Math.max(0, Math.min(1, currentOpacity)));

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      banner.style.opacity = '';
      banner.style.transform = '';
    };
  }, [targetSelector]);

  return null;
}
