'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, ArrowIcon } from '@/components/icons';

interface NavigationProps {
  variant?: 'light' | 'dark';
}

export function Navigation({ variant = 'light' }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Handle scroll - hide nav on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Close mobile menu when scrolling
      if (isMenuOpen && Math.abs(currentScrollY - lastScrollY) > 10) {
        closeMenu();
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMenuOpen, closeMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
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
          <Link href="/articles" className="nav__link" onClick={closeMenu}>
            Articles
          </Link>
          <Link href="/pricing" className="nav__link" onClick={closeMenu}>
            Pricing
          </Link>
          <Link href="/about/lifecycle-alignment" className="nav__link" onClick={closeMenu}>
            Client Lifecycle
          </Link>
          <div className="nav__link-copy">
            <button className="super-btn small" onClick={closeMenu}>
              <span>Get Started</span>
              <ArrowIcon className="icon-16" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
