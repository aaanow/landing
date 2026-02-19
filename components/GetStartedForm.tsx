'use client';

import { useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from './Button';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface GetStartedFormProps {
  onSuccess?: () => void;
}

export function GetStartedForm({ onSuccess }: GetStartedFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
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

      if (response.ok) {
        setStatus('success');
        onSuccess?.();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }, [onSuccess]);

  const isSubmitting = status === 'submitting';

  if (status === 'success') {
    return (
      <div className="modal-form__success">
        <div className="modal-form__success-content">
          <div>Thank you! Your submission has been received!</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        id="form-Signup"
        name="form-Signup"
        className="modal-form"
        onSubmit={handleSubmit}
      >
        <div className="modal-form__header">
          <h2 id="modal-title">Get Started</h2>
          <p className="body__xlarge">Set up your scorecard. Free and no credit card required</p>
        </div>

        <div className="modal-form__field">
          <input
            className="modal-form__input"
            maxLength={256}
            name="Name"
            placeholder="Your name (First, Last)"
            type="text"
            id="signupName"
            autoComplete="name"
          />
        </div>

        <div className="modal-form__field">
          <input
            className="modal-form__input"
            maxLength={256}
            name="Email"
            placeholder="Your work email"
            type="email"
            id="signupEmail"
            required
            autoComplete="email"
          />
        </div>

        <div className="modal-form__field">
          <input
            className="modal-form__input"
            maxLength={256}
            name="Organisation-Type"
            placeholder="Organisation type"
            type="text"
            id="organisationType"
          />
        </div>

        <Button
          variant="main"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : 'Start building my scorecard'}
        </Button>

        <div className="modal-form__legal">
          <p className="body__small light">
            Your data is used for purposes of building your own scorecard and communicating with
            you about it. If you are requesting via one of our qualified partners, details are
            provided only on the basis of scorecard preparation. Completing your details is
            acceptance of our <Link href="/legal/privacy-policy">privacy policy</Link> and{' '}
            <Link href="/legal/terms-and-conditions">terms &amp; conditions</Link>.
          </p>
        </div>
      </form>

      {status === 'error' && (
        <div className="modal-form__error">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
      )}
    </>
  );
}
