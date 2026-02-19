import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section__content-wrapper">
          <div className="section-header__wrapper">
            <h1>Page Not Found</h1>
            <p className="body__xlarge">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          </div>
          <div className="card-grid animate">
            <Button variant="main" href="/">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
