export default function Loading() {
  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="loading-skeleton" aria-busy="true" aria-label="Loading content">
          <div className="skeleton-title" />
          <div className="skeleton-text" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    </section>
  );
}
