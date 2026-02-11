'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface LenisContextValue {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextValue | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

function initWebflowTabs() {
  document.querySelectorAll('.w-tabs').forEach(wrapper => {
    const tabLinks = wrapper.querySelectorAll('.w-tab-link');
    const tabPanes = wrapper.querySelectorAll('.w-tab-pane');

    tabLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const tabName = link.getAttribute('data-w-tab');

        tabLinks.forEach(l => l.classList.remove('w--current'));
        link.classList.add('w--current');

        tabPanes.forEach(pane => {
          pane.classList.toggle('w--tab-active', pane.getAttribute('data-w-tab') === tabName);
        });

        wrapper.setAttribute('data-current', tabName || '');
      });
    });
  });
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    initWebflowTabs();

    // Listen for modal open/close events to control Lenis
    const handleModalOpen = () => {
      lenis.stop();
    };

    const handleModalClose = () => {
      lenis.start();
    };

    // Use MutationObserver to detect modal visibility changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('getstarted__modal-overview')) {
            const isVisible = target.style.display !== 'none' && target.style.opacity !== '0';
            if (isVisible) {
              handleModalOpen();
            } else {
              handleModalClose();
            }
          }
        }
      });
    });

    // Observe modal overlay for style changes
    const modalOverlay = document.querySelector('[data-modal-overlay]');
    if (modalOverlay) {
      observer.observe(modalOverlay, { attributes: true, attributeFilter: ['style'] });
    }

    // Also listen for custom events that external scripts might dispatch
    document.addEventListener('lenis:stop', handleModalOpen);
    document.addEventListener('lenis:start', handleModalClose);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      observer.disconnect();
      document.removeEventListener('lenis:stop', handleModalOpen);
      document.removeEventListener('lenis:start', handleModalClose);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
