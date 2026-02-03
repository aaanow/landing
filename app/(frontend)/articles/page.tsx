import { Metadata } from 'next';
import { getPayloadClient } from '@/src/payload';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Articles - AAAnow',
};

interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  thumbnailImage?: string;
  excerpt?: string;
  publishedAt?: string;
  status?: 'draft' | 'published';
  category?: string;
  tag?: string;
  externalLink?: string;
}

// Format date for display
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function ArticlesPage() {
  const payload = await getPayloadClient();

  // Fetch all published posts
  const postsResult = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 100,
  });

  const posts = postsResult.docs as Post[];

  // Get unique categories for filtering
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  return (
    <section className="section background-cream">
      <div className="w-layout-blockcontainer container top-bottom-padding w-container">
        <div className="section-header__wrapper">
          <h1>Articles, News &amp; Stories</h1>
        </div>

        {/* Category color styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Category-based colour themes - using CSS variables from globals.css */
          .card-article__item[data-category="Category 1"] {
            background-color: var(--color-cat1-bg);
            color: var(--color-cat1-text);
          }
          .card-article__item[data-category="Category 1"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat1-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 1"] .card-article__btn {
            background-color: var(--color-cat1-text);
            color: var(--color-cat1-btn);
          }
          .card-article__item[data-category="Category 2"] {
            background-color: var(--color-cat2-bg);
            color: var(--color-cat2-text);
          }
          .card-article__item[data-category="Category 2"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat2-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 2"] .card-article__btn {
            background-color: var(--color-cat2-text);
            color: var(--color-cat2-bg);
          }
          .card-article__item[data-category="Category 3"] {
            background-color: var(--color-cat3-bg);
            color: var(--color-cat3-text);
          }
          .card-article__item[data-category="Category 3"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat3-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 3"] .card-article__btn {
            background-color: var(--color-cat3-text);
            color: var(--color-cat3-bg);
          }
          .card-article__item[data-category="Category 4"] {
            background-color: var(--color-cat4-bg);
            color: var(--color-cat4-text);
          }
          .card-article__item[data-category="Category 4"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat4-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 4"] .card-article__btn {
            background-color: var(--color-cat4-text);
            color: var(--color-cat4-bg);
          }
          .card-article__item[data-category="Category 5"] {
            background-color: var(--color-cat5-bg);
            color: var(--color-cat5-text);
          }
          .card-article__item[data-category="Category 5"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat5-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 5"] .card-article__btn {
            background-color: var(--color-cat5-text);
            color: var(--color-cat5-bg);
          }
          .card-article__item[data-category="Category 6"] {
            background-color: var(--color-cat6-bg);
            color: var(--color-cat6-text);
          }
          .card-article__item[data-category="Category 6"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat6-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 6"] .card-article__btn {
            background-color: var(--color-cat6-text);
            color: var(--color-cat6-bg);
          }
          .card-article__item[data-category="Category 7"] {
            background-color: var(--color-cat7-bg);
            color: var(--color-cat7-text);
          }
          .card-article__item[data-category="Category 7"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat7-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 7"] .card-article__btn {
            background-color: var(--color-cat7-text);
            color: var(--color-cat7-bg);
          }
          .card-article__item[data-category="Category 8"] {
            background-color: var(--color-cat8-bg);
            color: var(--color-cat8-text);
          }
          .card-article__item[data-category="Category 8"] .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-cat8-bg) 50%, transparent 100%);
          }
          .card-article__item[data-category="Category 8"] .card-article__btn {
            background-color: var(--color-cat8-text);
            color: var(--color-cat8-bg);
          }
          /* Default styling for unmatched categories (uses Category 1 / primary brand colors) */
          .card-article__item {
            background-color: var(--color-primary-900);
            color: var(--color-cat1-text);
          }
          .card-article__item .card-article__img-gradient {
            background: linear-gradient(180deg, var(--color-primary-900) 50%, transparent 100%);
          }
          .card-article__item .card-article__btn {
            background-color: var(--color-cat1-text);
            color: var(--color-primary-600);
          }
        `}} />

        <div className="blog__wrapper">
          <div className="articles__collection-grid-wrapper w-dyn-list">
            {posts.length > 0 ? (
              <div role="list" className="articles__collection-grid-copy w-dyn-items">
                {posts.map((post) => {
                  const postLink = post.externalLink || `/posts/${post.slug}`;
                  const backgroundImage = post.featuredImage || post.thumbnailImage || '/images/aisc_blog_bg-01.svg';

                  return (
                    <div
                      key={post.id}
                      data-category={post.category || ''}
                      data-tag={post.tag || ''}
                      role="listitem"
                      className="card-article__item w-dyn-item"
                    >
                      <img
                        loading="lazy"
                        src={backgroundImage}
                        alt=""
                        className="card-article__main-img"
                      />
                      <div className="card-article__img-gradient"></div>
                      <img
                        loading="lazy"
                        src={backgroundImage}
                        alt=""
                        className="card-article__img"
                      />
                      <div className="card-article__content">
                        <div className="div-block-95">
                          <p className="article__date">{formatDate(post.publishedAt)}</p>
                        </div>
                        <h3>{post.title}</h3>
                        {post.excerpt && <p className="article__excerpt">{post.excerpt}</p>}
                        <div className="card-article__btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 26 26" fill="none" className="card-article__btn-icon">
                            <g clipPath="url(#clip0_619_573)">
                              <path d="M14.8574 25.2571C14.8574 25.6674 14.5248 26 14.1146 26H11.8854C11.4752 26 11.1426 25.6674 11.1426 25.2571V14.8574H14.8574V25.2571ZM11.1426 14.8574H0.742857C0.332588 14.8574 0 14.5248 0 14.1146V11.8854C0 11.4752 0.332589 11.1426 0.742857 11.1426H11.1426V14.8574ZM26 14.1146C26 14.5248 25.6674 14.8574 25.2571 14.8574H14.8574V11.1426H25.2571C25.6674 11.1426 26 11.4752 26 11.8854V14.1146ZM14.8574 11.1426H11.1426V0.742857C11.1426 0.332588 11.4752 0 11.8854 0H14.1146C14.5248 0 14.8574 0.332589 14.8574 0.742857V11.1426Z" fill="currentColor"></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                      <a href={postLink} className="card__link w-inline-block"></a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-dyn-empty">
                <div>No articles found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
