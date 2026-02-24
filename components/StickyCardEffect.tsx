'use client';

import { useEffect } from 'react';

/**
 * Renderless component — place once on the page.
 * Finds all .section.sticky elements, assigns stacking z-index,
 * and applies spring-physics scale + fade as each card is overlapped by the next.
 */
export function StickyCardEffect() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.section.sticky'));
    if (!sections.length) return;

    // Assign incremental z-index for stacking
    sections.forEach((section, i) => {
      section.style.zIndex = String(i + 1);
    });

    // Capture each section's top offset in the document (before sticky kicks in)
    const offsets = sections.map((s) => s.offsetTop);

    // Find the inner card for each section, or fall back to the section itself
    const cards = sections.map(
      (s) => s.querySelector<HTMLElement>('.section__content-wrapper, .stats-card, [data-sticky-card]') || s
    );

    // Spring state per card
    const state = sections.map(() => ({
      currentScale: 1,
      currentOpacity: 1,
      targetScale: 1,
      targetOpacity: 1,
      velocityScale: 0,
      velocityOpacity: 0,
    }));

    const stiffness = 0.15;
    const damping = 0.6;
    let rafId: number;

    const onScroll = () => {
      const scrollY = window.scrollY;

      sections.forEach((_section, i) => {
        const s = state[i];

        // How far past this section's top we've scrolled
        const pastTop = scrollY - offsets[i];

        if (pastTop <= 0) {
          // Haven't reached this section yet
          s.targetScale = 1;
          s.targetOpacity = 1;
          return;
        }

        // Use the section's own height as the range over which to scale/fade
        const sectionHeight = sections[i].offsetHeight;

        // Scale from 1→0.9 over the first half of the section's scroll
        const scaleProgress = Math.max(0, Math.min(1, pastTop / (sectionHeight * 0.5)));
        s.targetScale = 1 - scaleProgress * 0.1;

        // Fade over the second half
        const fadeProgress = Math.max(0, Math.min(1, (pastTop - sectionHeight * 0.3) / (sectionHeight * 0.4)));
        s.targetOpacity = 1 - fadeProgress;
      });
    };

    const animate = () => {
      cards.forEach((card, i) => {
        if (!card) return;
        const s = state[i];

        const forceScale = (s.targetScale - s.currentScale) * stiffness;
        s.velocityScale = (s.velocityScale + forceScale) * damping;
        s.currentScale += s.velocityScale;

        const forceOpacity = (s.targetOpacity - s.currentOpacity) * stiffness;
        s.velocityOpacity = (s.velocityOpacity + forceOpacity) * damping;
        s.currentOpacity += s.velocityOpacity;

        card.style.transform = `scale(${s.currentScale})`;
        card.style.opacity = String(Math.max(0, Math.min(1, s.currentOpacity)));
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      sections.forEach((section, i) => {
        section.style.zIndex = '';
        const card = cards[i];
        if (card) {
          card.style.opacity = '';
          card.style.transform = '';
        }
      });
    };
  }, []);

  return null;
}
