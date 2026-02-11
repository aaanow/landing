'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function GetStartedModal() {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('Name'),
          email: formData.get('Email'),
          organisationType: formData.get('Organisation-Type'),
        }),
      });

      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <div data-modal-overlay="get-started" className="getstarted__modal-overview" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div data-modal-dialog="get-started" className="getstarted__modal-dialog">
        <a
          data-modal-close="get-started"
          href="#"
          className="getstarted__modal-close-btn w-inline-block"
          aria-label="Close modal"
        >
          <Image src="/images/icon-cross.svg" alt="" width={16} height={16} className="icon-16" />
        </a>

        <div className="getstarted__modal-content">
          <div className="getstarted__form-content w-form">
            {status !== 'success' && (
              <form
                id="wf-form-Signup"
                name="wf-form-Signup"
                className="signup__form"
                onSubmit={handleSubmit}
              >
                <div className="signup__form-header-wrapper">
                  <h2 id="modal-title">Get Started</h2>
                  <p className="body__xlarge">Set up your scorecard. Free and no credit card required</p>
                </div>

                <div className="field__wrapper">
                  <input
                    className="signup__form-text-field w-input"
                    maxLength={256}
                    name="Name"
                    placeholder="Your name (First, Last)"
                    type="text"
                    id="signupName"
                    autoComplete="name"
                  />
                </div>

                <div className="field__wrapper">
                  <input
                    className="signup__form-text-field w-input"
                    maxLength={256}
                    name="Email"
                    placeholder="Your work email"
                    type="email"
                    id="signupEmail"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="field__wrapper">
                  <input
                    className="signup__form-text-field w-input"
                    maxLength={256}
                    name="Organisation-Type"
                    placeholder="Organisation type"
                    type="text"
                    id="organisationType"
                  />
                </div>

                <button
                  type="submit"
                  className="super-btn margin-top-none w-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : 'Start building my scorecard'}
                </button>

                <div className="signup__form-legal">
                  <p className="body__small light">
                    Your data is used for purposes of building your own scorecard and communicating with
                    you about it. If you are requesting via one of our qualified partners, details are
                    provided only on the basis of scorecard preparation. Completing your details is
                    acceptance of our <Link href="/legal/privacy-policy">privacy policy</Link> and{' '}
                    <Link href="/legal/terms-and-conditions">terms &amp; conditions</Link>.
                  </p>
                </div>
              </form>
            )}

            {status === 'success' && (
              <div className="signup__form-success w-form-done">
                <div className="signup__form-success-content">
                  <div>Thank you! Your submission has been received!</div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="w-form-fail">
                <div>Oops! Something went wrong while submitting the form.</div>
              </div>
            )}
          </div>

          <div className="getstarted__modal-img-wrapper">
            <Image
              src="/images/aisc_product-01_1aisc_product-01.avif"
              alt="AiSC Product Preview"
              width={750}
              height={500}
              className="signup__form-img"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
