'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo, ArrowIcon } from '@/components/icons';

interface NavigationProps {
  variant?: 'light' | 'dark';
}

export function Navigation({ variant = 'light' }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`nav ${isVisible ? 'nav--visible' : ''}`}
      role="banner"
    >
      <div className={`nav__container nav__container--${variant}`}>
        <Link href="/" className="nav__logo-wrapper">
          <Logo className="nav__logo-img" />
        </Link>

        <button
          className="nav__menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="nav__icon-1" />
          <div className="nav__icon-2" />
        </button>

        <nav className={`nav__menu ${mobileMenuOpen ? 'nav__menu--open' : ''}`}>
          <Link href="/articles" className="nav__link">
            Articles
          </Link>
          <Link href="/pricing" className="nav__link">
            Pricing
          </Link>
          <Link href="/about/lifecycle-alignment" className="nav__link">
            Client Lifecycle
          </Link>
          <div className="nav__link-copy">
            <button className="super-btn small">
              <span>Get Started</span>
              <ArrowIcon className="icon-16" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
