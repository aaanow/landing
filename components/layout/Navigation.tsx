'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, ArrowIcon } from '@/components/icons';
import { useLenis } from '@/components/AnimationProvider';

interface NavigationProps {
  variant?: 'light' | 'dark';
}

const NAV_LINKS = [
  { href: '/articles', label: 'Articles' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about/lifecycle-alignment', label: 'Client Lifecycle' },
] as const;

export function Navigation({ variant = 'light' }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lenis = useLenis();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Handle scroll behavior and Lenis control
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isMenuOpen && Math.abs(currentScrollY - lastScrollY) > 10) {
        closeMenu();
      }

      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Use Lenis stop/start instead of overflow:hidden to prevent scroll lock issues
    if (isMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis?.start();
    };
  }, [lastScrollY, isMenuOpen, closeMenu, lenis]);

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
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="nav__link" onClick={closeMenu}>
              {label}
            </Link>
          ))}
          <div className="nav__link-copy">
            <a
              data-modal-open="get-started"
              href="#"
              className="super-btn small w-inline-block"
              onClick={closeMenu}
            >
              <span>Get Started</span>
              <ArrowIcon className="icon-16" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
