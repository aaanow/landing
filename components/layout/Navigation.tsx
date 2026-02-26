'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, ArrowIcon } from '@/components/icons';
import { Button } from '@/components/Button';
import { useLenis } from '@/components/AnimationProvider';
import type { NavLink } from '@/types/cms';

const DEFAULT_LINKS: NavLink[] = [
  { href: '/about-aisc', label: 'About' },
  { href: '/articles', label: 'Articles' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/lifecycle-alignment', label: 'Client Lifecycle' },
];

interface NavigationClientProps {
  variant?: 'light' | 'dark';
  links?: NavLink[];
  ctaLabel?: string;
}

export function NavigationClient({ variant = 'light', links, ctaLabel = 'Get Started' }: NavigationClientProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();
  const lenis = useLenis();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      if (isMenuOpen && Math.abs(currentScrollY - prevScrollY) > 10) {
        closeMenu();
      }

      setIsVisible(currentScrollY <= prevScrollY || currentScrollY <= 100);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen, closeMenu]);

  // Lenis stop/start for menu open state
  useEffect(() => {
    if (isMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isMenuOpen, lenis]);

  // Handle click outside and escape key
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <header
      ref={navRef}
      className={`nav ${isVisible ? 'nav--visible' : ''}`}
      role="banner"
    >
      <div className={`nav__container nav__container--${variant}`}>
        <Link href="/" className="nav__logo-wrapper" onClick={closeMenu}>
          <Logo className="nav__logo-img" />
        </Link>

        <button
          className={`nav__menu-btn ${isMenuOpen ? 'nav__menu-btn--open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
        >
          <span className="nav__icon-1" />
          <span className="nav__icon-2" />
        </button>

        <nav
          id="nav-menu"
          className={`nav__menu ${isMenuOpen ? 'nav__menu--open' : ''}`}
          aria-hidden={!isMenuOpen}
        >
          {(links && links.length > 0 ? links : DEFAULT_LINKS).map(({ href, label }) => (
            <Link key={href} href={href} className="nav__link" onClick={closeMenu}>
              {label}
            </Link>
          ))}
          <div className="nav__cta">
            <Button
              variant="main"
              size="sm"
              data-cal-namespace="aisc-prove"
              data-cal-link="aaanow-ljs/aisc-prove"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              onClick={closeMenu}
              icon={<ArrowIcon className="icon-16" />}
            >
              {ctaLabel}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
