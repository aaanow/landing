'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useContactModal } from './ContactModalContext';
import { ContactForm } from './ContactForm';
import { Logo } from './icons/Logo';

export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) close();
    },
    [close],
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay contact-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-dialog contact-modal-dialog"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close modal"
          onClick={close}
        >
          <Image src="/images/icon-cross.svg" alt="" width={16} height={16} className="icon-16" />
        </button>

        {/* Header */}
        <div className="contact-modal__header">
          <div className="contact-modal__header-top">
            <Logo className="contact-modal__logo" />
            <span className="contact-modal__badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Contact
            </span>
          </div>
          <h2 id="contact-modal-title" className="contact-modal__title">Let&apos;s work together</h2>
          <p className="contact-modal__subtitle">Complete the form and our team will be in touch shortly.</p>
        </div>

        {/* Body */}
        <div className="contact-modal__body">
          {/* Left: Contact info */}
          <div className="contact-modal__info">
            <div className="contact-modal__info-block">
              <div className="contact-modal__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4l-10 8L2 4" />
                </svg>
              </div>
              <div>
                <h4 className="contact-modal__info-title">Email Us</h4>
                <p className="contact-modal__info-desc">For inquiries and support:</p>
                <p className="contact-modal__info-value">info@aaatraq.com</p>
              </div>
            </div>

            <div className="contact-modal__info-block">
              <div className="contact-modal__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="contact-modal__info-title">Support</h4>
                <p className="contact-modal__info-desc">Please visit</p>
                <p className="contact-modal__info-value">help.AAAtraq.com</p>
              </div>
            </div>

            <div className="contact-modal__info-block">
              <div className="contact-modal__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4 className="contact-modal__info-title">Address</h4>
                <p className="contact-modal__info-desc">800 Fifth Avenue</p>
                <p className="contact-modal__info-desc">Seattle, WA 98107</p>
                <p className="contact-modal__info-desc">United States</p>
              </div>
            </div>

            <div className="contact-modal__info-privacy">
              Details held and used in line with{' '}
              <Link href="/privacy-policy">privacy policy</Link>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-modal__form-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
