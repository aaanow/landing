'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [wantsDemo, setWantsDemo] = useState(false);
  const [wantsProposal, setWantsProposal] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          organization: formData.get('organization'),
          message: formData.get('message'),
          wantsDemo,
          wantsProposal,
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const isSubmitting = status === 'submitting';

  if (status === 'success') {
    return (
      <div className="contact-form__success">
        <div className="contact-form__success-content">
          <div>Thank you! We&apos;ll be in touch shortly.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form__row">
          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="contactName">
              Name <span className="contact-form__required">*</span>
            </label>
            <input
              className="contact-form__input"
              name="name"
              id="contactName"
              placeholder="Your name"
              type="text"
              required
              autoComplete="name"
            />
          </div>
          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="contactEmail">
              Email <span className="contact-form__required">*</span>
            </label>
            <input
              className="contact-form__input"
              name="email"
              id="contactEmail"
              placeholder="you@example.com"
              type="email"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="contactOrg">
            Organization
          </label>
          <input
            className="contact-form__input"
            name="organization"
            id="contactOrg"
            placeholder="Your organization (optional)"
            type="text"
            autoComplete="organization"
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="contactMessage">
            Message <span className="contact-form__required">*</span>
          </label>
          <textarea
            className="contact-form__input contact-form__textarea"
            name="message"
            id="contactMessage"
            placeholder="Tell us about your needs, questions, or how we can help..."
            required
            rows={4}
          />
        </div>

        <div className="contact-form__checkboxes">
          <label className="contact-form__checkbox-label">
            <input
              type="checkbox"
              className="contact-form__checkbox"
              checked={wantsDemo}
              onChange={(e) => setWantsDemo(e.target.checked)}
            />
            <svg className="contact-form__checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            I&apos;d like a demo
          </label>
          <label className="contact-form__checkbox-label">
            <input
              type="checkbox"
              className="contact-form__checkbox"
              checked={wantsProposal}
              onChange={(e) => setWantsProposal(e.target.checked)}
            />
            <svg className="contact-form__checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="9" y1="10" x2="15" y2="10" />
              <line x1="9" y1="14" x2="15" y2="14" />
              <line x1="9" y1="6" x2="13" y2="6" />
            </svg>
            I&apos;d like a proposal
          </label>
        </div>

        <div className="contact-form__submit-row">
          <button
            type="submit"
            className="contact-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : "Let's Get Started > GO"}
          </button>
        </div>
      </form>

      <div className="contact-form__privacy">
        Details held and used in line with <Link href="/privacy-policy">privacy policy</Link>
      </div>

      {status === 'error' && (
        <div className="contact-form__error">
          Oops! Something went wrong. Please try again.
        </div>
      )}
    </>
  );
}
