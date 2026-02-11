import { Metadata } from 'next';
import { getPayloadClient } from '@/src/payload';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/format';
import type { Post } from '@/types/cms';

// Revalidate every 5 minutes for frequently updated content
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Articles - AAAnow',
};

export default async function ArticlesPage() {
  let posts: Post[] = [];

  try {
    const payload = await getPayloadClient();

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

    posts = postsResult.docs as Post[];
  } catch (error) {
    console.error('Articles: Failed to fetch posts:', error);
  }

  return (
    <section className="section background-cream">
      <div className="w-layout-blockcontainer container top-bottom-padding w-container">
        <div className="section-header__wrapper">
          <h1>Articles, News &amp; Stories</h1>
        </div>

        <div className="blog__wrapper">
          <div className="articles__collection-grid-wrapper w-dyn-list">
            {posts.length > 0 ? (
              <div role="list" className="articles__collection-grid w-dyn-items">
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
                        <div className="article__meta-row">
                          <p className="article__date">{formatDate(post.publishedAt)}</p>
                          <span className="article__reading-time">{formatReadingTime(calculateReadingTime(post.content))}</span>
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
