import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <section className="section sticky not-found">
      <div className="container top-padding">
        <div className="section__content-wrapper not-found">
          <div className="section-header__wrapper">
            <h1>Page Not Found</h1>
            <p className="body__xlarge">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          </div>
          <Button variant="main" href="/">
            Return Home
          </Button>
        </div>
      </div>
    </section>
  );
}
