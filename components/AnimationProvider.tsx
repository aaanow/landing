'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { ModalProvider, useModal } from './ModalContext';
import { ContactModalProvider, useContactModal } from './ContactModalContext';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface LenisContextValue {
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void;
}

const LenisContext = createContext<LenisContextValue | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

function LenisModalBridge({ children }: { children: React.ReactNode }) {
  const { isOpen } = useModal();
  const { isOpen: isContactOpen } = useContactModal();
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen || isContactOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, isContactOpen, lenis]);

  return <>{children}</>;
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean }) => {
    lenisRef.current?.scrollTo(target, options);
  }, []);

  // Initialize Lenis once
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoResize: false,
    });

    lenisRef.current = lenis;

    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Watch for content size changes so Lenis always has correct scroll limits
    const wrapper = document.querySelector('.page__wrapper');
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 100);
    });
    if (wrapper) ro.observe(wrapper);

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <LenisContext.Provider value={{ stop, start, scrollTo }}>
      <ModalProvider>
        <ContactModalProvider>
          <LenisModalBridge>
            {children}
          </LenisModalBridge>
        </ContactModalProvider>
      </ModalProvider>
    </LenisContext.Provider>
  );
}
