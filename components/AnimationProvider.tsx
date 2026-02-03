'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

function initWebflowTabs() {
  const tabWrappers = document.querySelectorAll('.w-tabs');

  tabWrappers.forEach((wrapper) => {
    const tabLinks = wrapper.querySelectorAll('.w-tab-link');
    const tabPanes = wrapper.querySelectorAll('.w-tab-pane');

    tabLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.getAttribute('data-w-tab');

        // Update tab link states
        tabLinks.forEach((l) => l.classList.remove('w--current'));
        link.classList.add('w--current');

        // Update tab pane states
        tabPanes.forEach((pane) => {
          if (pane.getAttribute('data-w-tab') === tabName) {
            pane.classList.add('w--tab-active');
          } else {
            pane.classList.remove('w--tab-active');
          }
        });

        // Update wrapper's data-current attribute
        wrapper.setAttribute('data-current', tabName || '');
      });
    });
  });
}

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Connect Lenis to GSAP's ticker for smooth animations
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Initialize Webflow tabs
    initWebflowTabs();

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}
