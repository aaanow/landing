'use client';

import { useState, FormEvent } from 'react';

export default function GetStartedModal() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // TODO: Replace with actual form submission endpoint
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('Name'),
          email: formData.get('Email'),
          organisationType: formData.get('Organisation-Type-2'),
        }),
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div data-modal-overlay="get-started" className="getstarted__modal-overview">
      <div data-modal-dialog="get-started" className="getstarted__modal-dialog">
        <a data-modal-close="get-started" href="#" className="getstarted__modal-close-btn w-inline-block">
          <img src="/images/icon-cross.svg" loading="lazy" alt="" className="icon-16" />
        </a>
        <div className="getstarted__modal-content">
          <div className="getstarted__form-content w-form">
            <form
              id="wf-form-Signup"
              name="wf-form-Signup"
              className="signup__form"
              onSubmit={handleSubmit}
              style={{ display: status === 'success' ? 'none' : 'block' }}
            >
              <div className="signup__form-header-wrapper">
                <h2>Get Started</h2>
                <p className="body__xlarge">Set up your scorecard. Free and no credit card required</p>
              </div>
              <div className="field__wrapper">
                <input
                  className="signup__form-text-field w-input"
                  maxLength={256}
                  name="Name"
                  placeholder="Your name (First, Last)"
                  type="text"
                  id="singupName"
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
                />
              </div>
              <div className="field__wrapper">
                <input
                  className="signup__form-text-field w-input"
                  maxLength={256}
                  name="Organisation-Type-2"
                  placeholder="Organisation type"
                  type="text"
                  id="Organisation-Type-2"
                />
              </div>
              <button
                type="submit"
                className="super-btn _0-top-padding w-button"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Please wait...' : 'Start building my scorecard'}
              </button>
              <div className="signup__form-legal">
                <p className="body__small light">
                  Your data is used for purposes of building your own scorecard and communicating with
                  you about it. If you are requesting via one of our qualified partners, details are
                  provided only on the basis of scorecard preparation. Completing your details is
                  acceptance of our <span>privacy policy</span> and{' '}
                  <a href="#" className="link-2">
                    <span>terms &amp; conditions</span>
                  </a>
                  .
                </p>
              </div>
            </form>
            <div
              className="signup__form-success w-form-done"
              style={{ display: status === 'success' ? 'block' : 'none' }}
            >
              <div className="signup__form-success-content">
                <div>Thank you! Your submission has been received!</div>
              </div>
            </div>
            <div
              className="w-form-fail"
              style={{ display: status === 'error' ? 'block' : 'none' }}
            >
              <div>Oops! Something went wrong while submitting the form.</div>
            </div>
          </div>
          <div className="getstarted__modal-img-wrapper">
            <img
              sizes="(max-width: 1500px) 100vw, 1500px"
              srcSet="/images/aisc_product-01_1-p-500.avif 500w, /images/aisc_product-01_1-p-800.avif 800w, /images/aisc_product-01_1aisc_product-01.avif 1500w"
              alt=""
              loading="lazy"
              src="/images/aisc_product-01_1aisc_product-01.avif"
              className="signup__form-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
