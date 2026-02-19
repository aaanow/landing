'use client';

import { Button } from '@/components/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section__content-wrapper">
          <div className="section-header__wrapper">
            <h1>Something went wrong</h1>
            <p className="body__xlarge">We apologize for the inconvenience. Please try again.</p>
          </div>
          <div className="card-grid animate">
            <Button variant="main" onClick={reset}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
