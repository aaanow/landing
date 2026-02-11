export default function Loading() {
  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section__content-wrapper">
          <div className="loading-skeleton" aria-busy="true" aria-label="Loading content">
            <div className="section-header__wrapper">
              <div className="skeleton-title" />
              <div className="skeleton-text" />
            </div>
            <div className="card-grid animate">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
